import {
    DialogHeader,
    DialogBody,
    DialogTitle,
    Button,
    CloseButton,
    FileUpload,
    Input,
    InputGroup,
    Switch,
    Select,
    ListCollection,
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
import { LuFileUp } from "react-icons/lu";
import { toaster } from "Components/ui/toaster";
import InviteAttendantExt from "./InviteAttendantExt";
import { useUser } from "Utils/UserProvider";
import { Event, Organization } from "Types/events";
import { useContent } from "Utils/ContentProvider";
import Dashboard from "./EventAdminDashboard";

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
    const [eventTitle, setEventTitle] = useState("");
    const [location, setLocation] = useState("");
    const [startDate, setStartDate] = useState<Date | null>(null);
    const [endDate, setEndDate] = useState<Date | null>(null);
    const [eventImage, setEventImage] = useState<File | null>(null);
    const [inviteUsers, setInviteUsers] = useState(false);
    const { setContent } = useContent();
    const [selectedOrganization, setSelectedOrganization] =
        useState<Organization>();
    const organizationsList = createListCollection<Organization>({
        items: organizations,
    });
    const [createdEvent, setCreatedEvent] = useState<Event | null>(null);

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

    const createSuccess = () => {
        setContent(<Dashboard />, "Dashboard");
        toaster.create({
            title: "Event Created",
            description: "Your event has been created successfully.",
            type: "success",
            duration: 5000,
        });
        setTimeout(() => {
            onClose();
            //window.location.reload();
        }, 2000);
    };

    const handleOrganizationChange = (
        organization: React.ChangeEvent<HTMLSelectElement>
    ) => {
        console.log("Selected organization:", organization);
        // setSelectedOrganization(organization);
    };

    const handleSubmit = () => {
        if (
            eventTitle &&
            startDate &&
            endDate &&
            location &&
            selectedOrganization
        ) {
            // make api request to create event
            axios
                .post(
                    `/events`,
                    {
                        eventTitle: eventTitle,
                        startDateTime: startDate,
                        endDateTime: endDate,
                        startFlightBooking: startDate,
                        endFlightBooking: endDate,
                        location: location,
                        organization: selectedOrganization, // Use selected organization
                        inviteCode: generateRandomString(10),
                        maxAttendees: 20,
                    },
                    {
                        headers: {
                            Authorization: `Bearer ${session?.apiToken}`,
                            "Content-Type": "application/ld+json",
                            accept: "application/ld+json",
                        },
                    }
                )
                .then((response) => {
                    console.log("Event Post response:", response.data);
                    setCreatedEvent(response.data);
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

    return (
        <BaseDialog isOpen={isOpen} onClose={onClose}>
            <DialogHeader className={styles.dialogHeader}>
                <DialogTitle>Create Event</DialogTitle>
                <button className={styles.dialogClose} onClick={onClose}>
                    <X />
                </button>
            </DialogHeader>
            <DialogBody className={styles.dialogBody}>
                <div className="input-container">
                    <label className="input-label">Event Image</label>
                    <FileUpload.Root
                        className={styles.fileUpload}
                        gap="1"
                        maxWidth="300px"
                        maxFiles={1}
                    >
                        <FileUpload.HiddenInput
                            onChange={(e) =>
                                setEventImage(e.target.files?.[0] || null)
                            }
                        />
                        <InputGroup
                            startElement={<LuFileUp />}
                            endElement={
                                <FileUpload.ClearTrigger asChild>
                                    <CloseButton
                                        size="xs"
                                        className={styles.fileUploadClear}
                                    />
                                </FileUpload.ClearTrigger>
                            }
                        >
                            <Input asChild>
                                <FileUpload.Trigger
                                    className={`${styles.fileUploadTrigger} ${
                                        eventImage ? styles.hasFile : ""
                                    }`}
                                    asChild
                                >
                                    {eventImage ? (
                                        <FileUpload.FileText
                                            className={styles.fileUploadTexts}
                                        />
                                    ) : (
                                        <button>Upload File</button>
                                    )}
                                </FileUpload.Trigger>
                            </Input>
                        </InputGroup>
                    </FileUpload.Root>
                </div>
                <br></br>
                {/* Organization Selection */}
                <div className="input-container">
                    {/* <label className="input-label">Select Organization</label> */}
                    <Select.Root
                        onValueChange={
                            // (value) => console.log(value)
                            (value) => {
                                console.log("Selected value:", value);
                                const selectedOrg = organizations.find(
                                    (org) => org.name === value.items[0]
                                );
                                setSelectedOrganization(selectedOrg);
                            }
                        }
                        collection={organizationsList}
                    >
                        <Select.HiddenSelect />
                        {/* <label className="input-label">
                            Select Organization
                        </label> */}

                        <Select.Control>
                            <Select.Trigger>
                                <Select.ValueText>
                                    {selectedOrganization?.name}
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
                                    <Select.Item key={org.id} item={org.name}>
                                        {org.name}
                                    </Select.Item>
                                ))}
                            </Select.Content>
                        </Select.Positioner>
                    </Select.Root>
                </div>
                <br></br>
                {/* Event Title and Location */}
                <div className="input-container">
                    <label className="input-label">Event Title</label>
                    <input
                        type="text"
                        id="eventTitle"
                        value={eventTitle}
                        onChange={(e) => setEventTitle(e.target.value)}
                        className="input-field"
                    />
                </div>

                <div className="input-container">
                    <label className="input-label">Location</label>
                    <input
                        type="text"
                        id="location"
                        value={location}
                        onChange={(e) => setLocation(e.target.value)}
                        className="input-field"
                    />
                </div>

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
                <br></br>
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
                <br></br>
                <div className="input-container">
                    <Button onClick={handleSubmit}>Create Event</Button>
                </div>
            </DialogBody>
        </BaseDialog>
    );
};

export default CreateEventModal;
