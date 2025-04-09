import {
    DialogHeader,
    DialogBody,
    DialogTitle,
    Button,
    Tabs,
    Switch,
} from "@chakra-ui/react";
import BaseDialog from "Components/common/BaseDialog";
import { X, Calendar, Info, Users, Plane } from "lucide-react";
import React, { useState } from "react";
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

interface CreateEventModalProps {
    isOpen: boolean;
    onClose: () => void;
    event: Event | null;
}

const CreateEventModal: React.FC<CreateEventModalProps> = ({
    isOpen,
    onClose,
    event,
}) => {
    const { data: session } = useSession();

    const [eventTitle, setEventTitle] = useState(event?.eventTitle || "");
    const [location, setLocation] = useState(event?.location || "");
    const [startDate, setStartDate] = useState<Date | null>(
        event?.startDateTime ? new Date(event.startDateTime) : null
    );
    const [endDate, setEndDate] = useState<Date | null>(
        event?.endDateTime ? new Date(event.endDateTime) : null
    );
    const [eventImage, setEventImage] = useState<File | null>(
        event?.imageBlob || null
    );
    const [maxAttendee, setMaxAttendee] = useState<number>(
        event?.maxAttendees || 1
    );
    const [multiDay, setMultiDay] = useState(
        event?.startDateTime !== event?.endDateTime
    );

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
                    title: "Event Created",
                    description: "Your event has been created successfully.",
                    type: "success",
                    duration: 5000,
                });
                console.debug("Event created:", event);
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
            <DialogBody
                className={`${styles.dialogBody} ${styles.eventDialog}`}
            >
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
                    <Tabs.Content className={styles.eventDialog} value="info">
                        {/* Event Image */}
                        <div className="input-container">
                            <label className="input-label">Event Image</label>
                            <UploadFile
                                eventImage={eventImage}
                                setEventImage={setEventImage}
                            />
                        </div>

                        {/* Event Title */}
                        <Input
                            label="Event Title"
                            defaultValue={event?.eventTitle}
                            onChange={(value) => setEventTitle(value)}
                        />

                        {/* Event Location */}
                        <Input
                            label="Location"
                            defaultValue={event?.location}
                            onChange={(value) => setLocation(value)}
                            inputMode="text"
                        />

                        {/* Event Max Attendees */}
                        <Input
                            label="Max Attendees"
                            type="number"
                            defaultValue={`${event?.maxAttendees}`}
                            onChange={(value) => setMaxAttendee(Number(value))}
                        />

                        {/* Multi-Day Event Selector */}
                        <Switch.Root checked={multiDay}>
                            <Switch.HiddenInput
                                onChange={(e) => setMultiDay(e.target.checked)}
                            />
                            <Switch.Label>Multi-Day Event?</Switch.Label>
                            <Switch.Control />
                        </Switch.Root>

                        <div className="input-container">
                            <label className="input-label">Event Dates</label>
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
                            <Button onClick={handleSubmit}>Update Event</Button>
                        </div>
                    </Tabs.Content>

                    <Tabs.Content value="attendees">
                        <InviteAttendantExt
                            createdEvent={event}
                            isEditing={true}
                        />
                    </Tabs.Content>

                    <Tabs.Content value="flights">
                        {/* Add flight tracking in here */}
                        <ItemList<Flight>
                            items={event?.flights || []}
                            fields={[
                                {
                                    key: "flightNumber",
                                    label: "Flight Number",
                                },
                                { key: "status", label: "Status" },
                            ]}
                            renderItem={() => {}} // Open the view modal on item click
                        />
                    </Tabs.Content>
                </Tabs.Root>
            </DialogBody>
        </BaseDialog>
    );
};

export default CreateEventModal;
