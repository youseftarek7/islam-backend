const mongoose = require('mongoose');

const debtSchema = new mongoose.Schema({
  // --- مفتاح الربط مع المستخدم ---
  user: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'User',
  },
  name: {
    type: String,
    required: [true, 'الاسم مطلوب'],
  },
  amount: {
    type: Number,
    required: [true, 'المبلغ مطلوب'],
    default: 0,
  },
  status: {
    type: String,
    required: true,
    enum: ['they-owe', 'i-owe'], // الحالة (لي فلوس / عليّ فلوس)
  },
  date: {
    type: Date,
  },
  notes: {
    type: String,
    default: '',
  },
}, {
  timestamps: true
});

module.exports = mongoose.model('Debt', debtSchema);
