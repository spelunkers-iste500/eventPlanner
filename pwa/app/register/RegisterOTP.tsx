"use client";
import React, { useState, useEffect } from "react";
import axios from "axios";
import { verifyOTP } from "Utils/authUtils";
import styles from "../login/login.module.css";
import Input from "Components/common/Input";
import { useContent } from "Utils/ContentProvider";
import Dashboard from "Components/dashboard/Dashboard";
import { useRouter } from "next/navigation";
import { Spinner } from "@chakra-ui/react";
// import QRCode from 'qrcode';

const RegisterOTP: React.FC = () => {
    const [otp, setOtp] = useState("");
    const [invalidOtp, setInvalidOtp] = useState(false);
    const [otpVerified, setOtpVerified] = useState(false);
    const [qrImage, setQrImage] = useState<string | undefined>();
    const [secret, setSecret] = useState<string | undefined>();

    const { setContent } = useContent();
    const router = useRouter();

    /* Generate a QR */
    useEffect(() => {
        const getQRCode = async () => {
            const response = await axios.get("/api/auth/2fa/qr", {
                headers: {
                    "Content-Type": "application/json",
                },
            });

            if (response.data.status === 200) {
                // const qrCode = await QRCode.toDataURL(response.data.data);
                // setQrImage(qrCode);
                setQrImage(response.data.data);
                setSecret(response.data.secret);
            }
        };

        getQRCode();
    }, []);

    /* Validate Code */
    const handleChange = (value: string) => {
        setOtp(value);
    };

    const handleSubmit = async () => {
        if (otp.length === 6 && secret) {
            try {
                const isVerified = await verifyOTP(secret, otp);
                if (isVerified) {
                    console.debug("2FA verified");
                    setOtpVerified(true);
                    router.push("/");
                } else {
                    setInvalidOtp(true);
                }
            } catch (error) {
                console.error("Error verifying OTP:", error);
                setInvalidOtp(true);
            }
        }
    };

    return (
        <>
            <div className={styles.otpBox}>
                {qrImage ? (
                    <img
                        src={qrImage}
                        alt="2FA QR Code"
                        className={styles.qrCode}
                    />
                ) : (
                    <Spinner
                        size="xl"
                        className={styles.spinner}
                        color="var(--blue-500)"
                    />
                )}
                <p className={styles.otpInstructions}>
                    Scan the QR Code with your Authenticator app and enter the
                    code below.
                </p>
            </div>
            <Input
                label="One-Time Passcode (OTP)"
                type="text"
                maxlength={6}
                placeholder="Enter your OTP"
                inputMode="numeric"
                onChange={(value) => handleChange(value)}
            />
            {invalidOtp && <p className="error-msg">Invalid Code</p>}
            {otpVerified && (
                <p className={styles.successMsg}>
                    Code Validated, Redirecting...
                </p>
            )}
            {!otpVerified && (
                <button className={styles.signinBtn} onClick={handleSubmit}>
                    Submit
                </button>
            )}
        </>
    );
};

export default RegisterOTP;
