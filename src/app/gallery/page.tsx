'use client';

import React, { useEffect, useState } from 'react';
import { createClient } from '@supabase/supabase-js';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import Link from 'next/link';
import { ArrowLeft, Download, Share2, Trash2 } from 'lucide-react';

interface Presentation {
  id: string;
  user_id: string;
  input_method: string;
  jewelry_type: string;
  output_type: string;
  output_url: string;
  status: string;
  configuration: any;
  created_at: string;
}

export default function GalleryPage() {
  const [presentations, setPresentations] = useState<Presentation[]>([]);
  const [loading, setLoading] = useState(true);
  const [userId, setUserId] = useState<string | null>(null);

  useEffect(() => {
    const checkAuth = async () => {
      const supabase = createClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL || '',
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''
      );

      const { data: { user } } = await supabase.auth.getUser();
      
      if (user) {
        setUserId(user.id);
        fetchPresentations(user.id);
      } else {
        setLoading(false);
      }
    };

    checkAuth();
  }, []);

  const fetchPresentations = async (uid: string) => {
    try {
      const supabase = createClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL || '',
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''
      );

      const { data, error } = await supabase
        .from('presentation_generations')
        .select('*')
        .eq('user_id', uid)
        .order('created_at', { ascending: false });

      if (error) throw error;
      
      setPresentations(data || []);
    } catch (error) {
      console.error('Error fetching presentations:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      const supabase = createClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL || '',
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''
      );

      const { error } = await supabase
        .from('presentation_generations')
        .delete()
        .eq('id', id);

      if (error) throw error;
      
      setPresentations(presentations.filter(p => p.id !== id));
    } catch (error) {
      console.error('Error deleting presentation:', error);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950">
      {/* Header */}
      <div className="border-b border-slate-800 bg-slate-900/50 backdrop-blur">
        <div className="max-w-7xl mx-auto px-4 py-6 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link href="/presentation">
                <Button variant="outline" size="icon" className="rounded-lg">
                  <ArrowLeft className="h-4 w-4" />
                </Button>
              </Link>
              <div>
                <h1 className="text-3xl font-bold text-white">My Presentations</h1>
                <p className="text-slate-400 mt-1">View and manage your generated jewelry designs</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 py-12 sm:px-6 lg:px-8">
        {!userId ? (
          <Card className="bg-slate-900 border-slate-800 p-8 text-center">
            <p className="text-slate-400 mb-4">Please sign in to view your presentations</p>
            <Link href="/auth">
              <Button>Sign In</Button>
            </Link>
          </Card>
        ) : loading ? (
          <div className="text-center">
            <p className="text-slate-400">Loading presentations...</p>
          </div>
        ) : presentations.length === 0 ? (
          <Card className="bg-slate-900 border-slate-800 p-8 text-center">
            <p className="text-slate-400 mb-4">No presentations yet</p>
            <Link href="/presentation">
              <Button>Create Your First Design</Button>
            </Link>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {presentations.map((presentation) => (
              <Card key={presentation.id} className="bg-slate-900 border-slate-800 overflow-hidden hover:border-slate-700 transition">
                <div className="aspect-video bg-slate-800 overflow-hidden">
                  <img
                    src={presentation.output_url}
                    alt={presentation.jewelry_type}
                    className="w-full h-full object-cover"
                  />
                </div>
                
                <div className="p-4">
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <div className="inline-block px-2 py-1 bg-slate-800 text-slate-100 text-xs font-semibold rounded">
                        {presentation.jewelry_type.toUpperCase()}
                      </div>
                      <p className="text-slate-300 text-sm mt-2 capitalize">
                        {presentation.input_method.replace('-', ' ')}
                      </p>
                    </div>
                    <div className="flex gap-1">
                      {presentation.output_type === 'video' && (
                        <div className="text-xs bg-purple-900/30 text-purple-300 px-2 py-1 rounded">
                          VIDEO
                        </div>
                      )}
                    </div>
                  </div>

                  <p className="text-slate-400 text-xs">
                    {new Date(presentation.created_at).toLocaleDateString()} {new Date(presentation.created_at).toLocaleTimeString()}
                  </p>

                  <div className="flex gap-2 mt-4">
                    <Button
                      variant="outline"
                      size="sm"
                      className="flex-1"
                      asChild
                    >
                      <a href={presentation.output_url} download>
                        <Download className="h-3 w-3 mr-1" />
                        Download
                      </a>
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        navigator.clipboard.writeText(presentation.output_url);
                      }}
                    >
                      <Share2 className="h-3 w-3" />
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      className="text-red-400 hover:text-red-300"
                      onClick={() => handleDelete(presentation.id)}
                    >
                      <Trash2 className="h-3 w-3" />
                    </Button>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
