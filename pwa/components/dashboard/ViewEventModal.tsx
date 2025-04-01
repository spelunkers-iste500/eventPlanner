import {
    DialogHeader,
    DialogBody,
    DialogTitle,
    Button,
    Skeleton,
} from "@chakra-ui/react";
import axios from "axios";
import BaseDialog from "Components/common/BaseDialog";
import {
    X,
    MapPin,
    Calendar,
    Clock,
    Users,
    TowerControl,
    ArrowRight,
    PlaneTakeoff,
    PlaneLanding,
    CircleDollarSign,
} from "lucide-react";
import React, { useEffect } from "react";
import { formatDateDisplay, formatTime } from "Types/events";
import { UserEvent } from "Types/userEvent";
import styles from "../common/Dialog.module.css";
import { useSession } from "next-auth/react";

interface ViewEventModalProps {
    userEvent: UserEvent | null;
    isOpen: boolean;
    onClose: () => void;
}

const ViewEventModal: React.FC<ViewEventModalProps> = ({
    userEvent,
    isOpen,
    onClose,
}) => {
    const event = userEvent?.event;

    return (
        <BaseDialog isOpen={isOpen} onClose={onClose}>
            <DialogHeader>
                <img
                    src={"/media/placeholder-event.jpg"}
                    alt={event?.eventTitle}
                    className={styles.dialogImg}
                />
            </DialogHeader>
            <DialogBody className={styles.dialogBody}>
                <div className={styles.dialogBodyHeader}>
                    <div>
                        <DialogTitle>{event?.eventTitle}</DialogTitle>
                        <p className={styles.dialogOrg}>
                            {event?.organization?.name}
                        </p>
                    </div>
                    <Button className={styles.dialogClose} onClick={onClose}>
                        <X />
                    </Button>
                </div>

                <div className={styles.dialogBodyContent}>
                    <div className={styles.dialogDetails}>
                        <h3>Event Details</h3>
                        <div className={styles.location}>
                            <MapPin size={16} />
                            <span>{event?.location}</span>
                        </div>
                        <div>
                            <Calendar size={16} />
                            <span>
                                {formatDateDisplay(event?.startDateTime)}{" "}
                                {formatDateDisplay(event?.endDateTime) !==
                                formatDateDisplay(event?.startDateTime)
                                    ? `- ${formatDateDisplay(
                                          event?.endDateTime
                                      )}`
                                    : ""}
                            </span>
                        </div>
                        <div>
                            <Clock size={16} />
                            <span>
                                {formatTime(event?.startDateTime)}{" "}
                                {event?.endDateTime
                                    ? `- ${formatTime(event?.endDateTime)}`
                                    : ""}
                            </span>
                        </div>
                        <div>
                            <Users size={16} />
                            <span>{event?.maxAttendees} Attendees</span>
                        </div>
                    </div>
                    <div className={styles.dialogDetails}>
                        <h3>Your Details</h3>
                        {userEvent?.getFlights()[0] ? (
                            <>
                                <div>
                                    <TowerControl size={16} />
                                    <span className={styles.dialogAirports}>
                                        {
                                            userEvent?.getFlights()[0]
                                                .departureLocation
                                        }
                                        <ArrowRight size={16} />
                                        {
                                            userEvent?.getFlights()[0]
                                                .arrivalLocation
                                        }
                                    </span>
                                </div>
                                <div>
                                    <PlaneTakeoff size={16} />
                                    <span>
                                        {formatDateDisplay(
                                            userEvent.getFlights()[0]
                                                .departureDateTime
                                        )}{" "}
                                        •{" "}
                                        {formatTime(
                                            userEvent.getFlights()[0]
                                                .departureDateTime
                                        )}
                                    </span>
                                </div>
                                <div>
                                    <PlaneLanding size={16} />
                                    <span>
                                        {formatDateDisplay(
                                            userEvent.getFlights()[0]
                                                .arrivalDateTime
                                        )}{" "}
                                        •{" "}
                                        {formatTime(
                                            userEvent.getFlights()[0]
                                                .arrivalDateTime
                                        )}
                                    </span>
                                </div>
                            </>
                        ) : (
                            <p className={styles.noResults}>No flights found</p>
                        )}
                        {event?.budget && (
                            <div>
                                <CircleDollarSign size={16} />
                                <span>
                                    ${event?.budget.perUserTotal}/Attendee
                                </span>
                            </div>
                        )}
                    </div>
                </div>
            </DialogBody>
        </BaseDialog>
    );
};

export default ViewEventModal;
