'use client';
import React, { useState } from 'react';
import { useSession, signIn, signOut } from "next-auth/react";
import { useRouter } from 'next/navigation';
import EventForm from '../../components/booking/EventForm';

const Booking: React.FC = () => {
    const { data: session } = useSession();
    const router = useRouter();

    return (
        <div>
            <EventForm />
        </div>
    );
};

export default Booking;