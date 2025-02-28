const express = require('express');
const router = express.Router();
const User = require('../../models/user');
const authenticateToken = require('../../middleware/auth');

// Отримати список всіх користувачів
router.get('/users', authenticateToken, async (req, res) => {
  try {
    const users = await User.find();
    res.json(users);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Додати користувача
router.post('/users', authenticateToken, async (req, res) => {
  try {
    const { login, password, fullName, district, region, cpmsd, category } = req.body;
    const newUser = new User({ login, password, fullName, district, region, cpmsd, category });
    await newUser.save();
    res.status(201).json(newUser);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Редагувати користувача
router.put('/users/:id', authenticateToken, async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ message: 'Користувача не знайдено' });

    Object.assign(user, req.body);
    await user.save();
    res.json(user);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Видалити користувача
router.delete('/users/:id', authenticateToken, async (req, res) => {
  try {
    const user = await User.findByIdAndDelete(req.params.id);
    if (!user) return res.status(404).json({ message: 'Користувача не знайдено' });
    res.json({ message: 'Користувача видалено' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
