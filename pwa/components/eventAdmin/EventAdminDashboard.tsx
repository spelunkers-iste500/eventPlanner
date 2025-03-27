// Importing necessary libraries and components
import React from "react";
import axios from 'axios';
import EventList from "../common/EventList";
import MemberList from "../common/MemberList";
import CreateEventModal from "./CreateEventModal";
import { useUser } from "Utils/UserProvider";
import styles from "./EventAdminDashboard.module.css";
import { useSession } from "next-auth/react";
import { Event, UserEvent } from "Types/events";
import { Stack, Text } from "@chakra-ui/react"
import {AccordionItem, AccordionItemContent, AccordionItemTrigger, AccordionRoot} from "Components/ui/accordion"
import { useState, useEffect } from "react"

// Defining the Dashboard component
const Dashboard: React.FC = () => {
    // Using the useSession hook to get the current session data
    const { user } = useUser();
    const { data: session } = useSession();
    const [ loading, setLoading ] = useState(true);
    const [events, setEvents] = useState<Event[]>([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    
    const handleOpenModal = () => {
        setIsModalOpen(true);
    };
    
    const handleCloseModal = () => {
        setIsModalOpen(false);
    };
    
    // Defining a state variable to manage the accordion's value
    const [value, setValue] = useState(["pending-events"]);

    const getEvents = async () => {
        if (user && session) {
            try {
                const response = await axios.get(`${user.eventAdminOfOrg}/events`, {
                    headers: { 'Authorization': `Bearer ${session.apiToken}` }
                });
                if (response.status === 200) {
                    console.log('fetched organization events: ', response.data['hydra:member']);
                    setEvents(response.data['hydra:member']);
                    setLoading(false);
                }
            } catch (error) {
                console.error('Error:', error);
            }
        }
    };

    useEffect(() => {
        getEvents();
    }, [user]);

    if (loading) {
        return <h2 className='loading'>Loading...</h2>;
    }

    // Filtering events into current and past events based on the current date
    const currentEvents = events.filter(event => new Date(event.startDateTime) > new Date());
    const pastEvents = events.filter(event => new Date(event.startDateTime) <= new Date());
    
    const mapEventsToUserEvents = (events: Event[]): UserEvent[] => {
        return events.map(event => ({
            id: event.id.toString(),
            event,
            status: 'pending',
            flights: [], 
        }));
    };
    
    // Defining items for the accordion, including current events, past events, and members list
    const items = [
        { value: "pending-events", title: "Events Pending Approval", events: mapEventsToUserEvents(currentEvents) },
        { value: "approved-events", title: "Approved Events", events: mapEventsToUserEvents(pastEvents) },
        { value: "members-list", title: "Members List", events: [] },
    ];

    return (
        <div className={styles.plannerDashboardContainer}>
            <h1 className={styles.heading}>Welcome, {user?.name}!</h1>
            
            <div className={styles.infoContainer}>
                <div className={styles.orgInfoBox}>
                    <div className={styles.orgImageWrapper}>
                        <img 
                            src="/media/event_image.jpg"
                            alt="Organization Logo"
                            className={styles.orgImage}
                        />
                    </div>
                    <div className={styles.orgDetails}>
                        <h2 className={styles.orgName}>Organization Name</h2>
                        <p className={styles.orgType}>Event Planning Organization</p>
                    </div>
                </div>
                
                <div className={styles.statsBox}>
                    <div className={styles.statItem}>
                        <span className={styles.statLabel}>Organization Members: </span>
                        <span className={styles.statValue}>157</span>
                    </div>
                    <div className={styles.statItem}>
                        <span className={styles.statLabel}>Upcoming Events: </span>
                        <span className={styles.statValue}>12</span>
                    </div>
                    <div className={styles.statItem}>
                        <span className={styles.statLabel}>All Events: </span>
                        <span className={styles.statValue}>489</span>
                    </div>
                </div>
            </div>
            <Stack gap="4">
                <AccordionRoot value={value} onValueChange={(e) => setValue(e.value)}>
                    {items.map((item, index) => (
                        <AccordionItem key={index} value={item.value}>
                            <AccordionItemTrigger>{item.title}</AccordionItemTrigger>
                            <AccordionItemContent>
                                {item.value === "members-list" ? (
                                    <MemberList members={members} />
                                ) : item.events.length > 0 ? (
                                    <EventList heading={item.title} events={item.events} hasAddBtn={item.title === 'Events Pending Approval' && true} onAddEventClick={handleOpenModal} />
                                ) : (
                                    <Text>No events available</Text>
                                )}
                            </AccordionItemContent>
                        </AccordionItem>
                    ))}
                </AccordionRoot>
            </Stack>
            <CreateEventModal isOpen={isModalOpen} onClose={handleCloseModal} />
        </div>
    );
};

// Exporting the Dashboard component as the default export
export default Dashboard;

// Defining a list of dummy data events
const events: Event[] = [
    { 
        id: 1, 
        eventTitle: "Event Name", 
        budget: { id: "1", perUserTotal: 50000 },
        startDateTime: "2025-07-10T09:00:00", 
        endDateTime: "2025-07-10T17:00:00", 
        startFlightBooking: "2024-12-06T09:00:00", 
        endFlightBooking: "2024-12-10T17:00:00", 
        location: "Location One", 
        maxAttendees: 100, 
        organization: {id: "/organizations/62fe88b0-bda1-47d5-8076-a52e256a08d0", type: "Organization", name: "Spleunkers"}, 
        attendees: ["attendee1@example.com", "attendee2@example.com"], 
        financeAdmins: ["financeAdmin1@example.com"], 
        eventAdmins: ["eventAdmin1@example.com"],
        isAccepted: false,
        isDeclined: false
    },
    { 
        id: 2, 
        eventTitle: "Event Steff", 
        budget: { id: "1", perUserTotal: 50000 },
        startDateTime: "2024-04-15T09:00:00", 
        endDateTime: "2024-04-15T17:00:00", 
        startFlightBooking: "2024-12-10T09:00:00", 
        endFlightBooking: "2024-12-15T17:00:00", 
        location: "Location Two", 
        maxAttendees: 150, 
        organization: {id: "/organizations/62fe88b0-bda1-47d5-8076-a52e256a08d0", type: "Organization", name: "Spleunkers"}, 
        attendees: ["attendee3@example.com", "attendee4@example.com"], 
        financeAdmins: ["financeAdmin2@example.com"], 
        eventAdmins: ["eventAdmin2@example.com"],
        isAccepted: false,
        isDeclined: false
    },
    { 
        id: 3, 
        eventTitle: "Event Four", 
        budget: { id: "1", perUserTotal: 50000 },
        startDateTime: "2024-12-03T09:00:00", 
        endDateTime: "2024-12-03T17:00:00", 
        startFlightBooking: "2024-12-01T09:00:00", 
        endFlightBooking: "2024-12-04T17:00:00", 
        location: "Location Three", 
        maxAttendees: 200, 
        organization: {id: "/organizations/62fe88b0-bda1-47d5-8076-a52e256a08d0", type: "Organization", name: "Spleunkers"}, 
        attendees: ["attendee5@example.com", "attendee6@example.com"], 
        financeAdmins: ["financeAdmin3@example.com"], 
        eventAdmins: ["eventAdmin3@example.com"],
        isAccepted: false,
        isDeclined: false
    },
    { 
        id: 4, 
        eventTitle: "Event Ethan", 
        budget: { id: "1", perUserTotal: 50000 },
        startDateTime: "2025-01-25T09:00:00", 
        endDateTime: "2025-01-25T17:00:00", 
        startFlightBooking: "2025-01-23T09:00:00", 
        endFlightBooking: "2025-01-26T17:00:00", 
        location: "Location Four", 
        maxAttendees: 250, 
        organization: {id: "/organizations/62fe88b0-bda1-47d5-8076-a52e256a08d0", type: "Organization", name: "Spleunkers"}, 
        attendees: ["attendee7@example.com", "attendee8@example.com"], 
        financeAdmins: ["financeAdmin4@example.com"], 
        eventAdmins: ["eventAdmin4@example.com"],
        isAccepted: false,
        isDeclined: false
    },
    { 
        id: 5, 
        eventTitle: "Event Sixty", 
        budget: { id: "1", perUserTotal: 50000 },
        startDateTime: "2024-08-05T10:00:00", 
        endDateTime: "2024-08-05T18:00:00", 
        startFlightBooking: "2024-08-03T09:00:00", 
        endFlightBooking: "2024-08-06T17:00:00", 
        location: "Location Five", 
        maxAttendees: 300, 
        organization: {id: "/organizations/62fe88b0-bda1-47d5-8076-a52e256a08d0", type: "Organization", name: "Spleunkers"}, 
        attendees: ["attendee9@example.com", "attendee10@example.com"], 
        financeAdmins: ["financeAdmin5@example.com"], 
        eventAdmins: ["eventAdmin5@example.com"],
        isAccepted: false,
        isDeclined: false
    },
];

// Defining a list of members
const members = [
    { firstName: "Casey", lastName: "Malley", email: "casey.malley@x3anto.com" },
    { firstName: "Gavin", lastName: "Hunsinger", email: "gavin.hunsinger@x3anto.com" },
    { firstName: "Ethan", lastName: "Logue", email: "ethan.logue@x3anto.com" },
    { firstName: "Steffen", lastName: "Barr", email: "steffen.barr@x3anto.com" },
    { firstName: "George", lastName: "Gabro", email: "george.gabro@x3anto.com" },
    { firstName: "Eddie", lastName: "Brotz", email: "eddie.brotz@x3anto.com" },
    { firstName: "Noelle", lastName: "Voelkel", email: "noelle.voelkel@x3anto.com" },
];