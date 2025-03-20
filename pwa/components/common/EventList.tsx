// This file defines a React functional component named `EventList` which is used to display a list of events in the application.

// The component imports several hooks and components from various libraries to manage state, handle content, and render different parts of the event list UI.

// The `useRef` and `useState` hooks from React are used to manage local state and references in the component.
// The `useContent` hook from a custom `ContentProvider` is used to manage the content displayed in the main area of the application.

// The component imports several icons from the `lucide-react` library to visually represent different actions and event details.
// It also imports a `Card` component to display individual event details and a `Dialog` component from `@chakra-ui/react` for displaying event details in a modal.

// The `EventListProps` interface defines the shape of the props that the `EventList` component expects. It includes a heading, an array of events, optional classes, and an optional flag to show an add button.

// The `EventList` component maintains several pieces of state using React's `useState` hook:
// - `searchTerm`: a string that stores the current search term for filtering events.
// - `isExpanded`: a boolean that determines whether the search input is expanded or collapsed.
// - `reverseSorting`: a boolean that determines whether the event list is sorted in reverse order.
// - `isDialogOpen`: a boolean that determines whether the event details dialog is open or closed.
// - `selectedEvent`: an object that stores the currently selected event for displaying in the dialog.

// The `inputRef` is used to reference the search input element for focusing and clearing the input.

// The `handleCardClick` function is defined to handle the click event on an event card. It sets the content to the `EventForm` component if the event is an invitation, otherwise it opens the event details dialog.

// The `EventList` component returns a JSX structure that represents the event list. This structure includes:
// - A header section with a heading, search input, and sort button.
// - A section displaying the event cards, which are filtered based on the search term and sorted based on the `reverseSorting` state.
// - An optional add button to add a new event if the `hasAddBtn` prop is true.
// - A `Dialog` component from `@chakra-ui/react` to display the event details in a modal when an event card is clicked.

// The component uses CSS modules for styling, with classes imported from `Dashboard.module.css`.

// Finally, the `EventList` component is exported as the default export of the module.

import React, { useRef, useState } from "react";
import styles from "../dashboard/Dashboard.module.css";
import { ArrowDownWideNarrow, ArrowUpWideNarrow, Calendar, CircleDollarSign, Clock, HandCoins, MapPin, PlaneLanding, PlaneTakeoff, Search, TowerControl, X, XCircle, Plus, MoveRight, Users, ArrowRight, Scale } from "lucide-react";
import Card from "./Card";
import { Event, formatDate, formatTime } from "Types/events";
import { useContent } from "Utils/ContentProvider";
import EventForm from "Components/booking/EventForm";
import { DialogRoot, DialogBackdrop, DialogContent, DialogCloseTrigger, DialogHeader, DialogTitle, DialogBody, DialogFooter, Button } from "@chakra-ui/react";

interface EventListProps {
    heading: string;
    events: Event[];
	classes?: string;
	hasAddBtn?: boolean;
	isFinance?: boolean;
}

const EventList: React.FC<EventListProps> = ({ heading, events, classes, hasAddBtn, isFinance }) => {
	const isBookCard = heading === "Event Invitations";
	const buttonText = isFinance ? "View Budget" : isBookCard ? "Book Now" : "View More";
	const [searchTerm, setSearchTerm] = useState("");
	const [isExpanded, setIsExpanded] = useState(false);
	const [reverseSorting, setReverseSorting] = useState(false);
	const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);
	const inputRef = useRef<HTMLInputElement>(null);

	const { setContent } = useContent();

    const handleCardClick = (event: Event) => {
		if (isBookCard) {
        	setContent(<EventForm eventData={event}/>, event.eventTitle);
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
						<Plus size={36} className={styles.plusIcon} />
					</div>
				</div>
				)}
				{events.filter((event) => event.eventTitle.toLowerCase().includes(searchTerm.toLowerCase())).map((event) => (
					<Card
						key={event.id}
						event={event}
						buttonText={buttonText}
						isFinance
						onClick={() => handleCardClick(event)}
					/>
				))}
			</div>
		</div>

		{/* Chakra UI Dialog */}
		<DialogRoot open={isDialogOpen} onOpenChange={({ open }) => setIsDialogOpen(open)}>
            <DialogBackdrop />
            <DialogContent className={styles.dialogContent}>
                <DialogHeader>
                    <img src={'/media/event_image.jpg'} alt={selectedEvent?.eventTitle} className={styles.dialogImg} />
                </DialogHeader>
                <DialogBody className={styles.dialogBody}>
                    <div className={styles.dialogBodyHeader}>
                        <div>
                            <DialogTitle>{selectedEvent?.eventTitle}</DialogTitle>
                            <p className={styles.dialogOrg}>{selectedEvent?.organization}</p>
                        </div>
                        <Button className={styles.dialogClose} onClick={() => setIsDialogOpen(false)}><X /></Button>
                    </div>

					<div className={styles.dialogBodyContent}>
						<div className={styles.dialogDetails}>
							<h3>Event Details</h3>
							<p><MapPin size={16}/><span>{selectedEvent?.location}</span></p>
							<p><Calendar size={16}/><span>{formatDate(selectedEvent?.startDateTime)} {formatDate(selectedEvent?.endDateTime) !== formatDate(selectedEvent?.startDateTime) ? `- ${formatDate(selectedEvent?.endDateTime)}` : ''}</span></p>
							<p><Clock size={16}/><span>{formatTime(selectedEvent?.startDateTime)} {selectedEvent?.endDateTime ? `- ${formatTime(selectedEvent?.endDateTime)}` : ''}</span></p>
							<p><Users size={16}/><span>{selectedEvent?.maxAttendees} Attendees</span></p>
							{/* <p><HandCoins size={16}/><span>${selectedEvent?.attendeeBudget}/attendee</span></p> */}
						</div>
						<div className={styles.dialogDetails}>
							<h3>Your Details</h3>
							{/* <p><TowerControl size={16}/><span className={styles.dialogAirports}>{selectedEvent?.originAirport} <ArrowRight /> {selectedEvent?.destinationAirport}</span></p> */}
							<p><TowerControl size={16}/><span className={styles.dialogAirports}>ROC <ArrowRight size={16} /> ORL</span></p>
							<p><PlaneTakeoff size={16}/><span>{formatDate(selectedEvent?.startFlightBooking)} • {formatTime(selectedEvent?.startFlightBooking)}</span></p>
							<p><PlaneLanding size={16}/><span>{formatDate(selectedEvent?.endFlightBooking)} • {formatTime(selectedEvent?.endFlightBooking)}</span></p>
							<p><CircleDollarSign size={16}/><span>$315/$500 used</span></p>
							{/* <p><CircleDollarSign size={16}/><span>{selectedEvent?.usedBudget}/{selectedEvent?.attendeeBudget} used</span></p> */}
						</div>
					</div>
                </DialogBody>
            </DialogContent>
        </DialogRoot>
		</>
  	);
};

export default EventList;
