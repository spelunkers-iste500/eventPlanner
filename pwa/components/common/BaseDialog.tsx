import React from 'react';
import { DialogRoot, DialogBackdrop, DialogContent } from '@chakra-ui/react';
import dialogStyles from './Dialog.module.css';

interface BaseDialogProps {
    isOpen: boolean;
    children: React.ReactNode;
    onClose: () => void;
}

const BaseDialog: React.FC<BaseDialogProps> = ({ isOpen, onClose, children }) => {
    return (
        <div className={`${dialogStyles.dialogWrapper} ${isOpen ? dialogStyles.open : ''}`}>
			<DialogRoot open={isOpen} onOpenChange={onClose}>
	            <DialogBackdrop />
	            <DialogContent className={dialogStyles.dialogContent}>
	                { children }
	            </DialogContent>
	        </DialogRoot>
		</div>
    );
};

export default BaseDialog;
