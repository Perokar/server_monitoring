const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const userSchema = new mongoose.Schema({
  login: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  fullName: { type: String, required: true },
  district: { type: String, required: true },
  region: { type: String, required: true },
  cpmsd: { type: String, required: true }, 
  role: { type: String, enum: ['nurse', 'admin', 'cpmsd', 'mentorUA'], required: true },
  approve: { type: Boolean, default: false }
});

// Хешування пароля перед збереженням
userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  this.password = await bcrypt.hash(this.password, 10);
  next();
});
userSchema.methods.validatePassword = async function (password) {
  return await bcrypt.compare(password, this.password);
};
const User = mongoose.model('User', userSchema);

module.exports = User;
