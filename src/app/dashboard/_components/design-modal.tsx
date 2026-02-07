"use client";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Gem, Calendar, ExternalLink } from "lucide-react";

interface DesignModalProps {
  isOpen: boolean;
  onClose: () => void;
  design: any;
}

export function DesignDetailsModal({ isOpen, onClose, design }: DesignModalProps) {
  if (!design) return null;
  
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Gem className="h-5 w-5 text-primary" />
            Design Details
          </DialogTitle>
          <DialogDescription>
            Reference: {design.id.slice(0, 8).toUpperCase()}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Image Preview */}
          <div className="aspect-square bg-gray-100 rounded-xl overflow-hidden border shadow-inner">
             <img src={design.image_url} alt={design.gem_name} className="w-full h-full object-cover" />
          </div>

          {/* Details Grid */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1">
              <p className="text-xs text-gray-500 uppercase">Gemstone</p>
              <p className="font-medium">{design.gem_name}</p>
            </div>
             <div className="space-y-1">
              <p className="text-xs text-gray-500 uppercase">Jewelry Type</p>
              <p className="font-medium capitalize">{design.jewelry_type}</p>
            </div>
             <div className="space-y-1">
              <p className="text-xs text-gray-500 uppercase">Metal Band</p>
              <p className="font-medium capitalize">{design.metal_color.replace('_', ' ')}</p>
            </div>
             <div className="space-y-1">
              <p className="text-xs text-gray-500 uppercase">Created</p>
              <div className="flex items-center gap-1 font-medium">
                <Calendar className="h-3 w-3" />
                {new Date(design.created_at).toLocaleDateString('en-GB')}
              </div>
            </div>
          </div>

           {/* Description */}
           <div className="space-y-2 pt-4 border-t">
              <h4 className="text-sm font-semibold">Prompt Description</h4>
              <p className="text-sm text-gray-600 italic">"{design.description}"</p>
           </div>

          <div className="flex justify-end gap-2 pt-4">
             <Button variant="outline" asChild>
                <a href={design.image_url} target="_blank" rel="noopener noreferrer">
                  <ExternalLink className="h-4 w-4 mr-2" />
                  Full Size
                </a>
             </Button>
             <Button>Enquire Piece</Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}