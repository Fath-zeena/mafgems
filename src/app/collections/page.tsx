"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { createClient } from "@/lib/supabase/client";
import type { Product } from "@/types";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

export default function CollectionsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const supabase = createClient();

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      const { data, error } = await supabase.from("products").select("*");
      if (error) {
        console.error("Error fetching products:", error);
      } else {
        setProducts(data as Product[]);
      }
      setLoading(false);
    };
    fetchProducts();
  }, []);

  return (
    <div className="container mx-auto py-12 px-4 sm:px-6 lg:px-8">
      <h1 className="text-3xl md:text-4xl font-bold tracking-tight text-center mb-10">
        Our Collections
      </h1>
      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
          {Array.from({ length: 4 }).map((_, index) => (
            <Card key={index}>
              <CardHeader>
                <Skeleton className="aspect-square w-full" />
              </CardHeader>
              <CardContent>
                <Skeleton className="h-6 w-3/4" />
              </CardContent>
              <CardFooter>
                <Skeleton className="h-6 w-1/4" />
              </CardFooter>
            </Card>
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
          {products.map((product) => (
            <Link href={`/collections/${product.id}`} key={product.id}>
              <Card className="overflow-hidden hover:shadow-lg transition-shadow duration-300 h-full flex flex-col">
                <CardHeader className="p-0">
                  <div className="aspect-square relative w-full">
                    <Image
                      src={product.image_url}
                      alt={product.name}
                      fill
                      className="object-cover"
                    />
                  </div>
                </CardHeader>
                <div className="p-4 flex-grow flex flex-col">
                  <CardTitle className="text-lg font-semibold mb-2">{product.name}</CardTitle>
                  <div className="flex-grow" />
                  <CardFooter className="p-0 pt-4">
                    <p className="text-lg font-medium text-primary">
                      ${product.price.toLocaleString()}
                    </p>
                  </CardFooter>
                </div>
              </Card>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}