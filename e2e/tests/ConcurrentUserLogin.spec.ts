import { test, expect } from '@playwright/test';
import speakeasy from 'speakeasy';

const BASE_URL = 'https://localhost';
const PASSWORD = 'spelunkers123';
const OTP_SECRET = "G5AGCNDNEMSWM326LZJDGSDGLZSEA6RQMFBEQWCIO47TOQDYIRKQ"; // Replace with the actual OTP secret
const USERNAME_TEMPLATE = 'testuser01@test.com';

test('Concurrent user login', async ({ browser }) => {
    test.setTimeout(60000); // Increase timeout to 60 seconds
    const concurrencyLimit = 10; // Limit the number of concurrent logins
    const activePromises: Promise<void>[] = [];
    const userPromises: Promise<void>[] = [];

    for (let i = 1; i <= 2; i++) {
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
            await page.waitForSelector('h1:has-text("Login Portal")', {
                timeout: 10000 // Adjust the timeout as needed
            });
            // Check if the login form is visible
            const loginFormVisible = await page.isVisible('input[name="One-Time Passcode (OTP)"]');
            if (!loginFormVisible) {    
                console.error(`Login form not visible for ${username}`);
                await context.close();
                return; // Exit if the login form is not visible
            }
            // Fill in the username
            await page.fill('input#Email', username);

            // Fill in the password
            await page.fill('input.chakra-input.login_password-input__BLSlw', PASSWORD);

            // Fill in the OTP code
            await page.fill('input[name="One-Time Passcode (OTP)"]', otp);

            // Submit the form
            await page.click('button[type="submit"]');

            // Wait for navigation or a success indicator
            await page.waitForSelector('h1:has-text("Login Portal")', {
                timeout: 10000 // Adjust the timeout as needed
            });
            // Check for login error message
            const loginErrorVisible = await page.isVisible('div.error-msg:has-text("An error occurred during login")');
            if (loginErrorVisible) {
                console.error(`Login failed for ${username}`);
                await context.close();
                return; // Exit if login failed
            }
            else{console.log(`Login successful for ${username}`);
        }
            
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