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
                {/* Name Input */}
                <div className="input-container">
                    <label className="input-label">Name</label>
                    <input
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="Enter organization name"
                        className="input-field"
                    />
                </div>

                {/* Description Input */}
                <div className="input-container">
                    <label className="input-label">Description</label>
                    <textarea
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        placeholder="Enter organization description"
                        className="input-field"
                    />
                </div>

                {/* Address Input */}
                <div className="input-container">
                    <label className="input-label">Address</label>
                    <input
                        type="text"
                        value={address}
                        onChange={(e) => setAddress(e.target.value)}
                        placeholder="Enter organization address"
                        className="input-field"
                    />
                </div>

                {/* Industry Input */}
                <div className="input-container">
                    <label className="input-label">Industry</label>
                    <input
                        type="text"
                        value={industry}
                        onChange={(e) => setIndustry(e.target.value)}
                        placeholder="Enter organization industry"
                        className="input-field"
                    />
                </div>
                <br></br>
                {/* Submit Button */}
                <div className="input-container">
                    <button className="dialog-button" onClick={handleSubmit}>
                        Create Organization
                    </button>
                </div>
            </div>
        </BaseDialog>
    );
};

export default CreateOrgModal;
