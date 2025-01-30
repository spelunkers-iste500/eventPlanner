import axios from "axios";
import { getSession } from "next-auth/react";

export default async function getToken() {
    const session = await getSession();
    if (!session) {
        return null;
    }
    const token = await axios.post('/auth', {
                email: session.user.email,
                session_token: session.sessionToken,
    });
    return token;
};