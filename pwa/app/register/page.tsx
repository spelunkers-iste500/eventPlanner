'use client';
import React, { useState } from 'react';
import { useSession, signIn, signOut } from "next-auth/react"
import styles from '../login/login.module.css';
import Input from 'Components/common/Input';
import { useRouter } from 'next/navigation';
import { Select } from 'chakra-react-select';
import DatePicker from 'react-datepicker';
import { Calendar } from 'lucide-react';
import { PasswordInput } from 'Components/ui/password-input';


const Register: React.FC = () => {
    const router = useRouter();
    const { data: session } = useSession();
    const [error, setError] = useState('');

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

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (!formData.email) {
            setError('Email is required');
            return;
        }

        if (!formData.password) {
            setError('Password is required');
            return;
        }

        if (formData.password !== formData.confirmPassword) {
            setError('Passwords do not match');
            return;
        }

        if (!formData.firstName) {
            setError('First name is required');
            return;
        }

        if (!formData.lastName) {
            setError('Last name is required');
            return;
        }

        if (!formData.title) {
            setError('Title is required');
            return;
        }
        
        if (!formData.gender) {
            setError('Gender is required');
            return;
        }

        if (!formData.birthday) {
            setError('Birthday is required');
            return;
        }

        if (!formData.phoneNumber) {
            setError('Phone number is required');
            return;
        }

        // Proceed with form submission
    };

    const [startDate, setStartDate] = useState<Date | null>(null);
    
    const formatDate = (date: Date | null) => {
        return date ? date.toISOString().split('T')[0] : '';
    };

    return (
        <div className={styles.loginContainer}>
            <div className={styles.loginBox}>
                <h1 className={styles.loginTitle}>Register</h1>
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

                    <Input label="Password" onChange={(value) => handleChange('password', value)}>
                        <PasswordInput className={`${styles.passwordInput} input-field`} placeholder="Enter your password" />
                    </Input>

                    <Input label="Confirm Password" onChange={(value) => handleChange('confirmPassword', value)}>
                        <PasswordInput className={`${styles.passwordInput} input-field`} placeholder="Confirm your password" />
                    </Input>

                    <Input label='Title' onChange={() => {}}>
                        <Select
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
                            options={[
                                { label: 'Male', value: 'm' },
                                { label: 'Female', value: 'f' },
                            ]}
                            placeholder="Select a title"
                            size="md"
                            isSearchable={false}
                            className={`select-menu ${styles.tripType}`}
                            classNamePrefix={'select'}
                            onChange={(option) => handleChange('Gender', option?.value || '')}
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
                    <button type="submit" className={styles.signinBtn}>Sign in</button>
                </form>
            </div>
        </div>
    );
};

export default Register;