import React, { useState, ChangeEvent } from 'react';
import axios from 'axios';
import styles from '../common/Dialog.module.css';
import { Box, Button, Flex, Input } from '@chakra-ui/react';
import { X } from 'lucide-react';
import { useSession } from 'next-auth/react';

const InviteAttendantExt: React.FC = () => {
  // State to hold the current input and the list of emails I hope
  const [emailInput, setEmailInput] = useState('');
  const [emails, setEmails] = useState<string[]>([]);

  // Validate email
  const validateEmail = (email: string) => {
    const re = /\S+@\S+\.\S+/;
    return re.test(email);
  };

  // Handle adding an email from the input field
  const handleAddEmail = () => {
    if (emailInput && validateEmail(emailInput)) {
      // Add the email if doesn't already exist in the list
      if (!emails.includes(emailInput)) {
        setEmails([emailInput, ...emails]);
      }
      setEmailInput('');
    } else {
      alert('Please enter a valid email address.');
    }
  };

  // Remove email from the list when "x" is clicked
  const handleDeleteEmail = (email: string) => {
    setEmails(emails.filter(e => e !== email));
  };

  // Handle CSV email file import, read and extract emails
  const handleCSVImport = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files && event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const text = e.target?.result;
        if (typeof text === 'string') {
          const importedEmails = parseCSVEmails(text);
          // Merge the imported emails into the existing state, avoiding duplicates I think?
          setEmails(prev => [
            ...importedEmails.filter(email => !prev.includes(email)),
            ...prev
          ]);
        }
      };
      reader.readAsText(file);
    }
  };

  // CSV parse: split on commas, newlines, or whitespace cuz user might not know what the C in CSV means
  const parseCSVEmails = (text: string) => {
    const potentialEmails = text.split(/[\s,]+/);
    return potentialEmails.filter(email => email && validateEmail(email));
  };

  // Handle submit of the emails list
  const handleSubmit = () => {
    console.log('Submitted emails:', emails);
    // API handle go here
  };

  return (
    <Box mt={4} p={4} borderWidth="1px" borderRadius="md">
      {/* Top buttons: CSV Import and Submit */}
      <Flex justifyContent="space-between" mb={4}>
        <Button onClick={() => document.getElementById('csvInput')?.click()}>
          CSV User Import
        </Button>
        <Button onClick={handleSubmit}>
          Submit
        </Button>
        {/* Hidden file input for CSV import */}
        <input
          type="file"
          id="csvInput"
          accept=".csv"
          style={{ display: 'none' }}
          onChange={handleCSVImport}
        />
      </Flex>

      {/* Input field and Add button for manual entry */}
      <Flex mb={4}>
        <Input
          placeholder="Enter attendant's email address"
          value={emailInput}
          onChange={(e) => setEmailInput(e.target.value)}
        />
        <Button ml={2} onClick={handleAddEmail}>
          Add
        </Button>
      </Flex>

      {/* Display list of added emails with delete button */}
      <Box maxH="20vh" overflowY="auto">
        {emails.map((email, index) => (
          <Flex key={index} alignItems="center" mb={2} borderWidth="1px" p={2} borderRadius="md">
            <Box flex="1">{email}</Box>
            <Button variant="ghost" size="sm" onClick={() => handleDeleteEmail(email)}>
              <X size={16} />
            </Button>
          </Flex>
        ))}
      </Box>
    </Box>
  );
};

export default InviteAttendantExt;
