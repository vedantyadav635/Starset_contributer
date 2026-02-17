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


export const AdminDashboard: React.FC<AdminDashboardProps> = ({ onNavigate, tasks: taskList }) => {
  const activeContributors = 5432;
const totalTasks = taskList?.length || 0;


  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);


  // Mock Data for Admin Charts
  const throughputData = [
    { time: '08:00', value: 120 },
    { time: '10:00', value: 350 },
    { time: '12:00', value: 450 },
    { time: '14:00', value: 380 },
    { time: '16:00', value: 520 },
    { time: '18:00', value: 410 },
  ];
// useEffect(() => {
//   const checkAdmin = async () => {
//     const { data } = await supabase.auth.getUser();
//     const role = data.user?.user_metadata?.role;

//     if (role !== "admin") {
//       alert("Access denied");
//       window.location.href = "/";
//     }
//   };

//   checkAdmin();
// }, []);

  return (
   
    <div className="space-y-8 animate-in fade-in duration-500">
      {loading && (
  <div className="text-center text-zinc-400 text-sm">
    Loading tasks...
  </div>
)}

       {/* Admin Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-zinc-200 dark:border-white/10">
        <div>
          <h1 className="text-2xl font-bold text-[#121212] dark:text-white tracking-tight">Command Center</h1>
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
        <div className="bg-white dark:bg-zinc-900 p-6 rounded-xl border border-zinc-200 dark:border-white/10 shadow-sm">
           <div className="flex justify-between items-start mb-4">
              <div className="p-2 bg-blue-50 dark:bg-blue-900/20 rounded-lg text-blue-600 dark:text-blue-400">
                 <Users className="h-6 w-6" />
              </div>
              <span className="text-xs font-bold text-emerald-500 bg-emerald-50 dark:bg-emerald-900/20 px-2 py-1 rounded">+12%</span>
           </div>
           <div className="text-3xl font-bold text-zinc-900 dark:text-white mb-1">{activeContributors.toLocaleString()}</div>
           <div className="text-xs text-zinc-500 uppercase tracking-wider">Active Nodes</div>
        </div>

        <div className="bg-white dark:bg-zinc-900 p-6 rounded-xl border border-zinc-200 dark:border-white/10 shadow-sm">
           <div className="flex justify-between items-start mb-4">
              <div className="p-2 bg-purple-50 dark:bg-purple-900/20 rounded-lg text-purple-600 dark:text-purple-400">
                 <Database className="h-6 w-6" />
              </div>
           </div>
           <div className="text-3xl font-bold text-zinc-900 dark:text-white mb-1">{totalTasks}</div>
           <div className="text-xs text-zinc-500 uppercase tracking-wider">Active Campaigns</div>
        </div>

        <div className="bg-white dark:bg-zinc-900 p-6 rounded-xl border border-zinc-200 dark:border-white/10 shadow-sm">
           <div className="flex justify-between items-start mb-4">
              <div className="p-2 bg-orange-50 dark:bg-orange-900/20 rounded-lg text-orange-600 dark:text-orange-400">
                 <Activity className="h-6 w-6" />
              </div>
              <span className="text-xs font-bold text-emerald-500 bg-emerald-50 dark:bg-emerald-900/20 px-2 py-1 rounded">98ms</span>
           </div>
           <div className="text-3xl font-bold text-zinc-900 dark:text-white mb-1">45k</div>
           <div className="text-xs text-zinc-500 uppercase tracking-wider">Submissions / Hr</div>
        </div>

        <div className="bg-white dark:bg-zinc-900 p-6 rounded-xl border border-zinc-200 dark:border-white/10 shadow-sm">
           <div className="flex justify-between items-start mb-4">
              <div className="p-2 bg-red-50 dark:bg-red-900/20 rounded-lg text-red-600 dark:text-red-400">
                 <AlertTriangle className="h-6 w-6" />
              </div>
           </div>
           <div className="text-3xl font-bold text-zinc-900 dark:text-white mb-1">12</div>
           <div className="text-xs text-zinc-500 uppercase tracking-wider">Flagged Items</div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
         Live Throughput Chart
         <div className="lg:col-span-2 bg-white dark:bg-zinc-900 rounded-xl border border-zinc-200 dark:border-white/10 p-6 shadow-sm">
            <h3 className="font-bold text-lg text-zinc-900 dark:text-white mb-6 flex items-center gap-2">
               <TrendingUp className="h-5 w-5 text-zinc-400" /> Live Data Ingestion Rate
            </h3>
            {/* <div className="h-[300px] w-full">
               <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={throughputData}>
                     <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#333" strokeOpacity={0.1} />
                     <XAxis dataKey="time" axisLine={false} tickLine={false} tick={{fill: '#71717a', fontSize: 12}} />
                     <YAxis axisLine={false} tickLine={false} tick={{fill: '#71717a', fontSize: 12}} />
                     <Tooltip 
                        contentStyle={{ backgroundColor: '#18181b', border: '1px solid #333', borderRadius: '8px', color: '#fff' }}
                        itemStyle={{ color: '#fff' }}
                     />
                     <Line type="monotone" dataKey="value" stroke="#8b5cf6" strokeWidth={3} dot={{r: 4, fill: '#8b5cf6'}} activeDot={{r: 6}} />
                  </LineChart>
               </ResponsiveContainer>
            </div> */}
         </div>

         {/* Server Status */}
         <div className="bg-white dark:bg-zinc-900 rounded-xl border border-zinc-200 dark:border-white/10 p-6 shadow-sm">
            <h3 className="font-bold text-lg text-zinc-900 dark:text-white mb-6 flex items-center gap-2">
               <Server className="h-5 w-5 text-zinc-400" /> Node Status
            </h3>
            <div className="space-y-4">
               {[
                  { name: 'US-East-1', status: 'Optimal', load: '45%' },
                  { name: 'EU-West-2', status: 'Optimal', load: '52%' },
                  { name: 'AP-South-1', status: 'High Load', load: '89%' },
                  { name: 'SA-East-1', status: 'Optimal', load: '30%' },
               ].map((server, i) => (
                  <div key={i} className="flex items-center justify-between p-3 bg-zinc-50 dark:bg-white/5 rounded-lg border border-zinc-100 dark:border-white/5">
                     <div className="flex items-center gap-3">
                        <Globe className="h-4 w-4 text-zinc-400" />
                        <span className="text-sm font-medium text-zinc-700 dark:text-zinc-300">{server.name}</span>
                     </div>
                     <div className="text-right">
                        <div className={`text-xs font-bold ${server.status === 'High Load' ? 'text-amber-500' : 'text-emerald-500'}`}>{server.status}</div>
                        <div className="text-[10px] text-zinc-400">{server.load} Load</div>
                     </div>
                  </div>
               ))}
            </div>
            <Button variant="outline" size="sm" className="w-full mt-6">View Full Diagnostic</Button>
         </div>
      </div>

    </div>
  );
};