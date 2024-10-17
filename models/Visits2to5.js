const mongoose = require('mongoose');

const visit2to5Schema = new mongoose.Schema({
  clientId: { type: mongoose.Schema.Types.ObjectId, ref: 'Client', required: true },
  nurseId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }, // Медсестра, що робить візит
  ageAtVisit: { type: Number, required: true }, // Вік на момент візиту
  visitStatus: { type: String, required: true },
  visitDuration: { type: Number, required: true }, // Тривалість візиту (хвилини)
  universalProgressive: { type: String, required: true },
  medicalRiskLevel: { type: String, required: true },
  medicalRiskReasons: { type: String, required: true },
  socialRiskLevel: { type: String, required: true },
  socialRiskReasons: { type: String, required: true },
  ecoMapCreated: { type: Boolean, default: false },
  needsTriangleApplied: { type: Boolean, default: false },
  feedingType: { type: String, required: true },
  maternityHospitalVaccination: { type: Boolean, default: false },
  motherEmotionalState: { type: String, required: true },
  familyEmotionalState: { type: String, required: true },
  weightGain: { type: Boolean, default: false },
  referralToOtherSpecialists: { type: Boolean, default: false },
  zzzReferralReasons: { type: String }, // Причини скерування до ЗОЗ
  ssReferralReasons: { type: String }, // Причини скерування до СС
  ssdReferralReasons: { type: String }, // Причини скерування до ССД
  notes: { type: String }
});

const Visit2to5 = mongoose.model('Visit2to5', visit2to5Schema);

module.exports = Visit2to5;
