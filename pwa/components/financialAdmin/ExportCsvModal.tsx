import React, { useState } from 'react';
import BaseDialog from 'Components/common/BaseDialog';
import { DialogHeader, DialogBody, DialogTitle, Button } from '@chakra-ui/react';
import { X } from 'lucide-react';
import Input from "Components/common/Input";
import styles from '../common/Dialog.module.css';
import { Event } from 'Types/events';

interface CreateBudgetModalProps {
    isOpen: boolean;
    onClose: () => void;
    events: Event[];
}

const CreateBudgetModal: React.FC<CreateBudgetModalProps> = ({ events, isOpen, onClose }) => {

    // CSV Export Search State
    const [csvSearchTerm, setCsvSearchTerm] = useState("");
    const [selectedExportEvent, setSelectedExportEvent] = useState<number | null>(null);
    // Filter all events based on the CSV search term
    const filteredExportEvents = events.filter((event) =>
        event.eventTitle.toLowerCase().includes(csvSearchTerm.toLowerCase())
    );

    const handleSubmit = () => {

    };

    // Handle close and discard user input
    const handleClose = () => {
        onClose(); 
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
                        <div className={styles.exportCSVForm}>
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
                            {csvSearchTerm.trim() !== "" && !selectedExportEvent && (
                                <div className={styles.searchResults}>
                                    {filteredExportEvents.length > 0 ? (
                                        filteredExportEvents.map((event) => (
                                            <div
                                                key={event.id}
                                                className={styles.searchResultItem}
                                                onClick={() => {
                                                    setSelectedExportEvent(event.id);
                                                    setCsvSearchTerm(event.eventTitle);
                                                }}
                                            >
                                                {event.eventTitle}
                                            </div>
                                        ))
                                    ) : (
                                        <div className={styles.noResults}>No events found</div>
                                    )}
                                </div>
                            )}
                            {/* Display the selected event and a clear option */}
                            {selectedExportEvent && (
                                <div className={styles.selectedEventDisplay}>
                                    <span>
                                        Selected Event:{" "}
                                        {events.find((e) => e.id === selectedExportEvent)?.eventTitle}
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
                                    // Insert export logic here
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