'use client';
import React, { createContext, useContext, useState, ReactNode } from 'react';
import { Airport, Flight } from 'types/airports';
import { Event } from 'types/events';

interface BookingData {
    event: Event;
    content: ReactNode;
    isRoundTrip?: boolean;
    departAirport?: String;
    departFlight?: Flight;
    departDate?: string;
    departTime?: string;
    returnAirport?: String;
    returnFlight?: Flight;
    returnDate?: string;
    returnTime?: string;
}

interface BookingContextProps {
    bookingData: BookingData;
    setBookingData: React.Dispatch<React.SetStateAction<BookingData>>;
}

const BookingContext = createContext<BookingContextProps | undefined>(undefined);

export const BookingProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [bookingData, setBookingData] = useState<BookingData>({} as BookingData);

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
