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
import { UserEvent } from "Types/events";
import { useContent } from "Utils/ContentProvider";
import EventForm from "Components/booking/EventForm";

interface EventListProps {
    heading: string;
    events: UserEvent[];
    classes?: string;
    hasAddBtn?: boolean;
    isFinance?: boolean;
    onOpenDialog?: (event: UserEvent) => void;
    onAddEventClick?: () => void; // Add this line
}

const EventList: React.FC<EventListProps> = ({ heading, events, classes, hasAddBtn, isFinance, onOpenDialog, onAddEventClick }) => {
    const isBookCard = heading === "Event Invitations";
    const pendingEvent = heading === "Events Pending Approval";
    const buttonText = isFinance ? (pendingEvent ? "Set Budget" : "View Budget") : isBookCard ? "Book Now" : "View More";
    const [searchTerm, setSearchTerm] = useState("");
    const [isExpanded, setIsExpanded] = useState(false);
    const [reverseSorting, setReverseSorting] = useState(false);
    const inputRef = useRef<HTMLInputElement>(null);

    const { setContent } = useContent();

    const handleCardClick = (userEvent: UserEvent) => {
        if (isBookCard) {
            setContent(<EventForm eventData={userEvent} />, userEvent.event.eventTitle);
        } else if (onOpenDialog) {
            onOpenDialog(userEvent);
        }
    };

    return (
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
                    <div className={styles.addEventCard} onClick={onAddEventClick}>
                        <div className={styles.addEventBox}>
                            <Plus size={36} className={styles.plusIcon} />
                        </div>
                    </div>
                )}
                {events.length === 0 && <p className={styles.noResults}>No events found.</p>}
                {events.filter((userEvent) => userEvent.event.eventTitle.toLowerCase().includes(searchTerm.toLowerCase())).map((userEvent, index) => (
                    <Card
                        key={`${userEvent.id}-${index}`}
                        userEvent={userEvent}
                        buttonText={buttonText}
                        isFinance={isFinance}
                        onClick={() => handleCardClick(userEvent)}
                    />
                ))}
            </div>
        </div>
    );
};

export default EventList;
