import React, { useEffect, useState } from "react";
import EventList from "../common/EventList";
import styles from "./Dashboard.module.css";
import { Event } from "Types/events";
import { useUser } from "Utils/UserProvider";
import axios from 'axios';
import { useSession } from 'next-auth/react';
import ViewEventModal from "./ViewEventModal";

// Define the UserEvent interface
interface UserEvent {
    id: string;
    event: Event;
    isAccepted: boolean;
    isDeclined: boolean;
}

// Main EventList Component
const Dashboard: React.FC = () => {
    const { user } = useUser();
    const { data: session } = useSession();
    const [acceptedEvents, setAcceptedEvents] = useState<Event[]>([]);
    const [pendingEvents, setPendingEvents] = useState<Event[]>([]);
    const [ loading, setLoading ] = useState(true);

    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);

    const handleOpenDialog = (event: Event) => {
        setSelectedEvent(event);
        setIsDialogOpen(true);
    };

    const handleCloseDialog = () => {
        setIsDialogOpen(false);
        setSelectedEvent(null);
    };

    const getEvents = async () => {
        if (user && session) {
            try {
                console.log('fetching user events');
                const response = await axios.get(`/my/events`, {
                    headers: { 'Authorization': `Bearer ${session.apiToken}` }
                });
                if (response.status === 200) {
                    const userEvents: UserEvent[] = response.data['hydra:member'];
                    const accepted: Event[] = userEvents.filter(event => event.isAccepted).map(event => event.event);
                    const pending: Event[] = userEvents.filter(event => !event.isAccepted).map(event => event.event);
                    setAcceptedEvents(accepted);
                    setPendingEvents(pending);
                    console.log('Accepted Events:', accepted);
                    console.log('Pending Events:', pending);
                    setLoading(false);
                }
            } catch (error) {
                console.error('Error:', error);
            }
        }
    };

    useEffect(() => {
        getEvents();
    }, [user]);

    if (loading) {
        return <h2 className='loading'>Loading...</h2>;
    }

  	return (
		<div className={styles.dashboardContainer}>
			<h1 className={styles.heading}>Welcome, {user?.name}!</h1>;
			<EventList heading="Event Invitations" events={pendingEvents} />
            <EventList heading="Your Events" events={acceptedEvents} onOpenDialog={handleOpenDialog} />

            <ViewEventModal isOpen={isDialogOpen} onClose={handleCloseDialog} event={selectedEvent} />
		</div>
  	);
};

export default Dashboard;