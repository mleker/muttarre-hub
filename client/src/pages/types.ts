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
  createdAt: Date,
}