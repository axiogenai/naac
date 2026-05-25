'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { 
  ResponsiveContainer, 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  Tooltip, 
  CartesianGrid,
  AreaChart,
  Area,
  LineChart,
  Line
} from 'recharts';
import { 
  CheckCircle2, 
  AlertTriangle, 
  Clock, 
  TrendingUp, 
  BookOpen, 
  FileCheck, 
  Users, 
  Sparkles,
  ArrowUpRight,
  ShieldCheck,
  Zap
} from 'lucide-react';
import { useAppStore } from '@/store/appStore';

// Mock Data
const timelineData = [
  { month: 'Jan', progress: 0 },
  { month: 'Feb', progress: 0 },
  { month: 'Mar', progress: 0 },
  { month: 'Apr', progress: 0 },
  { month: 'May', progress: 0 },
];

const criteriaBaseList = [
  { id: 1, name: 'Curricular Aspects', color: 'bg-muted-foreground/20' },
  { id: 2, name: 'Teaching-Learning & Eval.', color: 'bg-muted-foreground/20' },
  { id: 3, name: 'Research, Innovation & Ext.', color: 'bg-muted-foreground/20' },
  { id: 4, name: 'Infra & Learning Resources', color: 'bg-muted-foreground/20' },
  { id: 5, name: 'Student Support & Prog.', color: 'bg-muted-foreground/20' },
  { id: 6, name: 'Governance & Leadership', color: 'bg-muted-foreground/20' },
  { id: 7, name: 'Institutional Values & Best', color: 'bg-muted-foreground/20' },
];

const DEPARTMENTS = ['Computer Science', 'Electronics', 'Mechanical', 'AIML', 'AIDS'];

export default function Dashboard() {
  const { currentRole, selectedDepartment, completedChecklistItems } = useAppStore();

  // Helper to calculate progress for a given criterion and department
  const getCriterionProgress = (criterionId: number, dept: string) => {
    const prefix = `${dept}_${criterionId}_`;
    const completedCount = Object.keys(completedChecklistItems).filter(key => 
      key.startsWith(prefix) && completedChecklistItems[key]
    ).length;
    return Math.round((completedCount / 4) * 100);
  };

  // Compute criteria summary dynamically based on selection
  const criteriaSummary = criteriaBaseList.map(item => {
    let score = 0;
    if (selectedDepartment === 'All Departments') {
      const totalScore = DEPARTMENTS.reduce((sum, d) => sum + getCriterionProgress(item.id, d), 0);
      score = Math.round(totalScore / DEPARTMENTS.length);
    } else {
      score = getCriterionProgress(item.id, selectedDepartment);
    }

    let status = 'Not Started';
    let color = 'bg-muted-foreground/20';
    if (score === 100) {
      status = 'Verified';
      color = 'bg-emerald-500/20';
    } else if (score > 0) {
      status = 'In Review';
      color = 'bg-amber-500/20';
    }

    return {
      ...item,
      score,
      status,
      color
    };
  });

  // Score Gauge Calculation
  const totalWeightage = criteriaSummary.length * 100;
  const currentTotal = criteriaSummary.reduce((acc, curr) => acc + curr.score, 0);
  const averageReadiness = Math.round((currentTotal / totalWeightage) * 100);

  // Quick stats calculations
  const totalVerified = criteriaSummary.filter(c => c.status === 'Verified').length;
  const pendingReview = criteriaSummary.filter(c => c.status === 'In Review').length;

  const isAllDepts = selectedDepartment === 'All Departments';
  const departmentComplianceData = isAllDepts
    ? DEPARTMENTS.map(d => {
        const totalProgress = [1,2,3,4,5,6,7].reduce((sum, cId) => sum + getCriterionProgress(cId, d), 0);
        const compliance = Math.round(totalProgress / 7);
        const shortName = d === 'Computer Science' ? 'Computer Sci.' : d;
        return {
          name: shortName,
          compliance,
          target: d === 'Computer Science' || d === 'AIML' ? 95 : 90
        };
      })
    : [1,2,3,4,5,6,7].map(cId => {
        const compliance = getCriterionProgress(cId, selectedDepartment);
        const criteriaName = criteriaBaseList.find(c => c.id === cId)?.name.slice(0, 10) || `Crit ${cId}`;
        return {
          name: criteriaName,
          compliance,
          target: cId === 2 ? 95 : 90
        };
      });

  return (
    <div className="space-y-6">
      {/* HEADER SECTION */}
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Welcome Back, Executive Portal</h1>
          <p className="text-muted-foreground text-sm">
            Monitoring compliance for <span className="font-semibold text-foreground">AMG</span> &bull; <span className="text-primary font-semibold">{selectedDepartment}</span>
          </p>
        </div>
        <div className="flex items-center gap-2 text-xs bg-primary/10 border border-primary/20 text-primary dark:text-blue-400 font-semibold px-3 py-1.5 rounded-full">
          <Sparkles size={14} className="animate-pulse" />
          <span>Projected CGPA: 0.00 (Pending Audit)</span>
        </div>
      </div>

      {/* QUICK STATUS METRICS */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <motion.div whileHover={{ y: -4 }} className="glass-card p-5 rounded-2xl flex items-center justify-between">
          <div className="space-y-2">
            <span className="text-xs font-semibold text-muted-foreground">Readiness Level</span>
            <div className="flex items-baseline gap-2">
              <span className="text-3xl font-bold">{averageReadiness}%</span>
              <span className="text-xs font-semibold text-muted-foreground flex items-center">
                Not Started
              </span>
            </div>
            <p className="text-[10px] text-muted-foreground">Updated just now</p>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-blue-500/10 dark:bg-blue-500/20 flex items-center justify-center text-blue-500">
            <TrendingUp size={22} />
          </div>
        </motion.div>

        <motion.div whileHover={{ y: -4 }} className="glass-card p-5 rounded-2xl flex items-center justify-between">
          <div className="space-y-2">
            <span className="text-xs font-semibold text-muted-foreground">Criteria Verified</span>
            <div className="flex items-baseline gap-2">
              <span className="text-3xl font-bold">{totalVerified} / 7</span>
            </div>
            <p className="text-[10px] text-muted-foreground">Remaining: {7 - totalVerified} Criteria</p>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 dark:bg-emerald-500/20 flex items-center justify-center text-emerald-500">
            <CheckCircle2 size={22} />
          </div>
        </motion.div>

        <motion.div whileHover={{ y: -4 }} className="glass-card p-5 rounded-2xl flex items-center justify-between">
          <div className="space-y-2">
            <span className="text-xs font-semibold text-muted-foreground">Pending Review</span>
            <div className="flex items-baseline gap-2">
              <span className="text-3xl font-bold">{pendingReview}</span>
            </div>
            <p className="text-[10px] text-muted-foreground">Awaiting IQAC/Principal Sign-off</p>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-amber-500/10 dark:bg-amber-500/20 flex items-center justify-center text-amber-500">
            <Clock size={22} />
          </div>
        </motion.div>

        <motion.div whileHover={{ y: -4 }} className="glass-card p-5 rounded-2xl flex items-center justify-between">
          <div className="space-y-2">
            <span className="text-xs font-semibold text-muted-foreground">Evidence Uploads</span>
            <div className="flex items-baseline gap-2">
              <span className="text-3xl font-bold">0</span>
            </div>
            <p className="text-[10px] text-muted-foreground">Size: 0 Bytes / 10 GB limit</p>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-purple-500/10 dark:bg-purple-500/20 flex items-center justify-center text-purple-500">
            <BookOpen size={22} />
          </div>
        </motion.div>
      </div>

      {/* CORE GRID: GAUGE & COMPLIANCE CHART */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* READINESS GAUGE */}
        <div className="glass-card p-6 rounded-2xl flex flex-col justify-between items-center text-center">
          <div className="w-full flex items-center justify-between border-b border-border/40 pb-4 mb-4">
            <h2 className="font-semibold text-sm flex items-center gap-2">
              <ShieldCheck size={16} className="text-primary" />
              NAAC Readiness Gauge
            </h2>
            <span className="text-[10px] font-semibold bg-muted px-2 py-0.5 rounded">SSR Draft v1.0</span>
          </div>

          <div className="relative w-44 h-44 flex items-center justify-center my-4">
            {/* SVG GAUGE CIRCLE */}
            <svg className="w-full h-full transform -rotate-90">
              <circle
                cx="88"
                cy="88"
                r="74"
                className="stroke-muted fill-transparent"
                strokeWidth="10"
              />
              <motion.circle
                cx="88"
                cy="88"
                r="74"
                className="stroke-primary fill-transparent"
                strokeWidth="12"
                strokeDasharray={464}
                initial={{ strokeDashoffset: 464 }}
                animate={{ strokeDashoffset: 464 - (464 * averageReadiness) / 100 }}
                transition={{ duration: 1.5, ease: 'easeOut' }}
                strokeLinecap="round"
              />
            </svg>
            <div className="absolute flex flex-col items-center justify-center">
              <span className="text-4xl font-extrabold tracking-tight">{averageReadiness}%</span>
              <span className="text-[10px] text-muted-foreground uppercase font-bold tracking-wider mt-1">Readiness</span>
            </div>
          </div>

          <div className="w-full pt-4 border-t border-border/40 text-left space-y-2 mt-4">
            <div className="flex justify-between text-xs">
              <span className="text-muted-foreground">Current Completion Rate:</span>
              <span className="font-bold">{averageReadiness}%</span>
            </div>
            <div className="flex justify-between text-xs">
              <span className="text-muted-foreground">Projected NAAC Grade:</span>
              <span className="font-bold text-muted-foreground">Not Audited (CGPA 0.00)</span>
            </div>
          </div>
        </div>

        {/* DEPARTMENT COMPLIANCE BAR CHART */}
        <div className="glass-card p-6 rounded-2xl lg:col-span-2 flex flex-col justify-between">
          <div className="flex items-center justify-between border-b border-border/40 pb-4 mb-4">
            <h2 className="font-semibold text-sm flex items-center gap-2">
              <CheckCircle2 size={16} className="text-primary" />
              {isAllDepts ? 'Department-wise Compliance vs Targets' : `${selectedDepartment} Criteria Performance`}
            </h2>
            <span className="text-xs text-muted-foreground">Data verified up to May 2026</span>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={departmentComplianceData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(148, 163, 184, 0.1)" />
                <XAxis dataKey="name" fontSize={11} tickLine={false} axisLine={false} />
                <YAxis domain={[0, 100]} fontSize={11} tickLine={false} axisLine={false} />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: 'hsl(var(--popover))', 
                    borderColor: 'hsl(var(--border))', 
                    borderRadius: '8px',
                    fontSize: '12px' 
                  }} 
                />
                <Bar dataKey="compliance" name="Current %" fill="#2563eb" radius={[4, 4, 0, 0]} barSize={24} />
                <Bar dataKey="target" name="Target %" fill="rgba(37, 99, 235, 0.2)" radius={[4, 4, 0, 0]} barSize={24} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* TIMELINE PROGRESS & HEATMAP */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* CRITERIA PROGRESS LIST/HEATMAP */}
        <div className="glass-card p-6 rounded-2xl lg:col-span-2">
          <div className="flex items-center justify-between border-b border-border/40 pb-4 mb-4">
            <h2 className="font-semibold text-sm">NAAC 7-Criteria Compliance Status</h2>
            <span className="text-xs font-semibold text-primary">Overview</span>
          </div>

          <div className="space-y-4">
            {criteriaSummary.map((crit) => (
              <div key={crit.id} className="space-y-1.5">
                <div className="flex items-center justify-between text-xs font-medium">
                  <div className="flex items-center gap-2">
                    <span className={`w-2.5 h-2.5 rounded-full ${crit.color}`} />
                    <span className="text-muted-foreground font-semibold">Criterion {crit.id}:</span>
                    <span>{crit.name}</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="font-bold">{crit.score}%</span>
                    <span className={`px-2 py-0.5 rounded-full text-[9px] font-bold ${
                      crit.status === 'Verified' ? 'bg-emerald-500/10 text-emerald-500' :
                      crit.status === 'In Review' ? 'bg-amber-500/10 text-amber-500' : 'bg-indigo-500/10 text-indigo-500'
                    }`}>
                      {crit.status}
                    </span>
                  </div>
                </div>
                <div className="w-full h-2 bg-muted rounded-full overflow-hidden">
                  <motion.div 
                    initial={{ width: 0 }}
                    animate={{ width: `${crit.score}%` }}
                    transition={{ duration: 1, delay: crit.id * 0.1 }}
                    className={`h-full rounded-full ${
                      crit.status === 'Verified' ? 'bg-emerald-500' :
                      crit.status === 'In Review' ? 'bg-amber-500' : 'bg-indigo-600'
                    }`}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* AI INSIGHTS & ACTIONS */}
        <div className="glass-card p-6 rounded-2xl flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between border-b border-border/40 pb-4 mb-4">
              <h2 className="font-semibold text-sm flex items-center gap-2">
                <Sparkles size={16} className="text-purple-500" />
                AI Gap Analysis & Insights
              </h2>
              <span className="text-[9px] font-bold uppercase bg-purple-500/10 text-purple-500 px-1.5 py-0.5 rounded">Active</span>
            </div>

            <div className="space-y-4">
              <div className="p-3 bg-amber-500/5 border border-amber-500/10 rounded-xl space-y-1">
                <div className="flex items-center gap-1.5 text-xs font-semibold text-amber-600 dark:text-amber-400">
                  <AlertTriangle size={14} />
                  <span>Criterion 3 (Research) Gap</span>
                </div>
                <p className="text-[11px] text-muted-foreground leading-normal">
                  Faculty publication count in CSE is 24% lower than projected target. Upload recent PDFs to bridge the score gap.
                </p>
              </div>

              <div className="p-3 bg-blue-500/5 border border-blue-500/10 rounded-xl space-y-1">
                <div className="flex items-center gap-1.5 text-xs font-semibold text-blue-600 dark:text-blue-400">
                  <Zap size={14} />
                  <span>Student Feedback Analysis</span>
                </div>
                <p className="text-[11px] text-muted-foreground leading-normal">
                  Placement satisfaction is projecting 92% (highly positive). Mention this as a core Institutional Best Practice (Criterion 7).
                </p>
              </div>
            </div>
          </div>

          <button className="w-full text-xs font-semibold mt-4 py-2.5 rounded-xl bg-primary text-primary-foreground hover:opacity-90 transition-opacity flex items-center justify-center gap-1.5">
            <span>Run Complete AI Audit</span>
            <ArrowUpRight size={14} />
          </button>
        </div>
      </div>

      {/* ROLE-SPECIFIC WORKSPACE ACCORDIONS */}
      <div className="p-6 glass-card rounded-2xl border-l-4 border-l-indigo-600">
        <h3 className="text-sm font-bold flex items-center gap-2 mb-3">
          <ShieldCheck size={16} className="text-indigo-600" />
          Role Action Center: Active Workspace ({currentRole})
        </h3>
        
        {currentRole === 'IQAC Coordinator' && (
          <div className="space-y-3">
            <p className="text-xs text-muted-foreground">As the <strong>IQAC Coordinator</strong>, you are responsible for monitoring and compiling the final Self-Study Report (SSR). Keep an eye on outstanding tasks:</p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3 pt-2">
              <div className="p-3 bg-muted/40 rounded-xl border border-border/40 text-xs flex justify-between items-center">
                <div>
                  <div className="font-semibold">Review HOD Submissions</div>
                  <div className="text-[10px] text-muted-foreground">Criterion 1 & 2 verified; Criterion 3 pending.</div>
                </div>
                <button className="text-[10px] text-primary font-bold hover:underline">Manage</button>
              </div>
              <div className="p-3 bg-muted/40 rounded-xl border border-border/40 text-xs flex justify-between items-center">
                <div>
                  <div className="font-semibold">Compile SSR Draft v1.1</div>
                  <div className="text-[10px] text-muted-foreground">Auto-synthesize remaining criteria sections.</div>
                </div>
                <button className="text-[10px] text-primary font-bold hover:underline">Compile</button>
              </div>
              <div className="p-3 bg-muted/40 rounded-xl border border-border/40 text-xs flex justify-between items-center">
                <div>
                  <div className="font-semibold">Document Compliance Check</div>
                  <div className="text-[10px] text-muted-foreground">Scan 48 PDF structures for formatting issues.</div>
                </div>
                <button className="text-[10px] text-primary font-bold hover:underline">Scan</button>
              </div>
            </div>
          </div>
        )}

        {currentRole === 'Principal' && (
          <div className="space-y-3">
            <p className="text-xs text-muted-foreground">As the <strong>Principal</strong>, you have high-level veto, strategic approval, and final submission sign-off authority. Active tasks needing your attention:</p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-2">
              <div className="p-3 bg-muted/40 rounded-xl border border-border/40 text-xs flex justify-between items-center">
                <div>
                  <div className="font-semibold">Approve Final Drafts: Criteria 1, 2, 4</div>
                  <div className="text-[10px] text-muted-foreground">IQAC completed checks. Ready for institutional seal.</div>
                </div>
                <button className="px-2 py-1 bg-emerald-500 text-white rounded text-[10px] font-bold hover:opacity-90">Sign-off</button>
              </div>
              <div className="p-3 bg-muted/40 rounded-xl border border-border/40 text-xs flex justify-between items-center">
                <div>
                  <div className="font-semibold">Strategic Budget Allotment Audit</div>
                  <div className="text-[10px] text-muted-foreground">Verify Criterion 4 financial statements for audit compatibility.</div>
                </div>
                <button className="text-[10px] text-primary font-bold hover:underline">Verify</button>
              </div>
            </div>
          </div>
        )}

        {currentRole === 'HOD' && (
          <div className="space-y-3">
            <p className="text-xs text-muted-foreground">As the <strong>Head of Department (HOD)</strong>, you manage your department's compliance and ensure your faculty submits research and placement data timely.</p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-2">
              <div className="p-3 bg-muted/40 rounded-xl border border-border/40 text-xs flex justify-between items-center">
                <div>
                  <div className="font-semibold">Faculty Workload Verification</div>
                  <div className="text-[10px] text-muted-foreground">3 faculty members have unverified teaching loads.</div>
                </div>
                <button className="text-[10px] text-primary font-bold hover:underline">Verify</button>
              </div>
              <div className="p-3 bg-muted/40 rounded-xl border border-border/40 text-xs flex justify-between items-center">
                <div>
                  <div className="font-semibold">Submit Department SSR Portion</div>
                  <div className="text-[10px] text-muted-foreground">CSE Criterion 5 details due in 4 days.</div>
                </div>
                <button className="text-[10px] text-primary font-bold hover:underline">Fill Draft</button>
              </div>
            </div>
          </div>
        )}

        {currentRole === 'Faculty' && (
          <div className="space-y-3">
            <p className="text-xs text-muted-foreground">As a <strong>Faculty Member</strong>, you provide research data, teaching methodologies, and certifications directly supporting Criteria 2 and 3.</p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3 pt-2">
              <div className="p-3 bg-muted/40 rounded-xl border border-border/40 text-xs flex justify-between items-center">
                <div>
                  <div className="font-semibold">Upload Research PDFs</div>
                  <div className="text-[10px] text-muted-foreground">2 recently published papers lack proof uploads.</div>
                </div>
                <button className="text-[10px] text-primary font-bold hover:underline">Upload</button>
              </div>
              <div className="p-3 bg-muted/40 rounded-xl border border-border/40 text-xs flex justify-between items-center">
                <div>
                  <div className="font-semibold">Update Lesson Plan (Syllabus)</div>
                  <div className="text-[10px] text-muted-foreground">CSE-302 curriculum planning details required.</div>
                </div>
                <button className="text-[10px] text-primary font-bold hover:underline">Update</button>
              </div>
              <div className="p-3 bg-muted/40 rounded-xl border border-border/40 text-xs flex justify-between items-center">
                <div>
                  <div className="font-semibold">Teaching Feedback Survey</div>
                  <div className="text-[10px] text-muted-foreground">View students' sentiment report.</div>
                </div>
                <button className="text-[10px] text-primary font-bold hover:underline">View</button>
              </div>
            </div>
          </div>
        )}

        {currentRole === 'College Admin' && (
          <div className="space-y-3">
            <p className="text-xs text-muted-foreground">As the <strong>College Admin</strong>, you configure subscription profiles, team accounts, databases, and platform integrations.</p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-2">
              <div className="p-3 bg-muted/40 rounded-xl border border-border/40 text-xs flex justify-between items-center">
                <div>
                  <div className="font-semibold">Manage Platform Licenses</div>
                  <div className="text-[10px] text-muted-foreground">Manage active seats and accounts.</div>
                </div>
                <button className="text-[10px] text-primary font-bold hover:underline">Edit Users</button>
              </div>
              <div className="p-3 bg-muted/40 rounded-xl border border-border/40 text-xs flex justify-between items-center">
                <div>
                  <div className="font-semibold">Database Backups</div>
                  <div className="text-[10px] text-muted-foreground">All data synchronized on AWS Cloud.</div>
                </div>
                <button className="text-[10px] text-primary font-bold hover:underline">Logs</button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
