import React from 'react';
import { Sparkles, Play, History } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';

export default function PresentationPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center gap-2 mb-6">
          <Sparkles className="h-8 w-8 text-primary" />
          <h1 className="text-3xl font-bold tracking-tight">AI Jewelry Presentation</h1>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <Card className="cursor-pointer hover:border-primary transition-colors">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Play className="h-5 w-5" />
                New Generation
              </CardTitle>
              <CardDescription>
                Create a stunning 3D video presentation for your jewelry designs.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button className="w-full">Start Creating</Button>
            </CardContent>
          </Card>

          <Card className="cursor-pointer hover:border-primary transition-colors">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <History className="h-5 w-5" />
                Recent Projects
              </CardTitle>
              <CardDescription>
                View and manage your previously generated presentations.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button variant="outline" className="w-full">View History</Button>
            </CardContent>
          </Card>
        </div>

        <div className="bg-muted p-8 rounded-lg border text-center">
          <p className="text-muted-foreground">Select an option above to begin your AI-powered jewelry experience.</p>
        </div>
      </div>
    </div>
  );
}