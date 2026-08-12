const { env } = require('./env');

/**
 * CORS Configuration
 * Allows specified origins. In development, allows localhost.
 * In production, restricts to the configured CLIENT_URL.
 */
const corsOptions = {
    origin: (origin, callback) => {
        const allowedOrigins = [
            env.CLIENT_URL,
            // Development origins
            'http://localhost:5173',
            'http://localhost:3000',
            'http://127.0.0.1:5173',
            'http://127.0.0.1:3000',
        ];

        // Allow requests with no origin (curl, Postman, mobile apps, server-to-server)
        if (!origin || allowedOrigins.includes(origin)) {
            callback(null, true);
        } else {
            console.warn(`⚠ CORS blocked origin: ${origin}`);
            callback(new Error(`Origin ${origin} not allowed by CORS`));
        }
    },
    credentials: true, // Allow cookies (refresh token)
    methods: ['GET', 'POST', 'PATCH', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: [
        'Content-Type',
        'Authorization',
        'X-Requested-With',
    ],
    exposedHeaders: ['Set-Cookie'],
    maxAge: 86400, // 24 hours cache for preflight
};

module.exports = corsOptions;