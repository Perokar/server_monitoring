const mongoose = require('mongoose');

const visitSchema = new mongoose.Schema({
  clientId: { type: mongoose.Schema.Types.ObjectId, ref: 'Client', required: true },
  nurseId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }, // Медсестра, що робить візит
  ageAtVisit: { type: Number, required: true }, // Вік на момент візиту (в днях)
  visitCompleted: { type: String, required: true }, // Візит проведено / Візит заплановано
  visitDuration: { type: Number, required: true }, // Тривалість візиту (хвилини)
  medicalRiskLevel: { type: String, required: true },
  medicalRiskReasons: { type: String, required: true },
  socialRiskLevel: { type: String, required: true },
  socialRiskReasons: { type: String, required: true },
  ecoMapCreated: { type: String, required: true },
  feedingType: { type: String, required: true },
  hepatitisBDose1: { type: String, required: true },
  bcgVaccination: { type: String, required: true },
  motherEmotionalState: { type: String, required: true },
  familyEmotionalState: { type: String, required: true },
  exclusiveBreastfeeding: { type: String, required: true },
  newbornCare: { type: String, required: true },
  socialOrganizationalIssues: { type: String, required: true },
  sidsPrevention: { type: String, required: true}, // Синдром раптової смерті новонародженого
  safeEnvironment: { type: String, required: true },
  notes: { type: String }
});

const Visit = mongoose.model('Visit', visitSchema);

module.exports = Visit;
