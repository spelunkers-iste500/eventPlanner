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
import { Event } from "Types/event";
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
    const [selectedExportEvent, setSelectedExportEvent] =
        useState<Event | null>(null);
    // Filter all events based on the CSV search term
    const filteredExportEvents = events.filter((event) =>
        event
            .getEventTitle()
            .toLowerCase()
            .includes(csvSearchTerm.toLowerCase())
    );

    const handleSubmit = () => {
        if (selectedExportEvent) {
            try {
                createCsv(selectedExportEvent);
                createSuccess();
            } catch (error) {
                console.error(
                    "Error occurred during CSV export data call:",
                    error
                );
                toaster.create({
                    title: "An error occurred",
                    description:
                        "An error occurred during CSV export data call: " +
                        error,
                    type: "error",
                    duration: 5000,
                });
            }
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

    const createCsv = (item: Event) => {
        const csvRows = [];

        csvRows.push(
            "Event Title,Max Attendees,Per User Total,Overage,Total Budget,Flight ID,Flight Cost"
        );

        const totalBudget =
            (item.budget?.perUserTotal || 0) * (item.maxAttendees || 0);

        csvRows.push(
            `"${item.eventTitle || ""}","${item.maxAttendees || 0}","${
                item.budget?.perUserTotal || 0
            }","${item.budget?.overage || 0}","${totalBudget}","",""`
        );

        item.flights.forEach((flight) => {
            csvRows.push(
                `,,,,,"${flight.id || ""}","${(flight.flightCost || 0).toFixed(
                    2
                )}"`
            );
        });

        const csvString = csvRows.join("\n");
        const blob = new Blob([csvString], { type: "text/csv" });
        const link = document.createElement("a");
        const cleanTitle = item.eventTitle.replace(/[^a-zA-Z0-9]/g, "_");
        link.href = URL.createObjectURL(blob);
        link.download = `${cleanTitle}_budget_export.csv`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    return (
        <BaseDialog isOpen={isOpen} onClose={onClose}>
            <DialogHeader className={styles.dialogHeader}>
                <DialogTitle>Export Budget CSV</DialogTitle>
                <button className={styles.dialogClose} onClick={handleClose}>
                    <X />
                </button>
            </DialogHeader>
            <DialogBody className={styles.dialogBody}>
                <div className={styles.exportCSVContainer}>
                    <div className={styles.exportCsvForm}>
                        <div>
                            <Input
                                label="Search Events"
                                placeholder="Search events..."
                                onChange={(value) => {
                                    setCsvSearchTerm(value);
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
                                                                event
                                                            );
                                                            setCsvSearchTerm(
                                                                event.getEventTitle()
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
                                            (e) => e === selectedExportEvent
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
                        <div
                            className={`input-container ${styles.dialogSubmitBtn}`}
                        >
                            <button onClick={handleSubmit}>Export CSV</button>
                        </div>
                    </div>
                </div>
            </DialogBody>
        </BaseDialog>
    );
};

export default CreateBudgetModal;
