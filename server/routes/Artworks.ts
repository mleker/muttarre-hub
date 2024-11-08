import { Request, Response, Router } from 'express';
const Artwork = require('../models/Artwork');
const router = Router();

// Create a new artwork
router.post('/', async (req: Request, res: Response) => {
  try {
    const artwork = new Artwork(req.body);
    await artwork.save();
    res.status(201).json(artwork);
  } catch (error: any) {
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
    res.json(artwork);
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
});

// Delete artwork
router.delete('/:id', async (req: Request, res: Response) => {
  try {
    await Artwork.findByIdAndDelete(req.params.id);
    res.json({ message: 'Artwork deleted' });
  } catch (error) {
    res.status(404).json({ error: 'Artwork not found' });
  }
});

module.exports = router;
