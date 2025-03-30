import { test, expect, chromium, firefox } from '@playwright/test';
import speakeasy from 'speakeasy';

const BASE_URL = 'https://localhost';
const PASSWORD = 'spelunkers123';
const OTP_SECRET = "G5AGCNDNEMSWM326LZJDGSDGLZSEA6RQMFBEQWCIO47TOQDYIRKQ"; // Replace with the actual OTP secret
const USERNAME_TEMPLATE = 'testuser001@test.com'; // Template for usernames

// Configure the test to use only Chromium
test.use({ browserName: 'chromium' });

test('Concurrent user login', async () => {
    test.setTimeout(80000); // Increase timeout to 60 seconds
    const concurrencyLimit = 10; // Limit the number of concurrent logins
    const activePromises: Promise<void>[] = [];
    const userPromises: Promise<void>[] = [];

    for (let i = 1; i <= 10; i++) {
        // Generate the username by replacing the numeric part in the template
        const username = USERNAME_TEMPLATE.replace('001', i.toString().padStart(3, '0'));
        

        const loginPromise = (async () => {
            // Launch Chromium browser
            const browser = await firefox.launch({ headless: true }); // Set headless to true if you don't want a visible browser
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
                console.log(`logging in as ${username}`); // Log the username entry
                await page.type('input[type="email"]', username, { delay: 100 }); // Add a small delay between keystrokes
                // No additional code is needed here after removing the check for username
                // Fill in the password
                await page.type('input[type="password"]', PASSWORD, { delay: 100 });
                //console.log(`Filled in password for ${username}`); // Log the password entry
                // Fill in the OTP code
                const otp = speakeasy.totp({secret: OTP_SECRET,encoding: 'base32',});
                await page.fill('input[name="One-Time Passcode (OTP)"]', otp);
                //console.log(`Filled in OTP for ${username}: ${otp}`); // Log the OTP entry
                // Submit the form
                await page.waitForTimeout(100);
                await page.click('button[type="submit"]');
                await page.waitForTimeout(3000);
                // Wait for navigation or a success indicator
                const welcomeVisible = await page.isVisible('h1:has-text("Welcome")', {
                    timeout: 10000, // Adjust the timeout as needed
                });
                
                if (welcomeVisible) {
                    console.log(`Login successful for ${username}`);
                } else {
                    console.error(`Login failed for ${username}`);
                    throw new Error(`Login failed for ${username}`);
                    
                }
                await page.waitForTimeout(8000);
            } catch (error) {
                console.error(`An error occurred during login for ${username}:`, error instanceof Error ? error.stack || error.message : String(error));
                throw new Error(`Login failed for ${username}: ${error instanceof Error ? error.message : String(error)}`); // Rethrow the error to fail the test
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