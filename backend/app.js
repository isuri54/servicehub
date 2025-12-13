const express = require('express');
const cors = require('cors');
const path = require('path');

const authRoutes = require('./routes/auth');
const provider = require('./routes/provider');
const providerRoutes = require('./routes/providerRoutes');
const providerProfileView = require('./routes/providerProfileView');
const bookingRoutes = require("./routes/bookingRoutes");
const chatRoutes = require("./routes/chatRoutes");

const app = express();

app.use(cors());
app.use(express.json());
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

app.use('/api/auth', authRoutes);
app.use('/api/provider', provider);
app.use('/api/providers', providerRoutes);
app.use('/api/providerprofile', providerProfileView);
app.use('/api/bookings', bookingRoutes);
app.use('/api/provideravailability', providerRoutes);
app.use('/api/chat', chatRoutes);
app.use('/api/chat/provider', chatRoutes);
app.use('/api/chat/client', chatRoutes);

app.get('/', (req, res) => {
  res.json({ message: 'Server is running' });
});

module.exports = app;
