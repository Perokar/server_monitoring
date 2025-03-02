const express = require('express');
const router = express.Router();
const Child = require('../../../models/Child');
const authMiddleware = require('../../../middleware/Auth');
const Visit2to5 = require('../../../models/Visits2to5');
const Visit = require('../../../models/Visit');

// Створити запис першого візиту
router.post('/get_all_visits', authMiddleware, async (req, res) => {
    const nurseId = req.user._id; // Get nurse ID from the authenticated user
    try {
        // Отримати заплановані та проведені візити по медсестрі
        const visits = await Visit.find ({ nurseId });
        const visits2to5 = await Visit2to5.find ({ nurseId });
        const sheduledVisits = await Child.find ({ nurseId });
        if (!visits && !visits2to5 && !sheduledVisits) {
            return res.status(404).json({ message: 'Візити не знайдені' });
        } else {
            console.log(visits);
            res.status(200).json({ visits, visits2to5, sheduledVisits });
        }
    } catch (error) {
        return res.status(500).json({ message: 'Проблеми з сервером або базою клієнтів', error });
    }
})

module.exports = router;