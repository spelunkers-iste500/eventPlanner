import { pool } from "Utils/auth";
import { NextResponse } from "next/server";
import { auth } from "Utils/auth";
import axios from "axios";

export async function GET(request: Request) {
    // Get the session token from the database, and then make a request to the api auth server
    const session = await auth();
    if (!session?.user) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    const dbQueryResult = await pool.query('SELECT "providerAccountId" FROM accounts WHERE "userId" = $1', [session.user.id]);
    const providerAccountId = dbQueryResult.rows[0].providerAccountId;
    const apiResponse = await axios.post('http://php/auth', {
        id: `${session.user.id}`,
        token: `${providerAccountId}`,
    })
    if (apiResponse.status !== 200) {
        return NextResponse.json({ error: apiResponse.data }, { status: apiResponse.status });
    }
    const token = apiResponse.data.token;
    const resp = new Response(JSON.stringify({ token }), {
        status: 200,
        headers: {
            "Content-Type": "application/json",
            "Set-Cookie": `token=${token}; Path=/; HttpOnly; SameSite=Strict; expires=${new Date(Date.now() + 60 * 60 * 1000).toUTCString()}`,
        },

    });
    return resp;
}