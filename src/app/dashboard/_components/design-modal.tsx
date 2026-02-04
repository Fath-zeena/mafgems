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
import { Gem, Clock, CheckCircle2 } from "lucide-react";

interface DesignModalProps {
  isOpen: boolean;
  onClose: () => void;
  design: any; // Using any for mock data, replace with type later
}

// Mock Data for demonstration
const mockDesign = {
  id: "DSN-2026-001",
  gem: "Royal Blue Sapphire",
  metal: "Platinum",
  shape: "Oval Cut",
  status: "In Review",
  createdAt: "2026-02-04",
  specs: {
    carat: "2.5",
    clarity: "VS1",
    origin: "Ceylon"
  }
};

export function DesignDetailsModal({ isOpen, onClose }: DesignModalProps) {
  // In a real app, 'design' prop would determine content. Using mock for now.
  
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Gem className="h-5 w-5 text-primary" />
            Custom Ring Design
          </DialogTitle>
          <DialogDescription>
            Reference: {mockDesign.id}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Status Badge */}
          <div className="flex items-center justify-between p-4 bg-muted/50 rounded-lg">
            <span className="text-sm font-medium text-gray-500">Current Status</span>
            <Badge variant="secondary" className="bg-blue-100 text-blue-700 hover:bg-blue-100">
              <Clock className="w-3 h-3 mr-1" />
              {mockDesign.status}
            </Badge>
          </div>

          {/* Details Grid */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1">
              <p className="text-xs text-gray-500 uppercase">Gemstone</p>
              <p className="font-medium">{mockDesign.gem}</p>
            </div>
             <div className="space-y-1">
              <p className="text-xs text-gray-500 uppercase">Cut / Shape</p>
              <p className="font-medium">{mockDesign.shape}</p>
            </div>
             <div className="space-y-1">
              <p className="text-xs text-gray-500 uppercase">Metal Band</p>
              <p className="font-medium">{mockDesign.metal}</p>
            </div>
             <div className="space-y-1">
              <p className="text-xs text-gray-500 uppercase">Created</p>
              <p className="font-medium">{mockDesign.createdAt}</p>
            </div>
          </div>

           {/* Tech Specs */}
           <div className="space-y-3 pt-4 border-t">
              <h4 className="text-sm font-semibold">Technical Specifications</h4>
              <div className="grid grid-cols-3 gap-2 text-sm">
                 <div className="p-2 bg-gray-50 rounded text-center">
                    <div className="text-gray-500 text-xs">Carat</div>
                    <div className="font-medium">{mockDesign.specs.carat}</div>
                 </div>
                 <div className="p-2 bg-gray-50 rounded text-center">
                    <div className="text-gray-500 text-xs">Clarity</div>
                    <div className="font-medium">{mockDesign.specs.clarity}</div>
                 </div>
                 <div className="p-2 bg-gray-50 rounded text-center">
                    <div className="text-gray-500 text-xs">Origin</div>
                    <div className="font-medium">{mockDesign.specs.origin}</div>
                 </div>
              </div>
           </div>

          <div className="flex justify-end gap-2 pt-4">
             <Button variant="outline" onClick={onClose}>Close</Button>
             <Button>Contact Jeweler</Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
