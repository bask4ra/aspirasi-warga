const express = require('express');
const router = express.Router();
const Aspirasi = require('../models/Aspirasi');
const { ensureAuth } = require('../middlewares/authMiddleware');

// Kirim aspirasi (POST /aspirasi)
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
      lokasi,
      nama: req.user.name,       // disimpan untuk ditampilkan
      email: req.user.email      // disimpan untuk ditampilkan
    });

    await aspirasiBaru.save();
    res.status(201).json({ message: 'Aspirasi berhasil dikirim.' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Gagal menyimpan aspirasi.' });
  }
});

// Lihat aspirasi user (GET /aspirasi/me)
router.get('/me', ensureAuth, async (req, res) => {
  try {
    const aspirasiku = await Aspirasi.find({ user: req.user._id })
      .sort({ createdAt: -1 });
    res.json(aspirasiku);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Gagal mengambil data aspirasi.' });
  }
});

module.exports = router;
