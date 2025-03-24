import { DialogHeader, DialogBody, DialogTitle, Button, Skeleton } from '@chakra-ui/react';
import axios from 'axios';
import BaseDialog from 'Components/common/BaseDialog';
import { X, MapPin, Calendar, Clock, Users, TowerControl, ArrowRight, PlaneTakeoff, PlaneLanding, CircleDollarSign } from 'lucide-react';
import React, { useEffect } from 'react';
import { Event, formatDateDisplay, formatTime } from 'Types/events';
import dialogStyles from '../common/Dialog.module.css';
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
                <img src={'/media/event_image.jpg'} alt={event?.eventTitle} className={dialogStyles.dialogImg} />
            </DialogHeader>
            <DialogBody className={dialogStyles.dialogBody}>
                <div className={dialogStyles.dialogBodyHeader}>
                    <div>
                        <DialogTitle>{event?.eventTitle}</DialogTitle>
                        <p className={dialogStyles.dialogOrg}>{event?.organization}</p>
                    </div>
                    <Button className={dialogStyles.dialogClose} onClick={onClose}><X /></Button>
                </div>

                <div className={dialogStyles.dialogBodyContent}>
                    <div className={dialogStyles.dialogDetails}>
                        <h3>Event Details</h3>
                        <p className={dialogStyles.location}><MapPin size={16}/><span>{event?.location}</span></p>
                        <p><Calendar size={16}/><span>{formatDateDisplay(event?.startDateTime)} {formatDateDisplay(event?.endDateTime) !== formatDateDisplay(event?.startDateTime) ? `- ${formatDateDisplay(event?.endDateTime)}` : ''}</span></p>
                        <p><Clock size={16}/><span>{formatTime(event?.startDateTime)} {event?.endDateTime ? `- ${formatTime(event?.endDateTime)}` : ''}</span></p>
                        <p><Users size={16}/><span>{event?.maxAttendees} Attendees</span></p>
                    </div>
                    <div className={dialogStyles.dialogDetails}>
                        <h3>Your Details</h3>
                        <p><TowerControl size={16}/><span className={dialogStyles.dialogAirports}>ROC <ArrowRight size={16} /> ORL</span></p>
                        <p><PlaneTakeoff size={16}/><span>{formatDateDisplay(event?.startFlightBooking)} • {formatTime(event?.startFlightBooking)}</span></p>
                        <p><PlaneLanding size={16}/><span>{formatDateDisplay(event?.endFlightBooking)} • {formatTime(event?.endFlightBooking)}</span></p>
                        <p><CircleDollarSign size={16}/><span>{budgetPerAttendee ? budgetPerAttendee : <Skeleton height='4' width='70%' />}</span></p>
                    </div>
                </div>
            </DialogBody>
        </BaseDialog>
    );
};

export default ViewEventModal;
