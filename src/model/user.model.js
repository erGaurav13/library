const mongoose = require('mongoose');

const userSchema = new mongoose.Schema(
  {
    _id: { type: String },
    username: { type: String, unique: true },
    email: { type: String, unique: true, required: true },
    password: { type: String, required: true },
    token: { type: String },
    role: { type: String, required: true, enum: ['1', '2'], default: '2' },
    // 1-admin 2-User
  },
  { timestamps: true },
);

module.exports = mongoose.model('User', userSchema);
