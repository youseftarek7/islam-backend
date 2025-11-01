const mongoose = require('mongoose');

// --- مخطط العميل ---
const customerSchema = new mongoose.Schema({
  // مفتاح الربط مع المستخدم
  user: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'User',
  },
  name: {
    type: String,
    required: [true, 'اسم العميل مطلوب'],
  },
  phone: {
    type: String,
    default: '',
  },
  email: {
    type: String,
    default: '',
  },
  notes: {
    type: String,
    default: '',
  },
}, {
  timestamps: true // لإضافة createdAt و updatedAt
});

module.exports = mongoose.model('Customer', customerSchema);
