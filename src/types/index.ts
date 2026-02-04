export interface Gem {
  id: number;
  name: string;
  image_url: string;
  color: string;
}

export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  image_url: string;
}

export interface CollectionItem {
  id: string;
  created_at: string;
  title: string;
  description: string;
  price: number;
  image_urls: string[];
}