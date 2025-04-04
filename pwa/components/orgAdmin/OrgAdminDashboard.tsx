"use client";

import React, { useState, useEffect } from "react";
import axios from "axios";
import styles from "./AdminDashboard.module.css";
import { useUser } from "Utils/UserProvider";
import { useSession } from "next-auth/react";
import { useContent } from "Utils/ContentProvider";
import { Portal, Select, createListCollection } from "@chakra-ui/react";

const OrgAdminDashboard: React.FC = () => {
    const [selectedOrg, setSelectedOrg] = useState<string[]>([]);
    const [organizations, setOrganizations] = useState<
        { label: string; value: string }[]
    >([]);
    const [loading, setLoading] = useState(true);
    const { data: session } = useSession();
    const { user } = useUser();

    // Fetch organizations of the current user
    const fetchOrganizations = async () => {
        try {
            const response = await axios.get("/my/organizations/", {
                headers: {
                    Authorization: `Bearer ${session?.apiToken}`,
                },
            });

            if (response.status === 200) {
                console.log(
                    "Organizations fetched successfully:",
                    response.data
                );
                const orgs = response.data["hydra:member"].map((org: any) => ({
                    label: org.name,
                    value: org.id,
                }));
                setOrganizations(orgs);
            }
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

    return (
        <div className={styles.dashboardContainer}>
            {/* Header Section */}
            <div className={styles.headerContainer}>
                {/* Organization Info Box */}
                <div className={styles.orgInfoBox}>
                    <h2 className={styles.orgName}>
                        {selectedOrg.length > 0
                            ? organizations.find((org) =>
                                  selectedOrg.includes(org.value)
                              )?.label
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
            <h1 className={styles.dashboardTitle}>Administrator Dashboard</h1>
            <div className={styles.optionsContainer}>
                <div className={styles.optionCard}>
                    <h2 className={styles.optionTitle}>
                        Create an organization
                    </h2>
                    <p className={styles.optionDescription}>Subtitle Text.</p>
                    <button className={styles.actionButton}>
                        Create Organization
                    </button>
                </div>
                <div className={styles.optionCard}>
                    <h2 className={styles.optionTitle}>
                        Invite event planners
                    </h2>
                    <p className={styles.optionDescription}>Subtitle Text.</p>
                    <button className={styles.actionButton}>
                        Invite Event Planners
                    </button>
                </div>
                <div className={styles.optionCard}>
                    <h2 className={styles.optionTitle}>
                        Invite financial admins
                    </h2>
                    <p className={styles.optionDescription}>Subtitle Text.</p>
                    <button className={styles.actionButton}>
                        Invite Financial Admins
                    </button>
                </div>
            </div>
        </div>
    );
};

export default OrgAdminDashboard;
