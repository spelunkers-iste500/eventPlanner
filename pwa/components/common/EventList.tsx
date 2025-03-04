import React, { useRef, useState } from "react";
import styles from "../dashboard/Dashboard.module.css";
import { ArrowDownWideNarrow, ArrowUpWideNarrow, Search, XCircle, Plus } from "lucide-react";
import Card from "./Card";
import { Event } from "types/events";
import { useContent } from "Utils/ContentProvider";
import EventForm from "Components/booking/EventForm";
import { DialogRoot, DialogBackdrop, DialogContent, DialogCloseTrigger, DialogHeader, DialogTitle, DialogBody, DialogFooter, Button } from "@chakra-ui/react";

interface EventListProps {
    heading: string;
    events: Event[];
	classes?: string;
	hasAddBtn?: boolean;
}

const EventList: React.FC<EventListProps> = ({ heading, events, classes, hasAddBtn }) => {
	const isBookCard = heading === "Event Invitations";
	const buttonText = isBookCard ? "Book Now" : "View More";
	const [searchTerm, setSearchTerm] = useState("");
	const [isExpanded, setIsExpanded] = useState(false);
	const [reverseSorting, setReverseSorting] = useState(false);
	const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);
	const inputRef = useRef<HTMLInputElement>(null);

	const { setContent } = useContent();

    const handleCardClick = (event: Event) => {
		if (isBookCard) {
        	setContent(<EventForm eventData={event}/>, event.name);
		} else {
			setSelectedEvent(event); // Store event data
            setIsDialogOpen(true); // Open modal
		}
    };

	return (
		<>
		<div className={`${styles.eventList}`}>
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
	
					{/* Sort Button */}
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
			<div className={`${styles.eventCardRow} ${reverseSorting ? styles.reverse : ""} ${classes}`}>
				{/* if hasAddBtn is true, render a card with a button to add a new event */}
				{hasAddBtn && (
					<div className={styles.addEventCard} onClick={() => void 0}>
						<div className={styles.addEventBox}>
						<Plus size={42} className={styles.plusIcon} />
					</div>
				</div>
				)}
				{events.filter((event) => event.name.toLowerCase().includes(searchTerm.toLowerCase())).map((event) => (
					<Card
						key={event.id}
						event={event}
						buttonText={buttonText}
						onClick={() => handleCardClick(event)}
					/>
				))}
			</div>
		</div>

		{/* Chakra UI Dialog */}
		<DialogRoot open={isDialogOpen} onOpenChange={({ open }) => setIsDialogOpen(open)}>
			<DialogBackdrop />
			<DialogContent>
				<DialogCloseTrigger />
				<DialogHeader>
					<DialogTitle>{selectedEvent?.name}</DialogTitle>
				</DialogHeader>
				<DialogBody>
					<p>{selectedEvent?.org}</p>
				</DialogBody>
				<DialogFooter>
					<Button onClick={() => setIsDialogOpen(false)}>Close</Button>
				</DialogFooter>
			</DialogContent>
		</DialogRoot>
		</>
  	);
};

export default EventList;
