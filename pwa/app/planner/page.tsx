'use client';
import React from 'react';
import { useRouter } from 'next/navigation';
import EventAdminDashboard from 'Components/eventAdmin/EventAdminDashboard';

const EventPlanner: React.FC = () => {
    const router = useRouter();

    return (
        <EventAdminDashboard />
    );
};

export default EventPlanner;