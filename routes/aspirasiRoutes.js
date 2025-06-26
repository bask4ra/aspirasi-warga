const express = require('express');
const router = express.Router();
const Aspirasi = require('../models/Aspirasi');
const { ensureAuth } = require('../middlewares/authMiddleware');

// POST /aspirasi → Kirim aspirasi
router.post('/', ensureAuth, async (req, res) => {
  const { judul, deskripsi, lokasi } = req.body;

  if (!judul || !deskripsi || !lokasi) {
    return res.status(400).json({ message: 'Semua field wajib diisi.' });
  }

  try {
    const aspirasiBaru = new Aspirasi({
      user: req.user._id,
      judul,
      deskripsi,
      lokasi
    });

    await aspirasiBaru.save();
    res.status(201).json({ message: 'Aspirasi berhasil dikirim.' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Gagal menyimpan aspirasi.' });
  }
});

// GET /aspirasi/me → Lihat aspirasi milik user yang login
router.get('/me', ensureAuth, async (req, res) => {
  try {
    const aspirasiku = await Aspirasi.find({ user: req.user._id }).sort({ createdAt: -1 });
    res.json(aspirasiku);
  } catch (err) {
    res.status(500).json({ message: 'Gagal mengambil data aspirasi.' });
  }
});

module.exports = router;
