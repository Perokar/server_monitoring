const mongoose = require('mongoose');

const visit2to5Schema = new mongoose.Schema({
  clientId: { type: mongoose.Schema.Types.ObjectId, ref: 'Client', required: true },
  nurseId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }, // Медсестра, що робить візит
  visitDate: { type: Date, required: true }, // Дата візиту
  visitType: { type: String, required: true }, // Тип візиту
  ageAtVisit: { type: Number, required: true }, // Вік на момент візиту
  // visitStatus: { type: String, required: true },
  visitDuration: { type: Number, required: true }, // Тривалість візиту (хвилини)
  modelVisit: { type: String, required: true }, // Модель візиту (універсальна / прогресивна)
  medicalRiskLevel: { type: String, required: true }, // Рівень медичних ризиків
  medicalRiskReasons: { type: String, required: true }, // Причини медичних ризиків
  socialRiskLevel: { type: String, required: true },  // Рівень соціальних ризиків
  socialRiskReasons: { type: String, required: true }, // Причини соціальних ризиків
  ecoMapCreated: { type: String, required: true }, // Еко-карта створена
  needsTriangleApplied: { type: String, required: true  }, // Застосовано трикутник потреб
  feedingType: { type: String, required: true }, // Характери вигодовування
  maternityHospitalVaccination: { type: String, required: true }, // Вакцинація в пологовому будинку
  motherEmotionalState: { type: String, required: true }, // Емоційний стан матері
  familyEmotionalState: { type: String, required: true }, // Емоційний стан сім'ї
  weightGain: { type: String, required: true  }, // Набір ваги у вдповідності до віку
  // referralToOtherSpecialists: { type: String,required: true  }, // Скерування до інших спеціалістів
  zzzReferralReasons: { type: String }, // Причини скерування до ЗОЗ
  ssReferralReasons: { type: String }, // Причини скерування до СС
  ssdReferralReasons: { type: String }, // Причини скерування до ССД
  notes: { type: String }, // Примітки
  consultation: { type: String }, // Консультація
});

const Visit2to5 = mongoose.model('Visit2to5', visit2to5Schema);

module.exports = Visit2to5;
