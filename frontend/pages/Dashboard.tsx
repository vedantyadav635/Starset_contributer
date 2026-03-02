import React, { useEffect, useState } from 'react';
import { PageView } from '../types';
import { Button } from '../components/Button';
import {
  Database,
  Clock,
  CheckCircle,
  Activity,
  BarChart3,
  ArrowRight,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { supabase } from '../supabaseClient';

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

  // Fetch user-specific stats directly from Supabase
  useEffect(() => {
    let subscription: any;

    const fetchUserStats = async () => {
      try {
        const { data: { user: authUser } } = await supabase.auth.getUser();
        if (!authUser) return;

        // Fetch all user submissions with both status columns
        const { data: submissions } = await supabase
          .from('submissions')
          .select('status, validation_status')
          .eq('user_id', authUser.id);

        if (submissions) {
          const total = submissions.length;

          // Accepted = auto-validated and passed (in final bucket) OR admin approved
          const accepted = submissions.filter((s: any) =>
            ['auto_passed', 'approved'].includes(s.validation_status) ||
            ['accepted', 'validated', 'approved'].includes(s.status)
          ).length;

          // Awaiting validation = still being processed in the pipeline
          const inValidation = submissions.filter((s: any) =>
            s.validation_status === 'pending' ||
            (s.status === 'pending_validation' && !['auto_passed', 'auto_failed', 'approved', 'rejected'].includes(s.validation_status))
          ).length;

          const rate = total > 0 ? ((accepted / total) * 100).toFixed(1) + '%' : '0.0%';
          setStats({ totalSubmissions: total, inValidation, accepted, acceptanceRate: rate });
        }

        // Fetch profile name
        const { data: profile } = await supabase
          .from('profiles')
          .select('full_name')
          .eq('id', authUser.id)
          .single();
        if (profile?.full_name) setUserName(profile.full_name);

        // 🔴 Real-time subscription: re-fetch stats whenever a submission changes
        // This means the dashboard updates automatically when background validation completes
        subscription = supabase
          .channel('dashboard-submissions')
          .on(
            'postgres_changes',
            {
              event: 'UPDATE',
              schema: 'public',
              table: 'submissions',
              filter: `user_id=eq.${authUser.id}`,
            },
            (payload) => {
              console.log('📡 Submission updated in real-time:', payload.new);
              fetchUserStats(); // Re-fetch to get accurate counts
            }
          )
          .subscribe();

      } catch (error) {
        console.error('Error fetching user stats:', error);
      } finally {
        setStatsLoading(false);
      }
    };

    fetchUserStats();

    // Cleanup subscription on unmount
    return () => {
      if (subscription) supabase.removeChannel(subscription);
    };
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
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
        {statCards.map((stat, idx) => (
          <div key={idx} className="bg-white dark:bg-zinc-900 p-6 md:p-7 rounded-[2rem] border border-stone-200 dark:border-white/10 shadow-sm transition-all hover:shadow-lg hover:scale-[1.02] duration-300 group">
            <div className="flex items-center justify-between mb-6">
              <div className={`p-3 rounded-2xl transition-colors ${stat.label === 'Acceptance' ? 'bg-blue-50 dark:bg-blue-900/20 text-blue-600' : stat.label === 'Accepted' ? 'bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600' : stat.label === 'In Review' ? 'bg-amber-50 dark:bg-amber-900/20 text-amber-600' : 'bg-purple-50 dark:bg-purple-900/20 text-purple-600'}`}>
                <stat.icon className="h-6 w-6" />
              </div>
              <span className="text-[10px] font-black text-zinc-400 uppercase tracking-[0.2em]">{stat.label}</span>
            </div>
            <div className="text-3xl md:text-4xl font-black text-zinc-900 dark:text-white mb-2 tracking-tight group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">{stat.value}</div>
            <div className="text-xs font-bold text-zinc-500 uppercase tracking-widest">{stat.sub}</div>
          </div>
        ))}
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
        <div className="bg-zinc-900 text-white rounded-[2.5rem] p-8 md:p-10 relative overflow-hidden group cursor-pointer" onClick={() => onNavigate('tasks')}>
          <div className="absolute top-0 right-0 w-[60%] h-full bg-gradient-to-l from-blue-600/20 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700"></div>
          <div className="relative z-10">
            <div className="h-14 w-14 bg-white/10 rounded-2xl flex items-center justify-center text-blue-400 mb-6 group-hover:scale-110 transition-transform duration-500">
              <Database className="h-7 w-7" />
            </div>
            <h3 className="text-2xl font-black mb-2 tracking-tight">Active Operation Tasks</h3>
            <p className="text-stone-400 font-medium mb-6">Contribute high-quality data to the network.</p>
            <div className="inline-flex items-center text-sm font-black uppercase tracking-widest text-blue-400 group-hover:translate-x-2 transition-transform">
              Launch Terminal <ArrowRight className="ml-2 h-4 w-4" />
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-zinc-900 rounded-[2.5rem] border border-stone-200 dark:border-white/10 p-8 md:p-10 relative overflow-hidden group cursor-pointer" onClick={() => onNavigate('earnings')}>
          <div className="absolute top-0 right-0 w-[60%] h-full bg-gradient-to-l from-emerald-600/5 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700"></div>
          <div className="relative z-10">
            <div className="h-14 w-14 bg-emerald-50 dark:bg-emerald-900/20 rounded-2xl flex items-center justify-center text-emerald-600 dark:text-emerald-400 mb-6 group-hover:scale-110 transition-transform duration-500">
              <BarChart3 className="h-7 w-7" />
            </div>
            <h3 className="text-2xl font-black mb-2 tracking-tight text-zinc-900 dark:text-white">Financial Yield</h3>
            <p className="text-stone-500 dark:text-stone-400 font-medium mb-6">Track your contribution rewards.</p>
            <div className="inline-flex items-center text-sm font-black uppercase tracking-widest text-emerald-600 dark:text-emerald-400 group-hover:translate-x-2 transition-transform">
              View Audit <ArrowRight className="ml-2 h-4 w-4" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};