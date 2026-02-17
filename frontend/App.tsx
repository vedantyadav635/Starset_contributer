// React core imports
import React, { useState, useEffect } from 'react';

// Component imports - UI building blocks
import { Sidebar } from './components/Sidebar';
import { Dashboard } from './pages/Dashboard';
import { TaskList } from './pages/TaskList';
import { TaskExecution } from './pages/TaskExecution';
import { Earnings } from './pages/Earnings';
import { Login } from './pages/Login';
import { Signup } from './pages/Signup';
import { LandingPage } from './pages/LandingPage';
import { About } from './pages/About';
import { Contributors } from './pages/Contributors';
import { Money } from './pages/Money';
import { AdminCreateTask } from './pages/AdminCreateTask';
import { AdminDashboard } from './pages/AdminDashboard';

// Type definitions for TypeScript
import { PageView, Task, UserRole, TaskType, TaskStatus } from './types';

// Icon library - Lucide React icons
import { Menu, User, MapPin, Smartphone, Laptop, Globe, Shield, Award, Calendar, LayoutDashboard, Database, CreditCard, MoreHorizontal, Moon, Sun, CheckCircle2 } from 'lucide-react';

// Custom components and utilities
import { Logo } from './components/Logo';
import { PublicPageType } from './components/PublicLayout';
import { supabase } from "./supabaseClient"; // Supabase client for database operations
import CompleteProfile from "./pages/CompleteProfile";

// ============================================================================
// CONSTANTS
// ============================================================================

// Auto-logout timer: 15 minutes of inactivity for security
const INACTIVITY_LIMIT_MS = 15 * 60 * 1000; // 15 Minutes

// ============================================================================
// MAIN APP COMPONENT
// ============================================================================

const App: React.FC = () => {

  // --------------------------------------------------------------------------
  // STATE MANAGEMENT
  // --------------------------------------------------------------------------

  // Navigation State - Controls which part of the app is displayed
  const [viewMode, setViewMode] = useState<'public' | 'app'>('public'); // 'public' = landing page, 'app' = authenticated app
  const [authMode, setAuthMode] = useState<'login' | 'signup'>('login'); // Which auth form to show
  const [publicPage, setPublicPage] = useState<PublicPageType>('home'); // Which public page (home, about, etc.)
  const [isAuthenticated, setIsAuthenticated] = useState(false); // Is user logged in?
  const [userRole, setUserRole] = useState<UserRole>('contributor'); // User's role (contributor or admin)
  const [currentPage, setCurrentPage] = useState<PageView>('dashboard'); // Current page in authenticated app
  const [isMobileNavOpen, setIsMobileNavOpen] = useState(false); // Mobile navigation menu state
  const [activeTask, setActiveTask] = useState<Task | null>(null); // Currently selected task for execution
  const [userProfile, setUserProfile] = useState<any>(null); // User profile data from database

  // Global Data State - Tasks loaded from backend
  const [tasks, setTasks] = useState<Task[]>([]); // Array of all tasks
  const [completedTaskIds, setCompletedTaskIds] = useState<string[]>([]); // Track completed tasks

  // --------------------------------------------------------------------------
  // SIDE EFFECTS (useEffect hooks)
  // --------------------------------------------------------------------------

  /**
   * EFFECT 1: Fetch all tasks from backend on component mount
   * Runs once when the app loads (empty dependency array [])
   * Loads tasks from the Express backend API
   */
  useEffect(() => {
    const fetchTasks = async () => {
      try {
        // Import API config dynamically
        const { API_ENDPOINTS } = await import('./config/api');

        // Call backend API to get all tasks
        const res = await fetch(API_ENDPOINTS.ADMIN_TASKS);

        if (!res.ok) {
          throw new Error("Failed to fetch tasks");
        }

        const data = await res.json();
        setTasks(data); // Update state with fetched tasks
        console.log(`✅ Loaded ${data.length} tasks from backend`);
      } catch (err) {
        console.error("Error fetching tasks:", err);
      }
    };

    fetchTasks();
  }, []); // Empty array = run once on mount

  /**
   * EFFECT: Fetch user's completed tasks when user logs in
   * Runs when authentication state changes
   */
  useEffect(() => {
    const fetchCompletedTasks = async () => {
      if (isAuthenticated && userProfile) {
        try {
          // Get current user from Supabase
          const { data: { user } } = await supabase.auth.getUser();

          if (user) {
            const { API_ENDPOINTS } = await import('./config/api');
            const res = await fetch(API_ENDPOINTS.USER_SUBMISSIONS(user.id));

            if (res.ok) {
              const data = await res.json();
              setCompletedTaskIds(data.completedTasks || []);
              console.log(`✅ User has completed ${data.completedTasks?.length || 0} tasks`);
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

  // Theme State - Dark mode by default
  const [isDark, setIsDark] = useState(true);

  /**
   * EFFECT 2: Apply dark/light theme to the document
   * Runs whenever isDark changes
   * Adds or removes 'dark' class from HTML element for Tailwind CSS
   */
  useEffect(() => {
    if (isDark) {
      document.documentElement.classList.add('dark'); // Enable dark mode
    } else {
      document.documentElement.classList.remove('dark'); // Enable light mode
    }
  }, [isDark]); // Re-run when isDark changes

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

  // --------------------------------------------------------------------------
  // HANDLER FUNCTIONS - Navigation & Authentication
  // --------------------------------------------------------------------------

  /**
   * Toggle between dark and light theme
   * Updates the isDark state which triggers the theme useEffect
   */
  const toggleTheme = () => {
    setIsDark(!isDark);
  };

  /**
   * Navigate to login page from public landing page
   * Switches to app view mode and shows login form
   */
  const handleEnterApp = () => {
    setAuthMode('login');
    setViewMode('app');
  };

  /**
   * Navigate to signup page from public landing page
   * Switches to app view mode and shows signup form
   */
  const handleStartSignup = () => {
    setAuthMode('signup');
    setViewMode('app');
  }

  /**
   * Exit the app and return to public landing page
   * Resets all navigation state and clears authentication
   */
  const handleExitApp = () => {
    setViewMode('public');
    setPublicPage('home');
    setCurrentPage('dashboard');
    setIsAuthenticated(false);
  };

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
      setUserRole(profile.role_text || "contributor");
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
  const handleLogout = () => {
    setIsAuthenticated(false);
    setActiveTask(null);
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
    setCurrentPage('execution');
  };

  /**
   * Handle task completion
   * Clears active task and returns to task list
   */
  const handleCompleteTask = () => {
    setActiveTask(null);
    setCurrentPage('tasks');
  };

  /**
   * Handle new task creation (Admin only)
   * Adds new task to the beginning of the task list
   * @param newTask - The newly created task object
   */
  const handleCreateTask = async (newTask: Task) => {
    setTasks(prev => [newTask, ...prev]);
    setCurrentPage("tasks");
  };



  /**
   * Handle task deletion (Admin only)
   * Removes task from the task list by ID
   * @param taskId - The ID of the task to delete
   */
  const handleDeleteTask = (taskId: string) => {
    setTasks(prev => prev.filter(t => t.id !== taskId));
  };

  /**
   * Handle navigation between public pages
   * Scrolls to top smoothly when changing pages
   * @param page - The public page to navigate to (home, about, contributors, money)
   */
  const handlePublicNavigate = (page: PublicPageType) => {
    setPublicPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Render Logic
  if (viewMode === 'public') {
    switch (publicPage) {
      case 'about':
        return <About onNavigate={handlePublicNavigate} onEnterApp={handleEnterApp} isDark={isDark} toggleTheme={toggleTheme} />;
      case 'contributors':
        return <Contributors onNavigate={handlePublicNavigate} onEnterApp={handleStartSignup} isDark={isDark} toggleTheme={toggleTheme} />;
      case 'money':
        return <Money onNavigate={handlePublicNavigate} onEnterApp={handleStartSignup} isDark={isDark} toggleTheme={toggleTheme} />;
      default:
        return <LandingPage onNavigate={handlePublicNavigate} onEnterApp={handleEnterApp} onStartSignup={handleStartSignup} isDark={isDark} toggleTheme={toggleTheme} />;
    }
  }

  if (!isAuthenticated) {
    if (authMode === 'signup') {
      return (
        <Signup
          onLogin={() => handleLogin('contributor')}
          onSwitchToLogin={() => setAuthMode('login')}
          onBackHome={handleExitApp}
          isDark={isDark}
          toggleTheme={toggleTheme}
        />
      );
    }
    return (
      <Login
        onLogin={handleLogin}
        onSwitchToSignup={() => setAuthMode('signup')}
        onBackHome={handleExitApp}
        isDark={isDark}
        toggleTheme={toggleTheme}
      />
    );
  }

  const renderContent = () => {
    // Admin Views
    if (userRole === 'admin') {
      switch (currentPage) {
        case 'admin-dashboard':
          return <AdminDashboard onNavigate={setCurrentPage} tasks={tasks} />;
        case 'admin-create-task':
          return <AdminCreateTask onSave={handleCreateTask} />;
        case 'tasks':
          return <TaskList onSelectTask={handleSelectTask} tasks={tasks} userRole="admin" onDeleteTask={handleDeleteTask} />;
        case 'account':
          const formatLastLogin = () => {
            // Get current time as last login (you can store this in state when user logs in)
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
            <div className="space-y-6 animate-in fade-in duration-500">
              <h1 className="text-2xl md:text-3xl font-bold mb-6 text-[#121212] dark:text-white">
                Administrator Profile
              </h1>

              {/* Admin Profile Card */}
              <div className="bg-white dark:bg-zinc-900 rounded-2xl border border-stone-200 dark:border-white/10 p-6 md:p-8 shadow-sm">
                <div className="flex flex-col md:flex-row items-start md:items-center gap-6 mb-8">
                  {/* Admin Avatar */}
                  <div className="h-20 w-20 bg-gradient-to-br from-purple-500 to-indigo-600 rounded-full flex items-center justify-center text-3xl font-bold text-white shadow-lg">
                    {userProfile?.full_name?.charAt(0) || userProfile?.email?.charAt(0) || 'A'}
                  </div>

                  {/* Admin Info */}
                  <div className="flex-1">
                    <h2 className="text-2xl font-bold text-[#121212] dark:text-white mb-1">
                      {userProfile?.full_name || userProfile?.email?.split('@')[0] || 'Administrator'}
                    </h2>
                    <p className="text-stone-500 dark:text-stone-400 flex items-center gap-2">
                      <Shield className="h-4 w-4 text-purple-500" />
                      System Administrator • Level 5 Clearance
                    </p>
                  </div>

                  {/* Status Badge */}
                  <div className="bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-200 dark:border-emerald-800 px-4 py-2 rounded-lg">
                    <div className="flex items-center gap-2">
                      <span className="relative flex h-3 w-3">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500"></span>
                      </span>
                      <span className="text-sm font-bold text-emerald-700 dark:text-emerald-400">Active</span>
                    </div>
                  </div>
                </div>

                {/* Admin Details Grid */}
                <div className="grid md:grid-cols-2 gap-6">
                  {/* Email */}
                  <div className="space-y-2">
                    <label className="block text-xs font-bold uppercase tracking-wider text-stone-400">Email Address</label>
                    <p className="text-base font-medium text-[#121212] dark:text-white break-all">
                      {userProfile?.email || 'admin@starset.ai'}
                    </p>
                  </div>

                  {/* Role */}
                  <div className="space-y-2">
                    <label className="block text-xs font-bold uppercase tracking-wider text-stone-400">Role</label>
                    <p className="text-base font-medium text-[#121212] dark:text-white">
                      {userProfile?.role_text || 'Administrator'}
                    </p>
                  </div>

                  {/* User ID */}
                  <div className="space-y-2">
                    <label className="block text-xs font-bold uppercase tracking-wider text-stone-400">User ID</label>
                    <p className="text-base font-mono text-stone-600 dark:text-stone-400">
                      {userProfile?.id?.slice(0, 16) || 'N/A'}...
                    </p>
                  </div>

                  {/* Last Login */}
                  <div className="space-y-2">
                    <label className="block text-xs font-bold uppercase tracking-wider text-stone-400">Last Login</label>
                    <p className="text-base font-medium text-[#121212] dark:text-white">
                      {formatLastLogin()}
                    </p>
                  </div>

                  {/* Account Created */}
                  <div className="space-y-2">
                    <label className="block text-xs font-bold uppercase tracking-wider text-stone-400">Account Created</label>
                    <p className="text-base font-medium text-[#121212] dark:text-white">
                      {userProfile?.created_at ? new Date(userProfile.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : 'N/A'}
                    </p>
                  </div>

                  {/* Trust Score */}
                  <div className="space-y-2">
                    <label className="block text-xs font-bold uppercase tracking-wider text-stone-400">Trust Score</label>
                    <p className="text-base font-bold text-emerald-500">
                      {userProfile?.trust_score || 100}/100
                    </p>
                  </div>
                </div>
              </div>

              {/* Permissions Card */}
              <div className="bg-white dark:bg-zinc-900 rounded-2xl border border-stone-200 dark:border-white/10 p-6 md:p-8 shadow-sm">
                <h3 className="text-lg font-bold text-[#121212] dark:text-white mb-4 flex items-center gap-2">
                  <Shield className="h-5 w-5 text-purple-500" />
                  Administrator Permissions
                </h3>
                <div className="grid md:grid-cols-2 gap-3">
                  {[
                    'Create & Manage Tasks',
                    'View All Contributors',
                    'Access Analytics Dashboard',
                    'Manage Payments',
                    'System Configuration',
                    'User Management'
                  ].map((permission, idx) => (
                    <div key={idx} className="flex items-center gap-2 text-sm text-stone-600 dark:text-stone-400">
                      <CheckCircle2 className="h-4 w-4 text-emerald-500" />
                      {permission}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          );
        default:
          return <AdminDashboard onNavigate={setCurrentPage} tasks={tasks} />;
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
          isDark={isDark}
        />;
      case 'dashboard':
        return <Dashboard onNavigate={setCurrentPage} />;
      case 'tasks':
        return <TaskList onSelectTask={handleSelectTask} tasks={tasks} />;
      case 'execution':
        if (!activeTask) return <TaskList onSelectTask={handleSelectTask} tasks={tasks} />;
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
          <div className="bg-white/70 dark:bg-black/40 backdrop-blur-md p-6 md:p-10 rounded-2xl border border-stone-200 dark:border-white/10 shadow-sm max-w-4xl animate-in fade-in duration-500">
            <h1 className="text-2xl md:text-3xl font-bold mb-8 text-[#121212] dark:text-white">Quality Guidelines</h1>
            <p className="mb-8 text-base md:text-lg text-stone-600 dark:text-stone-300 leading-relaxed">Strict adherence to these guidelines is required for payout. Violations may result in account suspension.</p>
            <div className="grid md:grid-cols-2 gap-6">
              <div className="p-6 md:p-8 bg-[#FAF9F7]/80 dark:bg-white/5 rounded-xl border border-stone-200 dark:border-white/10">
                <h3 className="font-bold text-[#121212] dark:text-white mb-3 text-lg">Audio</h3>
                <p className="text-stone-600 dark:text-stone-400 leading-relaxed">No background noise (TV, fans, other people). Clear pronunciation required. Use a headset if possible.</p>
              </div>
              <div className="p-6 md:p-8 bg-[#FAF9F7]/80 dark:bg-white/5 rounded-xl border border-stone-200 dark:border-white/10">
                <h3 className="font-bold text-[#121212] dark:text-white mb-3 text-lg">Text</h3>
                <p className="text-stone-600 dark:text-stone-400 leading-relaxed">Proper grammar and spelling are required unless colloquialisms are explicitly requested.</p>
              </div>
            </div>
          </div>
        );
      case 'support':
        return (
          <div className="bg-white/70 dark:bg-black/40 backdrop-blur-md p-6 md:p-10 rounded-2xl border border-stone-200 dark:border-white/10 shadow-sm max-w-3xl animate-in fade-in duration-500">
            <h1 className="text-2xl md:text-3xl font-bold mb-4 text-[#121212] dark:text-white">Support</h1>
            <p className="text-stone-600 dark:text-stone-300 mb-10 text-lg">Need help? Submit a ticket below.</p>
            <form className="space-y-8">
              <div>
                <label className="block text-sm font-bold text-stone-700 dark:text-stone-300 mb-2 uppercase tracking-wide">Issue Type</label>
                <select className="w-full border-stone-200 dark:border-white/10 rounded-xl p-4 border bg-[#FAF9F7]/50 dark:bg-white/5 focus:bg-white dark:focus:bg-black focus:ring-2 focus:ring-teal-500/20 focus:border-[#0f766e] transition-all outline-none text-base text-zinc-900 dark:text-white">
                  <option>Payment Issue</option>
                  <option>Task Bug</option>
                  <option>Account Question</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-bold text-stone-700 dark:text-stone-300 mb-2 uppercase tracking-wide">Description</label>
                <textarea className="w-full border-stone-200 dark:border-white/10 rounded-xl p-4 border h-40 bg-[#FAF9F7]/50 dark:bg-white/5 focus:bg-white dark:focus:bg-black focus:ring-2 focus:ring-teal-500/20 focus:border-[#0f766e] transition-all resize-none outline-none text-base text-zinc-900 dark:text-white"></textarea>
              </div>
              <button className="bg-[#0f766e] text-white px-8 py-4 rounded-xl font-medium shadow-lg shadow-teal-900/10 hover:shadow-teal-900/20 hover:-translate-y-0.5 transition-all text-lg w-full md:w-auto">Submit Ticket</button>
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
          <div className="space-y-6 animate-in fade-in duration-500">
            <h1 className="text-2xl md:text-3xl font-bold mb-6 text-[#121212] dark:text-white">
              Contributor ID: {userProfile?.id?.slice(0, 8) || 'Loading...'}
            </h1>

            {/* Profile Header */}
            <div className="bg-white dark:bg-zinc-900 rounded-2xl border border-stone-200 dark:border-white/10 p-6 md:p-8 flex flex-col md:flex-row items-center gap-8 shadow-sm">
              <div className="h-24 w-24 bg-stone-100 dark:bg-white/10 rounded-full flex items-center justify-center text-3xl font-bold text-stone-500 dark:text-white">
                {getInitials(userProfile?.full_name || userProfile?.email || 'User')}
              </div>
              <div className="flex-1 text-center md:text-left">
                <h2 className="text-2xl font-bold text-[#121212] dark:text-white">
                  {userProfile?.full_name || userProfile?.email?.split('@')[0] || 'User'}
                </h2>
                <p className="text-stone-500 dark:text-stone-400 flex items-center justify-center md:justify-start gap-2 mt-1">
                  <Shield className="h-4 w-4 text-emerald-500" />
                  Verified Contributor • Joined {formatDate(userProfile?.created_at)}
                </p>
              </div>
              <div className="text-center md:text-right w-full md:w-auto border-t md:border-t-0 border-stone-100 dark:border-white/5 pt-4 md:pt-0">
                <div className="text-xs font-bold uppercase tracking-wider text-stone-400 mb-1">Trust Score</div>
                <div className="text-3xl font-bold text-emerald-500">{userProfile?.trust_score || 100}/100</div>
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              {/* Demographics */}
              <div className="bg-white dark:bg-zinc-900 rounded-2xl border border-stone-200 dark:border-white/10 p-6 md:p-8 shadow-sm">
                <h3 className="text-lg font-bold text-[#121212] dark:text-white mb-6 flex items-center gap-2">
                  <User className="h-5 w-5 text-blue-500" /> Demographics
                </h3>
                <div className="space-y-6">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider text-stone-400 mb-1">Age</label>
                      <p className="text-base font-medium text-[#121212] dark:text-white">{userProfile?.age || 'Not set'}</p>
                    </div>
                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider text-stone-400 mb-1">Gender</label>
                      <p className="text-base font-medium text-[#121212] dark:text-white">{userProfile?.gender || 'Not set'}</p>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider text-stone-400 mb-1">City</label>
                      <p className="text-base font-medium text-[#121212] dark:text-white flex items-center gap-2">
                        <MapPin className="h-4 w-4 text-stone-400" /> {userProfile?.city || 'Not set'}
                      </p>
                    </div>
                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider text-stone-400 mb-1">State</label>
                      <p className="text-base font-medium text-[#121212] dark:text-white">{userProfile?.state || 'Not set'}</p>
                    </div>
                  </div>
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-stone-400 mb-1">Email</label>
                    <p className="text-base font-medium text-[#121212] dark:text-white break-all">{userProfile?.email || 'Not available'}</p>
                  </div>
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-stone-400 mb-1">UPI ID</label>
                    <p className="text-base font-medium text-[#121212] dark:text-white">{userProfile?.upi_id || 'Not set'}</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="pt-8 border-t border-stone-200 dark:border-white/10 flex justify-end pb-20 md:pb-0">
              <button
                className="text-red-600 font-medium text-base hover:underline hover:text-red-700 transition-colors w-full md:w-auto text-center"
                onClick={() => alert("Contact support to delete account.")}
              >
                Delete Account
              </button>
            </div>
          </div>
        );
      default:
        return <Dashboard onNavigate={setCurrentPage} />;
    }
  };

  return (
    <div className="flex h-[100dvh] bg-transparent text-[#121212] dark:text-white font-sans selection:bg-teal-100 selection:text-teal-900 overflow-hidden">
      {/* Desktop Sidebar - Hidden on Mobile */}
      <div className="hidden md:block h-full">
        <Sidebar
          currentPage={currentPage}
          onNavigate={setCurrentPage}
          isMobileOpen={isMobileNavOpen}
          setIsMobileOpen={setIsMobileNavOpen}
          onLogout={handleLogout}
          onExitApp={handleExitApp}
          isDark={isDark}
          toggleTheme={toggleTheme}
          userRole={userRole}
        />
      </div>

      <div className="flex-1 flex flex-col h-full overflow-hidden relative">
        {/* Mobile Header - Visible only on Mobile */}
        <header className="md:hidden bg-white/90 dark:bg-black/90 backdrop-blur-md border-b border-stone-200 dark:border-white/10 h-16 flex items-center justify-between px-4 flex-shrink-0 z-30 relative">
          <div className="flex items-center gap-2">
            <Logo className="h-6 w-6 text-blue-600 dark:text-blue-500" />
            <span className="font-bold text-base text-[#121212] dark:text-white tracking-[0.1em] uppercase whitespace-nowrap">STARSET</span>
          </div>
          <div className="flex items-center gap-3">
            <button onClick={toggleTheme} className="p-2 text-zinc-600 dark:text-zinc-400">
              {isDark ? <Moon className="h-5 w-5" /> : <Sun className="h-5 w-5" />}
            </button>
            {/* Open Sidebar Overlay for extra menu items if needed */}
            <button
              onClick={() => setIsMobileNavOpen(true)}
              className="p-2 text-stone-600 dark:text-stone-300 hover:bg-stone-100 dark:hover:bg-white/10 rounded-lg transition-colors"
            >
              <MoreHorizontal className="h-6 w-6" />
            </button>
          </div>
        </header>

        {/* Mobile Sidebar Overlay (For Menu Items not in Bottom Nav) */}
        <div className="md:hidden">
          <Sidebar
            currentPage={currentPage}
            onNavigate={setCurrentPage}
            isMobileOpen={isMobileNavOpen}
            setIsMobileOpen={setIsMobileNavOpen}
            onLogout={handleLogout}
            onExitApp={handleExitApp}
            isDark={isDark}
            toggleTheme={toggleTheme}
            userRole={userRole}
          />
        </div>

        {/* Main Content Scrollable Area */}
        <main className="flex-1 overflow-y-auto p-4 md:p-10 scroll-smooth pb-24 md:pb-10">
          <div className="max-w-[1600px] mx-auto min-h-full flex flex-col">
            <div className="flex-1">
              {renderContent()}
            </div>

            <footer className="mt-12 py-6 border-t border-zinc-200 dark:border-white/5 flex flex-col md:flex-row items-center justify-between gap-4 text-zinc-400 dark:text-zinc-600 text-xs">
              <div className="flex items-center gap-2">
                <Logo className="h-5 w-5 opacity-70" />
                <span className="font-bold tracking-wider uppercase">Starset Intelligence</span>
              </div>
              <div className="flex items-center gap-6">
                <span className="hover:text-zinc-600 dark:hover:text-zinc-400 transition-colors cursor-pointer">System Status: Stable</span>
                <span className="font-mono opacity-50">v2.5.4</span>
              </div>
            </footer>
          </div>
        </main>

        {/* Mobile Bottom Navigation - Visible only on Mobile */}
        <div className="md:hidden absolute bottom-0 left-0 w-full bg-white dark:bg-black border-t border-stone-200 dark:border-white/10 px-6 py-3 flex justify-between items-center z-40 safe-area-bottom">
          <button
            onClick={() => setCurrentPage('dashboard')}
            className={`flex flex-col items-center gap-1 transition-colors ${currentPage === 'dashboard' ? 'text-blue-600 dark:text-blue-500' : 'text-stone-400'}`}
          >
            <LayoutDashboard className="h-6 w-6" strokeWidth={currentPage === 'dashboard' ? 2.5 : 2} />
            <span className="text-[10px] font-medium">Home</span>
          </button>

          <button
            onClick={() => setCurrentPage('tasks')}
            className={`flex flex-col items-center gap-1 transition-colors ${currentPage === 'tasks' || currentPage === 'execution' ? 'text-blue-600 dark:text-blue-500' : 'text-stone-400'}`}
          >
            <Database className="h-6 w-6" strokeWidth={currentPage === 'tasks' || currentPage === 'execution' ? 2.5 : 2} />
            <span className="text-[10px] font-medium">Tasks</span>
          </button>

          <button
            onClick={() => setCurrentPage('earnings')}
            className={`flex flex-col items-center gap-1 transition-colors ${currentPage === 'earnings' ? 'text-blue-600 dark:text-blue-500' : 'text-stone-400'}`}
          >
            <CreditCard className="h-6 w-6" strokeWidth={currentPage === 'earnings' ? 2.5 : 2} />
            <span className="text-[10px] font-medium">Money</span>
          </button>

          <button
            onClick={() => setCurrentPage('account')}
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

export default App;