import { test, expect, chromium } from '@playwright/test';
import speakeasy from 'speakeasy';

const BASE_URL = 'https://localhost';
const PASSWORD = 'spelunkers123';
const OTP_SECRET = "G5AGCNDNEMSWM326LZJDGSDGLZSEA6RQMFBEQWCIO47TOQDYIRKQ"; // Replace with the actual OTP secret
const USERNAME_TEMPLATE = 'testuser001@test.com'; // Template for usernames

// Configure the test to use only Chromium
test.use({ browserName: 'chromium' });

test('Concurrent user login', async () => {
    test.setTimeout(12000); // Increase timeout to 60 seconds
    const concurrencyLimit = 5; // Limit the number of concurrent logins
    const activePromises: Promise<void>[] = [];
    const userPromises: Promise<void>[] = [];

    for (let i = 1; i <= 2; i++) {
        // Generate the username by replacing the numeric part in the template
        const username = USERNAME_TEMPLATE.replace('001', i.toString().padStart(3, '0'));
        const otp = speakeasy.totp({
            secret: OTP_SECRET,
            encoding: 'base32',
        });

        const loginPromise = (async () => {
            // Launch Chromium browser
            const browser = await chromium.launch({ headless: true }); // Set headless to true if you don't want a visible browser
            const context = await browser.newContext({
                ignoreHTTPSErrors: true, // Ignore invalid SSL certificates
            });
            const page = await context.newPage();

            try {
            // Navigate to the login page
            await page.goto(BASE_URL);
            await page.waitForSelector('h1:has-text("Login Portal")', {
                timeout: 10000 // Adjust the timeout as needed
            });

                // Check if the login form is visible
                const loginFormVisible = await page.isVisible('input[name="One-Time Passcode (OTP)"]');
                if (!loginFormVisible) {
                    console.error(`Login form not visible for ${username}`);
                    return; // Exit if the login form is not visible
                }

                // Fill in the username
                await page.fill('input#Email', username);
                console.log(`Filled in username: ${username}`); // Log the username being used for login
                // Fill in the password
                await page.fill('input[type="password"]', PASSWORD);
                console.log(`Filled in password for ${username}`); // Log the password entry
                // Fill in the OTP code
                await page.fill('input[name="One-Time Passcode (OTP)"]', otp);
                console.log(`Filled in OTP for ${username}: ${otp}`); // Log the OTP entry
                // Submit the form
                await page.click('button[type="submit"]');

                // Wait for navigation or a success indicator
                const welcomeVisible = await page.isVisible('h1:has-text("Welcome,")', {
                    timeout: 10000, // Adjust the timeout as needed
                });

                if (welcomeVisible) {
                    console.log(`Login successful for ${username}`);
                } else {
                    console.error(`Login failed for ${username}`);
                }
            } catch (error) {
                console.error(`An error occurred during login for ${username}:`, error);
            } finally {
                // Close the browser context
                await context.close();
                await browser.close();
            }
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