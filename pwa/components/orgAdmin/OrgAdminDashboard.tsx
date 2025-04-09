"use client";

import React, { useState, useEffect } from "react";
import axios from "axios";
import styles from "./AdminDashboard.module.css";
import { useUser } from "Utils/UserProvider";
import { useSession } from "next-auth/react";
import SystemAdminDashboard from "../sysAdmin/SystemAdminDashboard";
import { Organization } from "Types/organization";
import InviteAdminModal from "./InviteAdminModal";
import { toaster } from "Components/ui/toaster";
import { Select } from "chakra-react-select";

const OrgAdminDashboard: React.FC = () => {
    const [selectedOrg, setSelectedOrg] = useState<string[]>([]);
    const [organizationOptions, setOrganizationOptions] = useState<
        { label: string; value: string; org: Organization }[]
    >([]);
    const [loading, setLoading] = useState(true);
    const { data: session } = useSession();
    const { user } = useUser();
    const [inviteAdminModalOpen, setInviteAdminModalOpen] = useState(false);

    const fetchOrganizations = async () => {
        try {
            if (!session) {
                throw new Error("Session not found");
            }
            var orgs = await Organization.allFromApiResponse(session.apiToken);
            const mappedOptions = orgs.map((org) => ({
                label: org.name || "Unnamed Organization",
                value: org.id,
                org: org,
            }));
            setOrganizationOptions(mappedOptions);
        } catch (error) {
            console.error("Error fetching organizations:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchOrganizations();
    }, []);

    if (loading) {
        return <h2 className="loading">Loading...</h2>;
    }

    const createFail = () => {
        //setContent(<Dashboard />, "Dashboard");
        toaster.create({
            title: "Invite Failed",
            description:
                "Please select an organization you would like to invite administrators to.",
            type: "error",
            duration: 5000,
        });
    };

    return (
        <div className={styles.dashboardContainer}>
            {/* Header Section */}
            <div className={styles.headerContainer}>
                {/* Organization Info Box */}
                <div className={styles.orgInfoBox}>
                    <h2 className={styles.orgName}>
                        {selectedOrg.length > 0
                            ? `Organization: ${
                                  organizationOptions.find((org) =>
                                      selectedOrg.includes(org.value)
                                  )?.label
                              }`
                            : "Select or create an organization"}
                    </h2>
                </div>

                {/* Organization Selector Box */}
                <div className={styles.orgSelectorBox}>
                    <div className="input-container">
                        <label className="input-label">
                            Select Organization
                        </label>
                        <Select
                            options={organizationOptions.map((org) => ({
                                label: org.label,
                                value: org.value,
                                org: org.org,
                            }))}
                            placeholder="Select Organization"
                            size="md"
                            isSearchable={false}
                            value={
                                selectedOrg.length > 0
                                    ? organizationOptions.find(
                                          (org) => org.value === selectedOrg[0]
                                      )
                                    : null
                            }
                            onChange={(option) => {
                                const selectedOrgValue = option?.value || null;
                                setSelectedOrg(
                                    selectedOrgValue ? [selectedOrgValue] : []
                                );
                            }}
                            className={`select-menu`}
                            classNamePrefix={"select"}
                        />
                    </div>
                </div>
            </div>

            {/* Main Dashboard Content */}
            <div className={styles.dashboardContent}>
                <h1 className={styles.dashboardTitle}>
                    Organization Administrator
                </h1>
                <div className={styles.optionsContainer}>
                    <div className={styles.optionCard}>
                        <p className={styles.optionDescription}>
                            Invite Event, Finance, or Organization
                            Administrators.
                        </p>
                        <button
                            className={styles.actionButton}
                            onClick={() => {
                                if (selectedOrg.length === 0) {
                                    createFail();
                                    return;
                                }
                                setInviteAdminModalOpen(true);
                            }}
                        >
                            Invite Admins
                        </button>
                    </div>
                </div>

                {/* System Admin Dashboard */}
                {user?.superAdmin && <SystemAdminDashboard />}
            </div>
            <InviteAdminModal
                isOpen={inviteAdminModalOpen}
                onClose={() => setInviteAdminModalOpen(false)}
                organization={
                    selectedOrg.length > 0
                        ? organizationOptions.find((org) =>
                              selectedOrg.includes(org.value)
                          )?.org || null
                        : null
                }
            />
        </div>
    );
};

export default OrgAdminDashboard;
