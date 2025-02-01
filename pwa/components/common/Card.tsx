import React from "react";
import styles from "../dashboard/Dashboard.module.css";

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
				<p className="h5">{organization}</p>
				<div className={styles.cardRow}>
					<span className={styles.cardDateIcon}>📅</span>
					{eventDate}
				</div>
				<div className={styles.cardRow}>
					<span className={styles.cardDateIcon}>✈️</span>
					{departureDate}
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
