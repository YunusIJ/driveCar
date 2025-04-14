import mongoose from 'mongoose';

const userSchema = new mongoose.Schema(
  {
    facebookId: {
      type: String,
      unique: true,
      sparse: true,
    },
    firstName: String,
    lastName: String,
    email: {
      type: String,
      unique: true,
      sparse: true,
    },
    profilePicture: String,
    role: {
      type: String,
      enum: ['USER', 'ADMIN'],
      default: 'USER',
    },
  },
  { timestamps: true }
);

export default mongoose.model('User', userSchema);
