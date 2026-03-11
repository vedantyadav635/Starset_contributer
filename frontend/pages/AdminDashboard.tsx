import React from 'react';
import { PageView, Task } from '../types';
import { Button } from '../components/Button';
import { supabase } from "../supabaseClient";
import { useEffect, useState } from "react";
import { TaskList } from "./TaskList";

import {
   Users,
   Database,
   Activity,
   Server,
   AlertTriangle,
   TrendingUp,
   Globe
} from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line } from 'recharts';

interface AdminDashboardProps {
   onNavigate: (page: PageView) => void;
}

interface DashboardStats {
   totalUsers: number;
   activeTasks: number;
   totalSubmissions: number;
   deletedTasks: number;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({ onNavigate, tasks: taskList }) => {
   const [stats, setStats] = useState<DashboardStats>({
      totalUsers: 0,
      activeTasks: 0,
      totalSubmissions: 0,
      deletedTasks: 0,
   });
   const [statsLoading, setStatsLoading] = useState(true);

   const [tasks, setTasks] = useState<Task[]>([]);
   const [loading, setLoading] = useState(true);

   // Fetch real stats from Backend API (uses service role, bypasses RLS)
   useEffect(() => {
      const fetchStats = async () => {
         try {
            const { API_ENDPOINTS } = await import('../config/api');
            const response = await fetch(API_ENDPOINTS.ADMIN_STATS);
            if (!response.ok) throw new Error('Failed to fetch stats');
            const data = await response.json();

            setStats({
               totalUsers: data.totalUsers || 0,
               activeTasks: data.activeTasks || 0,
               totalSubmissions: data.totalSubmissions || 0,
               deletedTasks: data.deletedTasks || 0,
            });
         } catch (error) {
            console.error('Error fetching admin stats:', error);
         } finally {
            setStatsLoading(false);
         }
      };

      fetchStats();
   }, []);

   return (

      <div className="space-y-8 animate-in fade-in duration-500">
         {/* Admin Header */}
         <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-zinc-200 dark:border-white/10">
            <div>
               <h1 className="text-2xl font-bold text-[#121212] dark:text-white tracking-tight">Analytics</h1>
               <p className="text-zinc-500 text-sm mt-1 flex items-center gap-2">
                  <span className="flex h-2 w-2 rounded-full bg-emerald-500 animate-pulse"></span>
                  System Operational • Region: Asia-Pacific
               </p>
            </div>
            <div className="flex items-center gap-3">
               <Button variant="secondary" onClick={() => onNavigate('tasks')} size="sm">
                  Manage Registry
               </Button>
               <Button onClick={() => onNavigate('admin-create-task')} size="sm" className="bg-purple-600 hover:bg-purple-500 border-purple-500/50 text-white">
                  + Deploy New Task
               </Button>
            </div>
         </div>

         {/* High Level Stats */}
         <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {/* Active Nodes = Total Users */}
            <div className="bg-white dark:bg-zinc-900 p-6 rounded-xl border border-zinc-200 dark:border-white/10 shadow-sm">
               <div className="flex justify-between items-start mb-4">
                  <div className="p-2 bg-blue-50 dark:bg-blue-900/20 rounded-lg text-blue-600 dark:text-blue-400">
                     <Users className="h-6 w-6" />
                  </div>
               </div>
               <div className="text-3xl font-bold text-zinc-900 dark:text-white mb-1">
                  {statsLoading ? "..." : stats.totalUsers.toLocaleString()}
               </div>
               <div className="text-xs text-zinc-500 uppercase tracking-wider">Total Users</div>
            </div>

            {/* Active Campaigns = Active Tasks */}
            <div className="bg-white dark:bg-zinc-900 p-6 rounded-xl border border-zinc-200 dark:border-white/10 shadow-sm">
               <div className="flex justify-between items-start mb-4">
                  <div className="p-2 bg-purple-50 dark:bg-purple-900/20 rounded-lg text-purple-600 dark:text-purple-400">
                     <Database className="h-6 w-6" />
                  </div>
               </div>
               <div className="text-3xl font-bold text-zinc-900 dark:text-white mb-1">
                  {statsLoading ? "..." : stats.activeTasks.toLocaleString()}
               </div>
               <div className="text-xs text-zinc-500 uppercase tracking-wider">Active Tasks</div>
            </div>

            {/* Submissions = Total Submissions */}
            <div className="bg-white dark:bg-zinc-900 p-6 rounded-xl border border-zinc-200 dark:border-white/10 shadow-sm">
               <div className="flex justify-between items-start mb-4">
                  <div className="p-2 bg-orange-50 dark:bg-orange-900/20 rounded-lg text-orange-600 dark:text-orange-400">
                     <Activity className="h-6 w-6" />
                  </div>
               </div>
               <div className="text-3xl font-bold text-zinc-900 dark:text-white mb-1">
                  {statsLoading ? "..." : stats.totalSubmissions.toLocaleString()}
               </div>
               <div className="text-xs text-zinc-500 uppercase tracking-wider">Total Submissions</div>
            </div>

            {/* Flagged Items = Deleted/Discarded Tasks */}
            <div className="bg-white dark:bg-zinc-900 p-6 rounded-xl border border-zinc-200 dark:border-white/10 shadow-sm">
               <div className="flex justify-between items-start mb-4">
                  <div className="p-2 bg-red-50 dark:bg-red-900/20 rounded-lg text-red-600 dark:text-red-400">
                     <AlertTriangle className="h-6 w-6" />
                  </div>
               </div>
               <div className="text-3xl font-bold text-zinc-900 dark:text-white mb-1">
                  {statsLoading ? "..." : stats.deletedTasks.toLocaleString()}
               </div>
               <div className="text-xs text-zinc-500 uppercase tracking-wider">Flagged / Deleted</div>
            </div>
         </div>

      </div>
   );
};