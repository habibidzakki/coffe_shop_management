const express = require('express');

const router = express.Router();

// Contoh endpoint redirect sesuai arahan dosen.
// Buka: http://localhost:3000/api/redirect/google
router.get('/redirect/google', (req, res) => {
  res.redirect('https://www.google.com/search?q=coffee+shop+management+system');
});

// Contoh redirect ke halaman frontend lokal.
// Buka: http://localhost:3000/api/redirect/app
router.get('/redirect/app', (req, res) => {
  res.redirect('/');
});

module.exports = router;
