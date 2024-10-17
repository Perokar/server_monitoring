const express = require('express');
const router = express.Router();
const Visit2to5 = require('../../models/Visits2to5');
const authMiddleware = require('../../middleware/auth');

// Create visit 2-5
router.post('/', authMiddleware, async (req, res) => {
  const nurseId = req.user._id; // Get nurse ID from the authenticated user
  const visit2to5 = new Visit2to5({
    ...req.body,
    nurseId: nurseId
  });

  try {
    const newVisit2to5 = await visit2to5.save();
    res.status(201).json(newVisit2to5);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Other CRUD routes (get, update, delete)

module.exports = router;
