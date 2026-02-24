// Script to delete test/demo users from DB
const mongoose = require('mongoose');
const User = require('../models/User');
require('dotenv').config({ path: '../.env' });

const emailsToDelete = [
  'admin@propertiesprofessor.com',
  'testuser1@test.com',
  'testuser2@test.com',
  'testuser3@test.com',
  'testuser4@test.com',
  'user@example.com'
];

(async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true });
    const result = await User.deleteMany({ email: { $in: emailsToDelete } });
    console.log(`Deleted ${result.deletedCount} test/demo users.`);
    await mongoose.disconnect();
    process.exit(0);
  } catch (err) {
    console.error('Error deleting test users:', err);
    process.exit(1);
  }
})();
