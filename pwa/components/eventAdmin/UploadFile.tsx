import { InputGroup, CloseButton, Input, FileUpload } from '@chakra-ui/react';
import React from 'react';
import { LuFileUp } from 'react-icons/lu';
import styles from "../common/Dialog.module.css";

interface UploadFileProps {
    eventImage: File | null;
    setEventImage: (file: File | null) => void;
}

const UploadFile: React.FC<UploadFileProps> = ({ eventImage, setEventImage }) => {
    return (
        <FileUpload.Root
            className={styles.fileUpload}
            gap="1"
            maxWidth="300px"
            maxFiles={1}
        >
            <FileUpload.HiddenInput
                onChange={(e) =>
                    setEventImage(e.target.files?.[0] || null)
                }
            />
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
                    <FileUpload.Trigger
                        className={`${styles.fileUploadTrigger} ${
                            eventImage ? styles.hasFile : ""
                        }`}
                        asChild
                    >
                        {eventImage ? (
                            <FileUpload.FileText
                                className={styles.fileUploadTexts}
                            />
                        ) : (
                            <button>Upload File</button>
                        )}
                    </FileUpload.Trigger>
                </Input>
            </InputGroup>
        </FileUpload.Root>
    );
};

export default UploadFile;
