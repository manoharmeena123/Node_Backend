require("dotenv").config();

const otpService = {
    generateOTP: () => {
        // Generate a 4-digit random number
        const otp = Math.floor(Math.random() * (9999 - 1000 + 1)) + 1000;

        return otp.toString();
    },

    sendOTP: async (phoneNumber, message) => {
        // Use your preferred SMS gateway API to send the OTP to the user's phone number
        // Here is an example using the Twilio API

        const accountSid = process.env.TWILIO_ACCOUNT_SID;
        const authToken = process.env.TWILIO_AUTH_TOKEN;
        const twilioClient = require("twilio")(accountSid, authToken);

        try {
            const messageResult = await twilioClient.messages.create({
                body: message,
                from: process.env.TWILIO_PHONE_NUMBER,
                to: phoneNumber,
            });
            console.log(messageResult.sid);
            return true;
        } catch (err) {
            console.error(err);
            return false;
        }
    },
};

module.exports = otpService;
