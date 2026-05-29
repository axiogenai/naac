import { create } from 'zustand';

export interface Notification {
  id: string;
  title: string;
  message: string;
  type: 'info' | 'warning' | 'success' | 'error';
  timestamp: string;
  read: boolean;
}

export type UserRole = 
  | 'Super Admin' 
  | 'College Admin' 
  | 'Principal' 
  | 'IQAC Coordinator' 
  | 'HOD' 
  | 'Faculty' 
  | 'Student';

interface AppState {
  theme: 'light' | 'dark';
  sidebarOpen: boolean;
  currentRole: UserRole;
  selectedDepartment: string;
  completedChecklistItems: Record<string, boolean>;
  completedWeeklyTasks: Record<string, boolean>;
  notifications: Notification[];
  isAuthenticated: boolean;
  user: { name: string; email: string; role: UserRole; department?: string } | null;
  toggleTheme: () => void;
  setTheme: (theme: 'light' | 'dark') => void;
  toggleSidebar: () => void;
  setSidebarOpen: (open: boolean) => void;
  setRole: (role: UserRole) => void;
  setDepartment: (dept: string) => void;
  toggleChecklistItem: (dept: string, criterionId: number, itemId: string) => void;
  toggleWeeklyTask: (dept: string, taskId: string) => void;
  addNotification: (notification: Omit<Notification, 'id' | 'timestamp' | 'read'>) => void;
  markAsRead: (id: string) => void;
  clearAllNotifications: () => void;
  login: (email: string, role: UserRole) => void;
  logout: () => void;
}

export const useAppStore = create<AppState>((set) => ({
  theme: 'dark', // Defaulting to sleek dark mode
  sidebarOpen: true,
  currentRole: 'IQAC Coordinator', // Defaulting to the orchestrator of NAAC
  selectedDepartment: 'All Departments',
  completedChecklistItems: {},
  completedWeeklyTasks: {},
  notifications: [],
  isAuthenticated: false,
  user: null,
  login: (email, role) => set(() => {
    let dept = 'All Departments';
    if (role === 'HOD' || role === 'Faculty' || role === 'Student') {
      if (email.includes('.cse@') || email.includes('aditya@') || email.includes('student.union@')) {
        dept = 'Computer Science';
      } else if (email.includes('.ece@')) {
        dept = 'Electronics';
      } else if (email.includes('.aiml@')) {
        dept = 'AIML';
      } else if (email.includes('.aids@')) {
        dept = 'AIDS';
      } else {
        dept = 'Computer Science'; // default fallback for demonstration
      }
    }
    return {
      isAuthenticated: true,
      currentRole: role,
      selectedDepartment: dept,
      user: {
        name: email.split('@')[0].split('.').map(s => s.charAt(0).toUpperCase() + s.slice(1)).join(' '),
        email,
        role,
        department: dept
      }
    };
  }),
  logout: () => set(() => ({
    isAuthenticated: false,
    user: null,
    selectedDepartment: 'All Departments'
  })),
  toggleTheme: () => set((state) => {
    const nextTheme = state.theme === 'light' ? 'dark' : 'light';
    if (typeof window !== 'undefined') {
      const root = window.document.documentElement;
      root.classList.remove(state.theme);
      root.classList.add(nextTheme);
    }
    return { theme: nextTheme };
  }),
  setTheme: (theme) => set(() => {
    if (typeof window !== 'undefined') {
      const root = window.document.documentElement;
      root.classList.remove('light', 'dark');
      root.classList.add(theme);
    }
    return { theme };
  }),
  toggleSidebar: () => set((state) => ({ sidebarOpen: !state.sidebarOpen })),
  setSidebarOpen: (open) => set(() => ({ sidebarOpen: open })),
  setDepartment: (dept) => set(() => ({ selectedDepartment: dept })),
  toggleChecklistItem: (dept, criterionId, itemId) => set((state) => {
    const key = `${dept}_${criterionId}_${itemId}`;
    const next = { ...state.completedChecklistItems };
    if (next[key]) {
      delete next[key];
    } else {
      next[key] = true;
    }
    return { completedChecklistItems: next };
  }),
  toggleWeeklyTask: (dept, taskId) => set((state) => {
    const key = `${dept}_${taskId}`;
    const next = { ...state.completedWeeklyTasks };
    if (next[key]) {
      delete next[key];
    } else {
      next[key] = true;
    }
    return { completedWeeklyTasks: next };
  }),
  setRole: (role) => set((state) => {
    let dept = state.selectedDepartment;
    if (role === 'IQAC Coordinator' || role === 'Principal' || role === 'College Admin') {
      dept = 'All Departments';
    } else if (role === 'HOD' || role === 'Faculty') {
      dept = state.user?.department && state.user.department !== 'All Departments' 
        ? state.user.department 
        : 'Computer Science';
    } else if (role === 'Student') {
      dept = 'Computer Science';
    }
    return { currentRole: role, selectedDepartment: dept };
  }),
  addNotification: (notification) => set((state) => {
    const newNotif: Notification = {
      ...notification,
      id: Math.random().toString(36).substr(2, 9),
      timestamp: 'Just now',
      read: false,
    };
    return { notifications: [newNotif, ...state.notifications] };
  }),
  markAsRead: (id) => set((state) => ({
    notifications: state.notifications.map((n) => n.id === id ? { ...n, read: true } : n)
  })),
  clearAllNotifications: () => set(() => ({ notifications: [] })),
}));
