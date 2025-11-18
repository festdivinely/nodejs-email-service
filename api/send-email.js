import nodemailer from 'nodemailer';
import { emailVerificationTemplate } from '../email-templates/emailVerification.js';
import { deviceVerificationTemplate } from '../email-templates/deviceVerification.js';
import { passwordResetTemplate } from '../email-templates/passwordReset.js';

// Email configuration
const EMAIL_SENDER = process.env.EMAIL_SENDER;
const EMAIL_PASSWORD = process.env.EMAIL_PASSWORD;

const transporter = nodemailer.createTransport({
  host: 'smtp.gmail.com',
  port: 465,
  secure: true,
  auth: {
    user: EMAIL_SENDER,
    pass: EMAIL_PASSWORD,
  },
});

// Template selector
const getEmailTemplate = (type, data) => {
  switch (type) {
    case 'email_verification':
      return emailVerificationTemplate(data);
    case 'device_verification':
      return deviceVerificationTemplate(data);
    case 'password_reset':
      return passwordResetTemplate(data);
    default:
      throw new Error(`Unknown email type: ${type}`);
  }
};

// Main handler
export default async function handler(req, res) {
  // Set CORS headers
  res.setHeader('Access-Control-Allow-Credentials', true);
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  res.setHeader('Access-Control-Allow-Headers', 'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version');

  // Handle preflight
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

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

    // Validate email configuration
    if (!EMAIL_SENDER || !EMAIL_PASSWORD) {
      return res.status(500).json({
        success: false,
        message: 'Email service not configured'
      });
    }

    // Get email template
    const emailContent = getEmailTemplate(type, data);

    // Send email
    await transporter.sendMail({
      from: EMAIL_SENDER,
      to: to,
      subject: emailContent.subject,
      text: emailContent.text,
      html: emailContent.html,
    });

    console.log(`Email sent successfully to ${to}, type: ${type}`);

    return res.status(200).json({
      success: true,
      message: 'Email sent successfully'
    });

  } catch (error) {
    console.error('Email service error:', error);

    return res.status(500).json({
      success: false,
      message: error.message || 'Failed to send email'
    });
  }
}