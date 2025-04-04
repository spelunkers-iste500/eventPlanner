"use client";
import React from "react";
import { useRouter } from "next/navigation";
import FinancialAdminDashboard from "Components/financialAdmin/FinancialAdminDashboard";

const EventPlanner: React.FC = () => {
    const router = useRouter();

    return <FinancialAdminDashboard />;
};

export default EventPlanner;
