'use client';
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import axios from 'axios';
import { useSession } from 'next-auth/react';

interface User {
    id: number;
    name: string;
    email: string;
    emailVerified: boolean;
    phoneNumber: string;
    birthday: string;
    title: string;
    gender: string;
    OrgMembership: string[];
    eventsAttending: string[];
    superAdmin: boolean;
    passengerId: string;
}

interface UserContextProps {
    user: User | null;
    loading: boolean;
}

const UserContext = createContext<UserContextProps | undefined>(undefined);

export const UserProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const { data: session } = useSession();
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchUser = async () => {
            console.log('Fetching user data...', session);
            if (session?.id) {
                try {
                    const response = await axios.get(`/users/${session.id}`, {
                        headers: { 'Content-Type': 'application/ld+json',
                        Authorization : 'Bearer ' + session.apiToken } 
                    });
                    setUser(response.data);
                    console.log('User data fetched:', response.data);
                    setLoading(false);
                } catch (err) {
                    console.error('Failed to fetch user data');
                }
            } else {
                setLoading(false);
            }
        };

        fetchUser();
    }, [session]);

    return (
        <UserContext.Provider value={{ user, loading }}>
            {children}
        </UserContext.Provider>
    );
};

export const useUser = () => {
    const context = useContext(UserContext);
    if (context === undefined) {
        throw new Error('useUser must be used within a UserProvider');
    }
    return context;
};