import React, { useState } from "react";
import BaseDialog from "Components/common/BaseDialog";
import { toaster } from "Components/ui/toaster";
import { X } from "lucide-react";
import styles from "Components/common/Dialog.module.css";
import { Switch, Button } from "@chakra-ui/react";
import OrgAdminDashboard from "Components/orgAdmin/OrgAdminDashboard";
import { useContent } from "Utils/ContentProvider";
import axios from "axios";
import { Organization } from "Types/organization";
import { useSession } from "next-auth/react";

interface CreateOrgModalProps {
    isOpen: boolean;
    onClose: () => void;
}

const CreateOrgModal: React.FC<CreateOrgModalProps> = ({ isOpen, onClose }) => {
    const { setContent } = useContent();
    const [name, setName] = useState("");
    const [description, setDescription] = useState("");
    const [address, setAddress] = useState("");
    const [industry, setIndustry] = useState("");
    const [inviteAdmins, setInviteAdmins] = useState(false);
    const [adminEmails, setAdminEmails] = useState<string[]>([]);
    const [eventAdminEmails, setEventAdminEmails] = useState<string[]>([]);
    const [financeAdminEmails, setFinanceAdminEmails] = useState<string[]>([]);
    const [emailInput, setEmailInput] = useState("");
    const [selectedRole, setSelectedRole] = useState("");
    const [error, setError] = useState("");
    const { data: session } = useSession();
    if (!session) return null;
    const validateEmail = (email: string) => /\S+@\S+\.\S+/.test(email);

    const handleAddEmail = () => {
        if (!emailInput || !validateEmail(emailInput)) {
            setError("Invalid email address format.");
            return;
        }

        if (!selectedRole) {
            setError("Please select a role for the admin.");
            return;
        }

        if (selectedRole === "admin") {
            setAdminEmails([...adminEmails, emailInput]);
        } else if (selectedRole === "eventAdmin") {
            setEventAdminEmails([...eventAdminEmails, emailInput]);
        } else if (selectedRole === "financeAdmin") {
            setFinanceAdminEmails([...financeAdminEmails, emailInput]);
        }

        setEmailInput("");
        setSelectedRole("");
        setError("");
    };

    const handleDeleteEmail = (email: string, role: string) => {
        if (role === "admin") {
            setAdminEmails(adminEmails.filter((e) => e !== email));
        } else if (role === "eventAdmin") {
            setEventAdminEmails(eventAdminEmails.filter((e) => e !== email));
        } else if (role === "financeAdmin") {
            setFinanceAdminEmails(
                financeAdminEmails.filter((e) => e !== email)
            );
        }
    };

    const createSuccess = () => {
        setContent(<OrgAdminDashboard />, "OrgAdminDashboard");
        toaster.create({
            title: "Organization Created",
            description: "Your organization has been created.",
            type: "success",
            duration: 5000,
        });
        clearInputs();
        onClose();
    };

    const inviteSuccess = () => {
        setContent(<OrgAdminDashboard />, "OrgAdminDashboard");
        toaster.create({
            title: "Invitations Sent",
            description: "All invitations have been sent.",
            type: "success",
            duration: 5000,
        });
    };

    const handleSubmit = () => {
        if (name && description && address && industry) {
            const org = new Organization();
            org.setName(name);
            org.setDescription(description);
            org.setAddress(address);
            org.setIndustry(industry);
            console.log(org);
            org.persist(session.apiToken)
                .then(() => {
                    const invites = [
                        ...adminEmails.map((email) => ({
                            organization: org.getIri(),
                            expectedEmail: email,
                            inviteType: "admin",
                        })),
                        ...eventAdminEmails.map((email) => ({
                            organization: org.getIri(),
                            expectedEmail: email,
                            inviteType: "eventAdmin",
                        })),
                        ...financeAdminEmails.map((email) => ({
                            organization: org.getIri(),
                            expectedEmail: email,
                            inviteType: "financeAdmin",
                        })),
                    ];

                    const invitePromises = invites.map((invite) =>
                        axios.post("/organizationInvite", invite, {
                            headers: {
                                "Content-Type": "application/ld+json",
                                Authorization: `Bearer ${session.apiToken}`,
                            },
                        })
                    );

                    Promise.all(invitePromises)
                        .then(() => {
                            inviteSuccess();
                        })
                        .catch((err) => {
                            console.error(err);
                            toaster.create({
                                title: "Error",
                                description:
                                    "Failed to send one or more invitations.",
                                type: "error",
                                duration: 5000,
                            });
                        })
                        .finally(() => {
                            clearInputs();
                            createSuccess();
                        });
                })
                .catch((err) => {
                    console.error(err);
                    toaster.create({
                        title: "Error",
                        description: "Failed to create organization.",
                        type: "error",
                        duration: 5000,
                    });
                });
        } else {
            toaster.create({
                title: "Error",
                description: "Please fill in all fields.",
                type: "error",
                duration: 5000,
            });
        }
    };

    const clearInputs = () => {
        setName("");
        setDescription("");
        setAddress("");
        setIndustry("");
        setAdminEmails([]);
        setEventAdminEmails([]);
        setFinanceAdminEmails([]);
        setEmailInput("");
        setSelectedRole("");
        setError("");
    };

    const handleClose = () => {
        clearInputs();
        onClose();
    };

    return (
        <BaseDialog isOpen={isOpen} onClose={handleClose}>
            <div className={styles.dialogHeader}>
                <h2 className={styles.dialogTitle}>Create Organization</h2>
                <button className={styles.dialogClose} onClick={handleClose}>
                    <X />
                </button>
            </div>
            <div className={`${styles.dialogBody} ${styles.formContainer}`}>
                {/* Organization Details */}
                <div className="input-container">
                    <label className="input-label">Name</label>
                    <input
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="Enter organization name"
                        className="input-field"
                        maxLength={55}
                    />
                </div>
                <div className="input-container">
                    <label className="input-label">Description</label>
                    <textarea
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        placeholder="Enter organization description"
                        className="input-field"
                        maxLength={255}
                    />
                </div>
                <div className="input-container">
                    <label className="input-label">Address</label>
                    <input
                        type="text"
                        value={address}
                        onChange={(e) => setAddress(e.target.value)}
                        placeholder="Enter organization address"
                        className="input-field"
                        maxLength={255}
                    />
                </div>
                <div className="input-container">
                    <label className="input-label">Industry</label>
                    <input
                        type="text"
                        value={industry}
                        onChange={(e) => setIndustry(e.target.value)}
                        placeholder="Enter organization industry"
                        className="input-field"
                        maxLength={55}
                    />
                </div>

                {/* Switch to toggle admin invitation */}
                <Switch.Root checked={inviteAdmins}>
                    <Switch.HiddenInput
                        onChange={(e) => setInviteAdmins(e.target.checked)}
                    />
                    <Switch.Label>Invite admins now?</Switch.Label>
                    <Switch.Control />
                </Switch.Root>

                {/* Admin Invitation Section */}
                {inviteAdmins && (
                    <div className={styles.formContainer}>
                        <div className="input-container">
                            <label className="input-label">Admin Email</label>
                            <input
                                type="text"
                                value={emailInput}
                                onChange={(e) => setEmailInput(e.target.value)}
                                placeholder="Enter admin's email address"
                                className="input-field"
                            />
                        </div>
                        <div className="input-container">
                            <label className="input-label">Admin Role</label>
                            <select
                                value={selectedRole}
                                onChange={(e) =>
                                    setSelectedRole(e.target.value)
                                }
                                className="input-field"
                            >
                                <option value="" disabled>
                                    Select Role
                                </option>
                                <option value="admin">
                                    Organization Admin
                                </option>
                                <option value="eventAdmin">Event Admin</option>
                                <option value="financeAdmin">
                                    Finance Admin
                                </option>
                            </select>
                        </div>
                        <div
                            className={`input-container ${styles.dialogSubmitBtn}`}
                        >
                            <button
                                className={`outline-btn`}
                                onClick={handleAddEmail}
                            >
                                Add Admin
                            </button>
                        </div>
                        {error && (
                            <div className={styles.errorMsg}>{error}</div>
                        )}

                        {/* Display Added Admins */}
                        <div className={styles.emailList}>
                            {adminEmails.map((email, index) => (
                                <div key={index} className={styles.emailItem}>
                                    <span>{email} - Organization Admin </span>
                                    <Button
                                        variant="ghost"
                                        size="2xs"
                                        onClick={() =>
                                            handleDeleteEmail(email, "admin")
                                        }
                                    >
                                        <X size={16} />
                                    </Button>
                                </div>
                            ))}
                            {eventAdminEmails.map((email, index) => (
                                <div key={index} className={styles.emailItem}>
                                    <span>{email} - Event Admin </span>
                                    <Button
                                        variant="ghost"
                                        size="2xs"
                                        onClick={() =>
                                            handleDeleteEmail(
                                                email,
                                                "eventAdmin"
                                            )
                                        }
                                    >
                                        <X size={16} />
                                    </Button>
                                </div>
                            ))}
                            {financeAdminEmails.map((email, index) => (
                                <div key={index} className={styles.emailItem}>
                                    <span>{email} - Finance Admin </span>
                                    <Button
                                        variant="ghost"
                                        size="2xs"
                                        onClick={() =>
                                            handleDeleteEmail(
                                                email,
                                                "financeAdmin"
                                            )
                                        }
                                    >
                                        <X size={16} />
                                    </Button>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

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
