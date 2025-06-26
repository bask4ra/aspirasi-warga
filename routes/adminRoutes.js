// backend/routes/adminRoutes.js
const express = require('express');
const router = express.Router();
const Aspirasi = require('../models/Aspirasi');
const { ensureAdmin } = require('../middlewares/authMiddleware');

// Ambil semua aspirasi
router.get('/aspirasi', ensureAdmin, async (req, res) => {
  try {
    const semuaAspirasi = await Aspirasi.find()
      .populate('user', 'name email')
      .sort({ createdAt: -1 });

    res.json(semuaAspirasi);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Gagal mengambil data aspirasi.' });
  }
});

// Update status
router.patch('/aspirasi/:id/status', ensureAdmin, async (req, res) => {
  const { status } = req.body;
  const validStatus = ['Menunggu', 'Diproses', 'Selesai'];
  if (!validStatus.includes(status)) {
    return res.status(400).json({ message: 'Status tidak valid.' });
  }

  try {
    const aspirasi = await Aspirasi.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    );
    res.json({ message: 'Status berhasil diperbarui.', data: aspirasi });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Gagal memperbarui status.' });
  }
});

// Update komentar
router.patch('/aspirasi/:id/komentar', ensureAdmin, async (req, res) => {
  const { komentar } = req.body;
  if (!komentar || komentar.trim() === '') {
    return res.status(400).json({ message: 'Komentar tidak boleh kosong.' });
  }

  try {
    const aspirasi = await Aspirasi.findByIdAndUpdate(
      req.params.id,
      { komentar },
      { new: true }
    );
    res.json({ message: 'Komentar berhasil diperbarui.', data: aspirasi });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Gagal memperbarui komentar.' });
  }
});

module.exports = router;
