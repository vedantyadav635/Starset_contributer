import React from 'react';
import {
  LayoutDashboard,
  Database,
  CreditCard,
  ShieldAlert,
  LifeBuoy,
  User,
  Power,
  PlusCircle,
  Settings,
  Users,
  PanelLeftClose,
  PanelLeftOpen,
  Menu,
  ClipboardList
} from 'lucide-react';
import { PageView, UserRole } from '../types';
import { Logo } from './Logo';
import { useAuth } from '../context/AuthContext';
import { ThemeToggle } from './ThemeToggle';

interface SidebarProps {
  currentPage: PageView;
  onNavigate: (page: PageView) => void;
  isMobileOpen: boolean;
  setIsMobileOpen: (open: boolean) => void;
  onLogout: () => void;
  onExitApp: () => void;
  userRole?: UserRole;
}

export const Sidebar: React.FC<SidebarProps> = ({
  currentPage,
  onNavigate,
  isMobileOpen,
  setIsMobileOpen,
  onLogout,
  onExitApp,
  userRole = 'contributor'
}) => {
  const { user } = useAuth();
  const [isCollapsed, setIsCollapsed] = React.useState(false);

  const toggleSidebar = () => setIsCollapsed(!isCollapsed);

  const contributorNavItems = [
    { id: 'tasks', label: 'Data Tasks', icon: Database },
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'guidelines', label: 'Protocols', icon: ShieldAlert },
    { id: 'support', label: 'Support', icon: LifeBuoy },
    { id: 'account', label: 'Profile', icon: User },
  ];

  const adminNavItems = [
    { id: 'admin-dashboard', label: 'Analytics', icon: LayoutDashboard },
    { id: 'admin-create-task', label: 'Create Task', icon: PlusCircle },
    { id: 'tasks', label: 'Task Registry', icon: Database },
    { id: 'admin-submissions', label: 'Submissions', icon: ClipboardList },
    { id: 'account', label: 'Profile', icon: User },
  ];

  const navItems = userRole === 'admin' ? adminNavItems : contributorNavItems;

  const sidebarClasses = `
    fixed inset-y-0 left-0 z-50 ${isCollapsed ? 'w-24' : 'w-64'} bg-white dark:bg-black/40 backdrop-blur-xl border-r border-slate-200 dark:border-white/5 text-slate-500 dark:text-zinc-400 transform transition-all duration-300 cubic-bezier(0.4, 0, 0.2, 1)
    ${isMobileOpen ? 'translate-x-0' : '-translate-x-full'} md:translate-x-0 md:static md:inset-auto flex flex-col h-full
  `;

  return (
    <>
      {/* Mobile Overlay */}
      {isMobileOpen && (
        <div
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 md:hidden transition-opacity"
          onClick={() => setIsMobileOpen(false)}
        />
      )}

      <aside className={sidebarClasses}>
        <div className="flex flex-col h-full relative">

          {/* Simplified Toggle — Locked to 48px center axis */}
          <div className={`flex items-center py-6 px-4 gap-3 ${isCollapsed ? 'flex-col justify-center' : 'justify-between'}`}>
            <button
              onClick={toggleSidebar}
              className="h-10 w-10 flex items-center justify-center rounded-xl bg-slate-100 dark:bg-white/10 text-slate-400 dark:text-zinc-500 hover:text-slate-900 dark:hover:text-white transition-all shadow-sm active:scale-95"
              title={isCollapsed ? "Open Sidebar" : "Close Sidebar"}
            >
              {isCollapsed ? (
                <PanelLeftOpen className="h-5 w-5" />
              ) : (
                <PanelLeftClose className="h-5 w-5" />
              )}
            </button>
            <ThemeToggle />
          </div>

          {/* Navigation */}
          <nav className="flex-1 px-4 py-6 space-y-1.5 overflow-y-auto no-scrollbar">

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
                    w-full flex items-center transition-all duration-300 group relative
                    pl-[22px] py-3.5 text-sm font-bold rounded-2xl
                    ${isActive
                      ? 'bg-blue-500 text-white shadow-md'
                      : 'hover:bg-slate-100 dark:hover:bg-white/5 text-slate-500 dark:text-zinc-500 hover:text-slate-900 dark:hover:text-white'}
                  `}
                  title={isCollapsed ? item.label : ''}
                >
                  <item.icon className="h-5 w-5 mr-4 flex-shrink-0 transition-transform duration-300 group-hover:scale-110" strokeWidth={isActive ? 3 : 2} />
                  <span className={`truncate tracking-tight transition-all duration-300 ${isCollapsed ? 'opacity-0 w-0' : 'opacity-100 w-auto'}`}>
                    {item.label}
                  </span>

                  {isActive && !isCollapsed && (
                    <div className="absolute right-3 w-1.5 h-1.5 bg-white rounded-full"></div>
                  )}
                </button>
              );
            })}
          </nav>

          {/* User Status */}
          <div className="border-t border-slate-200 dark:border-white/5 bg-transparent px-4 py-6 space-y-4 overflow-hidden">
            <div className="flex items-center">
              <div className={`h-10 w-10 ml-3 flex-shrink-0 rounded-lg border border-slate-200 dark:border-white/5 flex items-center justify-center shadow-sm ${userRole === 'admin' ? 'bg-purple-900/20 text-purple-400' : 'bg-slate-100 dark:bg-white/10 text-slate-700 dark:text-white'}`}>
                {userRole === 'admin' ? (
                  <ShieldAlert className="h-5 w-5" />
                ) : (
                  <User className="h-5 w-5" />
                )}
              </div>
              <div className={`flex flex-col truncate flex-1 ml-4 transition-all duration-300 ${isCollapsed ? 'opacity-0 w-0' : 'opacity-100 w-auto'}`}>
                <span className="text-sm font-bold text-slate-900 dark:text-white truncate tracking-tight">
                  {user?.user_metadata?.full_name || 'Contributor'}
                </span>
                <span className="text-[10px] text-zinc-500 truncate font-mono uppercase">
                  {user?.user_metadata?.email?.split('@')[0] || 'active_node'}
                </span>
              </div>
            </div>
            <button
              onClick={onLogout}
              className="w-full flex items-center transition-all duration-300 group pl-[22px] py-3 text-sm font-bold text-slate-400 dark:text-zinc-500 hover:text-red-500 dark:hover:text-red-400 hover:bg-red-500/10 rounded-xl border border-transparent hover:border-red-500/20"
              title={isCollapsed ? 'Disconnect' : ''}
            >
              <Power className="h-5 w-5 mr-4 flex-shrink-0" />
              <span className={`truncate transition-all duration-300 ${isCollapsed ? 'opacity-0 w-0' : 'opacity-100 w-auto'}`}>Log Out</span>
            </button>
          </div>
        </div>
      </aside>
    </>
  );
};
