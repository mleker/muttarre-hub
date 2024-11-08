import mongoose from 'mongoose';

const SaleSchema = new mongoose.Schema({
  artworkId: { type: mongoose.Schema.Types.ObjectId, ref: 'Artwork' },
  artistId: { type: mongoose.Schema.Types.ObjectId, ref: 'Artist' },
  salePrice: Number,
  saleDate: { type: Date, default: Date.now },
  shopifyOrderId: String,
})

module.exports = mongoose.model('Sale', SaleSchema);