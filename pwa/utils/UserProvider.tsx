"use client";
import React, {
    createContext,
    useContext,
    useState,
    useEffect,
    ReactNode,
} from "react";
import axios from "axios";
import { useSession } from "next-auth/react";
import { Event, Organization } from "Types/events";

interface User {
    id: string;
    name: string;
    email: string;
    emailVerified: boolean;
    phoneNumber: string;
    birthday: string;
    title: string;
    gender: string;
    // OrgMembership: string[];
    eventsAttending: Event[];
    eventAdminOfOrg: Organization[];
    financeAdminOfOrg: string[];
    superAdmin: boolean;
    passengerId: string;
}

interface UserContextProps {
    user: User | null;
    loading: boolean;
}

const UserContext = createContext<UserContextProps | undefined>(undefined);

export const UserProvider: React.FC<{ children: ReactNode }> = ({
    children,
}) => {
    const { data: session } = useSession();
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchUser = async () => {
            if (session?.id) {
                console.log("Fetching user data w/ session creds", session);
                const cachedUser = localStorage.getItem("user");
                const cachedSessionId = localStorage.getItem("sessionId");

                if (cachedUser && cachedSessionId === session.id) {
                    setUser(JSON.parse(cachedUser));
                    console.log(
                        "User data fetched from cache:",
                        JSON.parse(cachedUser)
                    );
                    setLoading(false);
                } else {
                    try {
                        const response = await axios.get(`/my/user`, {
                            headers: {
                                "Content-Type": "application/ld+json",
                                Authorization: "Bearer " + session.apiToken,
                            },
                        });
                        setUser(response.data);
                        localStorage.setItem(
                            "user",
                            JSON.stringify(response.data)
                        );
                        localStorage.setItem("sessionId", session.id);
                        console.log(
                            "User data fetched from API:",
                            response.data
                        );
                        setLoading(false);
                    } catch (err) {
                        console.error("Failed to fetch user data");
                        setLoading(false);
                    }
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
        throw new Error("useUser must be used within a UserProvider");
    }
    return context;
};
