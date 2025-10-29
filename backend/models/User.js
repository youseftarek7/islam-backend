const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'الاسم مطلوب'],
  },
  email: {
    type: String,
    required: [true, 'البريد الإلكتروني مطلوب'],
    unique: true, // كل بريد إلكتروني يجب أن يكون فريداً
    lowercase: true,
  },
  password: {
    type: String,
    required: [true, 'كلمة المرور مطلوبة'],
  }
}, {
  timestamps: true // إضافة حقلي createdAt و updatedAt تلقائياً
});

// --- تشفير كلمة المرور قبل الحفظ ---
// يتم تفعيل هذا الـ "hook" قبل أي عملية "save"
userSchema.pre('save', async function (next) {
  // لا نقوم بإعادة التشفير إذا لم تتغير كلمة المرور
  if (!this.isModified('password')) {
    return next();
  }

  // توليد "salt" لزيادة أمان التشفير
  const salt = await bcrypt.genSalt(10);
  // تشفير كلمة المرور
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

// --- دالة لمقارنة كلمة المرور المدخلة بالكلمة المشفرة ---
userSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

module.exports = mongoose.model('User', userSchema);
