import React, { useRef, useState } from "react";
import styles from "../dashboard/Dashboard.module.css";
import { Button } from "@heroui/react";
import { ArrowDownWideNarrow, ArrowUpWideNarrow, Search, XCircle } from "lucide-react";
import Card from "./Card";
import { Event } from "./Dashboard";

interface EventListProps {
	heading: string;
	events: Event[];
}

const EventList: React.FC<EventListProps> = ({ heading, events }) => {
	const buttonText = heading === "Event Invitations" ? "Book Now" : "View More";
	const [searchTerm, setSearchTerm] = useState("");
	const [isExpanded, setIsExpanded] = useState(false);
	const [reverseSorting, setReverseSorting] = useState(false);
	const inputRef = useRef<HTMLInputElement>(null);

	return (
		<div className={styles.eventList}>
			<div className={styles.eventListHeader}>
				<h2>{heading}</h2>

				<div className={styles.eventListButtons}>
					{/* Search Bar Wrapper */}
					<div className={`${styles.searchWrapper} ${isExpanded ? styles.expanded : ""}`}>
						<input
							ref={inputRef}
							className={`${styles.searchInput} ${isExpanded ? styles.visible : ""}`}
							onFocus={() => setIsExpanded(true)}
							onBlur={() => searchTerm === "" && setIsExpanded(false)}
							onChange={(e) => setSearchTerm(e.target.value)}
							type="text"
							placeholder="Search"
							value={searchTerm}
						/>
	
							<button
								aria-label="Search"
								className={styles.iconWrapper}
								onClick={isExpanded ? () => {
									setIsExpanded(false);
									setSearchTerm("") 
								} : () => {
									setIsExpanded(true)
									inputRef.current?.focus();
								}}
							>
								{!isExpanded ? (
									<Search size={20} />
								) : (
									<XCircle size={20} />
								)}
							</button>
					</div>
	
					{/* Filter Button */}
					<button
						className={styles.iconWrapper}
						aria-label="Sort"
						onClick={() => setReverseSorting(!reverseSorting)}
					>
						{reverseSorting ? (
							<ArrowUpWideNarrow size={20} />
						) : (
							<ArrowDownWideNarrow size={20} />
						)}
					</button>
				</div>
			</div>
			<div className={`${styles.eventCardRow} ${reverseSorting ? styles.reverse : ""}`}>
				{events.filter((event) => event.name.toLowerCase().includes(searchTerm.toLowerCase())).map((event) => (
					<Card
						key={event.id}
						event={event}
						buttonText={buttonText}
						onClick={() => console.log(`Clicked on ${event.name}`)}
					/>
				))}
			</div>
		</div>
  	);
};

export default EventList;
