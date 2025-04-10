import React, { useEffect, useState } from "react";
import BaseDialog from "Components/common/BaseDialog";
import {
    DialogHeader,
    DialogBody,
    DialogTitle,
    Button,
} from "@chakra-ui/react";
import { X } from "lucide-react";
import styles from "../common/Dialog.module.css";
// import { UserEvent } from "Types/userEvent";
import { useSession } from "next-auth/react";
import { useContent } from "Utils/ContentProvider";
import axios from "axios";
import { toaster } from "Components/ui/toaster";
import { useUser } from "Utils/UserProvider";
import Dashboard from "./FinancialAdminDashboard";
import { Budget } from "Types/budget";
import { Event } from "Types/event";
import { Organization } from "Types/organization";
import Input from "Components/common/Input";
import { set } from "date-fns";

interface CreateBudgetModalProps {
    event: Event;
    isOpen: boolean;
    onClose: () => void;
}

const CreateBudgetModal: React.FC<CreateBudgetModalProps> = ({
    isOpen,
    onClose,
    event,
}) => {
    const { data: session } = useSession();
    const [perUserTotal, setPerUserTotal] = useState<number>(0);
    const [overage, setOverage] = useState<number>(0);
    const { user } = useUser();
    const [isEditing, setIsEditing] = useState(false);

    useEffect(() => {
        if (event.budget.perUserTotal > 0) {
            setPerUserTotal(event.budget.perUserTotal);
            setOverage(event.budget.overage);
            setIsEditing(true);
        }
    }, [event]);

    const handleSubmit = async () => {
        if (perUserTotal && overage) {
            if (session && user) {
                // if the event has a budget, update it
                if (event.budget) {
                    event.budget.perUserTotal = perUserTotal;
                    event.budget.overage = overage;
                    event.budget.organization = event.organization;
                    event.budget.event = event;
                    await event.budget.persist(session.apiToken);
                    toaster.create({
                        title: "Budget Updated",
                        description: "Your budget has been successfully set.",
                        type: "success",
                        duration: 3000,
                    });
                } else {
                    const budget = new Budget();
                    budget.perUserTotal = perUserTotal;
                    budget.overage = overage;
                    budget.event = event;
                    budget.organization = user.financeAdminOfOrg[0];
                    await budget.persist(session.apiToken);
                    event.budget = budget;
                    event.status = "approved";
                    await event.persist(session.apiToken);
                    toaster.create({
                        title: "Budget Created",
                        description: "Your budget has been successfully set.",
                        type: "success",
                        duration: 3000,
                    });
                }
                onClose();
            }
        } else {
            toaster.create({
                title: "An error occurred",
                description: "Please enter a valid budget and overage.",
                type: "error",
                duration: 5000,
            });
        }
    };

    const formatCurrency = (value: number): string =>
        new Intl.NumberFormat("en-US", {
            style: "currency",
            currency: "USD",
            maximumFractionDigits: 0,
        }).format(Math.round(value));

    return (
        <BaseDialog isOpen={isOpen} onClose={onClose}>
            <DialogHeader className={styles.dialogHeader}>
                <DialogTitle>
                    {isEditing ? "Edit Budget" : "Create Budget"}
                </DialogTitle>
                <button className={styles.dialogClose} onClick={onClose}>
                    <X />
                </button>
            </DialogHeader>
            <DialogBody
                className={`${styles.dialogBody} ${styles.formContainer}`}
            >
                <Input
                    label={`Budget per user, for up to ${event.maxAttendees} users`}
                    placeholder="Enter budget per user"
                    type="text"
                    defaultValue={formatCurrency(perUserTotal)}
                    onChange={(value) => {
                        const numericValue = value.replace(/[^0-9.]/g, "");
                        setPerUserTotal(
                            numericValue === "" ? 0 : Number(numericValue)
                        );
                    }}
                />
                <Input
                    label="Total Overage"
                    placeholder="Enter overage"
                    type="text"
                    defaultValue={formatCurrency(overage)}
                    onChange={(value) => {
                        const numericValue = value.replace(/[^0-9.]/g, "");
                        setOverage(
                            numericValue === "" ? 0 : Number(numericValue)
                        );
                    }}
                />
                <button onClick={handleSubmit}>Submit</button>
            </DialogBody>
        </BaseDialog>
    );
};

export default CreateBudgetModal;
