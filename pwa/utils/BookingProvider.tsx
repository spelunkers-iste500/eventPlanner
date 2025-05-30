"use client";
import React, { createContext, useContext, useState, ReactNode } from "react";
import { Offer } from "Types/airports";
import { Event } from "Types/event";

export interface BookingData {
    event: Event;
    userEventId: string;
    content: ReactNode;
    trip?: string;
    originAirport?: string;
    departDate?: string;
    departTime?: string;
    destinationAirport?: string;
    returnDate?: string;
    returnTime?: string;
    maxConnections?: number;
    selectedOffer?: Offer;
    flightOffers?: Offer[];
}

interface BookingContextProps {
    bookingData: BookingData;
    setBookingData: React.Dispatch<React.SetStateAction<BookingData>>;
}

const BookingContext = createContext<BookingContextProps | undefined>(
    undefined
);

export const BookingProvider: React.FC<{ children: ReactNode }> = ({
    children,
}) => {
    const [bookingData, setBookingData] = useState<BookingData>(
        {} as BookingData
    );

    return (
        <BookingContext.Provider value={{ bookingData, setBookingData }}>
            {children}
        </BookingContext.Provider>
    );
};

export const useBooking = () => {
    const context = useContext(BookingContext);
    if (context === undefined) {
        throw new Error("useContent must be used within a BookingProvider");
    }
    return context;
};
