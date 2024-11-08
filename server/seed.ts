import mongoose from 'mongoose';

const Artist = require('./models/Artist.ts');
const Artwork = require('./models/Artwork.ts');

mongoose.connect('mongodb://localhost:27017/muttarrehub', {});

mongoose.connection.once('open', async () => {
  console.log("Connected to MongoDB");

  // Test artist
  const artist = new Artist({
    name: 'Test Artist',
    email: 'test@example.com',
    passwordHash: 'hashedpassword',
    bio: 'This is a test artist',
  });

  await artist.save();

  // Test artwork
  const artwork = new Artwork({
    title: 'Test Artwork',
    description: 'Description of test artwork',
    price: 100,
    imageUrls: [
      'https://muttarre.com/cdn/shop/files/7CB6A831-5EF0-44F4-8072-FB09258950BC.jpg',
      'https://muttarre.com/cdn/shop/files/DB5B00E4-D67B-42E8-BFEF-5BFE4F63266E.jpg',
      'https://muttarre.com/cdn/shop/files/81D95CA4-D6AE-478B-9B7F-F44C0EFAB0CB.jpg'
    ],
    artistId: artist._id,
    isPublished: true,
  });

  await artwork.save();

  console.log("Seed data created successfully");
  mongoose.connection.close();
});
