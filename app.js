const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();


const app = express();
const corsOptions = {
  origin: process.env.CORS_ORIGIN,
  optionsSuccessStatus: 200
}
app.use(cors());
const PORT = process.env.PORT || 3000;

mongoose.connect(process.env.DATABASE_URL, {
  serverSelectionTimeoutMS: 5000
});

const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', () => {
  console.log('Connected to MongoDB');
});

app.use(express.json());

// Routers
const childrenRouter = require('./routes/Nurse/children/child');
const visitsRouter = require('./routes/Nurse/children/visits');
const authRouter = require('./routes/auth');

app.use('/api/children', childrenRouter);
app.use('/api/visits', visitsRouter);
app.use('/api/auth', authRouter);

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
