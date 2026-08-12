const http = require('http');
const app = require('./app');
const { env, validateEnv } = require('./config/env');
const connectDB = require('./config/db');
const { testCloudinaryConnection } = require('./config/cloudinary');

/**
 * PetVerse Server Entry Point
 * Cloudinary Account: dei8eih6s (Verified Connected)
 * 1. Validate environment variables
 * 2. Connect to MongoDB
 * 3. Test Cloudinary connection
 * 4. Start HTTP server
 */

const startServer = async () => {
    try {
        // ── 1. Validate Environment ──
        console.log('\n🔧 Validating environment variables...');
        validateEnv();

        // ── 2. Connect to MongoDB ──
        console.log('\n🔗 Connecting to MongoDB...');
        await connectDB();

        // ── 3. Test Cloudinary Connection ──
        console.log('\n☁️  Testing Cloudinary connection...');
        await testCloudinaryConnection();

        // ── 4. Start HTTP Server ──
        const server = http.createServer(app);

        server.listen(env.PORT, () => {
            console.log('\n' + '='.repeat(50));
            console.log(`🐾 PetVerse API Server Running`);
            console.log('='.repeat(50));
            console.log(`   Environment : ${env.NODE_ENV}`);
            console.log(`   Port        : ${env.PORT}`);
            console.log(`   Client URL  : ${env.CLIENT_URL}`);
            console.log(`   API Base    : http://localhost:${env.PORT}/api/v1`);
            console.log(`   Health      : http://localhost:${env.PORT}/api/v1/health`);
            console.log('='.repeat(50) + '\n');
        });

        // ── Graceful Shutdown ──
        const gracefulShutdown = async (signal) => {
            console.log(`\n${signal} received. Shutting down gracefully...`);
            server.close(() => {
                console.log('HTTP server closed');
                process.exit(0);
            });

            // Force exit if graceful shutdown takes too long
            setTimeout(() => {
                console.error('Forced shutdown after timeout');
                process.exit(1);
            }, 10000);
        };

        process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));
        process.on('SIGINT', () => gracefulShutdown('SIGINT'));

        // ── Unhandled Rejections & Exceptions ──
        process.on('unhandledRejection', (reason) => {
            console.error('❌ UNHANDLED REJECTION:', reason);
            // Don't crash — log and continue
        });

        process.on('uncaughtException', (error) => {
            console.error('❌ UNCAUGHT EXCEPTION:', error);
            if (error.code === 'EADDRINUSE') {
                console.error(`Port ${env.PORT} is already in use`);
                process.exit(1);
            }
            // For other uncaught exceptions in production, exit and let PM2/docker restart
            if (env.NODE_ENV === 'production') {
                process.exit(1);
            }
        });

    } catch (error) {
        console.error('\n❌ Failed to start server:', error.message);
        console.error(error.stack);
        process.exit(1);
    }
};

startServer();