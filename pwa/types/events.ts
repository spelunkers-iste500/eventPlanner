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

// Format the date to be in the format 'Month Day, Year'
// Example: 'Jul 10, 2025'
export const formatDateDisplay = (dateString: string | undefined) => {
    if (!dateString) return '';
    const options: Intl.DateTimeFormatOptions = { year: 'numeric', month: 'short', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
};

// Format the time to be in 12-hour format with 'a' or 'p' instead of 'AM' or 'PM'
export const formatTime = (dateString: string | undefined) => {
    if (!dateString) return '';
    const options: Intl.DateTimeFormatOptions = { hour: 'numeric', minute: 'numeric', hour12: true };
    return new Date(dateString).toLocaleTimeString(undefined, options).replace(' AM', 'a').replace(' PM', 'p');
};

// Format the date to be in the format 'YYYY-MM-DD'
// Example: '2025-07-10'
export const formatDateSubmit = (date: Date | null) => {
    return date ? date.toISOString().split('T')[0] : '';
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