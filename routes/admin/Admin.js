const express = require('express');
const User = require('../../models/user');
const authenticateToken = require('../../middleware/Auth');
const validateUser = require('../../middleware/validateUser');
const router = express.Router();
const bcrypt = require('bcrypt');
const confirmUser = require('../../models/ConfirmUser');
const validateEdit = require('../../middleware/validateEdit');


// Отримання даних про всіх користувачів, крім пароля
router.get('/users', authenticateToken, async (req, res) => {
    switch (req.user.role) {
        case 'mainAdmin':
            try {
                const users = await User.find({}, '-password');
                return res.status(200).json(users);
            } catch (error) {
                res.status(500).json({ message: 'Помилка сервера', error: error.message });
            }
            break;
        case 'adminRegion':
            try {
                const users = await User.find({ region: req.user.region }, '-password');
                return res.status(200).json(users);
            } catch (error) {
                res.status(500).json({ message: 'Помилка сервера', error: error.message });
            }
            break;
        case 'adminCpmsd':
            try {
                const users = await User.find({ cpmsd: req.user.cpmsd }, '-password');
                return res.status(200).json(users);
            } catch (error) {
                res.status(500).json({ message: 'Помилка сервера', error: error.message });
            }
            break;
        default:
            res.status(403).json({ message: 'У вас немає доступу' });
    }
    try {
        const users = await User.find({}, '-password');
        res.status(200).json(users);
    } catch (error) {
        res.status(500).json({ message: 'Помилка сервера', error: error.message });
    }
});
router.get('/confirm-u', authenticateToken, async (req, res) => {
    switch (req.user.role) {
        case 'mainAdmin':
            try {
                const confUsers = await confirmUser.find({}, '-password');
                return res.status(200).json(confUsers);
            } catch (error) {
                res.status(500).json({ message: 'Помилка сервера', error: error.message });
            }
            break;
        case 'adminRegion':
            try {
                const confUsers = await confirmUser.find({ region: req.user.region }, '-password');
                return res.status(200).json(confUsers);
            } catch (error) {
                res.status(500).json({ message: 'Помилка сервера', error: error.message });
            }
            break;
        case 'adminCpmsd':
            try {
                const confUsers = await confirmUser.find({ cpmsd: req.user.cpmsd }, '-password');
                return res.status(200).json(confUsers);
            } catch (error) {
                res.status(500).json({ message: 'Помилка сервера', error: error.message });
            }
            break;
        default:
            res.status(403).json({ message: 'У вас немає доступу' });
    }
    try {
        const users = await User.find({}, '-password');
        res.status(200).json(users);
    } catch (error) {
        res.status(500).json({ message: 'Помилка сервера', error: error.message });
    }
});
// Додати нового користувача
router.post('/add-user', authenticateToken, validateUser, async (req, res) => {
    const { login, email } = req.body;
    const existingUser = await User.findOne({ $or: [{ login: login }, { email: email }] });
    const existingConfUser = await confirmUser.findOne({ $or: [{ login: login }, { email: email }] });
    switch (req.user.role) {
        case 'mainAdmin':
            try {
                if (existingUser) {
                    return res.status(409).json({ message: 'Користувач вже існує' });
                }
                if (existingConfUser) {
                    return res.status(409).json({ message: 'Користувач очікує підтвердження' });
                }
                const newUser = new User(req.body);
                await newUser.save();
                return res.status(201).json("Користувача успішно додано");
            } catch (error) {
                res.status(500).json({ message: 'Помилка сервера', error: error.message });
            }
            break;
        case 'adminRegion':
            try {
                if (existingUser) {
                    return res.status(409).json({ message: 'Користувач вже існує' });
                }
                if (existingConfUser) {
                    return res.status(409).json({ message: 'Користувач очікує підтвердження' });
                }
                if (req.body.region == req.user.region) {
                    const newUser = new User(req.body);
                    newUser.region = req.user.region;
                    await newUser.save();
                    return res.status(201).json("Користувача успішно додано");
                }
                else {
                    return res.status(403).json({ message: 'Користувач поза вашим регіоном' });
                }
            } catch (error) {
                res.status(500).json({ message: 'Помилка сервера', error: error.message });
            }
            break;
        case 'adminCpmsd':
            if (existingUser) {
                return res.status(409).json({ message: 'Користувач вже існує' });
            }
            if (existingConfUser) {
                return res.status(409).json({ message: 'Користувач очікує підтвердження' });
            }
            try {
                if (req.body.cpmsd == req.user.cpmsd) {
                    const newUser = new User(req.body);
                    newUser.cpmsd = req.user.cpmsd;
                    await newUser.save();
                    return res.status(201).json("Користувача успішно додано");
                }
                else {
                    return res.status(403).json({ message: 'Користувач поза вашим регіоном' });
                }
            } catch (error) {
                res.status(500).json({ message: 'Помилка сервера', error: error.message });
            }
            break;
        default:
            res.status(403).json({ message: 'У вас немає доступу' });
    }
});
router.post('/approve-user', authenticateToken, async (req, res) => {
    const userId = await req.body.userId;
    const pendingUser = await confirmUser.findById(userId,'-_id, -__v').lean();
    if (!pendingUser) {
        return res.status(404).json({ message: 'Користувач не знайдений' });
    }
    const existingUser = await User.findOne({ $or: [{ login: pendingUser.login }, { email: pendingUser.email },{phone:pendingUser.phone}] });
    pendingUser.approve = true;
    if (existingUser) {
        return res.status(409).json({ message: 'Користувач вже існує, видаліть запис з черги очіквання' });
    }
    else{
        switch (req.user.role) {
        case 'mainAdmin':
            const newUser = new User(pendingUser);
            await newUser.save();
            await confirmUser.findByIdAndDelete(req.body.userId);
            return res.status(200).json({ message: 'Користувача підтверджено' });
        case 'adminRegion':
            if (req.user.region == pendingUser.region) {
                const newUser = new User(pendingUser);
                await newUser.save();
                return res.status(200).json({ message: 'Користувача підтверджено' });
            }
            else {
                return res.status(403).json({ message: 'Користувач поза вашим регіоном' });
            }
        case 'adminCpmsd':
            if (req.user.cpmsd == pendingUser.cpmsd) {
                const newUser = new User(pendingUser);
                await newUser.save();
                return res.status(200).json({ message: 'Користувача підтверджено' });
            }
            else {
                return res.status(403).json({ message: 'Користувач поза вашим регіоном' });
            }
    }
}
});
// Відхилити користувача
router.post('/reject-user', authenticateToken, async (req, res) => {
    if (req.user.role !== 'mainAdmin'||req.user.role !== 'adminRegion'||req.user.role !== 'adminCpmsd') {
        return res.status(403).json({ message: 'У вас немає доступу' });
    }
    const userId = await req.body.userId;
    const pendingUser = await confirmUser.findById(userId);  
    if (!pendingUser) {
        return res.status(404).json({ message: 'Користувач не знайдений' });
    }
    await confirmUser.findByIdAndDelete(req.body.userId);
    return res.status(200).json({ message: 'Користувача відхилено' });
});
// Редагування даних користувача
router.post('/edit-user', authenticateToken, validateEdit, async (req, res) => {
    const userId = await req.body.userId;
    const user = await User.findById(userId);
    if (!user) {
        return res.status(404).json({ message: 'Користувач не знайдений' });
    }
    else{
        switch (req.user.role) {
            case 'mainAdmin':
                try {
                    const editedUser = await User.findByIdAndUpdate(userId, req.body, { new: true });
                    return res.status(200).json(editedUser);
                } catch (error) {
                   return res.status(500).json({ message: 'Помилка сервера', error: error.message });
                }
            case "adminRegion":
                if (req.user.region == user.region) {
                    try {
                        const editedUser = await User.findByIdAndUpdate(userId, req.body, { new: true });
                        return res.status(200).json(editedUser);
                    } catch (error) {
                        return res.status(500).json({ message: 'Помилка сервера', error: error.message });
                    }
                }
                else {
                    return res.status(403).json({ message: 'Користувач поза вашим регіоном' });
                }
            case "adminCpmsd":
                if (req.user.cpmsd == user.cpmsd) {
                    try {
                        const editedUser = await User.findByIdAndUpdate(userId, req.body, { new: true });
                        return res.status(200).json(editedUser);
                    } catch (error) {
                        return res.status(500).json({ message: 'Помилка сервера', error: error.message });
                    }
                }
                else {
                    return res.status(403).json({ message: 'Користувач поза вашим регіоном' });
                }
            default:
                return res.status(403).json({ message: 'У вас немає доступу' });
        }   
    }
}
);
// Видалення користувача
router.post('/delete-user', authenticateToken, async (req, res) => {
    const userId = await req.body.userId;
    const user = await User.findById(userId);
    if (!user) {
        return res.status(404).json({ message: 'Користувач не знайдений' });
    }
    else{
        switch (req.user.role) {
            case 'mainAdmin':
                try {
                    await User.findByIdAndDelete(userId);
                    return res.status(200).json({ message: 'Користувача видалено' });
                } catch (error) {
                    return res.status(500).json({ message: 'Помилка сервера', error: error.message });
                }
            case "adminRegion":
                if (req.user.region == user.region) {
                    try {
                        await User.findByIdAndDelete(userId);
                        return res.status(200).json({ message: 'Користувача видалено' });
                    } catch (error) {
                        return res.status(500).json({ message: 'Помилка сервера', error: error.message });
                    }
                }
                else {
                    return res.status(403).json({ message: 'Користувач поза вашим регіоном' });
                }
            case "adminCpmsd":
                if (req.user.cpmsd == user.cpmsd) {
                    try {
                        await User.findByIdAndDelete(userId);
                        return res.status(200).json({ message: 'Користувача видалено' });
                    } catch (error) {
                        return res.status(500).json({ message: 'Помилка сервера', error: error.message });
                    }
                }
                else {
                    return res.status(403).json({ message: 'Користувач поза вашим регіоном' });
                }
            default:
                return res.status(403).json({ message: 'У вас немає доступу' });
        }   
    }   
});
// Зміна пароля
router.post('/change-password', authenticateToken, async (req, res) => {
    const { userId, newPassword } = req.body;
    try {
        if (req.user.role !== 'mainAdmin' || req.user.role !== 'adminRegion' || req.user.role !== 'adminCpmsd') {
          return res.status(403).json({ message: 'Доступ заборонено' });
        }
        const user = await User.findById(userId);
        if (!user) {
          return res.status(404).json({ message: 'Користувач не знайдений' });
        }
        user.password = newPassword; // Пароль буде автоматично хешовано перед збереженням
        await user.save();
        res.status(200).json({ message: 'Пароль змінено' });
      } catch (error) {
        res.status(500).json({ message: 'Помилка сервера', error: error.message });
      }
    });
module.exports = router;