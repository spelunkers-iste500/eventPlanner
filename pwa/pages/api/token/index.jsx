import axios from "axios";
import { pool } from "../auth/[...nextauth]";
import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]"


export default async function handler(req, res) {
    // try {
        if (req.method !== "GET") {
            res.status(405).json({ error: "Method Not Allowed" });
            return;
        }
        // @TODO: get the session from the request to reduce latency
        const session = await getServerSession(req, res, authOptions);
        if (!session) {
            // Return a 401 Unauthorized response
            // @TODO: redirect to the login page
            res.status(401).json({ error: "Unauthorized" });
            return;
        }
        const result = await pool.query(
            "SELECT s.\"sessionToken\" FROM sessions s INNER JOIN users u ON u.id = s.\"userId\" WHERE u.email = $1",
            [session.user.email]
        );
        const response = await axios.post('http://php/auth', {
            email: session.user.email,
            session_token: result.rows[0].sessionToken,
        });
        res.status(response.status).json(response.data);
    return;
}