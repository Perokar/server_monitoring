const express = require('express');
const router = express.Router();
const Child = require('../../../models/Child');
const authMiddleware = require('../../../middleware/Auth');
const Visit2to5 = require('../../../models/Visits2to5');
const Visit = require('../../../models/Visit'); // Add this line to import the Visit model


// Створити запис першого візиту
router.post('/add_visit', authMiddleware, async (req, res) => {
  const nurseId = req.user._id; // Get nurse ID from the authenticated user
  const { visitDate, clientId } = req.body;
  try {
    // Знайти дитину за clientId
    const child = await Child.findById(clientId);
    if (!child) {
      return res.status(404).json({ message: 'Дитина не знайдена' });
    }
    // Перевірка наявності візиту з таким же visitType для клієнта
    const existingVisit = await Visit.findOne({ clientId: clientId });

    if (existingVisit) {
      return res.status(400).json({ message: 'Візит вже проведено' });
    }

    // Видалити запис з масиву запланованих візитів
    const scheduledVisitIndex = child.sheduledVisits.findIndex(visit => visit.type === "1");
    if (scheduledVisitIndex !== -1) {
      child.sheduledVisits.splice(scheduledVisitIndex, 1);
      await child.save();
    }
    // Додати запис в історію візитів
    const visit = new Visit({
      ...req.body,
      nurseId: nurseId
    });
    const addVisit = await visit.save();
    // Додати запис в історію візитів модель Child
    child.visitsHistory.push({ type: "1", date: visitDate });
    child.save();
    return res.status(201).json(addVisit);
  }
  catch (error) {
    console.log(error);
    return res.status(500).json({ message: 'Проблеми з сервером або базою клієнтів', error });
  }
});
//Створити запис візиту 2-5
router.post('/add2_5visit', authMiddleware, async (req, res) => {
  const nurseId = req.user._id; // Get nurse ID from the authenticated user
  const { clientId, visitType, visitDate } = req.body;
  try {
    // Знайти дитину за clientId
    const child = await Child.findById(clientId);
    if (!child) {
      return res.status(404).json({ message: 'Дитина не знайдена' });
    }

    // Перевірка наявності візиту з таким же visitType для клієнта
    const existingVisit = await Visit2to5.findOne({ clientId, visitType });
    if (existingVisit) {
      return res.status(400).json({ message: 'Візит вже проведено' });
    }
    // Додати запис в історію візитів модель Child
    child.visitsHistory.push({ type: visitType, date: visitDate });
    await child.save();
    // Видалити запис з масиву запланованих візитів
    const scheduledVisitIndex = child.sheduledVisits.findIndex(visit => visit.type === visitType);
    if (scheduledVisitIndex !== -1) {
      child.sheduledVisits.splice(scheduledVisitIndex, 1);
      await child.save();
    }
    const visit2to5 = new Visit2to5({
      ...req.body,
      nurseId: nurseId
    });
    const newVisit2to5 = await visit2to5.save();
    res.status(201).json(newVisit2to5);
  } catch (error) {
    return res.status(500).json({
      message: 'Проблеми з сервером або базою клієнтів', error
    });
  }
});
// Отримати дані про заплановані візити і проведені візити
router.get('/scheduled_visits', authMiddleware, async (req, res) => {
  try {
    const nurseId = req.user._id; // Отримання nurseId з токена
    const children = await Child.find({ nurseId });
    const childrenWithVisits = children.map(child => ({
      fullName: child.fullName,
      dateOfBirth: child.dateOfBirth,
      sheduledVisits: child.sheduledVisits,
      visitsHistory: child.visitsHistory
    }));

    res.status(200).json(childrenWithVisits);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching visits', error });
  }
});

// Other CRUD routes (get, update, delete)

module.exports = router;
