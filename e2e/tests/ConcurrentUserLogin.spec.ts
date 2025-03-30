import { test, expect } from '@playwright/test';
import speakeasy from 'speakeasy';

const BASE_URL = 'https://localhost';
const PASSWORD = 'spelunkers123';
const OTP_SECRET = "G5AGCNDNEMSWM326LZJDGSDGLZSEA6RQMFBEQWCIO47TOQDYIRKQ"; // Replace with the actual OTP secret
const USERNAME_TEMPLATE = 'testuser01@test.com';

test('Concurrent user login', async ({ browser }) => {
    const concurrencyLimit = 10; // Limit the number of concurrent logins
    const activePromises: Promise<void>[] = [];
    const userPromises: Promise<void>[] = [];

    for (let i = 1; i <= 10; i++) {
        const username = USERNAME_TEMPLATE.replace('01', i.toString().padStart(2, '0'));
        const otp = speakeasy.totp({
            secret: OTP_SECRET,
            encoding: 'base32',
        });

        const loginPromise = (async () => {
            // Create a new browser context with SSL errors ignored
            const context = await browser.newContext({
                ignoreHTTPSErrors: true, // Ignore invalid SSL certificates
            });
            const page = await context.newPage();

            // Navigate to the login page
            await page.goto(BASE_URL);

            // Fill in the username
            await page.fill('input[name="username"]', username);

            // Fill in the password
            await page.fill('input[name="password"]', PASSWORD);

            // Fill in the OTP code
            await page.fill('input[name="otp"]', otp);

            // Submit the form
            await page.click('button[type="submit"]');

            // Wait for navigation or a success indicator
            await page.waitForNavigation();

            // Assert that the login was successful (e.g., check for a specific element on the dashboard)
            await expect(page).toHaveURL(/dashboard/); // Replace `/dashboard/` with the actual URL or pattern

            console.log(`Login successful for ${username}`);

            // Close the browser context
            await context.close();
        })();

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