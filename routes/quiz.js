const express = require('express');
const router = express.Router();
const QuizResult = require('../models/QuizResult');
const User = require('../models/User');

// 1자리 수 + 1자리 수 랜덤 문제 5개 출제
router.get('/generate', (req, res) => {
  const operation = req.query.operation || 'addition';
  const questions = Array.from({ length: 5 }).map(() => {
    if (operation === 'multiplication') {
      const left = Math.floor(Math.random() * 90) + 10; // 10~99
      const right = Math.floor(Math.random() * 9) + 1; // 1~9
      return {
        left,
        right,
        answer: left * right
      };
    } else {
      const left = Math.floor(Math.random() * 9) + 1;
      const right = Math.floor(Math.random() * 9) + 1;
      return {
        left,
        right,
        answer: left + right
      };
    }
  });
  res.json({ questions });
});

// 정답 제출 및 결과 저장
router.post('/submit', async (req, res) => {
  const { userId, questions, totalTime, operation } = req.body;
  if (!userId || !questions || !Array.isArray(questions)) {
    return res.status(400).json({ message: '필수 데이터 누락' });
  }
  try {
    const totalCorrect = questions.filter(q => q.answer === q.userAnswer).length;
    const quizResult = new QuizResult({ userId, questions, totalCorrect, totalTime, operation: operation || 'addition' });
    await quizResult.save();
    // 점수 산출: 정답 개수 * 20 - (소요시간(초)/2), 0 미만 방지, 소수 1자리
    let rawScore = totalCorrect * 20 - (totalTime / 2000);
    const score = Math.max(0, rawScore);
    // 사용자 정보 업데이트: 도전 횟수, 평균 점수, IP, operation
    const user = await User.findById(userId);
    const attempts = (user?.attempts || 0) + 1;
    const prevTotal = (user?.averageScore || 0) * (attempts - 1);
    const averageScore = (prevTotal + score) / attempts;
    const ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress || '';
    await User.findByIdAndUpdate(userId, { score, time: totalTime, attempts, averageScore, ip, operation: operation || 'addition', totalCorrect });
    res.json({ message: '제출 완료', totalCorrect, score: score.toFixed(1) });
  } catch (err) {
    res.status(500).json({ message: '서버 오류', error: err });
  }
});

module.exports = router;
