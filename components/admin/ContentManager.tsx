"use client";

import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { supabase } from "@/lib/supabase";
import { toast } from "sonner";
import { Loader2, Image as ImageIcon, Trash2 } from "lucide-react";

interface ProcessedImage {
  id: string;
  originalUrl: string;
  processedUrl: string;
  userId: string;
  status: string;
  created_at: string;
}

export default function ContentManager() {
  const [images, setImages] = useState<ProcessedImage[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    fetchImages();
  }, []);

  const fetchImages = async () => {
    const { data, error } = await supabase
      .from('images')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      toast.error('Failed to fetch images');
      return;
    }

    setImages(data || []);
    setIsLoading(false);
  };

  const deleteImage = async (id: string) => {
    const { error } = await supabase
      .from('images')
      .delete()
      .eq('id', id);

    if (error) {
      toast.error('Failed to delete image');
      return;
    }

    toast.success('Image deleted successfully');
    fetchImages();
  };

  const filteredImages = images.filter(image => 
    image.id.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Content Management</h2>
        <div className="w-1/3">
          <Input
            placeholder="Search images..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {filteredImages.map((image) => (
          <Card key={image.id} className="p-4">
            <div className="relative aspect-square mb-4">
              {image.processedUrl ? (
                <img
                  src={image.processedUrl}
                  alt="Processed"
                  className="w-full h-full object-cover rounded-lg"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center bg-gray-100 rounded-lg">
                  <ImageIcon className="h-12 w-12 text-gray-400" />
                </div>
              )}
            </div>
            <div className="flex justify-between items-center">
              <div>
                <p className="text-sm font-medium">ID: {image.id}</p>
                <p className="text-sm text-gray-500">
                  {new Date(image.created_at).toLocaleDateString()}
                </p>
              </div>
              <Button
                variant="destructive"
                size="icon"
                onClick={() => deleteImage(image.id)}
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}