const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const connectDB = require('./configdb.js'); // (موجود الآن)
// const { protect } = require('../middleware/authMiddleware'); // (موجود الآن)

dotenv.config(); // تحميل متغيرات البيئة (من ملف .env)

const app = express();

// Middleware
// --- بداية الإصلاح النهائي لـ CORS ---
const allowedOrigins = [
  'http://localhost:3000', // الرابط الافتراضي لـ React
  'http://localhost:5173', // الرابط الافتراضي لـ Vite
  
  // !!! تمت إضافة روابط Live Server المتوقعة !!!
  'http://localhost:5500', 
  'http://127.0.0.1:5500',
  'http://localhost:5501', 
  'http://127.0.0.1:5501',

];

app.use(cors({
  origin: function (origin, callback) {
    // السماح بالطلبات إذا كانت من المصادر المسموحة أو إذا لم يكن لها مصدر (مثل Postman)
    if (!origin || allowedOrigins.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      callback(new Error(`المصدر ${origin} غير مسموح به بواسطة CORS`));
    }
  },
  credentials: true,
}));
// --- نهاية الإصلاح ---

app.use(express.json());

// Routes
// (ملفات الـ Routes هذه موجودة الآن لديك)
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/transactions', require('./routes/transactionRoutes'));
app.use('/api/debts', require('./routes/debtRoutes'));
app.use('/api/dashboard', require('./routes/dashboardRoutes'));

const PORT = process.env.PORT || 5000;

// (استخدام الطريقة المحسّنة لبدء التشغيل)
const startServer = async () => {
  try {
    // 1. انتظر الاتصال بقاعدة البيانات أولاً
    await connectDB(); 
    
    // 2. إذا نجح الاتصال، قم بتشغيل الخادم
    app.listen(PORT, () => console.log(`[Server] يعمل الخادم على المنفذ ${PORT}`));

  } catch (error) {
    console.error(`[Server] فشل بدء تشغيل الخادم.`);
  }
};

// 3. استدعاء دالة بدء التشغيل
startServer();

