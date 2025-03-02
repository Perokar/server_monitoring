const express = require('express');
const router = express.Router();
const User = require('../models/user');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt'); 
const confirmUser = require('../models/ConfirmUser');
const validateUser = require('../middleware/ValidateUser');


const register = async (req, res ) =>{
  const token = req.header('Authorization')?.split(' ')[1];
  const { login, email, phone, password, fullName, region, cpmsd, role } = await req.body;
  try{
    const existingUser = await User.findOne({ $or: [{ login: login }, { email: email }] });
    const existingConfUser = await confirmUser.findOne({ $or: [{ login: login }, { email: email }] });
    if (!token) {
      if (existingUser || existingConfUser) {
        return res.status(400).json({ message: 'Користувач вже існує' });
      }
      const confUser = new confirmUser({
        login,
        email,
        phone,
        password,
        fullName,
        region,
        cpmsd,
        role,
        approve: false
      });
      const newConfUser = confUser.save();
      res.status(201).json({ message: 'Користувача додано на розгляд', newConfUser });
  }
  else {
    if (existingUser){
      return res.status(400).json({ message: 'Користувач вже існує' });
    }
    if (existingConfUser) {
      return res.status(400).json({ message: 'Користувач очікує на підтвердження'});
    }
    jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
      if (err) {
          return res.status(403).json({ message: 'Неверный токен' });
      }
      req.user = user;
  });
  switch (req.user.role) {
    case 'mainAdmin':
      const user = new User({
        login,
        email,
        phone,
        password,
        fullName,
        region,
        cpmsd,
        role,
        approve: true
      });
      const newUser = await user.save();
      return res.status(201).json({ message: 'Користувача успішно зареєстровано', newUser });
    case 'adminRegion':
      if (req.user.region === region){
        const user = new User({
          login,
          email,
          phone,
          password,
          fullName,
          region,
          cpmsd,
          role,
          approve: true
        });
        const newUser = await user.save();
        return res.status(201).json({ message: 'Користувача успішно зареєстровано', newUser });
      }
      case 'adminCpmsd':
        if (req.user.cpmsd === cpmsd){
          const user = new User({
            login,
            email,
            phone,
            password,
            fullName,
            region,
            cpmsd,
            role,
            approve: true
          });
          const newUser = await user.save();
          return res.status(201).json({ message: 'Користувача успішно зареєстровано', newUser });
        }
    default:
      return res.status(403).json({ message: 'Недостаточно прав' });
  }
  }
  }
  catch (error) {
    res.status(500).json({ message: 'Помилка сервера', error: error.message });
  }
};
  
// Роут реєстрації
router.post('/register',validateUser,(req,res)=>register(req,res));

router.post('/register-m-admin', async (req, res) => {
    const {login, password, fullName, region, cpmsd, role} = req.body;
  try {
      //Перевірка головного адміністратора
      const mainAdminExist = await User.find({ role: 'mainAdmin' });
      if (mainAdminExist.length > 3 && role === 'mainAdmin') {
        return res.status(403).json({ message: 'Кількість адмінів достатня' });
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
      res.status(501).json({ message: 'Помилка запису в базу', error: error.message });
    }    
});

// Login route
router.post('/login', async (req, res) => {
  try {
    const user = await User.findOne({ login: req.body.login });
    if (!user || !user.validatePassword(req.body.password)) {
      return res.status(400).json({ message: 'Invalid login or password' });
    }

    const token = jwt.sign({ _id: user._id, role: user.role, region:user.region, cpmsd:user.cpmsd}, process.env.JWT_SECRET, {
      expiresIn: '4h'
    });

    res.json({ token, role: user.role, region: user.region, cpmsd: user.cpmsd });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = {router, register};
