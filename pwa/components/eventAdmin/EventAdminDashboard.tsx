// Importing necessary libraries and components
import React, { useState, useEffect } from "react";
import CreateEventModal from "./CreateEventModal";
import { useUser } from "Utils/UserProvider";
import styles from "./EventAdminDashboard.module.css";
import { useSession } from "next-auth/react";
import { Event } from "Types/event";
import { Organization } from "Types/organization";
import { Stack, Button } from "@chakra-ui/react"; // Import Button for the "Add Event" button
import { Select } from "chakra-react-select";
import {
    AccordionItem,
    AccordionItemContent,
    AccordionItemTrigger,
    AccordionRoot,
} from "Components/ui/accordion";
import ItemList from "Components/itemList/ItemList";
import EditEventModal from "./EditEventModal";

// Defining the Dashboard component
const Dashboard: React.FC = () => {
    // Using the useSession hook to get the current session data
    const { user } = useUser();
    const { data: session } = useSession();
    const [loading, setLoading] = useState(true);
    const [events, setEvents] = useState<Event[]>([]);
    const [selectedEvent, setSelectedEvent] = useState<Event | null>(null); // State for the selected event
    const [isViewModalOpen, setIsViewModalOpen] = useState(false); // State for the event view modal
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false); // State for the create event modal
    const organizations = user?.eventAdminOfOrg || []; // Assuming user.eventAdminOfOrg contains organization IRIs
    const [orgObjects, setOrgObjects] = useState<Organization[]>([]); // State for organization objects
    const [selectedOrganization, setSelectedOrganization] =
        useState<Organization | null>(null);

    useEffect(() => {
        if (!session) return;
        const fetchOrganizations = async () => {
            try {
                console.debug(organizations);
                await organizations.forEach(async (org) => {
                    await org.fetch(session.apiToken);
                });
                setOrgObjects(organizations);
            } catch (error) {
                console.error("Error fetching organizations:", error);
            }
        };

        if (organizations.length > 0) {
            fetchOrganizations();
            const mappedOptions = organizations.map((org) => ({
                label: org.name || "Unnamed Organization",
                value: org.id,
            }));
            setOrganizationOptions(mappedOptions);
        }
    }, [organizations]);

    const [organizationOptions, setOrganizationOptions] = useState<
        { label: string; value: string }[]
    >([]);

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

    const getEvents = async () => {
        if (user && session) {
            const events = await Event.allFromApiResponse(
                session.apiToken,
                "eventAdmin"
            );
            setEvents(events);
            setLoading(false);
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
                <Select
                    options={organizationOptions}
                    placeholder="Select Organization"
                    size="md"
                    isSearchable={false}
                    value={
                        selectedOrganization
                            ? organizationOptions.find(
                                  (option) =>
                                      option.value === selectedOrganization?.id
                              )
                            : null
                    }
                    onChange={(option) => {
                        const selectedOrg = organizations?.find(
                            (org) => org.id === option?.value
                        );
                        setSelectedOrganization(selectedOrg || null);
                    }}
                    className={`select-menu`}
                    classNamePrefix={"select"}
                />
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
            <EditEventModal
                isOpen={isViewModalOpen}
                onClose={handleCloseViewModal}
                event={selectedEvent}
            />

            {/* Create Event Modal */}
            <CreateEventModal
                isOpen={isCreateModalOpen}
                onClose={handleCloseCreateModal}
                organizations={orgObjects}
            />
        </div>
    );
};

export default Dashboard;
