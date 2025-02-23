import React from "react";
import EventList from "../common/EventList";
import MemberList from "../common/MemberList";
import styles from "./EventAdminDashboard.module.css";
import { useSession } from "next-auth/react";
import { Event } from "types/events";
import { Stack, Text } from "@chakra-ui/react"
import {
  AccordionItem,
  AccordionItemContent,
  AccordionItemTrigger,
  AccordionRoot,
} from "Components/ui/accordion"
import { useState } from "react"

const Dashboard: React.FC = () => {
  const { data: session } = useSession();
  const [value, setValue] = useState(["current-events"]);

  const events: Event[] = [
    { id: 1, img: "/media/event_image.jpg", name: "Event Name", org: "Organization Name", eventDate: "2025-07-10T09:00:00", departureDate: "2024-12-06T17:00:00" },
    { id: 2, img: "/media/event_image.jpg", name: "Event Steff", org: "Organization Ethan", eventDate: "2024-04-15T09:00:00", departureDate: "2024-12-10T07:00:00" },
    { id: 3, img: "/media/event_image.jpg", name: "Event Four", org: "Organization Three", eventDate: "2024-12-03T09:00:00" },
    { id: 4, img: "/media/event_image.jpg", name: "Event Ethan", org: "Organization Steff", eventDate: "2025-01-25T09:00:00" },
    { id: 5, img: "/media/event_image.jpg", name: "Event Sixty", org: "Organization Sixty", eventDate: "2024-08-05T09:00:00", departureDate: "2024-12-06T17:00:00" },
    { id: 6, img: "/media/event_image.jpg", name: "Event Sixty", org: "Organization Sixty", eventDate: "2024-08-05T09:00:00", departureDate: "2024-12-06T17:00:00" },
    { id: 7, img: "/media/event_image.jpg", name: "Event Sixty", org: "Organization Sixty", eventDate: "2024-08-05T09:00:00", departureDate: "2024-12-06T17:00:00" },
    { id: 8, img: "/media/event_image.jpg", name: "Event Sixty", org: "Organization Sixty", eventDate: "2024-08-05T09:00:00", departureDate: "2024-12-06T17:00:00" },
    { id: 9, img: "/media/event_image.jpg", name: "Event Sixty", org: "Organization Sixty", eventDate: "2024-08-05T09:00:00", departureDate: "2024-12-06T17:00:00" },
    { id: 10, img: "/media/event_image.jpg", name: "Event Sixty", org: "Organization Sixty", eventDate: "2024-08-05T09:00:00", departureDate: "2024-12-06T17:00:00" },
    { id: 11, img: "/media/event_image.jpg", name: "Event Sixty", org: "Organization Sixty", eventDate: "2024-08-05T09:00:00", departureDate: "2024-12-06T17:00:00" },
  ];

  const currentEvents = events.filter(event => new Date(event.eventDate) > new Date());
  const pastEvents = events.filter(event => new Date(event.eventDate) <= new Date());

  const members = [
    { firstName: "Casey", lastName: "Malley", email: "casey.malley@x3anto.com" },
    { firstName: "Gavin", lastName: "Hunsinger", email: "gavin.hunsinger@x3anto.com" },
    { firstName: "Ethan", lastName: "Logue", email: "ethan.logue@x3anto.com" },
    { firstName: "Steffen", lastName: "Barr", email: "steffen.barr@x3anto.com" },
    { firstName: "George", lastName: "Gabro", email: "george.gabro@x3anto.com" },
    { firstName: "Eddie", lastName: "Brotz", email: "eddie.brotz@x3anto.com" },
    { firstName: "Noelle", lastName: "Voelkel", email: "noelle.voelkel@x3anto.com" },
  ];

  const items = [
    { value: "current-events", title: "Current Events", events: currentEvents },
    { value: "past-events", title: "Past Events", events: pastEvents },
    { value: "members-list", title: "Members List", events: [] },
  ]

  return (
    <div className={styles.plannerDashboardContainer}>
      <h1 className={styles.heading}>Welcome, {session?.user?.name}!</h1>
      
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
            <p className={styles.orgType}>Event Planning Organization</p>
          </div>
        </div>
        
        <div className={styles.statsBox}>
          <div className={styles.statItem}>
            <span className={styles.statLabel}>Organization Members: </span>
            <span className={styles.statValue}>157</span>
          </div>
          <div className={styles.statItem}>
            <span className={styles.statLabel}>Upcoming Events: </span>
            <span className={styles.statValue}>12</span>
          </div>
          <div className={styles.statItem}>
            <span className={styles.statLabel}>All Events: </span>
            <span className={styles.statValue}>489</span>
          </div>
        </div>
      </div>
      <Stack gap="4">
      <Text fontWeight="medium">Expanded: {value.join(", ")}</Text>
      <AccordionRoot value={value} onValueChange={(e) => setValue(e.value)}>
        {items.map((item, index) => (
          <AccordionItem key={index} value={item.value}>
            <AccordionItemTrigger>{item.title}</AccordionItemTrigger>
            <AccordionItemContent>
              {item.value === "members-list" ? (
                <MemberList members={members} />
              ) : item.events.length > 0 ? (
                <EventList heading={item.title} events={item.events} />
              ) : (
                <Text>No events available</Text>
              )}
            </AccordionItemContent>
          </AccordionItem>
        ))}
      </AccordionRoot>
    </Stack>
    </div>
  );
};

export default Dashboard;