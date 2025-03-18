'use client';
import React, { useState, useId } from 'react';
import styles from '../login/login.module.css';
import Input from 'Components/common/Input';
import { Select } from 'chakra-react-select';
import DatePicker from 'react-datepicker';
import { Calendar } from 'lucide-react';
import { PasswordInput } from 'Components/ui/password-input';
import axios from 'axios';

interface RegisterInfoProps {
    onSuccess: () => void;
}

const RegisterInfo: React.FC<RegisterInfoProps> = ({ onSuccess }) => {
    const [error, setError] = useState('');
    const titleId = useId();
    const genderId = useId();

    const [formData, setFormData] = useState({
        email: '',
        firstName: '',
        lastName: '',
        password: '',
        confirmPassword: '',
        title: '',
        gender: '',
        birthday: '',
        phoneNumber: ''
    });

    const handleChange = (field: string, value: string) => {
        setFormData({ ...formData, [field]: value });
        if (value) {
            setError('');
        }
    };

    const validateForm = () => {
        const requiredFields = [
            { field: 'email', message: 'Email is required' },
            { field: 'password', message: 'Password is required' },
            { field: 'confirmPassword', message: 'Confirm Password is required' },
            { field: 'firstName', message: 'First name is required' },
            { field: 'lastName', message: 'Last name is required' },
            { field: 'title', message: 'Title is required' },
            { field: 'gender', message: 'Gender is required' },
            { field: 'birthday', message: 'Birthday is required' },
            { field: 'phoneNumber', message: 'Phone number is required' }
        ];

        for (const { field, message } of requiredFields) {
            if (!formData[field as keyof typeof formData]) {
                return message;
            }
        }

        if (formData.password !== formData.confirmPassword) {
            return 'Passwords do not match';
        }

        return '';
    };

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const errorMessage = validateForm();
        if (errorMessage) {
            setError(errorMessage);
            return;
        }

        // Format the request data to match the API route format
        const requestData = {
            firstName: formData.firstName,
            lastName: formData.lastName,
            email: formData.email,
            phoneNumber: formData.phoneNumber,
            birthday: new Date(formData.birthday).toISOString(),
            title: formData.title,
            gender: formData.gender,
            plainPassword: formData.password
        };

        // send post request to /users using axios
        try {
            const response = await axios.post('/users', requestData, {
                headers: {
                    "Content-Type": "application/ld+json"
                }
            });

            if (response.status === 201) {
                console.log('Registration successful:', response.data);
                setError('');

                const isAuth = await axios.post('/auth', {
                    email: formData.email,
                    password: formData.password
                }, {
                    headers: {
                        "Content-Type": "application/json"
                    }
                });

                if (isAuth.status === 200) {
                    onSuccess();
                }
            }
        } catch (error) {
            setError('An error occurred during registration, please try again');
            console.error('Registration error:', error);
        }
    };

    const [startDate, setStartDate] = useState<Date | null>(null);
    
    const formatDate = (date: Date | null) => {
        return date ? date.toISOString().split('T')[0] : '';
    };

    return (
        <>
        {error && <div className='error-msg'>{error}</div>}
        <form className={styles.sessionContainer} onSubmit={handleSubmit}>
            <Input
                label="Email"
                type="email"
                placeholder="Enter your email"
                onChange={(value) => handleChange('email', value)}
            />
            <Input
                label="First Name"
                type="text"
                placeholder="Enter your first name"
                onChange={(value) => handleChange('firstName', value)}
            />

            <Input
                label="Last Name"
                type="text"
                placeholder="Enter your last name"
                onChange={(value) => handleChange('lastName', value)}
            />

            <Input label="Password" onChange={() => {}}>
                <PasswordInput className={`${styles.passwordInput} input-field`} placeholder="Enter your password" onChange={(e) => handleChange('password', e.target.value)} />
            </Input>

            <Input label="Confirm Password" onChange={() => {}}>
                <PasswordInput className={`${styles.passwordInput} input-field`} placeholder="Confirm your password" onChange={(e) => handleChange('confirmPassword', e.target.value)} />
            </Input>

            <Input label='Title' onChange={() => {}}>
                <Select
                    id={titleId}
                    options={[
                        { label: 'Mr', value: 'mr' },
                        { label: 'Ms', value: 'ms' },
                        { label: 'Mrs', value: 'mrs' },
                        { label: 'Miss', value: 'miss' },
                        { label: 'Dr', value: 'dr' },
                    ]}
                    placeholder="Select a title"
                    size="md"
                    isSearchable={false}
                    className={`select-menu ${styles.tripType}`}
                    classNamePrefix={'select'}
                    onChange={(option) => handleChange('title', option?.value || '')}
                />
            </Input>
            
            <Input label='Gender' onChange={() => {}}>
                <Select
                    id={genderId}
                    options={[
                        { label: 'Male', value: 'm' },
                        { label: 'Female', value: 'f' },
                    ]}
                    placeholder="Select a title"
                    size="md"
                    isSearchable={false}
                    className={`select-menu ${styles.tripType}`}
                    classNamePrefix={'select'}
                    onChange={(option) => handleChange('gender', option?.value || '')}
                />
            </Input>

            <Input
                label='Phone Number'
                type='tel'
                isPhoneNumber
                placeholder='Enter your phone number'
                onChange={(value) => handleChange('phoneNumber', value)}
            />

            <Input label='Email' onChange={() => {}}>
                <DatePicker
                    selected={startDate}
                    startDate={startDate}
                    maxDate={new Date()}
                    onChange={(date) => {
                        setStartDate(date);
                        handleChange('birthday', formatDate(date));}
                    }
                    openToDate={new Date("2000/01/01")}
                    showMonthDropdown
                    showYearDropdown
                    placeholderText="Enter your birthday"
                    dateFormat="MM/dd/yyyy"
                    className='input-field'
                    showIcon
                    icon={<Calendar size={32} />}
                />
            </Input>
            <button type="submit" className={styles.signinBtn}>Submit</button>
        </form>
        </>
    );
};

export default RegisterInfo;