const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const connectDB = require('./configdb.js');
const { protect } = require('./middleware/authMiddleware'); // ✅ middleware import fixed

dotenv.config();

// ✅ Debugging Environment Variables
console.log("=============== DEBUGGING VARIABLES ===============");
console.log("MONGO_URI:", process.env.MONGO_URI ? "Loaded" : "Not Loaded or Invalid");
console.log("JWT_SECRET:", process.env.JWT_SECRET ? "Loaded" : "Not Loaded");
console.log("PORT:", process.env.PORT);
console.log("=================================================");

const app = express();

// ✅ CORS Configuration
const allowedOrigins = [
  'http://localhost:3000',
  'http://localhost:5173',
  'http://localhost:5500',
  'http://127.0.0.1:5500',
  'http://localhost:5501',
  'http://127.0.0.1:5501',
  'https://eslamead.netlify.app', // رابط الواجهة الأمامية (Netlify)
];

app.use(cors({
  origin: function (origin, callback) {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      console.error(`❌ CORS blocked origin: ${origin}`);
      callback(new Error(`المصدر ${origin} غير مسموح به بواسطة CORS`));
    }
  },
  credentials: true,
}));

app.use(express.json());

// ✅ Routes
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/transactions', require('./routes/transactionRoutes'));
app.use('/api/debts', require('./routes/debtRoutes'));
app.use('/api/dashboard', require('./routes/dashboardRoutes'));
app.use('/api/customers', require('./routes/customerRoutes'));

// --- !!! تمت الإضافة: تفعيل مسارات التقارير !!! ---
// (بافتراض أن ملفك اسمه ReportRoutes.js وموجود بجوار باقي المسارات)
app.use('/api/reports', require('./routes/ReportRoutes')); 

// ✅ Start Server
const PORT = process.env.PORT || 5000;

const startServer = async () => {
  try {
    console.log("[Server] Connecting to MongoDB...");
    await connectDB();
    console.log("[Server] ✅ MongoDB Connected.");
    app.listen(PORT, () => console.log(`[Server] 🚀 Running on port ${PORT}`));
  } catch (error) {
    console.error("[Server] ❌ Failed to start:", error);
  }
};

startServer();
