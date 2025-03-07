import NextAuth from "next-auth"
import Credentials from "next-auth/providers/credentials"
import axios from "axios"
// import PostgresAdapter from "./PostgresAdapter"
import speakeasy from "speakeasy";
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
        // GitHub({
        //     clientId: process.env.GITHUB_ID,
        //     clientSecret: process.env.GITHUB_SECRET,
        // }),
        // Google({
        //     clientId: process.env.GOOGLE_ID,
        //     clientSecret: process.env.GOOGLE_SECRET,
        // }),
        // SendGrid({
        //     apiKey: process.env.SENDGRID_KEY,
        //     from: process.env.SENDGRID_FROM,
        // }),
        Credentials({
            // The name to display on the sign in form (e.g. 'Sign in with...')
            name: "Credentials w/ 2FA",
            // The credentials is used to generate a suitable form on the sign in page.
            // You can specify whatever fields you are expecting to be submitted.
            // e.g. domain, username, password, 2FA token, etc.
            credentials: {
                email: { label: "Email", type: "text" },
                password: { label: "Password", type: "password" },
                otp: { label: "OTP", type: "text" },
            },
            async authorize(credentials, req) {
                // Add logic here to look up the user from the credentials supplied
                // query the backend to get a jwt token
                // if no token, return null
                const authResponse = await axios.post("http://php/auth", {
                    email: credentials.email,
                    password: credentials.password,
                    headers: {
                        "Content-Type": "application/json",
                        "accept": "application/json",
                    }
                })
                // only query the db if the authResponse is successful
                if (authResponse.status >= 300) {
                    return null;
                }
                const dbQuery = await pool.query("SELECT users.otp_secret, users.id FROM users WHERE email = $1", [credentials.email]);
                // @todo add 2fa verification
                const verified = speakeasy.totp.verify({
                    secret: dbQuery.rows[0].otp_secret, // Secret Key
                    encoding: "base32",
                    token: credentials.otp,   // OTP Code
                });
                if (!verified) {
                    return null;
                }

                const apiToken = authResponse.data.token
                // return authResponse.status
                return { username: credentials.email, token: apiToken, id: dbQuery.rows[0].id, secondFactor: (dbQuery.rows[0].otp_secret) ? true : false };
            }
        }),
        Credentials({
            // The name to display on the sign in form (e.g. 'Sign in with...')
            name: "Credentials w/o 2FA",
            // The credentials is used to generate a suitable form on the sign in page.
            // You can specify whatever fields you are expecting to be submitted.
            // e.g. domain, username, password, 2FA token, etc.
            credentials: {
                email: { label: "Email", type: "text" },
                password: { label: "Password", type: "password" },
            },
            async authorize(credentials, req) {
                // Add logic here to look up the user from the credentials supplied
                // query the backend to get a jwt token
                // if no token, return null
                const authResponse = await axios.post("http://php/auth", {
                    email: credentials.email,
                    password: credentials.password,
                    headers: {
                        "Content-Type": "application/json",
                        "accept": "application/json",
                    }
                })
                // only query the db if the authResponse is successful
                if (authResponse.status >= 300) {
                    return null;
                }

                const dbQuery = await pool.query("SELECT users.id FROM users WHERE email = $1", [credentials.email]);

                const apiToken = authResponse.data.token
                return { username: credentials.email, token: apiToken, id: dbQuery.rows[0].id, secondFactor: false };
            }
        }
    )

    ],
    session: {
        strategy: "jwt",
    },
    callbacks: {
        async session({ session, token }) {
            // console.log('Session callback: ', session, token);
            if (token) {
                session.id = token.id;
                session.email = token.email;
                session.apiToken = token.apiToken;
                session.secondFactor = token.secondFactor;
            }
            return session;
        },
        async jwt({ token, account, profile, user }) {
            // console.log('JWT callback: ', user, token);
            if (user) {
                token.id = user.id;
                token.email = user.username;
                token.apiToken = user.token;
                token.secondFactor = (user.secondFactor) ? true : false;
            }
            return token;
    }
    }
    // adapter: PostgresAdapter(pool),
    // pages: {
    //     signIn: "/login",
    //     verifyRequest: "/verify",
    // },
    }
)