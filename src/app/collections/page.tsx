"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { UploadCollectionForm } from "@/components/admin/upload-collection-form";
import { CollectionItem } from "@/types";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function CollectionsPage() {
  const [user, setUser] = useState<any>(null);
  const [collections, setCollections] = useState<CollectionItem[]>([]);
  const [loading, setLoading] = useState(true);
  const supabase = createClient();

  const fetchData = async () => {
    setLoading(true);
    try {
      // Get User
      const {
        data: { user: currentUser },
      } = await supabase.auth.getUser();
      setUser(currentUser);

      // Get Collections
      const { data, error } = await supabase
        .from("collections")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) {
         // Fix: Enhanced error logging and handling "table not found" noise
         console.warn("Error fetching collections (Check Supabase setup):", error.message);
      } else {
        setCollections(data as CollectionItem[]);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl md:text-4xl font-serif font-bold">
          Collections
        </h1>
        {user ? (
          <Button
            variant="outline"
            onClick={async () => {
              await supabase.auth.signOut();
              setUser(null);
            }}
          >
            Sign Out Admin
          </Button>
        ) : (
          <Button variant="ghost" asChild>
            <Link href="/auth?view=admin">Admin Login</Link>
          </Button>
        )}
      </div>

      <p className="text-gray-700 max-w-2xl mb-8">
        Discover signature collections crafted over 40 years of MAFGEMS heritage.
        Each piece tells a unique story of elegance and precision.
      </p>

      {user && (
        <div className="mb-12 border-b pb-12">
          <UploadCollectionForm onSuccess={fetchData} />
        </div>
      )}

      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {[1, 2, 3].map((i) => (
            <div key={i} className="space-y-4">
              <Skeleton className="h-64 w-full rounded-xl" />
              <Skeleton className="h-4 w-3/4" />
              <Skeleton className="h-4 w-1/2" />
            </div>
          ))}
        </div>
      ) : collections.length === 0 ? (
        <div className="text-center py-20 bg-gray-50 rounded-lg">
          <p className="text-gray-500">No collections found yet.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-16">
          {collections.map((collection) => (
            <div key={collection.id} className="group">
              <div className="grid md:grid-cols-2 gap-8 items-center">
                {/* Images Carousel */}
                <div className="w-full">
                  <Carousel className="w-full">
                    <CarouselContent>
                      {collection.image_urls && collection.image_urls.map((url, idx) => (
                        <CarouselItem key={idx}>
                          <div className="p-1">
                            <Card className="border-0 shadow-none">
                              <CardContent className="flex aspect-square items-center justify-center p-0 overflow-hidden rounded-xl bg-gray-100">
                                <img
                                  src={url}
                                  alt={`${collection.title} - ${idx + 1}`}
                                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                                />
                              </CardContent>
                            </Card>
                          </div>
                        </CarouselItem>
                      ))}
                    </CarouselContent>
                    <CarouselPrevious className="left-2" />
                    <CarouselNext className="right-2" />
                  </Carousel>
                </div>

                {/* Details */}
                <div className="space-y-4">
                  <h2 className="text-2xl font-serif font-bold text-gray-900">
                    {collection.title}
                  </h2>
                  <p className="text-gray-600 leading-relaxed">
                    {collection.description}
                  </p>
                  {collection.price > 0 && (
                    <p className="text-xl font-medium text-gray-900">
                      Starting from ${collection.price.toLocaleString()}
                    </p>
                  )}
                  <Button className="mt-4">View Full Collection</Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}