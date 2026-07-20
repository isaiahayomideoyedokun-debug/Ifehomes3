import twilio from "twilio";

const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;

// Only constructed when Twilio env vars are present — phone OTP is optional.
export const twilioClient =
  accountSid && authToken ? twilio(accountSid, authToken) : null;

export const twilioVerifyServiceSid = process.env.TWILIO_VERIFY_SERVICE_SID;
