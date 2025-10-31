const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const connectDB = require('./configdb.js');
const { protect } = require('./middleware/authMiddleware');

dotenv.config();

console.log("=============== DEBUGGING VARIABLES ===============");
console.log("MONGO_URI:", process.env.MONGO_URI ? "Loaded" : "Not Loaded or Invalid");
console.log("JWT_SECRET:", process.env.JWT_SECRET ? "Loaded" : "Not Loaded");
console.log("PORT:", process.env.PORT);
console.log("=================================================");

const app = express();

// ✅ إعداد CORS (مفتوح أو مخصص)
app.use(cors({
  origin: 'https://eslamead.netlify.app', // رابط الواجهة الأمامية بتاعتك
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true
}));

// لتحويل JSON
app.use(express.json());

// ✅ تعريف المسارات (Routes)
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/transactions', require('./routes/transactionRoutes'));
app.use('/api/debts', require('./routes/debtRoutes'));
app.use('/api/dashboard', require('./routes/dashboardRoutes'));

const PORT = process.env.PORT || 5000;

const startServer = async () => {
  try {
    console.log("[Server] Attempting to connect to DB...");
    await connectDB();
    console.log("[Server] DB Connected. Starting server...");
    app.listen(PORT, () => console.log(`[Server] Server listening on port ${PORT}`));
  } catch (error) {
    console.error(`[Server] Failed to start server:`, error);
  }
};

startServer();
