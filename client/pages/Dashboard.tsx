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
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-200 dark:border-white/10">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white tracking-tight">Dashboard</h1>
          <p className="text-zinc-500 text-sm mt-1">
            Welcome back, {userName}
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="secondary" onClick={() => onNavigate('tasks')} size="sm" className="bg-slate-100 dark:bg-white/10 text-slate-700 dark:text-white border-slate-200 dark:border-white/10 hover:bg-slate-200 dark:hover:bg-white/20">
            View Data Tasks
          </Button>
        </div>
      </div>

      {/* KPI Stats - Real Data */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
        {statCards.map((stat, idx) => (
          <div key={idx} className="bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-white/5 dark:to-white/5 p-6 md:p-7 rounded-[32px] border border-blue-100 dark:border-white/10 shadow-xl shadow-slate-200/50 dark:shadow-none transition-all hover:shadow-2xl hover:-translate-y-1 duration-300 group overflow-hidden relative">
             <div className="absolute top-0 right-0 w-[150px] h-[150px] bg-blue-600/10 dark:bg-blue-500/20 blur-[40px] rounded-full translate-x-1/2 -translate-y-1/2 pointer-events-none z-0" />
             <div className="relative z-10">
            <div className="flex items-center justify-between mb-6">
              <div className={`p-3 rounded-2xl transition-colors ${stat.label === 'Acceptance' ? 'bg-blue-900/20 text-blue-400' : stat.label === 'Accepted' ? 'bg-emerald-900/20 text-emerald-400' : stat.label === 'In Review' ? 'bg-amber-900/20 text-amber-400' : 'bg-purple-900/20 text-purple-400'}`}>
                <stat.icon className="h-6 w-6" />
              </div>
              <span className="text-[10px] font-black text-zinc-400 uppercase tracking-[0.2em]">{stat.label}</span>
            </div>
            <div className="text-3xl md:text-4xl font-extrabold text-slate-900 dark:text-white mb-2 tracking-tight group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">{stat.value}</div>
            </div>
          </div>
        ))}
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 gap-6 mt-8">
        <div className="bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-white/5 dark:to-white/5 text-slate-900 dark:text-white rounded-[32px] border border-blue-100 dark:border-white/10 shadow-xl shadow-slate-200/50 dark:shadow-none p-8 md:p-10 relative overflow-hidden group cursor-pointer transition-all hover:-translate-y-1 hover:shadow-2xl" onClick={() => onNavigate('tasks')}>
          <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-blue-600/10 dark:bg-blue-500/20 blur-[80px] rounded-full translate-x-1/3 -translate-y-1/3 pointer-events-none z-0" />
          <div className="absolute top-0 right-0 w-[60%] h-full bg-gradient-to-l from-blue-600/10 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700"></div>
          <div className="relative z-10">
            <div className="h-14 w-14 bg-slate-100 dark:bg-white/10 rounded-2xl flex items-center justify-center text-blue-500 dark:text-blue-400 mb-6 group-hover:scale-110 transition-transform duration-500">
              <Database className="h-7 w-7" />
            </div>
            <h3 className="text-2xl font-black mb-2 tracking-tight">Available Tasks</h3>
            <p className="text-slate-500 dark:text-stone-400 font-medium mb-6">Contribute high-quality data to the network.</p>
            <div className="inline-flex items-center text-sm font-black uppercase tracking-widest text-blue-400 group-hover:translate-x-2 transition-transform">
              Browse Tasks <ArrowRight className="ml-2 h-4 w-4" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
