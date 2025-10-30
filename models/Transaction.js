const mongoose = require('mongoose');

const transactionSchema = new mongoose.Schema({
  // --- مفتاح الربط مع المستخدم ---
  // هذا أهم حقل، يضمن أن كل مستخدم يرى بياناته فقط
  user: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'User', // يشير إلى نموذج 'User'
  },
  name: {
    type: String,
    required: [true, 'اسم العميل مطلوب'],
  },
  type: {
    type: String,
    required: [true, 'نوع المعاملة مطلوب'],
  },
  paid: {
    type: Number,
    required: true,
    default: 0,
  },
  remaining: {
    type: Number,
    required: true,
    default: 0,
  },
  deliveryDate: {
    type: Date,
  },
  notes: {
    type: String,
    default: '',
  },
}, {
  timestamps: true // لإضافة createdAt (مهم للرسوم البيانية)
});

module.exports = mongoose.model('Transaction', transactionSchema);
