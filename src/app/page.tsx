"use client";

import React from 'react';
import { motion } from 'framer-motion';
import { 
  LayoutDashboard, 
  Users, 
  BarChart3, 
  Settings, 
  ArrowUpRight, 
  CreditCard,
  Activity
} from 'lucide-react';
import { cn } from '@/lib/utils';

const StatCard = ({ title, value, icon: Icon, trend, trendValue }: any) => (
  <motion.div 
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    className="rounded-xl border bg-card p-6 shadow-sm transition-all hover:shadow-md"
  >
    <div className="flex items-center justify-between space-y-0 pb-2">
      <p className="text-sm font-medium text-muted-foreground">{title}</p>
      <Icon className="h-4 w-4 text-muted-foreground" />
    </div>
    <div className="flex flex-col">
      <p className="text-2xl font-bold">{value}</p>
      <p className={cn(
        "text-xs flex items-center mt-1",
        trend === 'up' ? "text-emerald-500" : "text-rose-500"
      )}>
        {trend === 'up' ? <ArrowUpRight className="h-3 w-3 mr-1" /> : null}
        {trendValue} from last month
      </p>
    </div>
  </motion.div>
);

export default function Dashboard() {
  return (
    <div className="container mx-auto p-6 space-y-8">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold tracking-tight">Overview</h1>
        <p className="text-muted-foreground">Welcome back to your dashboard summary.</p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <StatCard 
          title="Total Revenue" 
          value="$45,231.89" 
          icon={CreditCard} 
          trend="up" 
          trendValue="+20.1%" 
        />
        <StatCard 
          title="Subscriptions" 
          value="+2,350" 
          icon={Users} 
          trend="up" 
          trendValue="+180.1%" 
        />
        <StatCard 
          title="Sales" 
          value="+12,234" 
          icon={CreditCard} 
          trend="up" 
          trendValue="+19%" 
        />
        <StatCard 
          title="Active Now" 
          value="+573" 
          icon={Activity} 
          trend="up" 
          trendValue="+201" 
        />
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        <div className="col-span-4 rounded-xl border bg-card shadow-sm p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-lg">Revenue Growth</h3>
            <BarChart3 className="h-4 w-4 text-muted-foreground" />
          </div>
          <div className="h-[300px] w-full bg-muted/30 rounded-lg flex items-center justify-center border-dashed border-2">
            <p className="text-muted-foreground text-sm italic">Growth visualization placeholder</p>
          </div>
        </div>
        
        <div className="col-span-3 rounded-xl border bg-card shadow-sm p-6">
          <h3 className="font-semibold text-lg mb-4">Recent Sales</h3>
          <div className="space-y-6">
            {[1, 2, 3, 4, 5].map((i) => (
              <div key={i} className="flex items-center gap-4">
                <div className="h-9 w-9 rounded-full bg-primary/10 flex items-center justify-center">
                  <span className="text-xs font-medium text-primary">JD</span>
                </div>
                <div className="flex-1 space-y-1">
                  <p className="text-sm font-medium leading-none">John Doe {i}</p>
                  <p className="text-xs text-muted-foreground">john.doe@example.com</p>
                </div>
                <div className="font-medium">+$1,999.00</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}