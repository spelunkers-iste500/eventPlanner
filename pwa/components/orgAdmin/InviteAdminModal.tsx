import React from "react";
import BaseDialog from "Components/common/BaseDialog";
import { X } from "lucide-react";
// Copyright (c) for portions of Lucide are held by Cole Bemis 2013-2022 as part of Feather (MIT). 
// All other copyright (c) for Lucide are held by Lucide Contributors 2022.
import styles from "../common/Dialog.module.css";
import InviteAdminExt from "./InviteAdminExt";
import { Organization } from "Types/organization";

interface InviteAdminModalProps {
    isOpen: boolean;
    onClose: () => void;
    organization: Organization | null;
}

const InviteAdminModal: React.FC<InviteAdminModalProps> = ({
    isOpen,
    onClose,
    organization,
}) => {
    const handleClose = () => {
        onClose();
    };
    if (!organization) {
        return null;
    }

    return (
        <BaseDialog isOpen={isOpen} onClose={handleClose}>
            <div className={styles.dialogHeader}>
                <h2 className={styles.dialogTitle}>Invite Admins</h2>
                <button className={styles.dialogClose} onClick={handleClose}>
                    <X />
                </button>
            </div>
            <div className={styles.dialogBody}>
                {organization ? (
                    <InviteAdminExt org={organization} />
                ) : (
                    <div className={styles.errorMsg}>
                        Please select an organization to invite admins.
                    </div>
                )}
            </div>
        </BaseDialog>
    );
};

export default InviteAdminModal;
