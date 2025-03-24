import { DialogHeader, DialogBody, DialogTitle, Button, Skeleton } from '@chakra-ui/react';
import axios from 'axios';
import BaseDialog from 'Components/common/BaseDialog';
import { X, MapPin, Calendar, Clock, Users, TowerControl, ArrowRight, PlaneTakeoff, PlaneLanding, CircleDollarSign } from 'lucide-react';
import React, { useEffect } from 'react';
import { Event, formatDateDisplay, formatTime } from 'Types/events';
import styles from '../common/Dialog.module.css';
import { useSession } from 'next-auth/react';

interface ViewEventModalProps {
    event: Event | null;
    isOpen: boolean;
    onClose: () => void;
}

const ViewEventModal: React.FC<ViewEventModalProps> = ({ event, isOpen, onClose }) => {
    const [ budgetPerAttendee, setBudgetPerAttendee ] = React.useState<number | null>(null);
    const { data: session } = useSession();

    const getBudget = async (event: Event) => {
		try {
			const response = await axios.get(`/budgets/${event.id}`, { headers: { 'Authorization': `Bearer ${session?.apiToken}` } });

            if (response.status === 200) {
                setBudgetPerAttendee(Number(response.data.total) / event.maxAttendees);
            }
		} catch (error) {
			console.error('Error fetching budget:', error);
		}
	}

	useEffect(() => {
		if (event) {
            getBudget(event);
        }
	}, [event]);

    return (
        <BaseDialog isOpen={isOpen} onClose={onClose}>
            <DialogHeader>
                <img src={'/media/event_image.jpg'} alt={event?.eventTitle} className={styles.dialogImg} />
            </DialogHeader>
            <DialogBody className={styles.dialogBody}>
                <div className={styles.dialogBodyHeader}>
                    <div>
                        <DialogTitle>{event?.eventTitle}</DialogTitle>
                        <p className={styles.dialogOrg}>{event?.organization.name}</p>
                    </div>
                    <Button className={styles.dialogClose} onClick={onClose}><X /></Button>
                </div>

                <div className={styles.dialogBodyContent}>
                    <div className={styles.dialogDetails}>
                        <h3>Event Details</h3>
                        <div className={styles.location}><MapPin size={16}/><span>{event?.location}</span></div>
                        <div><Calendar size={16}/><span>{formatDateDisplay(event?.startDateTime)} {formatDateDisplay(event?.endDateTime) !== formatDateDisplay(event?.startDateTime) ? `- ${formatDateDisplay(event?.endDateTime)}` : ''}</span></div>
                        <div><Clock size={16}/><span>{formatTime(event?.startDateTime)} {event?.endDateTime ? `- ${formatTime(event?.endDateTime)}` : ''}</span></div>
                        <div><Users size={16}/><span>{event?.maxAttendees} Attendees</span></div>
                    </div>
                    <div className={styles.dialogDetails}>
                        <h3>Your Details</h3>
                        <div><TowerControl size={16}/><span className={styles.dialogAirports}>ROC <ArrowRight size={16} /> ORL</span></div>
                        <div><PlaneTakeoff size={16}/><span>{formatDateDisplay(event?.startFlightBooking)} • {formatTime(event?.startFlightBooking)}</span></div>
                        <div><PlaneLanding size={16}/><span>{formatDateDisplay(event?.endFlightBooking)} • {formatTime(event?.endFlightBooking)}</span></div>
                        <div><CircleDollarSign size={16}/><span>{budgetPerAttendee ? budgetPerAttendee : <Skeleton height='4' width='70%' />}</span></div>
                    </div>
                </div>
            </DialogBody>
        </BaseDialog>
    );
};

export default ViewEventModal;
