import NextAuth from "next-auth";
import GithubProvider from "next-auth/providers/github";
import GoogleProvider from "next-auth/providers/google";
import PostgresAdapter from "/srv/app/utils/PostgresAdapter";
import { Pool } from "pg";

export const pool = new Pool({
    user: process.env.POSTGRES_USER,
    host: process.env.DB_HOST,
    database: process.env.POSTGRES_DB,
    password: process.env.POSTGRES_PASSWORD,
    max: 20,
    idleTimeoutMillis: 30000,
    connectionTimeoutMillis: 2000,
});

export const authOptions = {
    // Configure one or more authentication providers
    providers: [
        GithubProvider({
            clientId: process.env.GITHUB_ID,
            clientSecret: process.env.GITHUB_SECRET,
            authorization: {
                params: {
                    prompt: "consent",
                    response_type: "code",
                },
            },
        }),
        GoogleProvider({
            clientId: process.env.GOOGLE_ID,
            clientSecret: process.env.GOOGLE_SECRET,
            authorization: {
                params: {
                    prompt: "select_account",
                    response_type: "code",
                },
            },
        }),
        // ...add more providers here
    ],
    adapter: PostgresAdapter(pool),
    // callbacks: {
    //     async session({ session, token, user }) {
    //         const result = await pool.query(
    //             "SELECT s.\"sessionToken\" FROM sessions s INNER JOIN users u ON u.id = s.\"userId\" WHERE u.email = $1",
    //             [session.user.email]
    //         );
    //         session.sessionToken = result.rows[0].sessionToken;
    //         return session;
    //     }
    // }
};

export default NextAuth(authOptions)
