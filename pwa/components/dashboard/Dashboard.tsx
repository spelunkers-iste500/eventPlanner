import React from "react";
import EventList from "../common/EventList";
import styles from "./Dashboard.module.css";
import { Event } from "Types/events";
import { useUser } from "Utils/UserProvider";

// Main EventList Component
const Dashboard: React.FC = () => {
	const { user } = useUser();

  	return (
		<div className={styles.dashboardContainer}>
			<h1 className={styles.heading}>Welcome, {user?.name}!</h1>
			<EventList heading="Event Invitations" events={events} />
			<EventList heading="Your Events" events={events} />
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
