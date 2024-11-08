import express, { Request, Response } from 'express';
const Artist = require('../models/Artist');
const router = express.Router();

// Artist registration
router.post('/register', async (req: Request, res: Response) => {
  try {
    const artist = new Artist(req.body);
    await artist.save();
    res.status(201).json(artist);
  } catch (error) {
    res.status(400).json({ error: (error as Error).message });
  }
});

// Artist data retrieval
router.get('/:id', async (req: Request, res: Response) => {
  try {
    const artist = await Artist.findById(req.params.id);
    res.json(artist);
  } catch (error) {
    res.status(404).json({ error: 'Artist not found' });
  }
});

module.exports = router;
