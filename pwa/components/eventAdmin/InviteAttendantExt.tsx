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

interface InviteAttendantExtProps {
    createdEvent: Event | null;
}

const InviteAttendantExt: React.FC<InviteAttendantExtProps> = ({
    createdEvent,
}) => {
    const [emailInput, setEmailInput] = useState("");
    const [error, setError] = useState("");
    const [emails, setEmails] = useState<string[]>([]);
    const { data: session } = useSession();
    const { setContent } = useContent();

    const validateEmail = (email: string) => {
        const re = /\S+@\S+\.\S+/;
        return re.test(email);
    };

    useEffect(() => {
        if (createdEvent) {
            // grab attendee list if event already exits
            // need a GET route for /user_invites to pass in the eventID to get list of emails back
        }
    }, [createdEvent]);

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

    const inviteSuccess = () => {
        setContent(<Dashboard />, "Dashboard");
        toaster.create({
            title: "Invites Sent",
            description: "Selected attendants have been invited.",
            type: "success",
            duration: 5000,
        });
    };

    useEffect(() => {
        console.log("Created Event:", createdEvent);
        if (createdEvent) {
            handleSubmit();
        }
    }, [createdEvent]);

    const handleSubmit = () => {
        console.log("Submitted emails:", emails);
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
                    .then((response) => {
                        console.log("Invite sent:", response.data);
                        inviteSuccess();
                    })
                    .catch((error) => {
                        console.error("Error sending invite:", error);
                    });
            }
        }
    };

    return (
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
                {/* <Button onClick={handleSubmit}>
                    Submit
                </Button> */}
            </Flex>

            {/* Input field and Add button for manual entry */}
            {error && (
                <div className="error-msg">
                    <p>{error}</p>
                </div>
            )}
            <Flex mb={4}>
                <Input
                    placeholder="Enter attendant's email address"
                    value={emailInput}
                    onChange={(e) => setEmailInput(e.target.value)}
                />
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
        </Box>
    );
};

export default InviteAttendantExt;
