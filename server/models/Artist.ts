import mongoose from 'mongoose';

const ArtistSchema = new mongoose.Schema({
  name: String,
  email: String,
  passwordHash: String,
  bio: String,
  profileImageUrl: String,
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Artist', ArtistSchema);
