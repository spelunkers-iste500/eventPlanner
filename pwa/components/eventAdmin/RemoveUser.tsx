import React, { useEffect, useState } from "react";
import {
    DialogHeader,
    DialogBody,
    DialogTitle,
    Portal,
} from "@chakra-ui/react";
import BaseDialog from "Components/common/BaseDialog";
import { X } from "lucide-react";
import styles from "../common/Dialog.module.css";
import { useSession } from "next-auth/react";
import { UserEvent } from "Types/userEvent";
import { Event } from "Types/event";
import { toaster } from "Components/ui/toaster";

interface RemoveUserProps {
    userEvent: UserEvent | null;
    createdEvent: Event | null;
    isOpen: boolean;
    onClose: () => void;
}

const RemoveUser: React.FC<RemoveUserProps> = ({
    userEvent,
    createdEvent,
    isOpen,
    onClose,
}) => {
    const { data: session } = useSession();

    const handleSubmit = () => {
        if (userEvent && createdEvent && session?.apiToken) {
            console.log("Removing user event:", userEvent);
            userEvent.status = "cancelled";
            createdEvent.persist(session.apiToken);
            toaster.create({
                title: "User Removed",
                description: "Selected user has been removed from the event.",
                type: "success",
                duration: 5000,
            });
            onClose();
        }
    };

    return (
        <Portal>
            <BaseDialog isOpen={isOpen} onClose={onClose}>
                <DialogHeader className={styles.dialogHeader}>
                    <DialogTitle>Remove User?</DialogTitle>
                    <button className={styles.dialogClose} onClick={onClose}>
                        <X />
                    </button>
                </DialogHeader>
                <DialogBody
                    className={`${styles.dialogBody} ${styles.formContainer}`}
                >
                    <p>
                        Are you sure you want to remove{" "}
                        <strong>{userEvent?.email}</strong> from the event?
                    </p>
                    <div
                        className={`input-container ${styles.dialogSubmitBtn}`}
                    >
                        <button className="outline-btn red" onClick={onClose}>
                            Cancel
                        </button>
                        <button onClick={handleSubmit}>Confirm</button>
                    </div>
                </DialogBody>
            </BaseDialog>
        </Portal>
    );
};

export default RemoveUser;
