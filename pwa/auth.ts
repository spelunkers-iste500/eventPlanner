import NextAuth, { AuthOptions } from "next-auth"
import GitHub from "next-auth/providers/github" //todo: replace with microsoft/azure
import Google from "next-auth/providers/google"
import type { Provider } from "@auth/core/providers";
import SendGrid from "next-auth/providers/sendgrid"
import PostgresAdapter from "./utils/PostgresAdapter"
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

// const authOptions: AuthOptions = {
//     providers: [GitHub({
//         clientId: process.env.GITHUB_ID,
//         clientSecret: process.env.GITHUB_SECRET,
//     }), Google, SendGrid],
//     adapter: PostgresAdapter(pool),
// }

// export const { auth, handlers, signIn, signOut } = NextAuth({
//     // Configure one or more authentication providers
//     providers: [
//         // GitHub(), Google(), SendGrid()
//         GitHub({
//             clientId: process.env.GITHUB_ID,
//             clientSecret: process.env.GITHUB_SECRET,
//             authorization: {
//                 params: {
//                     prompt: "consent",
//                     response_type: "code",
//                 },
//             },
//         }),
//         Google({
//             clientId: process.env.GOOGLE_ID,
//             clientSecret: process.env.GOOGLE_SECRET,
//             authorization: {
//                 params: {
//                     prompt: "select_account",
//                     response_type: "code",
//                 },
//             },
//         }),
//         SendGrid({
//             from: process.env.SENDGRID_FROM,
//         } satisfies NextAuthConfig )
//         // ...add more providers here
//     ],
    
// })

export const config = {
    providers: [GitHub({
        clientId: process.env.GITHUB_ID,
        clientSecret: process.env.GITHUB_SECRET,
    }), Google({
        clientId: process.env.GOOGLE_ID,
        clientSecret: process.env.GOOGLE_SECRET,
    }), SendGrid({
        from: process.env.SENDGRID_FROM,
    })] as Provider[],
    adapter: PostgresAdapter(pool),
} as AuthOptions

export const { auth, handlers, signIn, signOut } = NextAuth(config)

// export default NextAuth(authOptions)
