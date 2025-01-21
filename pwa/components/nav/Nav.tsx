import React from 'react';
import Welcome from '../../pages/welcome';
import { LayoutDashboard } from 'lucide-react';

interface NavProps {
}

const Nav: React.FC<NavProps> = ({  }) => {

    const navLinks = [
        {
            title: 'Dashboard',
            content: <Welcome />,
            icon: <LayoutDashboard />
        },
        {
            title: 'About',
            link: '/about'
        },
        {
            title: 'Contact',
            link: '/contact'
        },
        {
            title: 'Login',
            link: '/login'
        }
    ];

    return (
        <div className='nav-container'>
            <div className='nav-header'>
                {/* Home */}
                {/* Notifs */}
                {/* COllapse */}
            </div>
            <div className='nav-body'>
                {/* Links */}
            </div>
            <div className='nav-footer'>
                {/* Logout */}
            </div>
        </div>
    );
};

export default Nav;
