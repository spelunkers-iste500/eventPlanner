// Importing necessary libraries and components
import React, { useState } from "react";
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

// Dummy data for events (replace with API call data later)
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
  }
];

const FinancialAdminDashboard: React.FC = () => {
    const { data: session } = useSession();
    const { user } = useUser();
    const [value, setValue] = useState(["pending-events"]);
    const [isDialogOpen, setIsDialogOpen] = useState(false);

    // Filtering events into current and past events based on the current date
    const pendingEvents = events.filter(event => new Date(event.startDateTime) > new Date());
    const approvedEvents = events.filter(event => new Date(event.startDateTime) <= new Date());

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
    
    // CSV Export Search State
    const [csvSearchTerm, setCsvSearchTerm] = useState("");
    const [selectedExportEvent, setSelectedExportEvent] = useState<number | null>(null);
    // Filter all events based on the CSV search term
    const filteredExportEvents = events.filter((event) =>
        event.eventTitle.toLowerCase().includes(csvSearchTerm.toLowerCase())
    );

    const [isBudgetModalOpen, setIsBudgetModalOpen] = useState(false);
    const [selectedEvent, setSelectedEvent] = useState<UserEvent | null>(null);

    const handleOpenBudgetModal = (event: UserEvent) => {
        setSelectedEvent(event);
        setIsBudgetModalOpen(true);
    };

    const handleCloseBudgetModal = () => {
        setIsBudgetModalOpen(false);
    };

    // Dummy budget information - replace with API call results later
    const allocatedBudget = "$100,000";
    const budgetSpent = "$45,000";
    const remainingBudget = "$55,000";

    const handleExportClick = () => {
        setIsDialogOpen(true); // Open modal
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
                        <button className={styles.exportButton} onClick={handleExportClick}>
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

		{/* <ExportCsvModal /> */}
		
    </>
    );
};

export default FinancialAdminDashboard;
