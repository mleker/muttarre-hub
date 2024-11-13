const { createShopifyProduct, addProductMedia } = require('../shopify/shopifyService');

async function main() {
  try {
    // Create the product with category mapped to productType
    const product = await createShopifyProduct({
      title: "Sample Artwork",
      description: "A beautiful artwork description.",
      price: "150.00",
      vendor: "John Doe",  // Author
      category: "Artwork"  // Will appear as "Category" in Shopify Admin
    });

    console.log('Product created:', product);

    // Add images to the product
    const imageUrls = [
      'https://img.welt.de/img/vermischtes/mobile177804966/2776589647-ci23x11-w1800/XXXTentacion-killed.jpg'
    ];
    const images = await addProductMedia(product.id, imageUrls);
    console.log('Images added to product:', images);
  } catch (error) {
    console.error('Error in product creation sequence:', error.message);
  }
}

main();
