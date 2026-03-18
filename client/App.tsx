import React, { useState, useEffect, Suspense, lazy } from 'react';
import { useLocation, useNavigate, Routes, Route, Navigate } from 'react-router-dom';

// Lazy-loaded page components for better performance
const Dashboard = lazy(() => import('./pages/Dashboard').then(m => ({ default: m.Dashboard })));
const TaskList = lazy(() => import('./pages/TaskList').then(m => ({ default: m.TaskList })));
const TaskExecution = lazy(() => import('./pages/TaskExecution').then(m => ({ default: m.TaskExecution })));
const Earnings = lazy(() => import('./pages/Earnings').then(m => ({ default: m.Earnings })));
const Login = lazy(() => import('./pages/Login').then(m => ({ default: m.Login })));
const Signup = lazy(() => import('./pages/Signup').then(m => ({ default: m.Signup })));
const LandingPage = lazy(() => import('./pages/LandingPage').then(m => ({ default: m.LandingPage })));
const About = lazy(() => import('./pages/About').then(m => ({ default: m.About })));
const Contributors = lazy(() => import('./pages/Contributors').then(m => ({ default: m.Contributors })));
const Money = lazy(() => import('./pages/Money').then(m => ({ default: m.Money })));
const CookiePolicy = lazy(() => import('./pages/CookiePolicy').then(m => ({ default: m.CookiePolicy })));
const PrivacyPolicy = lazy(() => import('./pages/PrivacyPolicy').then(m => ({ default: m.PrivacyPolicy })));
const TermsOfService = lazy(() => import('./pages/TermsOfService').then(m => ({ default: m.TermsOfService })));
const AcceptableUse = lazy(() => import('./pages/AcceptableUse').then(m => ({ default: m.AcceptableUse })));
const AdminCreateTask = lazy(() => import('./pages/AdminCreateTask').then(m => ({ default: m.AdminCreateTask })));
const AdminDashboard = lazy(() => import('./pages/AdminDashboard').then(m => ({ default: m.AdminDashboard })));
const AdminSubmissions = lazy(() => import('./pages/AdminSubmissions').then(m => ({ default: m.AdminSubmissions })));
const ForgotPassword = lazy(() => import('./pages/ForgotPassword').then(m => ({ default: m.ForgotPassword })));
const ResetPassword = lazy(() => import('./pages/ResetPassword').then(m => ({ default: m.ResetPassword })));
const CompleteProfile = lazy(() => import('./pages/CompleteProfile').then(m => ({ default: m.default })));

// Type definitions for TypeScript
import { PageView, Task, UserRole, TaskType, TaskStatus } from './types';

// Icon library - Lucide React icons
import { Menu, User, MapPin, Globe, Shield, LayoutDashboard, Database, CreditCard, MoreHorizontal, CheckCircle2, ShieldAlert, Clock } from 'lucide-react';

// Custom components and utilities
import { Logo } from './components/Logo';
import { API_URL } from './config/api';
import { PublicPageType } from './components/PublicLayout';
import { supabase } from "./supabaseClient"; // Supabase client for database operations
import { Sidebar } from './components/Sidebar';
import { Button } from "./components/Button";

// ============================================================================
// CONSTANTS
// ============================================================================

// Auto-logout timer: 15 minutes of inactivity for security
const INACTIVITY_LIMIT_MS = 15 * 60 * 1000; // 15 Minutes

// Keep-alive ping interval: ping backend every 9 minutes to prevent Render free-tier sleep
const KEEP_ALIVE_INTERVAL_MS = 9 * 60 * 1000; // 9 Minutes


// Lighweight loading shim for Suspense
const PageLoader = () => (
  <div className="fixed inset-0 flex items-center justify-center bg-[#020205] z-[1000]">
    <div className="relative">
      <div className="h-12 w-12 rounded-full border-t-2 border-b-2 border-blue-500 animate-spin"></div>
      <div className="absolute inset-0 h-12 w-12 rounded-full border-t-2 border-b-2 border-blue-500/20"></div>
    </div>
  </div>
);

// ============================================================================
// MAIN APP COMPONENT
// ============================================================================

const App: React.FC = () => {

  // --------------------------------------------------------------------------
  // STATE MANAGEMENT
  // --------------------------------------------------------------------------

  // Navigation State - Controls which part of the app is displayed
  const [viewMode, setViewMode] = useState<'public' | 'app'>('public'); // 'public' = landing page, 'app' = authenticated app
  const [authMode, setAuthMode] = useState<'login' | 'signup' | 'forgot-password' | 'reset-password'>('login'); // Which auth form to show
  const [publicPage, setPublicPage] = useState<PublicPageType>('home'); // Which public page (home, about, etc.)
  const [isAuthenticated, setIsAuthenticated] = useState(false); // Is user logged in?
  const [userRole, setUserRole] = useState<UserRole>('contributor'); // User's role (contributor or admin)
  const [currentPage, setCurrentPage] = useState<PageView>('dashboard'); // Current page in authenticated app
  const [isMobileNavOpen, setIsMobileNavOpen] = useState(false); // Mobile navigation menu state
  const [activeTask, setActiveTask] = useState<Task | null>(null); // Currently selected task for execution
  const [userProfile, setUserProfile] = useState<any>(null); // User profile data from database

  const navigate = useNavigate();
  const location = useLocation();

  // --------------------------------------------------------------------------
  // URL SYNC - Makes back button work
  // --------------------------------------------------------------------------
  useEffect(() => {
    const path = location.pathname;

    // Auth modes
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
    }
    // App/Dashboard routes
    else if (path.startsWith('/dashboard')) {
      if (isAuthenticated) {
        setViewMode('app');
        // Extract specific page if any, e.g., /dashboard/tasks
        const parts = path.split('/');
        if (parts[2]) {
          setCurrentPage(parts[2] as PageView);
        } else {
          setCurrentPage(userRole === 'admin' ? 'admin-dashboard' : 'dashboard');
        }
      }
    }
    // Public routes
    else {
      setViewMode('public');
      const page = path.substring(1) || 'home';
      setPublicPage(page as PublicPageType);
    }
  }, [location.pathname, isAuthenticated, userRole]);

  // Global Data State - Tasks loaded from backend
  const [tasks, setTasks] = useState<Task[]>([]); // Array of all tasks
  const [completedTaskIds, setCompletedTaskIds] = useState<string[]>([]); // Track completed tasks

  // --------------------------------------------------------------------------
  // SIDE EFFECTS (useEffect hooks)
  // --------------------------------------------------------------------------

  /**
   * EFFECT 0: Restore session on page load
   * Checks if user has an existing Supabase session (survives reload)
   * Also listens for auth state changes (login/logout/token refresh)
   */
  useEffect(() => {
    // 0. Check if user arrived via password reset link
    if (window.location.hash.includes('reset-password') || window.location.hash.includes('type=recovery')) {
      setViewMode('app');
      setAuthMode('reset-password');
    }

    // 1. Check for existing session on mount
    const restoreSession = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();

        if (session?.user) {
          console.log("🔄 Restoring session for:", session.user.email);

          // Fetch profile
          const { data: profile, error: profileError } = await supabase
            .from("profiles")
            .select("*")
            .eq("id", session.user.id)
            .single();

          if (profile && !profileError) {
            setUserProfile({ ...profile, email: session.user.email });
            setUserRole(profile.role || "contributor");
            setIsAuthenticated(true);
            setViewMode('app');

            if (!profile.profile_completed) {
              setCurrentPage("complete-profile");
            } else {
              setCurrentPage(
                (profile.role || "contributor") === "admin"
                  ? "admin-dashboard"
                  : "dashboard"
              );
            }
            console.log("✅ Session restored successfully");
          }
        }
      } catch (err) {
        console.error("Error restoring session:", err);
      }
    };

    restoreSession();

    // 2. Listen for auth state changes (login, logout, token refresh)
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.log("🔑 Auth event:", event);
        if (event === "SIGNED_OUT") {
          setIsAuthenticated(false);
          setUserProfile(null);
          setViewMode('public');
          setPublicPage('home');
        }
        // Handle password recovery flow
        if (event === "PASSWORD_RECOVERY") {
          setViewMode('app');
          setAuthMode('reset-password');
        }
      }
    );

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  /**
   * EFFECT 1: Fetch tasks via Backend API (RLS-proof)
   * Fetches different endpoints based on user role (Admin vs Contributor)
   * Re-runs when authentication state or user role changes.
   */
  useEffect(() => {
    const fetchTasks = async () => {
      // Don't fetch if not authenticated to avoid noisy 401/403 console errors
      if (!isAuthenticated) {
        setTasks([]);
        return;
      }

      try {
        const { API_ENDPOINTS } = await import('./config/api');
        const { fetchApi } = await import('./lib/api');

        // Choose endpoint based on role: Admin gets all tasks, Contributor gets only available ones
        const endpoint = userRole === 'admin'
          ? API_ENDPOINTS.ADMIN_TASKS
          : API_ENDPOINTS.CONTRIBUTOR_TASKS;

        console.log(`📡 Fetching tasks for active session [Role: ${userRole}]...`);
        const response = await fetchApi(endpoint);

        if (!response.ok) {
          throw new Error(`Failed to fetch tasks: ${response.status} ${response.statusText}`);
        }

        const data = await response.json();

        // The admin endpoint returns tasks already ordered and with counts if possible
        // But let's map it safely
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
        console.log(`✅ Loaded ${mappedTasks.length} tasks via API (${userRole} view)`);
      } catch (err) {
        console.error('Error fetching tasks via API:', err);
      }
    };

    fetchTasks();
  }, [isAuthenticated, userRole]);

  /**
   * EFFECT: Fetch user's completed tasks directly from Supabase
   */
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
              const ids = data.map((s: any) => s.task_id).filter(Boolean);
              setCompletedTaskIds(ids);
              console.log(`✅ User completed ${ids.length} tasks`);
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



  /**
   * EFFECT 3: Security - Auto-logout on inactivity
   * Logs out user after 15 minutes of no activity
   * Monitors mouse, keyboard, click, and scroll events
   */
  useEffect(() => {
    if (!isAuthenticated) return; // Only run if user is logged in

    let inactivityTimer: number;

    const resetTimer = () => {
      clearTimeout(inactivityTimer);
      inactivityTimer = window.setTimeout(() => {
        // Securely clear session after inactivity
        handleLogout();
        alert("Session terminated due to inactivity for security.");
      }, INACTIVITY_LIMIT_MS); // 15 minutes
    };

    // Events to monitor
    window.addEventListener('mousemove', resetTimer);
    window.addEventListener('keypress', resetTimer);
    window.addEventListener('click', resetTimer);
    window.addEventListener('scroll', resetTimer);

    // Init
    resetTimer();

    return () => {
      clearTimeout(inactivityTimer);
      window.removeEventListener('mousemove', resetTimer);
      window.removeEventListener('keypress', resetTimer);
      window.removeEventListener('click', resetTimer);
      window.removeEventListener('scroll', resetTimer);
    };
  }, [isAuthenticated]);

  /**
   * EFFECT 4: Keep-alive ping to prevent Render free-tier from sleeping
   * Pings the backend /health endpoint every 9 minutes so the backend
   * is always warm when a user submits a task.
   */
  useEffect(() => {
    const ping = () => {
      fetch(`${API_URL}/health`).catch(() => {
        // Silently ignore errors - this is just a keep-alive
      });
    };
    ping(); // Ping immediately on mount
    const interval = window.setInterval(ping, KEEP_ALIVE_INTERVAL_MS);
    return () => window.clearInterval(interval);
  }, []);

  // --------------------------------------------------------------------------
  // HANDLER FUNCTIONS - Navigation & Authentication
  // --------------------------------------------------------------------------




  /**
   * Navigate to login page from public landing page
   * Switches to app view mode and shows login form
   */
  const handleEnterApp = () => {
    navigate('/login');
  };

  /**
   * Navigate to signup page from public landing page
   * Switches to app view mode and shows signup form
   */
  const handleStartSignup = () => {
    navigate('/signup');
  };

  /**
   * Exit the app and return to public landing page
   * Resets all navigation state and clears authentication
   */
  const handleExitApp = () => {
    navigate('/');
    setIsAuthenticated(false);
  };

  // Ensure dark mode is active by default
  useEffect(() => {
    document.documentElement.classList.add('dark');
  }, []);

  /**
   * Handle user login after authentication
   * 
   * Flow:
   * 1. Get authenticated user from Supabase
   * 2. Fetch user profile from database
   * 3. Set user role and authentication state
   * 4. Redirect to appropriate page (profile completion or dashboard)
   * 
   * @param role - The role the user is logging in as (admin or contributor)
   */
  const handleLogin = async (role: UserRole) => {
    try {
      // Step 1: Get the authenticated user
      const { data: { user }, error: userError } = await supabase.auth.getUser();

      if (userError || !user) {
        console.error("Failed to get user:", userError);
        alert("Failed to get user information. Please try logging in again.");
        return;
      }

      console.log("User authenticated:", user.id);

      // Step 2: Fetch user profile from database
      const { data: profile, error: profileError } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", user.id)
        .single();

      if (profileError) {
        console.error("Profile fetch error:", profileError);
        alert(`Failed to load user profile: ${profileError.message}`);
        return;
      }

      if (!profile) {
        console.error("No profile found for user:", user.id);
        alert("No profile found. Please contact support.");
        return;
      }

      console.log("Profile loaded successfully:", profile);

      // Step 3: Store user data in state
      setUserProfile({ ...profile, email: user.email });
      setUserRole(profile.role || "contributor");
      setIsAuthenticated(true);

      // Step 4: Redirect based on profile completion status
      if (!profile.profile_completed) {
        // New user - needs to complete profile
        setCurrentPage("complete-profile");
      } else {
        // Existing user - go to dashboard
        setCurrentPage(role === "admin" ? "admin-dashboard" : "dashboard");
      }
    } catch (err) {
      console.error("Unexpected error in handleLogin:", err);
      alert("An unexpected error occurred. Please try again.");
    }
  };




  /**
   * Handle user logout
   * Clears authentication state and returns to public landing page
   */
  const handleLogout = async () => {
    await supabase.auth.signOut();
    setIsAuthenticated(false);
    setActiveTask(null);
    setUserProfile(null);
    setViewMode('public');
    setPublicPage('home');
  };

  /**
   * Handle task selection from task list
   * Sets the active task and navigates to execution page
   * @param task - The task object to execute
   */
  const handleSelectTask = (task: Task) => {
    setActiveTask(task);
    navigate('/dashboard/execution');
  };

  /**
   * Handle task completion
   * Clears active task, marks it as done locally, and returns to task list
   */
  const handleCompleteTask = () => {
    // Optimistically mark this task as completed so the badge shows immediately
    if (activeTask) {
      setCompletedTaskIds(prev =>
        prev.includes(activeTask.id) ? prev : [...prev, activeTask.id]
      );
    }
    setActiveTask(null);
    navigate('/dashboard/tasks');
  };

  /**
   * Handle new task creation (Admin only)
   * Adds new task to the beginning of the task list
   * @param newTask - The newly created task object
   */
  const handleCreateTask = async (newTask: any) => {
    // Map snake_case API response to camelCase frontend format
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
    setCurrentPage("tasks");
  };



  /**
   * Handle task deletion (Admin only)
   * Removes task from the task list by ID
   * @param taskId - The ID of the task to delete
   */
  const handleDeleteTask = async (taskId: string) => {
    try {
      const { API_ENDPOINTS } = await import('./config/api');
      const res = await fetch(API_ENDPOINTS.DELETE_TASK(taskId), {
        method: "DELETE",
      });

      if (!res.ok) {
        throw new Error("Failed to delete task");
      }

      // Remove from UI
      setTasks(prev => prev.filter(t => t.id !== taskId));
      console.log("✅ Task soft-deleted:", taskId);
    } catch (err) {
      console.error("Error deleting task:", err);
      alert("Failed to delete task");
    }
  };

  /**
   * Handle navigation between public pages
   * Scrolls to top smoothly when changing pages
   * @param page - The public page to navigate to (home, about, contributors, money)
   */
  const handlePublicNavigate = (page: PublicPageType) => {
    navigate(page === 'home' ? '/' : `/${page}`);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };
  const handleAppNavigate = (page: PageView) => {
    navigate(`/dashboard/${page}`);
  };

  // Render logic
  const renderMainContent = () => {
    if (viewMode === 'public') {
      const publicProps = {
        onNavigate: handlePublicNavigate,
        onEnterApp: handleEnterApp
      };

      switch (publicPage) {
        case 'about':
          return <About {...publicProps} />;
        case 'contributors':
          return <Contributors {...publicProps} onEnterApp={handleStartSignup} />;
        case 'money':
          return <Money {...publicProps} onEnterApp={handleStartSignup} />;
        case 'cookies':
          return <CookiePolicy {...publicProps} />;
        case 'privacy':
          return <PrivacyPolicy {...publicProps} />;
        case 'terms':
          return <TermsOfService {...publicProps} />;
        case 'acceptable-use':
          return <AcceptableUse {...publicProps} />;
        default:
          return <LandingPage onNavigate={handlePublicNavigate} onEnterApp={handleEnterApp} onStartSignup={handleStartSignup} />;
      }
    }

    if (!isAuthenticated) {
      if (authMode === 'forgot-password') {
        return (
          <ForgotPassword
            onBackToLogin={() => setAuthMode('login')}
            onBackHome={handleExitApp}
          />
        );
      }
      if (authMode === 'reset-password') {
        return (
          <ResetPassword
            onBackToLogin={() => {
              setAuthMode('login');
            }}
            onBackHome={handleExitApp}
          />
        );
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

    const renderContent = () => {
      // Admin Views
      if (userRole === 'admin') {
        switch (currentPage) {
          case 'admin-dashboard':
            return <AdminDashboard onNavigate={handleAppNavigate} tasks={tasks} />;
          case 'admin-create-task':
            return <AdminCreateTask onSave={handleCreateTask} />;
          case 'admin-submissions':
            return <AdminSubmissions />;
          case 'tasks':
            return <TaskList onSelectTask={handleSelectTask} tasks={tasks} userRole="admin" onDeleteTask={handleDeleteTask} />;
          case 'account':
            const formatLastLogin = () => {
              const now = new Date();
              return now.toLocaleString('en-US', {
                month: 'short',
                day: 'numeric',
                year: 'numeric',
                hour: '2-digit',
                minute: '2-digit'
              });
            };

            return (
              <div className="max-w-6xl mx-auto space-y-3 h-full flex flex-col justify-center pb-2">
                {/* Admin Header Section */}
                <div className="flex flex-col md:flex-row items-center gap-5 bg-[#09090b] rounded-3xl border border-white/5 p-4 shadow-lg relative overflow-hidden">
                  <div className="absolute top-0 right-0 w-32 h-32 bg-purple-500/5 rounded-full blur-3xl"></div>

                  <div className="relative h-16 w-16 bg-gradient-to-br from-purple-500 to-indigo-600 rounded-full flex items-center justify-center text-xl font-black text-white border-2 border-zinc-900 shadow-inner flex-shrink-0">
                    {userProfile?.full_name?.charAt(0) || userProfile?.email?.charAt(0) || 'A'}
                    <div className="absolute bottom-0 right-0 h-4 w-4 bg-emerald-500 border-2 border-zinc-900 rounded-full shadow-lg"></div>
                  </div>

                  <div className="flex-1 min-w-0 text-center md:text-left">
                    <div className="flex flex-col md:flex-row md:items-center gap-2 mb-0.5">
                      <h1 className="text-xl font-black text-white truncate">
                        {userProfile?.full_name || 'Administrator'}
                      </h1>
                      <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[9px] font-black bg-purple-900/30 text-purple-400 w-fit mx-auto md:mx-0 uppercase tracking-tighter">
                        Admin ID: #{userProfile?.id?.slice(0, 8) || '0xAF'}
                      </span>
                    </div>
                    <div className="flex items-center justify-center md:justify-start gap-4 text-stone-400 text-[10px] font-bold uppercase tracking-wider">
                      <span className="flex items-center gap-1.5 text-purple-500">
                        <Shield className="h-3 w-3" /> Level 5 Clearance
                      </span>
                      <span>• Last Sync: {formatLastLogin()}</span>
                    </div>
                  </div>

                  <div className="bg-white/5 border border-white/5 rounded-2xl p-3 px-6 text-center shadow-inner">
                    <div className="text-[9px] font-black uppercase tracking-widest text-stone-400 mb-1">Starset Reputation</div>
                    <div className="flex items-baseline justify-center gap-1">
                      <span className="text-2xl font-black text-emerald-500">{userProfile?.trust_score || 100}</span>
                      <span className="text-[10px] text-stone-500 font-bold">/100</span>
                    </div>
                  </div>
                </div>

                {/* Info Grid */}
                <div className="grid md:grid-cols-3 gap-3">
                  {/* Registry Details */}
                  <div className="md:col-span-2 bg-[#09090b] rounded-3xl border border-white/5 p-5 shadow-sm">
                    <h3 className="text-[10px] font-black text-white mb-4 uppercase tracking-[0.2em] flex items-center gap-2 opacity-60">
                      <Database className="h-3 w-3 text-purple-400" />
                      Registry & System Data
                    </h3>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-8 gap-x-12">
                      <div className="space-y-1.5">
                        <label className="text-[9px] font-black uppercase tracking-[0.3em] text-stone-500">System Role</label>
                        <p className="text-lg font-black text-white uppercase tracking-tight">{userProfile?.role_text || 'System Administrator'}</p>
                      </div>
                      <div className="space-y-1.5">
                        <label className="text-[9px] font-black uppercase tracking-[0.3em] text-stone-500">Security Clearance</label>
                        <p className="text-lg font-black text-purple-500 uppercase tracking-tight">Level 5 (Encrypted)</p>
                      </div>
                      <div className="space-y-1.5">
                        <label className="text-[9px] font-black uppercase tracking-[0.3em] text-stone-500">Registry Origin</label>
                        <p className="text-lg font-black text-white flex items-center gap-2 uppercase tracking-tight">
                          <MapPin className="h-4 w-4 text-purple-500" /> {userProfile?.created_at ? new Date(userProfile.created_at).toLocaleDateString() : 'ActiveSince_Deployment'}
                        </p>
                      </div>
                      <div className="space-y-1.5">
                        <label className="text-[9px] font-black uppercase tracking-[0.3em] text-stone-500">Email Address</label>
                        <p className="text-lg font-black text-white/80 lowercase truncate">{userProfile?.email || 'admin@starset.ai'}</p>
                      </div>
                    </div>
                  </div>

                  {/* Permissions */}
                  <div className="bg-[#09090b] rounded-3xl border border-white/5 p-5 shadow-sm">
                    <h3 className="text-[10px] font-black text-white mb-3 uppercase tracking-[0.2em] flex items-center gap-2 opacity-60">
                      <Shield className="h-3 w-3 text-purple-400" />
                      Privileges
                    </h3>

                    <div className="space-y-2">
                      {[
                        'Task Creation',
                        'User Compliance',
                        'Payout Validation',
                        'System Config'
                      ].map((perm, i) => (
                        <div key={i} className="flex items-center gap-2 p-1.5 bg-white/5 rounded-lg border border-white/5">
                          <CheckCircle2 className="h-3 w-3 text-emerald-500 flex-shrink-0" />
                          <span className="text-[9px] font-black uppercase tracking-tight opacity-80">{perm}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Small Danger Zone Footer */}
                <div className="bg-red-950/5 rounded-2xl border border-red-900/10 p-3 px-5 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <ShieldAlert className="h-3.5 w-3.5 text-red-500/30" />
                    <span className="text-[10px] font-bold text-red-400/30 uppercase tracking-tighter">System Access Resignation Protocol</span>
                  </div>
                  <button
                    className="text-[9px] font-black text-red-600/80 hover:text-red-700 hover:underline transition-colors uppercase tracking-widest"
                    onClick={() => window.confirm("Terminate admin access? Contact root@starset.intelligence") && alert("Contact root.")}
                  >
                    Initiate Removal
                  </button>
                </div>
              </div>
            );
          default:
            return <AdminDashboard onNavigate={handleAppNavigate} tasks={tasks} />;
        }
      }

      // Contributor Views
      switch (currentPage) {
        case 'complete-profile':
          return <CompleteProfile
            onComplete={() => {
              // Reload profile after completion
              handleLogin(userRole);
            }}
          />;
        case 'dashboard':
          return <Dashboard onNavigate={handleAppNavigate} />;
        case 'tasks':
          return <TaskList onSelectTask={handleSelectTask} tasks={tasks} completedTaskIds={completedTaskIds} />;
        case 'execution':
          if (!activeTask) return <TaskList onSelectTask={handleSelectTask} tasks={tasks} completedTaskIds={completedTaskIds} />;
          return (
            <TaskExecution
              task={activeTask}
              onBack={() => setCurrentPage('tasks')}
              onComplete={handleCompleteTask}
            />
          );
        case 'earnings':
          return <Earnings />;
        case 'guidelines':
          return (
            <div className="bg-black/40 backdrop-blur-md p-6 md:p-10 rounded-2xl border border-white/10 shadow-sm max-w-4xl">
              <h1 className="text-2xl md:text-3xl font-bold mb-8 text-white">Quality Guidelines</h1>
              <p className="mb-8 text-base md:text-lg text-zinc-300 leading-relaxed">Strict adherence to these guidelines is required for payout. Violations may result in account suspension.</p>
              <div className="grid md:grid-cols-2 gap-6">
                <div className="p-6 md:p-8 bg-white/5 rounded-xl border border-white/10">
                  <h3 className="font-bold text-white mb-3 text-lg">Audio</h3>
                  <p className="text-zinc-400 leading-relaxed">No background noise (TV, fans, other people). Clear pronunciation required. Use a headset if possible.</p>
                </div>
                <div className="p-6 md:p-8 bg-white/5 rounded-xl border border-white/10">
                  <h3 className="font-bold text-white mb-3 text-lg">Text</h3>
                  <p className="text-zinc-400 leading-relaxed">Proper grammar and spelling are required unless colloquialisms are explicitly requested.</p>
                </div>
              </div>
            </div>
          );
        case 'support':
          return (
            <div className="bg-black/40 backdrop-blur-md p-6 md:p-10 rounded-2xl border border-white/10 shadow-sm max-w-3xl">
              <h1 className="text-2xl md:text-3xl font-bold mb-4 text-white">Support</h1>
              <p className="text-zinc-300 mb-10 text-lg">Need help? Submit a ticket below.</p>
              <form className="space-y-8">
                <div>
                  <label className="block text-sm font-bold text-zinc-300 mb-2 uppercase tracking-wide">Issue Type</label>
                  <select className="w-full border-white/10 rounded-xl p-4 border bg-white/5 focus:bg-black focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all outline-none text-base text-white">
                    <option className="bg-zinc-900">Payment Issue</option>
                    <option className="bg-zinc-900">Task Bug</option>
                    <option className="bg-zinc-900">Account Question</option>
                    <option className="bg-zinc-900">Other</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-bold text-zinc-300 mb-2 uppercase tracking-wide">Description</label>
                  <textarea
                    required
                    placeholder="Please describe your issue in detail..."
                    className="w-full border-white/10 rounded-xl p-4 border h-40 bg-white/5 focus:bg-black focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all resize-none outline-none text-base text-white"
                  ></textarea>
                </div>
                <button
                  type="submit"
                  className="bg-blue-600 text-white px-8 py-4 rounded-xl font-bold shadow-lg shadow-blue-500/10 hover:shadow-blue-500/20 hover:-translate-y-0.5 transition-all text-lg w-full md:w-auto"
                  onClick={(e) => {
                    const form = (e.target as HTMLButtonElement).form;
                    if (form && form.checkValidity()) {
                      e.preventDefault();
                      alert("Support ticket submitted. Our team will contact you shortly.");
                      form.reset();
                    }
                  }}
                >
                  Submit Ticket
                </button>
              </form>
            </div>
          );
        case 'account':
          const getInitials = (name: string) => {
            if (!name) return 'U';
            const parts = name.split(' ');
            return parts.length > 1
              ? `${parts[0][0]}${parts[1][0]}`.toUpperCase()
              : parts[0][0].toUpperCase();
          };

          const formatDate = (dateString: string) => {
            if (!dateString) return 'Recently';
            const date = new Date(dateString);
            return date.toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
          };

          return (
            <div className="max-w-6xl mx-auto space-y-3 h-full flex flex-col justify-center pb-2">
              {/* Profile Header Section */}
              <div className="flex flex-col md:flex-row items-center gap-5 bg-white dark:bg-[#09090b] rounded-3xl border border-stone-200 dark:border-white/5 p-4 shadow-lg relative overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/5 rounded-full blur-3xl"></div>

                <div className="relative h-16 w-16 bg-stone-100 dark:bg-zinc-800 rounded-full flex items-center justify-center text-xl font-black text-stone-500 dark:text-white border-2 border-white dark:border-zinc-900 shadow-inner flex-shrink-0">
                  {getInitials(userProfile?.full_name || userProfile?.email || 'User')}
                  <div className="absolute bottom-0 right-0 h-4 w-4 bg-emerald-500 border-2 border-white dark:border-zinc-900 rounded-full shadow-lg"></div>
                </div>

                <div className="flex-1 min-w-0 text-center md:text-left">
                  <div className="flex flex-col md:flex-row md:items-center gap-2 mb-0.5">
                    <h1 className="text-xl font-black text-[#121212] dark:text-white truncate">
                      {userProfile?.full_name || 'Contributor'}
                    </h1>
                    <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[9px] font-black bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 w-fit mx-auto md:mx-0 uppercase">
                      User ID: #{userProfile?.contributor_id || '101'}
                    </span>
                  </div>
                  <div className="flex items-center justify-center md:justify-start gap-4 text-stone-500 dark:text-stone-400 text-[10px] font-bold uppercase tracking-wider">
                    <span className="flex items-center gap-1.5 text-emerald-500">
                      <Shield className="h-3 w-3" /> Verified Contributor
                    </span>
                    <span>• Joined Date: {formatDate(userProfile?.created_at)}</span>
                  </div>
                </div>


              </div>

              {/* Info Grid */}
              <div className="grid md:grid-cols-3 gap-6">
                {/* Biometric Analysis */}
                <div className="md:col-span-2 bg-black/40 backdrop-blur-xl rounded-[2.5rem] border border-white/10 p-8 md:p-10 shadow-xl relative group">
                  <div className="flex items-center justify-between mb-8">
                    <h3 className="text-xs font-black text-white uppercase tracking-[0.4em] flex items-center gap-3">
                      <User className="h-4 w-4 text-blue-500" />
                      Biometric & Regional Profile
                    </h3>
                    <div className="h-px flex-1 bg-gradient-to-r from-blue-500/20 to-transparent ml-6"></div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-8 gap-x-12">
                    <div className="space-y-1.5 hover:translate-x-1 transition-transform">
                      <label className="text-[9px] font-black uppercase tracking-[0.3em] text-stone-500">Age</label>
                      <p className="text-lg font-black text-white uppercase tracking-tight">{userProfile?.age || 'Not Disclosed'}</p>
                    </div>
                    <div className="space-y-1.5 hover:translate-x-1 transition-transform">
                      <label className="text-[9px] font-black uppercase tracking-[0.3em] text-stone-500">Gender</label>
                      <p className="text-lg font-black text-white uppercase tracking-tight">{userProfile?.gender || 'Not Disclosed'}</p>
                    </div>
                    <div className="space-y-1.5 hover:translate-x-1 transition-transform">
                      <label className="text-[9px] font-black uppercase tracking-[0.3em] text-stone-500">Location</label>
                      <p className="text-lg font-black text-white flex items-center gap-2 uppercase tracking-tight">
                        <MapPin className="h-4 w-4 text-blue-500" /> {userProfile?.city || 'City'}, {userProfile?.state || 'State'}
                      </p>
                    </div>
                    <div className="space-y-1.5 hover:translate-x-1 transition-transform">
                      <label className="text-[9px] font-black uppercase tracking-[0.3em] text-stone-500">Email Address</label>
                      <p className="text-lg font-black text-white/80 lowercase truncate">{userProfile?.email || 'N/A'}</p>
                    </div>
                  </div>
                </div>

                {/* Compensation Protocol */}
                <div className="bg-black/40 backdrop-blur-xl rounded-[2.5rem] border border-white/10 p-8 md:p-10 shadow-xl group">
                  <h3 className="text-xs font-black text-white mb-8 uppercase tracking-[0.4em] flex items-center gap-3">
                    <CreditCard className="h-4 w-4 text-emerald-500" />
                    Compensation Hub
                  </h3>

                  <div className="space-y-6">
                    <div className="p-5 bg-white/5 rounded-2xl border border-white/5 group-hover:border-emerald-500/30 transition-all duration-500">
                      <label className="text-[9px] font-black uppercase tracking-[0.3em] text-stone-500 mb-2 block">Active UPI ID</label>
                      <p className="text-lg font-black text-emerald-500 truncate tracking-tighter drop-shadow-[0_0_10px_rgba(16,185,129,0.2)]">{userProfile?.upi_id || 'Not Assigned'}</p>
                    </div>
                    <Button
                      variant="secondary"
                      className="w-full py-6 rounded-2xl text-[10px] font-black uppercase tracking-[0.3em] bg-white/5 hover:bg-white/10 border-white/10 hover:border-blue-500/50 transition-all duration-300"
                      onClick={() => setCurrentPage('earnings')}
                    >
                      Reset Payment Method
                    </Button>
                  </div>
                </div>
              </div>

              {/* Security Alerts Section */}
              <div className="bg-red-950/10 backdrop-blur-md rounded-3xl border border-red-900/20 p-6 flex flex-col md:flex-row items-center justify-between gap-6 px-10">
                <div className="flex items-center gap-5">
                  <div className="h-12 w-12 rounded-2xl bg-red-500/10 flex items-center justify-center border border-red-500/20">
                    <ShieldAlert className="h-6 w-6 text-red-500 animate-pulse" />
                  </div>
                  <div className="text-center md:text-left">
                    <h4 className="text-[10px] font-black text-red-500 uppercase tracking-[0.4em] mb-1">Account Termination</h4>
                    <p className="text-xs font-bold text-stone-500">Initiating this action will permanently delete your acount from our database.</p>
                  </div>
                </div>
                <button
                  className="px-8 py-3 bg-red-500/10 hover:bg-red-500 text-red-500 hover:text-white border border-red-500/30 rounded-full text-[10px] font-black uppercase tracking-[0.2em] transition-all duration-300"
                  onClick={() => window.confirm("Terminate account? Contact support@starset.ai") && alert("Contact support.")}
                >
                  Initiate Removal
                </button>
              </div>
            </div>
          );
        default:
          return <Dashboard onNavigate={handleAppNavigate} />;
      }
    };

    // Authenticated App Structure
    return (
      <div className="flex h-[100dvh] bg-zinc-50 dark:bg-[#020205] text-[#121212] dark:text-white font-sans selection:bg-blue-100 selection:text-blue-900 overflow-hidden transition-colors duration-300">
        {/* Desktop Sidebar - Hidden on Mobile */}
        <div className="hidden md:block h-full">
          <Sidebar
            currentPage={currentPage}
            onNavigate={handleAppNavigate}
            isMobileOpen={isMobileNavOpen}
            setIsMobileOpen={setIsMobileNavOpen}
            onLogout={handleLogout}
            onExitApp={handleExitApp}
            userRole={userRole}
          />
        </div>

        <div className="flex-1 flex flex-col h-full overflow-hidden relative">
          {/* Mobile Header - Visible only on Mobile */}
          <header className="md:hidden bg-white/90 dark:bg-black/95 backdrop-blur-md border-b border-stone-200 dark:border-white/10 h-16 flex items-center justify-between px-4 flex-shrink-0 z-30 relative">
            <div className="flex items-center gap-2">
              <Logo className="h-10 w-10" />
              <span className="font-extrabold text-base text-[#121212] dark:text-white tracking-[0.1em] uppercase whitespace-nowrap">STARSET</span>
            </div>
            <div className="flex items-center gap-3">
              <button
                onClick={() => setIsMobileNavOpen(true)}
                className="p-2 text-stone-600 dark:text-stone-300 hover:bg-stone-100 dark:hover:bg-white/10 rounded-lg transition-colors"
              >
                <MoreHorizontal className="h-6 w-6" />
              </button>
            </div>
          </header>

          {/* Mobile Sidebar Overlay */}
          <div className="md:hidden">
            <Sidebar
              currentPage={currentPage}
              onNavigate={handleAppNavigate}
              isMobileOpen={isMobileNavOpen}
              setIsMobileOpen={setIsMobileNavOpen}
              onLogout={handleLogout}
              onExitApp={handleExitApp}
              userRole={userRole}
            />
          </div>

          {/* Main Content Scrollable Area */}
          <main className="flex-1 overflow-y-auto p-4 md:p-10 scroll-smooth pb-24 md:pb-10 relative">
            {/* Background Accent Glows */}
            <div className="fixed inset-0 pointer-events-none overflow-hidden opacity-50 dark:opacity-100">
              <div className="absolute top-[-10%] right-[-10%] w-[40%] h-[40%] bg-blue-500/10 dark:bg-blue-500/5 rounded-full blur-[120px]"></div>
              <div className="absolute bottom-[-10%] left-[-10%] w-[40%] h-[40%] bg-purple-500/10 dark:bg-purple-500/5 rounded-full blur-[120px]"></div>
            </div>

            <div className="max-w-[1600px] mx-auto min-h-full flex flex-col relative z-10">
              <div className="flex-1">
                {renderContent()}
              </div>
            </div>
          </main>

          {/* Mobile Bottom Navigation */}
          <div className="md:hidden absolute bottom-0 left-0 w-full bg-white dark:bg-black border-t border-stone-200 dark:border-white/10 px-6 py-3 flex justify-between items-center z-40 safe-area-bottom">
            <button
              onClick={() => handleAppNavigate('dashboard')}
              className={`flex flex-col items-center gap-1 transition-colors ${currentPage === 'dashboard' ? 'text-blue-600 dark:text-blue-500' : 'text-stone-400'}`}
            >
              <LayoutDashboard className="h-6 w-6" strokeWidth={currentPage === 'dashboard' ? 2.5 : 2} />
              <span className="text-[10px] font-medium">Home</span>
            </button>

            <button
              onClick={() => handleAppNavigate('tasks')}
              className={`flex flex-col items-center gap-1 transition-colors ${currentPage === 'tasks' || currentPage === 'execution' ? 'text-blue-600 dark:text-blue-500' : 'text-stone-400'}`}
            >
              <Database className="h-6 w-6" strokeWidth={currentPage === 'tasks' || currentPage === 'execution' ? 2.5 : 2} />
              <span className="text-[10px] font-medium">Tasks</span>
            </button>

            <button
              onClick={() => handleAppNavigate('earnings')}
              className={`flex flex-col items-center gap-1 transition-colors ${currentPage === 'earnings' ? 'text-blue-600 dark:text-blue-500' : 'text-stone-400'}`}
            >
              <CreditCard className="h-6 w-6" strokeWidth={currentPage === 'earnings' ? 2.5 : 2} />
              <span className="text-[10px] font-medium">Money</span>
            </button>

            <button
              onClick={() => handleAppNavigate('account')}
              className={`flex flex-col items-center gap-1 transition-colors ${currentPage === 'account' ? 'text-blue-600 dark:text-blue-500' : 'text-stone-400'}`}
            >
              <User className="h-6 w-6" strokeWidth={currentPage === 'account' ? 2.5 : 2} />
              <span className="text-[10px] font-medium">Profile</span>
            </button>
          </div>
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