<<<<<<< HEAD
const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const connectDB = require('./configdb.js');
// --- !!! بداية الإصلاح: تعديل المسار !!! ---
// يفترض أن server.js ومجلد middleware كلاهما داخل backend
const { protect } = require('./middleware/authMiddleware');
// --- نهاية الإصلاح ---

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
  'http://localhost:5501',
  'http://127.0.0.1:5501',
  'https://peaceful-froyo-d7a4a4.netlify.app', // رابط Netlify مضاف
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

=======
const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const connectDB = require('./configdb.js'); // (موجود الآن)
// const { protect } = require('../middleware/authMiddleware'); // (موجود الآن)

dotenv.config(); // تحميل متغيرات البيئة (من ملف .env)

// --- !!! خطوة تشخيصية: طباعة المتغيرات للتأكد منها !!! ---
console.log("=============== DEBUGGING VARIABLES ===============");
console.log("MONGO_URI:", process.env.MONGO_URI);
console.log("JWT_SECRET:", process.env.JWT_SECRET ? "Loaded" : "Not Loaded"); // نطبع فقط هل تم تحميله
console.log("PORT:", process.env.PORT); // نطبع البورت أيضاً
console.log("=================================================");
// --- !!! نهاية الخطوة التشخيصية !!! ---


const app = express();

// Middleware
const allowedOrigins = [
  'http://localhost:3000', // الرابط الافتراضي لـ React
  'http://localhost:5173', // الرابط الافتراضي لـ Vite
  'http://localhost:5500',
  'http://127.0.0.1:5500',
  'http://localhost:5501',
  'http://127.0.0.1:5501',
  // !!! أضف رابط Netlify هنا عند الحاجة !!!
 'https://app.netlify.com/projects/peaceful-froyo-d7a4a4/overview',
];


app.use(cors({
  origin: function (origin, callback) {
    if (!origin || allowedOrigins.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      callback(new Error(`المصدر ${origin} غير مسموح به بواسطة CORS`));
    }
  },
  credentials: true,
}));

app.use(express.json());

// Routes
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/transactions', require('./routes/transactionRoutes'));
app.use('/api/debts', require('./routes/debtRoutes'));
app.use('/api/dashboard', require('./routes/dashboardRoutes'));

// Railway سيوفر البورت تلقائياً كمتغير بيئة اسمه PORT
const PORT = process.env.PORT || 5000;

// (استخدام الطريقة المحسّنة لبدء التشغيل)
const startServer = async () => {
  try {
    // 1. انتظر الاتصال بقاعدة البيانات أولاً
    await connectDB();

    // 2. إذا نجح الاتصال، قم بتشغيل الخادم
    app.listen(PORT, () => console.log(`[Server] يعمل الخادم على المنفذ ${PORT}`));

  } catch (error) {
    // في حالة فشل connectDB، سيتم طباعة الخطأ في configdb.js والخروج
    console.error(`[Server] فشل بدء تشغيل الخادم بسبب خطأ في قاعدة البيانات أو متغيرات البيئة.`);
  }
};

// 3. استدعاء دالة بدء التشغيل
startServer();

>>>>>>> c124a509f203b77ce4ee4576f5159e2ec79f850c
