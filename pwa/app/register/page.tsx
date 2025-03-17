'use client';
import React, { useState } from 'react';
import { useSession, signIn, signOut } from "next-auth/react"
import styles from './login.module.css';
import Input from 'Components/common/Input';
import { useRouter } from 'next/navigation';


const Register: React.FC = () => {
    const router = useRouter();
    const { data: session } = useSession();
    const [email, setEmail] = useState('');
    const [error, setError] = useState('');

    const handleChange = (value: string) => {
        setEmail(value);
        if (value) {
            setError('');
        }
    };

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (!email) {
            setError('Email is required');
            return;
        }

        // Proceed with form submission
        signIn("sendgrid", { email: email });
    };

    return (
        <div className={styles.loginContainer}>
            <div className={styles.loginBox}>
                <h1 className={styles.loginTitle}>Register</h1>
                <div className={styles.sessionContainer}>
                    
                </div>
            </div>
        </div>
    );
};

export default Register;