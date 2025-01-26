import React from "react";
import styles from "../dashboard/Dashboard.module.css"; // Import the styles from Dashboard.module.css

interface CardProps {
  title: string;
  organization: string;
  eventDate: string;
  departureDate: string;
  buttonText: string;
  imageUrl: string;
  onClick: () => void;
}

const Card: React.FC<CardProps> = ({
  title,
  organization,
  eventDate,
  departureDate,
  buttonText,
  imageUrl,
  onClick,
}) => {
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

export default Card;
