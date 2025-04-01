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
import { Event } from "Types/event";
import { Organization } from "Types/organization";
import { User } from "Types/user";

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
        // try to get user from local storage first
        const user = new User(session?.id, session?.apiToken);
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
                        const user = new User(session.id);
                        await user.fetch(session.apiToken);
                        setUser(user);
                        localStorage.setItem("user", JSON.stringify(user));
                        localStorage.setItem("sessionId", session.id);
                        console.log("User data fetched from API:", user);
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
