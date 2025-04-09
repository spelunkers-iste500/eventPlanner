// Importing necessary libraries and components
import React, { useEffect, useState } from "react";
import EventList from "../common/EventList";
import styles from "./FinancialAdminDashboard.module.css";
import dialogStyles from "../common/Dialog.module.css";
import CreateBudgetModal from "./CreateBudgetModal";
import { useSession } from "next-auth/react";
import { useUser } from "Utils/UserProvider";
import { Event } from "Types/event";
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
    const [selectedEvent, setSelectedEvent] = useState<Event>(new Event());
    const [selectedOrganization, setSelectedOrganization] =
        useState<Organization>(new Organization()); // State for the selected organization
    const [organizationOptions, setOrganizationOptions] = useState<
        { label: string; value: string }[]
    >([]);
    const organizations = user?.financeAdminOfOrg || []; // user.financeAdminOfOrg contains the organization IRI's, not organizaiton objects
    const [orgObjects, setOrgObjects] = useState<Organization[]>([]); // organization objects
    const [items, setItems] = useState<
        {
            value: string;
            title: string;
            organization: Organization;
            events: Event[];
        }[]
    >([]); // State for items in the accordion
    useEffect(() => {
        if (!session) return;
        const fetchOrganizations = async () => {
            try {
                organizations.forEach((org) => {
                    org.fetch(session.apiToken).then(() => {
                        return org;
                    });
                });
                setOrgObjects(organizations);
            } catch (error) {
                console.error("Error fetching organizations:", error);
            }
        };

        if (organizations.length > 0) {
            fetchOrganizations().then(() => {
                const mappedOptions = organizations.map((org) => ({
                    label: org.name || "Unnamed Organization",
                    value: org.id,
                }));
                setSelectedOrganization(organizations[0]);
                setOrganizationOptions(mappedOptions);
                Event.allFromApiResponse(session.apiToken, "financeAdmin").then(
                    (events) => {
                        console.debug("Fetched events:", events);
                        console.debug("Organizations:", organizations);
                        const items = organizations.map((org) => {
                            return {
                                value: org.id,
                                title: org.getName(),
                                organization: org,
                                events: events.filter(
                                    (event) => event.organization.id === org.id
                                ),
                            };
                        });
                        console.debug("Mapped items:", items);
                        setItems(items);
                        setEvents(events);
                    }
                );
            });
        }
    }, [organizations, user, session]);
    // have to get the organization objects from the API
    // organizations.forEach((org) => {
    //     axios.get(org).then((response) => {
    //         orgObjects.push(response.data);
    //     });
    // });
    const orgCollection = createListCollection({
        items: orgObjects,
    });

    // const handleOrganizationChange = (
    //     event: React.ChangeEvent<HTMLSelectElement>
    // ) => {
    //     setSelectedOrganization(event.target.value);
    // };

    // const filteredEvents = events.filter(
    //     (event) =>
    //         !selectedOrganization ||
    //         event.organization?.id === selectedOrganization
    // );

    // const filteredItems = [
    //     {
    //         value: "pending-events",
    //         title: "Events Pending Approval",
    //         events: filteredEvents.filter(
    //             (event) => event.budget.id == "pendingApproval"
    //         ),
    //     },
    //     {
    //         value: "approved-events",
    //         title: "Approved Events",
    //         events: filteredEvents.filter(
    //             (event) => event.budget.id != "pendingApproval"
    //         ),
    //     },
    // ];

    // filter events based on whether a budget exists or not
    // const pendingEvents = events.filter((event) => !event.budget);
    // const approvedEvents = events.filter((event) => event.budget);
    // const apiUrl = `/my/organizations/events/financeAdmin`;
    // // get the events from the API
    // const getEvents = async () => {
    //     if (user && session) {
    //         try {
    //             // setup event array to eventually pass into setEvents()
    //             Event.allFromApiResponse(session.apiToken, "financeAdmin").then(
    //                 (events) => {
    //                     console.debug("Fetched events:", events);
    //                     const items = orgObjects.map((org) => {
    //                         return {
    //                             value: org.id,
    //                             title: org.getName(),
    //                             organization: org,
    //                             events: events.filter(
    //                                 (event) => event.organization.id === org.id
    //                             ),
    //                         };
    //                     });
    //                     console.debug("Mapped items:", items);
    //                     setEvents(events);
    //                 }
    //             );
    //             // const events = [];
    //             // while (hasNextPage) {
    //             //     response = await axios.get(`${apiUrl}?page=${pageNumber}`, {
    //             //         headers: {
    //             //             Authorization: `Bearer ${session.apiToken}`,
    //             //         },
    //             //     });
    //             //     if (response.status === 200) {
    //             //         // if the current page is the last page, set hasNextPage to false
    //             //         if (
    //             //             response.data["hydra:view"] &&
    //             //             response.data["hydra:view"]["hydra:last"] !==
    //             //                 `${apiUrl}?page=${pageNumber}`
    //             //         ) {
    //             //             // increment page number
    //             //             pageNumber++;
    //             //         } else {
    //             //             hasNextPage = false;
    //             //         }
    //             //         // push the events from the next page into the events array
    //             //         events.push(...response.data["hydra:member"]);
    //             //     }
    //             // }
    //             // set the events to the state
    //             setEvents(events);
    //         } catch (error) {
    //             console.error("Error:", error);
    //         }
    //     }
    // };

    // useEffect(() => {
    //     getEvents();
    // }, [user]);

    // Defining accordion items for current events and past events
    // const items = [
    //     {
    //         value: "pending-events",
    //         title: "Events Pending Approval",
    //         events: mapEventsToUserEvents(pendingEvents),
    //     },
    //     {
    //         value: "approved-events",
    //         title: "Approved Events",
    //         events: mapEventsToUserEvents(approvedEvents),
    //     },
    // ];

    const handleOpenBudgetModal = (event: Event) => {
        setSelectedEvent(event);
        setIsBudgetModalOpen(true);
    };

    const handleCloseBudgetModal = () => {
        setSelectedEvent(new Event());
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
                            console.debug(d);
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
                        multiple
                        value={value}
                        onValueChange={(e) => setValue(e.value)}
                    >
                        {items.map((item, index) => (
                            <AccordionItem key={index} value={item.value}>
                                <AccordionItemTrigger>
                                    {item.title +
                                        `: ${item.events.length} Events`}
                                </AccordionItemTrigger>
                                <AccordionItemContent>
                                    <div className={styles.infoContainer}>
                                        <div className={styles.orgInfoBox}>
                                            <div
                                                className={
                                                    styles.orgImageWrapper
                                                }
                                            >
                                                <img
                                                    src="/media/event_image.jpg"
                                                    alt="Organization Logo"
                                                    className={styles.orgImage}
                                                />
                                            </div>
                                            <div className={styles.orgDetails}>
                                                <h2 className={styles.orgName}>
                                                    {item.organization.name}
                                                </h2>
                                                <p className={styles.orgType}>
                                                    Event Planning Organization
                                                </p>
                                            </div>
                                        </div>

                                        <div className={styles.statsBox}>
                                            <div className={styles.statItem}>
                                                <span
                                                    className={styles.statLabel}
                                                >
                                                    Approved Events:{" "}
                                                </span>
                                                <span
                                                    className={styles.statValue}
                                                >
                                                    {
                                                        item.events.filter(
                                                            (event) =>
                                                                event.status ===
                                                                "approved"
                                                        ).length
                                                    }
                                                </span>
                                            </div>
                                            <div className={styles.statItem}>
                                                <span
                                                    className={styles.statLabel}
                                                >
                                                    All Events:{" "}
                                                </span>
                                                <span
                                                    className={styles.statValue}
                                                >
                                                    {item.events.length}
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
                                        renderItem={handleOpenBudgetModal} // Open the view modal on item click
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
                event={selectedEvent}
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
