import React from "react";
import styles from "../dashboard/Dashboard.module.css";
import { Event } from "types/events";
import { Calendar, Plane } from "lucide-react";

// Define types for the Card component props
interface CardProps {
	event: Event;
	buttonText: string;
	onClick: () => void;
}

// Card Component
const Card: React.FC<CardProps> = ({ event, buttonText, onClick }) => {
	return (
		<div className={styles.card}>
			<img src={event.img} alt={event.name} className={styles.cardImage} />

			<div className={styles.cardContent}>
				<div>
					<h3 className={styles.cardTitle}>{event.name}</h3>
					<h4 className={`${styles.cardSubtitle} h5`}>{event.org}</h4>
	
					<div className={styles.cardDetails}>
						<div className={styles.cardRow}>
							<Calendar size={16} />
							{event.eventDate} • {event.eventTime}
						</div>
		
						{event.departureDate && (
							<div className={styles.cardRow}>
								<Plane size={16} />
								{event.departureDate} 
							</div>
						)}
					</div>
				</div>

				<div className={styles.cardRow}>
					<button className={styles.cardButton} onClick={onClick}>
						{buttonText}
					</button>
				</div>
			</div>
		</div>
	);
};

export default Card;
