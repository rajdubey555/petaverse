const mongoose = require('mongoose');
const { env } = require('./env');

/**
 * MongoDB connection handler with retry logic and event listeners.
 * Uses Mongoose 8.x connection API.
 */
const connectDB = async () => {
    const options = {
        // Mongoose 8 defaults (no longer need useNewUrlParser, useUnifiedTopology)
        maxPoolSize: 10,
        serverSelectionTimeoutMS: 5000,
        socketTimeoutMS: 45000,
        family: 4,
    };

    try {
        const conn = await mongoose.connect(env.MONGODB_URI, options);

        console.log(`✅ MongoDB Connected: ${conn.connection.host}`.cyan || `✅ MongoDB Connected: ${conn.connection.host}`);
        console.log(`   Database: ${conn.connection.name}`);
        console.log(`   Port: ${conn.connection.port}`);

        return conn;
    } catch (error) {
        console.error(`❌ MongoDB Connection Error: ${error.message}`);
        // Retry after 5 seconds for production resilience
        if (env.NODE_ENV === 'production') {
            console.log('Retrying connection in 5 seconds...');
            setTimeout(() => connectDB(), 5000);
            return null;
        }
        process.exit(1);
    }
};

// ── Connection Event Listeners ──

mongoose.connection.on('connected', () => {
    console.log('🟢 Mongoose connection established');
});

mongoose.connection.on('error', (err) => {
    console.error(`🔴 Mongoose connection error: ${err.message}`);
});

mongoose.connection.on('disconnected', () => {
    console.log('🟡 Mongoose connection disconnected');
});

// Graceful shutdown
process.on('SIGINT', async () => {
    await mongoose.connection.close();
    console.log('Mongoose connection closed due to app termination');
    process.exit(0);
});

module.exports = connectDB;