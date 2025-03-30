import React, { useState } from "react";
import BaseDialog from "Components/common/BaseDialog";
import {
    DialogHeader,
    DialogBody,
    DialogTitle,
    Button,
} from "@chakra-ui/react";
import { X } from "lucide-react";
import Input from "Components/common/Input";
import styles from "../common/Dialog.module.css";
import { Event } from "Types/events";
import axios from "axios";
import { useSession } from "next-auth/react";
import { toaster } from "Components/ui/toaster";
import { useContent } from "Utils/ContentProvider";
import Dashboard from "./FinancialAdminDashboard";

interface CreateBudgetModalProps {
    isOpen: boolean;
    onClose: () => void;
    events: Event[];
}

const CreateBudgetModal: React.FC<CreateBudgetModalProps> = ({
    events,
    isOpen,
    onClose,
}) => {
    const { data: session } = useSession();
    const { setContent } = useContent();
    const [csvSearchTerm, setCsvSearchTerm] = useState("");
    const [selectedExportEvent, setSelectedExportEvent] = useState<
        number | null
    >(null);
    // Filter all events based on the CSV search term
    const filteredExportEvents = events.filter((event) =>
        event.eventTitle.toLowerCase().includes(csvSearchTerm.toLowerCase())
    );

    const handleSubmit = () => {
        if (selectedExportEvent) {
            axios
                .get(`/csv/events/${selectedExportEvent}`, {
                    headers: {
                        Authorization: `Bearer ${session?.apiToken}`,
                        "Content-Type": "application/ld+json",
                        accept: "application/ld+json",
                    },
                })
                .then((response) => {
                    console.log("CSV export request response:", response.data);
                    if (response.data && typeof response.data === "object") {
                        createCsv(response.data);
                        createSuccess();
                    } else {
                        console.error(
                            "Unexpected API response format:",
                            response.data
                        );
                        toaster.create({
                            title: "Export Failed",
                            description:
                                "The API call returned an unexpected response.",
                            type: "error",
                            duration: 5000,
                        });
                    }
                })
                .catch((error) => {
                    console.error(
                        "Error occurred during CSV export data call:",
                        error
                    );
                    toaster.create({
                        title: "An error occurred",
                        description:
                            "An error occurred during CSV export data call.",
                        type: "error",
                        duration: 5000,
                    });
                });
        }
    };

    // Handle close and discard user input
    const handleClose = () => {
        onClose();
    };

    const createSuccess = () => {
        setContent(<Dashboard />, "Dashboard");
        toaster.create({
            title: "Export Successful",
            description: "Your CSV has been exported successfully.",
            type: "success",
            duration: 5000,
        });
        setTimeout(() => {
            onClose();
            //window.location.reload();
        }, 2000);
    };

    const createCsv = (data: any) => {
        if (data && typeof data === "object") {
            const { eventTitle, maxAttendees, budget, flights } = data;
            const csvRows = [];

            csvRows.push(`${eventTitle} Details:`);
            csvRows.push(
                "Event Title,Max Attendees,Per User Total,Overage,Total Budget"
            );

            const totalBudget =
                (budget?.perUserTotal || 0) * (maxAttendees || 0);

            csvRows.push(
                `"${eventTitle}","${maxAttendees}","${
                    budget?.perUserTotal || 0
                }","${budget?.overage || 0}","${totalBudget}"`
            );
            csvRows.push("");

            csvRows.push("Flights");
            const flightHeaders = ["Flight Number", "Flight Cost"];
            csvRows.push(flightHeaders.join(","));

            let totalFlightCost = 0;

            if (flights && flights.length > 0) {
                flights.forEach((flight: any) => {
                    const flightCost = flight.flightCost || 0;
                    const formattedFlightCost = (flightCost / 100).toFixed(2); // Convert to decimal format
                    totalFlightCost += flightCost; // Keep total in cents for now

                    const flightRow = [
                        `"${flight.flightNumber || ""}"`,
                        `"${formattedFlightCost}"`,
                    ];
                    csvRows.push(flightRow.join(","));
                });

                const formattedTotalFlightCost = (
                    totalFlightCost / 100
                ).toFixed(2);
                csvRows.push(`Total spent:,${formattedTotalFlightCost}`);
            } else {
                csvRows.push("No flights available,");
            }

            const csvString = csvRows.join("\n");
            const blob = new Blob([csvString], { type: "text/csv" });
            const link = document.createElement("a");
            const cleanTitle = eventTitle.replace(/[^a-zA-Z0-9]/g, "_");
            link.href = URL.createObjectURL(blob);
            link.download = `${cleanTitle}_budget_export.csv`;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
        } else {
            console.error(
                "An error occured while generating CSV file for export:",
                data
            );
            toaster.create({
                title: "Export Failed",
                description:
                    "An error occured while generating CSV file for export.",
                type: "error",
                duration: 5000,
            });
        }
    };

    return (
        <BaseDialog isOpen={isOpen} onClose={onClose}>
            <DialogHeader className={styles.dialogHeader}>
                <DialogTitle>Export CSV</DialogTitle>
                <button className={styles.dialogClose} onClick={handleClose}>
                    <X />
                </button>
            </DialogHeader>
            <DialogBody className={styles.dialogBody}>
                <div className={styles.exportCSVContainer}>
                    <h3>Export Budget CSV</h3>
                    <div className={styles.exportCsvForm}>
                        <div>
                            <Input
                                label="Search Events"
                                placeholder="Search events..."
                                onChange={(value) => {
                                    setCsvSearchTerm(value);
                                    // Clear any previous selection if the user types something new
                                    if (value.trim() === "") {
                                        setSelectedExportEvent(null);
                                    }
                                }}
                            />
                            {/* Only show search results when the search term is non-empty and no event is selected */}
                            {csvSearchTerm.trim() !== "" &&
                                !selectedExportEvent && (
                                    <div className={styles.searchResults}>
                                        {filteredExportEvents.length > 0 ? (
                                            filteredExportEvents.map(
                                                (event) => (
                                                    <div
                                                        key={event.id}
                                                        className={
                                                            styles.searchResultItem
                                                        }
                                                        onClick={() => {
                                                            setSelectedExportEvent(
                                                                event.id
                                                            );
                                                            setCsvSearchTerm(
                                                                event.eventTitle
                                                            );
                                                        }}
                                                    >
                                                        {event.eventTitle}
                                                    </div>
                                                )
                                            )
                                        ) : (
                                            <div className={styles.noResults}>
                                                No events found
                                            </div>
                                        )}
                                    </div>
                                )}
                        </div>
                        {/* Display the selected event and a clear option */}
                        {selectedExportEvent && (
                            <div className={styles.selectedEventDisplay}>
                                <span>
                                    Selected Event:{" "}
                                    {
                                        events.find(
                                            (e) => e.id === selectedExportEvent
                                        )?.eventTitle
                                    }
                                </span>
                                <button
                                    className={styles.clearButton}
                                    onClick={() => {
                                        setSelectedExportEvent(null);
                                        setCsvSearchTerm("");
                                    }}
                                >
                                    Clear
                                </button>
                            </div>
                        )}
                        <button
                            className={styles.exportButton}
                            onClick={() => {
                                handleSubmit();
                            }}
                        >
                            Export CSV
                        </button>
                    </div>
                </div>
            </DialogBody>
        </BaseDialog>
    );
};

export default CreateBudgetModal;
