"use client";

import React, { useState, useEffect } from "react";
import axios from "axios";
import styles from "./AdminDashboard.module.css";
import { useUser } from "Utils/UserProvider";
import { useSession } from "next-auth/react";
import { Portal, Select, createListCollection } from "@chakra-ui/react";
import SystemAdminDashboard from "../sysAdmin/SystemAdminDashboard";
import { Organization } from "Types/organization";
import InviteAdminModal from "./InviteAdminModal";
import { toaster } from "Components/ui/toaster";

const OrgAdminDashboard: React.FC = () => {
    const [selectedOrg, setSelectedOrg] = useState<string[]>([]);
    const [organizations, setOrganizations] = useState<
        { label: string; value: string; object: Organization }[]
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
            const orgObjects = orgs.map((org: any) => ({
                label: org.name,
                value: org.id,
                object: org,
            }));
            setOrganizations(orgObjects);
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

    const orgCollection = createListCollection({
        items: organizations,
    });

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
                                  organizations.find((org) =>
                                      selectedOrg.includes(org.value)
                                  )?.label
                              }`
                            : "Select or create an organization"}
                    </h2>
                </div>

                {/* Organization Selector Box */}
                <div className={styles.orgSelectorBox}>
                    <Select.Root
                        collection={orgCollection}
                        width="320px"
                        value={selectedOrg}
                        onValueChange={(e) => setSelectedOrg(e.value)}
                    >
                        <Select.HiddenSelect />
                        <Select.Label>Switch Organization</Select.Label>
                        <Select.Control>
                            <Select.Trigger>
                                <Select.ValueText placeholder="Select organization" />
                            </Select.Trigger>
                            <Select.IndicatorGroup>
                                <Select.Indicator />
                            </Select.IndicatorGroup>
                        </Select.Control>
                        <Portal>
                            <Select.Positioner>
                                <Select.Content>
                                    {organizations.map((org) => (
                                        <Select.Item item={org} key={org.value}>
                                            {org.label}
                                            <Select.ItemIndicator />
                                        </Select.Item>
                                    ))}
                                </Select.Content>
                            </Select.Positioner>
                        </Portal>
                    </Select.Root>
                </div>
            </div>

            {/* Main Dashboard Content */}
            <div className={styles.scrollableContent}>
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
                {user?.superAdmin && (
                    <div>
                        <SystemAdminDashboard />
                    </div>
                )}
            </div>
            <InviteAdminModal
                isOpen={inviteAdminModalOpen}
                onClose={() => setInviteAdminModalOpen(false)}
                organization={
                    selectedOrg.length > 0
                        ? organizations.find((org) =>
                              selectedOrg.includes(org.value)
                          )?.object || null
                        : null
                    // organizations.find((org) => selectedOrg.includes(org.value))
                    //     .object
                }
            />
        </div>
    );
};

export default OrgAdminDashboard;
