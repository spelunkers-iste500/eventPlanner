import React from "react";
import {
    DialogHeader,
    DialogBody,
    DialogTitle,
    DialogRoot,
    DialogContent,
    Portal,
} from "@chakra-ui/react";
import BaseDialog from "Components/common/BaseDialog";
import { X } from "lucide-react";
import InviteAttendantExt from "./InviteAttendantExt";
import { Flight } from "Types/flight";
import styles from "../common/Dialog.module.css";
import { formatDateDisplay, formatTime } from "Types/events";
import { useSession } from "next-auth/react";

interface FlightApprovalProps {
    flight: Flight | null;
    isOpen: boolean;
    onClose: () => void;
}

const FlightApproval: React.FC<FlightApprovalProps> = ({
    flight,
    isOpen,
    onClose,
}) => {
    const { data: session } = useSession();

    if (!flight) return null; // shouldnt occur

    const handleApprove = () => {
        if (!session?.apiToken) return;
        flight.approve(session?.apiToken);
        onClose();
    };

    const handleDeny = () => {
        if (!session?.apiToken) return;
        flight.reject(session?.apiToken);
        onClose();
    };

    return (
        <Portal>
            <BaseDialog isOpen={isOpen} onClose={onClose}>
                <DialogHeader className={styles.dialogHeader}>
                    <DialogTitle>Flight Approval</DialogTitle>
                    <button className={styles.dialogClose} onClick={onClose}>
                        <X />
                    </button>
                </DialogHeader>
                <DialogBody
                    className={`${styles.dialogBody} ${styles.formContainer}`}
                >
                    <h3 className="h4">Flight Information</h3>
                    <p>
                        <strong>User Booking:</strong> {flight.user?.firstName}{" "}
                        {flight.user?.lastName}
                    </p>
                    <p>
                        <strong>Flight Cost:</strong> ${flight.flightCost}
                    </p>
                    <p>
                        <strong>Origin:</strong> {flight.departureLocation}
                    </p>
                    <p>
                        <strong>Departure:</strong>{" "}
                        {formatDateDisplay(flight.departureDateTime)} •{" "}
                        {formatTime(flight.departureDateTime)}
                    </p>
                    <p>
                        <strong>Destination:</strong> {flight.arrivalLocation}
                    </p>
                    <p>
                        <strong>Arrival:</strong>{" "}
                        {formatDateDisplay(flight.arrivalDateTime)} •{" "}
                        {formatTime(flight.arrivalDateTime)}
                    </p>
                    <div
                        className={`input-container ${styles.dialogSubmitBtn}`}
                    >
                        <button
                            className="outline-btn red"
                            onClick={handleDeny}
                        >
                            Deny
                        </button>
                        <button onClick={handleApprove}>Approve</button>
                    </div>
                </DialogBody>
            </BaseDialog>
        </Portal>
    );
};

export default FlightApproval;
