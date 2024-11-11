const mongoose = require('mongoose');

const ArtworkSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  price: { type: Number, required: true, min: 0 },
  imageUrls: { type: [String], default: [] },
  artistId: { type: mongoose.Schema.Types.ObjectId, ref: 'Artist', required: true },
  isPublished: { type: Boolean, default: false },
  shopifyProductId: { type: String, default: '' },
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Artwork', ArtworkSchema);
