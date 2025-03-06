import React from "react";
import styles from "../dashboard/Dashboard.module.css";
import { Event, formatDate, formatTime } from "types/events";
import { Calendar, Plane, PlaneLanding, PlaneTakeoff } from "lucide-react";

// Define types for the Card component props
interface CardProps {
	event: Event;
	buttonText: string;
	onClick: () => void;
}

const Card: React.FC<CardProps> = ({ event, buttonText, onClick }) => {
	return (
        <div className={styles.card}>
            <img src={'/media/event_image.jpg'} alt={event.eventTitle} className={styles.cardImage} />

            <div className={styles.cardContent}>
                <div>
                    <h3 className={styles.cardTitle}>{event.eventTitle}</h3>
                    <h4 className={`${styles.cardSubtitle} h5`}>{event.organization}</h4>
    
                    <div className={styles.cardDetails}>
                        <div className={styles.cardRow}>
                            <Calendar size={16} />
                            {formatDate(event.startDateTime)} • {formatTime(event.startDateTime)} {event.endDateTime ? `- ${formatTime(event.endDateTime)}` : ''}
                        </div>
        
                        {event.startFlightBooking && buttonText !== "Book Now" && (
                            <div className={styles.cardRow}>
                                <PlaneTakeoff size={16} />
                                {formatDate(event.startFlightBooking)} • {formatTime(event.startFlightBooking)}
                            </div>
                        )}
                        {event.endFlightBooking && buttonText !== "Book Now" && (
                            <div className={styles.cardRow}>
                                <PlaneLanding size={16} />
								{formatDate(event.endFlightBooking)} • {formatTime(event.endFlightBooking)}
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
