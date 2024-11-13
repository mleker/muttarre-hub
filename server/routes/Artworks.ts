import { Request, Response, Router } from 'express';
import { isValidObjectId, Types } from 'mongoose';
// @ts-ignore
import { createShopifyProduct, updateShopifyProduct, deleteShopifyProduct, addProductMedia } from '../shopify/shopifyService.js';
import multer from 'multer';
import path from 'path';

const PUBLIC_BASE_URL = 'https://2250-2a02-3102-4c29-5300-64f0-fb26-6a71-a79d.ngrok-free.app';

const Artwork = require('../models/Artwork');
const router = Router();

// Create storage for uploaded images
const storage = multer.diskStorage({
  destination: 'uploads/',
  filename: (req, file, cb) => {
    const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
    cb(null, `${uniqueSuffix}-${file.originalname}`);
  },
});

const upload = multer({ storage });

// Create artwork
router.post('/', upload.array('images', 10), async (req: any, res: any) => {
  try {

    console.log('Request body:', req.body);
    console.log('Files received:', req.files);

    const { title, description, price, artistId, technik, shopifyProductId } = req.body;

    if (!isValidObjectId(artistId)) {
      return res.status(400).json({ error: 'Invalid artistId format. It must be a valid MongoDB ObjectId.' });
    }

    // Check if required fields are missing
    if (!title || !description || typeof price === 'undefined' || !artistId) {
      return res.status(400).json({ error: 'Missing required fields: title, description, price, or artistId' });
    }

    // Collect image URLs
    const imageUrls = req.files ? (req.files as Express.Multer.File[]).map(file => `/uploads/${file.filename}`) : [];

    const artwork = new Artwork({
      title,
      description,
      price,
      imageUrls,
      artistId: new Types.ObjectId(artistId),
      technik,
      shopifyProductId: shopifyProductId || '',
    });

    await artwork.save();

    // Sync with Shopify
    const shopifyProduct = await createShopifyProduct({
      title: artwork.title,
      description: artwork.description,
      price: artwork.price,
      vendor: artistId, // Assume artistId maps to vendor in Shopify for now
      category: 'Artworks', // Set a default category or adjust as needed
    });

    // Store Shopify product ID and save to database
    artwork.shopifyProductId = shopifyProduct.id;
    await artwork.save();

    // Add each image URL as media to the Shopify product
    const fullImagesUrls = [];

    for (const imageUrl of artwork.imageUrls) {
      fullImagesUrls.push(`${PUBLIC_BASE_URL}${imageUrl}`);
    }

    await addProductMedia(shopifyProduct.id, fullImagesUrls);

    await artwork.save();
    res.status(201).json(artwork);
  } catch (error: any) {
    console.error('Error creating artwork and syncing with Shopify:', error);
    res.status(400).json({ error: error.message });
  }
});

// Get all artworks of all artists
router.get('/', async (req: Request, res: Response) => {
  try {
    const artworks = await Artwork.find();
    res.json(artworks);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// Get all artworks
router.get('/artist/:artistId', async (req: Request, res: Response) => {
  try {
    const artworks = await Artwork.find({ artistId: req.params.artistId });
    res.json(artworks);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// Get artwork by id
router.get('/:id', async (req: Request, res: Response) => {
  try {
    const artwork = await Artwork.findById(req.params.id);
    res.json(artwork);
  } catch (error) {
    res.status(404).json({ error: 'Artwork not found' });
  }
});

// Update artwork
router.put('/:id', async (req: Request, res: Response) => {
  try {
    const artwork = await Artwork.findByIdAndUpdate(req.params.id, req.body, { new: true });

    // Sync updates with Shopify
    if (artwork.shopifyProductId) {
      await updateShopifyProduct(artwork.shopifyProductId, {
        title: artwork.title,
        description: artwork.description,
        price: artwork.price,
        vendor: artwork.artistId.toString(), // Example vendor, adapt as needed
      });
    }

    res.json(artwork);
  } catch (error: any) {
    console.error('Error updating artwork and syncing with Shopify:', error);
    res.status(400).json({ error: error.message });
  }
});

// Delete artwork
router.delete('/:id', async (req: any, res: any) => {
  try {
    const artwork = await Artwork.findById(req.params.id);

    if (!artwork) {
      return res.status(404).json({ error: 'Artwork not found' });
    }

    // If the artwork has a linked Shopify product, delete it from Shopify
    if (artwork.shopifyProductId) {
      try {
        const deletedProductId = await deleteShopifyProduct(artwork.shopifyProductId);
        console.log(`Deleted Shopify product with ID: ${deletedProductId}`);
      } catch (error: any) {
        console.error('Error deleting product from Shopify:', error.message);
        return res.status(500).json({ error: 'Failed to delete product from Shopify' });
      }
    }

    // Delete the artwork from the database
    await Artwork.findByIdAndDelete(req.params.id);

    res.json({ message: 'Artwork deleted' });
  } catch (error: any) {
    console.error('Error deleting artwork:', error.message);
    res.status(500).json({ error: 'Artwork not found or could not be deleted' });
  }
});

module.exports = router;
