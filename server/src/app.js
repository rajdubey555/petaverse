const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const compression = require('compression');
const mongoSanitize = require('express-mongo-sanitize');
const cookieParser = require('cookie-parser');
const path = require('path');
const fs = require('fs');

const { env } = require('./config/env');
const corsOptions = require('./config/cors');
const { generalLimiter } = require('./middleware/rateLimiter');
const logger = require('./middleware/logger');
const notFound = require('./middleware/notFound');
const errorHandler = require('./middleware/errorHandler');

const app = express();

// ── Trust Proxy ──
// Required when behind a reverse proxy (Render, Heroku, Nginx)
// to correctly get client IP for rate limiting
if (env.NODE_ENV === 'production') {
    app.set('trust proxy', 1);
}

// ── Security Headers ──
app.use(helmet());

// ── Response Compression (gzip/deflate) ──
app.use(compression());

// ── CORS ──
app.use(cors(corsOptions));

// ── Request Logging ──
app.use(logger);

// ── Body Parsing ──
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// ── Cookie Parser (for refresh tokens) ──
app.use(cookieParser());

// ── NoSQL Injection Prevention ──
// Strips $ and . from req.body, req.query, req.params
app.use(mongoSanitize());

// ── Rate Limiting (global) ──
app.use('/api', generalLimiter);

// ── Serve uploads directory statically (for local upload fallbacks) ──
const uploadsPath = path.resolve(__dirname, '../uploads');
if (!fs.existsSync(uploadsPath)) {
    fs.mkdirSync(uploadsPath, { recursive: true });
}
app.use('/uploads', express.static(uploadsPath));

// ── Static Files (Production: serve React build) ──
if (env.NODE_ENV === 'production') {
    const clientBuildPath = path.resolve(__dirname, '../../client/dist');
    app.use(express.static(clientBuildPath));
}

// ── Favicon (browsers auto-request this, suppress 404 error) ──
app.get('/favicon.ico', (req, res) => res.status(204).end());

// ── Root & Health Check ──
app.get('/', (req, res) => {
    res.status(200).json({
        status: 'success',
        message: '🐾 Welcome to PetVerse API Server!',
        health: '/api/v1/health',
        environment: env.NODE_ENV,
        timestamp: new Date().toISOString(),
    });
});

app.get('/api/v1/health', (req, res) => {
    res.status(200).json({
        status: 'success',
        message: 'PetVerse API is running smoothly',
        environment: env.NODE_ENV,
        timestamp: new Date().toISOString(),
        uptime: process.uptime(),
    });
});

// ── API Routes ──
const authRoutes = require('./modules/auth/auth.routes');
const petRoutes = require('./modules/pet/pet.routes');
const uploadRoutes = require('./modules/upload/upload.routes');
const savedPetRoutes = require('./modules/saved-pet/savedPet.routes');
const reportRoutes = require('./modules/report/report.routes');
const userRoutes = require('./modules/user/user.routes');
const adminRoutes = require('./modules/admin/admin.routes');

app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/pets', petRoutes);
app.use('/api/v1/upload', uploadRoutes);
app.use('/api/v1/saved-pets', savedPetRoutes);
app.use('/api/v1/reports', reportRoutes);
app.use('/api/v1/users', userRoutes);
app.use('/api/v1/admin', adminRoutes);

// ── 404 & Fallback Handler ──
app.all('/api/*', notFound);

if (env.NODE_ENV === 'production') {
    const clientBuildPath = path.resolve(__dirname, '../../client/dist');
    if (fs.existsSync(clientBuildPath)) {
        app.use(express.static(clientBuildPath));
        app.get('*', (req, res) => {
            res.sendFile(path.join(clientBuildPath, 'index.html'));
        });
    } else {
        app.all('*', notFound);
    }
} else {
    app.all('*', notFound);
}

// ── Global Error Handler ──
app.use(errorHandler);

module.exports = app;