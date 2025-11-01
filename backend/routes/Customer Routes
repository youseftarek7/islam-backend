const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/authMiddleware');
const Customer = require('../models/Customer');

// --- حماية جميع المسارات ---
router.use(protect);

// --- 1. جلب جميع العملاء (للمستخدم الحالي) ---
// GET /api/customers
router.get('/', async (req, res) => {
  try {
    const customers = await Customer.find({ user: req.user._id });
    res.json(customers);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// --- 2. إضافة عميل جديد ---
// POST /api/customers
router.post('/', async (req, res) => {
  try {
    const { name, phone, email, notes } = req.body;

    const customer = new Customer({
      name,
      phone,
      email,
      notes,
      user: req.user._id, // ربط العميل بالمستخدم
    });

    const createdCustomer = await customer.save();
    res.status(201).json(createdCustomer);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// --- 3. تعديل عميل ---
// PUT /api/customers/:id
router.put('/:id', async (req, res) => {
  try {
    let customer = await Customer.findById(req.params.id);
    if (!customer) {
      return res.status(404).json({ message: 'العميل غير موجود' });
    }

    // التحقق من الملكية
    if (customer.user.toString() !== req.user._id.toString()) {
      return res.status(401).json({ message: 'غير مصرح لك' });
    }

    const updatedCustomer = await Customer.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    
    res.json(updatedCustomer);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// --- 4. حذف عميل ---
// DELETE /api/customers/:id
router.delete('/:id', async (req, res) => {
  try {
    const customer = await Customer.findById(req.params.id);
    if (!customer) {
      return res.status(404).json({ message: 'العميل غير موجود' });
    }

    // التحقق من الملكية
    if (customer.user.toString() !== req.user._id.toString()) {
      return res.status(401).json({ message: 'غير مصرح لك' });
    }

    await Customer.deleteOne({ _id: req.params.id });
    res.json({ message: 'تم حذف العميل' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
