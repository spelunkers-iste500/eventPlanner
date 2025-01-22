import React, { Component, useState } from 'react';
import axios from 'axios';
import { useRouter } from 'next/router';
import LoginButton from '../../components/LoginButton'

const LoginPage: React.FC = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');

    const handleLogin = async (event: React.FormEvent) => {
        event.preventDefault();
        try {
            const response = await axios.post('/auth', { email, password });
            const { token } = response.data;
            localStorage.setItem('jwt', token);
            // Redirect to another page or update the UI as needed
        } catch (err) {
            setError('Invalid email or password');
        }
    };

    return (
        <div>
            <LoginButton />
        </div>
    );
};

export default LoginPage;