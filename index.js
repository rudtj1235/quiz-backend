const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

// 실제 배포된 프론트엔드 주소로 수정하세요!
const allowedOrigins = [
  'https://quiz-frontend-snowy-mu.vercel.app',
  'https://quiz-frontend-2wdx1wgu4-park-kyungseos-projects.vercel.app',
  'http://localhost:3000'
];

app.use(cors({
  origin: function(origin, callback) {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true
}));
app.use(express.json());

mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
  .then(() => console.log('MongoDB 연결 성공'))
  .catch((err) => console.error('MongoDB 연결 실패:', err));

const userRouter = require('./routes/user');
const quizRouter = require('./routes/quiz');
const rankingRouter = require('./routes/ranking');
const schoolRouter = require('./routes/school');
app.use('/api/user', userRouter);
app.use('/api/quiz', quizRouter);
app.use('/api/ranking', rankingRouter);
app.use('/api/school', schoolRouter);

app.get('/', (req, res) => {
  res.send('실시간 수학퀴즈 랭킹 백엔드 동작 중');
});

app.listen(PORT, () => {
  console.log(`서버가 포트 ${PORT}에서 실행 중`);
});
