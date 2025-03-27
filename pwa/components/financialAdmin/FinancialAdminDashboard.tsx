// Importing necessary libraries and components
import React, { useState } from "react";
import EventList from "../common/EventList";
import styles from "./FinancialAdminDashboard.module.css";
import dialogStyles from "../common/Dialog.module.css";
import { useSession } from "next-auth/react";
import { Event } from "Types/events";
import { Button, Dialog, DialogBackdrop, DialogBody, DialogContent, DialogHeader, DialogRoot, DialogTitle, Stack, Text } from "@chakra-ui/react";
import { AccordionItem, AccordionItemContent, AccordionItemTrigger, AccordionRoot } from "Components/ui/accordion";
import Input from "Components/common/Input";
import { X } from "lucide-react";

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

// Filtering events into current and past events based on the current date
const pendingEvents = events.filter(event => new Date(event.startDateTime) > new Date());
const approvedEvents = events.filter(event => new Date(event.startDateTime) <= new Date());

// Defining accordion items for current events and past events
const items = [
    { value: "pending-events", title: "Events Pending Approval", events: pendingEvents },
    { value: "approved-events", title: "Approved Events", events: approvedEvents },
];

const FinancialAdminDashboard: React.FC = () => {
    const { data: session } = useSession();
    const [value, setValue] = useState(["pending-events"]);
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    
    // CSV Export Search State
    const [csvSearchTerm, setCsvSearchTerm] = useState("");
    const [selectedExportEvent, setSelectedExportEvent] = useState<number | null>(null);
    // Filter all events based on the CSV search term
    const filteredExportEvents = events.filter((event) =>
        event.eventTitle.toLowerCase().includes(csvSearchTerm.toLowerCase())
    );

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
                  // <EventList heading={item.title} events={item.events} isFinance />
                  <p>EventList is here, need to fix errors</p>
                ) : (
                  <Text>No events available</Text>
                )}
              </AccordionItemContent>
            </AccordionItem>
          ))}
        </AccordionRoot>
      </Stack>
    </div>

        <div className={`${dialogStyles.dialogWrapper} ${isDialogOpen ? dialogStyles.open : ''}`}>
            <DialogRoot open={isDialogOpen} onOpenChange={({ open }) => setIsDialogOpen(open)}>
                <DialogBackdrop />
                <DialogContent className={dialogStyles.dialogContent}>
                    <DialogHeader>
                        <div className={dialogStyles.dialogHeader}>
                            <div>
                                <DialogTitle>Export CSV</DialogTitle>
                            </div>
                            <Button className={dialogStyles.dialogClose} onClick={() => setIsDialogOpen(false)}><X /></Button>
                        </div>
                    </DialogHeader>
                    <DialogBody className={dialogStyles.dialogBody}>
                        <div className={styles.exportCSVContainer}>
                            <h3>Export Budget CSV</h3>
                            <div className={styles.exportCSVForm}>
                                <Input
                                    label="Search Events"
                                    placeholder="Search events..."
                                    onChange={(value) => {
                                        setCsvSearchTerm(value);
                                        // Clear any previous selection if the user types something new
                                        if (value.trim() === "") {
                                            setSelectedExportEvent(null);
                                        }
                                    }}
                                />
                                {/* Only show search results when the search term is non-empty and no event is selected */}
                                {csvSearchTerm.trim() !== "" && !selectedExportEvent && (
                                    <div className={styles.searchResults}>
                                        {filteredExportEvents.length > 0 ? (
                                            filteredExportEvents.map((event) => (
                                                <div
                                                    key={event.id}
                                                    className={styles.searchResultItem}
                                                    onClick={() => {
                                                        setSelectedExportEvent(event.id);
                                                        setCsvSearchTerm(event.eventTitle);
                                                    }}
                                                >
                                                    {event.eventTitle}
                                                </div>
                                            ))
                                        ) : (
                                            <div className={styles.noResults}>No events found</div>
                                        )}
                                    </div>
                                )}
                                {/* Display the selected event and a clear option */}
                                {selectedExportEvent && (
                                    <div className={styles.selectedEventDisplay}>
                                        <span>
                                            Selected Event:{" "}
                                            {events.find((e) => e.id === selectedExportEvent)?.eventTitle}
                                        </span>
                                        <button
                                            className={styles.clearButton}
                                            onClick={() => {
                                                setSelectedExportEvent(null);
                                                setCsvSearchTerm("");
                                            }}
                                        >
                                            Clear
                                        </button>
                                    </div>
                                )}
                                <button
                                    className={styles.exportButton}
                                    onClick={() => {
                                        // Insert export logic here
                                    }}
                                >
                                    Export CSV
                                </button>
                            </div>
                        </div>
                    </DialogBody>
                </DialogContent>
            </DialogRoot>
        </div>
        </>
    );
};

export default FinancialAdminDashboard;
