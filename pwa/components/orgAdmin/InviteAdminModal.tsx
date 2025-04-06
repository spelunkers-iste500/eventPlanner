import React, { useState } from "react";
import BaseDialog from "Components/common/BaseDialog";
import { X } from "lucide-react";
import styles from "../common/Dialog.module.css";

interface InviteAdminModalProps {
    isOpen: boolean;
    onClose: () => void;
}

const InviteAdminModal: React.FC<InviteAdminModalProps> = ({ isOpen, onClose }) => {
    const [emailInput, setEmailInput] = useState("");
    const [selectedType, setSelectedType] = useState("Event Admin");
    const [eventAdmins, setEventAdmins] = useState<string[]>([]);
    const [financeAdmins, setFinanceAdmins] = useState<string[]>([]);
    const [organizationAdmins, setOrganizationAdmins] = useState<string[]>([]);
    const [error, setError] = useState("");

    const validateEmail = (email: string) => /\S+@\S+\.\S+/.test(email);

    const handleAddEmail = () => {
        if (emailInput && validateEmail(emailInput)) {
            if (selectedType === "Event Admin") {
                setEventAdmins([...eventAdmins, emailInput]);
            } else if (selectedType === "Finance Admin") {
                setFinanceAdmins([...financeAdmins, emailInput]);
            } else if (selectedType === "Organization Admin") {
                setOrganizationAdmins([...organizationAdmins, emailInput]);
            }
            setEmailInput("");
            setError("");
        } else {
            setError("Invalid email address format.");
        }
    };

    const handleDeleteEmail = (email: string, type: string) => {
        if (type === "Event Admin") {
            setEventAdmins(eventAdmins.filter((e) => e !== email));
        } else if (type === "Finance Admin") {
            setFinanceAdmins(financeAdmins.filter((e) => e !== email));
        } else if (type === "Organization Admin") {
            setOrganizationAdmins(organizationAdmins.filter((e) => e !== email));
        }
    };

    const handleSubmit = () => {
        if (
            eventAdmins.length === 0 &&
            financeAdmins.length === 0 &&
            organizationAdmins.length === 0
        ) {
            setError("Please add at least one email.");
            return;
        }
        // API call logic will go here
        console.log("Inviting:", {
            eventAdmins,
            financeAdmins,
            organizationAdmins,
        });
        onClose();
    };

    return (
        <BaseDialog isOpen={isOpen} onClose={onClose}>
            <div className={styles.dialogHeader}>
                <h2 className={styles.dialogTitle}>Invite Admins</h2>
                <button className={styles.dialogClose} onClick={onClose}>
                    <X />
                </button>
            </div>
            <div className={styles.dialogBody}>
                <div className={styles.inputContainer}>
                    <label className={styles.inputLabel}>Email Address</label>
                    <input
                        type="text"
                        className={styles.inputField}
                        placeholder="Enter admin's email address"
                        value={emailInput}
                        onChange={(e) => setEmailInput(e.target.value)}
                    />
                </div>
                <div className={styles.inputContainer}>
                    <label className={styles.inputLabel}>Invite Type</label>
                    <select
                        className={styles.inputField}
                        value={selectedType}
                        onChange={(e) => setSelectedType(e.target.value)}
                    >
                        <option value="Event Admin">Event Admin</option>
                        <option value="Finance Admin">Finance Admin</option>
                        <option value="Organization Admin">Organization Admin</option>
                    </select>
                </div>
                <button className={styles.fileUploadTrigger} onClick={handleAddEmail}>
                    Add Email
                </button>
                {error && <div className={styles.errorMsg}>{error}</div>}
                <div className={styles.emailList}>
                    <h3>Event Admins</h3>
                    {eventAdmins.map((email, index) => (
                        <div key={index} className={styles.emailItem}>
                            <span>{email}</span>
                            <button
                                className={styles.dialogClose}
                                onClick={() => handleDeleteEmail(email, "Event Admin")}
                            >
                                <X size={16} />
                            </button>
                        </div>
                    ))}
                    <h3>Finance Admins</h3>
                    {financeAdmins.map((email, index) => (
                        <div key={index} className={styles.emailItem}>
                            <span>{email}</span>
                            <button
                                className={styles.dialogClose}
                                onClick={() => handleDeleteEmail(email, "Finance Admin")}
                            >
                                <X size={16} />
                            </button>
                        </div>
                    ))}
                    <h3>Organization Admins</h3>
                    {organizationAdmins.map((email, index) => (
                        <div key={index} className={styles.emailItem}>
                            <span>{email}</span>
                            <button
                                className={styles.dialogClose}
                                onClick={() => handleDeleteEmail(email, "Organization Admin")}
                            >
                                <X size={16} />
                            </button>
                        </div>
                    ))}
                </div>
                <button className={styles.fileUploadTrigger} onClick={handleSubmit}>
                    Send Invites
                </button>
            </div>
        </BaseDialog>
    );
};

export default InviteAdminModal;