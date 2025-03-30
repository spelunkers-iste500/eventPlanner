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
                    console.log("Event Post response:", response.data);
                    createSuccess();
                })
                .catch((error) => {
                    console.error(
                        "Error occurred during event creation:",
                        error
                    );
                    toaster.create({
                        title: "An error occurred",
                        description:
                            "An error occurred while creating the event.",
                        type: "error",
                        duration: 3000,
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
