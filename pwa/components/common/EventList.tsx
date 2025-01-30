import React, { useState } from "react";
import styles from "../dashboard/Dashboard.module.css";
import { Button } from "@heroui/react";
import { Filter, Search, XCircle } from "lucide-react";
import Card from "./Card";
import { Event } from "../dashboard/Dashboard";

interface EventListProps {
  heading: string;
  events: Event[];
}

const EventList: React.FC<EventListProps> = ({ heading, events }) => {
  const buttonText = heading === "Event Invitations" ? "Book Now" : "View More";
  const [searchTerm, setSearchTerm] = useState("");
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <div className={styles.eventList}>
      <div className={styles.eventListHeader}>
        <h2 className="eventListTitle">{heading}</h2>

        <div className={styles.searchFilterContainer}>
          {/* Expanding Search Bar */}
          <div
            className={`${styles.searchWrapper} ${isExpanded ? styles.expanded : ""}`}
            onFocus={() => setIsExpanded(true)}
            onBlur={() => searchTerm === "" && setIsExpanded(false)}
          >
            {isExpanded && (
              <Button
                isIconOnly
                aria-label="Clear search"
                color="danger"
                variant="light"
                className={styles.closeIcon}
                onClick={() => {
                  setSearchTerm("");
                  setIsExpanded(false);
                }}
              >
                <XCircle size={16} />
              </Button>
            )}

            <input
              type="text"
              placeholder="Search"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className={`${styles.searchInput} ${isExpanded ? styles.visible : ""}`}
            />

            <Button
              isIconOnly
              aria-label="Search"
              color="primary"
              variant="light"
              className={styles.searchIcon}
              onClick={() => setIsExpanded(true)}
            >
              <Search size={16} />
            </Button>
          </div>

          {/* Filter Icon */}
          <Button isIconOnly aria-label="Filter" color="secondary" variant="light">
            <Filter size={16} />
          </Button>
        </div>
      </div>

      <div className={styles.eventCardRow}>
        {events
          .filter((event) => event.name.toLowerCase().includes(searchTerm.toLowerCase()))
          .map((event) => (
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
