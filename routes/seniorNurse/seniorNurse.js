const express = require('express');
const Nurse = require('../../models/Nurse'); // Assuming you have a Nurse model
const Visit = require('../../models/Visit'); // Assuming you have a Visit model

const router = express.Router();

// Route to get all nurses and their visits for a senior nurse
router.get('/:seniorNurseId/nurses', async (req, res) => {
    try {
        const seniorNurseId = req.params.seniorNurseId;

        // Find the senior nurse
        const seniorNurse = await Nurse.findById(seniorNurseId);
        if (!seniorNurse) {
            return res.status(404).json({ message: 'Senior nurse not found' });
        }

        // Find all nurses belonging to the same cpmsd as the senior nurse
        const nurses = await Nurse.find({ cpmsd: seniorNurse.cpmsd });

        // Get visits for each nurse
        const nursesWithVisits = await Promise.all(nurses.map(async (nurse) => {
            const visits = await Visit.find({ nurseId: nurse._id });
            return {
                nurse,
                visits
            };
        }));

        res.json(nursesWithVisits);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

module.exports = router;