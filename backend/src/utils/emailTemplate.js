export const otpTemplate = (otp, name) => {
    return `
    <!DOCTYPE html>
    <html>
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <style>
            body {
                font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
                background-color: #0d0d0d;
                margin: 0;
                padding: 0;
                color: #ffffff;
            }
            .container {
                max-width: 600px;
                margin: 40px auto;
                background: #1a1a1a;
                border-radius: 16px;
                overflow: hidden;
                box-shadow: 0 10px 30px rgba(0,0,0,0.5);
                border: 1px solid #333;
            }
            .header {
                background: linear-gradient(135deg, #6366f1 0%, #a855f7 100%);
                padding: 40px 20px;
                text-align: center;
            }
            .logo {
                font-size: 28px;
                font-weight: 800;
                letter-spacing: -1px;
                margin: 0;
                color: #ffffff;
                text-transform: uppercase;
            }
            .content {
                padding: 40px;
                text-align: center;
            }
            h1 {
                font-size: 24px;
                margin-bottom: 16px;
                color: #ffffff;
            }
            p {
                color: #a1a1aa;
                line-height: 1.6;
                margin-bottom: 24px;
            }
            .otp-container {
                background: #262626;
                padding: 20px;
                border-radius: 12px;
                display: inline-block;
                margin: 10px 0;
                border: 1px solid #3f3f46;
            }
            .otp-code {
                font-size: 36px;
                font-weight: 700;
                letter-spacing: 8px;
                color: #818cf8;
                margin: 0;
            }
            .footer {
                padding: 20px;
                text-align: center;
                font-size: 12px;
                color: #71717a;
                border-top: 1px solid #333;
            }
            .accent {
                color: #818cf8;
            }
        </style>
    </head>
    <body>
        <div class="container">
            <div class="header">
                <div class="logo">AI Chatbot</div>
            </div>
            <div class="content">
                <h1>Verify Your Account</h1>
                <p>Hi <span class="accent">${name}</span>,</p>
                <p>Thanks for joining us! Please use the following One-Time Password (OTP) to verify your email address. This code is valid for 10 minutes.</p>
                <div class="otp-container">
                    <p class="otp-code">${otp}</p>
                </div>
                <p>If you didn't request this code, you can safely ignore this email.</p>
            </div>
            <div class="footer">
                &copy; ${new Date().getFullYear()} Perplexity Clone. All rights reserved.<br>
                Empowering your search with AI.
            </div>
        </div>
    </body>
    </html>
    `;
};
