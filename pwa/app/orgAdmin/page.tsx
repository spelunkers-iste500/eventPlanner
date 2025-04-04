"use client";
import React from "react";
import { useRouter } from "next/navigation";
import OrgAdminDashboard from "Components/orgAdmin/OrgAdminDashboard";

const OrgAdmin: React.FC = () => {
    const router = useRouter();

    return <OrgAdminDashboard />;
};

export default OrgAdmin;
