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
    { id: 'earnings', label: 'Compensation', icon: CreditCard },
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
    fixed inset-y-0 left-0 z-50 ${isCollapsed ? 'w-24' : 'w-64'} bg-white/90 dark:bg-black/40 backdrop-blur-xl border-r border-zinc-200 dark:border-white/5 text-zinc-600 dark:text-zinc-400 transform transition-all duration-300 cubic-bezier(0.4, 0, 0.2, 1)
    ${isMobileOpen ? 'translate-x-0' : '-translate-x-full'} md:translate-x-0 md:static md:inset-auto flex flex-col h-full
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
        <div className="flex flex-col h-full relative">

          {/* Header with toggle button — logo removed per request */}
          <div className={`flex items-center ${isCollapsed ? 'justify-center py-10 px-4' : 'justify-start py-6 px-6'} transition-all duration-300`}>
            <button
              onClick={toggleSidebar}
              className="hidden md:flex h-10 w-10 items-center justify-center rounded-xl bg-zinc-100 dark:bg-white/10 border border-zinc-200 dark:border-white/10 text-zinc-500 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white transition-all shadow-sm active:scale-95"
              title={isCollapsed ? "Open Sidebar" : "Close Sidebar"}
            >
              {isCollapsed ? (
                <PanelLeftOpen className="h-5 w-5" />
              ) : (
                <PanelLeftClose className="h-5 w-5" />
              )}
            </button>
          </div>

          {/* Navigation */}
          <nav className={`flex-1 ${isCollapsed ? 'px-2' : 'px-4'} py-6 space-y-1.5 overflow-y-auto overflow-x-hidden no-scrollbar`}>
            {!isCollapsed && (
              <div className="px-4 mb-3 text-[10px] font-black uppercase text-zinc-400 dark:text-zinc-500 tracking-[0.2em] opacity-60">
                {userRole === 'admin' ? 'Strategic Command' : 'Operation Center'}
              </div>
            )}
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
                    w-full flex items-center ${isCollapsed ? 'justify-center py-4' : 'px-4 py-3'} text-sm font-bold rounded-2xl transition-all duration-300 group relative
                    ${isActive
                      ? 'bg-blue-600 dark:bg-blue-500 text-white shadow-[0_10px_20px_-5px_rgba(37,99,235,0.4)] scale-[1.02]'
                      : 'hover:bg-zinc-100 dark:hover:bg-white/5 text-zinc-500 dark:text-zinc-500 hover:text-zinc-900 dark:hover:text-white'}
                  `}
                  title={isCollapsed ? item.label : ''}
                >
                  <item.icon className={`${isCollapsed ? '' : 'mr-4'} h-5 w-5 transition-transform duration-300 ${isActive ? 'scale-110' : 'group-hover:scale-110 group-hover:text-zinc-900 dark:group-hover:text-white'}`} strokeWidth={isActive ? 3 : 2} />
                  {!isCollapsed && <span className="truncate tracking-tight">{item.label}</span>}

                  {isActive && !isCollapsed && (
                    <div className="absolute right-3 w-1.5 h-1.5 bg-white rounded-full"></div>
                  )}
                </button>
              );
            })}
          </nav>

          {/* User Status */}
          <div className={`${isCollapsed ? 'p-4' : 'p-6'} border-t border-zinc-200 dark:border-white/5 bg-zinc-50/50 dark:bg-transparent space-y-4`}>
            <div className={`flex items-center ${isCollapsed ? 'justify-center' : 'gap-4'}`}>
              <div className={`h-10 w-10 flex-shrink-0 rounded-lg border border-zinc-200 dark:border-white/5 flex items-center justify-center shadow-sm ${userRole === 'admin' ? 'bg-purple-100 dark:bg-purple-900/20 text-purple-600' : 'bg-white dark:bg-white/10 text-zinc-900 dark:text-white'}`}>
                {userRole === 'admin' ? (
                  <ShieldAlert className="h-5 w-5" />
                ) : (
                  <User className="h-5 w-5" />
                )}
              </div>
              {!isCollapsed && (
                <>
                  <div className="flex flex-col truncate flex-1">
                    <span className="text-sm font-bold text-zinc-900 dark:text-white truncate">
                      {user?.user_metadata?.full_name}
                    </span>
                    <span className="text-xs text-zinc-500 truncate">
                      {user?.user_metadata?.email}
                    </span>
                  </div>
                  <div className={`ml-auto h-2.5 w-2.5 rounded-full animate-pulse shadow-[0_0_8px] ${userRole === 'admin' ? 'bg-purple-500 shadow-purple-500/50' : 'bg-emerald-500 shadow-emerald-500/50'}`}></div>
                </>
              )}
            </div>
            <button
              onClick={onLogout}
              className={`w-full flex items-center ${isCollapsed ? 'justify-center' : 'px-4'} py-2.5 text-sm font-medium text-zinc-500 hover:text-red-600 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-500/10 rounded-lg transition-colors border border-transparent hover:border-red-100 dark:hover:border-red-500/20`}
              title={isCollapsed ? 'Disconnect' : ''}
            >
              <Power className={`${isCollapsed ? '' : 'mr-2'} h-4 w-4`} />
              {!isCollapsed && <span>Disconnect</span>}
            </button>
          </div>
        </div>
      </aside>
    </>
  );
};