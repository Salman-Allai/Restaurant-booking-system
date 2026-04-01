const dotenv = require('dotenv');
dotenv.config();

const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const authRoutes = require('./routes/authRoutes');
const tableRoutes = require('./routes/tableRoutes');
const bookingRoutes = require('./routes/bookingRoutes');

const app = express();

app.use(cors());
app.use(express.json());

app.use('/api/auth', authRoutes);
app.use('/api/tables', tableRoutes);
app.use('/api/bookings', bookingRoutes);

app.get('/', (req, res) => res.send('Restaurant Booking API is running'));

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log('MongoDB connected');
    app.listen(process.env.PORT || 5000, () =>
      console.log('Server running on port ' + (process.env.PORT || 5000))
    );
  })
  .catch((err) => console.error('MongoDB connection error:', err));