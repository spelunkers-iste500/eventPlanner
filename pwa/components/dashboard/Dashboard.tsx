import React from "react";
import EventList from "./EventList";
import styles from "./Dashboard.module.css";
import { useSession } from "next-auth/react";

// Define types for the event data
export interface Event {
	id: number;
	img: string;
	name: string;
	org: string;
	eventDate: string;
	departureDate?: string;
}

// Main EventList Component
const Dashboard: React.FC = () => {
	const { data: session } = useSession();

	const events: Event[] = [
		{ id: 1, img: "/media/event_image.jpg", name: "Event Name", org: "Organization Name", eventDate: "Dec 5, 2024 • 9am", departureDate: "Dec 6, 2024 • 5pm" },
		{ id: 2, img: "/media/event_image.jpg", name: "Event Name", org: "Organization Name", eventDate: "Dec 5 - 9, 2024 • 9am - 5pm", departureDate: "Dec 10, 2024 • 7am" },
		{ id: 3, img: "/media/event_image.jpg", name: "Event Name", org: "Organization Name", eventDate: "Dec 5, 2024 • 9am"},
		{ id: 4, img: "/media/event_image.jpg", name: "Event Name", org: "Organization Name", eventDate: "Dec 5, 2024 • 9am"},
		{ id: 5, img: "/media/event_image.jpg", name: "Event Name", org: "Organization Name", eventDate: "Dec 5, 2024 • 9am", departureDate: "Dec 6, 2024 • 5pm" },
	];

  	return (
		<div className={styles.dashboardContainer}>
			<h1 className={styles.heading}>Welcome, {session?.user?.name}!</h1>
			<EventList heading="Event Invitations" events={events} />
			<EventList heading="Your Events" events={events} />
		</div>
  	);
};

export default Dashboard;
