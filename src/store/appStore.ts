import { create } from 'zustand';
import { supabase } from './supabaseClient';

// ==================== TYPE DEFINITIONS ====================

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

export interface FacultyMember {
  id: string;
  name: string;
  dept: string;
  designation: string;
  qualification: string;
  publications: number;
  grants: string;
  status: 'Active' | 'Sabbatical' | 'On Leave';
}

export interface DocFile {
  id: string;
  name: string;
  department: string;
  criteria: string;
  uploader: string;
  date: string;
  size: string;
  status: 'Awaiting OCR' | 'Tagged' | 'Failed Audit' | 'Verified';
  ocrContent: string;
  suggestedTags: { tag: string; confidence: number }[];
}

export interface StudentRecord {
  id: string;
  name: string;
  dept: string;
  year: string;
  enrollmentType: 'Within State' | 'Other States' | 'International';
  scholarship: boolean;
  placed: boolean;
  salaryLPA: number;
  higherEducation: boolean;
}

export interface IQACMeeting {
  id: string;
  title: string;
  date: string;
  agenda: string;
  attendance: string;
  minutesLink: string;
  status: 'Scheduled' | 'Completed';
}

export interface Benchmark {
  id: string;
  indicator: string;
  target: string;
  current: string;
  status: 'Met' | 'Shortfall' | 'Exceeded';
}

export interface FeedbackDrive {
  id: string;
  name: string;
  audience: string;
  deadline: string;
  responses: number;
  target: number;
}

export interface SSRChapter {
  id: string;
  name: string;
  draftText: string;
  suggestions: string[];
}

export interface ChecklistItem {
  id: string;
  text: string;
}

// ==================== STATE INTERFACE ====================

interface AppState {
  // Auth & UI
  theme: 'light' | 'dark';
  sidebarOpen: boolean;
  currentRole: UserRole;
  selectedDepartment: string;
  isAuthenticated: boolean;
  user: { name: string; email: string; role: UserRole; department?: string } | null;

  // Criteria
  completedChecklistItems: Record<string, boolean>;
  completedWeeklyTasks: Record<string, boolean>;
  criteriaLeads: Record<number, string>;
  customChecklistItems: Record<number, ChecklistItem[]>;

  // Notifications
  notifications: Notification[];

  // Global Data
  faculty: FacultyMember[];
  documents: DocFile[];
  students: StudentRecord[];
  meetings: IQACMeeting[];
  benchmarks: Benchmark[];
  feedbackDrives: FeedbackDrive[];
  ssrChapters: SSRChapter[];

  // Auth Actions
  login: (email: string, role: UserRole) => void;
  logout: () => void;

  // UI Actions
  toggleTheme: () => void;
  setTheme: (theme: 'light' | 'dark') => void;
  toggleSidebar: () => void;
  setSidebarOpen: (open: boolean) => void;
  setRole: (role: UserRole) => void;
  setDepartment: (dept: string) => void;

  // Criteria Actions
  toggleChecklistItem: (dept: string, criterionId: number, itemId: string) => void;
  toggleWeeklyTask: (dept: string, taskId: string) => void;
  setCriteriaLead: (criterionId: number, lead: string) => void;
  addCustomChecklistItem: (criterionId: number, item: ChecklistItem) => void;

  // Notification Actions
  addNotification: (notification: Omit<Notification, 'id' | 'timestamp' | 'read'>) => void;
  markAsRead: (id: string) => void;
  clearAllNotifications: () => void;

  // Faculty Actions
  addFaculty: (member: FacultyMember) => void;
  removeFaculty: (id: string) => void;

  // Document Actions
  addDocument: (doc: DocFile) => void;
  deleteDocument: (id: string) => void;
  verifyDocument: (id: string) => void;
  rerunDocAnalysis: (id: string) => void;

  // Student Actions
  addStudent: (student: StudentRecord) => void;
  removeStudent: (id: string) => void;

  // Meeting Actions
  addMeeting: (meeting: IQACMeeting) => void;
  completeMeeting: (id: string, attendance: string) => void;

  // Benchmark Actions
  updateBenchmark: (id: string, current: string) => void;

  // Feedback Actions
  addFeedbackDrive: (drive: FeedbackDrive) => void;
  incrementFeedbackResponses: (id: string, amount: number) => void;

  // SSR Actions
  updateSSRChapter: (id: string, draftText: string) => void;
  addSSRChapter: (chapter: SSRChapter) => void;

  // Supabase Sync Action
  syncWithSupabase: () => Promise<void>;
}

// ==================== INITIAL DATA ====================

const initialBenchmarks: Benchmark[] = [
  { id: 'b-1', indicator: 'Student-Teacher Ratio', target: '15:1', current: 'Not Audited', status: 'Shortfall' },
  { id: 'b-2', indicator: 'Ph.D. Qualified Faculty', target: '70%', current: 'Not Audited', status: 'Shortfall' },
  { id: 'b-3', indicator: 'UGC-CARE Publications / Yr', target: '60 papers', current: 'Not Audited', status: 'Shortfall' },
  { id: 'b-4', indicator: 'Smart Classrooms Percentage', target: '80%', current: 'Not Audited', status: 'Shortfall' },
  { id: 'b-5', indicator: 'Placement percentage', target: '90%', current: 'Not Audited', status: 'Shortfall' },
];

const initialSSRChapters: SSRChapter[] = [
  {
    id: 'crit-1.1',
    name: 'Criterion 1.1 - Curricular Planning & Implementation',
    draftText: '',
    suggestions: [
      "Include a direct reference to the 'Syllabus_BOS_Minutes.pdf' evidence uploaded under Criterion 1.1.2.",
      "Add quantitative metrics specifying the percentage of classrooms equipped with ICT infrastructure (e.g., 82%).",
      "Mention PO/CO mapping percentages for the Computer Science B.Tech program."
    ]
  },
  {
    id: 'crit-3.2',
    name: 'Criterion 3.2 - Research Publications & Awards',
    draftText: '',
    suggestions: [
      "Add stats stating the journal publications compiled in CSE department for the year 2025.",
      "Detail seed funding values allotted for faculty projects.",
      "Integrate grant approval letter links for external funding sources."
    ]
  },
  {
    id: 'crit-5.2',
    name: 'Criterion 5.2 - Student Progression & Placements',
    draftText: '',
    suggestions: [
      "State the projected placement rate achieved during the campus recruitment drives.",
      "Add the average salary LPA progression data.",
      "Map placement offer letter PDF locations in the Document Management library."
    ]
  }
];

// ==================== STORE ====================

export const useAppStore = create<AppState>((set) => ({
  // Auth & UI defaults
  theme: 'dark',
  sidebarOpen: true,
  currentRole: 'IQAC Coordinator',
  selectedDepartment: 'All Departments',
  isAuthenticated: false,
  user: null,

  // Criteria defaults
  completedChecklistItems: {},
  completedWeeklyTasks: {},
  criteriaLeads: { 1: 'Not Assigned', 2: 'Not Assigned', 3: 'Not Assigned', 4: 'Not Assigned', 5: 'Not Assigned', 6: 'Not Assigned', 7: 'Not Assigned' },
  customChecklistItems: {},

  // Notifications
  notifications: [],

  // Global Data defaults
  faculty: [],
  documents: [],
  students: [],
  meetings: [],
  benchmarks: initialBenchmarks,
  feedbackDrives: [],
  ssrChapters: initialSSRChapters,

  // ==================== AUTH ACTIONS ====================

  login: (email, role) => {
    set(() => {
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
          dept = 'Computer Science';
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
    });
    useAppStore.getState().syncWithSupabase();
  },

  logout: () => set(() => ({
    isAuthenticated: false,
    user: null,
    selectedDepartment: 'All Departments'
  })),

  // ==================== UI ACTIONS ====================

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

  // ==================== CRITERIA ACTIONS ====================

  toggleChecklistItem: (dept, criterionId, itemId) => set((state) => {
    const key = `${dept}_${criterionId}_${itemId}`;
    const next = { ...state.completedChecklistItems };
    if (next[key]) { delete next[key]; } else { next[key] = true; }
    return { completedChecklistItems: next };
  }),

  toggleWeeklyTask: (dept, taskId) => set((state) => {
    const key = `${dept}_${taskId}`;
    const next = { ...state.completedWeeklyTasks };
    if (next[key]) { delete next[key]; } else { next[key] = true; }
    return { completedWeeklyTasks: next };
  }),

  setCriteriaLead: (criterionId, lead) => set((state) => ({
    criteriaLeads: { ...state.criteriaLeads, [criterionId]: lead }
  })),

  addCustomChecklistItem: (criterionId, item) => set((state) => ({
    customChecklistItems: {
      ...state.customChecklistItems,
      [criterionId]: [...(state.customChecklistItems[criterionId] || []), item]
    }
  })),

  // ==================== NOTIFICATION ACTIONS ====================

  addNotification: (notification) => set((state) => {
    const now = new Date();
    const newNotif: Notification = {
      ...notification,
      id: Math.random().toString(36).substr(2, 9),
      timestamp: now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      read: false,
    };
    return { notifications: [newNotif, ...state.notifications] };
  }),

  markAsRead: (id) => set((state) => ({
    notifications: state.notifications.map((n) => n.id === id ? { ...n, read: true } : n)
  })),

  clearAllNotifications: () => set(() => ({ notifications: [] })),

  // ==================== FACULTY ACTIONS ====================

  addFaculty: async (member) => {
    set((state) => ({ faculty: [...state.faculty, member] }));
    if (supabase) {
      await supabase.from('faculty').insert([member]);
    }
  },

  removeFaculty: async (id) => {
    set((state) => ({ faculty: state.faculty.filter(f => f.id !== id) }));
    if (supabase) {
      await supabase.from('faculty').delete().eq('id', id);
    }
  },

  // ==================== DOCUMENT ACTIONS ====================

  addDocument: async (doc) => {
    set((state) => ({ documents: [doc, ...state.documents] }));
    if (supabase) {
      await supabase.from('documents').insert([doc]);
    }
  },

  deleteDocument: async (id) => {
    set((state) => ({ documents: state.documents.filter(d => d.id !== id) }));
    if (supabase) {
      await supabase.from('documents').delete().eq('id', id);
    }
  },

  verifyDocument: async (id) => {
    set((state) => ({
      documents: state.documents.map(d => d.id === id ? { ...d, status: 'Verified' as const } : d)
    }));
    if (supabase) {
      await supabase.from('documents').update({ status: 'Verified' }).eq('id', id);
    }
  },

  rerunDocAnalysis: async (id) => {
    let updatedDoc: any = null;
    set((state) => {
      const nextDocs = state.documents.map(d => {
        if (d.id !== id) return d;
        updatedDoc = {
          ...d,
          status: 'Tagged' as const,
          suggestedTags: d.suggestedTags.map(t => ({
            ...t,
            confidence: Math.min(99, Math.max(60, t.confidence + Math.floor(Math.random() * 20 - 10)))
          }))
        };
        return updatedDoc;
      });
      return { documents: nextDocs };
    });
    if (supabase && updatedDoc) {
      await supabase.from('documents').update({
        status: 'Tagged',
        suggestedTags: updatedDoc.suggestedTags
      }).eq('id', id);
    }
  },

  // ==================== STUDENT ACTIONS ====================

  addStudent: async (student) => {
    set((state) => ({ students: [...state.students, student] }));
    if (supabase) {
      await supabase.from('students').insert([student]);
    }
  },

  removeStudent: async (id) => {
    set((state) => ({ students: state.students.filter(s => s.id !== id) }));
    if (supabase) {
      await supabase.from('students').delete().eq('id', id);
    }
  },

  // ==================== MEETING ACTIONS ====================

  addMeeting: async (meeting) => {
    set((state) => ({ meetings: [meeting, ...state.meetings] }));
    if (supabase) {
      await supabase.from('meetings').insert([meeting]);
    }
  },

  completeMeeting: async (id, attendance) => {
    set((state) => ({
      meetings: state.meetings.map(m =>
        m.id === id ? { ...m, status: 'Completed' as const, attendance } : m
      )
    }));
    if (supabase) {
      await supabase.from('meetings').update({ status: 'Completed', attendance }).eq('id', id);
    }
  },

  // ==================== BENCHMARK ACTIONS ====================

  updateBenchmark: async (id, current) => {
    let updatedBench: any = null;
    set((state) => {
      const nextBench = state.benchmarks.map(b => {
        if (b.id !== id) return b;
        let status: 'Met' | 'Shortfall' | 'Exceeded' = 'Shortfall';
        const targetNum = parseFloat(b.target.replace(/[^0-9.]/g, ''));
        const currentNum = parseFloat(current.replace(/[^0-9.]/g, ''));
        if (!isNaN(targetNum) && !isNaN(currentNum)) {
          if (currentNum >= targetNum * 1.1) status = 'Exceeded';
          else if (currentNum >= targetNum * 0.95) status = 'Met';
          else status = 'Shortfall';
        } else if (current !== 'Not Audited') {
          status = 'Met';
        }
        updatedBench = { ...b, current, status };
        return updatedBench;
      });
      return { benchmarks: nextBench };
    });
    if (supabase && updatedBench) {
      await supabase.from('benchmarks').update({ current, status: updatedBench.status }).eq('id', id);
    }
  },

  // ==================== FEEDBACK ACTIONS ====================

  addFeedbackDrive: async (drive) => {
    set((state) => ({ feedbackDrives: [...state.feedbackDrives, drive] }));
    if (supabase) {
      await supabase.from('feedback_drives').insert([drive]);
    }
  },

  incrementFeedbackResponses: async (id, amount) => {
    let updatedDrive: any = null;
    set((state) => {
      const nextDrives = state.feedbackDrives.map(d => {
        if (d.id !== id) return d;
        updatedDrive = { ...d, responses: d.responses + amount };
        return updatedDrive;
      });
      return { feedbackDrives: nextDrives };
    });
    if (supabase && updatedDrive) {
      await supabase.from('feedback_drives').update({ responses: updatedDrive.responses }).eq('id', id);
    }
  },

  // ==================== SSR ACTIONS ====================

  updateSSRChapter: async (id, draftText) => {
    set((state) => ({
      ssrChapters: state.ssrChapters.map(c =>
        c.id === id ? { ...c, draftText } : c
      )
    }));
    if (supabase) {
      await supabase.from('ssr_chapters').update({ draftText }).eq('id', id);
    }
  },

  addSSRChapter: async (chapter) => {
    set((state) => ({ ssrChapters: [...state.ssrChapters, chapter] }));
    if (supabase) {
      await supabase.from('ssr_chapters').insert([chapter]);
    }
  },

  // ==================== SUPABASE SYNC ACTION ====================

  syncWithSupabase: async () => {
    if (!supabase) return;
    try {
      const [
        { data: faculty },
        { data: students },
        { data: documents },
        { data: meetings },
        { data: benchmarks },
        { data: feedbackDrives },
        { data: ssrChapters }
      ] = await Promise.all([
        supabase.from('faculty').select('*'),
        supabase.from('students').select('*'),
        supabase.from('documents').select('*'),
        supabase.from('meetings').select('*'),
        supabase.from('benchmarks').select('*'),
        supabase.from('feedback_drives').select('*'),
        supabase.from('ssr_chapters').select('*')
      ]);

      set({
        ...(faculty && faculty.length > 0 && { faculty }),
        ...(students && students.length > 0 && { students }),
        ...(documents && documents.length > 0 && { documents }),
        ...(meetings && meetings.length > 0 && { meetings }),
        ...(benchmarks && benchmarks.length > 0 && { benchmarks }),
        ...(feedbackDrives && feedbackDrives.length > 0 && { feedbackDrives }),
        ...(ssrChapters && ssrChapters.length > 0 && { ssrChapters })
      });
    } catch (err) {
      console.error('Supabase fetch error:', err);
    }
  }
}));
