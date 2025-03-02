// https://medium.com/@farmaan30327/two-factor-authentication-with-nextjs-6a51299e5deb

import QRCode from "qrcode";
import speakeasy from "speakeasy";

export async function GET() {

    const secret = speakeasy.generateSecret({
        name: "Travel Planner App",
    });

    if (!secret) return Response.json({
        message: "Failed to generate secret", status: 500});

    const data = await QRCode.toDataURL(secret.otpauth_url);

    return Response.json({ data, secret: secret.base32, status: 200 });
}