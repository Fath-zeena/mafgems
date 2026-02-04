"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";
import { Loader2, Plus, X, Upload } from "lucide-react";
import Image from "next/image";

export function UploadCollectionForm({ onSuccess }: { onSuccess: () => void }) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [files, setFiles] = useState<File[]>([]);
  const [uploading, setUploading] = useState(false);
  const supabase = createClient();

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const newFiles = Array.from(e.target.files);
      setFiles((prev) => [...prev, ...newFiles]);
    }
  };

  const removeFile = (index: number) => {
    setFiles((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || files.length === 0) {
      toast.error("Please provide a title and at least one image.");
      return;
    }

    setUploading(true);
    try {
      const imageUrls: string[] = [];

      // Upload each file
      for (const file of files) {
        const fileExt = file.name.split(".").pop();
        const fileName = `${Math.random()}.${fileExt}`;
        const filePath = `${fileName}`;

        const { error: uploadError } = await supabase.storage
          .from("collections")
          .upload(filePath, file);

        if (uploadError) throw uploadError;

        const { data: publicUrlData } = supabase.storage
          .from("collections")
          .getPublicUrl(filePath);

        imageUrls.push(publicUrlData.publicUrl);
      }

      // Insert into database
      const { error: dbError } = await supabase.from("collections").insert({
        title,
        description,
        price: parseFloat(price) || 0,
        image_urls: imageUrls,
      });

      if (dbError) throw dbError;

      toast.success("Collection uploaded successfully!");
      setTitle("");
      setDescription("");
      setPrice("");
      setFiles([]);
      onSuccess();
    } catch (error: any) {
      console.error(error);
      toast.error(error.message || "Failed to upload collection");
    } finally {
      setUploading(false);
    }
  };

  return (
    <Card className="mb-8">
      <CardHeader>
        <CardTitle>Add New Collection</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="title">Collection Title</Label>
              <Input
                id="title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Ex: Royal Sapphire Set"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="price">Base Price (Optional)</Label>
              <Input
                id="price"
                type="number"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                placeholder="0.00"
              />
            </div>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Tell the story of this collection..."
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="images">Images</Label>
            <div className="flex items-center gap-4">
              <Input
                id="images"
                type="file"
                multiple
                accept="image/*"
                onChange={handleFileChange}
                className="hidden"
              />
              <Button
                type="button"
                variant="outline"
                onClick={() => document.getElementById("images")?.click()}
              >
                <Upload className="mr-2 h-4 w-4" />
                Select Images
              </Button>
              <span className="text-sm text-gray-500">
                {files.length} file(s) selected
              </span>
            </div>

            {files.length > 0 && (
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4">
                {files.map((file, idx) => (
                  <div key={idx} className="relative group aspect-square bg-gray-100 rounded-md overflow-hidden">
                    <img
                      src={URL.createObjectURL(file)}
                      alt="preview"
                      className="object-cover w-full h-full"
                    />
                    <button
                      type="button"
                      onClick={() => removeFile(idx)}
                      className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          <Button type="submit" disabled={uploading}>
            {uploading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Uploading...
              </>
            ) : (
              <>
                <Plus className="mr-2 h-4 w-4" />
                Create Collection
              </>
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
