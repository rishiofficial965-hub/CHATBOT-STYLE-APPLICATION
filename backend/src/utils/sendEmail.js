import * as SibApiV3Sdk from "@getbrevo/brevo";

const apiInstance = new SibApiV3Sdk.TransactionalEmailsApi();

// Configure API key
apiInstance.setApiKey(SibApiV3Sdk.TransactionalEmailsApiApiKeys.apiKey, process.env.BREVO_API_KEY);

export const sendEmail = async (to, subject, text, html) => {
    try {
        const sendSmtpEmail = new SibApiV3Sdk.SendSmtpEmail();

        sendSmtpEmail.subject = subject;
        sendSmtpEmail.htmlContent = html || `<p>${text}</p>`;
        // Using the user's gmail as the sender since it's verified in their account
        sendSmtpEmail.sender = { name: "AI Chatbot", email: "rishiranjan1703@gmail.com" };
        sendSmtpEmail.to = [{ email: to }];

        const data = await apiInstance.sendTransacEmail(sendSmtpEmail);
        console.log("✅ Email sent successfully via Brevo. Message ID:", data.messageId);
        return data;
    } catch (error) {
        console.error("❌ Brevo Email Error:", error.response?.body || error.message);
        throw new Error("Failed to send verification email");
    }
};
