# MuttarreHub - Manage and Sync Artworks with Shopify

MuttareHub is a web application designed to manage artwork collections and synchronize them with Shopify. This app allows users to add, edit, and delete artwork, upload images, and automatically publish them to Shopify for storefront use.

## Features
- **CRUD** (Create, Read, Update, Delete) for artworks with image upload support.
- **Shopify Sync**: Automatically create, update, and delete products in Shopify.
- **Image Uploads** with preview capability.
- **Configuration** via `.env` for secure API key and environment setup.

## Tech Stack

- **Backend**: Node.js, Express, Mongoose, Shopify API
- **Frontend**: React, TypeScript
- **Database**: MongoDB
<!-- - **Image Hosting**: Supports CDN or local server -->
- **Development Tools**: ngrok for webhook testing and API integration

---

## Getting Started

### 1. Clone the Repository

```bash
git clone <repository URL>

### 2. Install Dependencies and Run the server and client apps
```bash
# for server
cd muttare-hub/server 
npm install
npmm run dev

# for client
cd muttare-hub/client
npm install
npm run dev
```

