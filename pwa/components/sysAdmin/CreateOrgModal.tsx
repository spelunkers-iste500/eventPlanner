import React, { useState } from "react";
import BaseDialog from "Components/common/BaseDialog";
import { toaster } from "Components/ui/toaster";
import styles from "Components/common/Dialog.module.css";

interface CreateOrgModalProps {
    isOpen: boolean;
    onClose: () => void;
}

const CreateOrgModal: React.FC<CreateOrgModalProps> = ({ isOpen, onClose }) => {
    const [name, setName] = useState("");
    const [description, setDescription] = useState("");
    const [address, setAddress] = useState("");
    const [industry, setIndustry] = useState("");

    const handleSubmit = () => {
        if (name && description && address && industry) {
            const newOrganization = {
                name,
                description,
                address,
                industry,
            };

            console.log("New Organization:", newOrganization);

            setTimeout(() => {
                toaster.create({
                    title: "Organization Created",
                    description:
                        "Your organization has been created successfully.",
                    type: "success",
                    duration: 5000,
                });
                onClose();
            }, 1000);
        } else {
            toaster.create({
                title: "Error",
                description: "Please fill in all fields.",
                type: "error",
                duration: 5000,
            });
        }
    };

    return (
        <BaseDialog isOpen={isOpen} onClose={onClose}>
            <div className={styles.dialogHeader}>
                <h2 className={styles.dialogTitle}>Create Organization</h2>
                <button className={styles.dialogClose} onClick={onClose}>
                    &times;
                </button>
            </div>
            <div className={styles.dialogBody}>
                <div className={styles.dialogDetails}>
                    <label className={styles.dialogLabel}>Name</label>
                    <input
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="Enter organization name"
                        className={styles.dialogInput}
                    />
                </div>
                <div className={styles.dialogDetails}>
                    <label className={styles.dialogLabel}>Description</label>
                    <textarea
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        placeholder="Enter organization description"
                        className={styles.dialogTextarea}
                    />
                </div>
                <div className={styles.dialogDetails}>
                    <label className={styles.dialogLabel}>Address</label>
                    <input
                        type="text"
                        value={address}
                        onChange={(e) => setAddress(e.target.value)}
                        placeholder="Enter organization address"
                        className={styles.dialogInput}
                    />
                </div>
                <div className={styles.dialogDetails}>
                    <label className={styles.dialogLabel}>Industry</label>
                    <input
                        type="text"
                        value={industry}
                        onChange={(e) => setIndustry(e.target.value)}
                        placeholder="Enter organization industry"
                        className={styles.dialogInput}
                    />
                </div>
                <br></br>
                <div className={styles.dialogFooter}>
                    <button
                        className={styles.dialogButton}
                        onClick={handleSubmit}
                    >
                        Create Organization
                    </button>
                </div>
            </div>
        </BaseDialog>
    );
};

export default CreateOrgModal;
