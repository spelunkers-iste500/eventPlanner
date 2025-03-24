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

    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);

    const [ loading, setLoading ] = useState(true);

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
			<h1 className={styles.heading}>Welcome, {user?.name}!</h1>
			<EventList heading="Event Invitations" events={pendingEvents} />
            <EventList heading="Your Events" events={acceptedEvents} onOpenDialog={handleOpenDialog} />

            <ViewEventModal isOpen={isDialogOpen} onClose={handleCloseDialog} event={selectedEvent} />
		</div>
  	);
};

export default Dashboard;

const events: Event[] = [
    { 
        id: 1, 
        eventTitle: "Event Name", 
        startDateTime: "2025-07-10T09:00:00", 
        endDateTime: "2025-07-10T17:00:00", 
        startFlightBooking: "2024-12-06T09:00:00", 
        endFlightBooking: "2024-12-10T17:00:00", 
        location: "Location One", 
        maxAttendees: 100, 
        organization: "Organization Name", 
        attendees: ["attendee1@example.com", "attendee2@example.com"], 
        financeAdmins: ["financeAdmin1@example.com"], 
        eventAdmins: ["eventAdmin1@example.com"] 
    },
    { 
        id: 2, 
        eventTitle: "Event Steff", 
        startDateTime: "2024-04-15T09:00:00", 
        endDateTime: "2024-04-15T17:00:00", 
        startFlightBooking: "2024-12-10T09:00:00", 
        endFlightBooking: "2024-12-15T17:00:00", 
        location: "Location Two", 
        maxAttendees: 150, 
        organization: "Organization Ethan", 
        attendees: ["attendee3@example.com", "attendee4@example.com"], 
        financeAdmins: ["financeAdmin2@example.com"], 
        eventAdmins: ["eventAdmin2@example.com"] 
    },
    { 
        id: 3, 
        eventTitle: "Event Four", 
        startDateTime: "2024-12-03T09:00:00", 
        endDateTime: "2024-12-03T17:00:00", 
        startFlightBooking: "2024-12-01T09:00:00", 
        endFlightBooking: "2024-12-04T17:00:00", 
        location: "Location Three", 
        maxAttendees: 200, 
        organization: "Organization Three", 
        attendees: ["attendee5@example.com", "attendee6@example.com"], 
        financeAdmins: ["financeAdmin3@example.com"], 
        eventAdmins: ["eventAdmin3@example.com"] 
    },
    { 
        id: 4, 
        eventTitle: "Event Ethan", 
        startDateTime: "2025-01-25T09:00:00", 
        endDateTime: "2025-01-25T17:00:00", 
        startFlightBooking: "2025-01-23T09:00:00", 
        endFlightBooking: "2025-01-26T17:00:00", 
        location: "Location Four", 
        maxAttendees: 250, 
        organization: "Organization Steff", 
        attendees: ["attendee7@example.com", "attendee8@example.com"], 
        financeAdmins: ["financeAdmin4@example.com"], 
        eventAdmins: ["eventAdmin4@example.com"] 
    },
    { 
        id: 5, 
        eventTitle: "Event Sixty", 
        startDateTime: "2024-08-05T10:00:00", 
        endDateTime: "2024-08-05T18:00:00", 
        startFlightBooking: "2024-08-03T09:00:00", 
        endFlightBooking: "2024-08-06T17:00:00", 
        location: "Location Five", 
        maxAttendees: 300, 
        organization: "Organization Sixty", 
        attendees: ["attendee9@example.com", "attendee10@example.com"], 
        financeAdmins: ["financeAdmin5@example.com"], 
        eventAdmins: ["eventAdmin5@example.com"] 
    },
];
function then(arg0: (response: any) => void) {
    throw new Error("Function not implemented.");
}

