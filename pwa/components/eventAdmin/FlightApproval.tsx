import React, { useEffect, useState } from "react";
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
    const [flightData, setFlightData] = useState<Flight>();

    useEffect(() => {
        const fetchFlightData = async () => {
            if (!flight) return; // shouldnt occur
            if (!session?.apiToken) {
                console.error("API token is not available.");
                return;
            }
            await flight.fetch(session.apiToken).then(() => {
                setFlightData(flight);
                console.log("Flight data fetched: ", flight);
            });
        };

        fetchFlightData();
    }, [flight]);

    const handleApprove = () => {
        if (!session?.apiToken) return;
        if (!flightData) return;
        flightData.approve(session?.apiToken);
        onClose();
    };

    const handleDeny = () => {
        if (!session?.apiToken) return;
        if (!flightData) return;
        flightData.reject(session?.apiToken);
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
                        <strong>User Booking:</strong> {flightData?.user?.email}
                    </p>
                    <p>
                        <strong>Flight Cost:</strong> $
                        {(
                            (flightData?.flightCost ?? 0) / 100
                        )?.toLocaleString()}
                    </p>
                    <p>
                        <strong>Origin:</strong> {flightData?.departureLocation}
                    </p>
                    <p>
                        <strong>Departure:</strong>{" "}
                        {formatDateDisplay(flightData?.departureDateTime)} •{" "}
                        {formatTime(flightData?.departureDateTime)}
                    </p>
                    <p>
                        <strong>Destination:</strong>{" "}
                        {flightData?.arrivalLocation}
                    </p>
                    <p>
                        <strong>Arrival:</strong>{" "}
                        {formatDateDisplay(flightData?.arrivalDateTime)} •{" "}
                        {formatTime(flightData?.arrivalDateTime)}
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
