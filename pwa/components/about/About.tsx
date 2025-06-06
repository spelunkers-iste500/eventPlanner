import React from "react";
import styles from "./About.module.css";

type TeamMember = {
    name: string;
    info: string;
};

const teamMembers: TeamMember[] = [
    { name: "Casey Malley", info: "Project Manager" },
    { name: "Gavin Hunsinger", info: "Backend Developer" },
    { name: "Ethan Logue", info: "Frontend Developer" },
    { name: "Steffen Barr", info: "Frontend Developer" },
    { name: "Eddie Brotz", info: "Quality Assurance" },
    { name: "George Gabro", info: "Database Administrator" },
    { name: "Noelle Voelkel", info: "Developer" },
];

const FAQ: React.FC = () => {
    return (
        <div className={styles.aboutPage}>
            <h1 className={styles.title}>About Us</h1>
            <h2 className={styles.teamTitle}>Team Spelunkers</h2>
            <p className={styles.blurb}>
                Developers of this Event-Based Travel Planning System.
            </p>
            <div className={styles.teamSection}>
                {teamMembers.map((member, index) => (
                    <div key={index} className={styles.teamMember}>
                        <span className={styles.name}>{member.name}</span>
                        <span className={styles.info}>{member.info}</span>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default FAQ;
