import React, { useState, useEffect, Suspense, lazy } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

// ── Lazy-loaded pages ─────────────────────────────────────────────────────
const Dashboard = lazy(() => import('./pages/Dashboard').then(m => ({ default: m.Dashboard })));
const TaskList = lazy(() => import('./pages/TaskList').then(m => ({ default: m.TaskList })));
const TaskExecution = lazy(() => import('./pages/TaskExecution').then(m => ({ default: m.TaskExecution })));
const Earnings = lazy(() => import('./pages/Earnings').then(m => ({ default: m.Earnings })));
const Login = lazy(() => import('./pages/Login').then(m => ({ default: m.Login })));
const Signup = lazy(() => import('./pages/Signup').then(m => ({ default: m.Signup })));
const LandingPage = lazy(() => import('./pages/LandingPage').then(m => ({ default: m.LandingPage })));
const About = lazy(() => import('./pages/About').then(m => ({ default: m.About })));
const Marketplace = lazy(() => import('./pages/Marketplace').then(m => ({ default: m.Marketplace })));
const AdminCreateTask = lazy(() => import('./pages/AdminCreateTask').then(m => ({ default: m.AdminCreateTask })));
const AdminDashboard = lazy(() => import('./pages/AdminDashboard').then(m => ({ default: m.AdminDashboard })));
const AdminSubmissions = lazy(() => import('./pages/AdminSubmissions').then(m => ({ default: m.AdminSubmissions })));
const ForgotPassword = lazy(() => import('./pages/ForgotPassword').then(m => ({ default: m.ForgotPassword })));
const ResetPassword = lazy(() => import('./pages/ResetPassword').then(m => ({ default: m.ResetPassword })));
const CompleteProfile = lazy(() => import('./pages/CompleteProfile').then(m => ({ default: m.default })));
const Legal = lazy(() => import('./pages/Legal').then(m => ({ default: m.Legal })));
const Careers = lazy(() => import('./pages/Careers').then(m => ({ default: m.Careers })));
const Blog = lazy(() => import('./pages/Blog').then(m => ({ default: m.Blog })));
const Contact = lazy(() => import('./pages/Contact').then(m => ({ default: m.Contact })));
const AITrainingGuide = lazy(() => import('./pages/AITrainingGuide').then(m => ({ default: m.AITrainingGuide })));

import { PageView, Task, UserRole } from './types';

import {
  LayoutDashboard,
  Database,
  BadgeIndianRupee,
  User,
  MapPin,
  Mail,
  ShieldCheck,
  ShieldAlert,
  Mic,
  PenLine,
  LifeBuoy,
  Send,
  Menu,
  CheckCircle2,
  Volume2,
  Clock,
  AlertTriangle,
} from 'lucide-react';

import { LogoLockup } from './components/Logo';
import { API_URL } from './config/api';
import { PublicPageType } from './components/PublicLayout';
import { supabase } from './supabaseClient';
import { Sidebar } from './components/Sidebar';
import { Button } from './components/Button';
import { ThemeToggle } from './components/ThemeToggle';
import { SpecList } from './components/ui/Layout';
import { Waveform } from './components/Waveform';
import { cn } from './lib/utils';

// ============================================================================
// CONSTANTS
// ============================================================================

/** Auto sign-out after 15 minutes of inactivity. */
const INACTIVITY_LIMIT_MS = 15 * 60 * 1000;

/** Ping the backend every 9 minutes so a free-tier host stays warm. */
const KEEP_ALIVE_INTERVAL_MS = 9 * 60 * 1000;

/** Public routes that map straight onto a PublicPageType. */
const PUBLIC_PAGES: PublicPageType[] = [
  'home', 'marketplace', 'about', 'ai-training-guide',
  'careers', 'blog', 'contact', 'terms', 'privacy', 'cookies', 'data-processing',
];

/** Public routes that have moved. Old URL → new slug. */
const LEGACY_REDIRECTS: Record<string, PublicPageType> = {
  'for-ai': 'marketplace',
};

// ============================================================================
// SHARED SHELL PIECES
// ============================================================================

const PageLoader = () => (
  <div className="fixed inset-0 z-[1000] flex items-center justify-center bg-paper">
    <div className="flex flex-col items-center gap-4">
      <div className="w-40">
        <Waveform seed="loading" bars={28} height={26} live color="var(--line-strong)" />
      </div>
      <span className="t-meta">Loading</span>
    </div>
  </div>
);

/** Consistent heading for the product-side inline views. */
const ViewHeader: React.FC<{ kicker: string; title: string; lede?: string }> = ({ kicker, title, lede }) => (
  <header className="border-b border-line pb-6">
    <p className="t-meta">{kicker}</p>
    <h1 className="t-h2 mt-1.5">{title}</h1>
    {lede && <p className="mt-2 max-w-2xl text-sm text-body">{lede}</p>}
  </header>
);

// ============================================================================
// MAIN APP
// ============================================================================

const App: React.FC = () => {
  // ── Navigation state ──
  const [viewMode, setViewMode] = useState<'public' | 'app'>('public');
  const [authMode, setAuthMode] = useState<'login' | 'signup' | 'forgot-password' | 'reset-password'>('login');
  const [publicPage, setPublicPage] = useState<PublicPageType>('home');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userRole, setUserRole] = useState<UserRole>('contributor');
  const [currentPage, setCurrentPage] = useState<PageView>('dashboard');
  const [isMobileNavOpen, setIsMobileNavOpen] = useState(false);
  const [activeTask, setActiveTask] = useState<Task | null>(null);
  const [userProfile, setUserProfile] = useState<any>(null);

  // ── Data state ──
  const [tasks, setTasks] = useState<Task[]>([]);
  const [completedTaskIds, setCompletedTaskIds] = useState<string[]>([]);

  const navigate = useNavigate();
  const location = useLocation();

  // --------------------------------------------------------------------------
  // URL SYNC — keeps the back button working
  // --------------------------------------------------------------------------
  useEffect(() => {
    const path = location.pathname;

    if (path === '/login') {
      setViewMode('app');
      setAuthMode('login');
    } else if (path === '/signup') {
      setViewMode('app');
      setAuthMode('signup');
    } else if (path === '/forgot-password') {
      setViewMode('app');
      setAuthMode('forgot-password');
    } else if (path === '/reset-password') {
      setViewMode('app');
      setAuthMode('reset-password');
    } else if (path.startsWith('/dashboard')) {
      if (isAuthenticated) {
        setViewMode('app');
        const parts = path.split('/');
        if (parts[2]) {
          setCurrentPage(parts[2] as PageView);
        } else {
          setCurrentPage(userRole === 'admin' ? 'admin-dashboard' : 'dashboard');
        }
      }
    } else {
      setViewMode('public');
      const slug = (path.substring(1) || 'home') as PublicPageType;

      // Routes that moved. Redirect rather than silently serving the homepage,
      // so old links and anything already indexed land where they should.
      const moved = LEGACY_REDIRECTS[slug as string];
      if (moved) {
        navigate('/' + moved, { replace: true });
        return;
      }

      setPublicPage(PUBLIC_PAGES.includes(slug) ? slug : 'home');
    }
  }, [location.pathname, isAuthenticated, userRole, navigate]);

  // --------------------------------------------------------------------------
  // SESSION RESTORE
  // --------------------------------------------------------------------------
  useEffect(() => {
    if (window.location.hash.includes('reset-password') || window.location.hash.includes('type=recovery')) {
      setViewMode('app');
      setAuthMode('reset-password');
    }

    const restoreSession = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();

        if (session?.user) {
          const { data: profile, error: profileError } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', session.user.id)
            .single();

          if (profile && !profileError) {
            setUserProfile({ ...profile, email: session.user.email });
            setUserRole(profile.role || 'contributor');
            setIsAuthenticated(true);
            setViewMode('app');

            if (!profile.profile_completed) {
              setCurrentPage('complete-profile');
            } else {
              setCurrentPage((profile.role || 'contributor') === 'admin' ? 'admin-dashboard' : 'dashboard');
            }
          }
        }
      } catch (err) {
        console.error('Error restoring session:', err);
      }
    };

    restoreSession();

    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event) => {
      if (event === 'SIGNED_OUT') {
        setIsAuthenticated(false);
        setUserProfile(null);
        setViewMode('public');
        setPublicPage('home');
      }
      if (event === 'PASSWORD_RECOVERY') {
        setViewMode('app');
        setAuthMode('reset-password');
      }
    });

    return () => { subscription.unsubscribe(); };
  }, []);

  // --------------------------------------------------------------------------
  // TASKS
  // --------------------------------------------------------------------------
  useEffect(() => {
    const fetchTasks = async () => {
      if (!isAuthenticated) {
        setTasks([]);
        return;
      }

      try {
        const { API_ENDPOINTS } = await import('./config/api');
        const { fetchApi } = await import('./lib/api');

        const endpoint = userRole === 'admin'
          ? API_ENDPOINTS.ADMIN_TASKS
          : API_ENDPOINTS.CONTRIBUTOR_TASKS;

        const response = await fetchApi(endpoint);

        if (!response.ok) {
          throw new Error(`Failed to fetch tasks: ${response.status} ${response.statusText}`);
        }

        const data = await response.json();

        const mappedTasks: Task[] = (data || []).map((t: any) => ({
          id: t.id,
          title: t.title,
          type: t.type,
          compensation: t.compensation,
          currency: t.currency || 'INR',
          estimatedTimeSec: t.estimated_time_min || t.estimatedTimeSec || 0,
          status: t.status,
          language: t.language,
          instructions: t.instructions,
          deadline: t.deadline,
          imageUrl: t.image_url ?? t.imageUrl,
          aiCapability: t.ai_capability ?? t.aiCapability ?? '',
          dataUsage: t.data_usage ?? t.dataUsage ?? '',
          prompt: t.prompt || '',
          options: t.options,
          project: t.project || '',
          difficulty: t.difficulty || 'Beginner',
          requirements: t.requirements || [],
          submissionCount: t.submission_count ?? 0,
        }));

        setTasks(mappedTasks);
      } catch (err) {
        console.error('Error fetching tasks via API:', err);
      }
    };

    fetchTasks();
  }, [isAuthenticated, userRole]);

  // --------------------------------------------------------------------------
  // COMPLETED TASKS
  // --------------------------------------------------------------------------
  useEffect(() => {
    const fetchCompletedTasks = async () => {
      if (isAuthenticated && userProfile) {
        try {
          const { data: { user } } = await supabase.auth.getUser();
          if (user) {
            const { data, error } = await supabase
              .from('submissions')
              .select('task_id')
              .eq('user_id', user.id);

            if (!error && data) {
              setCompletedTaskIds(data.map((s: any) => s.task_id).filter(Boolean));
            }
          }
        } catch (err) {
          console.error('Error fetching completed tasks:', err);
        }
      } else {
        setCompletedTaskIds([]);
      }
    };

    fetchCompletedTasks();
  }, [isAuthenticated, userProfile]);

  // --------------------------------------------------------------------------
  // INACTIVITY SIGN-OUT
  // --------------------------------------------------------------------------
  useEffect(() => {
    if (!isAuthenticated) return;

    let inactivityTimer: number;

    const resetTimer = () => {
      clearTimeout(inactivityTimer);
      inactivityTimer = window.setTimeout(() => {
        handleLogout();
        alert('You were signed out after 15 minutes of inactivity.');
      }, INACTIVITY_LIMIT_MS);
    };

    window.addEventListener('mousemove', resetTimer);
    window.addEventListener('keypress', resetTimer);
    window.addEventListener('click', resetTimer);
    window.addEventListener('scroll', resetTimer);

    resetTimer();

    return () => {
      clearTimeout(inactivityTimer);
      window.removeEventListener('mousemove', resetTimer);
      window.removeEventListener('keypress', resetTimer);
      window.removeEventListener('click', resetTimer);
      window.removeEventListener('scroll', resetTimer);
    };
  }, [isAuthenticated]);

  // --------------------------------------------------------------------------
  // KEEP-ALIVE
  // --------------------------------------------------------------------------
  useEffect(() => {
    const ping = () => { fetch(`${API_URL}/health`).catch(() => { }); };
    ping();
    const interval = window.setInterval(ping, KEEP_ALIVE_INTERVAL_MS);
    return () => window.clearInterval(interval);
  }, []);

  // --------------------------------------------------------------------------
  // HANDLERS
  // --------------------------------------------------------------------------

  const handleEnterApp = () => navigate('/login');
  const handleStartSignup = () => navigate('/signup');

  const handleExitApp = () => {
    navigate('/');
    setIsAuthenticated(false);
  };

  const handleLogin = async (role: UserRole) => {
    try {
      const { data: { user }, error: userError } = await supabase.auth.getUser();

      if (userError || !user) {
        console.error('Failed to get user:', userError);
        alert('Could not read your account. Please sign in again.');
        return;
      }

      const { data: profile, error: profileError } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single();

      if (profileError) {
        console.error('Profile fetch error:', profileError);
        alert(`Failed to load your profile: ${profileError.message}`);
        return;
      }

      if (!profile) {
        console.error('No profile found for user:', user.id);
        alert('No profile found for this account. Please contact support.');
        return;
      }

      setUserProfile({ ...profile, email: user.email });
      setUserRole(profile.role || 'contributor');
      setIsAuthenticated(true);

      if (!profile.profile_completed) {
        setCurrentPage('complete-profile');
      } else {
        setCurrentPage(role === 'admin' ? 'admin-dashboard' : 'dashboard');
      }
    } catch (err) {
      console.error('Unexpected error in handleLogin:', err);
      alert('An unexpected error occurred. Please try again.');
    }
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    setIsAuthenticated(false);
    setActiveTask(null);
    setUserProfile(null);
    setViewMode('public');
    setPublicPage('home');
  };

  const handleSelectTask = (task: Task) => {
    setActiveTask(task);
    navigate('/dashboard/execution');
  };

  const handleCompleteTask = () => {
    if (activeTask) {
      setCompletedTaskIds(prev => (prev.includes(activeTask.id) ? prev : [...prev, activeTask.id]));
    }
    setActiveTask(null);
    navigate('/dashboard/tasks');
  };

  const handleCreateTask = async (newTask: any) => {
    const mappedTask: Task = {
      id: newTask.id,
      title: newTask.title,
      type: newTask.type,
      compensation: newTask.compensation,
      currency: newTask.currency || 'INR',
      estimatedTimeSec: newTask.estimated_time_min ?? newTask.estimatedTimeSec,
      status: newTask.status,
      language: newTask.language,
      instructions: newTask.instructions,
      deadline: newTask.deadline,
      imageUrl: newTask.image_url ?? newTask.imageUrl,
      aiCapability: newTask.ai_capability ?? newTask.aiCapability ?? '',
      dataUsage: newTask.data_usage ?? newTask.dataUsage ?? '',
      prompt: newTask.prompt || '',
      options: newTask.options,
      project: newTask.project || '',
      difficulty: newTask.difficulty || 'Beginner',
      requirements: newTask.requirements || [],
    };
    setTasks(prev => [mappedTask, ...prev]);
    navigate('/dashboard/tasks');
  };

  const handleDeleteTask = async (taskId: string) => {
    try {
      const { API_ENDPOINTS } = await import('./config/api');
      const { fetchApi } = await import('./lib/api');
      const res = await fetchApi(API_ENDPOINTS.DELETE_TASK(taskId), { method: 'DELETE' });

      if (!res.ok) throw new Error('Failed to delete task');

      setTasks(prev => prev.filter(t => t.id !== taskId));
    } catch (err) {
      console.error('Error deleting task:', err);
      alert('Failed to delete the task.');
    }
  };

  const handlePublicNavigate = (page: PublicPageType) => {
    navigate(page === 'home' ? '/' : `/${page}`);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleAppNavigate = (page: PageView) => navigate(`/dashboard/${page}`);

  // --------------------------------------------------------------------------
  // INLINE PRODUCT VIEWS
  // --------------------------------------------------------------------------

  const renderGuidelines = () => (
    <div className="mx-auto w-full max-w-4xl space-y-6">
      <ViewHeader
        kicker="Reference"
        title="Quality standards"
        lede="What a reviewer listens for, and the specific reasons a submission gets rejected. Only accepted submissions are compensated."
      />

      <section className="panel overflow-hidden">
        <div className="panel-head">
          <h2 className="flex items-center gap-2 text-sm font-semibold text-ink">
            <Mic className="h-4 w-4 text-muted" strokeWidth={1.75} aria-hidden="true" />
            Audio recording
          </h2>
          <span className="t-meta">Most collections</span>
        </div>

        <div className="panel-body">
          <p className="max-w-prose text-body">
            The single biggest cause of rejection is the room, not the microphone. Find somewhere
            quiet, then speak at your normal pace — neither rushed nor artificially slowed.
          </p>

          <div className="mt-5 grid gap-4 sm:grid-cols-2">
            <div className="rounded-md border border-line p-4">
              <p className="flex items-center gap-2 text-sm font-semibold text-ink">
                <CheckCircle2 className="h-4 w-4 text-[color:var(--ok)]" strokeWidth={2} aria-hidden="true" />
                Do
              </p>
              <ul className="mt-3 space-y-2">
                {[
                  'Record somewhere quiet, away from TV, fans and traffic',
                  'Read the script exactly as written',
                  'Speak clearly at a natural pace',
                  'Play the take back before you submit it',
                ].map(item => (
                  <li key={item} className="flex gap-2.5 text-sm text-body">
                    <span className="mt-2 h-1 w-1 flex-none rounded-full bg-[var(--ok)]" aria-hidden="true" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>

            <div className="rounded-md border border-line p-4">
              <p className="flex items-center gap-2 text-sm font-semibold text-ink">
                <AlertTriangle className="h-4 w-4 text-[color:var(--danger)]" strokeWidth={2} aria-hidden="true" />
                Avoid
              </p>
              <ul className="mt-3 space-y-2">
                {[
                  'Background conversation or music',
                  'Paraphrasing instead of reading the prompt',
                  'Cutting the recording before you finish speaking',
                  'Submitting a take you have not listened to',
                ].map(item => (
                  <li key={item} className="flex gap-2.5 text-sm text-body">
                    <span className="mt-2 h-1 w-1 flex-none rounded-full bg-[var(--danger)]" aria-hidden="true" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        <div className="border-t border-line bg-paper-sunk px-5 py-4">
          <p className="t-meta mb-3">Enforced automatically at upload</p>
          <SpecList
            items={[
              { label: 'Minimum duration', value: '1.5 s' },
              { label: 'Maximum duration', value: '90 s' },
              { label: 'Minimum file size', value: '1 KB' },
              { label: 'Maximum file size', value: '15 MB' },
              { label: 'Silence screening', value: 'Energy estimate' },
            ]}
          />
        </div>
      </section>

      <section className="panel">
        <div className="panel-head">
          <h2 className="flex items-center gap-2 text-sm font-semibold text-ink">
            <PenLine className="h-4 w-4 text-muted" strokeWidth={1.75} aria-hidden="true" />
            Text and labelling
          </h2>
        </div>
        <div className="panel-body">
          <p className="max-w-prose text-body">
            Use proper grammar, capitalisation and punctuation unless the task explicitly asks for
            something else. For labelling, a short accurate description is worth more than a long
            vague one — say what is actually there, not what is probably there.
          </p>
        </div>
      </section>

      <section className="panel">
        <div className="panel-head">
          <h2 className="flex items-center gap-2 text-sm font-semibold text-ink">
            <Volume2 className="h-4 w-4 text-muted" strokeWidth={1.75} aria-hidden="true" />
            Rejection reasons you may see
          </h2>
        </div>
        <ul className="divide-y divide-line-faint">
          {[
            'Audio is silent or inaudible',
            'Background noise too loud',
            'Wrong script — the prompt was not followed',
            'Recording too short',
            'Audio quality too poor',
            'Duplicate submission',
          ].map(reason => (
            <li key={reason} className="px-5 py-3.5 text-sm text-body">{reason}</li>
          ))}
        </ul>
        <div className="border-t border-line bg-paper-sunk px-5 py-3">
          <p className="text-xs text-body">
            Repeated quality failures can lead to account suspension. The reason is always shown so
            it can be fixed.
          </p>
        </div>
      </section>
    </div>
  );

  const renderSupport = () => (
    <div className="mx-auto w-full max-w-4xl space-y-6">
      <ViewHeader
        kicker="Help"
        title="Support"
        lede="Problems with a task, a rejected submission, your profile, or a payout."
      />

      <div className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.2fr)]">
        <section className="panel h-max">
          <div className="panel-head">
            <h2 className="flex items-center gap-2 text-sm font-semibold text-ink">
              <LifeBuoy className="h-4 w-4 text-muted" strokeWidth={1.75} aria-hidden="true" />
              Before you write
            </h2>
          </div>
          <ul className="divide-y divide-line-faint">
            {[
              { icon: Clock, title: 'Submission still in review?', body: 'Most decisions land within about 24 hours. Your status is on the Compensation page.' },
              { icon: ShieldCheck, title: 'Submission rejected?', body: 'The specific reason is recorded against it. The quality standards page explains each one.' },
              { icon: BadgeIndianRupee, title: 'Payout question?', body: 'Settlement is processed manually and goes to the UPI ID on your profile.' },
            ].map(item => (
              <li key={item.title} className="flex gap-3.5 px-5 py-4">
                <span className="mt-0.5 flex h-8 w-8 flex-none items-center justify-center rounded-md border border-line bg-paper-sunk text-muted">
                  <item.icon className="h-4 w-4" strokeWidth={1.75} aria-hidden="true" />
                </span>
                <div>
                  <p className="text-sm font-medium text-ink">{item.title}</p>
                  <p className="mt-0.5 text-xs leading-relaxed text-body">{item.body}</p>
                </div>
              </li>
            ))}
          </ul>
        </section>

        <section className="panel">
          <div className="panel-head">
            <h2 className="text-sm font-semibold text-ink">Contact support</h2>
            <span className="t-meta">support@starset.ai</span>
          </div>

          <form
            className="panel-body space-y-5"
            onSubmit={(e) => {
              e.preventDefault();
              const form = e.currentTarget;
              const issue = (form.elements.namedItem('issue') as HTMLSelectElement).value;
              const detail = (form.elements.namedItem('detail') as HTMLTextAreaElement).value;

              const body = [
                `Issue: ${issue}`,
                `Account: ${userProfile?.email || 'unknown'}`,
                '',
                detail,
              ].join('\n');

              // No support endpoint exists server-side, so this composes a real
              // email rather than pretending a ticket was filed.
              window.location.href =
                `mailto:support@starset.ai?subject=${encodeURIComponent(`Contributor support — ${issue}`)}&body=${encodeURIComponent(body)}`;
            }}
          >
            <div>
              <label className="field-label" htmlFor="support-issue">Issue type</label>
              <select id="support-issue" name="issue" className="field" defaultValue="A task or recording problem">
                <option>A task or recording problem</option>
                <option>A rejected submission</option>
                <option>Payout or UPI details</option>
                <option>Account access</option>
                <option>Something else</option>
              </select>
            </div>

            <div>
              <label className="field-label" htmlFor="support-detail">Details</label>
              <textarea
                id="support-detail"
                name="detail"
                required
                className="field min-h-[9rem]"
                placeholder="Include the task title or submission reference if you have it — it gets you a faster answer."
              />
              <p className="field-hint">
                This opens your email client with the details filled in, addressed to support.
              </p>
            </div>

            <Button type="submit" size="lg" block>
              Compose email
              <Send className="h-4 w-4" strokeWidth={2} aria-hidden="true" />
            </Button>
          </form>
        </section>
      </div>
    </div>
  );

  const renderAccount = () => {
    const isAdmin = userRole === 'admin';
    const displayName = userProfile?.full_name || (isAdmin ? 'Administrator' : 'Contributor');
    const initial = displayName.charAt(0).toUpperCase();

    const joined = userProfile?.created_at
      ? new Date(userProfile.created_at).toLocaleDateString('en-GB', { month: 'long', year: 'numeric' })
      : '—';

    return (
      <div className="mx-auto w-full max-w-4xl space-y-6">
        <ViewHeader
          kicker="Account"
          title="Your profile"
          lede={isAdmin
            ? 'Your administrator account and the privileges attached to it.'
            : 'Details used to match you to collections, and where your compensation settles.'}
        />

        {/* Identity */}
        <section className="panel">
          <div className="panel-body flex flex-col gap-5 sm:flex-row sm:items-center">
            <span
              className={cn(
                'flex h-14 w-14 flex-none items-center justify-center rounded-lg font-display text-xl font-semibold',
                isAdmin ? 'bg-signal-soft text-signal' : 'bg-paper-sunk text-ink',
              )}
              aria-hidden="true"
            >
              {initial}
            </span>

            <div className="min-w-0 flex-1">
              <div className="flex flex-wrap items-center gap-x-3 gap-y-1.5">
                <h2 className="t-h3">{displayName}</h2>
                <span className={cn('tag', isAdmin ? 'tag-signal' : 'tag-ok')}>
                  {isAdmin ? 'Administrator' : 'Contributor'}
                </span>
              </div>
              <p className="mt-1.5 flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-muted">
                <span className="flex items-center gap-1.5">
                  <Mail className="h-3 w-3" strokeWidth={2} aria-hidden="true" />
                  {userProfile?.email || '—'}
                </span>
                <span>Joined {joined}</span>
              </p>
            </div>

            {!isAdmin && userProfile?.contributor_id && (
              <div className="flex-none rounded-md border border-line bg-paper-sunk px-4 py-3 text-center">
                <p className="t-meta">Contributor ID</p>
                <p className="t-mono mt-1 text-ink">#{userProfile.contributor_id}</p>
              </div>
            )}
          </div>
        </section>

        <div className="grid gap-4 lg:grid-cols-2">
          {/* Profile details */}
          <section className="panel">
            <div className="panel-head">
              <h2 className="flex items-center gap-2 text-sm font-semibold text-ink">
                <User className="h-4 w-4 text-muted" strokeWidth={1.75} aria-hidden="true" />
                {isAdmin ? 'Account details' : 'Speaker profile'}
              </h2>
            </div>
            <div className="px-5 py-2">
              <SpecList
                items={isAdmin
                  ? [
                      { label: 'Role', value: userProfile?.role_text || 'Administrator' },
                      { label: 'Account ID', value: userProfile?.id ? `#${String(userProfile.id).slice(0, 8)}` : '—' },
                      { label: 'Email', value: userProfile?.email || '—' },
                      { label: 'Created', value: joined },
                    ]
                  : [
                      { label: 'Age', value: userProfile?.age || 'Not set' },
                      { label: 'Gender', value: userProfile?.gender || 'Not set' },
                      {
                        label: 'Location',
                        value: (
                          <span className="inline-flex items-center gap-1.5">
                            <MapPin className="h-3.5 w-3.5 text-muted" strokeWidth={1.75} aria-hidden="true" />
                            {userProfile?.city || '—'}{userProfile?.state ? `, ${userProfile.state}` : ''}
                          </span>
                        ),
                      },
                      { label: 'Trust score', value: `${userProfile?.trust_score ?? 100} / 100` },
                    ]}
              />
            </div>
            {!isAdmin && (
              <p className="border-t border-line bg-paper-sunk px-5 py-3 text-xs text-body">
                Used to match you to collections. Never attached to the audio itself.
              </p>
            )}
          </section>

          {/* Payout or privileges */}
          <section className="panel">
            <div className="panel-head">
              <h2 className="flex items-center gap-2 text-sm font-semibold text-ink">
                {isAdmin
                  ? <><ShieldCheck className="h-4 w-4 text-muted" strokeWidth={1.75} aria-hidden="true" /> Privileges</>
                  : <><BadgeIndianRupee className="h-4 w-4 text-muted" strokeWidth={1.75} aria-hidden="true" /> Payout</>}
              </h2>
            </div>

            {isAdmin ? (
              <ul className="divide-y divide-line-faint">
                {['Publish and withdraw collections', 'Review and decide submissions', 'Export task metadata', 'View platform statistics'].map(perm => (
                  <li key={perm} className="flex items-center gap-2.5 px-5 py-3.5 text-sm text-body">
                    <CheckCircle2 className="h-4 w-4 flex-none text-[color:var(--ok)]" strokeWidth={2} aria-hidden="true" />
                    {perm}
                  </li>
                ))}
              </ul>
            ) : (
              <div className="panel-body">
                <p className="t-meta">UPI ID</p>
                <p className="t-mono mt-1.5 truncate text-ink">{userProfile?.upi_id || 'Not set'}</p>
                <p className="mt-3 text-xs text-body">
                  Accepted work settles here. Settlement is processed manually by the team.
                </p>
                <Button
                  className="mt-5"
                  variant="secondary"
                  block
                  onClick={() => handleAppNavigate('earnings')}
                >
                  View compensation
                </Button>
              </div>
            )}
          </section>
        </div>

        {/* Danger zone */}
        <section className="rounded-lg border border-[color-mix(in_srgb,var(--danger)_25%,transparent)] bg-danger-soft">
          <div className="flex flex-col gap-4 p-5 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex gap-3.5">
              <ShieldAlert
                className="mt-0.5 h-4 w-4 flex-none text-[color:var(--danger)]"
                strokeWidth={1.75}
                aria-hidden="true"
              />
              <div>
                <h2 className="text-sm font-semibold text-ink">
                  {isAdmin ? 'Revoke administrator access' : 'Delete your account'}
                </h2>
                <p className="mt-1 max-w-lg text-xs text-body">
                  {isAdmin
                    ? 'Administrator access is revoked manually. Contact the platform owner to start the process.'
                    : 'Account deletion is handled by support so we can confirm your identity and settle anything outstanding first.'}
                </p>
              </div>
            </div>

            <Button
              variant="quiet-danger"
              className="flex-none self-start sm:self-auto"
              onClick={() => {
                const address = isAdmin ? 'root@starset.ai' : 'support@starset.ai';
                const subject = isAdmin ? 'Revoke administrator access' : 'Delete my Starset account';
                window.location.href = `mailto:${address}?subject=${encodeURIComponent(subject)}`;
              }}
            >
              Request removal
            </Button>
          </div>
        </section>
      </div>
    );
  };

  // --------------------------------------------------------------------------
  // RENDER
  // --------------------------------------------------------------------------

  const renderMainContent = () => {
    // ── Public site ──
    if (viewMode === 'public') {
      const publicProps = {
        onNavigate: handlePublicNavigate,
        onEnterApp: handleEnterApp,
      };

      switch (publicPage) {
        case 'about':
          return <About {...publicProps} />;
        case 'marketplace':
          return <Marketplace {...publicProps} />;
        case 'careers':
          return <Careers {...publicProps} />;
        case 'blog':
          return <Blog {...publicProps} />;
        case 'contact':
          return <Contact {...publicProps} />;
        case 'ai-training-guide':
          return <AITrainingGuide {...publicProps} onEnterApp={handleStartSignup} />;
        case 'terms':
        case 'privacy':
        case 'cookies':
        case 'data-processing':
          return <Legal {...publicProps} pageType={publicPage} />;
        default:
          return (
            <LandingPage
              onNavigate={handlePublicNavigate}
              onEnterApp={handleEnterApp}
              onStartSignup={handleStartSignup}
            />
          );
      }
    }

    // ── Authentication ──
    if (!isAuthenticated) {
      if (authMode === 'forgot-password') {
        return <ForgotPassword onBackToLogin={() => setAuthMode('login')} onBackHome={handleExitApp} />;
      }
      if (authMode === 'reset-password') {
        return <ResetPassword onBackToLogin={() => setAuthMode('login')} onBackHome={handleExitApp} />;
      }
      if (authMode === 'signup') {
        return (
          <Signup
            onLogin={() => handleLogin('contributor')}
            onSwitchToLogin={() => setAuthMode('login')}
            onBackHome={handleExitApp}
          />
        );
      }
      return (
        <Login
          onLogin={handleLogin}
          onSwitchToSignup={() => setAuthMode('signup')}
          onForgotPassword={() => setAuthMode('forgot-password')}
          onBackHome={handleExitApp}
        />
      );
    }

    // ── Product ──
    const renderContent = () => {
      if (userRole === 'admin') {
        switch (currentPage) {
          case 'admin-create-task':
            return <AdminCreateTask onSave={handleCreateTask} />;
          case 'admin-submissions':
            return <AdminSubmissions />;
          case 'tasks':
            return (
              <TaskList
                onSelectTask={handleSelectTask}
                tasks={tasks}
                userRole="admin"
                onDeleteTask={handleDeleteTask}
              />
            );
          case 'account':
            return renderAccount();
          case 'admin-dashboard':
          default:
            return <AdminDashboard onNavigate={handleAppNavigate} tasks={tasks} />;
        }
      }

      switch (currentPage) {
        case 'complete-profile':
          return <CompleteProfile onComplete={() => handleLogin(userRole)} />;
        case 'tasks':
          return (
            <TaskList
              onSelectTask={handleSelectTask}
              tasks={tasks}
              completedTaskIds={completedTaskIds}
            />
          );
        case 'execution':
          if (!activeTask) {
            return (
              <TaskList
                onSelectTask={handleSelectTask}
                tasks={tasks}
                completedTaskIds={completedTaskIds}
              />
            );
          }
          return (
            <TaskExecution
              task={activeTask}
              onBack={() => handleAppNavigate('tasks')}
              onComplete={handleCompleteTask}
            />
          );
        case 'earnings':
          return <Earnings />;
        case 'guidelines':
          return renderGuidelines();
        case 'support':
          return renderSupport();
        case 'account':
          return renderAccount();
        case 'dashboard':
        default:
          return <Dashboard onNavigate={handleAppNavigate} />;
      }
    };

    const mobileTabs: { page: PageView; label: string; icon: typeof Database; match: PageView[] }[] =
      userRole === 'admin'
        ? [
            { page: 'admin-dashboard', label: 'Overview', icon: LayoutDashboard, match: ['admin-dashboard'] },
            { page: 'admin-submissions', label: 'Review', icon: ShieldCheck, match: ['admin-submissions'] },
            { page: 'tasks', label: 'Tasks', icon: Database, match: ['tasks', 'execution'] },
            { page: 'account', label: 'Profile', icon: User, match: ['account'] },
          ]
        : [
            { page: 'dashboard', label: 'Overview', icon: LayoutDashboard, match: ['dashboard'] },
            { page: 'tasks', label: 'Tasks', icon: Database, match: ['tasks', 'execution'] },
            { page: 'earnings', label: 'Money', icon: BadgeIndianRupee, match: ['earnings'] },
            { page: 'account', label: 'Profile', icon: User, match: ['account'] },
          ];

    return (
      <div className="flex h-[100dvh] overflow-hidden bg-paper text-body">
        <Sidebar
          currentPage={currentPage}
          onNavigate={handleAppNavigate}
          isMobileOpen={isMobileNavOpen}
          setIsMobileOpen={setIsMobileNavOpen}
          onLogout={handleLogout}
          onExitApp={handleExitApp}
          userRole={userRole}
        />

        <div className="relative flex min-w-0 flex-1 flex-col overflow-hidden">
          {/* Mobile header */}
          <header className="flex h-[var(--nav-h)] flex-none items-center justify-between gap-3 border-b border-line bg-paper px-4 md:hidden">
            <LogoLockup markClassName="h-7 w-7" />
            <div className="flex items-center gap-2">
              <ThemeToggle />
              <button
                type="button"
                onClick={() => setIsMobileNavOpen(true)}
                aria-label="Open navigation"
                className="flex h-9 w-9 items-center justify-center rounded-md border border-line text-ink"
              >
                <Menu className="h-4 w-4" strokeWidth={1.75} aria-hidden="true" />
              </button>
            </div>
          </header>

          {/* Scrollable content */}
          <main className="thin-scroll flex-1 overflow-y-auto scroll-smooth">
            <div className="mx-auto w-full max-w-[1440px] px-4 py-6 pb-28 sm:px-6 md:px-8 md:pb-10 lg:py-8">
              {renderContent()}
            </div>
          </main>

          {/* Mobile tab bar */}
          <nav
            aria-label="Primary"
            className="absolute inset-x-0 bottom-0 z-30 grid grid-cols-4 border-t border-line bg-paper pb-[env(safe-area-inset-bottom)] md:hidden"
          >
            {mobileTabs.map(tab => {
              const active = tab.match.includes(currentPage);
              return (
                <button
                  key={tab.page}
                  type="button"
                  onClick={() => handleAppNavigate(tab.page)}
                  aria-current={active ? 'page' : undefined}
                  className={cn(
                    'flex flex-col items-center gap-1 py-2.5 text-[10px] font-medium transition-colors',
                    active ? 'text-signal' : 'text-muted',
                  )}
                >
                  <tab.icon className="h-5 w-5" strokeWidth={active ? 2 : 1.75} aria-hidden="true" />
                  {tab.label}
                </button>
              );
            })}
          </nav>
        </div>
      </div>
    );
  };

  return (
    <Suspense fallback={<PageLoader />}>
      {renderMainContent()}
    </Suspense>
  );
};

export default App;
