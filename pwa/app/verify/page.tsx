'use client';
import React from 'react';
import styles from '../login/login.module.css';
import { useRouter } from 'next/navigation';


const Verify: React.FC = () => {
    const router = useRouter();

    return (
        <div className={styles.loginContainer}>
            <div className={styles.loginBox}>
                <h1 className={styles.loginTitle}>Check Your Email</h1>
                <div className={styles.sessionContainer}>
                    <p className={styles.signedInStatus}>Please check your inbox and click the link to log in.</p>
                    <button className='text-btn' onClick={() => router.push('/')}>staging.spelunkers.xeanto.us</button>
                </div>
            </div>
        </div>
    );
};

export default Verify;