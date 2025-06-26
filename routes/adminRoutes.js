const express = require('express');
const router = express.Router();
const Aspirasi = require('../models/Aspirasi');
const { ensureAdmin } = require('../middlewares/authMiddleware');

// GET /admin/aspirasi → ambil semua aspirasi
router.get('/aspirasi', ensureAdmin, async (req, res) => {
  try {
    const aspirasiSemua = await Aspirasi.find()
      .populate('user', 'name email') // tampilkan nama dan email pengirim
      .sort({ createdAt: -1 });

    res.json(aspirasiSemua);
  } catch (err) {
    res.status(500).json({ message: 'Gagal mengambil data aspirasi.' });
  }
});

// PATCH /admin/aspirasi/:id → ubah status aspirasi
router.patch('/aspirasi/:id', ensureAdmin, async (req, res) => {
  const { status } = req.body;

  if (!['Menunggu', 'Diproses', 'Selesai'].includes(status)) {
    return res.status(400).json({ message: 'Status tidak valid.' });
  }

  try {
    const aspirasi = await Aspirasi.findById(req.params.id);
    if (!aspirasi) return res.status(404).json({ message: 'Aspirasi tidak ditemukan.' });

    aspirasi.status = status;
    await aspirasi.save();

    res.json({ message: 'Status aspirasi diperbarui.', data: aspirasi });
  } catch (err) {
    res.status(500).json({ message: 'Gagal memperbarui aspirasi.' });
  }
});

module.exports = router;
