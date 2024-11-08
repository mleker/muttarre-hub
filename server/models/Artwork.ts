const mongoose = require('mongoose');

const ArtworkSchema = new mongoose.Schema({
  title: String,
  description: String,
  price: Number,
  imageUrls: [String],
  artistId: { type: mongoose.Schema.Types.ObjectId, ref: 'Artist' },
  isPublished: Boolean,
  shopifyProductId: String,
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Artwork', ArtworkSchema);
