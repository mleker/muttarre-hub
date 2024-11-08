import { Request, Response, Router } from 'express';
const Sale = require('../models/Sale');
const router = Router();

router.get('/artist/:artistId', async (req: Request, res: Response) => {
  try {
    const sales = await Sale.find({ artistId: req.params.artistId });
    res.json(sales);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
