import React, { ReactElement } from 'react';
import { LayoutDashboard, Settings2, Send, CircleHelp, Bell, House, Menu, LogOut, CircleUserRound } from 'lucide-react';
import { signOut } from 'next-auth/react';
import { Session } from 'next-auth';
import { ContentState } from '../../pages';
import Dashboard from '../dashboard/Dashboard';
import Preferences from '../preferences/Preferences';
import Contact from '../contact/Contact';
import FAQ from '../faq/FAQ';
import styles from './nav.module.css';

interface NavProps {
    session: Session;
    state: ContentState;
    setContent: (name: string, content: ReactElement) => void;
}

const Nav: React.FC<NavProps> = ({ session, state, setContent }) => {
    const [navCollapsed, setNavCollapsed] = React.useState<boolean>(false);

    const navLinks = [
        {
            name: 'Dashboard',
            content: <Dashboard />,
            icon: <LayoutDashboard size={28} />
        },
        {
            name: 'Preferences',
            content: <Preferences />,
            icon: <Settings2 size={28} />
        },
        {
            name: 'Contact Us',
            content: <Contact />,
            icon: <Send size={28} />
        },
        {
            name: 'FAQ',
            content: <FAQ />,
            icon: <CircleHelp size={28} />
        }
    ];

    return (
        <div className={`${styles.navContainer} ${navCollapsed ? styles.collapsed : ''}`}>
            <div className={styles.navHeader}>
                <div className={styles.navHeaderIcon}><House size={28} /></div>
                <div className={styles.navHeaderRight}>
                    <div className={styles.navHeaderIcon}>
                        <Bell size={28} />
                    </div>
                    <div className={styles.navHeaderIcon}>
                        {session?.user?.image ? (
                            <img className={styles.profileIcon} src={session.user.image} alt="profile" />
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
                        onClick={() => setContent(link.name, link.content)}
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
