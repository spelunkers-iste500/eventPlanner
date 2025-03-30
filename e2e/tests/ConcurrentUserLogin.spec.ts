import { test, expect } from '@playwright/test';
import speakeasy from 'speakeasy';
import axios from 'axios';
import https from 'https';

const BASE_URL = 'https://localhost';
const PASSWORD = 'spelunkers123';
const OTP_SECRET = "G5AGCNDNEMSWM326LZJDGSDGLZSEA6RQMFBEQWCIO47TOQDYIRKQ"; // Replace with the actual OTP secret
const USERNAME_TEMPLATE = 'testuser01@test.com';

async function loginUser(username: string, password: string, otp: string) {
    const httpsAgent = new https.Agent({
        rejectUnauthorized: false, // Disable SSL certificate validation
    });

    const response = await axios.post(
        `${BASE_URL}`,
        {
            username,
            password,
            otp,
        },
        {
            httpsAgent, // Pass the custom HTTPS agent
        }
    );
    return response;
}

test('Concurrent user login', async () => {
    const concurrencyLimit = 10; // Limit the number of concurrent logins
    const activePromises: Promise<void>[] = [];
    const userPromises: Promise<void>[] = [];

    for (let i = 1; i <= 10; i++) {
        const username = USERNAME_TEMPLATE.replace('01', i.toString().padStart(2, '0'));
        const otp = speakeasy.totp({
            secret: OTP_SECRET,
            encoding: 'base32',
        });

        const loginPromise = loginUser(username, PASSWORD, otp)
            .then((response) => {
                expect(response.status).toBe(200); // Assert successful login
                console.log(`Login successful for ${username}`);
            })
            .catch((error) => {
                console.error(`Login failed for ${username}:`, error.response?.data || error.message);
            });

        activePromises.push(loginPromise);

        if (activePromises.length >= concurrencyLimit) {
            await Promise.race(activePromises);
            activePromises.splice(0, 1); // Remove the resolved promise
        }

        userPromises.push(loginPromise);
    }

    await Promise.all(userPromises);
    console.log('All login attempts completed.');
});