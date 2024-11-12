import dotenv from 'dotenv';
import mongoose from 'mongoose';

dotenv.config();
// TODO: not working yet, need to fix

const SHOPIFY_ACCESS_TOKEN = process.env.SHOPIFY_ACCESS_TOKEN;
const SHOPIFY_STORE_NAME = process.env.SHOPIFY_STORE_NAME;

if (!SHOPIFY_ACCESS_TOKEN || !SHOPIFY_STORE_NAME) {
  throw new Error('Missing Shopify environment variables');
}

// Dynamic import for node-fetch, compatible with ES modules
const fetch = (url: string, options?: any) =>
  import('node-fetch').then(({ default: fetch }) => fetch(url, options));

// Function to fetch products using Shopify GraphQL Admin API
const fetchProducts = async () => {
  const url = `https://${SHOPIFY_STORE_NAME}.myshopify.com/admin/api/2024-10/graphql.json`;
  console.log("Requesting Shopify GraphQL API:", url);

  // Define GraphQL query for retrieving the first 10 products
  const query = `
    query GetAllProducts {
      products(first: 10) {
        edges {
          node {
            id
            title
            handle
            description
            createdAt
          }
        }
        pageInfo {
          hasNextPage
        }
      }
    }
  `;

  // Define fetch options
  const options = {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'X-Shopify-Access-Token': SHOPIFY_ACCESS_TOKEN,
    },
    body: JSON.stringify({ query }),
  };

  // Perform the fetch request to Shopify GraphQL API
  const response = await fetch(url, options);

  // Check if the response is successful
  if (!response.ok) {
    const errorText = await response.text();
    console.error(`Error when requesting Shopify API: ${response.statusText}`, errorText);
    throw new Error(`Error when requesting Shopify API: ${response.statusText}`);
  }

  // Parse response data
  const data = await response.json();

  // Map products data to match your existing data structure
  const products = data.data.products.edges.map((edge: any) => ({
    id: edge.node.id,
    title: edge.node.title,
    description: edge.node.description,
    createdAt: edge.node.createdAt,
    handle: edge.node.handle
  }));

  return products;
};

// Connect to MongoDB
mongoose.connect('mongodb://localhost:27017/muttarrehub');

const Artwork = require('../models/Artwork'); // Ensure the path to your model is correct

// Function to save products to MongoDB
const saveProductsToDatabase = async () => {
  try {
    const products = await fetchProducts();

    for (const product of products) {
      const artwork = new Artwork({
        title: product.title,
        description: product.description,
        shopifyProductId: product.id,
        createdAt: new Date(product.createdAt),
        handle: product.handle,
      });

      await artwork.save();
      console.log(`Artwork saved: ${artwork.title}`);
    }
  } catch (error) {
    console.error('Error saving data:', error);
  } finally {
    // Close the MongoDB connection
    await mongoose.connection.close();
    console.log('Mongoose connection closed.');
  }
};

// Execute the function to fetch and save products
saveProductsToDatabase();
