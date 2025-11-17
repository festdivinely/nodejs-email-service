import nodemailer from 'nodemailer';

// Email configuration - MAKE SURE THESE ARE SET IN VERCEL DASHBOARD
const EMAIL_SENDER = process.env.EMAIL_SENDER;
const EMAIL_PASSWORD = process.env.EMAIL_PASSWORD;

// Create transporter
const transporter = nodemailer.createTransport({
  host: 'smtp.gmail.com',
  port: 465,
  secure: true,
  auth: {
    user: EMAIL_SENDER,
    pass: EMAIL_PASSWORD,
  },
});

export default async function handler(req, res) {
  // Handle CORS
  res.setHeader('Access-Control-Allow-Credentials', true);
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  res.setHeader('Access-Control-Allow-Headers', 'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version');

  // Handle preflight requests
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  // Only allow POST requests
  if (req.method !== 'POST') {
    return res.status(405).json({
      success: false,
      message: 'Method not allowed. Use POST.'
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

    // Check if email credentials are configured
    if (!EMAIL_SENDER || !EMAIL_PASSWORD) {
      console.error('Email credentials not configured in environment variables');
      return res.status(500).json({
        success: false,
        message: 'Email service not configured properly'
      });
    }

    // Define email templates
    let emailContent;
    if (type === 'email_verification') {
      const { username, verificationLink, token, supportEmail } = data;
      emailContent = {
        subject: 'Verify Your Email - Quantum Robots',
        text: `Welcome to Quantum Robots\n\nTo verify your email, use this token: ${token}\nOr click: ${verificationLink}\n\nThis token expires in 15 minutes.`,
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <div style="background: #000; color: #00ff41; padding: 20px; text-align: center;">
              <h1>QUANTUM ROBOTS</h1>
            </div>
            <div style="padding: 20px;">
              <h2>Welcome, ${username}!</h2>
              <p>To verify your email, use the token below:</p>
              <div style="text-align: center; margin: 20px 0;">
                <span style="background: #f0f0f0; padding: 15px; border: 2px solid #00ff41; font-size: 18px; font-weight: bold;">
                  ${token}
                </span>
              </div>
              <p style="text-align: center;">
                <a href="${verificationLink}" style="background: #00ff41; color: #000; padding: 12px 30px; text-decoration: none; border-radius: 5px; font-weight: bold;">
                  Verify Email
                </a>
              </p>
              <p>This token expires in <b>15 minutes</b>.</p>
            </div>
          </div>
        `
      };
    } else if (type === 'device_verification') {
      const { username, verificationCode, deviceInfo, ip, country } = data;
      emailContent = {
        subject: 'Device Verification - Quantum Robots',
        text: `Device verification code: ${verificationCode}\n\nDevice: ${deviceInfo}\nIP: ${ip}\nLocation: ${country}`,
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <div style="background: #000; color: #00ff41; padding: 20px; text-align: center;">
              <h1>QUANTUM ROBOTS</h1>
            </div>
            <div style="padding: 20px;">
              <h2>Device Verification Required</h2>
              <p>Hello ${username},</p>
              <p>Use this verification code:</p>
              <div style="text-align: center; margin: 20px 0;">
                <span style="background: #000; color: #00ff41; padding: 20px; font-size: 24px; font-weight: bold; letter-spacing: 5px;">
                  ${verificationCode}
                </span>
              </div>
              <p><strong>This code expires in 10 minutes.</strong></p>
            </div>
          </div>
        `
      };
    } else if (type === 'password_reset') {
      const { username, resetLink, token } = data;
      emailContent = {
        subject: 'Password Reset - Quantum Robots',
        text: `Password reset token: ${token}\nReset link: ${resetLink}`,
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <div style="background: #000; color: #00ff41; padding: 20px; text-align: center;">
              <h1>QUANTUM ROBOTS</h1>
            </div>
            <div style="padding: 20px;">
              <h2>Password Reset</h2>
              <p>Hello ${username},</p>
              <p>Click the link below to reset your password:</p>
              <p style="text-align: center;">
                <a href="${resetLink}" style="background: #00ff41; color: #000; padding: 12px 30px; text-decoration: none; border-radius: 5px; font-weight: bold;">
                  Reset Password
                </a>
              </p>
              <p><strong>This link expires in 1 hour.</strong></p>
            </div>
          </div>
        `
      };
    } else {
      return res.status(400).json({
        success: false,
        message: `Invalid email type: ${type}. Valid types: email_verification, device_verification, password_reset`
      });
    }

    // Send the email
    await transporter.sendMail({
      from: EMAIL_SENDER,
      to: to,
      subject: emailContent.subject,
      text: emailContent.text,
      html: emailContent.html,
    });

    console.log(`✅ Email sent to ${to} (type: ${type})`);

    return res.status(200).json({
      success: true,
      message: 'Email sent successfully'
    });

  } catch (error) {
    console.error('❌ Email sending error:', error);

    return res.status(500).json({
      success: false,
      message: 'Failed to send email: ' + error.message
    });
  }
}