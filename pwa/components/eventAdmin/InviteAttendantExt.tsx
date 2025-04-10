import React, { useState, ChangeEvent, useEffect } from "react";
import axios from "axios";
import styles from "../common/Dialog.module.css";
import {
    Box,
    Button,
    Flex,
    Input,
    CloseButton,
    InputGroup,
    DialogBody,
    DialogHeader,
    DialogTitle,
} from "@chakra-ui/react";
import { X } from "lucide-react";
import { useSession } from "next-auth/react";
import { LuFileUp } from "react-icons/lu";
import { FileUpload } from "@chakra-ui/react";
import { useContent } from "Utils/ContentProvider";
import Dashboard from "./EventAdminDashboard";
import { Event } from "Types/event";
import { toaster } from "Components/ui/toaster";
import { setDefaultResultOrder } from "dns";
import { set } from "date-fns";
import { UserEvent } from "Types/userEvent";
import ItemList from "Components/itemList/ItemList";
import BaseDialog from "Components/common/BaseDialog";
import RemoveUser from "./RemoveUser";

interface InviteAttendantExtProps {
    createdEvent: Event | null;
    isEditing?: boolean;
}

const InviteAttendantExt: React.FC<InviteAttendantExtProps> = ({
    createdEvent,
    isEditing = false,
}) => {
    const [emailInput, setEmailInput] = useState("");
    const [error, setError] = useState("");
    const [emails, setEmails] = useState<string[]>([]);
    const [deletedEmails, setDeletedEmails] = useState<string[]>([]);
    const [isConfirmOpen, setIsConfirmOpen] = useState(false);
    const [selectedUserEvent, setSelectedUserEvent] =
        useState<UserEvent | null>(null);
    const { data: session } = useSession();
    const { setContent } = useContent();

    const validateEmail = (email: string) => {
        const re = /\S+@\S+\.\S+/;
        return re.test(email);
    };

    const handleAddEmail = () => {
        if (emailInput && validateEmail(emailInput)) {
            if (!emails.includes(emailInput)) {
                setEmails([emailInput, ...emails]);
            }
            setEmailInput("");
            setError("");
        } else {
            setError("Invalid email address format.");
        }
    };

    const handleDeleteEmail = (email: string) => {
        setEmails(emails.filter((e) => e !== email));
    };

    const handleCSVImport = (event: ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files && event.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (e) => {
                const text = e.target?.result;
                if (typeof text === "string") {
                    const importedEmails = parseCSVEmails(text);
                    setEmails((prev) => [
                        ...importedEmails.filter(
                            (email) => !prev.includes(email)
                        ),
                        ...prev,
                    ]);
                }
            };
            reader.readAsText(file);
        }
    };

    const parseCSVEmails = (text: string) => {
        const potentialEmails = text.split(/[\s,]+/);
        const validEmails = potentialEmails.filter(
            (email) => email && validateEmail(email)
        );
        const invalidEmails = potentialEmails.filter(
            (email) => email && !validateEmail(email)
        );
        setError(`Invalid email addresses: ${invalidEmails.join(", ")}`);
        return validEmails;
    };

    useEffect(() => {
        // if not editing, submit the invites
        console.log("Attendees loaded:", createdEvent?.attendees);
        if (createdEvent && !isEditing) {
            setEmails(
                createdEvent.attendees
                    ?.map((attendee) => attendee.email)
                    .filter((email): email is string => email !== undefined) ||
                    []
            );
            handleSubmit();
        }
    }, [createdEvent]);

    const handleSave = () => {
        // update UserEvent for person to be cancelled
        if (createdEvent && session?.apiToken) {
            deletedEmails.forEach((email) => {
                // get the UserEvent associated with the email
                const userEvent = createdEvent.attendees?.find(
                    (attendee) => attendee.email === email
                );
                if (userEvent) {
                    userEvent.status = "cancelled";
                }
            });
            createdEvent.persist(session.apiToken); // persist the change
        }
    };

    const handleSubmit = () => {
        console.info("Submitted emails:", emails);
        // send invites out to the emails
        if (createdEvent && emails.length > 0) {
            // check if all the emails are valid and send invites to valid ones and setError to ones that arent valid
            const validEmails = emails.filter((email) => validateEmail(email));
            const invalidEmails = emails.filter(
                (email) => !validateEmail(email)
            );
            if (invalidEmails.length > 0) {
                setError(
                    `Invalid email addresses: ${invalidEmails.join(", ")}`
                );
            }
            if (validEmails.length === 0) {
                setError("No valid email addresses to send invites to.");
                return;
            }
            if (session) {
                axios
                    .post(
                        `/user_invites`,
                        {
                            event: `/events/${createdEvent.id}`,
                            emails: validEmails,
                        },
                        {
                            headers: {
                                Authorization: `Bearer ${session.apiToken}`,
                                "Content-Type": "application/ld+json",
                            },
                        }
                    )
                    .then(() => {
                        toaster.create({
                            title: "Invites Sent",
                            description:
                                "Selected attendants have been invited.",
                            type: "success",
                            duration: 5000,
                        });
                    })
                    .catch((error) => {
                        console.error("Error sending invite:", error);
                    });
            }
        }
    };

    const handleConfirmOpen = (userEvent: UserEvent) => {
        setIsConfirmOpen(true);
        setSelectedUserEvent(userEvent);
    };

    const handleConfirmClose = () => {
        setIsConfirmOpen(false);
        setSelectedUserEvent(null);
    };

    return (
        <>
            <Box mt={4} p={4} borderWidth="1px" borderRadius="md">
                {/* Top buttons: CSV Import and Submit */}
                <Flex justifyContent="space-between" mb={4}>
                    <FileUpload.Root
                        className={styles.fileUpload}
                        gap="1"
                        maxWidth="300px"
                        maxFiles={1}
                    >
                        <FileUpload.HiddenInput
                            onChange={handleCSVImport}
                            accept=".csv"
                        />
                        <InputGroup startElement={<LuFileUp />}>
                            <Input asChild>
                                <FileUpload.Trigger
                                    className={styles.fileUploadTrigger}
                                    asChild
                                >
                                    <button>Upload CSV</button>
                                </FileUpload.Trigger>
                            </Input>
                        </InputGroup>
                    </FileUpload.Root>
                </Flex>

                {/* Input field and Add button for manual entry */}
                {error && <p className="error-msg">{error}</p>}
                <Flex mb={4} alignItems="end">
                    <div className={`input-container`}>
                        <label className="input-label">
                            Attendant's Email Address
                        </label>
                        <input
                            className="input-field"
                            type="text"
                            value={emailInput}
                            onChange={(e) => setEmailInput(e.target.value)}
                            placeholder="Enter email address"
                        />
                    </div>
                    <Button ml={2} onClick={handleAddEmail}>
                        Add
                    </Button>
                </Flex>

                {/* Display list of added emails with delete button */}
                <Box maxH="20vh" overflowY="auto">
                    {emails.map((email, index) => (
                        <Flex
                            key={index}
                            alignItems="center"
                            mb={2}
                            borderWidth="1px"
                            p={2}
                            borderRadius="md"
                        >
                            <Box flex="1">{email}</Box>
                            <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => handleDeleteEmail(email)}
                            >
                                <X size={16} />
                            </Button>
                        </Flex>
                    ))}
                </Box>

                <ItemList<UserEvent>
                    items={createdEvent?.attendees || []}
                    fields={[
                        {
                            key: "user.email",
                            label: "Invited Email",
                        },
                        { key: "status", label: "Invite Status" },
                    ]}
                    renderItem={(userEvent) => handleConfirmOpen(userEvent)}
                />

                {isEditing && (
                    <div
                        className={`input-container ${styles.dialogSubmitBtn}`}
                    >
                        <Button onClick={handleSubmit}>Send Invites</Button>
                    </div>
                )}
            </Box>

            <RemoveUser
                isOpen={isConfirmOpen}
                onClose={handleConfirmClose}
                userEvent={selectedUserEvent}
                createdEvent={createdEvent}
            />
        </>
    );
};

export default InviteAttendantExt;
