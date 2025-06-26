const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const mongoose = require('mongoose');
const dotenv = require('dotenv');
dotenv.config();

const User = require('../models/User');

const adminEmails = ['adampratama.business@gmail.com'];

passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: '/auth/google/callback'
  },
  async (accessToken, refreshToken, profile, done) => {
    try {
      // Cek apakah user sudah ada
      const existingUser = await User.findOne({ googleId: profile.id });

      if (existingUser) {
        return done(null, existingUser);
      }

      // Cek apakah email cocok dengan admin
      const email = profile.emails[0].value;
      const isAdmin = adminEmails.includes(email);

      // Buat user baru
      const newUser = new User({
        googleId: profile.id,
        name: profile.displayName,
        email: email,
        role: isAdmin ? 'admin' : 'user',
      });

      await newUser.save();
      return done(null, newUser);
    } catch (error) {
      return done(error, null);
    }
  }
));

// Serialize & deserialize
passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
  try {
    const user = await User.findById(id);
    done(null, user);
  } catch (err) {
    done(err, null);
  }
});
