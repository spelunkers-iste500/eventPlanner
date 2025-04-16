import React, { useState } from "react";
import styles from "../common/Dialog.module.css";
import axios from "axios";
import { useSession } from "next-auth/react";
import { toaster } from "Components/ui/toaster";
import Input from "Components/common/Input";
import { Organization } from "Types/organization";
import { Box, Flex, Button } from "@chakra-ui/react";
import { X } from "lucide-react";
// Copyright (c) for portions of Lucide are held by Cole Bemis 2013-2022 as part of Feather (MIT). 
// All other copyright (c) for Lucide are held by Lucide Contributors 2022.

interface InviteAdminExtProps {
    org: Organization;
}

const InviteAdminExt: React.FC<InviteAdminExtProps> = ({ org }) => {
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
        invites.forEach((invite) => {
            var inviteType = "";
            switch (invite.type) {
                case "Event Admin":
                    inviteType = "eventAdmin";
                    break;
                case "Finance Admin":
                    inviteType = "financeAdmin";
                    break;
                case "Organization Admin":
                    inviteType = "admin";
                    break;
                default:
                    setError("Invalid invite type.");
                    return;
            }
            axios
                .post(
                    "/organizationInvite",
                    {
                        organization: org.getIri(),
                        expectedEmail: invite.email,
                        inviteType: inviteType,
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
            {error && <div className={`error-msg`}>{error}</div>}
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
            <button className={`outline-btn`} onClick={handleAddEmail}>
                Add Email
            </button>

            {invites.length !== 0 && (
                <>
                    <div className={styles.emailList}>
                        <h3>Invites</h3>
                        <Box maxH="20vh" overflowY="auto">
                            {invites.map((invite, index) => (
                                <Flex
                                    key={index}
                                    alignItems="center"
                                    mb={2}
                                    borderWidth="1px"
                                    p={2}
                                    borderRadius="md"
                                >
                                    <Box flex="1">
                                        {invite.email} - {invite.type}
                                    </Box>
                                    <Button
                                        variant="ghost"
                                        size="sm"
                                        onClick={() =>
                                            handleDeleteEmail(
                                                invite.email,
                                                invite.type
                                            )
                                        }
                                    >
                                        <X size={16} />
                                    </Button>
                                </Flex>
                            ))}
                        </Box>
                    </div>
                    <button
                        className={styles.fileUploadTrigger}
                        onClick={handleSubmit}
                    >
                        Send Invites
                    </button>
                </>
            )}
        </div>
    );
};

export default InviteAdminExt;
