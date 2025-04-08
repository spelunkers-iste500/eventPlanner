// This file defines a React functional component named `FlightSearch` which is used to display and manage the flight search form for an event.

// The component imports several hooks and components from various libraries to manage state, handle content, and render different parts of the flight search form UI.

// The `useState` hook from React is used to manage local state in the component.
// The `useBooking` hook from a custom `BookingProvider` is used to manage the booking data for the event.
// The `useSession` hook from `next-auth/react` is used to get the current user session data.

// The component imports several utility functions and types from other modules, such as `axios` for making HTTP requests and `DatePicker` for date selection.

// The `SelectOption` interface defines the shape of the options used in the select dropdowns for origin and destination airports.

// The `FlightSearch` component maintains several pieces of state using React's `useState` hook:
// - `formData`: an object that stores the form data, including trip type, origin, destination, departure date, return date, and input values for origin and destination.
// - `startDate` and `endDate`: state variables to manage the selected dates for the date picker.

// The `handleSubmit` function is defined to handle the form submission event. It prevents the default form submission behavior and updates the booking data with the form data, then sets the content to the `FlightResults` component.

// The `debounceTimeout` ref is used to debounce the input for fetching airport options.

// The `fetchAirports` function is an asynchronous function that sends a GET request to the `/places/search/{input}` endpoint with the input value to fetch airport options.
// If the request is successful, the airport options are formatted and passed to the callback function. If the request fails, an error is logged to the console.

// The `loadOptions` function is defined to debounce the input and call the `fetchAirports` function to load airport options for the select dropdowns.

// The `formatDateSubmit` function is defined to format a date object into a string in the `YYYY-MM-DD` format.

// The `FlightSearch` component returns a JSX structure that represents the flight search form. This structure includes:
// - A select dropdown for trip type (round-trip or one-way).
// - Two async select dropdowns for origin and destination airports, which fetch options based on user input.
// - A date picker for selecting departure and return dates (if round-trip) or only departure date (if one-way).
// - A submit button to search for flights, which calls the `handleSubmit` function when clicked.

// The component uses CSS modules for styling, with classes imported from `EventForm.module.css`.

// Finally, the `FlightSearch` component is exported as the default export of the module.

import React, { useEffect, useRef, useState } from "react";
import { useBooking } from "Utils/BookingProvider";
import { AsyncSelect, Select } from "chakra-react-select";
import FlightResults from "./FlightResults";
import styles from "./EventForm.module.css";
import axios from "axios";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { Calendar } from "lucide-react";
import { useSession } from "next-auth/react";
import { formatDateSubmit } from "Types/events";

interface SelectOption {
    label: string;
    value: string;
}

const FlightSearch: React.FC = () => {
    const { bookingData, setBookingData } = useBooking();
    const { data: session } = useSession();
    const [error, setError] = useState<string>("");

    if (!session) return null;
    const [formData, setFormData] = useState({
        trip: "round-trip",
        origin: "",
        destination: "",
        departDate: "",
        returnDate: "",
        originInput: "",
        destinationInput: "",
    });

    const [startDate, setStartDate] = useState<Date | null>(null);
    const [endDate, setEndDate] = useState<Date | null>(null);

    useEffect(() => {
        if (bookingData) {
            setFormData({
                trip: bookingData.trip || "round-trip",
                origin: bookingData.originAirport || "",
                destination: bookingData.destinationAirport || "",
                departDate: bookingData.departDate || "",
                returnDate: bookingData.returnDate || "",
                originInput: "",
                destinationInput: "",
            });

            if (bookingData.departDate) {
                setStartDate(new Date(bookingData.departDate));
            }
            if (bookingData.returnDate) {
                setEndDate(new Date(bookingData.returnDate));
            }
        }
    }, [bookingData]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        // check each formdata if it has empty fields
        if (!formData.origin) {
            setError("Origin is required");
            return;
        }

        if (!formData.destination) {
            setError("Destination is required");
            return;
        }

        if (!formData.departDate) {
            setError("Departure date is required");
            return;
        }

        if (formData.trip === "round-trip" && !formData.returnDate) {
            setError("Return date is required for round trip");
            return;
        }

        setError("");
        fetchFlightOffers();
    };

    const fetchFlightOffers = async () => {
        axios
            .post(
                `/flight_offers`,
                {
                    origin: formData.origin,
                    destination: formData.destination,
                    departureDate: formData.departDate,
                    returnDate:
                        formData.trip === "round-trip"
                            ? formData.returnDate
                            : null,
                    maxConnections: 1,
                },
                {
                    headers: {
                        "Content-Type": "application/ld+json",
                        accept: "application/ld+json",
                        Authorization: `Bearer ${session.apiToken}`,
                    },
                }
            )
            .then((response) => {
                setBookingData({
                    ...bookingData,
                    trip: formData.trip,
                    originAirport: formData.origin,
                    destinationAirport: formData.destination,
                    departDate: formData.departDate,
                    returnDate: formData.returnDate,
                    maxConnections: 1,
                    flightOffers: response.data.flightOffers,
                    content: <FlightResults />,
                });
            })
            .catch((error) => {
                console.error("Error fetching flight offers:", error);
            });
    };

    const debounceTimeout = useRef<NodeJS.Timeout | null>(null);

    const fetchAirports = async (
        input: string,
        callback: (options: SelectOption[]) => void
    ) => {
        try {
            const response = await axios.get(`/places/search/${input}`, {
                headers: { Authorization: `Bearer ${session.apiToken}` },
            });
            const airports = response.data["hydra:member"].map(
                (airport: any) => ({
                    label: `${airport.name} (${airport.iataCode})`,
                    value: airport.iataCode,
                })
            );
            callback(airports);
        } catch (error) {
            console.error("Error fetching airports:", error);
            callback([]);
        }
    };

    const loadOptions = (
        inputValue: string,
        callback: (options: SelectOption[]) => void
    ) => {
        if (debounceTimeout.current) {
            clearTimeout(debounceTimeout.current);
        }

        debounceTimeout.current = setTimeout(() => {
            if (inputValue.length >= 2) {
                fetchAirports(inputValue, callback);
            } else {
                callback([]);
            }
        }, 120);
    };

    return (
        <form className={styles.flightSearchForm} onSubmit={handleSubmit}>
            {error && <div className="error-msg">{error}</div>}
            <div className="input-container">
                <label className="input-label">Trip Type</label>
                <Select
                    options={[
                        { label: "Round Trip", value: "round-trip" },
                        { label: "One Way", value: "one-way" },
                    ]}
                    placeholder="Trip Type"
                    size="md"
                    isSearchable={false}
                    value={{
                        label:
                            formData.trip === "round-trip"
                                ? "Round Trip"
                                : "One Way",
                        value: formData.trip,
                    }}
                    className={`select-menu ${styles.tripType}`}
                    classNamePrefix={"select"}
                    onChange={(option) =>
                        setFormData({
                            ...formData,
                            trip: option?.value || "round-trip",
                        })
                    }
                />
            </div>

            <div className={styles.originDestination}>
                <div className="input-container">
                    <label className="input-label">Origin</label>
                    <AsyncSelect
                        loadOptions={loadOptions}
                        noOptionsMessage={() =>
                            formData.originInput.length < 3
                                ? "Start typing to search"
                                : "No airports found"
                        }
                        placeholder="Where from?"
                        size="md"
                        className={`select-menu`}
                        classNamePrefix={"select"}
                        onChange={(value: any) =>
                            setFormData({
                                ...formData,
                                origin: value?.value || "",
                            })
                        }
                        onInputChange={(inputValue) =>
                            setFormData({
                                ...formData,
                                originInput: inputValue,
                            })
                        }
                        value={
                            formData.origin
                                ? {
                                      label: formData.origin,
                                      value: formData.origin,
                                  }
                                : null
                        }
                    />
                </div>

                <div className="input-container">
                    <label className="input-label">Destination</label>
                    <AsyncSelect
                        loadOptions={loadOptions}
                        noOptionsMessage={() =>
                            formData.originInput.length < 3
                                ? "Start typing to search"
                                : "No airports found"
                        }
                        placeholder="Where to?"
                        size="md"
                        className={`select-menu needsclick`}
                        classNamePrefix={"select"}
                        onChange={(value: any) =>
                            setFormData({
                                ...formData,
                                destination: value?.value || "",
                            })
                        }
                        onInputChange={(inputValue) =>
                            setFormData({
                                ...formData,
                                destinationInput: inputValue,
                            })
                        }
                        value={
                            formData.destination
                                ? {
                                      label: formData.destination,
                                      value: formData.destination,
                                  }
                                : null
                        }
                    />
                </div>
            </div>

            <div className="input-container">
                <label className="input-label">
                    {formData.trip === "round-trip"
                        ? "Departure - Return Dates"
                        : "Departure Date"}
                </label>
                {formData.trip === "round-trip" ? (
                    // round trip date picker
                    <DatePicker
                        selected={startDate}
                        startDate={startDate}
                        endDate={endDate}
                        minDate={new Date()}
                        onChange={(dates) => {
                            const [start, end] = dates;
                            setStartDate(start);
                            setEndDate(end);
                            setFormData({
                                ...formData,
                                departDate: formatDateSubmit(start),
                                returnDate: formatDateSubmit(end),
                            });
                        }}
                        selectsRange
                        showMonthDropdown
                        placeholderText="Select date range"
                        dateFormat="MM/dd/yyyy"
                        className="input-field"
                        showIcon
                        icon={<Calendar size={32} />}
                    />
                ) : (
                    // one way date picker
                    <DatePicker
                        selected={startDate}
                        startDate={startDate}
                        minDate={new Date()}
                        onChange={(date) => {
                            setStartDate(date);
                            setFormData({
                                ...formData,
                                departDate: formatDateSubmit(date),
                            });
                        }}
                        showMonthDropdown
                        placeholderText="Select a date"
                        dateFormat="MM/dd/yyyy"
                        className="input-field"
                        showIcon
                        icon={<Calendar size={32} />}
                    />
                )}
            </div>

            <button type="submit">Search</button>
        </form>
    );
};

export default FlightSearch;
