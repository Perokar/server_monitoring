const express = require('express');
const router = express.Router();
const User = require('../models/user');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');

// Registration route
router.post('/register', async (req, res) => {
  try {
    const { login, password, fullName, region, district, cpmsd, role, approve } = req.body;

    // Check if user already exists
    const existingUser = await User.findOne({ login });
    if (existingUser) {
      return res.status(400).json({ message: 'User already exists' });
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create new user
    const user = new User({
      login,
      password: hashedPassword,
      fullName,
      region,
      district,
      cpmsd,
      role: role || 'nurse'
    });

    // Save user to the database
    const newUser = await user.save();

    // Generate JWT token for the user
    const token = jwt.sign({ _id: newUser._id, role: newUser.role }, process.env.JWT_SECRET, {
      expiresIn: '1h'
    });

    res.status(201).json({ message: 'Користувача успішно зареєстровано', token });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Login route
router.post('/login', async (req, res) => {
  try {
    const user = await User.findOne({ login: req.body.login });
    if (!user || !user.validatePassword(req.body.password)) {
      return res.status(400).json({ message: 'Invalid login or password' });
    }

    const token = jwt.sign({ _id: user._id, role: user.role }, process.env.JWT_SECRET, {
      expiresIn: '2h'
    });

    res.json({ token, role: user.role  });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
