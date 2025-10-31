const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const connectDB = require('./configdb.js');
// --- !!! تم الإصلاح: استيراد الـ middleware بشكل صحيح ---
// This was previously broken by a git merge conflict
const { protect } = require('./middleware/authMiddleware');

dotenv.config();

// --- خطوة تشخيصية: طباعة المتغيرات ---
console.log("=============== DEBUGGING VARIABLES ===============");
console.log("MONGO_URI:", process.env.MONGO_URI ? "Loaded" : "Not Loaded or Invalid");
console.log("JWT_SECRET:", process.env.JWT_SECRET ? "Loaded" : "Not Loaded");
console.log("PORT:", process.env.PORT);
console.log("=================================================");
// --- نهاية الخطوة التشخيصية ---

const app = express();

// Middleware
const allowedOrigins = [
  'http://localhost:3000',
  'http://localhost:5173',
  'http://localhost:5500',
  'http://127.0.0.1:5500',
  'https://eslamead.netlify.app', // 👈 رابط موقعك الحقيقي
  'https://reliable-smile-production.up.railway.app', // 👈 رابط السيرفر نفسه
];


app.use(cors({
  origin: function (origin, callback) {
    if (!origin || allowedOrigins.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
       console.error(`CORS blocked origin: ${origin}`);
       callback(new Error(`المصدر ${origin} غير مسموح به بواسطة CORS`));
    }
  },
  credentials: true,
}));

app.use(express.json());

// Routes
// (تستخدم protect المستورد في الأعلى)
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
