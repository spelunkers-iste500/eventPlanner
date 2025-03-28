// Importing necessary libraries and components
import React, { useEffect, useState } from "react";
import EventList from "../common/EventList";
import styles from "./FinancialAdminDashboard.module.css";
import dialogStyles from "../common/Dialog.module.css";
import CreateBudgetModal from "./CreateBudgetModal";
import { useSession } from "next-auth/react";
import { useUser } from "Utils/UserProvider";
import { Event, UserEvent } from "Types/events";
import { Button, Dialog, DialogBackdrop, DialogBody, DialogContent, DialogHeader, DialogRoot, DialogTitle, Stack, Text } from "@chakra-ui/react";
import { AccordionItem, AccordionItemContent, AccordionItemTrigger, AccordionRoot } from "Components/ui/accordion";
import { X } from "lucide-react";
import ExportCsvModal from "./ExportCsvModal";
import { set } from "date-fns";
import axios from "axios";
import { NextResponse } from "next/server";

const FinancialAdminDashboard: React.FC = () => {
    const { data: session } = useSession();
    const { user } = useUser();
    const [value, setValue] = useState(["pending-events"]);
    const [isExportDialogOpen, setIsExportDialogOpen] = useState(false);
    const [isBudgetModalOpen, setIsBudgetModalOpen] = useState(false);
    const [events, setEvents] = useState<Event[]>([]);
    const [selectedEvent, setSelectedEvent] = useState<UserEvent | null>(null);

    // filter events based on whether a budget exists or not
    const pendingEvents = events.filter(event => !event.budget);
    const approvedEvents = events.filter(event => event.budget);
    const apiUrl = `${user?.financeAdminOfOrg}/events`;
    // get the events from the API
    const getEvents = async () => {
        if (user && session) {
            try {
                const response = await axios.get(apiUrl, {
                    headers: { 'Authorization': `Bearer ${session.apiToken}` }
                });
                if (response.status === 200) {
                    console.log('fetched organization events: ', response.data['hydra:member']);
                    // if the response is successful, check to see if more pages are required
                    // if so, make the next request
                    // and append the results to the events state
                    // Otherwise, just set the events state
                    // to the response data
                    const allEvents = response.data['hydra:member'];
                    if (response.data['hydra:view'] && response.data['hydra:view']['hydra:next']) {
                        var nextResponse = await axios.get(response.data['hydra:view']['hydra:next'], {
                            headers: { 'Authorization': `Bearer ${session.apiToken}` }
                        });
                        allEvents.push(...nextResponse.data['hydra:member']);
                        var nextUrl = response.data['hydra:view']['hydra:next'];
                        if (nextUrl !== response.data['hydra:view']['hydra:last']){
                        while (response.data['hydra:view']['hydra:last'] !== nextResponse.data['hydra:view']['hydra:next']) {
                            nextUrl = nextResponse.data['hydra:view']['hydra:next'];
                            if (nextResponse.data['hydra:view']['hydra:next']) {
                                break;
                            } else {
                            nextResponse = await axios.get(nextUrl, {
                                headers: { 'Authorization': `Bearer ${session.apiToken}` }
                            });
                                allEvents.push(...nextResponse.data['hydra:member']);
                        }
                        }}
                        setEvents(allEvents);
                        // setEvents(response.data['hydra:member']);
                    }
                }
            } catch (error) {
                console.error('Error:', error);
            }
        }
    };

    useEffect(() => {
        getEvents();
    }, [user]);

    const mapEventsToUserEvents = (events: Event[]): UserEvent[] => {
        return events.map(event => ({
            id: event.id.toString(),
            event,
            status: 'pending', // or 'accepted' based on your logic
            flights: [],
        }));
    };

    // Defining accordion items for current events and past events
    const items = [
        { value: "pending-events", title: "Events Pending Approval", events: mapEventsToUserEvents(pendingEvents) },
        { value: "approved-events", title: "Approved Events", events: mapEventsToUserEvents(approvedEvents) },
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
                        <h2 className={styles.orgName}>Organization Name</h2>
                        <p className={styles.orgType}>Financial Management Organization</p>
                    </div>
                    {/* Export CSV Button */}
                    <div className={styles.exportButtonContainer}>
                        <button className={styles.exportButton} onClick={handleOpenExportDialog}>
                            Export CSV
                        </button>
                    </div>
                </div>
                
                {/* Budget Summary */}
                <div className={styles.statsBox}>
                    <div className={styles.statItem}>
                        <span className={styles.statLabel}>Allocated Budget: </span>
                        <span className={styles.statValue}>{allocatedBudget}</span>
                    </div>
                    <div className={styles.statItem}>
                        <span className={styles.statLabel}>Budget Spent: </span>
                        <span className={styles.statValue}>{budgetSpent}</span>
                    </div>
                    <div className={styles.statItem}>
                        <span className={styles.statLabel}>Remaining Budget: </span>
                        <span className={styles.statValue}>{remainingBudget}</span>
                    </div>
                </div>
            </div>

           		<Stack gap="4">
                    <AccordionRoot value={value} onValueChange={(e) => setValue(e.value)}>
                        {items.map((item, index) => (
                            <AccordionItem key={index} value={item.value}>
                                <AccordionItemTrigger>{item.title}</AccordionItemTrigger>
                                <AccordionItemContent>
                                    {item.events.length > 0 ? (
                                        <EventList
                                            heading={item.title}
                                            events={item.events}
                                            isFinance
											onOpenDialog={handleOpenBudgetModal}
                                        />
                                    ) : (
                                        <Text>No events available</Text>
                                    )}
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
