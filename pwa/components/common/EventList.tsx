import React from "react";
import styles from "../dashboard/Dashboard.module.css";
import { Filter, Search } from "lucide-react";
import Card from "./Card";
import { Event } from "../dashboard/Dashboard";

  
  // Define types for the EventList component props
interface EventListProps {
    heading: string;
    events: Event[];
}
  
  // EventList Component
const EventList: React.FC<EventListProps> = ({ heading, events }) => {
    const buttonText = heading === "Event Invitations" ? "Book Now" : "View More";

    return (
		<div className={styles.eventList}>
			<div className={styles.eventListHeader}>
				<h2 className="eventListTitle">{heading}</h2>

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

  export default EventList;