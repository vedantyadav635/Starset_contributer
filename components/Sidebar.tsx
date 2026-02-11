import React from 'react';
import { 
  LayoutDashboard, 
  Database, 
  CreditCard, 
  ShieldAlert, 
  LifeBuoy, 
  User, 
  Power,
  Sun,
  Moon,
  PlusCircle,
  Settings,
  Users
} from 'lucide-react';
import { PageView, UserRole } from '../types';
import { Logo } from './Logo';
import { useAuth } from '../context/AuthContext';
import { AuthProvider } from '../context/AuthContext';

interface SidebarProps {
  currentPage: PageView;
  onNavigate: (page: PageView) => void;
  isMobileOpen: boolean;
  setIsMobileOpen: (open: boolean) => void;
  onLogout: () => void;
  onExitApp: () => void;
  isDark: boolean;
  toggleTheme: () => void;
  userRole?: UserRole;
}

export const Sidebar: React.FC<SidebarProps> = ({ 
  currentPage, 
  onNavigate, 
  isMobileOpen, 
  setIsMobileOpen,
  onLogout,
  onExitApp,
  isDark,
  toggleTheme,
  userRole = 'contributor'
}) => {
  const { user } = useAuth();
  const contributorNavItems = [
    { id: 'dashboard', label: 'Overview', icon: LayoutDashboard },
    { id: 'tasks', label: 'Data Tasks', icon: Database }, 
    { id: 'earnings', label: 'Compensation', icon: CreditCard },
    { id: 'guidelines', label: 'Protocols', icon: ShieldAlert },
    { id: 'support', label: 'Support', icon: LifeBuoy },
    { id: 'account', label: 'Contributor ID', icon: User },
  ];

  const adminNavItems = [
    { id: 'admin-dashboard', label: 'Command Center', icon: LayoutDashboard },
    { id: 'admin-create-task', label: 'Create Task', icon: PlusCircle },
    { id: 'tasks', label: 'Task Registry', icon: Database }, // Shared view but different context
    { id: 'account', label: 'Admin Profile', icon: User },
  ];

  const navItems = userRole === 'admin' ? adminNavItems : contributorNavItems;

  const sidebarClasses = `
    fixed inset-y-0 left-0 z-50 w-72 bg-white/90 dark:bg-black/40 backdrop-blur-xl border-r border-zinc-200 dark:border-white/5 text-zinc-600 dark:text-zinc-400 transform transition-transform duration-300 cubic-bezier(0.4, 0, 0.2, 1)
    ${isMobileOpen ? 'translate-x-0' : '-translate-x-full'} md:translate-x-0 md:static md:inset-auto
  `;

  return (
    <>
      {/* Mobile Overlay */}
      {isMobileOpen && (
        <div 
          className="fixed inset-0 bg-zinc-900/50 backdrop-blur-sm z-40 md:hidden transition-opacity"
          onClick={() => setIsMobileOpen(false)}
        />
      )}

      <aside className={sidebarClasses}>
        <div className="flex flex-col h-full"> 
          {/* Header */}
          <div className="flex flex-col px-8 py-8 border-b border-zinc-200 dark:border-white/5 cursor-pointer hover:bg-zinc-50 dark:hover:bg-white/5 transition-colors" onClick={onExitApp}>
             <div className="flex items-center gap-3 mb-1">
                <Logo className="h-6 w-6 text-blue-600 dark:text-blue-500" />
                <span className="font-bold text-base text-zinc-900 dark:text-white tracking-[0.1em] uppercase whitespace-nowrap">STARSET</span>
             </div>
             <span className="text-[10px] text-zinc-500 font-medium uppercase tracking-widest pl-9">
               {userRole === 'admin' ? 'Administrator Node' : 'Contributor Node'}
             </span>
          </div>

          {/* Navigation */}
          <nav className="flex-1 px-4 py-8 space-y-1 overflow-y-auto">
            <div className="px-4 mb-3 text-[11px] font-bold uppercase text-zinc-400 dark:text-zinc-500 tracking-widest">
              {userRole === 'admin' ? 'Management Console' : 'Console'}
            </div>
            {navItems.map((item) => {
              const isActive = currentPage === item.id || (item.id === 'tasks' && currentPage === 'execution');
              return (
                <button
                  key={item.id}
                  onClick={() => {
                    onNavigate(item.id as PageView);
                    setIsMobileOpen(false);
                  }}
                  className={`
                    w-full flex items-center px-4 py-3 text-sm font-medium rounded-lg transition-all duration-200 group
                    ${isActive 
                      ? 'bg-blue-50 dark:bg-blue-500/10 text-blue-600 dark:text-blue-400 shadow-sm ring-1 ring-zinc-200 dark:ring-transparent' 
                      : 'hover:bg-zinc-100 dark:hover:bg-white/5 text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-200'}
                  `}
                >
                  <item.icon className={`mr-4 h-5 w-5 ${isActive ? 'text-blue-600 dark:text-blue-400' : 'text-zinc-400 group-hover:text-zinc-500 dark:group-hover:text-zinc-300'}`} strokeWidth={2} />
                  {item.label}
                </button>
              );
            })}
          </nav>

          {/* User Status */}
          <div className="p-6 border-t border-zinc-200 dark:border-white/5 bg-zinc-50/50 dark:bg-transparent space-y-4">
            {/* Theme Toggle */}
            <button 
               onClick={toggleTheme}
               className="w-full flex items-center justify-between px-4 py-2 text-xs font-medium bg-white dark:bg-white/5 border border-zinc-200 dark:border-white/10 rounded-lg hover:border-zinc-300 dark:hover:border-white/20 transition-all text-zinc-600 dark:text-zinc-400"
            >
               <span>Appearance</span>
               <div className="flex items-center gap-2">
                  <span className="text-[10px] uppercase tracking-wide">{isDark ? 'Dark' : 'Light'}</span>
                  {isDark ? <Moon className="h-3 w-3" /> : <Sun className="h-3 w-3" />}
               </div>
            </button>

            <div className="flex items-center gap-4">
              <div className={`h-10 w-10 rounded-lg border border-zinc-200 dark:border-white/5 flex items-center justify-center shadow-sm ${userRole === 'admin' ? 'bg-purple-100 dark:bg-purple-900/20 text-purple-600' : 'bg-white dark:bg-white/10 text-zinc-900 dark:text-white'}`}>
                 <span className="font-bold text-sm">
                    {userRole === 'admin' ? 'AD' : 'JD'}
                 </span>
              </div>
              <div className="flex flex-col">
                <span className="text-sm font-bold text-zinc-900 dark:text-white">
                  {user?.user_metadata?.full_name}
                </span>
                <span className="text-xs text-zinc-500">
                  {user?.user_metadata?.email}
                </span>
              </div>
              <div className={`ml-auto h-2.5 w-2.5 rounded-full animate-pulse shadow-[0_0_8px] ${userRole === 'admin' ? 'bg-purple-500 shadow-purple-500/50' : 'bg-emerald-500 shadow-emerald-500/50'}`}></div>
            </div>
            <button
              onClick={onLogout}
              className="w-full flex items-center justify-center px-4 py-2.5 text-sm font-medium text-zinc-500 hover:text-red-600 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-500/10 rounded-lg transition-colors border border-transparent hover:border-red-100 dark:hover:border-red-500/20"
            >
              <Power className="mr-2 h-4 w-4" />
              Disconnect
            </button>
          </div>
        </div>
      </aside>
    </>
  );
};