// src/models/user.model.js
import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  userName: {
    type: String,
    required: true,
    unique: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
  },
  facebookId: {
    type: String,
  },
  name: {
    type: String,
  },
  role: {
    type: String,
    enum: ['USER', 'ADMIN'],
    default: 'USER',
  }
}, { timestamps: true });

const User = mongoose.models.User || mongoose.model('User', userSchema);
export default User;
