"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";
import { AdminAuthForm } from "./_components/admin-auth-form";
import { CustomerAuthForm } from "./_components/customer-auth-form";

import { useSearchParams } from "next/navigation";
import { Suspense } from "react";

function AuthContent() {
  const router = useRouter();
  const supabase = createClient();
  const [loading, setLoading] = useState(true);
  const searchParams = useSearchParams();
  const defaultTab = searchParams?.get("view") === "admin" ? "admin" : "customer";

  useEffect(() => {
    const checkUser = async () => {
      const { data } = await supabase.auth.getUser();
      if (data.user) {
        // Redirect based on role
        const role = data.user.user_metadata.role;
        if (role === 'admin') {
          router.push("/collections");
        } else {
          router.push("/dashboard");
        }
      } else {
        setLoading(false);
      }
    };
    checkUser();
  }, [router, supabase]);

  if (loading) {
    return (
      <div className="flex h-screen w-full items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="flex min-h-screen w-full items-center justify-center px-4 py-12 bg-gray-50/50">
      <div className="w-full max-w-md space-y-6">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-serif font-bold text-gray-900">Welcome Back</h1>
          <p className="text-gray-500 mt-2">Access your account to manage designs or collections</p>
        </div>

        <Tabs defaultValue={defaultTab} className="w-full">
          <TabsList className="grid w-full grid-cols-2 mb-6">
            <TabsTrigger value="customer">Customer</TabsTrigger>
            <TabsTrigger value="admin">Admin</TabsTrigger>
          </TabsList>
          
          <TabsContent value="customer">
            <Card>
              <CardHeader>
                <CardTitle>Customer Access</CardTitle>
                <CardDescription>
                  Track your designs, pre-bookings, and orders.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <CustomerAuthForm />
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="admin">
            <Card>
              <CardHeader>
                <CardTitle>Admin Access</CardTitle>
                <CardDescription>
                  Manage collections and store inventory.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <AdminAuthForm />
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}

export default function AuthPage() {
  return (
    <Suspense fallback={<div className="flex h-screen w-full items-center justify-center"><Loader2 className="h-8 w-8 animate-spin text-primary" /></div>}>
      <AuthContent />
    </Suspense>
  );
}
