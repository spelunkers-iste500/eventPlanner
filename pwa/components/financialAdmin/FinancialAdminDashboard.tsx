// Importing necessary libraries and components
import React, { useEffect, useState } from "react";
import styles from "./FinancialAdminDashboard.module.css";
import CreateBudgetModal from "./CreateBudgetModal";
import { useSession } from "next-auth/react";
import { useUser } from "Utils/UserProvider";
import { Event } from "Types/event";
import { Organization } from "Types/organization";
import { Stack, Select, Portal, createListCollection } from "@chakra-ui/react";
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
            budgetInfo: { total: number; spent: number; remaining: number };
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
                            // calculate the budget info for each organization
                            const orgEvents = events.filter(
                                (event) => event.organization.id === org.id
                            );
                            // total budget is each events budget per user total multiplied by the number of users
                            const totalBudget = orgEvents.reduce(
                                (acc, event) =>
                                    acc +
                                    (event.budget?.perUserTotal *
                                        event.maxAttendees || 0),
                                0
                            );
                            // add up every flights flightCost
                            const spentBudget = orgEvents.reduce(
                                (acc, event) =>
                                    acc +
                                    (event.flights?.reduce(
                                        (acc, flight) =>
                                            acc + flight.flightCost,
                                        0
                                    ) || 0),
                                0
                            );

                            return {
                                value: org.id,
                                title: org.getName(),
                                organization: org,
                                events: orgEvents,
                                budgetInfo: {
                                    total: totalBudget,
                                    spent: spentBudget,
                                    remaining: totalBudget - spentBudget,
                                },
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

    const orgCollection = createListCollection({
        items: orgObjects,
    });

    const handleOpenBudgetModal = (event: Event) => {
        setSelectedEvent(event);
        setIsBudgetModalOpen(true);
    };

    const handleCloseBudgetModal = () => {
        setSelectedEvent(new Event());
        setIsBudgetModalOpen(false);
    };

    // Dummy budget information - replace with API call results later
    // const allocatedBudget = "$100,000";
    // allocatedBudget should be the sum of all the budgets of the events in the organization

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
                <h1 className={styles.heading}>Welcome, {user?.name}!</h1>

                <Stack gap="4">
                    <AccordionRoot
                        multiple
                        value={value}
                        onValueChange={(e) => setValue(e.value)}
                    >
                        {items.map((item, index) => (
                            <AccordionItem key={index} value={item.value}>
                                <AccordionItemTrigger
                                    className={styles.accordionTrigger}
                                >
                                    {item.title +
                                        `: ${item.events.length} Events`}
                                </AccordionItemTrigger>
                                <AccordionItemContent>
                                    <div className={styles.infoContainer}>
                                        {/* Organization Info */}
                                        <div className={styles.orgInfoBox}>
                                            <div
                                                className={
                                                    styles.orgInfoWrapper
                                                }
                                            >
                                                <div
                                                    className={
                                                        styles.orgImageWrapper
                                                    }
                                                >
                                                    <img
                                                        src="/media/placeholder-event.jpg"
                                                        alt="Organization Logo"
                                                        className={
                                                            styles.orgImage
                                                        }
                                                    />
                                                </div>
                                                <div
                                                    className={
                                                        styles.orgDetails
                                                    }
                                                >
                                                    <h2
                                                        className={
                                                            styles.orgName
                                                        }
                                                    >
                                                        Organization Name
                                                    </h2>
                                                    <p
                                                        className={
                                                            styles.orgType
                                                        }
                                                    >
                                                        Financial Management
                                                        Organization
                                                    </p>
                                                </div>
                                            </div>

                                            {/* Export CSV Button */}
                                            <button
                                                className={styles.exportButton}
                                                onClick={handleOpenExportDialog}
                                            >
                                                Export CSV
                                            </button>
                                        </div>

                                        {/* Budget Summary */}
                                        <div className={styles.statsBox}>
                                            <div className={styles.statItem}>
                                                <span
                                                    className={styles.statLabel}
                                                >
                                                    Allocated Budget:
                                                </span>
                                                <span
                                                    className={styles.statValue}
                                                >
                                                    {`$${item.budgetInfo.total.toLocaleString()}`}
                                                </span>
                                            </div>
                                            <div className={styles.statItem}>
                                                <span
                                                    className={styles.statLabel}
                                                >
                                                    Budget Spent:
                                                </span>
                                                <span
                                                    className={styles.statValue}
                                                >
                                                    {`$${item.budgetInfo.spent.toLocaleString()}`}
                                                </span>
                                            </div>
                                            <div className={styles.statItem}>
                                                <span
                                                    className={styles.statLabel}
                                                >
                                                    Remaining Budget:
                                                </span>
                                                <span
                                                    className={styles.statValue}
                                                >
                                                    {`$${item.budgetInfo.remaining.toLocaleString()}`}
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
                                            {
                                                key: "getFriendlyStartDate",
                                                label: "Event Date",
                                            },
                                            {
                                                key: "status",
                                                label: "Status",
                                            },
                                            {
                                                key: "budget.perUserTotal",
                                                label: "Total Budget",
                                                valueFn: (event: Event) => {
                                                    // return the per user total of the budget multiplied by the number of users
                                                    if (!event.budget)
                                                        return "$0";
                                                    const totalBudget =
                                                        event.budget
                                                            .perUserTotal *
                                                        event.maxAttendees;
                                                    return `$${totalBudget.toLocaleString()}`;
                                                },
                                            },
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
