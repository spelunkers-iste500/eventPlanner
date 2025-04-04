import React from "react";
import {
    DialogHeader,
    DialogBody,
    DialogTitle,
    Button,
    Box,
    Text,
} from "@chakra-ui/react";
import BaseDialog from "Components/common/BaseDialog";
import { X } from "lucide-react";
import { UserEvent } from "Types/userEvent";

interface ViewEventModalProps {
    isOpen: boolean;
    onClose: () => void;
    userEvent: UserEvent | null;
}

const ViewEventModal: React.FC<ViewEventModalProps> = ({
    isOpen,
    onClose,
    userEvent,
}) => {
    if (!userEvent) return null;

    return (
        <BaseDialog isOpen={isOpen} onClose={onClose}>
            <DialogHeader
                display="flex"
                alignItems="center"
                justifyContent="space-between"
            >
                <DialogTitle>Event Details</DialogTitle>
                <Button variant="ghost" onClick={onClose}>
                    <X size={16} />
                </Button>
            </DialogHeader>
            <DialogBody>
                <Box>
                    <Text fontWeight="bold">Event Title:</Text>
                    <Text mb={2}>{userEvent.getEvent().eventTitle}</Text>

                    <Text fontWeight="bold">Location:</Text>
                    <Text mb={2}>{userEvent.getEvent().location}</Text>

                    <Text fontWeight="bold">Start Date:</Text>
                    <Text mb={2}>
                        {new Date(
                            userEvent.getEvent().startDateTime as string
                        ).toLocaleString()}
                    </Text>

                    <Text fontWeight="bold">End Date:</Text>
                    <Text mb={2}>
                        {new Date(
                            userEvent.getEvent().endDateTime as string
                        ).toLocaleString()}
                    </Text>

                    <Text fontWeight="bold">Status:</Text>
                    <Text>{userEvent.status}</Text>
                </Box>
            </DialogBody>
        </BaseDialog>
    );
};

export default ViewEventModal;
