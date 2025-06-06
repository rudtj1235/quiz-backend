const express = require('express');
const router = express.Router();
const User = require('../models/User');

// 닉네임/학교 중복 체크 및 등록 (같은 IP면 재사용 허용)
router.post('/register', async (req, res) => {
  const { school, nickname } = req.body;
  if (!school || !nickname) {
    return res.status(400).json({ message: '학교명과 닉네임을 입력하세요.' });
  }
  try {
    const exists = await User.findOne({ school, nickname });
    const ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress || '';
    if (exists) {
      // IP가 같으면 기존 user 재사용 허용
      if (exists.ip && exists.ip === ip) {
        return res.status(200).json({ message: '기존 사용자 재사용', user: exists });
      }
      return res.status(409).json({ message: '이미 존재하는 닉네임입니다.' });
    }
    const user = new User({ school, nickname, ip });
    await user.save();
    res.status(201).json({ message: '등록 성공', user });
  } catch (err) {
    res.status(500).json({ message: '서버 오류', error: err });
  }
});

// 사용자 정보 조회
router.get('/info/:id', async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ message: '사용자 없음' });
    res.json({ user });
  } catch (err) {
    res.status(500).json({ message: '서버 오류', error: err });
  }
});

module.exports = router;
