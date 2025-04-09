import React from "react";
import { DialogHeader, DialogBody, DialogTitle } from "@chakra-ui/react";
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
                <h2>Flight Information</h2>
                <p>
                    User Booking: {flight.user?.firstName}{" "}
                    {flight.user?.lastName}
                </p>
                <p>Flight Cost: {flight.flightCost}</p>
                <p>Origin: {flight.departureLocation}</p>
                <p>
                    Departure Time:{" "}
                    {formatDateDisplay(flight.departureDateTime)} •{" "}
                    {formatTime(flight.departureDateTime)}
                </p>
                <p>Destination: {flight.arrivalLocation}</p>
                <p>
                    Arrival Time: {formatDateDisplay(flight.arrivalDateTime)} •{" "}
                    {formatTime(flight.arrivalDateTime)}
                </p>
                <div className={styles.dialogSubmitBtn}>
                    <button className="outline-btn red" onClick={handleDeny}>
                        Deny
                    </button>
                    <button onClick={handleApprove}>Approve</button>
                </div>
            </DialogBody>
        </BaseDialog>
    );
};

export default FlightApproval;
