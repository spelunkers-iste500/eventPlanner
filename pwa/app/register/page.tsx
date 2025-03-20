'use client';
import React, { useState } from 'react';
import styles from '../login/login.module.css';
import RegisterInfo from './RegisterInfo';
import RegisterOTP from './RegisterOTP';

const Register: React.FC = () => {
    const [isOtpVisible, setIsOtpVisible] = useState(false);

    const handleSuccess = () => {
        setIsOtpVisible(true);
    };

    return (
        <div className={styles.loginContainer}>
            <div className={`${styles.loginBox} ${ !isOtpVisible ? styles.register : ''}`}>
                <h1 className={styles.loginTitle}>{isOtpVisible ? 'Setup 2FA' : 'Register'}</h1>
                {isOtpVisible ? <RegisterOTP /> : <RegisterInfo onSuccess={handleSuccess} />}
            </div>
        </div>
    );
};

export default Register;