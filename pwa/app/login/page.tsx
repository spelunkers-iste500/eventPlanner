'use client';
import React, { useState } from 'react';
import { useSession, signIn, signOut } from "next-auth/react"
import styles from './login.module.css';
import Input from 'Components/common/Input';
import { useRouter } from 'next/navigation';
import { PasswordInput } from 'Components/ui/password-input';

const Login: React.FC = () => {
    const router = useRouter();
    const { data: session } = useSession();
    const [formData, setFormData] = useState({ email: '', password: '', otp: '' });
    const [error, setError] = useState('');

    const handleChange = (field: string, value: string) => {
        setFormData({ ...formData, [field]: value });
        if (value) {
            setError('');
        }
    };

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (!formData.email) {
            setError('Email is required');
            return;
        }

        if (!formData.password) {
            setError('Password is required');
            return;
        }

        if (formData.otp.length !== 6) {
            setError('OTP is required');
            return;
        }

        // Attempt to sign in with credentials and OTP
        const isAuth = await signIn('credentials-2fa', {
            email: formData.email,
            password: formData.password,
            otp: formData.otp,
            redirect: false
        });

        if (isAuth?.error) {
            console.error(isAuth.error);
            if (isAuth.error === 'Configuration') {
                setError('Invalid credentials');
            } else {
                setError('An error occurred during login');
            }
        } else {
            router.push('/');
        }
    };

    return (
        <div className={styles.loginContainer}>
            <div className={styles.loginBox}>
                <h1 className={styles.loginTitle}>Login Portal</h1>
                <div className={styles.sessionContainer}>
                    {session && (
                        <p className={styles.signedInStatus}>Signed in as: <span>{session.user?.email}</span></p>
                    )}
                    <div className={styles.signoutContainer}>
                        {session ? (
                            <div className={styles.signedInOptions}>
                                <div className={styles.logoutOption}>
                                    <span>Not you?</span>
                                    <button className={styles.signoutBtn} onClick={() => signOut()}>Logout</button>
                                </div>
                                <button className={styles.signinBtn} onClick={() => router.push('/')}>Continue</button>
                            </div>
                        ) : (
                            <div className={styles.signinOptions}>
                                {error && <div className='error-msg'>{error}</div>}
                                <form className={styles.loginSection} onSubmit={handleSubmit}>
                                    <Input label="Email" type="email" placeholder="Enter your email" onChange={(value) => handleChange('email', value)} />
                                    <Input label="Password" onChange={() => {}}>
                                        <PasswordInput className={`${styles.passwordInput} input-field`} placeholder="Enter your password" onChange={(e) => handleChange('password', e.target.value)} />
                                    </Input>
                                    <Input
                                        label="One-Time Passcode (OTP)"
                                        type="text"
                                        maxlength={6}
                                        placeholder="Enter your OTP"
                                        inputMode="numeric"
                                        onChange={(value) => handleChange('otp', value)}
                                    />
                                    <button type="submit" className={styles.signinBtn}>Sign in</button>
                                </form>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Login;