"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Gem, Package, Clock, LogOut, Eye, ArrowRight } from "lucide-react";
import { DesignDetailsModal } from "./_components/design-modal";
import Link from "next/link";

export default function DashboardPage() {
  const router = useRouter();
  const supabase = createClient();
  const [user, setUser] = useState<any>(null);
  const [isDesignModalOpen, setIsDesignModalOpen] = useState(false);

  useEffect(() => {
    const getUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        router.push("/auth");
        return;
      }
      setUser(user);
    };
    getUser();
  }, [router, supabase]);

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    router.push("/auth");
  };

  if (!user) return null;

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
            <div className="text-2xl font-bold">0</div>
            <p className="text-xs text-muted-foreground">Custom rings pending review</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pre-bookings</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">0</div>
            <p className="text-xs text-muted-foreground">Appear in upcoming drops</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Orders</CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">0</div>
            <p className="text-xs text-muted-foreground">Active shipments</p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="designs" className="space-y-4">
        <TabsList>
          <TabsTrigger value="designs">My Designs</TabsTrigger>
          <TabsTrigger value="bookings">Pre-bookings</TabsTrigger>
          <TabsTrigger value="orders">Order History</TabsTrigger>
        </TabsList>
        <TabsContent value="designs" className="space-y-4">
          <Card>
            <CardHeader>
               <CardTitle>Saved Customizer Designs</CardTitle>
            </CardHeader>
            <CardContent>
              {/* Mock List Item */}
              <div className="border rounded-lg p-4 flex items-center justify-between hover:bg-gray-50 transition-colors mb-4">
                <div className="flex items-center gap-4">
                  <div className="h-12 w-12 bg-blue-100 rounded-lg flex items-center justify-center">
                    <Gem className="h-6 w-6 text-blue-600" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900">Custom Sapphire Ring</h4>
                    <p className="text-sm text-gray-500">Last edited: Today</p>
                  </div>
                </div>
                <Button variant="ghost" size="sm" onClick={() => setIsDesignModalOpen(true)}>
                  View Details <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </div>

               <div className="flex flex-col items-center justify-center py-8 text-center text-gray-500 bg-gray-50 rounded-lg border-dashed border-2">
                <p className="mb-4">Create another unique piece</p>
                <Button onClick={() => router.push('/customizer')}>Go to Customizer</Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        {/* ... other tabs ... */}
        
        <DesignDetailsModal 
          isOpen={isDesignModalOpen} 
          onClose={() => setIsDesignModalOpen(false)} 
        />
      </Tabs>
        <TabsContent value="bookings">
          <Card>
            <CardHeader>
               <CardTitle>Pre-booked Items</CardTitle>
            </CardHeader>
            <CardContent>
               {/* Mock Item */}
               <div className="border rounded-lg p-4 flex items-center justify-between mb-4">
                   <div className="flex items-center gap-4">
                      <div className="h-12 w-12 bg-amber-100 rounded-lg flex items-center justify-center">
                        <Clock className="h-6 w-6 text-amber-600" />
                      </div>
                       <div>
                         <h4 className="font-semibold text-gray-900">Royal Summer Collection Preview</h4>
                         <p className="text-sm text-gray-500">Status: Waitlist Confirmed</p>
                       </div>
                   </div>
                   <Button variant="outline" size="sm">Check Status</Button>
               </div>
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
    </div>
  );
}
