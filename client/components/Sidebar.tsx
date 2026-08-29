import React from 'react';
import {
  LayoutDashboard,
  Database,
  ShieldCheck,
  LifeBuoy,
  User,
  LogOut,
  PlusCircle,
  ClipboardList,
  PanelLeftClose,
  PanelLeftOpen,
  ArrowUpRight,
  BadgeIndianRupee,
  X,
} from 'lucide-react';

import { PageView, UserRole } from '../types';
import { LogoLockup, Logo } from './Logo';
import { useAuth } from '../context/AuthContext';
import { ThemeToggle } from './ThemeToggle';
import { cn } from '../lib/utils';

interface SidebarProps {
  currentPage: PageView;
  onNavigate: (page: PageView) => void;
  isMobileOpen: boolean;
  setIsMobileOpen: (open: boolean) => void;
  onLogout: () => void;
  onExitApp: () => void;
  userRole?: UserRole;
}

interface NavItem {
  id: PageView;
  label: string;
  icon: typeof Database;
}

interface NavGroup {
  heading: string;
  items: NavItem[];
}

const CONTRIBUTOR_GROUPS: NavGroup[] = [
  {
    heading: 'Work',
    items: [
      { id: 'tasks', label: 'Tasks', icon: Database },
      { id: 'dashboard', label: 'Overview', icon: LayoutDashboard },
      { id: 'earnings', label: 'Compensation', icon: BadgeIndianRupee },
    ],
  },
  {
    heading: 'Account',
    items: [
      { id: 'guidelines', label: 'Quality standards', icon: ShieldCheck },
      { id: 'support', label: 'Support', icon: LifeBuoy },
      { id: 'account', label: 'Profile', icon: User },
    ],
  },
];

const ADMIN_GROUPS: NavGroup[] = [
  {
    heading: 'Operations',
    items: [
      { id: 'admin-dashboard', label: 'Overview', icon: LayoutDashboard },
      { id: 'admin-submissions', label: 'Review queue', icon: ClipboardList },
      { id: 'tasks', label: 'Task registry', icon: Database },
      { id: 'admin-create-task', label: 'New collection', icon: PlusCircle },
    ],
  },
  {
    heading: 'Account',
    items: [{ id: 'account', label: 'Profile', icon: User }],
  },
];

export const Sidebar: React.FC<SidebarProps> = ({
  currentPage,
  onNavigate,
  isMobileOpen,
  setIsMobileOpen,
  onLogout,
  onExitApp,
  userRole = 'contributor',
}) => {
  const { user } = useAuth();
  const [collapsed, setCollapsed] = React.useState(false);

  const groups = userRole === 'admin' ? ADMIN_GROUPS : CONTRIBUTOR_GROUPS;
  const displayName = user?.user_metadata?.full_name || (userRole === 'admin' ? 'Administrator' : 'Contributor');
  const email = user?.email || '';

  const isActive = (id: PageView) =>
    currentPage === id || (id === 'tasks' && currentPage === 'execution');

  return (
    <>
      {/* Mobile scrim */}
      {isMobileOpen && (
        <div
          className="fixed inset-0 z-40 bg-[color-mix(in_srgb,var(--ink)_45%,transparent)] backdrop-blur-[2px] md:hidden"
          onClick={() => setIsMobileOpen(false)}
          aria-hidden="true"
        />
      )}

      <aside
        className={cn(
          'fixed inset-y-0 left-0 z-50 flex h-full flex-col border-r border-line bg-surface',
          'transition-[transform,width] duration-200 ease-out',
          'md:static md:translate-x-0',
          collapsed ? 'w-64 md:w-[4.5rem]' : 'w-64',
          isMobileOpen ? 'translate-x-0' : '-translate-x-full',
        )}
        aria-label="Product navigation"
      >
        {/* ── Brand row ── */}
        <div className="flex h-[var(--nav-h)] flex-none items-center justify-between gap-2 border-b border-line px-3">
          {collapsed ? (
            <button
              type="button"
              onClick={onExitApp}
              className="mx-auto"
              aria-label="Back to the Starset site"
            >
              <Logo className="h-8 w-8" />
            </button>
          ) : (
            <button type="button" onClick={onExitApp} className="min-w-0 pl-1" aria-label="Back to the Starset site">
              <LogoLockup markClassName="h-7 w-7" />
            </button>
          )}

          <button
            type="button"
            onClick={() => setIsMobileOpen(false)}
            className="flex h-8 w-8 flex-none items-center justify-center rounded-md text-muted transition-colors hover:bg-paper-sunk hover:text-ink md:hidden"
            aria-label="Close navigation"
          >
            <X className="h-4 w-4" strokeWidth={1.75} aria-hidden="true" />
          </button>
        </div>

        {/* ── Navigation ── */}
        <nav className="thin-scroll flex-1 overflow-y-auto px-2.5 py-4">
          {groups.map((group) => (
            <div key={group.heading} className="mb-5 last:mb-0">
              {!collapsed && <p className="t-meta px-2.5 pb-2">{group.heading}</p>}

              <ul className="space-y-0.5">
                {group.items.map((item) => {
                  const active = isActive(item.id);
                  return (
                    <li key={item.id}>
                      <button
                        type="button"
                        onClick={() => { onNavigate(item.id); setIsMobileOpen(false); }}
                        aria-current={active ? 'page' : undefined}
                        title={collapsed ? item.label : undefined}
                        className={cn(
                          'group flex w-full items-center gap-3 rounded-md px-2.5 py-2 text-sm transition-colors',
                          collapsed && 'md:justify-center md:px-0',
                          active
                            ? 'bg-paper-sunk font-medium text-ink'
                            : 'text-body hover:bg-paper-sunk hover:text-ink',
                        )}
                      >
                        <span className="relative flex-none">
                          <item.icon
                            className={cn('h-[18px] w-[18px]', active ? 'text-signal' : 'text-muted group-hover:text-ink')}
                            strokeWidth={1.75}
                            aria-hidden="true"
                          />
                        </span>
                        <span className={cn('truncate', collapsed && 'md:hidden')}>{item.label}</span>
                      </button>
                    </li>
                  );
                })}
              </ul>
            </div>
          ))}
        </nav>

        {/* ── Footer ── */}
        <div className="flex-none border-t border-line p-2.5">
          <div className={cn('flex items-center gap-2.5 rounded-md px-2 py-2', collapsed && 'md:justify-center md:px-0')}>
            <span
              className={cn(
                'flex h-8 w-8 flex-none items-center justify-center rounded-md text-xs font-semibold',
                userRole === 'admin'
                  ? 'bg-signal-soft text-signal'
                  : 'bg-paper-sunk text-ink',
              )}
              aria-hidden="true"
            >
              {displayName.charAt(0).toUpperCase()}
            </span>
            <div className={cn('min-w-0 flex-1', collapsed && 'md:hidden')}>
              <p className="truncate text-sm font-medium text-ink">{displayName}</p>
              <p className="truncate text-xs text-muted">{email || (userRole === 'admin' ? 'Administrator' : 'Signed in')}</p>
            </div>
          </div>

          <div className={cn('mt-1 flex items-center gap-1', collapsed && 'md:flex-col')}>
            <button
              type="button"
              onClick={onExitApp}
              title="Back to the site"
              className="flex h-9 flex-1 items-center justify-center gap-2 rounded-md text-xs font-medium text-body transition-colors hover:bg-paper-sunk hover:text-ink"
            >
              <ArrowUpRight className="h-4 w-4" strokeWidth={1.75} aria-hidden="true" />
              <span className={cn(collapsed && 'md:hidden')}>Site</span>
            </button>

            <button
              type="button"
              onClick={onLogout}
              title="Sign out"
              className="flex h-9 flex-1 items-center justify-center gap-2 rounded-md text-xs font-medium text-body transition-colors hover:bg-danger-soft hover:text-[color:var(--danger)]"
            >
              <LogOut className="h-4 w-4" strokeWidth={1.75} aria-hidden="true" />
              <span className={cn(collapsed && 'md:hidden')}>Sign out</span>
            </button>
          </div>

          <div className={cn('mt-1 flex items-center gap-1 border-t border-line pt-2', collapsed && 'md:flex-col')}>
            <ThemeToggle className="flex-1 border-0" />
            <button
              type="button"
              onClick={() => setCollapsed((v) => !v)}
              aria-label={collapsed ? 'Expand navigation' : 'Collapse navigation'}
              title={collapsed ? 'Expand' : 'Collapse'}
              className="hidden h-9 w-9 flex-none items-center justify-center rounded-md text-muted transition-colors hover:bg-paper-sunk hover:text-ink md:flex"
            >
              {collapsed
                ? <PanelLeftOpen className="h-4 w-4" strokeWidth={1.75} aria-hidden="true" />
                : <PanelLeftClose className="h-4 w-4" strokeWidth={1.75} aria-hidden="true" />}
            </button>
          </div>
        </div>
      </aside>
    </>
  );
};
