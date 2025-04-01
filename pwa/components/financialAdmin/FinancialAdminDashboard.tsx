// Importing necessary libraries and components
import React, { useEffect, useState } from "react";
import EventList from "../common/EventList";
import styles from "./FinancialAdminDashboard.module.css";
import dialogStyles from "../common/Dialog.module.css";
import CreateBudgetModal from "./CreateBudgetModal";
import { useSession } from "next-auth/react";
import { useUser } from "Utils/UserProvider";
import { Event } from "Types/event";
import { UserEvent } from "Types/userEvent";
import { Organization } from "Types/organization";
import {
    Button,
    Dialog,
    DialogBackdrop,
    DialogBody,
    DialogContent,
    DialogHeader,
    DialogRoot,
    DialogTitle,
    Stack,
    Text,
    Select,
    Portal,
    createListCollection,
} from "@chakra-ui/react";
import {
    AccordionItem,
    AccordionItemContent,
    AccordionItemTrigger,
    AccordionRoot,
} from "Components/ui/accordion";
import ExportCsvModal from "./ExportCsvModal";
import axios from "axios";
import ItemList from "Components/itemList/ItemList";

const FinancialAdminDashboard: React.FC = () => {
    const { data: session } = useSession();
    const { user } = useUser();
    const [value, setValue] = useState(["pending-events"]);
    const [isExportDialogOpen, setIsExportDialogOpen] = useState(false);
    const [isBudgetModalOpen, setIsBudgetModalOpen] = useState(false);
    const [events, setEvents] = useState<Event[]>([]);
    const [selectedEvent, setSelectedEvent] = useState<UserEvent | null>(null);
    const [selectedOrganization, setSelectedOrganization] =
        useState<string>("");

    const organizations = user?.financeAdminOfOrg || []; // user.financeAdminOfOrg contains the organization IRI's, not organizaiton objects
    const [orgObjects, setOrgObjects] = useState<Organization[]>([]); // organization objects

    useEffect(() => {
        const fetchOrganizations = async () => {
            try {
                const fetchedOrgs = await Promise.all(
                    organizations.map(async (org) => {
                        const response = await axios.get(org, {
                            headers: {
                                Authorization: `Bearer ${session?.apiToken}`,
                            },
                        });
                        return response.data;
                    })
                );
                setOrgObjects(fetchedOrgs);
            } catch (error) {
                console.error("Error fetching organizations:", error);
            }
        };

        if (organizations.length > 0) {
            fetchOrganizations();
        }
    }, [organizations]);
    // have to get the organization objects from the API
    // organizations.forEach((org) => {
    //     axios.get(org).then((response) => {
    //         orgObjects.push(response.data);
    //     });
    // });
    const orgCollection = createListCollection({
        items: orgObjects,
    });

    const mapEventsToUserEvents = (events: Event[]): UserEvent[] => {
        return events.map((event) => ({
            id: event.id.toString(),
            event,
            status: "pending", // or 'accepted' based on your logic
            flights: [],
        }));
    };
    const handleOrganizationChange = (
        event: React.ChangeEvent<HTMLSelectElement>
    ) => {
        setSelectedOrganization(event.target.value);
    };

    const filteredEvents = events.filter(
        (event) =>
            !selectedOrganization ||
            event.organization?.id === selectedOrganization
    );

    const filteredItems = [
        {
            value: "pending-events",
            title: "Events Pending Approval",
            events: mapEventsToUserEvents(
                filteredEvents.filter((event) => !event.budget)
            ),
        },
        {
            value: "approved-events",
            title: "Approved Events",
            events: mapEventsToUserEvents(
                filteredEvents.filter((event) => event.budget)
            ),
        },
    ];

    // filter events based on whether a budget exists or not
    const pendingEvents = events.filter((event) => !event.budget);
    const approvedEvents = events.filter((event) => event.budget);
    const apiUrl = `/my/organizations/events/financeAdmin`;
    // get the events from the API
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
            } catch (error) {
                console.error("Error:", error);
            }
        }
    };

    useEffect(() => {
        getEvents();
    }, [user]);

    // Defining accordion items for current events and past events
    const items = [
        {
            value: "pending-events",
            title: "Events Pending Approval",
            events: mapEventsToUserEvents(pendingEvents),
        },
        {
            value: "approved-events",
            title: "Approved Events",
            events: mapEventsToUserEvents(approvedEvents),
        },
    ];

    const handleOpenBudgetModal = (event: UserEvent) => {
        setSelectedEvent(event);
        setIsBudgetModalOpen(true);
    };

    const handleCloseBudgetModal = () => {
        setSelectedEvent(null);
        setIsBudgetModalOpen(false);
    };

    // Dummy budget information - replace with API call results later
    const allocatedBudget = "$100,000";
    const budgetSpent = "$45,000";
    const remainingBudget = "$55,000";

    const handleOpenExportDialog = () => {
        setIsExportDialogOpen(true);
    };

    const handleCloseExportDialog = () => {
        setIsExportDialogOpen(false);
    };

    return (
        <>
            <div className={styles.plannerDashboardContainer}>
                <h1>Welcome, {session?.user?.name}!</h1>

                {/* Organization Filter Dropdown */}
                <div className={styles.filterContainer}>
                    <Select.Root
                        onValueChange={(d) => {
                            console.log(d);
                        }}
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

                {/* Organization and Budget Info Section */}
                <div className={styles.infoContainer}>
                    {/* Organization Info */}
                    <div className={styles.orgInfoBox}>
                        <div className={styles.orgImageWrapper}>
                            <img
                                src="/media/placeholder-event.jpg"
                                alt="Organization Logo"
                                className={styles.orgImage}
                            />
                        </div>
                        <div className={styles.orgDetails}>
                            <h2 className={styles.orgName}>
                                Organization Name
                            </h2>
                            <p className={styles.orgType}>
                                Financial Management Organization
                            </p>
                        </div>
                        {/* Export CSV Button */}
                        <div className={styles.exportButtonContainer}>
                            <button
                                className={styles.exportButton}
                                onClick={handleOpenExportDialog}
                            >
                                Export CSV
                            </button>
                        </div>
                    </div>

                    {/* Budget Summary */}
                    <div className={styles.statsBox}>
                        <div className={styles.statItem}>
                            <span className={styles.statLabel}>
                                Allocated Budget:{" "}
                            </span>
                            <span className={styles.statValue}>
                                {allocatedBudget}
                            </span>
                        </div>
                        <div className={styles.statItem}>
                            <span className={styles.statLabel}>
                                Budget Spent:{" "}
                            </span>
                            <span className={styles.statValue}>
                                {budgetSpent}
                            </span>
                        </div>
                        <div className={styles.statItem}>
                            <span className={styles.statLabel}>
                                Remaining Budget:{" "}
                            </span>
                            <span className={styles.statValue}>
                                {remainingBudget}
                            </span>
                        </div>
                    </div>
                </div>

                <Stack gap="4">
                    <AccordionRoot
                        value={value}
                        onValueChange={(e) => setValue(e.value)}
                    >
                        {filteredItems.map((item, index) => (
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
                                        renderItem={
                                            item.value == "pending-events"
                                                ? handleOpenBudgetModal
                                                : () => {}
                                        }
                                    />
                                </AccordionItemContent>
                            </AccordionItem>
                        ))}
                    </AccordionRoot>
                </Stack>
            </div>

            <CreateBudgetModal
                isOpen={isBudgetModalOpen}
                onClose={handleCloseBudgetModal}
                userEvent={selectedEvent}
            />

            <ExportCsvModal
                isOpen={isExportDialogOpen}
                onClose={handleCloseExportDialog}
                events={events}
            />
        </>
    );
};

export default FinancialAdminDashboard;
