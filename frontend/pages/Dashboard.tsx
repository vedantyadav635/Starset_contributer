import React from 'react';
import { PageView } from '../types';
import { Button } from '../components/Button';
import { 
  Database, 
  Clock, 
  CheckCircle,
  Activity,
  BarChart3,
  Globe,
  Server
} from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { useAuth } from '../context/AuthContext';
import { AuthProvider } from '../context/AuthContext';

interface DashboardProps {
  onNavigate: (page: PageView) => void;
}

const mockChartData = [
  { name: 'Mon', amount: 600 },
  { name: 'Tue', amount: 1200 },
  { name: 'Wed', amount: 650 },
  { name: 'Thu', amount: 2100 },
  { name: 'Fri', amount: 1200 },
  { name: 'Sat', amount: 600 },
];

export const Dashboard: React.FC<DashboardProps> = ({ onNavigate }) => {
  const { user } = useAuth();
  console.log("User from Dashboard:", user.user_metadata
);
  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-zinc-200 dark:border-white/10">
        <div>
          <h1 className="text-2xl font-bold text-zinc-900 dark:text-white tracking-tight">System Overview</h1>
          <p className="text-zinc-500 text-sm mt-1">Contributor  sssNode: Online • ID: 8829-X</p>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="secondary" onClick={() => onNavigate('tasks')} size="sm" className="bg-white border-zinc-200 text-zinc-900 hover:bg-zinc-50 dark:bg-white/10 dark:text-white dark:border-white/10 dark:hover:bg-white/20">
            View Data Tasks
          </Button>
          <Button onClick={() => onNavigate('earnings')} size="sm" variant="black">
             Compensation Details
          </Button>
        </div>
      </div>

      {/* KPI Stats - Technical/Infrastructure Focused */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {[
          { label: 'Open Requests', value: '42', sub: 'Awaiting contribution', icon: Database },
          { label: 'Validation Queue', value: '14', sub: 'Processing inputs', icon: Clock },
          { label: 'Accepted Units', value: '327', sub: 'Integrated into datasets', icon: CheckCircle },
          { label: 'Acceptance Rate', value: '98.5%', sub: 'High fidelity', icon: Activity },
        ].map((stat, idx) => (
          <div key={idx} className="bg-white dark:bg-white/5 p-5 rounded-lg border border-zinc-200 dark:border-white/10 shadow-[0_2px_10px_rgba(0,0,0,0.03)] hover:border-zinc-300 dark:hover:border-white/20 transition-colors">
             <div className="flex items-center justify-between mb-2">
               <span className="text-xs font-semibold text-zinc-500 uppercase tracking-wider">{stat.label}</span>
               <stat.icon className="h-4 w-4 text-zinc-400" />
             </div>
             <div className="text-2xl font-bold text-zinc-900 dark:text-white">{stat.value}</div>
             <div className="text-xs text-zinc-400 mt-1">{stat.sub}</div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Chart Area */}
        <div className="lg:col-span-2 bg-white dark:bg-white/5 rounded-lg border border-zinc-200 dark:border-white/10 shadow-sm flex flex-col">
          <div className="px-6 py-4 border-b border-zinc-100 dark:border-white/5 flex justify-between items-center">
            <h3 className="text-sm font-bold text-zinc-900 dark:text-white flex items-center gap-2">
              <BarChart3 className="h-4 w-4 text-zinc-400" /> Compensation History
            </h3>
            <select className="text-xs border border-zinc-200 dark:border-white/10 rounded bg-zinc-50 dark:bg-black py-1 px-2 focus:ring-blue-500 outline-none text-zinc-700 dark:text-zinc-300">
              <option>Last 7 Days</option>
              <option>This Month</option>
            </select>
          </div>
          <div className="p-6 h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={mockChartData} barSize={32}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#a1a1aa" strokeOpacity={0.2} />
                <XAxis 
                  dataKey="name" 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{fill: '#71717a', fontSize: 11}} 
                  dy={10}
                />
                <YAxis 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{fill: '#a1a1aa', fontSize: 11}}
                  tickFormatter={(value) => `₹${value}`}
                  dx={-10}
                />
                <Tooltip 
                  cursor={{fill: 'rgba(120, 120, 120, 0.1)'}}
                  contentStyle={{
                    backgroundColor: '#18181b', 
                    borderRadius: '6px', 
                    border: '1px solid #27272a', 
                    color: '#fff',
                    fontSize: '12px'
                  }}
                  itemStyle={{color: '#fff'}}
                  formatter={(value) => [`₹${value}`, 'Compensated']}
                />
                <Bar 
                  dataKey="amount" 
                  fill="#2563eb" 
                  radius={[4, 4, 0, 0]} 
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Action Panel */}
        <div className="space-y-6">
          {/* Priority Task */}
          <div className="bg-white dark:bg-white/5 rounded-lg border border-zinc-200 dark:border-white/10 shadow-[0_4px_20px_rgba(37,99,235,0.05)] p-6 relative overflow-hidden group cursor-pointer hover:border-blue-300 dark:hover:border-blue-700 transition-colors" onClick={() => onNavigate('tasks')}>
            <div className="absolute top-0 right-0 p-3">
              <span className="bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 text-[10px] font-bold px-2 py-1 rounded uppercase tracking-wide border border-blue-100 dark:border-blue-800">Priority Data</span>
            </div>
            <div className="mb-4">
              <div className="h-8 w-8 bg-blue-100 dark:bg-blue-900/30 rounded flex items-center justify-center text-blue-600 dark:text-blue-400 mb-3">
                <Globe className="h-4 w-4" />
              </div>
              <h3 className="text-sm font-bold text-zinc-900 dark:text-white">Hindi Audio Collection</h3>
              <p className="text-xs text-zinc-500 mt-1">Speech synthesis model training.</p>
            </div>
            <div className="flex items-center justify-between text-xs mt-4 pt-4 border-t border-zinc-100 dark:border-white/5">
               <span className="font-mono text-zinc-500">Est: 15m</span>
               <span className="font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-900/20 px-2 py-1 rounded">₹150.00 Compensation</span>
            </div>
          </div>

          {/* System Status */}
          <div className="bg-zinc-50 dark:bg-white/5 rounded-lg border border-zinc-200 dark:border-white/10 p-4">
            <h4 className="text-xs font-bold text-zinc-500 uppercase tracking-wider mb-3">Node Status</h4>
            <div className="space-y-2">
              <div className="flex justify-between items-center text-xs">
                <span className="text-zinc-600 dark:text-zinc-400">Payment Gateway</span>
                <span className="flex items-center text-emerald-600 dark:text-emerald-400 font-medium"><div className="h-1.5 w-1.5 rounded-full bg-emerald-500 mr-2"></div> Active</span>
              </div>
              <div className="flex justify-between items-center text-xs">
                <span className="text-zinc-600 dark:text-zinc-400">Validation Engine</span>
                <span className="flex items-center text-emerald-600 dark:text-emerald-400 font-medium"><div className="h-1.5 w-1.5 rounded-full bg-emerald-500 mr-2"></div> Online</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};