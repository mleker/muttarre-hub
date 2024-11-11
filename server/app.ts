const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');

const artistRoutes = require('./routes/artists');
const artworkRoutes = require('./routes/artworks');
const saleRoutes = require('./routes/sales');

const app = express();
app.use(cors());
app.use(bodyParser.json());

mongoose.connect('mongodb://localhost:27017/muttarrehub', {});

app.use('/api/artists', artistRoutes);
app.use('/api/artworks', artworkRoutes);
app.use('/api/sales', saleRoutes);

export default app;
