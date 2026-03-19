import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

export const sendEmail = async (to, subject, text, html) => {
    try {
        const { error } = await resend.emails.send({
            from: "onboarding@resend.dev",
            to,
            subject,
            html: html || `<p>${text}</p>`,
        });

        if (error) {
            console.error("❌ Failed to send email:", error.message);
            throw new Error(`Failed to send email to ${to}`);
        }

        console.log(`✅ Email sent to ${to}`);
    } catch (error) {
        console.error("❌ Failed to send email:", error.message);
        throw new Error(`Failed to send email to ${to}`);
    }
};
