const mongoose = require('mongoose');
require('dotenv').config();

// Use the actual User model (handles password hashing automatically)
const User = require('./models/User');

const seedAdmin = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/properties_professor');
    console.log('Connected to MongoDB');

    // Check if admin already exists
    const existingAdmin = await User.findOne({ email: 'admin@propertiesprofessor.com' });
    if (existingAdmin) {
      console.log('Admin user already exists. Updating password and role...');
      existingAdmin.password = 'admin123'; // Will be hashed by pre-save hook
      existingAdmin.role = 'admin';
      await existingAdmin.save();
      console.log('Admin password updated!');
    } else {
      // Create admin user - password will be hashed by the User model pre-save hook
      await User.create({
        name: 'Admin User',
        email: 'admin@propertiesprofessor.com',
        password: 'admin123',
        phone: '+91 98765 43210',
        role: 'admin',
        isActive: true,
        isVerified: true
      });
      console.log('Admin user created successfully!');
    }

    // Also create a test user for normal login
    const existingUser = await User.findOne({ email: 'user@test.com' });
    if (!existingUser) {
      await User.create({
        name: 'Test User',
        email: 'user@test.com',
        password: 'test123',
        phone: '+91 98765 00000',
        role: 'user',
        isActive: true,
        isVerified: true
      });
      console.log('Test user created!');
    }

    console.log('\n=== Login Credentials ===');
    console.log('Admin: admin@propertiesprofessor.com / admin123');
    console.log('User:  user@test.com / test123');
    
    process.exit(0);
  } catch (error) {
    console.error('Error seeding:', error);
    process.exit(1);
  }
};

seedAdmin();
