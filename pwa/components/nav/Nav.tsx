import React from 'react';
import Welcome from '../../pages/welcome';
import { LayoutDashboard, Settings2, Send, CircleHelp, Bell, House, Menu, LogOut } from 'lucide-react';
import styles from './nav.module.css';

interface NavProps {
    // Props
}

const Nav: React.FC<NavProps> = ({  }) => {

    const [navCollapsed, setNavCollapsed] = React.useState<boolean>(false);
    const [activeContent, setActiveContent] = React.useState<{ name: string, content: React.ReactNode }>({
        name: 'Dashboard',
        content: <Welcome />
    });


    const navLinks = [
        {
            name: 'Dashboard',
            content: <Welcome />,
            icon: <LayoutDashboard size={28} />
        },
        {
            name: 'Preferences',
            content: <Welcome />,
            icon: <Settings2 size={28} />
        },
        {
            name: 'Contact Us',
            content: <Welcome />,
            icon: <Send size={28} />
        },
        {
            name: 'FAQ',
            content: <Welcome />,
            icon: <CircleHelp size={28} />
        }
    ];

    return (
        <div className={`${styles.navContainer} ${navCollapsed ? styles.collapsed : ''}`}>
            <div className={styles.navHeader}>
                <div className={styles.navHeaderIcon}><House size={28} /></div>
                <div className={styles.navHeaderRight}>
                    <div className={styles.navHeaderIcon}><Bell size={28} /></div>
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
                        className={`${styles.navLink} ${activeContent.name === link.name ? styles.active : ''}`}
                        onClick={() => setActiveContent({ name: link.name, content: link.content })}
                    >
                        {link.icon}
                        <span>{link.name}</span>
                    </li>
                ))}
            </ul>
            <div className={styles.navFooter}>
                <div className={styles.logout}>
                    <LogOut size={28} />
                    <span>Logout</span>
                </div>
            </div>
        </div>
    );
};

export default Nav;
