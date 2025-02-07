//authroize with next auth first to get the user ID that will belong to the associated flight

import axios from "axios";
// import { pool } from "../auth/[...nextauth]";
import { pool, auth } from "../../utils/auth";
// import { NextApiRequest } from "next";
import { NextApiRequest, NextApiResponse } from "next";
// import { getServerSession } from "next-auth";
// import { authOptions } from "../auth/[...nextauth]"
import { NextResponse } from 'next/server'


export async function GET(req: Request, res: NextApiResponse) {
    // try {
        // if (req.method !== "GET") {
        //     res.status(405).json({ error: "Method Not Allowed",
        //         method: req.method
        //     });
        //     return;
        // }
        // @TODO: get the session from the request to reduce latency
        const session = await auth();
        if (!session) {
            // Return a 401 Unauthorized response
            // @TODO: redirect to the login page
            res.status(401).json({ error: "Unauthorized" });
            return;
        }
        const result = await pool.query(
            "SELECT a.\"providerAccountId\", a.\"userId\" FROM accounts a INNER JOIN users u ON u.id = a.\"userId\" WHERE u.email = $1",
            [session?.user?.email]
        );

        const response = await axios.post('http://php/auth', {
            id: result.rows[0].userId.toString(),
            session_token: result.rows[0].providerAccountId,
        });
        console.log(response)
        const data = response.data;
        return NextResponse.json({data})
        //axios.get({"/accounts"}, {
        //    Authorization: "Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiJ9.eyJpYXQiOjE3Mzg4ODg5MjksImV4cCI6MTczODg5MjUyOSwicm9sZXMiOlsiUk9MRV9VU0VSIl0sInVzZXJuYW1lIjoiMSIsInNlc3Npb25Ub2tlbiI6bnVsbH0.rLD3EolUpmAtxRVOjyKktYNrnGukXzfrJ8X6EY1loYSXlJKZcfPnHZsiwzhStFP-h7dyFLqOobHqhFyBxVzIVGSSHu_xlmfplUzKEic06H9FfDwE5_dVg9ReuO1owE820_iuSwfLxTcwuo7UuUwTkSAuGZpCrmPLHQswb8vwYM1WSg2YBxIY98yIAXT-d6l6bIuF6Nz6Jsxmm7n39qNHJyZjUQpCOW8j4Drk5GkTViXPOBwB987vO43RmbqYV24wvpQxbbd1krvVF8f-pP8vG9y0VolKQtLibL7Cb0RWz3LpVyNuuN_FNQ5IHzwt6KsGdxOmJOiCyJ_oB2HpIgw6iw"
        //})
    }