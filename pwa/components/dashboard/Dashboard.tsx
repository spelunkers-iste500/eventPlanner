import React, { useEffect, useState } from "react";
import EventList from "../common/EventList";
import styles from "./Dashboard.module.css";
import { UserEvent } from "Types/events";
import { useUser } from "Utils/UserProvider";
import axios from 'axios';
import { useSession } from 'next-auth/react';
import ViewEventModal from "./ViewEventModal";
import { signOut } from "next-auth/react";

// Main EventList Component
const Dashboard: React.FC = () => {
    const { user } = useUser();
    const { data: session } = useSession();
    const [acceptedEvents, setAcceptedEvents] = useState<UserEvent[]>([]);
    const [pendingEvents, setPendingEvents] = useState<UserEvent[]>([]);
    const [ loading, setLoading ] = useState(true);

    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [selectedEvent, setSelectedEvent] = useState<UserEvent | null>(null);

    const handleOpenDialog = (event: UserEvent) => {
        setSelectedEvent(event);
        setIsDialogOpen(true);
    };

    const handleCloseDialog = () => {
        setIsDialogOpen(false);
        setSelectedEvent(null);
    };

    const getEvents = async () => {
        if (user && session) {
            console.log('fetching user events');
            axios.get(`/my/events`, {
                headers: { 'Authorization': `Bearer ${session.apiToken}` }
            })
            .then((response) => {
                if (response.status === 200) {
                    const userEvents: UserEvent[] = response.data['hydra:member'];
                    console.log('User Events:', userEvents);
                    
                    // const accepted: Event[] = userEvents.filter(event => event.isAccepted).map(event => event.event);
                    // const pending: Event[] = userEvents.filter(event => !event.isAccepted).map(event => event.event);
                    const accepted: UserEvent[] = userEvents.filter(event => event.status === 'accepted').map(userEvent => ( userEvent ));
                    const pending: UserEvent[] = userEvents.filter(event => event.status === 'pending').map(userEvent => ( userEvent ));
                    setAcceptedEvents(accepted);
                    setPendingEvents(pending);
                    console.log('Accepted Events:', accepted);
                    console.log('Pending Events:', pending);
                    setLoading(false);
                }
            })
            .catch((error) => {
                if (error.response && error.response.status === 401) {
                    // this should happen when there's an expired jwt token
                    signOut();
                } else {
                    console.error('Error fetching events:', error);
                }
            });
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
			<h1 className={styles.heading}>Welcome, {user?.name}!</h1>
			<EventList heading="Event Invitations" events={pendingEvents} />
            <EventList heading="Your Events" events={acceptedEvents} onOpenDialog={handleOpenDialog} />

            <ViewEventModal isOpen={isDialogOpen} onClose={handleCloseDialog} userEvent={selectedEvent} />
		</div>
  	);
};

export default Dashboard;