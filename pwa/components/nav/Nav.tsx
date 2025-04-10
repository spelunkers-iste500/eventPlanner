// This file defines a React functional component named `Nav` which serves as the navigation bar for the application.
// It uses several hooks and components from various libraries to manage state, handle user sessions, and render different parts of the navigation UI.

// The `useSession` hook from `next-auth/react` is used to get the current user session data.
// The `useContent` hook from a custom `ContentProvider` is used to manage the content displayed in the main area of the application.

// The component imports several icons from the `lucide-react` library to visually represent different navigation options.
// It also imports several other components that will be rendered as the content for different navigation links.

// The component maintains two pieces of state using React's `useState` hook:
// - `navCollapsed`: a boolean that determines whether the navigation bar is collapsed or expanded.
// - `imageError`: a boolean that tracks if there was an error loading the user's profile image.

// The `navLinks` array defines the different navigation options available in the application. Each link has a name, content component, and an icon.

// The `Nav` component returns a JSX structure that represents the navigation bar. This structure includes:
// - A header section with icons for the home page, notifications, user profile, and a menu button to collapse/expand the navigation bar.
// - A body section that lists all the navigation links defined in the `navLinks` array. Clicking on a link sets the corresponding content in the main area.
// - A footer section with a logout button that calls the `signOut` function from `next-auth/react` to log the user out.

// The component uses CSS modules for styling, with classes imported from `nav.module.css`.

// Finally, the `Nav` component is exported as the default export of the module.

"use client";
import React, { useState, useEffect, useRef } from "react";
import { signOut, useSession } from "next-auth/react";
import { useContent } from "Utils/ContentProvider";
import {
    LayoutDashboard,
    Settings2,
    CircleHelp,
    Bell,
    House,
    Menu,
    LogOut,
    CircleUserRound,
    Network,
    HandCoins,
    Shield,
} from "lucide-react";
import Dashboard from "../dashboard/Dashboard";
import Preferences from "../preferences/Preferences";
import EventAdminDashboard from "Components/eventAdmin/EventAdminDashboard";
import About from "../about/About";
import styles from "./nav.module.css";
import FinancialAdminDashboard from "Components/financialAdmin/FinancialAdminDashboard";
import { useUser } from "Utils/UserProvider";
import OrgAdminDashboard from "Components/orgAdmin/OrgAdminDashboard";
const Nav: React.FC = () => {
    const { state, setContent } = useContent();
    const { user } = useUser();

    const [navCollapsed, setNavCollapsed] = useState<boolean>(true);
    const [notifsOpen, setNotifsOpen] = useState<boolean>(false);
    const [userOpen, setUserOpen] = useState<boolean>(false);

    const notifsPopupRef = useRef<HTMLDivElement | null>(null);
    const userPopupRef = useRef<HTMLDivElement | null>(null);

    const navLinks = [
        {
            name: "Dashboard",
            content: <Dashboard />,
            icon: <LayoutDashboard size={28} />,
        },
    ];

    // filter nav links based off of user data
    if (user && user.eventAdminOfOrg.length > 0) {
        navLinks.push({
            name: "Event Planner",
            content: <EventAdminDashboard />,
            icon: <Network size={28} />,
        });
    }
    if (user && user.financeAdminOfOrg.length > 0) {
        navLinks.push({
            name: "Finance Admin",
            content: <FinancialAdminDashboard />,
            icon: <HandCoins size={28} />,
        });
    }
    if ((user && user.superAdmin) || (user && user.adminOfOrg.length > 0)) {
        navLinks.push({
            name: "Administrator",
            content: <OrgAdminDashboard />,
            icon: <Shield size={28} />,
        });
    }
    navLinks.push(
        // {
        //     name: "Preferences",
        //     content: <Preferences />,
        //     icon: <Settings2 size={28} />,
        // },
        {
            name: "About Us",
            content: <About />,
            icon: <CircleHelp size={28} />,
        }
    );

    useEffect(() => {
        if (window.innerWidth >= 768) {
            setNavCollapsed(false);
        }
    }, []);

    const handleOutsideClick = (event: MouseEvent) => {
        // Close notifications popup if the click is outside
        if (
            notifsPopupRef.current &&
            !notifsPopupRef.current.contains(event.target as Node)
        ) {
            setNotifsOpen(false);
        }

        // Close user popup if the click is outside
        if (
            userPopupRef.current &&
            !userPopupRef.current.contains(event.target as Node)
        ) {
            setUserOpen(false);
        }
    };

    useEffect(() => {
        if (notifsOpen || userOpen) {
            document.addEventListener("click", handleOutsideClick);
        } else {
            document.removeEventListener("click", handleOutsideClick);
        }

        // Cleanup the event listener on component unmount
        return () => {
            document.removeEventListener("click", handleOutsideClick);
        };
    }, [notifsOpen, userOpen]);

    const toggleNotifs = () => {
        setNotifsOpen((prev) => {
            if (!prev) setUserOpen(false); // Close user popup if notifications popup is opened
            return !prev;
        });
    };

    const toggleUser = () => {
        setUserOpen((prev) => {
            if (!prev) setNotifsOpen(false); // Close notifications popup if user popup is opened
            return !prev;
        });
    };

    return (
        <>
            <div
                className={`${styles.mobileNavWrapper} ${
                    !navCollapsed ? styles.open : ""
                }`}
            >
                <div className={styles.mobileNav}>
                    <div
                        className={styles.mobileNavToggle}
                        onClick={() => setNavCollapsed(!navCollapsed)}
                    >
                        <Menu size={28} />
                    </div>
                </div>
                <div
                    className={styles.mobileWrapper}
                    onClick={() => setNavCollapsed(!navCollapsed)}
                ></div>
            </div>
            <div
                className={`${styles.navContainer} ${
                    navCollapsed ? styles.collapsed : ""
                }`}
            >
                <div className={styles.navHeader}>
                    <div
                        className={styles.navHeaderIcon}
                        onClick={() => setContent(<Dashboard />, "Dashboard")}
                    >
                        <House size={28} />
                    </div>
                    <div className={styles.navHeaderRight}>
                        <div
                            className={`${styles.navHeaderIcon} ${
                                notifsOpen ? styles.active : ""
                            }`}
                        >
                            <Bell size={28} onClick={toggleNotifs} />
                            {notifsOpen && (
                                <div
                                    className={styles.popup}
                                    ref={notifsPopupRef}
                                >
                                    <p className={styles.noResults}>
                                        No new notifications
                                    </p>
                                </div>
                            )}
                        </div>
                        <div
                            className={`${styles.navHeaderIcon} ${
                                userOpen ? styles.active : ""
                            }`}
                        >
                            <CircleUserRound size={28} onClick={toggleUser} />
                            {userOpen && (
                                <div
                                    className={styles.popup}
                                    ref={userPopupRef}
                                >
                                    <p className={styles.userInfo}>
                                        Signed in as: <span>{user?.email}</span>
                                    </p>
                                </div>
                            )}
                        </div>
                        <div
                            className={styles.navHeaderIcon}
                            onClick={() => setNavCollapsed(!navCollapsed)}
                        >
                            <Menu size={28} />
                        </div>
                    </div>
                </div>
                <ul className={styles.navBody}>
                    {navLinks.map((link, index) => (
                        <li
                            key={index}
                            className={`${styles.navLink} ${
                                state.name === link.name ? styles.active : ""
                            }`}
                            onClick={() => setContent(link.content, link.name)}
                        >
                            {link.icon}
                            <span>{link.name}</span>
                        </li>
                    ))}
                </ul>
                <div className={styles.navFooter}>
                    <div className={styles.logout} onClick={() => signOut()}>
                        <LogOut size={28} />
                        <span>Logout</span>
                    </div>
                </div>
            </div>
        </>
    );
};

export default Nav;
