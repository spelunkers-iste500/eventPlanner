import { DialogHeader, DialogBody, DialogTitle, Button, Skeleton, CloseButton, FileUpload, Input, InputGroup, Switch } from '@chakra-ui/react';
import axios from 'axios';
import BaseDialog from 'Components/common/BaseDialog';
import { X, MapPin, Calendar } from 'lucide-react';
import React, { useState } from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import styles from '../common/Dialog.module.css';
import { useSession } from 'next-auth/react';
import { LuFileUp } from 'react-icons/lu';
import InviteAttendantExt from './InviteAttendantExt';

interface CreateEventModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSubmit: (eventData: { eventTitle: string; startDateTime: Date; endDateTime: Date; location: string }) => void;
}

const CreateEventModal: React.FC<CreateEventModalProps> = ({ isOpen, onClose, onSubmit }) => {
    const { data: session } = useSession();
    const [eventTitle, setEventTitle] = useState('');
    const [location, setLocation] = useState('');
    const [startDate, setStartDate] = useState<Date | null>(null);
    const [endDate, setEndDate] = useState<Date | null>(null);
    const [eventImage, setEventImage] = useState<File | null>(null);
    const [inviteUsers, setInviteUsers] = useState(false);

    const handleSubmit = () => {
        if (eventTitle && startDate && endDate && location) {
            onSubmit({ eventTitle, startDateTime: startDate, endDateTime: endDate, location });
        }
        if (eventImage) {
            console.log(`Image received: ${eventImage.name}`);
        }
    };

    return (
        <BaseDialog isOpen={isOpen} onClose={onClose}>
            <DialogHeader>
                <DialogTitle>Create Event</DialogTitle>
            </DialogHeader>
            <DialogBody className={styles.dialogBody}>
                <div className='input-container'>
                    <Button className={styles.dialogClose} onClick={onClose}><X /></Button>
                </div>

                <div className='input-container'>
                    <label className='input-label'>Event Image</label>
                    <FileUpload.Root gap="1" maxWidth="300px" maxFiles={1}>
                        <FileUpload.HiddenInput onChange={(e) => setEventImage(e.target.files?.[0] || null)} />
                        <InputGroup
                            startElement={<LuFileUp />}
                            endElement={
                                <FileUpload.ClearTrigger asChild>
                                    <CloseButton
                                        me="-1"
                                        size="xs"
                                        variant="plain"
                                        focusVisibleRing="inside"
                                        focusRingWidth="2px"
                                        pointerEvents="auto"
                                    />
                                </FileUpload.ClearTrigger>
                            }
                        >
                            <Input asChild>
                                <FileUpload.Trigger>
                                    <FileUpload.FileText lineClamp={1} />
                                    {/*<span>Select File</span>


                                    Need to figure out way to remove exisiting button text because it says "File(s)" and user cannot upload more than 1


                                     */}
                                </FileUpload.Trigger>
                            </Input>
                        </InputGroup>
                    </FileUpload.Root>
                    <br></br>
                </div>

                <div className='input-container'>
                    <label className='input-label'>Event Title</label>
                    <input
                        type="text"
                        id="eventTitle"
                        value={eventTitle}
                        onChange={(e) => setEventTitle(e.target.value)}
                        className='input-field'
                    />
                </div>

                <div className='input-container'>
                    <label className='input-label'>Location</label>
                    <input
                        type="text"
                        id="location"
                        value={location}
                        onChange={(e) => setLocation(e.target.value)}
                        className='input-field'
                    />
                </div>

                <div className='input-container'>
                    <label className='input-label'>Event Dates</label>
                    <DatePicker
                        selected={startDate}
                        startDate={startDate}
                        endDate={endDate}
                        minDate={new Date()}
                        onChange={(dates) => {
                            const [start, end] = dates;
                            setStartDate(start);
                            setEndDate(end);
                        }}
                        selectsRange
                        showMonthDropdown
                        placeholderText="Select date range"
                        dateFormat="MM/dd/yyyy"
                        className='input-field'
                        showIcon
                        icon={<Calendar size={32} />}
                    />
                </div>
                <br></br>
                {/* Switch to toggle invite section */}
                <div className='input-container'>
                    <Switch.Root>
                        <Switch.HiddenInput 
                            checked={inviteUsers} 
                            onChange={(e) => setInviteUsers(e.target.checked)}
                        />
                        <Switch.Control />
                        <Switch.Label>Invite users now?</Switch.Label>
                    </Switch.Root>
                </div>

                {/* Conditionally render the InviteAttendantsExt component */}
                {inviteUsers && <InviteAttendantExt />}
                <br></br>
                <div className='input-container'>
                    <Button onClick={handleSubmit}>Create Event</Button>
                </div>
            </DialogBody>
        </BaseDialog>
    );
};

export default CreateEventModal;
