const mongoose = require('mongoose');

const childSchema = new mongoose.Schema({
  fullName: { type: String, required: true },
  dateOfBirth: { type: Date, required: true },
  gender: { type: String, enum: ['Хлопчик', 'Дівчинка'], required: true },
  locality: { type: String, required: true },
  district: { type: String, required: true },
  region: { type: String, enum: [
    'Вінницька', 'Волинська', 'Дніпропетровська', 'Донецька', 'Житомирська',
    'Закарпатська', 'Запорізька', 'Івано-Франківська', 'Київська', 'Кіровоградська',
    'Луганська', 'Львівська', 'м.Київ', 'Миколаївська', 'Одеська', 'Полтавська',
    'Рівненська', 'Сумська', 'Тернопільська', 'Харківська', 'Херсонська', 'Хмельницька',
    'Черкаська', 'Чернівецька', 'Чернігівська'
  ], required: true },
  //territorialCommunity: { type: String, required: true }, // Залежно від вибраної області
  parentDeclaration: { type: String, enum: ['У цьому ж закладі', 'У іншому закладі', 'Не укладена'], required: true },
  childDeclaration: { type: String, enum: ['Сімейний лікар', 'Педіатр'], required: true },
  legalStatus: { type: String, enum: ['дитина в якої є батьки','один з батьків','дитина сирота', 'дитина позбавлена батьківського піклування',
    'дитина залишена без батьківського піклування', 'статус у відповідності до постанови КМУ 866, п. 79, прим. 2'
  ], required: true },
  hasSiblings: { type: String, enum: ['Так', 'Ні'], required: true },
  VPO: { type: String, enum: ['Так', 'Ні'], required: true },
  nurseId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }, // Медсестра, що додає клієнта
  registrationDate: { type: Date, default: Date.now },
  sheduledVisits: { type: Array, default: [] },
  visitsHistory: { type: Array, default: [] }
});

const Child = mongoose.model('Child', childSchema);

module.exports = Child;
