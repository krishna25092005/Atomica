"use client";
import dynamic from "next/dynamic";
import React from "react";
import CTACard from "./components/CTACard";
import { 
  AtomIcon, 
  MessageCircle, 
  Network, 
  SearchIcon, 
  TrendingUpIcon,
  FlaskConicalIcon,
  UserCheckIcon,
  DatabaseIcon,
  BarChart3Icon,
  ActivityIcon
} from "lucide-react";
import Card from "@/components/ui/Card";

const DashboardCardMap = dynamic(
  () => import("@/components/dashboard/components/DashboardCardMap"),
  {
    ssr: false,
  },
);

const DashboardCardChat = dynamic(
  () => import("@/components/dashboard/components/DashboardCardChat"),
  {
    ssr: false,
  },
);

const Index: React.FC = () => {
  return (
    <>
      {/* Welcome Section */}
      <div className="mb-8">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
          <div>
            <h1 className="text-3xl font-bold text-black dark:text-white mb-2">
              Welcome to Atomica 🧬
            </h1>
            <p className="text-gray-600 dark:text-gray-400">
              Your AI-powered platform for accelerated drug discovery and molecular research
            </p>
          </div>
          <div className="mt-4 lg:mt-0 flex items-center space-x-2">
            <div className="flex items-center space-x-1 px-3 py-1 bg-green-100 dark:bg-green-900/20 rounded-full">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
              <span className="text-sm text-green-700 dark:text-green-400">All Systems Online</span>
            </div>
          </div>
        </div>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <Card variant="gradient" className="p-6">
          <div className="flex items-center space-x-4">
            <div className="p-3 bg-primary/20 rounded-xl">
              <FlaskConicalIcon className="w-6 h-6 text-primary" />
            </div>
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">Generated</p>
              <p className="text-2xl font-bold text-black dark:text-white">1,247</p>
              <p className="text-sm text-green-500">+12% this week</p>
            </div>
          </div>
        </Card>

        <Card variant="gradient" className="p-6">
          <div className="flex items-center space-x-4">
            <div className="p-3 bg-green-500/20 rounded-xl">
              <TrendingUpIcon className="w-6 h-6 text-green-500" />
            </div>
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">Success Rate</p>
              <p className="text-2xl font-bold text-black dark:text-white">94.2%</p>
              <p className="text-sm text-green-500">+2.1% improvement</p>
            </div>
          </div>
        </Card>

        <Card variant="gradient" className="p-6">
          <div className="flex items-center space-x-4">
            <div className="p-3 bg-blue-500/20 rounded-xl">
              <UserCheckIcon className="w-6 h-6 text-blue-500" />
            </div>
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">Active Users</p>
              <p className="text-2xl font-bold text-black dark:text-white">156</p>
              <p className="text-sm text-blue-500">+8 today</p>
            </div>
          </div>
        </Card>

        <Card variant="gradient" className="p-6">
          <div className="flex items-center space-x-4">
            <div className="p-3 bg-purple-500/20 rounded-xl">
              <DatabaseIcon className="w-6 h-6 text-purple-500" />
            </div>
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">Molecules DB</p>
              <p className="text-2xl font-bold text-black dark:text-white">50.2K</p>
              <p className="text-sm text-purple-500">Growing daily</p>
            </div>
          </div>
        </Card>
      </div>

      {/* Main Feature Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6 mb-8">
        <CTACard 
          subtitle="Explore comprehensive molecular database" 
          title="Molecule Bank"
          className="hover:scale-105 transition-transform duration-300"
          href="/molecule-bank"
        >
          <AtomIcon className="w-8 h-8" />
        </CTACard>
        
        <CTACard
          subtitle="AI-powered molecule generation"
          title="Generate Molecules"
          className="hover:scale-105 transition-transform duration-300"
          href="/model"
        >
          <Network className="w-8 h-8" />
        </CTACard>
        
        <CTACard
          subtitle="Compound bioactivity analysis"
          title="Bioactivity Search"
          className="hover:scale-105 transition-transform duration-300"
          href="/model?tab=bioactivity"
        >
          <SearchIcon className="w-8 h-8" />
        </CTACard>
        
        <CTACard
          subtitle="Connect with research community"
          title="Research Hub"
          className="hover:scale-105 transition-transform duration-300"
          href="/research"
        >
          <MessageCircle className="w-8 h-8" />
        </CTACard>
      </div>

      {/* Analytics and Activity */}
      <div className="mt-4 grid grid-cols-12 gap-4 md:mt-6 md:gap-6 2xl:mt-7.5 2xl:gap-7.5">
        <DashboardCardChat />
        <DashboardCardMap />
      </div>

      {/* Recent Activity */}
      <div className="mt-8">
        <Card>
          <div className="p-6">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-primary/20 rounded-lg">
                  <ActivityIcon className="w-6 h-6 text-primary" />
                </div>
                <h3 className="text-xl font-semibold text-black dark:text-white">
                  Recent Research Activity
                </h3>
              </div>
              <button className="text-primary hover:text-primary/80 text-sm font-medium">
                View All
              </button>
            </div>
            
            <div className="space-y-4">
              {[
                { action: "Generated 25 new molecules", time: "2 minutes ago", type: "generation" },
                { action: "Completed compound bioactivity analysis", time: "15 minutes ago", type: "analysis" },
                { action: "Added compounds to research library", time: "1 hour ago", type: "library" },
                { action: "Collaborated on Project Alpha", time: "3 hours ago", type: "collaboration" },
              ].map((activity, index) => (
                <div key={index} className="flex items-center space-x-4 p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                  <div className={`w-2 h-2 rounded-full ${
                    activity.type === 'generation' ? 'bg-green-500' :
                    activity.type === 'analysis' ? 'bg-blue-500' :
                    activity.type === 'library' ? 'bg-purple-500' : 'bg-orange-500'
                  }`} />
                  <div className="flex-1">
                    <p className="text-black dark:text-white font-medium">{activity.action}</p>
                    <p className="text-sm text-gray-500 dark:text-gray-400">{activity.time}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </Card>
      </div>
    </>
  );
};

export default Index;
