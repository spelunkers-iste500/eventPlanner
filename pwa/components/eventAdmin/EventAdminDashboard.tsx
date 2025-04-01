// Importing necessary libraries and components
import React from "react";
import axios from "axios";
import EventList from "../common/EventList";
import MemberList from "../common/MemberList";
import CreateEventModal from "./CreateEventModal";
import ViewEventModal from "./ViewEventModal"; // Import the new modal for viewing event details
import { useUser } from "Utils/UserProvider";
import styles from "./EventAdminDashboard.module.css";
import { useSession } from "next-auth/react";
import { Organization } from "Types/organization";
import { Event } from "Types/event";
import { UserEvent } from "Types/userEvent";
import { AccordionItemBody, Stack, Text, Button } from "@chakra-ui/react"; // Import Button for the "Add Event" button

import {
    AccordionItem,
    AccordionItemContent,
    AccordionItemTrigger,
    AccordionRoot,
} from "Components/ui/accordion";
import { useState, useEffect } from "react";
import ItemList from "Components/itemList/ItemList";
import { Select, Portal, createListCollection } from "@chakra-ui/react"; // Import Select components

// Defining the Dashboard component
const Dashboard: React.FC = () => {
    // Using the useSession hook to get the current session data
    const { user } = useUser();
    const { data: session } = useSession();
    const [loading, setLoading] = useState(true);
    const [events, setEvents] = useState<Event[]>([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedEvent, setSelectedEvent] = useState<Event | null>(null); // State for the selected event
    const [isViewModalOpen, setIsViewModalOpen] = useState(false); // State for the event view modal
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false); // State for the create event modal
    const organizations = user?.eventAdminOfOrg; // Assuming user.eventAdminOfOrg contains organization IRIs
    const [orgObjects, setOrgObjects] = useState<Organization[]>([]); // State for organization objects
    const [selectedOrganization, setSelectedOrganization] =
        useState<string>("");

    useEffect(() => {
        if (!organizations) {
            setLoading(false);
            return;
        }
        // const orgs = organizations?.map((org) => {
        //     return new Organization(org["@id"]);
        // });
        setOrgObjects(organizations);
        setLoading(false);
    }, [organizations]);

    const orgCollection = createListCollection({
        items: orgObjects,
    });

    const handleOrganizationChange = (org: Organization) => {
        setSelectedOrganization(org.id);
    };

    const filteredEvents = events.filter(
        (event) =>
            !selectedOrganization ||
            event.organization?.id === selectedOrganization
    );

    const handleOpenModal = () => {
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
    };

    const handleOpenViewModal = (event: Event) => {
        setSelectedEvent(event);
        setIsViewModalOpen(true);
    };

    const handleCloseViewModal = () => {
        setSelectedEvent(null);
        setIsViewModalOpen(false);
    };

    const handleOpenCreateModal = () => {
        setIsCreateModalOpen(true);
    };

    const handleCloseCreateModal = () => {
        setIsCreateModalOpen(false);
    };

    // Defining a state variable to manage the accordion's value
    const [value, setValue] = useState(["pending-events"]);

    const apiUrl = `/my/organizations/events/eventAdmin`;
    const getEvents = async () => {
        if (user && session) {
            const events = await Event.allFromApiResponse(
                session.apiToken,
                "eventAdmin"
            );
            setEvents(events);
            // try {
            //     var response;
            //     var pageNumber = 1;
            //     var hasNextPage = true;
            //     // setup event array to eventually pass into setEvents()
            //     const events = [];
            //     while (hasNextPage) {
            //         response = await axios.get(`${apiUrl}?page=${pageNumber}`, {
            //             headers: {
            //                 Authorization: `Bearer ${session.apiToken}`,
            //             },
            //         });
            //         if (response.status === 200) {
            //             // if the current page is the last page, set hasNextPage to false
            //             if (
            //                 response.data["hydra:view"] &&
            //                 response.data["hydra:view"]["hydra:last"] !==
            //                     `${apiUrl}?page=${pageNumber}`
            //             ) {
            //                 // increment page number
            //                 pageNumber++;
            //             } else {
            //                 hasNextPage = false;
            //             }
            //             // push the events from the next page into the events array

            //             events.push(...response.data["hydra:member"]);
            //         }
            //     }
            //     // set the events to the state

            //     setLoading(false);
            // } catch (error) {
            //     console.error("Error:", error);
            // }
        }
    };

    useEffect(() => {
        if (user && session) {
            getEvents();
        }
    }, [user]);

    if (loading) {
        return <h2 className="loading">Loading...</h2>;
    }

    // Filtering events into current and past events based on the current date
    const currentEvents = events.filter((event) => !event.budget);
    const pastEvents = events.filter((event) => event.budget);

    // const mapEventsToUserEvents = (events: Event[]): UserEvent[] => {
    //     return events.map((event) => ({
    //         id: event.id.toString(),
    //         event,
    //         status: "pending",
    //         flights: [],
    //     }));
    // };

    // Defining items for the accordion, including current events, past events, and members list
    const items = [
        {
            value: "pending-events",
            title: "Events Pending Approval",
            events: currentEvents,
        },
        {
            value: "approved-events",
            title: "Approved Events",
            events: pastEvents,
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

            {/* Add Event Button */}
            <Button onClick={handleOpenCreateModal} colorScheme="blue" mb={4}>
                Add Event
            </Button>

            {/* Organization Filter Dropdown */}
            <div className={styles.filterContainer}>
                <Select.Root
                    onValueChange={(e) => handleOrganizationChange(e.items[0])}
                    collection={orgCollection}
                >
                    <Select.HiddenSelect />
                    <Select.Label>Organization</Select.Label>
                    <Select.Control>
                        <Select.Trigger>
                            <Select.ValueText placeholder="All Organizations" />
                        </Select.Trigger>
                        <Select.IndicatorGroup>
                            <Select.Indicator />
                        </Select.IndicatorGroup>
                    </Select.Control>
                    <Portal>
                        <Select.Positioner>
                            <Select.Content>
                                {orgObjects.map((org) => (
                                    <Select.Item item={org} key={org.id}>
                                        {org.name}
                                    </Select.Item>
                                ))}
                            </Select.Content>
                        </Select.Positioner>
                    </Portal>
                </Select.Root>
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
                                <ItemList<Event>
                                    items={item.events}
                                    fields={[
                                        {
                                            key: "eventTitle",
                                            label: item.title,
                                        },
                                        { key: "status", label: "Status" },
                                    ]}
                                    renderItem={handleOpenViewModal} // Open the view modal on item click
                                />
                            </AccordionItemContent>
                        </AccordionItem>
                    ))}
                </AccordionRoot>
            </Stack>

            {/* View Event Modal */}
            {/* <ViewEventModal
                isOpen={isViewModalOpen}
                onClose={handleCloseViewModal}
                userEvent={selectedEvent}
            /> */}

            {/* Create Event Modal */}
            <CreateEventModal
                isOpen={isCreateModalOpen}
                onClose={handleCloseCreateModal}
                organizations={orgObjects}
            />
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
