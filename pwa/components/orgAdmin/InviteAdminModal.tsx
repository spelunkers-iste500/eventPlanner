import React, { useState } from "react";
import BaseDialog from "Components/common/BaseDialog";
import { X } from "lucide-react";
import styles from "../common/Dialog.module.css";
import axios from "axios";
import { useSession } from "next-auth/react";

interface InviteAdminModalProps {
    isOpen: boolean;
    onClose: () => void;
}

const InviteAdminModal: React.FC<InviteAdminModalProps> = ({
    isOpen,
    onClose,
}) => {
    const [emailInput, setEmailInput] = useState("");
    const [invites, setInvites] = useState<{ type: string; email: string }[]>(
        []
    );
    const [selectedType, setSelectedType] = useState(""); // Default to empty string
    const [eventAdmins, setEventAdmins] = useState<string[]>([]);
    const [financeAdmins, setFinanceAdmins] = useState<string[]>([]);
    const [organizationAdmins, setOrganizationAdmins] = useState<string[]>([]);
    const [error, setError] = useState("");
    const { data: session } = useSession();
    if (!session) {
        return null;
    }

    const validateEmail = (email: string) => /\S+@\S+\.\S+/.test(email);

    const handleAddEmail = () => {
        if (!emailInput || !validateEmail(emailInput)) {
            setError("Invalid email address format.");
            return;
        }

        if (!selectedType) {
            setError("Please select an invite type.");
            return;
        }
        setInvites([...invites, { type: selectedType, email: emailInput }]);
        // switch (selectedType) {
        //     case "Event Admin":
        //         setInvites([
        //             ...invites,
        //             { type: selectedType, email: emailInput },
        //         ]);
        //         break;
        //     case "Finance Admin":
        //         setFinanceAdmins([...financeAdmins, emailInput]);
        //         break;
        //     case "Organization Admin":
        //         setOrganizationAdmins([...organizationAdmins, emailInput]);
        //         break;
        //     default:
        //         break;
        // }

        setEmailInput(""); // Clear the email input
        setSelectedType(""); // Reset the dropdown to placeholder
        setError(""); // Clear any existing error
    };

    const handleDeleteEmail = (email: string, type: string) => {
        switch (type) {
            case "Event Admin":
                setEventAdmins(eventAdmins.filter((e) => e !== email));
                break;
            case "Finance Admin":
                setFinanceAdmins(financeAdmins.filter((e) => e !== email));
                break;
            case "Organization Admin":
                setOrganizationAdmins(
                    organizationAdmins.filter((e) => e !== email)
                );
                break;
            default:
                break;
        }
    };

    const sendInvite = async (invite: { type: string; email: string }) => {
        axios.post(
            "/organization_invites",
            {
                email: invite.email,
                type: invite.type,
            },
            {
                headers: {
                    "Content-Type": "application/ld+json",
                    Authorization: `Bearer ${session.apiToken}`,
                },
            }
        );
    };
    const handleSubmit = () => {
        invites.forEach((invite) => {
            sendInvite(invite)
                .then(() => {
                    setError("");
                })
                .catch((err) => {
                    console.error(err);
                    setError("Failed to send invite.");
                });
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
                {error && <div className={styles.errorMsg}>{error}</div>}
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
                        <option value="" disabled>
                            Select Invite Type
                        </option>
                        <option value="Event Admin">Event Admin</option>
                        <option value="Finance Admin">Finance Admin</option>
                        <option value="Organization Admin">
                            Organization Admin
                        </option>
                    </select>
                </div>
                <button
                    className={styles.fileUploadTrigger}
                    onClick={handleAddEmail}
                >
                    Add Email
                </button>
                <div className={styles.emailList}>
                    <h3>Event Admins</h3>
                    {eventAdmins.map((email, index) => (
                        <div key={index} className={styles.emailItem}>
                            <span>{email}</span>
                            <button
                                className={styles.dialogClose}
                                onClick={() =>
                                    handleDeleteEmail(email, "Event Admin")
                                }
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
                                onClick={() =>
                                    handleDeleteEmail(email, "Finance Admin")
                                }
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
                                onClick={() =>
                                    handleDeleteEmail(
                                        email,
                                        "Organization Admin"
                                    )
                                }
                            >
                                <X size={16} />
                            </button>
                        </div>
                    ))}
                </div>
                <button
                    className={styles.fileUploadTrigger}
                    onClick={handleSubmit}
                >
                    Send Invites
                </button>
            </div>
        </BaseDialog>
    );
};

export default InviteAdminModal;
