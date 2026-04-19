require('dotenv').config();
const mongoose = require('mongoose');
const User = require('./models/User');
const bcrypt = require('bcryptjs');

mongoose.connect(process.env.MONGO_URI).then(async () => {
    try {
        const adminEmail = process.env.ADMIN_EMAIL || 'admin@thefolio.com';
        const adminPass = process.env.ADMIN_PASSWORD || 'Admin@1234';
        const adminName = process.env.ADMIN_NAME || 'TheFolio Admin';
        const exists = await User.findOne({ email: adminEmail });
        if (exists) { console.log('Admin already exists.'); process.exit(); }
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(adminPass, salt);
        await User.create({ name: adminName, email: adminEmail, password: hashedPassword, role: 'Admin' });
        console.log('Admin created!'); process.exit();
    } catch (error) { console.error('Error:', error); process.exit(1); }
});