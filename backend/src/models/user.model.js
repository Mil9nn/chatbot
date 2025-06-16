import mongoose from 'mongoose'

const userSchema = new mongoose.Schema({
  fullName: {
    type: String,
    required: true,
    trim: true
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true
  },
  password: {
    type: String,
    required: true,
    select: false
  },
  profilePic: {
    type: String,
    default: '' 
  }
}, { timestamps: true });

export const User = mongoose.model("User", userSchema);