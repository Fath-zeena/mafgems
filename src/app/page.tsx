"use client";

import React from 'react';
import { motion } from 'framer-motion';
import { 
  DollarSign, 
  Users, 
  CreditCard, 
  Activity,
  TrendingUp,
  Eye,
  MousePointerClick,
  BarChart3
} from 'lucide-react';

const StatCard = ({ 
  title, 
  value, 
  icon: Icon, 
  description,
  trend,
  trendValue
}: {
  title: string;
  value: string;
  icon: React.ComponentType<any>;
  description: string;
  trend: 'up' | 'down';
  trendValue: string;
}) => (
  <motion.div 
    initial={{ opacity: 0, y: 10 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.3 }}
    whileHover={{ y: -5 }}
    className="rounded-xl border bg-card p-6 shadow-sm transition-all hover:shadow-md"
  >
    <div className="flex items-center justify-between">
      <div>
        <p className="text-sm font-medium text-muted-foreground">{title}</p>
        <h3 className="text-2xl font-bold mt-2">{value}</h3>
      </div>
      <div className="p-3 rounded-lg bg-primary/10">
        <Icon className="h-6 w-6 text-primary" />
      </div>
    </div>
    <p className="text-xs text-muted-foreground mt-4">{description}</p>
    <div className={`
      flex items-center mt-2 text-xs font-medium
      ${trend === 'up' ? 'text-emerald-500' : 'text-rose-500'}
    `}>
      <TrendingUp className={`h-3 w-3 mr-1 ${trend === 'down' ? 'rotate-180' : ''}`} />
      {trendValue} from last month
    </div>
  </motion.div>
);

const chartData = [
  { name: 'Jan', value: 400 },
  { name: 'Feb', value: 300 },
  { name: 'Mar', value: 200 },
  { name: 'Apr', value: 278 },
  { name: 'May', value: 189 },
];

export default function Dashboard() {
  return (
    <div className="container mx-auto py-8 px-4 space-y-8">
      <motion.div 
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.5 }}
        className="flex flex-col gap-2"
      >
        <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
        <p className="text-muted-foreground">Welcome back! Here's what's happening today.</p>
      </motion.div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <StatCard 
          title="Total Revenue" 
          value="$45,231.89" 
          icon={DollarSign} 
          description="Total revenue from all channels"
          trend="up" 
          trendValue="+20.1%" 
        />
        <StatCard 
          title="Subscriptions" 
          value="+2,350" 
          icon={Users} 
          description="Active subscriptions this month"
          trend="up" 
          trendValue="+180.1%" 
        />
        <StatCard 
          title="Sales" 
          value="+12,234" 
          icon={CreditCard} 
          description="Total sales this period"
          trend="down" 
          trendValue="-19%" 
        />
        <StatCard 
          title="Active Now" 
          value="+573" 
          icon={Activity} 
          description="Currently active users"
          trend="up" 
          trendValue="+201" 
        />
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-7">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="col-span-4 rounded-xl border bg-card shadow-sm p-6"
        >
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="font-semibold text-lg">Performance Overview</h3>
              <p className="text-sm text-muted-foreground">Your business metrics for this period</p>
            </div>
            <BarChart3 className="h-5 w-5 text-muted-foreground" />
          </div>
          
          <div className="h-80 flex items-center justify-center">
            <div className="w-full space-y-4">
              <div className="flex items-end justify-between h-64">
                {chartData.map((item, index) => (
                  <div key={index} className="flex flex-col items-center flex-1 px-2">
                    <div className="text-xs text-muted-foreground mb-2">{item.name}</div>
                    <div 
                      className="w-full bg-primary rounded-t-lg transition-all duration-500 ease-out"
                      style={{ height: `${(item.value / 400) * 80}%` }}
                    />
                    <div className="text-xs font-medium mt-2">{item.value}</div>
                  </div>
                ))}
              </div>
              <div className="border-t pt-4">
                <div className="flex justify-between">
                  <div className="flex items-center">
                    <div className="w-3 h-3 rounded-full bg-primary mr-2"></div>
                    <span className="text-sm">Revenue</span>
                  </div>
                  <div className="text-sm font-medium">$45,231.89</div>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
        
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="col-span-3 rounded-xl border bg-card shadow-sm p-6"
        >
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="font-semibold text-lg">Recent Activity</h3>
              <p className="text-sm text-muted-foreground">Latest user interactions</p>
            </div>
          </div>
          
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <div className="p-2 rounded-lg bg-blue-100 text-blue-600 mr-3">
                  <Eye className="h-4 w-4" />
                </div>
                <div>
                  <p className="font-medium">Page Views</p>
                  <p className="text-sm text-muted-foreground">User viewed dashboard</p>
                </div>
              </div>
              <div className="text-right">
                <p className="font-medium">+2,350</p>
                <p className="text-xs text-muted-foreground">12 min ago</p>
              </div>
            </div>
            
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <div className="p-2 rounded-lg bg-green-100 text-green-600 mr-3">
                  <MousePointerClick className="h-4 w-4" />
                </div>
                <div>
                  <p className="font-medium">Clicks</p>
                  <p className="text-sm text-muted-foreground">User clicked CTA</p>
                </div>
              </div>
              <div className="text-right">
                <p className="font-medium">+1,242</p>
                <p className="text-xs text-muted-foreground">24 min ago</p>
              </div>
            </div>
            
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <div className="p-2 rounded-lg bg-purple-100 text-purple-600 mr-3">
                  <Users className="h-4 w-4" />
                </div>
                <div>
                  <p className="font-medium">New Users</p>
                  <p className="text-sm text-muted-foreground">Signed up today</p>
                </div>
              </div>
              <div className="text-right">
                <p className="font-medium">+56</p>
                <p className="text-xs text-muted-foreground">1 hour ago</p>
              </div>
            </div>
            
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <div className="p-2 rounded-lg bg-amber-100 text-amber-600 mr-3">
                  <CreditCard className="h-4 w-4" />
                </div>
                <div>
                  <p className="font-medium">Transactions</p>
                  <p className="text-sm text-muted-foreground">Completed payments</p>
                </div>
              </div>
              <div className="text-right">
                <p className="font-medium">+89</p>
                <p className="text-xs text-muted-foreground">2 hours ago</p>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}