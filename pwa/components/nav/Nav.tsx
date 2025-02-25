'use client';
import React from 'react';
import { signOut, useSession } from 'next-auth/react';
import { useContent } from 'Utils/ContentProvider';
import { LayoutDashboard, Settings2, CircleHelp, Bell, House, Menu, LogOut, CircleUserRound } from 'lucide-react';
import Dashboard from '../dashboard/Dashboard';
import Preferences from '../preferences/Preferences';
import EventAdminDashboard from 'Components/eventAdmin/EventAdminDashboard';
import About from '../about/About';
import styles from './nav.module.css';

const Nav: React.FC= () => {
    const [navCollapsed, setNavCollapsed] = React.useState<boolean>(false);
    const [imageError, setImageError] = React.useState<boolean>(false);
    const {data: session} = useSession();
    const { state, setContent } = useContent();
    
    const navLinks = [
        {
            name: 'Dashboard',
            content: <Dashboard />,
            icon: <LayoutDashboard size={28} />
        },
        {
            name: 'Event Planner',
            content: <EventAdminDashboard />,
            icon: <LayoutDashboard size={28} />
        },
        {
            name: 'Preferences',
            content: <Preferences />,
            icon: <Settings2 size={28} />
        },
        {
            name: 'About Us',
            content: <About />,
            icon: <CircleHelp size={28} />
        }
    ];

    return (
        <div className={`${styles.navContainer} ${navCollapsed ? styles.collapsed : ''}`}>
            <div className={styles.navHeader}>
                <div
                    className={styles.navHeaderIcon}
                    onClick={() => setContent(<Dashboard />, 'Dashboard')}
                >
                    <House size={28} />
                </div>
                <div className={styles.navHeaderRight}>
                    <div className={styles.navHeaderIcon}>
                        <Bell size={28} />
                    </div>
                    <div className={styles.navHeaderIcon}>
                        {session?.user?.image && !imageError ? (
                            <img
                                className={styles.profileIcon}
                                src={session.user.image}
                                alt="profile"
                                onError={() => setImageError(true)}
                            />
                        ) : (
                            <CircleUserRound size={28} />
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
                        className={`${styles.navLink} ${state.name === link.name ? styles.active : ''}`}
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
    );
};

export default Nav;
