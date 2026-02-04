"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";

export function AdminAuthForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [secretCode, setSecretCode] = useState("");
  const [loading, setLoading] = useState(false);
  const [isSignUp, setIsSignUp] = useState(false);
  const router = useRouter();
  const supabase = createClient();

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      // 1. Verify Secret Code (Required for BOTH Sign In and Sign Up)
      const ADMIN_SECRET = process.env.NEXT_PUBLIC_ADMIN_SECRET || "MAFGEMS_ADMIN_2026";
      
      if (secretCode !== ADMIN_SECRET) {
        throw new Error("Invalid Secret Code. Admin access denied.");
      }

      if (isSignUp) {
        // Check Admin Limit
        const { data: countData, error: countError } = await supabase.rpc('get_admin_count');
        if (!countError && typeof countData === 'number' && countData >= 3) {
           throw new Error("Admin registration limit reached (Max 3).");
        }

        const { error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            data: {
              role: 'admin'
            }
          }
        });
        if (error) throw error;
        toast.success("Admin account created! Check email.");
      } else {
        const { data, error } = await supabase.auth.signInWithPassword({
          email,
          password,
        });
        if (error) throw error;

        // Enforce Admin Role Check
        if (data.user?.user_metadata?.role !== 'admin') {
           await supabase.auth.signOut();
           throw new Error("This account does not have Admin privileges.");
        }

        toast.success("Admin Logged in successfully");
        router.push("/collections");
      }
    } catch (error: any) {
      toast.error(error.message || "Authentication failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleAuth} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="admin-email">Email</Label>
        <Input
          id="admin-email"
          type="email"
          placeholder="admin@mafgems.com"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="admin-password">Password</Label>
        <Input
          id="admin-password"
          type="password"
          required
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="secretCode">Admin Secret Code</Label>
        <Input
          id="secretCode"
          type="password"
          placeholder="Secure Access Key"
          required
          value={secretCode}
          onChange={(e) => setSecretCode(e.target.value)}
        />
        <p className="text-xs text-muted-foreground">Required for all admin actions.</p>
      </div>

      <Button type="submit" className="w-full" disabled={loading}>
        {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
        {isSignUp ? "Register new Admin" : "Admin Dashboard Access"}
      </Button>
      <Button
        variant="ghost"
        type="button"
        className="w-full"
        onClick={() => setIsSignUp(!isSignUp)}
      >
        {isSignUp
          ? "Already registered? Sign In"
          : "Register new Admin"}
      </Button>
    </form>
  );
}
