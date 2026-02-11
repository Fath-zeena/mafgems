"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Image from "next/image";
import { createClient } from "@/lib/supabase/client";
import type { Product } from "@/types";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";

export default function ProductDetailPage() {
  const params = useParams();
  const { id } = params;
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return;
    const fetchProduct = async () => {
      try {
        setLoading(true);
        const supabase = createClient();
        const { data, error } = await supabase
          .from("products")
          .select("*")
          .eq("id", id)
          .single();
      
        if (error) {
          console.error("Error fetching product:", error);
        } else {
          setProduct(data as Product);
        }
      } catch (err) {
        console.error("Error in fetchProduct:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchProduct();
  }, [id]);

  if (loading) {
    return (
      <div className="container mx-auto py-12 px-4 sm:px-6 lg:px-8">
        <div className="grid md:grid-cols-2 gap-12">
          <div>
            <Skeleton className="aspect-square w-full" />
          </div>
          <div className="space-y-4">
            <Skeleton className="h-10 w-3/4" />
            <Skeleton className="h-8 w-1/4" />
            <Skeleton className="h-24 w-full" />
            <Skeleton className="h-12 w-48" />
          </div>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="container mx-auto py-12 text-center">
        <p>Product not found.</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-12 px-4 sm:px-6 lg:px-8">
      <div className="grid md:grid-cols-2 gap-12 items-start">
        <div className="aspect-square relative w-full overflow-hidden rounded-lg">
          <Image
            src={product.image_url || "/placeholder-image.jpg"}
            alt={product.name}
            fill
            className="object-cover"
          />
        </div>
        <div className="space-y-6">
          <h1 className="text-3xl md:text-4xl font-bold tracking-tight">
            {product.name}
          </h1>
          <p className="text-3xl font-medium text-primary">
            ${product.price?.toLocaleString('en-GB') || 'Price not available'}
          </p>
          <Separator />
          <p className="text-muted-foreground text-lg">
            {product.description}
          </p>
          <Button size="lg" className="w-full md:w-auto">
            Add to Bag
          </Button>
        </div>
      </div>
    </div>
  );
}