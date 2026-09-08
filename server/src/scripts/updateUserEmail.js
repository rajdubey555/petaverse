const mongoose = require('mongoose');
const dotenv = require('dotenv');
const path = require('path');

dotenv.config({ path: path.resolve(__dirname, '../../.env') });

const User = require('../models/User');

const updateEmail = async () => {
    try {
        const mongoUri = process.env.MONGODB_URI || 'mongodb://localhost:27017/petaverse';
        console.log('Connecting to MongoDB database...');
        await mongoose.connect(mongoUri);

        const oldEmail = 'priya.sharma@example.com';
        const newEmail = 'divya02@gmail.com';

        const user = await User.findOne({ email: oldEmail.toLowerCase() });

        if (!user) {
            console.log(`User with email "${oldEmail}" not found.`);
            const existingNew = await User.findOne({ email: newEmail.toLowerCase() });
            if (existingNew) {
                console.log(`User "${newEmail}" already exists with ID: ${existingNew._id}`);
            }
        } else {
            user.email = newEmail.toLowerCase();
            await user.save();
            console.log(`✅ SUCCESS: Updated user email from "${oldEmail}" to "${newEmail}" (User ID: ${user._id})`);
        }
        await mongoose.disconnect();
        console.log('MongoDB disconnected.');
        process.exit(0);
    } catch (error) {
        console.error('❌ ERROR updating user email:', error);
        process.exit(1);
    }
};

updateEmail();
