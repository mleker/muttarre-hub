const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');

const artistRoutes = require('./routes/artists');
const artworkRoutes = require('./routes/artworks');
const saleRoutes = require('./routes/sales');

const app = express();
app.use(bodyParser.json());

// Подключение к MongoDB
mongoose.connect('mongodb://localhost:27017/muttarrehub', {});

// Подключение маршрутов
app.use('/api/artists', artistRoutes);
app.use('/api/artworks', artworkRoutes);
app.use('/api/sales', saleRoutes);

export default app;
