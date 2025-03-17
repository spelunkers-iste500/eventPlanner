import NextAuth, {User} from "next-auth"
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


declare module "next-auth" {
    interface Session {
        id: number;
        email: string;
        apiToken: string;
        secondFactor: boolean;
    }
    interface User {
        username: string;
        token: string;
        secondFactor: boolean;
    }
    interface Credentials {
        email: string;
        password: string;
        otp: string;
    }
    interface JWT {
        id: number;
        email: string;
        apiToken: string;
        secondFactor: boolean;
    }
}

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
            id: "credentials-2fa",
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
                const apiUrl = (process.env.NEXTAUTH_URL?.endsWith("/")) ? process.env.NEXTAUTH_URL + "auth" : process.env.NEXTAUTH_URL + "/auth";

                const dbQuery = await pool.query("SELECT users.otp_secret, users.id FROM users WHERE email = $1", [credentials.email]);
                if (dbQuery.rowCount === 0) {
                    return null; // Return null if user not found
                }
                // Add logic here to look up the user from the credentials supplied
                // query the backend to get a jwt token
                // if no token, return null
                const authResponse = await axios.post(apiUrl, {
                    email: credentials.email,
                    password: credentials.password,
                    headers: {
                        "Content-Type": "application/json",
                        "accept": "application/json",
                    }
                })
                // only query the db if the authResponse is successful
                if (authResponse.status >= 300) {
                    console.log(authResponse.status + ": " + authResponse.statusText);
                    return null;
                }
                const verified = speakeasy.totp.verify({
                    secret: dbQuery.rows[0].otp_secret, // Secret Key
                    encoding: "base32",
                    token: credentials.otp as string,   // OTP Code
                });
                if (!verified) {
                    return null;
                }
                return { username: credentials.email, token: authResponse.data.token, id: dbQuery.rows[0].id, secondFactor: (dbQuery.rows[0].otp_secret) ? true : false } as User;
            }
        }),
        Credentials({
            id: "credentials-no-2fa",
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
                // var sslRootCAs = require('ssl-root-cas/latest')
                // sslRootCAs.inject()
                const apiUrl = (process.env.NEXTAUTH_URL?.endsWith("/")) ? process.env.NEXTAUTH_URL + "auth" : process.env.NEXTAUTH_URL + "/auth";

                // Add logic here to look up the user from the credentials supplied
                // query the backend to get a jwt token
                // if no token, return null
                const dbQuery = await pool.query("SELECT users.otp_secret, users.id FROM users WHERE email = $1", [credentials.email]);
                // if no user found, or if user with 2fa trying to auth without, return null
                if (dbQuery.rowCount === 0 || dbQuery.rows[0].otp_secret) {
                    return null;
                }
                const authResponse = await axios.post(apiUrl, {
                    email: credentials.email,
                    password: credentials.password,
                    headers: {
                        "Content-Type": "application/json",
                        "accept": "application/json",
                    }
                })
                // bad password
                if (authResponse.status >= 300 && authResponse.status < 500) {
                    return null;
                } else {
                    return null;
                }

                const apiToken = authResponse.data.token
                return { username: credentials.email, token: apiToken, id: dbQuery.rows[0].id, secondFactor: false } as User;
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
                session.id = token.id as number;
                session.email = token.email as string;
                session.apiToken = token.apiToken as string;
                session.secondFactor = token.secondFactor as boolean;
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