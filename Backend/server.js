const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
const logger = require('./middleware/logger');
const protect = require('./middleware/auth');
const authRoutes = require('./routes/auth');
const productRoutes = require('./routes/product');

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());
app.use(logger); 

app.use('/api', authRoutes);
app.use('/api', productRoutes);

app.get('/api/dashboard', protect, (req, res) => {
  res.status(200).json({
    message: 'Welcome to the protected dashboard',
    userId: req.user,
  });
});


mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log('✅ MongoDB connected');
    app.listen(process.env.PORT, () => {
      console.log(`🚀 Server running on port ${process.env.PORT}`);
    });
  })
  .catch((err) => {
    console.error('❌ MongoDB connection failed:', err.message);
  });
