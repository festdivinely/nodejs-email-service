import express from 'express';
import cors from 'cors';
import emailRoutes from '../routes/emailRoutes.js';

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use('/api', emailRoutes);

// Root route
app.get('/', (req, res) => {
    res.json({
        success: true,
        message: 'Quantum Robots Email Service is running',
        endpoints: {
            'POST /api/send-email': 'Send email notifications'
        },
        usage: {
            email_verification: 'Send email verification during signup',
            device_verification: 'Send device verification code for new devices',
            password_reset: 'Send password reset emails'
        }
    });
});

// Health check route
app.get('/health', (req, res) => {
    res.status(200).json({
        success: true,
        message: 'Service is healthy',
        timestamp: new Date().toISOString()
    });
});

// 404 handler - FIXED: Use proper Express 404 handling
app.use((req, res) => {
    res.status(404).json({
        success: false,
        message: `Route not found: ${req.method} ${req.originalUrl}`
    });
});

// Error handler
app.use((error, req, res, next) => {
    console.error('Server error:', error);
    res.status(500).json({
        success: false,
        message: 'Internal server error'
    });
});

export default app;