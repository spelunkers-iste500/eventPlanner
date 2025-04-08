"use client";

import React, { useState, useEffect } from "react";
import axios from "axios";
import { useSession } from "next-auth/react";
import styles from "../orgAdmin/AdminDashboard.module.css";
import CreateOrgModal from "./CreateOrgModal";
import ItemList from "../itemList/ItemList";
import { Organization } from "Types/organization";

const SystemAdminDashboard: React.FC = () => {
    const [isCreateOrgModalOpen, setIsCreateOrgModalOpen] = useState(false);
    const [organizations, setOrganizations] = useState<any[]>([]);
    const { data: session } = useSession();

    const handleOpenCreateOrgModal = () => {
        setIsCreateOrgModalOpen(true);
    };

    const handleCloseCreateOrgModal = () => {
        setIsCreateOrgModalOpen(false);
    };

    useEffect(() => {
        const fetchOrganizations = async () => {
            try {
                if (!session) {
                    throw new Error("Session not found");
                }
                Organization.allFromApiResponse(session.apiToken).then(
                    (orgs) => {
                        setOrganizations(orgs);
                        console.log("Organizations:", orgs);
                    }
                );
            } catch (error) {
                console.error("Error fetching organizations:", error);
            }
        };

        fetchOrganizations();
    }, [session]);

    const fields = [
        { key: "name", label: "Name" },
        { key: "description", label: "Description" },
        { key: "address", label: "Address" },
        { key: "industry", label: "Industry" },
    ];

    const renderItem = (organization: any) => (
        <div className={styles.listItemActions}>
            <button className={styles.actionButton}>Edit</button>
        </div>
    );

    return (
        <>
            <div className={styles.systemAdminSection}>
                <h1 className={styles.sectionTitle}>System Administrator</h1>
                <div className={styles.optionCard}>
                    <button
                        className={styles.actionButton}
                        onClick={handleOpenCreateOrgModal}
                    >
                        Create an Organization
                    </button>
                </div>

                {/* Create Organization Modal */}
                <CreateOrgModal
                    isOpen={isCreateOrgModalOpen}
                    onClose={handleCloseCreateOrgModal}
                />

                {/* Organization List */}
                <div className={styles.listContainer}>
                    <h2 className={styles.sectionTitle}>Organizations</h2>
                    <ItemList
                        items={organizations}
                        fields={fields}
                        renderItem={renderItem}
                    />
                </div>
            </div>
        </>
    );
};

export default SystemAdminDashboard;
