import React, { useState } from "react";
import styles from "../common/Dialog.module.css";
import axios from "axios";
import { useSession } from "next-auth/react";
import { toaster } from "Components/ui/toaster";
import Input from "Components/common/Input";

interface InviteAdminExtProps {
    organizationId: string | null;
}

const InviteAdminExt: React.FC<InviteAdminExtProps> = ({ organizationId }) => {
    const [emailInput, setEmailInput] = useState("");
    const [invites, setInvites] = useState<{ type: string; email: string }[]>(
        []
    );
    const [selectedType, setSelectedType] = useState("");
    const [error, setError] = useState("");
    const { data: session } = useSession();

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
        setEmailInput("");
        setSelectedType("");
        setError("");
    };

    const handleDeleteEmail = (email: string, type: string) => {
        setInvites(
            invites.filter(
                (invite) => invite.email !== email || invite.type !== type
            )
        );
    };

    const handleSubmit = () => {
        if (!organizationId) {
            setError("No organization selected.");
            return;
        }

        invites.forEach((invite) => {
            axios
                .post(
                    "/organizationInvite",
                    {
                        organization: organizationId,
                        email: invite.email,
                        type: invite.type,
                    },
                    {
                        headers: {
                            "Content-Type": "application/ld+json",
                            Authorization: `Bearer ${session?.apiToken}`,
                        },
                    }
                )
                .then(() => {
                    toaster.create({
                        title: "Invite Sent",
                        description: `Invite sent to ${invite.email}`,
                        type: "success",
                        duration: 5000,
                    });
                })
                .catch((err) => {
                    console.error(err);
                    setError("Failed to send invite.");
                });
        });
        setInvites([]);
    };

    return (
        <div className={styles.formContainer}>
            {error && <div className={styles.errorMsg}>{error}</div>}
            <Input
                label="Email Address"
                placeholder="Enter admin's email address"
                onChange={(value) => setEmailInput(value)}
            />
            <div className={styles.inputContainer}>
                <label className={styles.inputLabel}>Invite Type</label>
                <select
                    className={`select-menu vanilla`}
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
                <h3>Invites</h3>
                {invites.map((invite, index) => (
                    <div key={index} className={styles.emailItem}>
                        <span>
                            {invite.email} - {invite.type}
                        </span>
                        <button
                            className={styles.dialogClose}
                            onClick={() =>
                                handleDeleteEmail(invite.email, invite.type)
                            }
                        >
                            X
                        </button>
                    </div>
                ))}
            </div>
            <button className={styles.fileUploadTrigger} onClick={handleSubmit}>
                Send Invites
            </button>
        </div>
    );
};

export default InviteAdminExt;
