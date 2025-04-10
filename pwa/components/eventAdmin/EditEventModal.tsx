import {
    DialogHeader,
    DialogBody,
    DialogTitle,
    Button,
    Tabs,
    Switch,
    Box,
} from "@chakra-ui/react";
import BaseDialog from "Components/common/BaseDialog";
import { X, Calendar, Info, Users, Plane } from "lucide-react";
import React, { useState, useEffect } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import styles from "../common/Dialog.module.css";
import { useSession } from "next-auth/react";
import { toaster } from "Components/ui/toaster";
import InviteAttendantExt from "./InviteAttendantExt";
import { Event } from "Types/event";
import { Organization } from "Types/organization";
import Input from "Components/common/Input";
import UploadFile from "./UploadFile";
import ItemList from "Components/itemList/ItemList";
import { Flight } from "Types/flight";
import FlightApproval from "./FlightApproval";

interface EditEventModalProps {
    isOpen: boolean;
    onClose: () => void;
    event: Event | null;
}

const EditEventModal: React.FC<EditEventModalProps> = ({
    isOpen,
    onClose,
    event,
}) => {
    const { data: session } = useSession();

    const [eventTitle, setEventTitle] = useState("");
    const [location, setLocation] = useState("");
    const [startDate, setStartDate] = useState<Date | null>(null);
    const [endDate, setEndDate] = useState<Date | null>(null);
    const [maxAttendee, setMaxAttendee] = useState<number>(1);
    const [multiDay, setMultiDay] = useState(false);

    const [selectedFlight, setSelectedFlight] = useState<Flight | null>(null);
    const [isApprovalOpen, setIsApprovalOpen] = useState(false);

    const handleApprovalOpen = (flight: Flight) => {
        setSelectedFlight(flight);
        setIsApprovalOpen(true);
    };

    const handleApprovalClose = () => {
        setIsApprovalOpen(false);
        setSelectedFlight(null);
    };

    // Update state when the `event` prop changes
    useEffect(() => {
        if (event) {
            setEventTitle(event.eventTitle || "");
            setLocation(event.location || "");
            setStartDate(
                event.startDateTime ? new Date(event.startDateTime) : null
            );
            setEndDate(event.endDateTime ? new Date(event.endDateTime) : null);
            setMaxAttendee(event.maxAttendees || 1);
            setMultiDay(event.startDateTime !== event.endDateTime);
        }
    }, [event]);

    const handleSubmit = () => {
        if (
            event &&
            eventTitle &&
            startDate &&
            endDate &&
            location &&
            startDate <= endDate &&
            maxAttendee > 0
        ) {
            event.eventTitle = eventTitle;
            event.startDateTime = startDate.toISOString();
            event.endDateTime = endDate.toISOString();
            event.startFlightBooking = startDate.toISOString();
            event.endFlightBooking = endDate.toISOString();
            event.location = location;
            event.maxAttendees = maxAttendee;
            if (!session?.apiToken) {
                console.error("API token is not available.");
                return;
            }
            event.persist(session?.apiToken).then(() => {
                toaster.create({
                    title: "Event Edited",
                    description: "Your changes have been saved.",
                    type: "success",
                    duration: 5000,
                });
            });
        }
    };

    return (
        <BaseDialog isOpen={isOpen} onClose={onClose}>
            <DialogHeader className={styles.dialogHeader}>
                <DialogTitle>Edit Event</DialogTitle>
                <button className={styles.dialogClose} onClick={onClose}>
                    <X />
                </button>
            </DialogHeader>
            <DialogBody className={`${styles.dialogBody}`}>
                <Tabs.Root defaultValue="info">
                    <Tabs.List justifyContent={"center"}>
                        <Tabs.Trigger value="info">
                            <Info />
                            Event Info
                        </Tabs.Trigger>
                        <Tabs.Trigger value="attendees">
                            <Users />
                            Attendees
                        </Tabs.Trigger>
                        <Tabs.Trigger value="flights">
                            <Plane />
                            Flights
                        </Tabs.Trigger>
                    </Tabs.List>
                    <Tabs.Content
                        className={`${styles.eventDialog} ${styles.isEditing}`}
                        value="info"
                    >
                        <Box p={4} borderWidth="1px" borderRadius="md">
                            {/* Event Title */}
                            <Input
                                label="Event Title"
                                defaultValue={eventTitle}
                                onChange={(value) => setEventTitle(value)}
                            />

                            {/* Event Location */}
                            <Input
                                label="Location"
                                defaultValue={location}
                                onChange={(value) => setLocation(value)}
                            />

                            {/* Event Max Attendees */}
                            <Input
                                label="Max Attendees"
                                type="number"
                                defaultValue={`${maxAttendee}`}
                                onChange={(value) =>
                                    setMaxAttendee(Number(value))
                                }
                            />

                            {/* Multi-Day Event Selector */}
                            <Switch.Root checked={multiDay}>
                                <Switch.HiddenInput
                                    onChange={(e) =>
                                        setMultiDay(e.target.checked)
                                    }
                                />
                                <Switch.Label>Multi-Day Event?</Switch.Label>
                                <Switch.Control />
                            </Switch.Root>

                            <div className="input-container">
                                <label className="input-label">
                                    Event Dates
                                </label>
                                {/* Conditionally render the date range picker */}
                                {multiDay ? (
                                    <DatePicker
                                        selected={startDate}
                                        startDate={startDate}
                                        endDate={endDate}
                                        minDate={new Date()}
                                        onChange={(dates) => {
                                            const [start, end] = dates;
                                            setStartDate(start);
                                            setEndDate(end);
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
                                    <DatePicker
                                        selected={startDate}
                                        startDate={startDate}
                                        minDate={new Date()}
                                        onChange={(date) => {
                                            setStartDate(date);
                                            setEndDate(date); // For single day, end date is the same as start date
                                        }}
                                        showMonthDropdown
                                        showTimeSelect
                                        placeholderText="Select a date"
                                        dateFormat="MM/dd/yyyy h:mm aa"
                                        className="input-field"
                                        showIcon
                                        icon={<Calendar size={32} />}
                                    />
                                )}
                            </div>

                            <div
                                className={`input-container ${styles.dialogSubmitBtn}`}
                            >
                                <Button onClick={handleSubmit}>
                                    Update Event
                                </Button>
                            </div>
                        </Box>
                    </Tabs.Content>

                    <Tabs.Content
                        value="attendees"
                        className={styles.isEditing}
                    >
                        <InviteAttendantExt
                            createdEvent={event}
                            isEditing={true}
                        />
                    </Tabs.Content>

                    <Tabs.Content value="flights">
                        <Box mt={4} p={4} borderWidth="1px" borderRadius="md">
                            <ItemList<Flight>
                                items={
                                    event?.attendees.map(
                                        (userEvent) => userEvent.flight
                                    ) || []
                                }
                                fields={[
                                    {
                                        key: "bookingReference",
                                        label: "Booking Reference",
                                        // valueFn: (flight) =>
                                        //     flight.id.split("-").pop(),
                                    },
                                    { key: "flightCost", label: "Flight Cost" },
                                    { key: "approvalStatus", label: "Status" },
                                ]}
                                renderItem={(flight) =>
                                    handleApprovalOpen(flight)
                                }
                            />
                            <FlightApproval
                                flight={selectedFlight}
                                isOpen={isApprovalOpen}
                                onClose={handleApprovalClose}
                            />
                        </Box>
                    </Tabs.Content>
                </Tabs.Root>
            </DialogBody>
        </BaseDialog>
    );
};

export default EditEventModal;
