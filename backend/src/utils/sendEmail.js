import nodemailer from "nodemailer";
import { google } from "googleapis";

const OAuth2 = google.auth.OAuth2;

const createTransporter = async () => {
    try {
        const oauth2Client = new OAuth2(
            process.env.GOOGLE_CLIENT_ID,
            process.env.GOOGLE_CLIENT_SECRET,
            "https://developers.google.com/oauthplayground"
        );

        oauth2Client.setCredentials({
            refresh_token: process.env.GOOGLE_REFRESH_TOKEN,
        });

        const accessToken = await oauth2Client.getAccessToken();

        const transporter = nodemailer.createTransport({
            service: "gmail",
            auth: {
                type: "OAuth2",
                user: process.env.GOOGLE_USER,
                clientId: process.env.GOOGLE_CLIENT_ID,
                clientSecret: process.env.GOOGLE_CLIENT_SECRET,
                refreshToken: process.env.GOOGLE_REFRESH_TOKEN,
                accessToken: accessToken.token,
            },
        });

        return transporter;
    } catch (error) {
        console.error("❌ Failed to create email transporter:", error.message);
        throw new Error("Email service configuration failed");
    }
};

export const sendEmail = async (to, subject, text, html) => {
    try {
        const transporter = await createTransporter();
        await transporter.verify();
        console.log("✅ SMTP connection verified");

        const info = await transporter.sendMail({
            from: process.env.GOOGLE_USER,
            to,
            subject,
            text,
            html,
        });
        console.log(`✅ Email sent to ${to} | Message ID: ${info.messageId}`);
    } catch (error) {
        console.error("❌ Failed to send email:", error.message);
        throw new Error(`Failed to send email to ${to}`);
    }
};

