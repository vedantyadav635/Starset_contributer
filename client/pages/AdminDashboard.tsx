import React, { useEffect, useState } from 'react';
import {
  Users,
  Database,
  Activity,
  Trash2,
  ArrowRight,
  ClipboardList,
  PlusCircle,
} from 'lucide-react';

import { PageView, Task } from '../types';
import { Button } from '../components/Button';
import { Waveform } from '../components/Waveform';

interface AdminDashboardProps {
  onNavigate: (page: PageView) => void;
  tasks?: Task[];
}

interface DashboardStats {
  totalUsers: number;
  activeTasks: number;
  totalSubmissions: number;
  deletedTasks: number;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({ onNavigate, tasks = [] }) => {
  const [stats, setStats] = useState<DashboardStats>({
    totalUsers: 0,
    activeTasks: 0,
    totalSubmissions: 0,
    deletedTasks: 0,
  });
  const [statsLoading, setStatsLoading] = useState(true);
  const [statsError, setStatsError] = useState<string | null>(null);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const { API_ENDPOINTS } = await import('../config/api');
        const { fetchApi } = await import('../lib/api');
        const response = await fetchApi(API_ENDPOINTS.ADMIN_STATS);
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
        setStatsError('Could not load platform statistics.');
      } finally {
        setStatsLoading(false);
      }
    };

    fetchStats();
  }, []);

  const value = (n: number) => (statsLoading ? '—' : n.toLocaleString());

  const cards = [
    { label: 'Registered users', value: value(stats.totalUsers), caption: 'Accounts on the platform', icon: Users },
    { label: 'Active collections', value: value(stats.activeTasks), caption: 'Tasks open to contributors', icon: Database },
    { label: 'Submissions', value: value(stats.totalSubmissions), caption: 'Received all-time', icon: Activity },
    { label: 'Removed tasks', value: value(stats.deletedTasks), caption: 'Deleted or withdrawn', icon: Trash2 },
  ];

  const recentTasks = tasks.slice(0, 5);

  return (
    <div className="space-y-6">
      {/* ── Header ── */}
      <header className="flex flex-col gap-4 border-b border-line pb-6 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="t-meta">Console</p>
          <h1 className="t-h2 mt-1.5">Operations overview</h1>
          <p className="mt-2 flex items-center gap-2 text-sm text-body">
            <span className="h-1.5 w-1.5 rounded-full bg-[var(--ok)] pulse-dot" aria-hidden="true" />
            Platform online
          </p>
        </div>

        <div className="flex flex-wrap gap-2">
          <Button variant="secondary" onClick={() => onNavigate('admin-submissions')}>
            <ClipboardList className="h-4 w-4" strokeWidth={1.75} aria-hidden="true" />
            Review queue
          </Button>
          <Button onClick={() => onNavigate('admin-create-task')}>
            <PlusCircle className="h-4 w-4" strokeWidth={1.75} aria-hidden="true" />
            New collection
          </Button>
        </div>
      </header>

      {statsError && (
        <div
          role="alert"
          className="rounded-md border border-[color-mix(in_srgb,var(--danger)_30%,transparent)] bg-danger-soft px-4 py-3 text-sm text-[color:var(--danger)]"
        >
          {statsError}
        </div>
      )}

      {/* ── Stats ── */}
      <section aria-label="Platform statistics">
        <div className="grid gap-px overflow-hidden rounded-lg border border-line bg-line sm:grid-cols-2 lg:grid-cols-4">
          {cards.map((card) => (
            <div key={card.label} className="bg-surface p-5">
              <div className="flex items-start justify-between gap-3">
                <p className="stat-label">{card.label}</p>
                <card.icon className="h-4 w-4 flex-none text-muted" strokeWidth={1.75} aria-hidden="true" />
              </div>
              <p className="stat-value mt-3">{card.value}</p>
              <p className="mt-1.5 text-xs text-muted">{card.caption}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── Two-up ── */}
      <div className="grid gap-4 lg:grid-cols-[minmax(0,1.3fr)_minmax(0,1fr)]">
        {/* Recent collections */}
        <section className="panel overflow-hidden">
          <div className="panel-head">
            <h2 className="text-sm font-semibold text-ink">Recent collections</h2>
            <button type="button" onClick={() => onNavigate('tasks')} className="link-arrow text-body hover:text-ink">
              Registry
              <ArrowRight className="h-3.5 w-3.5" strokeWidth={2} aria-hidden="true" />
            </button>
          </div>

          {recentTasks.length > 0 ? (
            <ul className="divide-y divide-line-faint">
              {recentTasks.map((task) => (
                <li key={task.id} className="flex items-center gap-4 px-5 py-4">
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-medium text-ink">{task.title}</p>
                    <p className="t-meta mt-1">
                      {task.type} · {task.language} · ₹{Number(task.compensation).toFixed(2)}
                    </p>
                  </div>
                  <div className="hidden w-28 flex-none sm:block">
                    <Waveform seed={task.id} bars={24} height={18} color="var(--line-strong)" />
                  </div>
                  <span className="t-meta flex-none tnum">{task.submissionCount ?? 0}/100</span>
                </li>
              ))}
            </ul>
          ) : (
            <div className="px-5 py-12 text-center">
              <p className="text-sm text-body">No collections published yet.</p>
              <Button className="mt-4" size="sm" onClick={() => onNavigate('admin-create-task')}>
                Create the first one
              </Button>
            </div>
          )}
        </section>

        {/* Shortcuts */}
        <section className="panel overflow-hidden">
          <div className="panel-head">
            <h2 className="text-sm font-semibold text-ink">Jump to</h2>
          </div>

          <ul className="divide-y divide-line-faint">
            {[
              {
                icon: ClipboardList,
                title: 'Review queue',
                body: 'Listen to pending submissions and approve or reject with a reason.',
                page: 'admin-submissions' as PageView,
              },
              {
                icon: PlusCircle,
                title: 'Publish a collection',
                body: 'Define the prompt, language, duration bounds and compensation.',
                page: 'admin-create-task' as PageView,
              },
              {
                icon: Database,
                title: 'Task registry',
                body: 'Inspect live collections and export their metadata as JSON.',
                page: 'tasks' as PageView,
              },
            ].map((item) => (
              <li key={item.title}>
                <button
                  type="button"
                  onClick={() => onNavigate(item.page)}
                  className="group flex w-full items-start gap-3.5 px-5 py-4 text-left transition-colors hover:bg-paper-sunk"
                >
                  <span className="mt-0.5 flex h-8 w-8 flex-none items-center justify-center rounded-md border border-line bg-paper-sunk text-muted group-hover:text-ink">
                    <item.icon className="h-4 w-4" strokeWidth={1.75} aria-hidden="true" />
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="block text-sm font-medium text-ink">{item.title}</span>
                    <span className="mt-0.5 block text-xs leading-relaxed text-body">{item.body}</span>
                  </span>
                  <ArrowRight
                    className="mt-2 h-4 w-4 flex-none text-faint transition-transform group-hover:translate-x-0.5 group-hover:text-ink"
                    strokeWidth={1.75}
                    aria-hidden="true"
                  />
                </button>
              </li>
            ))}
          </ul>
        </section>
      </div>
    </div>
  );
};
