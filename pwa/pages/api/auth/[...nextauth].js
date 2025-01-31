import NextAuth from "next-auth";
import GithubProvider from "next-auth/providers/github"; // todo: replace with microsoft/azure
import GoogleProvider from "next-auth/providers/google";
import Sendgrid from "next-auth/providers/sendgrid"
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
        Sendgrid({
            from: process.env.SENDGRID_FROM,
        })
        // ...add more providers here
    ],
    adapter: PostgresAdapter(pool),
};

export default NextAuth(authOptions)
