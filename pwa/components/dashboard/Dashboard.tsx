import React from "react";
import { Search, Filter } from "lucide-react";
import styles from "./Dashboard.module.css";

// Define types for the event data
interface Event {
  id: number;
  name: string;
  org: string;
  eventDate: string;
  departureDate: string;
  img: string;
}

// Define types for the Card component props
interface CardProps {
  title: string;
  organization: string;
  eventDate: string;
  departureDate: string;
  buttonText: string;
  imageUrl: string;
  onClick: () => void;
}

// Card Component
const Card: React.FC<CardProps> = ({ title, organization, eventDate, departureDate, buttonText, imageUrl, onClick }) => {
  return (
    <div className={styles.card}>
      <img src={imageUrl} alt={title} className={styles.cardImage} />
      <div className={styles.cardContent}>
        <h3 className={styles.cardTitle}>{title}</h3>
        <p className={styles.cardSubtitle}>{organization}</p>
        <div className={styles.cardDate}>
          <span className={styles.cardDateIcon}>📅</span> {eventDate}
        </div>
        <div className={styles.cardDate}>
          <span className={styles.cardDateIcon}>✈️</span> {departureDate}
        </div>
        <button className={styles.cardButton} onClick={onClick}>
          {buttonText}
        </button>
      </div>
    </div>
  );
};

// Define types for the EventRow component props
interface EventRowProps {
  title: string;
  events: Event[];
  buttonText: string;
}

// EventRow Component
const EventRow: React.FC<EventRowProps> = ({ title, events, buttonText }) => {
  return (
    <div className={styles.eventRow}>
      <div className={styles.eventRowHeader}>
        <h2 className={styles.eventRowTitle}>{title}</h2>
        <div className={styles.searchFilterContainer}>
          <div className={styles.searchInputWrapper}>
            <Search className={styles.searchIcon} />
            <input type="text" placeholder="Search" className={styles.searchInput} />
          </div>
          <Filter className={styles.filterIcon} />
        </div>
      </div>
      <div className={styles.eventCardRow}>
        {events.map((event) => (
          <Card
            key={event.id}
            title={event.name}
            organization={event.org}
            eventDate={event.eventDate}
            departureDate={event.departureDate}
            buttonText={buttonText}
            imageUrl={event.img}
            onClick={() => console.log(`Clicked on ${event.name}`)}
          />
        ))}
      </div>
    </div>
  );
};

// Main EventList Component
const EventList: React.FC = () => {
  const events: Event[] = [
    { id: 1, name: "Event Name", org: "Organization Name", eventDate: "Dec 5, 2024 • 9am", departureDate: "Dec 6, 2024 • 5pm", img: "/media/event_image.jpg" },
    { id: 2, name: "Event Name", org: "Organization Name", eventDate: "Dec 5 - 9, 2024 • 9am - 5pm", departureDate: "Dec 10, 2024 • 7am", img: "/media/event_image.jpg" },
    { id: 3, name: "Event Name", org: "Organization Name", eventDate: "Dec 5, 2024 • 9am", departureDate: "Dec 6, 2024 • 5pm", img: "/media/event_image.jpg" },
    { id: 4, name: "Event Name", org: "Organization Name", eventDate: "Dec 5, 2024 • 9am", departureDate: "Dec 6, 2024 • 5pm", img: "/media/event_image.jpg" },
    { id: 5, name: "Event Name", org: "Organization Name", eventDate: "Dec 5, 2024 • 9am", departureDate: "Dec 6, 2024 • 5pm", img: "/media/event_image.jpg" },
  ];

  return (
    <div className={styles.dashboard}>
      <EventRow title="Event Invitations" events={events} buttonText="Book Now" />
      <EventRow title="Your Events" events={events} buttonText="View More" />
    </div>
  );
};

export default EventList;
