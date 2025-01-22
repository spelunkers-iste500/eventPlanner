import React, { Component, useState } from 'react';
import { useRouter } from 'next/router';
import { useSession, signIn, signOut } from "next-auth/react"
import styles from './login.module.css';


const LoginPage: React.FC = () => {
    const { data: session } = useSession();

    return (
        <div className={styles.loginContainer}>
            <div className={styles.loginBox}>
                <h1 className={styles.loginTitle}>Login Portal</h1>
                <div className={styles.sessionContainer}>
                    <p className={styles.signedInStatus}>
                        {session ? (
                            <>Signed in as <span>{session.user?.email}</span></>
                        ) : (
                            <>Not signed in</>
                        )}
                    </p>
                    <div className={styles.signoutContainer}>
                        {session ? (
                            <>
                            <span>Not you?</span>
                            <button className={styles.signoutBtn} onClick={() => signOut()}>Logout</button>
                            </>
                        ) : (
                            <button className={styles.signinBtn} onClick={() => signIn()}>Sign in</button>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default LoginPage;