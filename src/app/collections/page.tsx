"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { UploadCollectionForm } from "@/components/admin/upload-collection-form";
import { JewelryVideoGenerator } from "@/components/admin/jewelry-video-generator";
import { CollectionItem } from "@/types";
import { Skeleton } from "@/components/ui/skeleton";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
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
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Plus, Video } from "lucide-react";

export default function CollectionsPage() {
  const [user, setUser] = useState<any>(null);
  const [collections, setCollections] = useState<CollectionItem[]>([]);
  const [filteredCollections, setFilteredCollections] = useState<CollectionItem[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [minPrice, setMinPrice] = useState<number | undefined>(undefined);
  const [maxPrice, setMaxPrice] = useState<number | undefined>(undefined);
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("collections");
  const [sort, setSort] = useState<"newest"|"price_asc"|"price_desc">("newest");
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

  useEffect(() => {
    let data = collections.slice();
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      data = data.filter((c) => (c.title || "").toLowerCase().includes(q) || (c.description || "").toLowerCase().includes(q));
    }
    if (minPrice !== undefined) data = data.filter((c) => (c.price || 0) >= minPrice);
    if (maxPrice !== undefined) data = data.filter((c) => (c.price || 0) <= maxPrice);
    // Sorting
    if (sort === "newest") data = data.sort((a, b) => (new Date(b.created_at).getTime() - new Date(a.created_at).getTime()));
    if (sort === "price_asc") data = data.sort((a, b) => ((a.price || 0) - (b.price || 0)));
    if (sort === "price_desc") data = data.sort((a, b) => ((b.price || 0) - (a.price || 0)));
    setFilteredCollections(data);
  }, [collections, searchQuery, minPrice, maxPrice]);

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

      <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-6">
        <div className="w-full md:w-1/2 mb-4 md:mb-0 order-first">
          <div className="flex flex-col gap-3">
            <label className="sr-only">Search collections</label>
            <input
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search collections, designers or descriptions"
              className="border rounded px-3 py-3 w-full text-sm"
            />

            <div className="flex gap-3 mt-2">
              <input
                type="number"
                placeholder="Min"
                className="w-1/2 border rounded px-2 py-2"
                onChange={(e) => setMinPrice(e.target.value ? Number(e.target.value) : undefined)}
              />
              <input
                type="number"
                placeholder="Max"
                className="w-1/2 border rounded px-2 py-2"
                onChange={(e) => setMaxPrice(e.target.value ? Number(e.target.value) : undefined)}
              />
            </div>
          </div>
        </div>

        <div className="w-full md:w-1/2 md:flex md:justify-end">
          <div className="flex items-center gap-4">
            <p className="text-gray-700 max-w-2xl hidden md:block">
              Discover signature collections crafted over 40 years of MAFGEMS heritage.
            </p>
            <select
              value={sort}
              onChange={(e) => setSort(e.target.value as any)}
              className="border rounded px-3 py-2 text-sm"
            >
              <option value="newest">Newest</option>
              <option value="price_asc">Price: Low to High</option>
              <option value="price_desc">Price: High to Low</option>
            </select>
          </div>
        </div>
      </div>

      {user && (
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full max-w-md grid-cols-2 mb-8">
            <TabsTrigger value="collections" className="gap-2">
              <Plus className="h-4 w-4" />
              Collections
            </TabsTrigger>
            <TabsTrigger value="videos" className="gap-2">
              <Video className="h-4 w-4" />
              Videos
            </TabsTrigger>
          </TabsList>

          <TabsContent value="collections" className="space-y-4">
            <div className="mb-8 flex justify-end">
              <Dialog open={open} onOpenChange={setOpen}>
                <DialogTrigger asChild>
                  <Button className="gap-2">
                    <Plus className="h-4 w-4" />
                    Add New Collection
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                  <DialogHeader>
                    <DialogTitle>Add New Collection</DialogTitle>
                    <DialogDescription>
                      Upload a new collection of jewellery items.
                    </DialogDescription>
                  </DialogHeader>
                  <UploadCollectionForm onSuccess={fetchData} setOpen={setOpen} />
                </DialogContent>
              </Dialog>
            </div>

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
                {(filteredCollections.length ? filteredCollections : collections).map((collection) => (
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
                            Starting from ${collection.price.toLocaleString('en-GB')}
                          </p>
                        )}
                        <Button className="mt-4">View Full Collection</Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </TabsContent>

          <TabsContent value="videos" className="space-y-4">
            <JewelryVideoGenerator />
          </TabsContent>
        </Tabs>
      )}

      {!user && (
        <>
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
              <p className="text-gray-500">No collections available.</p>
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
                          Starting from ${collection.price.toLocaleString('en-GB')}
                        </p>
                      )}
                      <Button className="mt-4">View Full Collection</Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </>
      )}
    </div>
  );
}