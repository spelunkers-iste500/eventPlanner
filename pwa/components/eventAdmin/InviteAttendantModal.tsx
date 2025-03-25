import React from 'react';
import { DialogHeader, DialogBody, DialogTitle, Button } from '@chakra-ui/react';
import BaseDialog from 'Components/common/BaseDialog';
import { X } from 'lucide-react';
import InviteAttendantExt from './InviteAttendantExt';

interface InviteAttendantModalProps {
    isOpen: boolean;
    onClose: () => void;
}

const InviteAttendantModal: React.FC<InviteAttendantModalProps> = ({ isOpen, onClose }) => {
    return (
        <BaseDialog isOpen={isOpen} onClose={onClose}>
            <DialogHeader display="flex" alignItems="center" justifyContent="space-between">
                <DialogTitle>Invite Attendants</DialogTitle>
                <Button variant="ghost" onClick={onClose}>
                    <X size={16} />
                </Button>
            </DialogHeader>
            <DialogBody>
                <InviteAttendantExt />
            </DialogBody>
        </BaseDialog>
    );
};

export default InviteAttendantModal;
