const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const session = require('express-session');
const passport = require('passport');
const cors = require('cors');
const path = require('path');

// Load konfigurasi .env
dotenv.config();

// Inisialisasi Express app
const app = express();
const port = process.env.PORT || 5000;

// Middleware untuk parsing JSON
app.use(express.json());

// Konfigurasi session
app.use(session({
  secret: process.env.SESSION_SECRET || 'aspirasi-session',
  resave: false,
  saveUninitialized: false,
}));

// Inisialisasi Passport
require('./config/auth');
app.use(passport.initialize());
app.use(passport.session());

// Izinkan akses dari frontend React (admin-panel)
app.use(cors({
  origin: 'http://localhost:3000', // sesuaikan jika deploy
  credentials: true,
}));

// Koneksi ke MongoDB
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log('✅ MongoDB connected'))
.catch((err) => console.error('❌ MongoDB connection error:', err));

// Routing
const authRoutes = require('./routes/authRoutes');
const aspirasiRoutes = require('./routes/aspirasiRoutes');
const adminRoutes = require('./routes/adminRoutes');
const { ensureAuth, ensureAdmin } = require('./middlewares/authMiddleware');

app.use('/auth', authRoutes);
app.use('/aspirasi', aspirasiRoutes);
app.use('/admin', adminRoutes);

// Cek login status (digunakan oleh React admin)
app.get('/check-auth', (req, res) => {
  if (req.isAuthenticated()) {
    return res.json({ isAuthenticated: true, user: req.user });
  } else {
    return res.status(401).json({ isAuthenticated: false });
  }
});

// Serve file statis dari folder public
app.use(express.static(path.join(__dirname, 'public')));

// Route dasar
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Dashboard User (HTML statis, styled dengan Tailwind)
app.get('/dashboard', ensureAuth, (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'dashboard.html'));
});

// Dashboard Admin (opsional)
app.get('/admin', ensureAdmin, (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'admin.html')); // hanya jika kamu buat
});

// Jalankan server
app.listen(port, () => {
  console.log(`🚀 Server running on http://localhost:${port}`);
});
