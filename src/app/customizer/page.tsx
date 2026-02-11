import React from 'react';
import { Box, Layers, Palette } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';

export default function CustomizerPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center gap-2 mb-6">
          <Box className="h-8 w-8 text-primary" />
          <h1 className="text-3xl font-bold tracking-tight">Gem Customiser</h1>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card>
            <CardHeader className="text-center pb-2">
              <Palette className="h-8 w-8 mx-auto text-primary mb-2" />
              <CardTitle>Select Gem</CardTitle>
              <CardDescription>Choose from our library of precious stones.</CardDescription>
            </CardHeader>
            <CardContent>
              <Button variant="secondary" className="w-full">Choose Gem</Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="text-center pb-2">
              <Layers className="h-8 w-8 mx-auto text-primary mb-2" />
              <CardTitle>Setting Style</CardTitle>
              <CardDescription>Pick the perfect metal and mount for your gem.</CardDescription>
            </CardHeader>
            <CardContent>
              <Button variant="secondary" className="w-full">Select Setting</Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="text-center pb-2">
              <Box className="h-8 w-8 mx-auto text-primary mb-2" />
              <CardTitle>Preview 3D</CardTitle>
              <CardDescription>See your custom design in full 3D detail.</CardDescription>
            </CardHeader>
            <CardContent>
              <Button variant="secondary" className="w-full">Open Viewer</Button>
            </CardContent>
          </Card>
        </div>

        <div className="aspect-video bg-muted rounded-xl border flex items-center justify-center">
          <p className="text-muted-foreground italic text-center px-4">
            3D Customiser Engine Loading... <br/>
            (Select a gem and setting to begin)
          </p>
        </div>
      </div>
    </div>
  );
}