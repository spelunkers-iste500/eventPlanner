import React, { useState } from "react";
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

	return (
		<div className={styles.eventList}>
			<div className={styles.eventListHeader}>
				<h2>{heading}</h2>

				{/* Search Bar Wrapper */}
				<div className={styles.searchFilterContainer}>
					<div
						className={`${styles.searchWrapper} ${isExpanded ? styles.expanded : ""}`}
						onFocus={() => setIsExpanded(true)}
						onBlur={() => searchTerm === "" && setIsExpanded(false)}
					>
						<input
							type="text"
							placeholder="Search"
							value={searchTerm}
							onChange={(e) => setSearchTerm(e.target.value)}
							className={`${styles.searchInput} ${isExpanded ? styles.visible : ""}`}
						/>

						{/* Icon Wrapper for Smooth Transitions */}
						<div className={styles.iconWrapper}>
							{!isExpanded ? (
								<Button
									isIconOnly
									aria-label="Search"
									color="primary"
									variant="light"
									className={styles.searchIcon}
									onPress={() => setIsExpanded(true)}
								>
									<Search size={20} />
								</Button>
							) : (
								<Button
									isIconOnly
									aria-label="Clear search"
									color="danger"
									variant="light"
									className={styles.closeIcon}
									onPress={() => {
										setSearchTerm("");
										setIsExpanded(false);
									}}
								>
									<XCircle size={20} />
								</Button>
							)}
						</div>
					</div>

					{/* Filter Button */}
					<Button
						className={styles.filterIcon}
						isIconOnly
						aria-label="Sort"
						onPress={() => setReverseSorting(!reverseSorting)}
					>
						{reverseSorting ? (
							<ArrowUpWideNarrow size={20} />
						) : (
							<ArrowDownWideNarrow size={20} />
						)}
					</Button>
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
