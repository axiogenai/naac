'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  LayoutDashboard, 
  CheckSquare, 
  FileText, 
  Users, 
  GraduationCap, 
  Award, 
  Bot, 
  Bell, 
  Sun, 
  Moon, 
  Menu, 
  ChevronLeft, 
  ChevronRight, 
  Sparkles, 
  Settings, 
  ShieldAlert,
  ChevronDown,
  Check,
  Search,
  MessageSquare
} from 'lucide-react';
import { useAppStore, UserRole } from '@/store/appStore';
import AIChatbot from '@/components/AIChatbot';

interface NavItem {
  name: string;
  href: string;
  icon: React.ComponentType<any>;
  badge?: string;
  roles?: UserRole[];
}

const navItems: NavItem[] = [
  { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
  { name: 'Criteria Hub', href: '/criteria', icon: CheckSquare, badge: '7', roles: ['IQAC Coordinator', 'Principal', 'HOD', 'Faculty', 'College Admin'] },
  { name: 'Documents', href: '/documents', icon: FileText, roles: ['IQAC Coordinator', 'Principal', 'HOD', 'Faculty', 'College Admin'] },
  { name: 'Faculty Registry', href: '/faculty', icon: Users, roles: ['IQAC Coordinator', 'Principal', 'HOD', 'College Admin'] },
  { name: 'Student Analytics', href: '/students', icon: GraduationCap, roles: ['IQAC Coordinator', 'Principal', 'HOD', 'Student', 'College Admin'] },
  { name: 'IQAC Management', href: '/iqac', icon: Award, roles: ['IQAC Coordinator', 'Principal', 'College Admin'] },
  { name: 'AI SSR Writer', href: '/reports/ssr', icon: Sparkles, roles: ['IQAC Coordinator', 'Principal', 'HOD', 'College Admin'] },
];

export default function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const { 
    theme, 
    toggleTheme, 
    setTheme,
    sidebarOpen, 
    toggleSidebar, 
    currentRole, 
    setRole, 
    notifications,
    markAsRead,
    clearAllNotifications,
    isAuthenticated,
    logout,
    user,
    selectedDepartment,
    setDepartment
  } = useAppStore();

  const [roleMenuOpen, setRoleMenuOpen] = useState(false);
  const [deptMenuOpen, setDeptMenuOpen] = useState(false);
  const [notifMenuOpen, setNotifMenuOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  // Responsive layout tracking
  useEffect(() => {
    const handleResize = () => {
      const mobile = window.innerWidth < 1024;
      setIsMobile(mobile);
      if (mobile) {
        useAppStore.setState({ sidebarOpen: false });
      }
    };
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Auto-close sidebar on navigate for mobile
  useEffect(() => {
    if (isMobile && sidebarOpen) {
      useAppStore.setState({ sidebarOpen: false });
    }
  }, [pathname, isMobile]);

  // Initialize theme class on mount
  useEffect(() => {
    setMounted(true);
    const root = window.document.documentElement;
    root.classList.remove('light', 'dark');
    root.classList.add(theme);
  }, [theme]);

  // Auth protection routing
  useEffect(() => {
    if (mounted && !isAuthenticated && pathname !== '/auth/login') {
      router.push('/auth/login');
    }
  }, [isAuthenticated, pathname, router, mounted]);

  if (!mounted) return null;

  if (pathname === '/auth/login' || !isAuthenticated) {
    return (
      <div className="min-h-screen text-foreground bg-background transition-colors duration-300">
        {children}
      </div>
    );
  }

  const unreadNotifCount = notifications.filter(n => !n.read).length;
  const roles: UserRole[] = ['IQAC Coordinator', 'Principal', 'HOD', 'Faculty', 'College Admin'];

  const departmentsList = [
    'All Departments', 
    'Computer Science', 
    'Electronics', 
    'Mechanical', 
    'AIML', 
    'AIDS'
  ];
  const isDeptLocked = currentRole === 'HOD' || currentRole === 'Faculty' || currentRole === 'Student';

  const filteredNavItems = navItems.filter(item => 
    !item.roles || item.roles.includes(currentRole)
  );

  const activeNavItem = navItems.find(item => 
    pathname === item.href || pathname?.startsWith(item.href + '/')
  );
  const isAllowed = !activeNavItem || !activeNavItem.roles || activeNavItem.roles.includes(currentRole);

  return (
    <div className="min-h-screen flex text-foreground bg-background transition-colors duration-300">
      {/* BACKGROUND GRADIENTS */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
        <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] rounded-full bg-blue-500/10 blur-[120px] dark:bg-blue-600/5" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] rounded-full bg-purple-500/10 blur-[120px] dark:bg-purple-600/5" />
      </div>

      {/* MOBILE BACKDROP OVERLAY */}
      <AnimatePresence>
        {isMobile && sidebarOpen && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => useAppStore.setState({ sidebarOpen: false })}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-30 lg:hidden"
          />
        )}
      </AnimatePresence>

      {/* SIDEBAR */}
      <motion.aside 
        className="glass fixed top-0 bottom-0 left-0 z-40 border-r flex flex-col overflow-hidden bg-background/95 lg:bg-background/80"
        initial={isMobile ? { x: -260, width: '260px' } : { x: 0, width: '72px' }}
        animate={isMobile ? { x: sidebarOpen ? 0 : -260, width: '260px' } : { x: 0, width: sidebarOpen ? '260px' : '72px' }}
        transition={{ duration: 0.3, ease: 'easeInOut' }}
      >
        {/* LOGO AREA */}
        <div className="h-16 flex items-center justify-between px-4 border-b border-border/40">
          <Link href="/dashboard" className="flex items-center gap-3 overflow-hidden">
            <div className="w-11 h-9 rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-600 flex items-center justify-center text-white text-[10px] font-extrabold shadow-md shadow-blue-500/20 shrink-0">
              AMG
            </div>
            {sidebarOpen && (
              <motion.div 
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0 }}
                className="flex flex-col"
              >
                <span className="font-bold text-base tracking-tight leading-none text-gradient-primary">AMG</span>
                <span className="text-[10px] text-muted-foreground mt-0.5 font-medium">Accreditation Intel</span>
              </motion.div>
            )}
          </Link>
          {sidebarOpen && (
            <button 
              onClick={toggleSidebar}
              className="p-1 rounded-lg hover:bg-muted text-muted-foreground hover:text-foreground transition-colors"
            >
              <ChevronLeft size={16} />
            </button>
          )}
        </div>

        {/* NAV ITEMS */}
        <nav className="flex-1 py-6 px-3 space-y-1 overflow-y-auto overflow-x-hidden">
          {isMobile && (
            <div className="space-y-3 mb-6 p-3 rounded-2xl bg-muted/40 border border-border/20 text-xs">
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">Active View Department</label>
                <select
                  value={selectedDepartment}
                  onChange={(e) => setDepartment(e.target.value)}
                  disabled={isDeptLocked}
                  className="w-full p-2 rounded-xl bg-popover border border-border text-foreground outline-none text-xs"
                >
                  {departmentsList.map(dept => (
                    <option key={dept} value={dept}>{dept}</option>
                  ))}
                </select>
              </div>
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">Active Sign-in Role</label>
                <select
                  value={currentRole}
                  onChange={(e) => setRole(e.target.value as UserRole)}
                  className="w-full p-2 rounded-xl bg-popover border border-border text-foreground outline-none text-xs"
                >
                  {roles.map(r => (
                    <option key={r} value={r}>{r}</option>
                  ))}
                </select>
              </div>
            </div>
          )}
          {filteredNavItems.map((item) => {
            const isActive = pathname === item.href || pathname?.startsWith(item.href + '/');
            return (
              <Link key={item.name} href={item.href}>
                <div 
                  className={`flex items-center relative group justify-between p-3 rounded-xl transition-all duration-200 cursor-pointer ${
                    isActive 
                      ? 'bg-primary/10 text-primary dark:bg-primary/20 dark:text-blue-400 font-semibold' 
                      : 'hover:bg-muted/80 text-muted-foreground hover:text-foreground'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <item.icon size={20} className={isActive ? 'text-primary dark:text-blue-400' : 'text-muted-foreground group-hover:text-foreground'} />
                    {sidebarOpen && (
                      <motion.span 
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="text-sm font-medium"
                      >
                        {item.name}
                      </motion.span>
                    )}
                  </div>
                  {sidebarOpen && item.badge && (
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-primary/15 text-primary dark:bg-primary/30 dark:text-blue-400">
                      {item.badge}
                    </span>
                  )}
                  {!sidebarOpen && (
                    <div className="absolute left-16 px-2 py-1 bg-popover text-popover-foreground text-xs rounded border shadow-md opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none z-50">
                      {item.name}
                    </div>
                  )}
                </div>
              </Link>
            );
          })}
        </nav>

        {/* BOTTOM USER ROLE / TOGGLE ACTION */}
        <div className="p-3 border-t border-border/40 space-y-2">
          {!sidebarOpen && (
            <button 
              onClick={toggleSidebar}
              className="w-full flex items-center justify-center p-3 rounded-xl hover:bg-muted text-muted-foreground hover:text-foreground transition-colors"
            >
              <ChevronRight size={20} />
            </button>
          )}

          {sidebarOpen && (
            <div className="flex items-center justify-between p-2 rounded-xl bg-muted/40 border border-border/20">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-indigo-500/10 flex items-center justify-center text-indigo-500 font-semibold text-xs border border-indigo-500/20">
                  {currentRole.slice(0, 2).toUpperCase()}
                </div>
                <div className="flex flex-col">
                  <span className="text-xs font-semibold leading-none">{currentRole}</span>
                  <span className="text-[10px] text-muted-foreground mt-0.5">Role Mode</span>
                </div>
              </div>
            </div>
          )}
        </div>
      </motion.aside>

      {/* MAIN CONTAINER */}
      <div 
        className="flex-1 flex flex-col transition-all duration-300 z-10"
        style={{ paddingLeft: isMobile ? '0px' : (sidebarOpen ? '260px' : '72px') }}
      >
        {/* HEADER */}
        <header className="h-16 border-b border-border/40 glass sticky top-0 z-30 flex items-center justify-between px-4 lg:px-6">
          <div className="flex items-center gap-2 lg:gap-4 overflow-hidden mr-2">
            {isMobile && (
              <button 
                onClick={toggleSidebar}
                className="p-2 rounded-xl bg-muted/40 border border-border/20 hover:bg-muted text-muted-foreground hover:text-foreground transition-colors shrink-0"
              >
                <Menu size={18} />
              </button>
            )}
            <span className="font-semibold text-sm lg:text-lg text-foreground truncate">
              {pathname === '/dashboard' ? 'Executive Dashboard' :
               pathname?.startsWith('/criteria') ? 'Criteria Hub & Submissions' :
               pathname?.startsWith('/documents') ? 'Advanced Document Management' :
               pathname?.startsWith('/faculty') ? 'Faculty Registry' :
               pathname?.startsWith('/students') ? 'Student Analytics' :
               pathname?.startsWith('/iqac') ? 'IQAC Quality Board' :
               pathname?.startsWith('/reports/ssr') ? 'AI SSR Report Writer' : 'NAIP'}
            </span>
            <div className="hidden md:flex items-center gap-2 px-3 py-1 rounded-lg bg-muted/50 border border-border/30 text-muted-foreground text-xs w-64 shrink-0 focus-within:border-primary transition-colors">
              <Search size={14} className="shrink-0 text-muted-foreground" />
              <input 
                type="text"
                placeholder="Search criteria, files..."
                className="bg-transparent border-none outline-none w-full text-foreground text-xs placeholder:text-muted-foreground"
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    const query = e.currentTarget.value.toLowerCase();
                    if (query.includes('crit')) router.push('/criteria');
                    else if (query.includes('doc') || query.includes('file') || query.includes('evidence')) router.push('/documents');
                    else if (query.includes('fac') || query.includes('teach')) router.push('/faculty');
                    else if (query.includes('stud')) router.push('/students');
                    else if (query.includes('iqac') || query.includes('meet') || query.includes('bench') || query.includes('feed')) router.push('/iqac');
                    else if (query.includes('ssr') || query.includes('write') || query.includes('report') || query.includes('chap')) router.push('/reports/ssr');
                  }
                }}
              />
              <span className="ml-auto text-[10px] bg-border px-1.5 py-0.5 rounded shrink-0">Enter</span>
            </div>
          </div>

          <div className="flex items-center gap-2 lg:gap-3 shrink-0">
            {/* DEPARTMENT SELECTOR DROPDOWN */}
            <div className="hidden sm:block relative">
              <button 
                onClick={() => !isDeptLocked && setDeptMenuOpen(!deptMenuOpen)}
                disabled={isDeptLocked}
                className={`flex items-center gap-1.5 text-xs font-semibold px-3 py-2 rounded-xl border border-border/30 transition-colors ${
                  isDeptLocked 
                    ? 'bg-muted/30 text-muted-foreground cursor-not-allowed' 
                    : 'bg-muted/60 hover:bg-muted text-foreground'
                }`}
              >
                <span>Dept: {selectedDepartment}</span>
                {!isDeptLocked && <ChevronDown size={14} className="text-muted-foreground" />}
              </button>

              <AnimatePresence>
                {deptMenuOpen && !isDeptLocked && (
                  <>
                    <div className="fixed inset-0 z-40" onClick={() => setDeptMenuOpen(false)} />
                    <motion.div 
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 10 }}
                      className="absolute right-0 mt-2 w-56 rounded-xl border border-border bg-popover p-1 shadow-lg z-50 text-popover-foreground max-h-60 overflow-y-auto"
                    >
                      <div className="px-2 py-1.5 text-[10px] font-bold text-muted-foreground uppercase tracking-wider">
                        Select Department
                      </div>
                      {departmentsList.map((dept) => (
                        <button
                          key={dept}
                          onClick={() => {
                            setDepartment(dept);
                            setDeptMenuOpen(false);
                          }}
                          className="w-full flex items-center justify-between px-3 py-2 text-xs rounded-lg hover:bg-muted transition-colors text-left"
                        >
                          <span className={selectedDepartment === dept ? 'font-semibold text-primary' : ''}>{dept}</span>
                          {selectedDepartment === dept && <Check size={14} className="text-primary" />}
                        </button>
                      ))}
                    </motion.div>
                  </>
                )}
              </AnimatePresence>
            </div>

            {/* ROLE SELECTOR DROPDOWN */}
            <div className="hidden sm:block relative">
              <button 
                onClick={() => setRoleMenuOpen(!roleMenuOpen)}
                className="flex items-center gap-1.5 text-xs font-semibold px-3 py-2 rounded-xl bg-muted/60 border border-border/30 hover:bg-muted transition-colors"
              >
                <span>Role: {currentRole}</span>
                <ChevronDown size={14} className="text-muted-foreground" />
              </button>

              <AnimatePresence>
                {roleMenuOpen && (
                  <>
                    <div className="fixed inset-0 z-40" onClick={() => setRoleMenuOpen(false)} />
                    <motion.div 
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 10 }}
                      className="absolute right-0 mt-2 w-56 rounded-xl border border-border bg-popover p-1 shadow-lg z-50 text-popover-foreground"
                    >
                      <div className="px-2 py-1.5 text-[10px] font-bold text-muted-foreground uppercase tracking-wider">
                        Switch View As
                      </div>
                      {roles.map((role) => (
                        <button
                          key={role}
                          onClick={() => {
                            setRole(role);
                            setRoleMenuOpen(false);
                          }}
                          className="w-full flex items-center justify-between px-3 py-2 text-xs rounded-lg hover:bg-muted transition-colors text-left"
                        >
                          <span className={currentRole === role ? 'font-semibold text-primary' : ''}>{role}</span>
                          {currentRole === role && <Check size={14} className="text-primary" />}
                        </button>
                      ))}
                    </motion.div>
                  </>
                )}
              </AnimatePresence>
            </div>

            {/* THEME TOGGLE */}
            <button 
              onClick={toggleTheme}
              className="p-2 rounded-xl hover:bg-muted text-muted-foreground hover:text-foreground transition-colors border border-transparent hover:border-border/30"
            >
              {theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
            </button>

            {/* NOTIFICATIONS */}
            <div className="relative">
              <button 
                onClick={() => setNotifMenuOpen(!notifMenuOpen)}
                className="p-2 rounded-xl hover:bg-muted text-muted-foreground hover:text-foreground transition-colors relative border border-transparent hover:border-border/30"
              >
                <Bell size={18} />
                {unreadNotifCount > 0 && (
                  <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-red-500" />
                )}
              </button>

              <AnimatePresence>
                {notifMenuOpen && (
                  <>
                    <div className="fixed inset-0 z-40" onClick={() => setNotifMenuOpen(false)} />
                    <motion.div 
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 10 }}
                      className="absolute right-0 mt-2 w-80 rounded-xl border border-border bg-popover p-1 shadow-lg z-50 text-popover-foreground"
                    >
                      <div className="flex items-center justify-between px-3 py-2 border-b border-border/40">
                        <span className="font-semibold text-xs">Notifications</span>
                        <button 
                          onClick={clearAllNotifications}
                          className="text-[10px] font-semibold text-primary hover:underline"
                        >
                          Clear all
                        </button>
                      </div>
                      <div className="max-h-64 overflow-y-auto py-1">
                        {notifications.length === 0 ? (
                          <div className="text-center py-6 text-xs text-muted-foreground">
                            No notifications
                          </div>
                        ) : (
                          notifications.map((n) => (
                            <div 
                              key={n.id} 
                              onClick={() => markAsRead(n.id)}
                              className={`p-3 text-xs border-b border-border/20 last:border-b-0 cursor-pointer hover:bg-muted/40 transition-colors flex gap-2.5 ${!n.read ? 'bg-primary/5' : ''}`}
                            >
                              <div className="mt-0.5">
                                {n.type === 'warning' && <ShieldAlert size={14} className="text-amber-500" />}
                                {n.type === 'success' && <Check size={14} className="text-emerald-500" />}
                                {n.type === 'info' && <Bell size={14} className="text-blue-500" />}
                              </div>
                              <div className="flex-1 space-y-0.5">
                                <div className="font-semibold flex justify-between">
                                  <span>{n.title}</span>
                                  <span className="text-[9px] text-muted-foreground font-normal">{n.timestamp}</span>
                                </div>
                                <p className="text-muted-foreground leading-normal">{n.message}</p>
                              </div>
                            </div>
                          ))
                        )}
                      </div>
                    </motion.div>
                  </>
                )}
              </AnimatePresence>
            </div>

            {/* USER PROFILE & LOGOUT */}
            <div className="flex items-center gap-2 border-l border-border/40 pl-3">
              <button 
                onClick={logout}
                className="flex items-center gap-2 text-left hover:opacity-85 transition-opacity"
                title="Click to Sign Out"
              >
                <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-blue-600 to-purple-600 flex items-center justify-center text-white text-xs font-bold font-sans">
                  {user?.name ? user.name.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase() : 'US'}
                </div>
                <div className="hidden xl:flex flex-col">
                  <span className="text-xs font-semibold leading-none">{user?.name || 'User Profile'}</span>
                  <span className="text-[10px] text-red-500 mt-0.5 font-semibold">Sign Out</span>
                </div>
              </button>
            </div>
          </div>
        </header>

        {/* CONTENT */}
        <main className="flex-1 p-6 z-10">
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="w-full h-full"
          >
            {isAllowed ? (
              children
            ) : (
              <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-6 text-center max-w-md mx-auto p-8 rounded-3xl glass-card border border-red-500/10">
                <div className="w-16 h-16 rounded-2xl bg-red-500/10 flex items-center justify-center text-red-500 shadow-lg shadow-red-500/10 animate-pulse">
                  <ShieldAlert size={32} />
                </div>
                <div className="space-y-2">
                  <h2 className="text-xl font-bold tracking-tight text-red-600 dark:text-red-400">Access Restricted</h2>
                  <p className="text-xs text-muted-foreground leading-normal">
                    Your active role <strong className="text-foreground">{currentRole}</strong> does not have authorization to access the <strong className="text-foreground">{activeNavItem?.name || 'requested'}</strong> section.
                  </p>
                </div>
                <div className="flex gap-3 pt-2 w-full">
                  <Link href="/dashboard" className="flex-1 py-2.5 rounded-xl bg-primary text-primary-foreground text-xs font-bold hover:opacity-90 transition-opacity text-center">
                    Return to Dashboard
                  </Link>
                  <button 
                    onClick={() => setRoleMenuOpen(true)}
                    className="flex-1 py-2.5 rounded-xl bg-muted border border-border/40 text-foreground text-xs font-semibold hover:bg-muted/80 transition-colors"
                  >
                    Switch Role View
                  </button>
                </div>
              </div>
            )}
          </motion.div>
        </main>
        <AIChatbot />
      </div>
    </div>
  );
}
