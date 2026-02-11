"use client";

import React from "react";
import { motion } from "framer-motion";
import { 
  TrendingUp, 
  Users, 
  Zap, 
  ArrowUpRight, 
  Search,
  LayoutGrid,
  Settings,
  Bell,
  MoreVertical
} from "lucide-react";
import { cn } from "@/lib/utils";

const cards = [
  { title: "Total Users", value: "24,512", change: "+12.5%", icon: Users, color: "bg-blue-500" },
  { title: "Active Now", value: "1,203", change: "+5.2%", icon: Zap, color: "bg-amber-500" },
  { title: "Conversion", value: "3.24%", change: "+0.4%", icon: TrendingUp, color: "bg-emerald-500" },
];

export default function HomePage() {
  return (
    <div className="p-4 md:p-8 max-w-7xl mx-auto space-y-8">
      {/* Search and Header Section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 tracking-tight">Overview</h1>
          <p className="text-gray-500 mt-1">Real-time performance metrics and insights.</p>
        </div>
        <div className="relative w-full md:w-80">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
          <input 
            type="text" 
            placeholder="Search analytics..." 
            className="w-full pl-10 pr-4 py-2 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all bg-white"
          />
        </div>
      </div>

      {/* Metric Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {cards.map((card, idx) => (
          <motion.div
            key={card.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.1 }}
            className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow relative overflow-hidden group"
          >
            <div className={cn("absolute top-0 right-0 w-24 h-24 -mr-8 -mt-8 rounded-full opacity-5 transition-transform group-hover:scale-110", card.color)} />
            <div className="flex justify-between items-start">
              <div className={cn("p-2.5 rounded-xl text-white", card.color)}>
                <card.icon size={20} />
              </div>
              <div className="flex items-center text-emerald-600 text-xs font-bold bg-emerald-50 px-2 py-1 rounded-full">
                <ArrowUpRight size={12} className="mr-0.5" />
                {card.change}
              </div>
            </div>
            <div className="mt-4">
              <p className="text-sm font-medium text-gray-500">{card.title}</p>
              <h3 className="text-2xl font-bold text-gray-900 mt-1">{card.value}</h3>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Main Content Area */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Activity Feed */}
        <div className="lg:col-span-2 bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-bold text-gray-900">Recent Activity</h2>
            <button className="text-blue-600 text-sm font-semibold hover:underline">View all</button>
          </div>
          <div className="space-y-6">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="flex gap-4">
                <div className="w-10 h-10 rounded-full bg-gray-100 flex-shrink-0 flex items-center justify-center font-bold text-gray-600">
                  {String.fromCharCode(64 + i)}
                </div>
                <div className="flex-1 border-b border-gray-50 pb-4">
                  <p className="text-sm text-gray-900">
                    <span className="font-bold">User #{i}</span> completed a new transaction
                  </p>
                  <p className="text-xs text-gray-500 mt-1">{i * 5} minutes ago</p>
                </div>
                <MoreVertical size={16} className="text-gray-400 cursor-pointer" />
              </div>
            ))}
          </div>
        </div>

        {/* Quick Actions / Stats */}
        <div className="space-y-6">
          <div className="bg-blue-600 rounded-2xl p-6 text-white shadow-lg shadow-blue-200 overflow-hidden relative">
            <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-16 -mt-16" />
            <h3 className="text-lg font-bold mb-2 relative z-10">Premium Plan</h3>
            <p className="text-blue-100 text-sm mb-4 relative z-10">Unlock advanced AI features and export data to PDF.</p>
            <button className="w-full py-2.5 bg-white text-blue-600 rounded-xl text-sm font-bold hover:bg-blue-50 transition-colors relative z-10">
              Upgrade Now
            </button>
          </div>

          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
            <h3 className="font-bold text-gray-900 mb-4">Quick Shortcuts</h3>
            <div className="grid grid-cols-2 gap-3">
              {[
                { label: "Settings", icon: Settings },
                { label: "Layout", icon: LayoutGrid },
                { label: "Alerts", icon: Bell },
                { label: "Help", icon: MoreVertical },
              ].map((item) => (
                <button key={item.label} className="flex flex-col items-center gap-2 p-3 rounded-xl hover:bg-gray-50 border border-transparent hover:border-gray-100 transition-all">
                  <item.icon size={20} className="text-gray-500" />
                  <span className="text-xs font-medium text-gray-600">{item.label}</span>
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}