const express = require('express');
const router = express.Router();
const User = require('../models/user');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt'); 


const register = async (req, res, approveDefault = false ) =>{
  try {
  const { login, password, fullName, region, cpmsd, role, approve } = req.body;
  // Check if user already exists
  const existingUser = await User.findOne({ login });
  if (existingUser) {
    return res.status(400).json({ message: 'Користувач з таким логіном вже існує' });
  }
    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);
    // Create new user
    const user = new User({
      login,
      password: hashedPassword,
      fullName,
      region,
      cpmsd,
      role: role || 'nurse',
      approve: approve !== undefined ? approve : approveDefault
    });
    // Save user to the database
    const newUser = await user.save();
    res.status(201).json({ message: 'Користувача успішно зареєстровано', newUser });
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  }
  
// Роут реєстрації
router.post('/register', register(req, res));

router.post('/register-m-admin', async (req, res) => {
    const {login, password, fullName, region, cpmsd, role} = req.body;
  try {
      //Перевірка головного адміністратора
      const mainAdminExist = await User.find({ role: 'mainAdmin' });
      if (mainAdminExist.length > 2 && role === 'mainAdmin') {
        return res.status(403).json({ message: 'Доступ заборонено' });
      }
    } catch (error) {
      res.status(500).json({ message: 'Помилка сервера', error: error.message });
    } 
  try {
    const existing = await User.findOne({login});
    if (existing) {
      return res.status(400).json({ message: 'Користувач вже існує' });
    }
  }
  catch (error) {
    res.status(500).json({ message: 'Помилка сервера', error: error.message });
  }
    const hashedPassword = await bcrypt.hash(password, 10);
    const admin = new User({
      login,
      password: hashedPassword,
      fullName,
      region,
      cpmsd,
      role: role,
      approve: true
    });
    try{
      const newAdmin = await admin.save();
      res.status(201).json({ message: 'Користувача успішно зареєстровано', newAdmin });  
    }
    catch (error) {
      res.status(500).json({ message: 'Помилка сервера', error: error.message });
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
      expiresIn: '4h'
    });

    res.json({ token, role: user.role  });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = {router, register};
