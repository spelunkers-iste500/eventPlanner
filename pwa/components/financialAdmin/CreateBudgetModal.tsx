import React, { useState } from 'react';
import BaseDialog from 'Components/common/BaseDialog';
import { DialogHeader, DialogBody, DialogTitle, Button, Input } from '@chakra-ui/react';
import { X } from 'lucide-react';
import styles from '../common/Dialog.module.css';

interface CreateBudgetModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSubmit: (budget: number) => void;
}

const CreateBudgetModal: React.FC<CreateBudgetModalProps> = ({ isOpen, onClose, onSubmit }) => {
    const [perUserTotal, setPerUserTotal] = useState<number | ''>('');

    const handleSubmit = () => {
        if (perUserTotal) {
            onSubmit(perUserTotal);
            onClose();
        } else {
            alert('Please enter a valid budget amount.');
        }
    };

    // Handle close and discard user input
    const handleDiscardAndClose = () => {
        setPerUserTotal(''); // Reset the input field
        onClose(); // Close the modal
    };

    return (
        <BaseDialog isOpen={isOpen} onClose={onClose}>
            <DialogHeader className={styles.dialogHeader}>
                <DialogTitle>Create Budget</DialogTitle>
                <button className={styles.dialogClose} onClick={handleDiscardAndClose}>
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
                    />
                </div>
                <br />
                <div className="input-container">
                    <Button onClick={handleSubmit}>Submit</Button>
                    <Button variant="ghost" onClick={handleDiscardAndClose} style={{ marginLeft: '10px' }}>
                        Close
                    </Button>
                </div>
            </DialogBody>
        </BaseDialog>
    );
};

export default CreateBudgetModal;