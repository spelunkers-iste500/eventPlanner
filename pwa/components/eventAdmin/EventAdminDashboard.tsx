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
    if (!session) return;
    const [loading, setLoading] = useState(true);
    const [events, setEvents] = useState<Event[]>([]);
    const [selectedEvent, setSelectedEvent] = useState<Event | null>(null); // State for the selected event
    const [isViewModalOpen, setIsViewModalOpen] = useState(false); // State for the event view modal
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false); // State for the create event modal
    const organizations = user?.eventAdminOfOrg || []; // Assuming user.eventAdminOfOrg contains organization IRIs
    const [orgObjects, setOrgObjects] = useState<Organization[]>([]); // State for organization objects
    const [selectedOrganization, setSelectedOrganization] =
        useState<Organization>(new Organization()); // State for the selected organization
    if (organizations && organizations.length > 0) {
        organizations[0].fetch(session.apiToken).then((org) => {
            setSelectedOrganization(organizations[0]); // State for the selected organization
        });
    }

    useEffect(() => {
        const fetchOrganizations = async () => {
            try {
                console.debug(organizations);
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
            fetchOrganizations().then(() => {
                const mappedOptions = organizations.map((org) => ({
                    label: org.getName(),
                    value: org.id,
                }));
                setOrganizationOptions(mappedOptions);
            });
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

    const [value, setValue] = useState(["pending-events"]);

    const getEvents = async () => {
        if (user && session) {
            const events = await Event.allFromApiResponse(
                session.apiToken,
                "eventAdmin"
            );
            return events;
        }
    };

    useEffect(() => {
        getEvents().then((events) => {
            if (!events) {
                return;
            }
            setEvents(events);
            setLoading(false);
        });
    }, [user]);

    if (loading) {
        return <h2 className="loading">Loading...</h2>;
    }
    const items = organizations.map((org) => {
        return {
            value: org.id,
            title: org.getName(),
            organization: org,
            events: events.filter((event) => event.organization.id === org.id),
        };
    });

    // const items = [
    //     {
    //         value: "pending-events",
    //         title: "Events Pending Approval",
    //         events: currentEvents,
    //     },
    //     {
    //         value: "approved-events",
    //         title: "Approved Events",
    //         events: pastEvents,
    //     },
    // ];

    return (
        <div className={styles.plannerDashboardContainer}>
            <h1 className={styles.heading}>Welcome, {user?.name}!</h1>

            {/* Add Event Button */}
            <Button onClick={handleOpenCreateModal} colorScheme="blue" mb={4}>
                Add Event
            </Button>

            {/* Organization Filter Dropdown */}
            <div className={styles.filterContainer}>
                <Select
                    options={organizationOptions}
                    size="md"
                    isSearchable={false}
                    defaultValue={
                        organizationOptions.length > 0
                            ? {
                                  label: organizationOptions[0].label,
                                  value: organizationOptions[0].value,
                              }
                            : undefined
                    }
                    value={
                        selectedOrganization
                            ? {
                                  label: selectedOrganization.name,
                                  value: selectedOrganization.id,
                              }
                            : undefined
                    }
                    onChange={(option) => {
                        const selectedOrg = organizations?.find(
                            (org) => org.id === option?.value
                        );
                        if (selectedOrg) {
                            setSelectedOrganization(selectedOrg);
                        }
                    }}
                    className={`select-menu`}
                    classNamePrefix={"select"}
                />
            </div>

            <Stack gap="4">
                <AccordionRoot
                    multiple
                    value={value}
                    onValueChange={(e) => setValue(e.value)}
                >
                    {items.map((item, index) => (
                        <AccordionItem
                            key={index}
                            value={item.organization.getName()}
                        >
                            <AccordionItemTrigger>
                                {item.title}
                            </AccordionItemTrigger>
                            <AccordionItemContent>
                                <div className={styles.infoContainer}>
                                    <div className={styles.orgInfoBox}>
                                        <div className={styles.orgImageWrapper}>
                                            <img
                                                src="/media/event_image.jpg"
                                                alt={`${item.organization.getName()} Logo Image.`}
                                                className={styles.orgImage}
                                            />
                                        </div>
                                        <div className={styles.orgDetails}>
                                            <h2 className={styles.orgName}>
                                                {item.organization.getName()}
                                            </h2>
                                            <p className={styles.orgType}>
                                                {item.organization.description}
                                            </p>
                                        </div>
                                    </div>

                                    <div className={styles.statsBox}>
                                        <div className={styles.statItem}>
                                            <span className={styles.statLabel}>
                                                Pending Events:
                                            </span>
                                            <span className={styles.statValue}>
                                                {
                                                    item.events.filter(
                                                        (event) => {
                                                            return (
                                                                event.status ===
                                                                "pendingApproval"
                                                            );
                                                        }
                                                    ).length
                                                }
                                            </span>
                                        </div>
                                        <div className={styles.statItem}>
                                            <span className={styles.statLabel}>
                                                Approved Events:
                                            </span>
                                            <span className={styles.statValue}>
                                                {
                                                    item.events.filter(
                                                        (event) => {
                                                            return (
                                                                event.status !==
                                                                "pendingApproval"
                                                            );
                                                        }
                                                    ).length
                                                }
                                            </span>
                                        </div>
                                    </div>
                                </div>
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
