const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');

const artistRoutes = require('./routes/Artists');
const artworkRoutes = require('./routes/Artworks');
const saleRoutes = require('./routes/Sales');

const app = express();
app.use(cors());
app.use(bodyParser.json());
app.use('/uploads', express.static(path.join(__dirname, './uploads')));

mongoose.connect('mongodb://localhost:27017/muttarrehub', {});

app.use('/api/artists', artistRoutes);
app.use('/api/artworks', artworkRoutes);
app.use('/api/sales', saleRoutes);

export default app;
