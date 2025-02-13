'use client';
import React from 'react';
import { useRouter } from 'next/navigation';
import PlannerDashboard from 'components/eventPlanner/PlannerDashboard';

const EventPlanner: React.FC = () => {
    const router = useRouter();

    return (
        <PlannerDashboard />
    );
};

export default EventPlanner;