// Importing necessary libraries and components
import React from "react";
import axios from "axios";
import EventList from "../common/EventList";
import MemberList from "../common/MemberList";
import CreateEventModal from "./CreateEventModal";
import { useUser } from "Utils/UserProvider";
import styles from "./EventAdminDashboard.module.css";
import { useSession } from "next-auth/react";
import { Event, UserEvent } from "Types/events";
import { AccordionItemBody, Stack, Text } from "@chakra-ui/react";

import {
    AccordionItem,
    AccordionItemContent,
    AccordionItemTrigger,
    AccordionRoot,
} from "Components/ui/accordion";
import { useState, useEffect } from "react";
import ItemList from "Components/itemList/ItemList";
// Defining the Dashboard component
const Dashboard: React.FC = () => {
    // Using the useSession hook to get the current session data
    const { user } = useUser();
    const { data: session } = useSession();
    const [loading, setLoading] = useState(true);
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

    const apiUrl = `/my/organizations/events/eventAdmin`;
    const getEvents = async () => {
        if (user && session) {
            try {
                var response;
                var pageNumber = 1;
                var hasNextPage = true;
                // setup event array to eventually pass into setEvents()
                const events = [];
                while (hasNextPage) {
                    response = await axios.get(`${apiUrl}?page=${pageNumber}`, {
                        headers: {
                            Authorization: `Bearer ${session.apiToken}`,
                        },
                    });
                    if (response.status === 200) {
                        // if the current page is the last page, set hasNextPage to false
                        if (
                            response.data["hydra:view"] &&
                            response.data["hydra:view"]["hydra:last"] !==
                                `${apiUrl}?page=${pageNumber}`
                        ) {
                            // increment page number
                            pageNumber++;
                        } else {
                            hasNextPage = false;
                        }
                        // push the events from the next page into the events array

                        events.push(...response.data["hydra:member"]);
                    }
                }
                // set the events to the state
                setEvents(events);
                setLoading(false);
            } catch (error) {
                console.error("Error:", error);
            }
        }
    };

    useEffect(() => {
        getEvents();
    }, [user]);

    if (loading) {
        return <h2 className="loading">Loading...</h2>;
    }

    // Filtering events into current and past events based on the current date
    const currentEvents = events.filter((event) => !event.budget);
    const pastEvents = events.filter((event) => event.budget);

    const mapEventsToUserEvents = (events: Event[]): UserEvent[] => {
        return events.map((event) => ({
            id: event.id.toString(),
            event,
            status: "pending",
            flights: [],
        }));
    };

    // Defining items for the accordion, including current events, past events, and members list
    const items = [
        {
            value: "pending-events",
            title: "Events Pending Approval",
            events: mapEventsToUserEvents(currentEvents),
        },
        {
            value: "approved-events",
            title: "Approved Events",
            events: mapEventsToUserEvents(pastEvents),
        },
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
                        <p className={styles.orgType}>
                            Event Planning Organization
                        </p>
                    </div>
                </div>

                <div className={styles.statsBox}>
                    <div className={styles.statItem}>
                        <span className={styles.statLabel}>
                            Organization Members:{" "}
                        </span>
                        <span className={styles.statValue}>157</span>
                    </div>
                    <div className={styles.statItem}>
                        <span className={styles.statLabel}>
                            Upcoming Events:{" "}
                        </span>
                        <span className={styles.statValue}>12</span>
                    </div>
                    <div className={styles.statItem}>
                        <span className={styles.statLabel}>All Events: </span>
                        <span className={styles.statValue}>489</span>
                    </div>
                </div>
            </div>
            <Stack gap="4">
                <AccordionRoot
                    value={value}
                    onValueChange={(e) => setValue(e.value)}
                >
                    {items.map((item, index) => (
                        <AccordionItem key={index} value={item.value}>
                            <AccordionItemTrigger>
                                {item.title}
                            </AccordionItemTrigger>
                            <AccordionItemContent>
                                <ItemList
                                    items={item.events}
                                    fields={[
                                        {
                                            key: "event.eventTitle",
                                            label: item.title,
                                        },
                                        { key: "status", label: "Status" },
                                    ]}
                                    renderItem={handleOpenModal}
                                />
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

// Defining a list of members
const members = [
    {
        firstName: "Casey",
        lastName: "Malley",
        email: "casey.malley@x3anto.com",
    },
    {
        firstName: "Gavin",
        lastName: "Hunsinger",
        email: "gavin.hunsinger@x3anto.com",
    },
    { firstName: "Ethan", lastName: "Logue", email: "ethan.logue@x3anto.com" },
    {
        firstName: "Steffen",
        lastName: "Barr",
        email: "steffen.barr@x3anto.com",
    },
    {
        firstName: "George",
        lastName: "Gabro",
        email: "george.gabro@x3anto.com",
    },
    { firstName: "Eddie", lastName: "Brotz", email: "eddie.brotz@x3anto.com" },
    {
        firstName: "Noelle",
        lastName: "Voelkel",
        email: "noelle.voelkel@x3anto.com",
    },
];
