const dotenv = require('dotenv');
const fetch = require('node-fetch');

dotenv.config();
const SHOPIFY_ACCESS_TOKEN = process.env.SHOPIFY_ACCESS_TOKEN;
const SHOPIFY_STORE_NAME = process.env.SHOPIFY_STORE_NAME;
const SHOPIFY_GRAPHQL_URL = `https://${SHOPIFY_STORE_NAME}.myshopify.com/admin/api/2024-01/graphql.json`;

// Helper function to perform GraphQL requests
async function shopifyRequest(query, variables) {
  try {
    const response = await fetch(SHOPIFY_GRAPHQL_URL, {
      method: 'POST',
      headers: {
        'X-Shopify-Access-Token': SHOPIFY_ACCESS_TOKEN,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ query, variables }),
    });
    const data = await response.json();

    if (data.errors) {
      console.error('Shopify API errors:', data.errors);
      throw new Error('Error returned by Shopify API');
    }

    return data.data;
  } catch (error) {
    console.error('Error in Shopify request:', error.message);
    throw error;
  }
}

// Function to create a product in Shopify with Category as productType
async function createShopifyProduct({ title, description, price, vendor, category }) {
  const query = `
    mutation createProduct($input: ProductInput!) {
      productCreate(input: $input) {
        product {
          id
          title
          vendor
          productType
          descriptionHtml
          variants(first: 1) {
            edges {
              node {
                id
                price
              }
            }
          }
        }
        userErrors {
          field
          message
        }
      }
    }
  `;

  const variables = {
    input: {
      title,
      descriptionHtml: description,
      vendor,
      productType: category,
      variants: [{ price }],
    },
  };

  const data = await shopifyRequest(query, variables);

  if (data.productCreate.userErrors && data.productCreate.userErrors.length > 0) {
    console.error('Shopify API user errors:', data.productCreate.userErrors);
    throw new Error('Error creating product in Shopify');
  }

  return data.productCreate.product;
}

// Function to add images to a product
async function addProductMedia(productId, imageUrls) {
  if (!Array.isArray(imageUrls)) {
    throw new TypeError("Expected imageUrls to be an array");
  }

  const query = `
    mutation productAppendImages($input: ProductAppendImagesInput!) {
      productAppendImages(input: $input) {
        newImages {
          id
          altText
        }
        product {
          id
        }
        userErrors {
          field
          message
        }
      }
    }
  `;

  console.log('----------', imageUrls);
  const variables = {
    input: {
      id: productId,
      images: imageUrls.map(url => ({
        src: url,
        altText: "Artwork image"  // Optional: Customize this based on the product
      })),
    },
  };

  const data = await shopifyRequest(query, variables);

  console.log("Full Shopify response:", JSON.stringify(data, null, 2));
  if (data.productAppendImages.userErrors && data.productAppendImages.userErrors.length > 0) {
    console.error('Shopify API user errors:', data.productAppendImages.userErrors);
    throw new Error('Error appending images to product');
  }

  return data.productAppendImages.newImages;
}

async function updateShopifyProduct(shopifyProductId, artwork) {
  const query = `
    mutation updateProduct($id: ID!, $input: ProductInput!) {
      productUpdate(id: $id, input: $input) {
        product {
          id
          title
          descriptionHtml
          vendor
          variants(first: 1) {
            edges {
              node {
                id
                price
                inventoryManagement
              }
            }
          }
        }
        userErrors {
          field
          message
        }
      }
    }
  `;

  const variables = {
    id: shopifyProductId,
    input: {
      title: artwork.title,
      descriptionHtml: artwork.description,
      vendor: artwork.artistId, // or artist name if available
      variants: [{ price: artwork.price.toString() }],
      tags: [artwork.category]  // Add category as a tag if needed
    }
  };

  try {
    const response = await fetch(SHOPIFY_GRAPHQL_URL, {
      method: 'POST',
      headers: {
        'X-Shopify-Access-Token': SHOPIFY_ACCESS_TOKEN,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ query, variables }),
    });

    const responseData = await response.json();
    if (responseData.errors) {
      console.error("Shopify API errors:", responseData.errors);
      throw new Error("Error returned by Shopify API");
    }
    
    const { product, userErrors } = responseData.data.productUpdate;

    if (userErrors && userErrors.length > 0) {
      throw new Error(userErrors[0].message);
    }
    return product;
  } catch (error) {
    console.error('Error updating product in Shopify:', error.message);
    throw new Error('Failed to update product in Shopify');
  }
}

async function deleteShopifyProduct(shopifyProductId) {
  const query = `
    mutation deleteProduct($id: ID!) {
      productDelete(input: { id: $id }) {
        deletedProductId
        userErrors {
          field
          message
        }
      }
    }
  `;

  const variables = {
    id: shopifyProductId,
  };

  try {
    const response = await fetch(SHOPIFY_GRAPHQL_URL, {
      method: 'POST',
      headers: {
        'X-Shopify-Access-Token': SHOPIFY_ACCESS_TOKEN,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ query, variables }),
    });

    const responseData = await response.json();
    const { userErrors } = responseData.data.productDelete;

    if (userErrors && userErrors.length > 0) {
      throw new Error(userErrors[0].message);
    }

    return responseData.data.productDelete.deletedProductId;
  } catch (error) {
    console.error('Error deleting product in Shopify:', error.message);
    throw new Error('Failed to delete product in Shopify');
  }
}

module.exports = { createShopifyProduct, updateShopifyProduct, addProductMedia, deleteShopifyProduct };
