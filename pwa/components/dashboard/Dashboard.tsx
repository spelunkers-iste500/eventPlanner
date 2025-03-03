import React from "react";
import EventList from "../common/EventList";
import styles from "./Dashboard.module.css";
import { useSession } from "next-auth/react";
import { Event } from "types/events";

// Main EventList Component
const Dashboard: React.FC = () => {
	const { data: session } = useSession();

  	return (
		<div className={styles.dashboardContainer}>
			<h1 className={styles.heading}>Welcome, {session?.user?.name}!</h1>
			<EventList heading="Event Invitations" events={events} />
			<EventList heading="Your Events" events={events} />
		</div>
  	);
};

export default Dashboard;

const events: Event[] = [
	{ 
		id: 1, 
		img: "/media/event_image.jpg", 
		name: "Event Name", 
		org: "Organization Name", 
		eventDate: "Jul 10, 2025", 
		eventTime: "9am", 
		eventLocation: "Location One", 
		departureAirportCode: "JFK", 
		departureDate: "Dec 6, 2024 • 9am", 
		returnDate: "Dec 10, 2024 • 5pm", 
		attendeeBudget: "$1000", 
		usedBudget: "$500" 
	},
	{ 
		id: 2, 
		img: "/media/event_image.jpg", 
		name: "Event Steff", 
		org: "Organization Ethan", 
		eventDate: "Apr 15 - 9, 2024", 
		eventTime: "9am - 5pm", 
		eventLocation: "Location Two", 
		departureAirportCode: "LAX", 
		departureDate: "Dec 10, 2024 • 9am", 
		returnDate: "Dec 15, 2024 • 5pm", 
		attendeeBudget: "$1500", 
		usedBudget: "$700" 
	},
	{ 
		id: 3, 
		img: "/media/event_image.jpg", 
		name: "Event Four", 
		org: "Organization Three", 
		eventDate: "Dec 3, 2024", 
		eventTime: "9am", 
		eventLocation: "Location Three", 
		departureAirportCode: "ORD", 
		departureDate: "Dec 1, 2024 • 9am", 
		returnDate: "Dec 4, 2024 • 5pm", 
		attendeeBudget: "$1200", 
		usedBudget: "$600" 
	},
	{ 
		id: 4, 
		img: "/media/event_image.jpg", 
		name: "Event Ethan", 
		org: "Organization Steff", 
		eventDate: "Jan 25, 2025", 
		eventTime: "9am", 
		eventLocation: "Location Four", 
		departureAirportCode: "ATL", 
		departureDate: "Jan 23, 2025 • 9am", 
		returnDate: "Jan 26, 2025 • 5pm", 
		attendeeBudget: "$1300", 
		usedBudget: "$800" 
	},
	{ 
		id: 5, 
		img: "/media/event_image.jpg", 
		name: "Event Sixty", 
		org: "Organization Sixty", 
		eventDate: "Aug 5, 2024", 
		eventTime: "10am", 
		eventLocation: "Location Five", 
		departureAirportCode: "DFW", 
		departureDate: "Aug 3, 2024 • 9am", 
		returnDate: "Aug 6, 2024 • 5pm", 
		attendeeBudget: "$1100", 
		usedBudget: "$900" 
	},
];
