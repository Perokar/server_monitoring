const express = require('express');
const router = express.Router();
const Visit = require('../../models/visit');
const authMiddleware = require('../../middleware/auth');

// Create visit
router.post('/add_visit', authMiddleware, async (req, res) => {
  const nurseId = req.user._id; // Get nurse ID from the authenticated user
  const visit = new Visit({
    ...req.body,
    nurseId: nurseId
  });

  try {
    const newVisit = await visit.save();
    res.status(201).json(newVisit);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});
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
