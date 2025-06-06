const express = require('express');
const router = express.Router();
const User = require('../models/User');

// 유저 리스트에서 학교/닉네임별 최고 점수만 남기고, 현재 userId의 기록은 항상 포함
function filterBestAndCurrent(users, userId) {
  const map = new Map();
  users.forEach(u => {
    const key = u.school + '|' + u.nickname;
    if (!map.has(key) || u.score > map.get(key).score) {
      map.set(key, u);
    }
  });
  // 현재 기록이 최고가 아니면 추가
  if (userId) {
    const current = users.find(u => u._id.toString() === userId);
    if (current) {
      const key = current.school + '|' + current.nickname;
      if (!map.has(key) || map.get(key)._id.toString() !== userId) {
        map.set(key + '|current', current);
      }
    }
  }
  return Array.from(map.values());
}

// 전체 랭킹 조회
router.get('/all', async (req, res) => {
  const userId = req.query.userId;
  try {
    const users = await User.find().sort({ score: -1, time: 1 });
    const filtered = filterBestAndCurrent(users, userId);
    res.json({ users: filtered });
  } catch (err) {
    res.status(500).json({ message: '서버 오류', error: err });
  }
});

// 학교별 랭킹 조회
router.get('/school', async (req, res) => {
  const { school, userId } = req.query;
  if (!school) return res.status(400).json({ message: '학교명 필요' });
  try {
    const users = await User.find({ school }).sort({ score: -1, time: 1 });
    const filtered = filterBestAndCurrent(users, userId);
    res.json({ users: filtered });
  } catch (err) {
    res.status(500).json({ message: '서버 오류', error: err });
  }
});

module.exports = router;
