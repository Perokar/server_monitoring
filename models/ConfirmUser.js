const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const confirmUserSchema = new mongoose.Schema({
  login: { type: String, required: true, unique: true },
  email: { type: String, required: true, unique: true },
  phone: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  fullName: { type: String, required: true },
  region: { type: String, required: true },
  cpmsd: { type: String, required: true }, 
  role: { type: String, enum: ['nurse','seniorNurse','coordinatorDoctor', 'headCpmsd', 'supervisor','coordinatorRegion', 'coordinatorUa','admin', 'mainAdmin'], required: true }
});

// Хешування пароля перед збереженням
confirmUserSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  this.password = await bcrypt.hash(this.password, 10);
  next();
});
confirmUserSchema.methods.validatePassword = async function (password) {
  return await bcrypt.compare(password, this.password);
};
const confirmUser = mongoose.model('confirmUser', confirmUserSchema);

module.exports = confirmUser;
