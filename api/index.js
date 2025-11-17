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

    // Handle GET requests to root
    if (req.method === 'GET') {
        return res.status(200).json({
            success: true,
            message: 'Quantum Robots Email Service is running',
            endpoints: {
                'POST /api/send-email': 'Send email notifications',
                'GET /api': 'This info page'
            },
            usage: {
                email_verification: 'Send email verification during signup',
                device_verification: 'Send device verification code for new devices',
                password_reset: 'Send password reset emails'
            }
        });
    }

    // Method not allowed
    return res.status(405).json({
        success: false,
        message: 'Method not allowed'
    });
}