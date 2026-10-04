const nodemailer = require("nodemailer");
const twilio = require("twilio");

// Email transporter
const getEmailTransporter = () => {
    const emailUser = process.env.EMAIL_USER;
    const emailPass = process.env.EMAIL_PASS;

    if (!emailUser || !emailPass) {
        throw new Error(
            "EMAIL_USER or EMAIL_PASS is missing"
        );
    }

    return nodemailer.createTransport({
        host: "smtp.gmail.com",
        port: 465,
        secure: true,
        auth: {
            user: emailUser,
            pass: emailPass,
        },
        connectionTimeout: 15000,
        greetingTimeout: 15000,
        socketTimeout: 20000,
    });
};

// Send email OTP
const sendEmailOTP = async (toEmail, otp, userName = "User") => {
    if (!toEmail) {
        throw new Error("Recipient email is required");
    }

    if (!otp) {
        throw new Error("OTP is required");
    }

    console.log(`[OTP] Sending email to ${toEmail}`);

    const transporter = getEmailTransporter();

    const mailOptions = {
        from: `"Virtual Office" <${process.env.EMAIL_USER}>`,
        to: toEmail,
        subject: `${otp} is your Virtual Office verification code`,

        text: `Hello ${userName},

Your Virtual Office verification code is: ${otp}

This code is valid for 10 minutes.

If you did not request this code, please ignore this email.

Virtual Office`,

        html: `
            <!DOCTYPE html>
            <html>
            <head>
                <meta charset="UTF-8">
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
                <title>Virtual Office Verification</title>
            </head>

            <body style="
                margin: 0;
                padding: 0;
                background-color: #0f172a;
                font-family: Arial, Helvetica, sans-serif;
            ">

                <div style="
                    max-width: 500px;
                    margin: 40px auto;
                    padding: 30px;
                    background-color: #111827;
                    color: #ffffff;
                    border-radius: 12px;
                    border: 1px solid #374151;
                    box-sizing: border-box;
                ">

                    <h2 style="
                        margin: 0 0 25px;
                        text-align: center;
                        color: #6366f1;
                    ">
                        Virtual Office Verification
                    </h2>

                    <p style="
                        font-size: 16px;
                        color: #d1d5db;
                    ">
                        Hello <strong>${userName}</strong>,
                    </p>

                    <p style="
                        font-size: 15px;
                        line-height: 1.6;
                        color: #9ca3af;
                    ">
                        Use the following One-Time Password (OTP)
                        to securely sign in to your Virtual Office account.
                    </p>

                    <div style="
                        text-align: center;
                        margin: 30px 0;
                    ">
                        <span style="
                            display: inline-block;
                            font-size: 32px;
                            font-weight: bold;
                            letter-spacing: 8px;
                            color: #22c55e;
                            background-color: #1e293b;
                            padding: 15px 25px;
                            border-radius: 8px;
                            border: 1px dashed #22c55e;
                        ">
                            ${otp}
                        </span>
                    </div>

                    <p style="
                        text-align: center;
                        font-size: 14px;
                        color: #9ca3af;
                    ">
                        This code is valid for <strong>10 minutes</strong>.
                    </p>

                    <p style="
                        margin-top: 30px;
                        text-align: center;
                        font-size: 13px;
                        color: #6b7280;
                    ">
                        If you didn't request this code,
                        please ignore this email.
                    </p>

                    <hr style="
                        margin: 25px 0;
                        border: 0;
                        border-top: 1px solid #374151;
                    ">

                    <p style="
                        margin: 0;
                        text-align: center;
                        font-size: 12px;
                        color: #6b7280;
                    ">
                        Virtual Office
                    </p>

                </div>

            </body>
            </html>
        `,
    };

    try {
        await transporter.verify();

        console.log("[OTP] Email connection verified");

        const info = await transporter.sendMail(mailOptions);

        console.log(
            `[OTP] Email sent to ${toEmail}. ID: ${info.messageId}`
        );

        return {
            success: true,
            messageId: info.messageId,
        };

    } catch (error) {
        console.error("[OTP Email Error]", {
            message: error.message,
            code: error.code,
            responseCode: error.responseCode,
        });

        throw new Error(
            `Failed to send OTP email: ${error.message}`
        );
    }
};

// Twilio client
const getTwilioClient = () => {
    const accountSid = process.env.TWILIO_ACCOUNT_SID;
    const authToken = process.env.TWILIO_AUTH_TOKEN;

    if (!accountSid || !authToken) {
        throw new Error(
            "TWILIO_ACCOUNT_SID or TWILIO_AUTH_TOKEN is missing"
        );
    }

    return twilio(accountSid, authToken);
};

// Format phone number
const formatPhoneNumber = (phone) => {
    if (!phone) {
        throw new Error("Phone number is required");
    }

    let formattedPhone = String(phone).trim();

    if (formattedPhone.startsWith("+")) {
        return formattedPhone;
    }

    if (/^\d{10}$/.test(formattedPhone)) {
        return `+91${formattedPhone}`;
    }

    return `+${formattedPhone}`;
};

// Send SMS OTP
const sendSmsOTP = async (toPhone, otp) => {
    if (!toPhone) {
        throw new Error("Phone number is required");
    }

    if (!otp) {
        throw new Error("OTP is required");
    }

    console.log(`[OTP] Sending SMS to ${toPhone}`);

    const accountSid = process.env.TWILIO_ACCOUNT_SID;
    const authToken = process.env.TWILIO_AUTH_TOKEN;
    const twilioPhoneNumber = process.env.TWILIO_PHONE_NUMBER;

    if (!accountSid || !authToken || !twilioPhoneNumber) {
        throw new Error(
            "Twilio environment variables are missing"
        );
    }

    const client = getTwilioClient();
    const formattedPhone = formatPhoneNumber(toPhone);

    try {
        const message = await client.messages.create({
            body: `Your Virtual Office login code is: ${otp}. Valid for 10 minutes.`,
            from: twilioPhoneNumber,
            to: formattedPhone,
        });

        console.log(
            `[OTP] SMS sent to ${formattedPhone}. SID: ${message.sid}`
        );

        return {
            success: true,
            messageSid: message.sid,
        };

    } catch (error) {
        console.error("[OTP SMS Error]", {
            message: error.message,
            code: error.code,
            status: error.status,
        });

        throw new Error(
            `Failed to send OTP SMS: ${error.message}`
        );
    }
};

module.exports = {
    sendEmailOTP,
    sendSmsOTP,
};
