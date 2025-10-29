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

