import React from "react";
import EventList from "../dashboard/EventList";
import styles from "../dashboard/Dashboard.module.css";
import { useSession } from "next-auth/react";
import { Event } from "types/events";

const Dashboard: React.FC = () => {
  const { data: session } = useSession();

  const events: Event[] = [
    { id: 1, img: "/media/event_image.jpg", name: "Event Name", org: "Organization Name", eventDate: "Jul 10, 2025 • 9am", departureDate: "Dec 6, 2024 • 5pm" },
    { id: 2, img: "/media/event_image.jpg", name: "Event Steff", org: "Organization Ethan", eventDate: "Apr 15 - 9, 2024 • 9am - 5pm", departureDate: "Dec 10, 2024 • 7am" },
    { id: 3, img: "/media/event_image.jpg", name: "Event Four", org: "Organization Three", eventDate: "Dec 3, 2024 • 9am"},
    { id: 4, img: "/media/event_image.jpg", name: "Event Ethan", org: "Organization Steff", eventDate: "Jan 25, 2025 • 9am"},
    { id: 5, img: "/media/event_image.jpg", name: "Event Sixty", org: "Organization Sixty", eventDate: "Aug 5, 2024 • 9am", departureDate: "Dec 6, 2024 • 5pm" },
  ];

  return (
    <div className={styles.plannerDashboardContainer}>
      <h1 className={styles.heading}>Welcome, {session?.user?.name}!</h1>
      
      <div className={styles.infoContainer}>
        <div className={styles.orgInfoBox}>
          <div className={styles.orgImageWrapper}>
            <img 
              src="/media/org_logo.jpg" 
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

      <EventList heading="Event Invitations" events={events} />
      <EventList heading="Your Events" events={events} />
    </div>
  );
};

export default Dashboard;