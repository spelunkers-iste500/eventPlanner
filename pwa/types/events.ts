// Define types for the event data
export interface Event {
    id: number;
    eventTitle: string;
    startDateTime: string; // date-time
    endDateTime: string; // date-time
    startFlightBooking: string; // date-time
    endFlightBooking: string; // date-time
    location: string;
    maxAttendees: number;
    organization: string | null;
    attendees: string[];
    financeAdmins: string[];
    eventAdmins: string[];
}

export const formatDate = (dateString: string | undefined) => {
    if (!dateString) return '';
    const options: Intl.DateTimeFormatOptions = { year: 'numeric', month: 'short', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
};

export const formatTime = (dateString: string | undefined) => {
    if (!dateString) return '';
    const options: Intl.DateTimeFormatOptions = { hour: 'numeric', minute: 'numeric', hour12: true };
    return new Date(dateString).toLocaleTimeString(undefined, options).replace(' AM', 'a').replace(' PM', 'p');
};

// Define types for the budget data
export interface Budget {
    id: string;
    total: string;
    spentBudget: string;
    vipBudget: string;
    regBudget: string;
    event: string;
    organization: string;
}