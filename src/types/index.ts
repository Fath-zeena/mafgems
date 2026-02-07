export interface Gem {
  id: number;
  sku?: string;
  name: string;
  description?: string;
  color?: string;
  image_url?: string;
  image_urls?: string[];
  model3d_url?: string;
  video_urls?: string[];
  price?: number;
  metal?: string;
  carat?: string | number;
  cut?: string;
  clarity?: string;
  origin?: string;
  availability?: "in_stock" | "made_to_order" | "out_of_stock";
  variants?: Array<{ id: string; sku?: string; price?: number }>;
  seo?: { title?: string; description?: string };
}

export interface Product {
  id: string;
  sku?: string;
  name: string;
  description?: string;
  price?: number;
  image_url?: string;
  image_urls?: string[];
  metadata?: Record<string, any>;
}

export interface CollectionItem {
  id: string;
  created_at: string;
  title: string;
  description?: string;
  price?: number;
  image_urls?: string[];
  hero_image?: string;
}