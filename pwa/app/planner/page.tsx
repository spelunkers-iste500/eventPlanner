'use client';
import React from 'react';
import { useRouter } from 'next/navigation';
import Nav from "Components/nav/Nav";
import EventAdminDashboard from 'Components/eventAdmin/EventAdminDashboard';

const EventPlanner: React.FC = () => {
    const router = useRouter();

    return (
        <EventAdminDashboard />
    );
};

export default EventPlanner;