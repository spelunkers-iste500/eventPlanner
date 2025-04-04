import React, { useState } from "react";
import BaseDialog from "Components/common/BaseDialog";
import {
    DialogHeader,
    DialogBody,
    DialogTitle,
    Button,
    Input,
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
    const [perUserTotal, setPerUserTotal] = useState<number | "">("");
    const [perUserOverage, setPerUserOverage] = useState<number | "">("");
    const { setContent } = useContent();
    const { user } = useUser();

    const handleSubmit = async () => {
        console.log("Event Object: ", event);
        if (perUserTotal && perUserOverage) {
            if (session && user) {
                const budget = new Budget();
                budget.perUserTotal = perUserTotal;
                budget.overage = perUserOverage; // change to total overage
                budget.event = event;
                budget.organization = user.financeAdminOfOrg[0];
                await budget.persist(session.apiToken);
                console.log("Persisted budget: ", budget);
                createSuccess();
                handleClose();

                // .post(
                //     `/budgets`,
                //     {
                //         perUserTotal: perUserTotal,
                //         overage: perUserOverage,
                //         event: `/events/${userEvent.event.id}`,
                //         organization: `${user?.financeAdminOfOrg}`,
                //     },
                //     {
                //         headers: {
                //             Authorization: `Bearer ${session?.apiToken}`,
                //             "Content-Type": "application/ld+json",
                //             accept: "application/ld+json",
                //         },
                //     }
                // )
                // .then((response) => {
                //     console.log("Budget created:", response);
                //     //onClose();
                //     userEvent.event.budget = response.data; // Update the budget in the userEvent object
                //     createSuccess();
                //     handleClose();
                // })
                // .catch((error) => {
                //     console.error(
                //         "Error occurred during budget creation:",
                //         error
                //     );
                //     setContent(<Dashboard />, "Dashboard");
                //     toaster.create({
                //         title: "An error occurred",
                //         description:
                //             "An error occurred while creating the budget.",
                //         type: "error",
                //         duration: 3000,
                //     });
                // });
            }
        } else {
            setContent(<Dashboard />, "Dashboard");
            toaster.create({
                title: "An error occurred",
                description: "Please enter a valid budget and overage.",
                type: "error",
                duration: 5000,
            });
        }
    };

    const createSuccess = () => {
        setContent(<Dashboard />, "Dashboard");
        toaster.create({
            title: "Budget Created",
            description: "Your budget has been successfully set.",
            type: "success",
            duration: 3000,
        });
    };

    const handleClose = () => {
        setPerUserTotal("");
        setPerUserOverage("");
        onClose();
    };

    return (
        <BaseDialog isOpen={isOpen} onClose={onClose}>
            <DialogHeader className={styles.dialogHeader}>
                <DialogTitle>Create Budget</DialogTitle>
                <button className={styles.dialogClose} onClick={handleClose}>
                    <X />
                </button>
            </DialogHeader>
            <DialogBody className={styles.dialogBody}>
                <div className="input-container">
                    <label className="input-label">
                        Budget Allocated Per User
                    </label>
                    <input
                        type="text"
                        id="perUserTotal"
                        value={
                            perUserTotal !== ""
                                ? `$${Number(perUserTotal).toLocaleString()}`
                                : ""
                        }
                        onChange={(e) => {
                            const value = e.target.value.replace(
                                /[^0-9.]/g,
                                ""
                            );
                            setPerUserTotal(value === "" ? "" : Number(value));
                        }}
                        className="input-field"
                        placeholder="Enter budget per user"
                    />
                </div>
                <div className="input-container">
                    <label className="input-label">User Overage</label>
                    <input
                        type="text"
                        id="perUserOverage"
                        value={
                            perUserOverage !== ""
                                ? `$${Number(perUserOverage).toLocaleString()}`
                                : ""
                        }
                        onChange={(e) => {
                            const value = e.target.value.replace(
                                /[^0-9.]/g,
                                ""
                            );
                            setPerUserOverage(
                                value === "" ? "" : Number(value)
                            );
                        }}
                        className="input-field"
                        placeholder="Enter overage per user"
                    />
                </div>
                <br />
                <Button onClick={handleSubmit}>Submit</Button>
            </DialogBody>
        </BaseDialog>
    );
};

export default CreateBudgetModal;
