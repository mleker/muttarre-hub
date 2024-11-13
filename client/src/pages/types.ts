export interface Artwork {
  _id: string;
  title: string;
  description: string;
  imageUrls: string[];
  price: number,
  height: number,
  width: number,
  depth: number,
  technik: string,
  artistId: string,
  isPublished: boolean,
  shopifyProductId: string,
}

export interface Artist {
  _id: string;
  name: string;
  email: string;
  bio: string,
}