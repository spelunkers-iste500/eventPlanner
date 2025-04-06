import {
    DialogHeader,
    DialogBody,
    DialogTitle,
    Button,
    Switch,
    createListCollection,
    Tabs,
} from "@chakra-ui/react";
import axios from "axios";
import BaseDialog from "Components/common/BaseDialog";
import { X, Calendar, Info, Users, Plane } from "lucide-react";
import React, { useEffect, useState } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import styles from "../common/Dialog.module.css";
import { useSession } from "next-auth/react";
import { toaster } from "Components/ui/toaster";
import InviteAttendantExt from "./InviteAttendantExt";
import { useUser } from "Utils/UserProvider";
import { Event } from "Types/event";
import { Organization } from "Types/organization";
import { useContent } from "Utils/ContentProvider";
import Dashboard from "./EventAdminDashboard";
import FileUpload from "./UploadFile";
import Input from "Components/common/Input";
import UploadFile from "./UploadFile";
import { Select } from "chakra-react-select";
import ItemList from "Components/itemList/ItemList";
import { Flight } from "Types/flight";

interface CreateEventModalProps {
    isOpen: boolean;
    onClose: () => void;
    event: Event | null;
}

const CreateEventModal: React.FC<CreateEventModalProps> = ({ isOpen, onClose, event }) => {
    const { data: session } = useSession();

    const [eventTitle, setEventTitle] = useState("");
    const [location, setLocation] = useState("");
    const [startDate, setStartDate] = useState<Date | null>(null);
    const [endDate, setEndDate] = useState<Date | null>(null);
    const [eventImage, setEventImage] = useState<File | null>(null);
    const [maxAttendee, setMaxAttendee] = useState<number>(20);
    const [inviteUsers, setInviteUsers] = useState(false);
    const [selectedOrganization, setSelectedOrganization] = useState<Organization | null>(null);
    const [createdEvent, setCreatedEvent] = useState<Event | null>(null);
    const [multiDay, setMultiDay] = useState(false);

    const handleSubmit = () => {
        if (
            event &&
            eventTitle &&
            startDate &&
            endDate &&
            location &&
            selectedOrganization &&
            startDate <= endDate &&
            maxAttendee > 0
        ) {
            event.eventTitle = eventTitle;
            event.startDateTime = startDate.toISOString();
            event.endDateTime = endDate.toISOString();
            event.startFlightBooking = startDate.toISOString();
            event.endFlightBooking = endDate.toISOString();
            event.location = location;
            event.organization = selectedOrganization
            event.maxAttendees = maxAttendee;
            if (!session?.apiToken) {
                console.error("API token is not available.");
                return;
            }
            event.persist(session?.apiToken);
            setCreatedEvent(event);
            toaster.create({
                title: "Event Created",
                description: "Your event has been created successfully.",
                type: "success",
                duration: 5000,
            });
            console.log("Event created:", event);
        }
    };

    return (
        <BaseDialog isOpen={isOpen} onClose={onClose}>
            <DialogHeader className={styles.dialogHeader}>
                <DialogTitle>Create Event</DialogTitle>
                <button className={styles.dialogClose} onClick={onClose}>
                    <X />
                </button>
            </DialogHeader>
            <DialogBody className={`${styles.dialogBody} ${styles.eventDialog}`}>

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
                    <Tabs.Content value="info">
                        {/* Event Image */}
                        <div className="input-container">
                            <label className="input-label">Event Image</label>
                            <UploadFile eventImage={eventImage} setEventImage={setEventImage} />
                        </div>

                        {/* Event Title */}
                        <Input label="Event Title" defaultValue={event?.eventTitle} onChange={(value) => setEventTitle(value)} />

                        {/* Event Location */}
                        <Input label="Location" defaultValue={event?.location} onChange={(value) => setLocation(value)} />
                        
                        {/* Event Max Attendees */}
                        <Input label="Max Attendees" type="number" defaultValue={`${event?.maxAttendees}`} onChange={(value) => setMaxAttendee(Number(value))} />
                        
                        <div className="input-container">
                            <Button onClick={handleSubmit}>Update Event</Button>
                        </div>
                    </Tabs.Content>

                    <Tabs.Content value="attendees">
                        <InviteAttendantExt createdEvent={event} isEditing={true} />
                    </Tabs.Content>
                    
                    <Tabs.Content value="flights">
                        {/* Add flight tracking in here */}
                        <ItemList<Flight>
                            items={createdEvent?.flights || []}
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
