const express = require('express');
const router = express.Router();
const Child = require('../../models/Child');
const authMiddleware = require('../../middleware/auth');

router.post ('/test_route',(req,res) => {
  console.log('Test route works '+JSON.stringify(req.headers));
  res.send('Test route works');
})
// Create client
router.post('/add_child', authMiddleware, async (req, res) => {
  const nurseId = req.user._id;  // Get nurse ID from the authenticated user
  const {fullName,dateOfBirth,region} = req.body;
  try{
    const existingChild = await Child.findOne({fullName, dateOfBirth, region});
    if (existingChild) {
      return res.status(401).json("Такий клієнт вже зареєстрований");
    }
  }
catch(err) {
  console.log(`Помилка ${err}`)
}
  const child = new Child({
    ...req.body,
    nurseId: nurseId
  });

  try {
    const newChild = await child.save();
    res.status(201).json("Клієнта додано");
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});
router.get('/get_children', authMiddleware, async (req, res) => {
  const { _id: nurseId, role } = req.user;  // Get nurse ID from the authenticated user
  try {
    if (nurseId && role === 'nurse') {
      const children = await Child.find({ nurseId });
      res.status(200).json(children);
    } else {
      res.status(403).json({ message: 'Доступ заборонено' });
    }
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Додати запланований візит
router.post('/schedule_visit', async (req, res) => {
  const { childId, visitType, visitDate } = req.body;

  try {
    const child = await Child.findById(childId);

    if (!child) {
      return res.status(404).json({ message: 'Child not found' });
    }

    // Перевірка наявності запланованого візиту такого типу
    const existingVisitIndex = child.sheduledVisits.findIndex(visit => visit.type === visitType);

    if (existingVisitIndex !== -1) {
      // Замінити поле date на значення, яке прийшло в запиті
      child.sheduledVisits[existingVisitIndex].date = visitDate;
    } else {
      // Додавання нового запланованого візиту
      child.sheduledVisits.push({ type: visitType, date: visitDate });
    }

    // Якщо тип візиту "other", додати до масиву об'єкт visitType
    if (visitType === 'other') {
      child.sheduledVisits.push({ type: visitType, date: visitDate });
    }

    await child.save();

    res.status(200).json({ message: 'Visit scheduled successfully', child });
  } catch (error) {
    console.error('Error scheduling visit:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});
// Other CRUD routes (get, update, delete)

module.exports = router;
