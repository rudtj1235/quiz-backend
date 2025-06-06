const mongoose = require('mongoose');

const quizResultSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  questions: [
    {
      left: Number,
      right: Number,
      answer: Number,
      userAnswer: Number,
      isCorrect: Boolean
    }
  ],
  totalCorrect: { type: Number, default: 0 },
  totalTime: { type: Number, default: 0 },
  createdAt: { type: Date, default: Date.now },
  operation: { type: String, default: 'addition' },
});

module.exports = mongoose.model('QuizResult', quizResultSchema); 