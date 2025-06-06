const express = require('express');
const router = express.Router();
const fs = require('fs');
const path = require('path');
const csv = require('csv-parser');

const schoolsFile = path.join(__dirname, '../models/schools.csv');

// 검색 API: /api/school/search?name=입력값
router.get('/search', (req, res) => {
  const { name } = req.query;
  if (!name) return res.json([]);

  const results = [];
  fs.createReadStream(schoolsFile)
    .pipe(csv())
    .on('data', (row) => {
      // name, region 컬럼 기준 (schools.csv 헤더에 맞게 수정)
      if (row.name && row.region && row.name.includes(name)) {
        results.push(`${row.name}(${row.region})`);
      }
    })
    .on('end', () => {
      res.json(results);
    });
});

module.exports = router;