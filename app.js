const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();


const app = express();
const corsOptions = {
  origin: process.env.CORS_ORIGIN,
  optionsSuccessStatus: 200
}
app.use(cors(corsOptions));
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

// // Routers
const childrenRouter = require('./routes/Nurse/children/child');
const visitsRouter = require('./routes/Nurse/children/visits');
const {router:authRouter} = require('./routes/auth');
const sheduleRouter = require('./routes/Nurse/children/sheduleVisits');
const mainAdminRouter = require('./routes/admin/mainAdmin');

app.use('/api/children', childrenRouter);
app.use('/api/visits', visitsRouter);
app.use('/api/shedule', sheduleRouter);
app.use('/api/auth', authRouter);
// app.use('/api/m-admin', mainAdminRouter);

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
