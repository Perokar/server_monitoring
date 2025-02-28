const express = require('express');
const User = require('../../models/user');
const authenticateToken = require('../../middleware/auth');
const checkRole = require('../../middleware/roleCheck');
const router = express.Router();
const bcrypt = require('bcrypt');

// Отримання даних про всіх користувачів, крім пароля
router.get('/main-administrator', authenticateToken, checkRole('mainAdmin'), async (req, res) => {
  try {
    const users = await User.find({}, '-password');
    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({ message: 'Помилка сервера', error: error.message });
  }
});

// Додати нового користувача
router.post('/add-user', authenticateToken, checkRole('mainAdmin'), async (req, res) => {
  try {
    const newUser = new User(req.body);
    await newUser.save();
    res.status(201).json("Користувача успішно додано");
  } catch (error) {
    res.status(500).json({ message: 'Помилка сервера', error: error.message });
  }
});

// Редагування даних користувача
router.post('/edit-user', authenticateToken,checkRole('mainAdmin'), async (req, res) => {
  try {
    const { userId, updateData } = req.body;
    const user = await User.findByIdAndUpdate(userId, updateData, { new: true, runValidators: true });
    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ message: 'Помилка сервера', error: error.message });
  }
});

// Видалення користувача
router.post('/remove-user', authenticateToken,checkRole('mainAdmin'), async (req, res) => {
  try {
    const { userId } = req.body;
    const removeUser =await User.findByIdAndDelete(userId);
    if (!removeUser) {
      return res.status(404).json({ message: 'Користувач не знайдений' });
    }
    res.status(200).json({ message: 'Користувача видалено'});
  } catch (error) {
    res.status(500).json({ message: 'Помилка сервера', error: error.message });
  }
});

// Зміна пароля користувача
router.post('/change-password', authenticateToken, checkRole('mainAdmin'), async (req, res) => {
  try {
    const { userId, newPassword } = req.body;
    const user = await User.findById(userId);
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    user.password = hashedPassword;
    await user.save();
    res.status(200).json({ message: 'Пароль змінено' });
  } catch (error) {
    res.status(500).json({ message: 'Помилка сервера', error: error.message });
  }
});


module.exports = router;