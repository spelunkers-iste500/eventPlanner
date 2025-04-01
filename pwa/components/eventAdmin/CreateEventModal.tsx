import {
    DialogHeader,
    DialogBody,
    DialogTitle,
    Button,
    Switch,
    createListCollection,
} from "@chakra-ui/react";
import axios from "axios";
import BaseDialog from "Components/common/BaseDialog";
import { X, Calendar } from "lucide-react";
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

interface CreateEventModalProps {
    isOpen: boolean;
    onClose: () => void;
    organizations: Organization[];
}

const CreateEventModal: React.FC<CreateEventModalProps> = ({
    isOpen,
    onClose,
    organizations,
}) => {
    const { data: session } = useSession();
    const { user } = useUser();
    const { setContent } = useContent();

    const [eventTitle, setEventTitle] = useState("");
    const [location, setLocation] = useState("");
    const [startDate, setStartDate] = useState<Date | null>(null);
    const [endDate, setEndDate] = useState<Date | null>(null);
    const [eventImage, setEventImage] = useState<File | null>(null);
    const [inviteUsers, setInviteUsers] = useState(false);
    const [selectedOrganization, setSelectedOrganization] = useState<Organization | null>(null);
    const [createdEvent, setCreatedEvent] = useState<Event | null>(null);

    // State for mapped organizations
    const [organizationOptions, setOrganizationOptions] = useState<{ label: string; value: string }[]>([]);

    // Map organizations into options for the Select component
    useEffect(() => {
        if (organizations) {
            const mappedOptions = organizations.map((org) => ({
                label: org.name || "Unnamed Organization",
                value: org.id,
            }));
            setOrganizationOptions(mappedOptions);
        }
    }, [organizations]);

    const generateRandomString = (length: number) => {
        const characters =
            "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
        let result = "";
        const charactersLength = characters.length;
        for (let i = 0; i < length; i++) {
            result += characters.charAt(
                Math.floor(Math.random() * charactersLength)
            );
        }
        return result;
    };

    const handleSubmit = () => {
        if (
            eventTitle &&
            startDate &&
            endDate &&
            location &&
            selectedOrganization
        ) {
            const event = new Event();
            event.eventTitle = eventTitle;
            event.startDateTime = startDate.toISOString();
            event.endDateTime = endDate.toISOString();
            event.startFlightBooking = startDate.toISOString();
            event.endFlightBooking = endDate.toISOString();
            event.location = location;
            event.organization = selectedOrganization
            event.inviteCode = generateRandomString(10);
            event.maxAttendees = 20;
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

    useEffect(() => {
        console.log("Organizations:", organizations);
        console.log("Selected Event:", selectedOrganization);

    }, [selectedOrganization]);

    return (
        <BaseDialog isOpen={isOpen} onClose={onClose}>
            <DialogHeader className={styles.dialogHeader}>
                <DialogTitle>Create Event</DialogTitle>
                <button className={styles.dialogClose} onClick={onClose}>
                    <X />
                </button>
            </DialogHeader>
            <DialogBody className={`${styles.dialogBody} ${styles.eventDialog}`}>

                {/* Event Image */}
                <div className="input-container">
                    <label className="input-label">Event Image</label>
                    <UploadFile eventImage={eventImage} setEventImage={setEventImage} />
                </div>

                {/* Organization Selection */}
                <div className="input-container">
                    {/* <label className="input-label">Select Organization</label> */}
                    {/* <Select.Root
                        onValueChange={
                            // (value) => console.log(value)
                            // should find the organization that is selected
                            (value) => {
                                const selectedOrg = organizations.find(
                                    (org) => org.id === value.items[0].id
                                );
                                setSelectedOrganization(selectedOrg);
                            }
                        }
                        collection={organizationsList}
                    >
                        <Select.HiddenSelect />
                        

                        <Select.Control>
                            <Select.Trigger>
                                <Select.ValueText>
                                    {selectedOrganization?.name}{" "}
                                </Select.ValueText>
                            </Select.Trigger>
                            <Select.IndicatorGroup>
                                <Select.Indicator />
                                <Select.ClearTrigger />
                            </Select.IndicatorGroup>
                        </Select.Control>

                        <Select.Positioner>
                            <Select.Content>
                                {user?.eventAdminOfOrg.map((org) => (
                                    <Select.Item key={org.id} item={org}>
                                        {org.name}
                                    </Select.Item>
                                ))}
                            </Select.Content>
                        </Select.Positioner>
                    </Select.Root> */}
                    <Select
                        options={organizationOptions}
                        placeholder="Select Organization"
                        size="md"
                        isSearchable={false}
                        value={
                            selectedOrganization ? organizationOptions.find(
                                (option) => option.value === selectedOrganization?.id
                            ) : null
                        }
                        onChange={(option) => {
                            const selectedOrg = organizations.find(
                                (org) => org.id === option?.value
                            );
                            setSelectedOrganization(selectedOrg || null);
                        }}
                        className={`select-menu`}
                        classNamePrefix={'select'}
                    />
                </div>

                {/* Event Title */}
                <Input label="Event Title" onChange={(value) => setEventTitle(value)} />

                {/* Event Location */}
                <Input label="Location" onChange={(value) => setLocation(value)} />

                <div className="input-container">
                    <label className="input-label">Event Dates</label>
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
                        showTimeSelect
                        placeholderText="Select date range"
                        dateFormat="MM/dd/yyyy h:mm aa"
                        className="input-field"
                        showIcon
                        icon={<Calendar size={32} />}
                    />
                </div>
                
                {/* Switch to toggle invite section */}
                <div className="input-container">
                    <Switch.Root checked={inviteUsers}>
                        <Switch.HiddenInput
                            onChange={(e) => setInviteUsers(e.target.checked)}
                        />
                        <Switch.Control />
                        <Switch.Label>Invite users now?</Switch.Label>
                    </Switch.Root>
                </div>

                {/* Conditionally render the InviteAttendantsExt component */}
                {inviteUsers && (
                    <InviteAttendantExt createdEvent={createdEvent} />
                )}
                
                <div className="input-container">
                    <Button onClick={handleSubmit}>Create Event</Button>
                </div>
            </DialogBody>
        </BaseDialog>
    );
};

export default CreateEventModal;
