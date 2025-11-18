export const deviceVerificationTemplate = (data) => {
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

Enter this code in the verification prompt on your new device.

This code will expire in 10 minutes.

If you didn't attempt to log in from this device, please ignore this email.

Need help? Contact ${supportEmail}
    `,
        html: `
<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Device Verification - Quantum Robots</title>
</head>
<body style="margin:0; padding:0; font-family: Arial, sans-serif; background-color:#f4f7fb;">
  <table width="100%" border="0" cellspacing="0" cellpadding="0" style="padding:20px 0;">
    <tr>
      <td align="center">
        <table width="600" border="0" cellspacing="0" cellpadding="0" style="background:#ffffff; border-radius:12px; box-shadow:0 4px 12px rgba(0,0,0,0.1); overflow:hidden;">
          <tr>
            <td align="center" style="background: #000000; padding:30px; color:#00ff41; font-size:24px; font-weight:bold;">
              QUANTUM ROBOTS
            </td>
          </tr>
          <tr>
            <td style="padding:30px; color:#333333; font-size:16px; line-height:1.6;">
              <h2 style="margin-top:0; color:#000000;">Device Verification Required</h2>
              <p>Hello ${username},</p>
              <p>A login attempt was detected from a new device. To complete your login, please use the verification code below:</p>
              <div style="text-align:center; margin:30px 0;">
                <div style="background:#000000; color:#00ff41; padding:20px; text-align:center; font-size:32px; font-weight:bold; letter-spacing:5px; border-radius:10px; margin:20px 0; font-family: 'Courier New', monospace;">
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
              <p><strong>This code will expire in 10 minutes.</strong></p>
              <p>If you didn't attempt to log in from this device, please ignore this email.</p>
            </td>
          </tr>
          <tr>
            <td align="center" style="background:#000000; color:#00ff41; padding:20px; font-size:13px;">
              &copy; ${new Date().getFullYear()} Quantum Robots. All rights reserved.<br/>
              Need help? <a href="mailto:${supportEmail}" style="color:#00ff41; text-decoration:none;">Contact Support</a>
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
};