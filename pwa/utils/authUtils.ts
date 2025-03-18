import axios from 'axios';

export const verifyOTP = async (secret: string, token: string) => {
    try {
        const response = await axios.post('/api/auth/2fa/verify', { secret, token }, {
            headers: {
                "Content-Type": "application/json"
            }
        });

        return response.data.verified;
    } catch (error) {
        console.error('Error verifying OTP:', error);
        return false;
    }
};