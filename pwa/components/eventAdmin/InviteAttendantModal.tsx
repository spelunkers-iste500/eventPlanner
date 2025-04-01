import React from 'react';
import { DialogHeader, DialogBody, DialogTitle, Button } from '@chakra-ui/react';
import BaseDialog from 'Components/common/BaseDialog';
import { X } from 'lucide-react';
import InviteAttendantExt from './InviteAttendantExt';
import { Event } from 'Types/event';

interface InviteAttendantModalProps {
    event: Event;
    isOpen: boolean;
    onClose: () => void;
}

const InviteAttendantModal: React.FC<InviteAttendantModalProps> = ({ event, isOpen, onClose }) => {
    return (
        <BaseDialog isOpen={isOpen} onClose={onClose}>
            <DialogHeader display="flex" alignItems="center" justifyContent="space-between">
                <DialogTitle>Invite Attendants</DialogTitle>
                <Button variant="ghost" onClick={onClose}>
                    <X size={16} />
                </Button>
            </DialogHeader>
            <DialogBody>
                <InviteAttendantExt createdEvent={event} />
            </DialogBody>
        </BaseDialog>
    );
};

export default InviteAttendantModal;
