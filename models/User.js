const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  school: { type: String, required: true },
  nickname: { type: String, required: true },
  score: { type: Number, default: 0 },
  time: { type: Number, default: 0 },
  attempts: { type: Number, default: 0 },
  ip: { type: String },
  averageScore: { type: Number, default: 0 },
  createdAt: { type: Date, default: Date.now },
}, {
  indexes: [
    { fields: { school: 1, nickname: 1 }, options: { unique: true } }
  ]
});

module.exports = mongoose.model('User', userSchema); 