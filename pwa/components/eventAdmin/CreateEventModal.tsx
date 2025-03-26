import { DialogHeader, DialogBody, DialogTitle, Button, CloseButton, FileUpload, Input, InputGroup, Switch } from '@chakra-ui/react';
import axios from 'axios';
import BaseDialog from 'Components/common/BaseDialog';
import { X, Calendar } from 'lucide-react';
import React, { useEffect, useState } from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import styles from '../common/Dialog.module.css';
import { useSession } from 'next-auth/react';
import { LuFileUp } from 'react-icons/lu';
import { toaster } from 'Components/ui/toaster';
import InviteAttendantExt from './InviteAttendantExt';
import { useUser } from 'Utils/UserProvider';
import { Event } from 'Types/events';

interface CreateEventModalProps {
    isOpen: boolean;
    onClose: () => void;
}

const CreateEventModal: React.FC<CreateEventModalProps> = ({ isOpen, onClose }) => {
    const { data: session } = useSession();
    const { user } = useUser();
    const [eventTitle, setEventTitle] = useState('');
    const [location, setLocation] = useState('');
    const [startDate, setStartDate] = useState<Date | null>(null);
    const [endDate, setEndDate] = useState<Date | null>(null);
    const [eventImage, setEventImage] = useState<File | null>(null);
    const [inviteUsers, setInviteUsers] = useState(false);

    const handleSubmit = () => {
        if (eventTitle && startDate && endDate && location) {
            // make api request to create event
            const createEvent = async () => {
                try {
                    // console.log('${user?.eventAdminOfOrg[0]}');
                    console.log('creating event');
                    // const response = await 
                    axios.post(`/organizations/${user?.eventAdminOfOrg[0]}/events/`, {
                        title: eventTitle,
                        startDateTime: startDate,
                        endDateTime: endDate,
                        location: location
                    }, {
                        headers: { 
                            'Authorization': `Bearer ${session?.apiToken}`,
                            'Content-Type': 'application/ld+json',
                            'accept': 'application/ld+json',
                        }
                    })
                    .then((response) => {
                        console.log('Event Post response:', response.data);
                        if (response.status == 200) {
                        //     setContent(<Dashboard />, 'Dashboard');
                        }
                        toaster.create({
                            title: "Event Created",
                            description: "Your event has successfully been created.",
                            type: "success",
                            duration: 3000,
                            placement: 'top-end'
                        });
                    })
                    .catch((error) => {
                        console.error('Error occured during event creation:', error);
            
                        // temporarily here until api returns a 200
                        // setContent(<Dashboard />, 'Dashboard');
                        toaster.create({
                            title: "What does this do",
                            description: "Chase the money Chase the Money.",
                            type: "success",
                            duration: 3000,
                        });
                    });
                } catch (error) {
                    console.error('Error creating event:', error);
                    toaster.create({
                        title: "Error",
                        description: "An error occurred while creating the event.",
                        type: "error",
                        duration: 3000,
                        placement: 'top-end'
                    });
                }
            };
            createEvent();
        }
    };
            
    // useEffect(() => {
    //     getEvents();
    // }, [user]);

    // if (loading) {
    //     return <h2 className='loading'>Loading...</h2>;
    // }

    return (
        <BaseDialog isOpen={isOpen} onClose={onClose}>
            <DialogHeader className={styles.dialogHeader}>
                <DialogTitle>Create Event</DialogTitle>
                    <button className={styles.dialogClose} onClick={onClose}><X /></button>
            </DialogHeader>
            <DialogBody className={styles.dialogBody}>

                <div className='input-container'>
                    <label className='input-label'>Event Image</label>
                    <FileUpload.Root className={styles.fileUpload} gap="1" maxWidth="300px" maxFiles={1}>
                        <FileUpload.HiddenInput onChange={(e) => setEventImage(e.target.files?.[0] || null)} />
                        <InputGroup
                            startElement={<LuFileUp />}
                            endElement={
                                <FileUpload.ClearTrigger asChild>
                                    <CloseButton
                                        size="xs"
                                        className={styles.fileUploadClear}
                                    />
                                </FileUpload.ClearTrigger>
                            }
                        >
                            <Input asChild>
                                <FileUpload.Trigger className={`${styles.fileUploadTrigger} ${eventImage ? styles.hasFile : ''}`} asChild>
                                    {eventImage ? (
                                        <FileUpload.FileText className={styles.fileUploadTexts} />
                                    ) : (
                                        <button>Upload File</button>
                                    )}
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
