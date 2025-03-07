// https://medium.com/@farmaan30327/two-factor-authentication-with-nextjs-6a51299e5deb

import { NextApiRequest, NextApiResponse } from "next";
import { NextRequest } from "next/server";
import speakeasy from "speakeasy";
import { pool } from "Utils/auth";

import { auth } from 'Utils/auth';

export async function POST(req: NextRequest, res: NextApiResponse) {

    const { secret, token } = await req.json();

    const session = await auth();

    if (!session) {
        return Response.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Here, we have to implement 2 strategies
    // 1. Verifying during LOGIN
    // 2. Enabling 2FA for the first time

    // 1. Verifying during LOGIN
    // if (!session) {

    //     const verified = speakeasy.totp.verify({
    //         secret: secret, // Secret Key
    //         encoding: "base32",
    //         token: token,   // OTP Code
    //     });

    //     return Response.json({ verified });

    // } else {

    // 2. Enabling 2FA for the first time
        const verified = speakeasy.totp.verify({
            secret: secret, // Secret Key
            encoding: "base32",
            token: token,   // OTP Code
        });

    if (verified) {
            pool.query('UPDATE users SET otp_secret = $1 WHERE id = $2', [secret, session.id]);
            // save the secret in your database
            // Don't forget to encrypt it
        }
        return Response.json({ verified });

    // }

}