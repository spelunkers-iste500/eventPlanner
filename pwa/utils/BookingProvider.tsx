'use client';
import React, { createContext, useContext, useState, ReactNode } from 'react';
import { Offer } from 'types/airports';
import { Event } from 'types/events';

interface BookingData {
    event: Event;
    content: ReactNode;
    isRoundTrip?: boolean;
    originAirport?: String;
    departDate?: string;
    departTime?: string;
    destinationAirport?: String;
    returnDate?: string;
    returnTime?: string;
    maxConnections?: number;
    selectedOffer?: Offer;
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
