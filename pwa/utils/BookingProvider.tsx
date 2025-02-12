'use client';
import React, { createContext, useContext, useState, ReactNode } from 'react';
import { Event } from 'types/events';

interface BookingData {
    event?: Event;
    content: ReactNode;
}

interface BookingContextProps {
    bookingData: BookingData;
    setBookingData: React.Dispatch<React.SetStateAction<BookingData>>;
}

const BookingContext = createContext<BookingContextProps | undefined>(undefined);

export const BookingProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [bookingData, setBookingData] = useState<BookingData>({ event: undefined, content: null });

    return (
        <BookingContext.Provider value={{ bookingData, setBookingData }}>
            {children}
        </BookingContext.Provider>
    );
};

export const useBooking = () => {
    const context = useContext(BookingContext);
    if (context === undefined) {
        throw new Error('useContent must be used within a BookingProvider');
    }
    return context;
};
