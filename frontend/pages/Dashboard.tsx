import React, { useEffect, useState } from 'react';
import { PageView } from '../types';
import { Button } from '../components/Button';
import {
  Database,
  Clock,
  CheckCircle,
  Activity,
  BarChart3,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { supabase } from '../supabaseClient';
import { API_ENDPOINTS } from '../config/api';

interface DashboardProps {
  onNavigate: (page: PageView) => void;
}

interface UserStats {
  totalSubmissions: number;
  inValidation: number;
  accepted: number;
  acceptanceRate: string;
}

export const Dashboard: React.FC<DashboardProps> = ({ onNavigate }) => {
  const { user } = useAuth();
  const [stats, setStats] = useState<UserStats>({
    totalSubmissions: 0,
    inValidation: 0,
    accepted: 0,
    acceptanceRate: "0.0%",
  });
  const [statsLoading, setStatsLoading] = useState(true);
  const [userName, setUserName] = useState('Contributor');

  // Fetch user-specific stats
  useEffect(() => {
    const fetchUserStats = async () => {
      try {
        const { data: { user: authUser } } = await supabase.auth.getUser();
        if (authUser) {
          // Fetch stats
          const response = await fetch(API_ENDPOINTS.USER_STATS(authUser.id));
          if (response.ok) {
            const data = await response.json();
            setStats(data);
          }

          // Fetch profile name
          const { data: profile } = await supabase
            .from("profiles")
            .select("full_name")
            .eq("id", authUser.id)
            .single();
          if (profile?.full_name) {
            setUserName(profile.full_name);
          }
        }
      } catch (error) {
        console.error("Error fetching user stats:", error);
      } finally {
        setStatsLoading(false);
      }
    };

    fetchUserStats();
  }, []);

  const statCards = [
    { label: 'Total Submissions', value: statsLoading ? '...' : stats.totalSubmissions.toString(), sub: 'Tasks completed by you', icon: Database },
    { label: 'Validation Queue', value: statsLoading ? '...' : stats.inValidation.toString(), sub: 'Awaiting validation', icon: Clock },
    { label: 'Accepted Units', value: statsLoading ? '...' : stats.accepted.toString(), sub: 'Validated & accepted', icon: CheckCircle },
    { label: 'Acceptance Rate', value: statsLoading ? '...' : stats.acceptanceRate, sub: stats.accepted > 0 ? 'High fidelity' : 'No data yet', icon: Activity },
  ];

  return (
    <div className="space-y-6 animate-in fade-in duration-500">

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-zinc-200 dark:border-white/10">
        <div>
          <h1 className="text-2xl font-bold text-zinc-900 dark:text-white tracking-tight">Dashboard</h1>
          <p className="text-zinc-500 text-sm mt-1">
            Welcome back, {userName}
          </p>
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

      {/* KPI Stats - Real Data */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {statCards.map((stat, idx) => (
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

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white dark:bg-white/5 rounded-lg border border-zinc-200 dark:border-white/10 p-6 hover:border-blue-300 dark:hover:border-blue-700 transition-colors cursor-pointer group" onClick={() => onNavigate('tasks')}>
          <div className="flex items-center gap-4 mb-3">
            <div className="h-10 w-10 bg-blue-100 dark:bg-blue-900/30 rounded-lg flex items-center justify-center text-blue-600 dark:text-blue-400 group-hover:scale-110 transition-transform">
              <Database className="h-5 w-5" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-zinc-900 dark:text-white">Browse Available Tasks</h3>
              <p className="text-xs text-zinc-500 mt-0.5">Find new tasks to contribute to</p>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-white/5 rounded-lg border border-zinc-200 dark:border-white/10 p-6 hover:border-emerald-300 dark:hover:border-emerald-700 transition-colors cursor-pointer group" onClick={() => onNavigate('earnings')}>
          <div className="flex items-center gap-4 mb-3">
            <div className="h-10 w-10 bg-emerald-100 dark:bg-emerald-900/30 rounded-lg flex items-center justify-center text-emerald-600 dark:text-emerald-400 group-hover:scale-110 transition-transform">
              <BarChart3 className="h-5 w-5" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-zinc-900 dark:text-white">View Earnings</h3>
              <p className="text-xs text-zinc-500 mt-0.5">Check your compensation details</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};