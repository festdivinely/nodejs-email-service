import nodemailer from 'nodemailer';

// Load environment variables
const EMAIL_SENDER = process.env.EMAIL_SENDER || 'no-email-set';
const EMAIL_PASSWORD = process.env.EMAIL_PASSWORD || 'no-password-set';
const SMTP_SERVER = 'smtp.gmail.com';
const SMTP_PORT = 465;

// Configure nodemailer transporter
const transporter = nodemailer.createTransport({
    host: SMTP_SERVER,
    port: SMTP_PORT,
    secure: true,
    auth: {
        user: EMAIL_SENDER,
        pass: EMAIL_PASSWORD,
    },
});

// Email templates
const emailTemplates = {
    email_verification: (data) => {
        const { username, verificationLink, token, supportEmail } = data;

        return {
            subject: 'Verify Your Email - Quantum Robots',
            text: `
Welcome to Quantum Robots

To verify your email, tap and hold the following token to select and copy it, then paste it into the Verify Email screen in the app:

Token: ${token}

Or click this link to verify: ${verificationLink}

This token expires in 15 minutes. If you didn't register, ignore this email.

Need help? Contact ${supportEmail}
      `,
            html: `
<html>
<body style="margin:0; padding:0; font-family: Arial, sans-serif; background-color:#f4f7fb;">
  <table width="100%" border="0" cellspacing="0" cellpadding="0" style="padding:20px 0;">
    <tr>
      <td align="center">
        <table width="600" border="0" cellspacing="0" cellpadding="0" 
          style="background:#ffffff; border-radius:12px; box-shadow:0 4px 12px rgba(0,0,0,0.1); overflow:hidden;">
          
          <tr>
            <td align="center" 
              style="background: linear-gradient(90deg, #000000 0%, #00ff41 100%); 
                padding:30px; color:#ffffff; font-size:24px; font-weight:bold;">
              QUANTUM ROBOTS
            </td>
          </tr>

          <tr>
            <td style="padding:30px; color:#333333; font-size:16px; line-height:1.6;">
              <h2 style="margin-top:0; color:#000000;">Welcome, ${username}!</h2>
              <p>
                To verify your email, tap the token below to select it (on mobile, tap and hold to copy), 
                then paste it into the Verify Email screen in the app.
              </p>
              
              <p style="text-align:center; margin:30px 0;">
                <span style="font-size:18px; background:#f0f0f0; padding:15px 25px; border-radius:8px; 
                  display:inline-block; user-select:all; -webkit-user-select:all; -moz-user-select:all; 
                  cursor:pointer; font-weight:bold; border: 2px solid #00ff41;">
                  ${token}
                </span>
              </p>

              <p style="text-align:center;">
                <a href="${verificationLink}" 
                  style="background:#00ff41; color:#000000; padding:12px 30px; text-decoration:none; 
                  border-radius:5px; font-weight:bold; display:inline-block;">
                  Verify Email
                </a>
              </p>

              <p>
                This token expires in <b>15 minutes</b>. Open the Quantum Robots app and go to the 
                Verify Email screen to paste it. If you didn't sign up, ignore this email.
              </p>
            </td>
          </tr>

          <tr>
            <td align="center" 
              style="background:#000000; color:#00ff41; padding:20px; font-size:13px;">
              &copy; ${new Date().getFullYear()} Quantum Robots. All rights reserved.<br/>
              Need help? <a href="mailto:${supportEmail}" 
                style="color:#00ff41; text-decoration:none;">Contact Support</a>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>
      `
        };
    },

    device_verification: (data) => {
        const { username, deviceInfo, ip, country, timestamp, verificationCode, supportEmail } = data;

        return {
            subject: 'Device Verification Code - Quantum Robots',
            text: `
Device Verification Required - Quantum Robots

Hello ${username},

A login attempt was detected from a new device. To complete your login, please use the verification code below:

Verification Code: ${verificationCode}

Login Details:
- Device: ${deviceInfo}
- IP Address: ${ip}
- Location: ${country}
- Time: ${new Date(timestamp).toLocaleString()}

Enter this code in the verification prompt on your new device to complete the login process.

This code will expire in 10 minutes.

If you didn't attempt to log in from this device, please ignore this email and consider changing your password immediately.

For security reasons, unverified devices will be automatically removed after 2 hours.

Need help? Contact ${supportEmail}
      `,
            html: `
<html>
<body style="margin:0; padding:0; font-family: Arial, sans-serif; background-color:#f4f7fb;">
  <table width="100%" border="0" cellspacing="0" cellpadding="0" style="padding:20px 0;">
    <tr>
      <td align="center">
        <table width="600" border="0" cellspacing="0" cellpadding="0" 
          style="background:#ffffff; border-radius:12px; box-shadow:0 4px 12px rgba(0,0,0,0.1); overflow:hidden;">
          
          <tr>
            <td align="center" 
              style="background: linear-gradient(90deg, #000000 0%, #00ff41 100%); 
                padding:30px; color:#ffffff; font-size:24px; font-weight:bold;">
              QUANTUM ROBOTS
            </td>
          </tr>

          <tr>
            <td style="padding:30px; color:#333333; font-size:16px; line-height:1.6;">
              <h2 style="margin-top:0; color:#000000;">Device Verification Required</h2>
              <p>Hello ${username},</p>
              <p>A login attempt was detected from a new device. To complete your login, please use the verification code below:</p>
              
              <div style="text-align:center; margin:30px 0;">
                <div style="background:#000000; color:#00ff41; padding:20px; text-align:center; 
                  font-size:32px; font-weight:bold; letter-spacing:5px; border-radius:10px; 
                  margin:20px 0; font-family: 'Courier New', monospace;">
                  ${verificationCode}
                </div>
              </div>

              <div style="background:#f8f8f8; border-left:4px solid #00ff41; padding:15px; margin:15px 0;">
                <h3 style="margin-top:0; color:#000000;">Login Attempt Details:</h3>
                <p><strong>Device:</strong> ${deviceInfo}</p>
                <p><strong>IP Address:</strong> ${ip}</p>
                <p><strong>Location:</strong> ${country}</p>
                <p><strong>Time:</strong> ${new Date(timestamp).toLocaleString()}</p>
              </div>

              <div style="background:#fff3cd; border:1px solid #ffeaa7; padding:15px; border-radius:5px; margin:15px 0;">
                <p><strong>⚠️ Security Notice:</strong></p>
                <p>Enter this code in the verification prompt on your new device to complete the login process.</p>
                <p><strong>This code will expire in 10 minutes.</strong></p>
              </div>
              
              <p>If you didn't attempt to log in from this device, please ignore this email and consider changing your password immediately.</p>
            </td>
          </tr>

          <tr>
            <td align="center" 
              style="background:#000000; color:#00ff41; padding:20px; font-size:13px;">
              &copy; ${new Date().getFullYear()} Quantum Robots. All rights reserved.<br/>
              For security reasons, unverified devices will be automatically removed after 2 hours.<br/>
              Need help? <a href="mailto:${supportEmail}" 
                style="color:#00ff41; text-decoration:none;">Contact Support</a>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>
      `
        };
    },

    password_reset: (data) => {
        const { username, resetLink, token, supportEmail } = data;

        return {
            subject: 'Reset Your Password - Quantum Robots',
            text: `
Password Reset Request - Quantum Robots

Hello ${username},

We received a request to reset your password for your Quantum Robots account.

Reset Token: ${token}

Reset Link: ${resetLink}

This password reset link will expire in 1 hour.

If you didn't request a password reset, please ignore this email. Your account remains secure.

Need help? Contact ${supportEmail}
      `,
            html: `
<html>
<body style="margin:0; padding:0; font-family: Arial, sans-serif; background-color:#f4f7fb;">
  <table width="100%" border="0" cellspacing="0" cellpadding="0" style="padding:20px 0;">
    <tr>
      <td align="center">
        <table width="600" border="0" cellspacing="0" cellpadding="0" 
          style="background:#ffffff; border-radius:12px; box-shadow:0 4px 12px rgba(0,0,0,0.1); overflow:hidden;">
          
          <tr>
            <td align="center" 
              style="background: linear-gradient(90deg, #000000 0%, #00ff41 100%); 
                padding:30px; color:#ffffff; font-size:24px; font-weight:bold;">
              QUANTUM ROBOTS
            </td>
          </tr>

          <tr>
            <td style="padding:30px; color:#333333; font-size:16px; line-height:1.6;">
              <h2 style="margin-top:0; color:#000000;">Password Reset Request</h2>
              <p>Hello ${username},</p>
              <p>We received a request to reset your password for your Quantum Robots account.</p>
              
              <p><strong>Reset Token:</strong></p>
              <div style="background:#f0f0f0; padding:10px; border-radius:5px; font-family:monospace; margin:10px 0;">
                ${token}
              </div>
              
              <p style="text-align:center; margin:30px 0;">
                <a href="${resetLink}" 
                  style="background:#00ff41; color:#000000; padding:12px 30px; text-decoration:none; 
                  border-radius:5px; font-weight:bold; display:inline-block;">
                  Reset Password
                </a>
              </p>

              <p>If the button doesn't work, copy and paste this link in your browser:</p>
              <p style="word-break:break-all;">${resetLink}</p>
              
              <p><strong>This password reset link will expire in 1 hour.</strong></p>
              
              <p>If you didn't request a password reset, please ignore this email. Your account remains secure.</p>
            </td>
          </tr>

          <tr>
            <td align="center" 
              style="background:#000000; color:#00ff41; padding:20px; font-size:13px;">
              &copy; ${new Date().getFullYear()} Quantum Robots. All rights reserved.<br/>
              Need help? <a href="mailto:${supportEmail}" 
                style="color:#00ff41; text-decoration:none;">Contact Support</a>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>
      `
        };
    }
};

// Main email sending function
async function sendEmail(type, to, data) {
    try {
        if (EMAIL_SENDER === 'no-email-set' || EMAIL_PASSWORD === 'no-password-set') {
            console.error('Email sender or password not set', { timestamp: new Date().toISOString() });
            throw new Error('Email sender or password not set');
        }

        // Get the appropriate email template
        const template = emailTemplates[type];
        if (!template) {
            throw new Error(`Unknown email type: ${type}`);
        }

        // Generate email content
        const emailContent = template(data);

        // Send email
        await transporter.sendMail({
            from: EMAIL_SENDER,
            to: to,
            subject: emailContent.subject,
            text: emailContent.text,
            html: emailContent.html,
        });

        console.info(`Email sent successfully`, {
            type,
            to,
            timestamp: new Date().toISOString()
        });
        return true;
    } catch (error) {
        console.error(`Failed to send email`, {
            type,
            to,
            error: error.message,
            timestamp: new Date().toISOString(),
        });
        return false;
    }
}

// Vercel serverless function handler
export default async function handler(req, res) {
    // Only allow POST requests
    if (req.method !== 'POST') {
        return res.status(405).json({
            success: false,
            message: 'Method not allowed'
        });
    }

    try {
        const { type, to, data } = req.body;

        // Validate required fields
        if (!type || !to || !data) {
            return res.status(400).json({
                success: false,
                message: 'Missing required fields: type, to, or data'
            });
        }

        // Validate email type
        if (!emailTemplates[type]) {
            return res.status(400).json({
                success: false,
                message: `Invalid email type: ${type}. Valid types: ${Object.keys(emailTemplates).join(', ')}`
            });
        }

        // Send email
        const success = await sendEmail(type, to, data);

        if (success) {
            return res.status(200).json({
                success: true,
                message: 'Email sent successfully'
            });
        } else {
            return res.status(500).json({
                success: false,
                message: 'Failed to send email'
            });
        }
    } catch (error) {
        console.error('Email service error:', error);
        return res.status(500).json({
            success: false,
            message: 'Internal server error'
        });
    }
}