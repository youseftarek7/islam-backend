const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/authMiddleware');
const Transaction = require('../models/Transaction');
const Debt = require('../models/Debt');
const Customer = require('../models/Customer');

// --- حماية جميع المسارات ---
router.use(protect);

// --- 1. ملخص الإحصائيات العامة ---
// GET /api/reports/summary
router.get('/summary', async (req, res) => {
  try {
    const userId = req.user._id;

    const totalTransactions = await Transaction.countDocuments({ user: userId });
    const totalCustomers = await Customer.countDocuments({ user: userId });
    const totalDebts = await Debt.countDocuments({ user: userId });

    res.json({
      totalTransactions,
      totalCustomers,
      totalDebts,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// --- 2. بيانات الرسم البياني (المدفوع والمتبقي شهرياً) ---
// GET /api/reports/transactions-over-time
router.get('/transactions-over-time', async (req, res) => {
  try {
    const userId = req.user._id;

    // تجميع (Aggregation) للمعاملات حسب الشهر
    const data = await Transaction.aggregate([
      {
        $match: { user: userId }
      },
      {
        $group: {
          // تجميع حسب الشهر والسنة
          _id: { 
            year: { $year: "$createdAt" }, 
            month: { $month: "$createdAt" } 
          },
          totalPaid: { $sum: "$paid" },
          totalRemaining: { $sum: "$remaining" }
        }
      },
      {
        $sort: { "_id.year": 1, "_id.month": 1 } // ترتيب حسب التاريخ
      }
    ]);

    // تنسيق البيانات للرسم البياني
    const chartData = {
      labels: data.map(d => `${d._id.month}/${d._id.year}`),
      paidData: data.map(d => d.totalPaid),
      remainingData: data.map(d => d.totalRemaining),
    };

    res.json(chartData);

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});


// --- 3. بيانات الرسم البياني الدائري (ملخص الديون) ---
// GET /api/reports/debt-summary
router.get('/debt-summary', async (req, res) => {
  try {
    const userId = req.user._id;

    // تجميع حسب نوع الدين
    const data = await Debt.aggregate([
      {
        $match: { user: userId }
      },
      {
        $group: {
          _id: "$status", // 'they-owe' أو 'i-owe'
          totalAmount: { $sum: "$amount" }
        }
      }
    ]);

    // تنسيق البيانات
    const pieData = {
      labels: data.map(d => (d._id === 'they-owe' ? 'لي فلوس' : 'عليّ فلوس')),
      data: data.map(d => d.totalAmount),
    };

    res.json(pieData);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});


module.exports = router;
