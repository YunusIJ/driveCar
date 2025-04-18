import bcrypt from 'bcryptjs';
import User from '../models/user.model.js';

export const seedAdmin = async () => {
  const existingAdmin = await User.findOne({ email: 'admin@drivecar.com' });
  if (existingAdmin) {
    console.log(' Admin already exists');
    return;
  }

  const hashedPassword = await bcrypt.hash('admin1234', 10);

  const admin = new User({
    userName: 'drivecar_admin',
    email: 'admin@drivecar.com',
    password: hashedPassword,
    role: 'ADMIN',
  });

  await admin.save();
  console.log('🚀 Admin created successfully');
};
