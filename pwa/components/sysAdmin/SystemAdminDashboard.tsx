"use client";

import React, { useState } from "react";
import styles from "../orgAdmin/AdminDashboard.module.css";
import CreateOrgModal from "./CreateOrgModal";

const SystemAdminDashboard: React.FC = () => {
    const [isCreateOrgModalOpen, setIsCreateOrgModalOpen] = useState(false);

    const handleOpenCreateOrgModal = () => {
        setIsCreateOrgModalOpen(true);
    };

    const handleCloseCreateOrgModal = () => {
        setIsCreateOrgModalOpen(false);
    };

    return (
        <>
            <div className={styles.optionCard}>
                <h2 className={styles.optionTitle}>Create an organization</h2>
                <p className={styles.optionDescription}>Subtitle Text.</p>
                <button
                    className={styles.actionButton}
                    onClick={handleOpenCreateOrgModal}
                >
                    Create Organization
                </button>
            </div>

            {/* Create Organization Modal */}
            <CreateOrgModal
                isOpen={isCreateOrgModalOpen}
                onClose={handleCloseCreateOrgModal}
            />
        </>
    );
};

export default SystemAdminDashboard;
