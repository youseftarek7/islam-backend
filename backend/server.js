const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const connectDB = require('./configdb.js');
const { protect } = require('./middleware/authMiddleware');

dotenv.config();

const app = express();

// ✅ السماح الكامل بالموقع بتاعك + رد على OPTIONS
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', 'https://eslamead.netlify.app');
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  if (req.method === 'OPTIONS') {
    return res.sendStatus(200);
  }
  next();
});

app.use(express.json());

// ✅ المسارات
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/transactions', require('./routes/transactionRoutes'));
app.use('/api/debts', require('./routes/debtRoutes'));
app.use('/api/dashboard', require('./routes/dashboardRoutes'));

const PORT = process.env.PORT || 5000;

const startServer = async () => {
  try {
    await connectDB();
    app.listen(PORT, () => console.log(`[Server] Running on port ${PORT}`));
  } catch (error) {
    console.error(`[Server] Failed to start server:`, error);
  }
};

startServer();
