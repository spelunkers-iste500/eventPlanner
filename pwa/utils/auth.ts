import NextAuth from "next-auth"
import GitHub from "next-auth/providers/github" //todo: replace with microsoft/azure
import Google from "next-auth/providers/google"
import SendGrid from "next-auth/providers/sendgrid"
import PostgresAdapter from "./PostgresAdapter"
import { Pool } from "pg"
/* eslint-disable */
// @ts-nocheck
export const pool = new Pool({
    user: process.env.POSTGRES_USER,
    host: process.env.DB_HOST,
    database: process.env.POSTGRES_DB,
    password: process.env.POSTGRES_PASSWORD,
    max: 20,
    idleTimeoutMillis: 30000,
    connectionTimeoutMillis: 2000,
});

export const { handlers, signIn, signOut, auth } = NextAuth({
    providers: [
        GitHub({
            clientId: process.env.GITHUB_ID,
            clientSecret: process.env.GITHUB_SECRET,
        }),
        Google({
            clientId: process.env.GOOGLE_ID,
            clientSecret: process.env.GOOGLE_SECRET,
        }),
        SendGrid({
            apiKey: process.env.SENDGRID_KEY,
            from: process.env.SENDGRID_FROM,
        }),
    ],
    adapter: PostgresAdapter(pool),
    pages: {
        signIn: "/login",
        verifyRequest: "/verify",
    },
})