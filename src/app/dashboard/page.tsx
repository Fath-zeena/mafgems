"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Gem, Package, Clock, LogOut, ArrowRight, Loader2 } from "lucide-react";
import { DesignDetailsModal } from "./_components/design-modal";

interface UserDesign {
  id: string;
  gem_name: string;
  metal_color: string;
  jewelry_type: string;
  image_url: string;
  created_at: string;
  description: string;
}

export default function DashboardPage() {
  const router = useRouter();
  const supabase = createClient();
  const [user, setUser] = useState<any>(null);
  const [designs, setDesigns] = useState<UserDesign[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedDesign, setSelectedDesign] = useState<UserDesign | null>(null);

  const fetchDashboardData = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      router.push("/auth");
      return;
    }
    setUser(user);

    // Fetch user designs
    const { data, error } = await supabase
      .from("user_designs")
      .select("*")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false });

    if (!error && data) {
      setDesigns(data);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchDashboardData();
  }, [router]);

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    router.push("/auth");
  };

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-serif font-bold">Client Dashboard</h1>
          <p className="text-gray-600">Welcome back, {user.email}</p>
        </div>
        <Button variant="outline" onClick={handleSignOut}>
          <LogOut className="mr-2 h-4 w-4" />
          Sign Out
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Saved Designs</CardTitle>
            <Gem className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{designs.length}</div>
            <p className="text-xs text-muted-foreground">Custom pieces in your history</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pre-bookings</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">0</div>
            <p className="text-xs text-muted-foreground">Active waitlist spots</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Orders</CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">0</div>
            <p className="text-xs text-muted-foreground">Completed purchases</p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="designs" className="space-y-4">
        <TabsList>
          <TabsTrigger value="designs">My Design History</TabsTrigger>
          <TabsTrigger value="bookings">Pre-bookings</TabsTrigger>
          <TabsTrigger value="orders">Order History</TabsTrigger>
        </TabsList>
        <TabsContent value="designs" className="space-y-4">
          <Card>
            <CardHeader>
               <CardTitle>AI Generated Presentations</CardTitle>
            </CardHeader>
            <CardContent>
              {designs.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-12 text-center text-gray-500 bg-gray-50 rounded-lg border-dashed border-2">
                  <p className="mb-4">No designs saved yet.</p>
                  <Button onClick={() => router.push('/customizer')}>Go to Customiser</Button>
                </div>
              ) : (
                <div className="space-y-4">
                  {designs.map((design) => (
                    <div key={design.id} className="border rounded-lg p-4 flex items-center justify-between hover:bg-gray-50 transition-colors">
                      <div className="flex items-center gap-4">
                        <div className="h-16 w-16 bg-gray-100 rounded-lg overflow-hidden border">
                          <img src={design.image_url} alt={design.gem_name} className="w-full h-full object-cover" />
                        </div>
                        <div>
                          <h4 className="font-semibold text-gray-900 capitalize">{design.gem_name} {design.jewelry_type}</h4>
                          <p className="text-xs text-gray-500">Metal: {design.metal_color.replace('_', ' ')}</p>
                          <p className="text-xs text-gray-500">Saved: {new Date(design.created_at).toLocaleDateString('en-GB')}</p>
                        </div>
                      </div>
                      <Button variant="ghost" size="sm" onClick={() => setSelectedDesign(design)}>
                        View Details <ArrowRight className="ml-2 h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                  <div className="flex justify-center pt-4">
                    <Button variant="outline" onClick={() => router.push('/customizer')}>Create New Design</Button>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="bookings">
          <Card>
            <CardHeader>
               <CardTitle>Pre-booked Items</CardTitle>
            </CardHeader>
            <CardContent>
               <div className="text-center py-12 text-gray-500">No active pre-bookings.</div>
            </CardContent>
          </Card>
        </TabsContent>
         <TabsContent value="orders">
          <Card>
            <CardHeader>
               <CardTitle>Order History</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center py-12 text-gray-500">No past orders.</div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {selectedDesign && (
        <DesignDetailsModal 
          isOpen={!!selectedDesign} 
          onClose={() => setSelectedDesign(null)}
          design={selectedDesign}
        />
      )}
    </div>
  );
}