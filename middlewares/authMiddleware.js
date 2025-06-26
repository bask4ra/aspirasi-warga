function ensureAuth(req, res, next) {
  if (req.isAuthenticated()) return next();

  // Cek tipe permintaan: JSON (fetch) atau browser biasa
  const acceptHeader = req.headers.accept || '';
  if (acceptHeader.includes('application/json')) {
    return res.status(401).json({ message: 'Unauthorized. Please login first.' });
  } else {
    return res.redirect('/');
  }
}

function ensureAdmin(req, res, next) {
  if (req.isAuthenticated() && req.user?.role === 'admin') return next();

  const acceptHeader = req.headers.accept || '';
  if (acceptHeader.includes('application/json')) {
    return res.status(403).json({ message: 'Forbidden. Admin only.' });
  } else {
    return res.status(403).send('Akses ditolak. Anda bukan admin.');
  }
}

module.exports = {
  ensureAuth,
  ensureAdmin
};
