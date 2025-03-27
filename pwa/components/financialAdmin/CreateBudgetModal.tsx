import React, { useState } from 'react';
import BaseDialog from 'Components/common/BaseDialog';
import { DialogHeader, DialogBody, DialogTitle, Button, Input } from '@chakra-ui/react';
import { X } from 'lucide-react';
import styles from '../common/Dialog.module.css';
import { UserEvent } from 'Types/events';
import { useSession } from 'next-auth/react';
import axios from 'axios';
import { toaster } from 'Components/ui/toaster';

interface CreateBudgetModalProps {
    userEvent: UserEvent | null;
    isOpen: boolean;
    onClose: () => void;
}

const CreateBudgetModal: React.FC<CreateBudgetModalProps> = ({ isOpen, onClose, userEvent }) => {
    const { data: session } = useSession();
    const [perUserTotal, setPerUserTotal] = useState<number | ''>('');

    const handleSubmit = () => {
        if (perUserTotal) {
            if (session && userEvent) {
                axios.post(`/budgets`, {
                    id: userEvent.event.id,
                    perUserTotal: perUserTotal,
                    event: `/events/${userEvent.event.id}`,
                    organization: userEvent.event.organization.id,
                }, {
                    headers: { 
                        'Authorization': `Bearer ${session?.apiToken}`,
                        'Content-Type': 'application/ld+json',
                        'accept': 'application/ld+json',
                    }
                })
                .then((response) => {
                    console.log('Budget created:', response);
                    onClose();
                    toaster.create({
                        title: "Budget Created",
                        description: "Your budget has successfully been created.",
                        type: "success",
                        duration: 3000,
                        placement: 'top-end'
                    });
                })
                .catch((error) => {
                    console.error('Error occurred during budget creation:', error);
                    toaster.create({
                        title: "An error occurred",
                        description: "An error occurred while creating the budget.",
                        type: "error",
                        duration: 3000,
                    });
                });
            }
        } else {
            alert('Please enter a valid budget amount.');
        }
    };

    // Handle close and discard user input
    const handleClose = () => {
        setPerUserTotal(''); // Reset the input field
        onClose(); // Close the modal
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
                    <label className="input-label">Budget Allocated Per User</label>
                    <input
                        type="number"
                        id="perUserTotal"
                        value={perUserTotal}
                        onChange={(e) => setPerUserTotal(Number(e.target.value))}
                        className="input-field"
                        placeholder="Enter budget per user"
                        min={0}
                    />
                </div>
                <br />
                <Button onClick={handleSubmit}>Submit</Button>
            </DialogBody>
        </BaseDialog>
    );
};

export default CreateBudgetModal;