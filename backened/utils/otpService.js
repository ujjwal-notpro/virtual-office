const nodemailer = require("nodemailer");
const twilio = require("twilio");

// Email Transporter (Gmail)
const getEmailTransporter = () => {
    if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
        return null;
    }
    return nodemailer.createTransport({
        service: "gmail",
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS,
        },
    });
};

// Send OTP via Email
const sendEmailOTP = async (toEmail, otp, userName = "User") => {
    console.log(`[OTP DEBUG] Generated OTP for ${toEmail}: ${otp}`);

    const transporter = getEmailTransporter();
    if (!transporter) {
        console.warn("[OTP] EMAIL_USER or EMAIL_PASS not configured in .env");
        return { success: true, simulated: true };
    }

    const mailOptions = {
        from: `"Virtual Office" <${process.env.EMAIL_USER}>`,
        to: toEmail,
        subject: `${otp} is your Virtual Office verification code`,
        html: `
            <div style="font-family: Arial, sans-serif; max-width: 500px; margin: 0 auto; padding: 20px; background-color: #111; color: #fff; border-radius: 8px; border: 1px solid #333;">
                <h2 style="color: #6366f1; text-align: center; margin-bottom: 24px;">Virtual Office Verification</h2>
                <p style="font-size: 16px; color: #ccc;">Hello <strong>${userName}</strong>,</p>
                <p style="font-size: 15px; color: #aaa; line-height: 1.5;">Use the following One-Time Password (OTP) to securely sign in to your Virtual Office account. This code is valid for <strong>10 minutes</strong>.</p>
                <div style="text-align: center; margin: 30px 0;">
                    <span style="font-size: 32px; font-weight: bold; letter-spacing: 8px; color: #22c55e; background: #1e293b; padding: 12px 24px; border-radius: 8px; border: 1px dashed #22c55e;">${otp}</span>
                </div>
                <p style="font-size: 13px; color: #777; text-align: center;">If you didn't request this code, please ignore this email.</p>
            </div>
        `,
    };

    try {
        await transporter.sendMail(mailOptions);
        console.log(`[OTP] Email successfully sent to ${toEmail}`);
        return { success: true };
    } catch (error) {
        console.error(`[OTP Error] Failed to send email to ${toEmail}:`, error.message);
        throw error;
    }
};

// Send OTP via SMS (Twilio)
const sendSmsOTP = async (toPhone, otp) => {
    console.log(`[OTP DEBUG] Generated SMS OTP for ${toPhone}: ${otp}`);

    const { TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN, TWILIO_PHONE_NUMBER } = process.env;

    if (!TWILIO_ACCOUNT_SID || !TWILIO_AUTH_TOKEN || !TWILIO_PHONE_NUMBER) {
        console.warn("[OTP] Twilio credentials not configured in .env");
        return { success: true, simulated: true };
    }

    try {
        const client = twilio(TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN);
        // Ensure phone starts with +
        let formattedPhone = toPhone.trim();
        if (!formattedPhone.startsWith("+")) {
            // Default to +91 or format
            formattedPhone = formattedPhone.length === 10 ? `+91${formattedPhone}` : `+${formattedPhone}`;
        }

        await client.messages.create({
            body: `Your Virtual Office login code is: ${otp}. Valid for 10 minutes.`,
            from: TWILIO_PHONE_NUMBER,
            to: formattedPhone,
        });

        console.log(`[OTP] SMS successfully sent to ${formattedPhone}`);
        return { success: true };
    } catch (error) {
        console.error(`[OTP Error] Failed to send SMS to ${toPhone}:`, error.message);
        throw error;
    }
};

module.exports = {
    sendEmailOTP,
    sendSmsOTP,
};
