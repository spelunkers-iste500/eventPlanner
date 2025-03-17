'use client';
import React, { useState, useEffect } from 'react';
import axios from "axios";
import { verifyOTP } from 'Utils/authUtils';
import styles from '../login/login.module.css';
import Input from 'Components/common/Input';
import { useContent } from 'Utils/ContentProvider';
import Dashboard from 'Components/dashboard/Dashboard';

const RegisterOTP: React.FC = () => {
    const [otp, setOtp] = useState('');
    const [invalidOtp, setInvalidOtp] = useState(false);
    const [qrImage, setQrImage] = useState<string | undefined>();
    const [secret, setSecret] = useState<string | undefined>();

    const { setContent } = useContent();

    /* Generate a QR */
    useEffect(() => {
        const getQRCode = async () => {
            const response = await axios.get('/api/auth/2fa/qr', {
                headers: {
                    "Content-Type": "application/json"
                }
            });
    
            if (response.data.status === 200) {
                setQrImage(response.data.data);
                setSecret(response.data.secret);
            }
        };

        getQRCode();
    }, []);

    /* Validate Code */
    const handleChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        setOtp(e.target.value);

        if (e.target.value.length === 6 && secret) {
            const token = e.target.value;
            const isVerified = await verifyOTP(secret, token);

            if (isVerified) {
                console.log('2FA verified');
            } else {
                setInvalidOtp(true);
            }
        }
    };

    const handleSubmit = () => {
        if (otp.length === 6 && secret) {
            verifyOTP(secret, otp).then((isVerified) => {
                if (isVerified) {
                    console.log('2FA verified');
                    setContent(<Dashboard />, 'Dashboard');
                } else {
                    setInvalidOtp(true);
                }
            });
        }
    }

    return (
        <>
            <div className={styles.otpBox}>
                <h3 className={styles.otpTitle}>Two-Factor Authentication</h3>
                {qrImage && <img src={qrImage} alt="2FA QR Code" className={styles.qrCode} />}
                <p className={styles.otpInstructions}>Scan the QR Code with your Authenticator app and enter the code below.</p>
            </div>
            <Input
                label="OTP"
                type="text"
                maxlength={6}
                placeholder="Enter your OTP"
                inputMode="numeric"
                onChange={() => handleChange}
            />
            {invalidOtp && <p className={styles.errorMsg}>*Invalid Code</p>}
            <button onClick={handleSubmit}>Submit</button>
        </>
    );
};

export default RegisterOTP;