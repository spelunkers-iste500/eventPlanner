import React from "react";
import EventList from "../common/EventList";
import Container from "../common/Container";
import styles from "./Dashboard.module.css";

// Define types for the event data
export interface Event {
	id: number;
	name: string;
	org: string;
	eventDate: string;
	departureDate: string;
	img: string;
}

// Main EventList Component
const Dashboard: React.FC = () => {
	const events: Event[] = [
		{ id: 1, name: "Event Name", org: "Organization Name", eventDate: "Dec 5, 2024 • 9am", departureDate: "Dec 6, 2024 • 5pm", img: "/media/event_image.jpg" },
		{ id: 2, name: "Event Name", org: "Organization Name", eventDate: "Dec 5 - 9, 2024 • 9am - 5pm", departureDate: "Dec 10, 2024 • 7am", img: "/media/event_image.jpg" },
		{ id: 3, name: "Event Name", org: "Organization Name", eventDate: "Dec 5, 2024 • 9am", departureDate: "Dec 6, 2024 • 5pm", img: "/media/event_image.jpg" },
		{ id: 4, name: "Event Name", org: "Organization Name", eventDate: "Dec 5, 2024 • 9am", departureDate: "Dec 6, 2024 • 5pm", img: "/media/event_image.jpg" },
		{ id: 5, name: "Event Name", org: "Organization Name", eventDate: "Dec 5, 2024 • 9am", departureDate: "Dec 6, 2024 • 5pm", img: "/media/event_image.jpg" },
	];

  	return (
		<Container classes="dashboard-container">
			<EventList heading="Event Invitations" events={events} />
			<EventList heading="Your Events" events={events} />
		</Container>
  	);
};

export default Dashboard;
