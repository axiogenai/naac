'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { useAppStore } from '@/store/appStore';
import { 
  CheckSquare, 
  FileText, 
  Users, 
  HelpCircle, 
  Plus, 
  FileCode,
  ShieldCheck,
  CheckCircle,
  Clock,
  AlertCircle,
  ChevronRight,
  UserPlus
} from 'lucide-react';

interface CriterionDetail {
  id: number;
  name: string;
  weightage: number;
  progress: number;
  status: 'Verified' | 'In Review' | 'In Progress' | 'Not Started';
  lead: string;
  description: string;
  checklist: { id: string; text: string; done: boolean }[];
  evidence: { name: string; type: string; date: string; size: string; status: 'Approved' | 'Pending' }[];
}

const criteriaList: CriterionDetail[] = [
  {
    id: 1,
    name: 'Curricular Aspects',
    weightage: 100,
    progress: 0,
    status: 'Not Started',
    lead: 'Not Assigned',
    description: 'Focuses on the curriculum design, development, planning, academic flexibility, and syllabus feedback systems across programs.',
    checklist: [
      { id: '1-1', text: 'Define curriculum objectives and program outcomes (POs/COs)', done: false },
      { id: '1-2', text: 'Obtain curriculum feedback from students, alumni, and employers', done: false },
      { id: '1-3', text: 'Verify academic flexibility options (elective subjects, value-added programs)', done: false },
      { id: '1-4', text: 'Upload minutes of Board of Studies (BOS) meetings', done: false }
    ],
    evidence: []
  },
  {
    id: 2,
    name: 'Teaching-Learning & Evaluation',
    weightage: 350,
    progress: 0,
    status: 'Not Started',
    lead: 'Not Assigned',
    description: 'Deals with student enrollment profiles, diversity, teacher quality, learning evaluation methods, and student satisfaction surveys.',
    checklist: [
      { id: '2-1', text: 'Student enrollment statistics audit (gender, reservation quotas)', done: false },
      { id: '2-2', text: 'Analyze and map Student-Teacher ratios across departments', done: false },
      { id: '2-3', text: 'Collect Student Satisfaction Survey (SSS) reports', done: false },
      { id: '2-4', text: 'Compile list of teachers with Ph.D./NET qualifications', done: false }
    ],
    evidence: []
  },
  {
    id: 3,
    name: 'Research, Innovations & Extension',
    weightage: 120,
    progress: 0,
    status: 'Not Started',
    lead: 'Not Assigned',
    description: 'Measures publication rates, research grants, patents filed, startup incubations, and institutional extension activities.',
    checklist: [
      { id: '3-1', text: 'Aggregate journal publications in UGC-CARE list', done: false },
      { id: '3-2', text: 'Audit research funding and corporate grants received', done: false },
      { id: '3-3', text: 'Collect proofs of patents published or licensed', done: false },
      { id: '3-4', text: 'Verify Extension activities in surrounding rural communities', done: false }
    ],
    evidence: []
  },
  {
    id: 4,
    name: 'Infrastructure & Learning Resources',
    weightage: 100,
    progress: 0,
    status: 'Not Started',
    lead: 'Not Assigned',
    description: 'Audits physical classrooms, laboratories, computer systems, library subscriptions (e-journals), and physical sports amenities.',
    checklist: [
      { id: '4-1', text: 'Verify availability of smart classrooms with projectors', done: false },
      { id: '4-2', text: 'Audit library stock registers and online e-resource logins', done: false },
      { id: '4-3', text: 'Calculate student-to-computer ratio (CSE lab specs)', done: false },
      { id: '4-4', text: 'Audit campus maintenance expenditures and bills', done: false }
    ],
    evidence: []
  },
  {
    id: 5,
    name: 'Student Support & Progression',
    weightage: 130,
    progress: 0,
    status: 'Not Started',
    lead: 'Not Assigned',
    description: 'Tracks placement performance, scholarship beneficiaries, student grievances redressed, and sports/cultural achievements.',
    checklist: [
      { id: '5-1', text: 'Compile government and institutional scholarship recipient lists', done: false },
      { id: '5-2', text: 'Audit placement drive records, packages, and offer letters', done: false },
      { id: '5-3', text: 'Collate files of students progressing to higher education', done: false },
      { id: '5-4', text: 'Verify grievance committee report submissions', done: false }
    ],
    evidence: []
  },
  {
    id: 6,
    name: 'Governance, Leadership & Management',
    weightage: 100,
    progress: 0,
    status: 'Not Started',
    lead: 'Not Assigned',
    description: 'Assesses the professional governance of the college, IQAC effectiveness, financial management, audits, and welfare policies.',
    checklist: [
      { id: '6-1', text: 'Publish institutional perspective/strategic plan document', done: false },
      { id: '6-2', text: 'Collect proof of faculty welfare schemes and benefits', done: false },
      { id: '6-3', text: 'Audit external financial auditing reports', done: false },
      { id: '6-4', text: 'Analyze professional development training records', done: false }
    ],
    evidence: []
  },
  {
    id: 7,
    name: 'Institutional Values & Best Practices',
    weightage: 100,
    progress: 0,
    status: 'Not Started',
    lead: 'Not Assigned',
    description: 'Tracks green campus initiatives, gender equity plans, energy-saving systems, and files detailing the institution\'s best practices.',
    checklist: [
      { id: '7-1', text: 'Conduct Green Audit and Energy Audit surveys', done: false },
      { id: '7-2', text: 'Publish code of conduct handbook for students & faculty', done: false },
      { id: '7-3', text: 'Document campus solar power grid capacity metrics', done: false },
      { id: '7-4', text: 'Draft case studies for institutional Best Practices', done: false }
    ],
    evidence: []
  }
];

export default function CriteriaHub() {
  const { selectedDepartment, completedChecklistItems, toggleChecklistItem } = useAppStore();
  const [selectedCriteriaId, setSelectedCriteriaId] = useState(1);

  const activeDept = selectedDepartment === 'All Departments' ? 'Computer Science' : selectedDepartment;

  const localCriteria = criteriaList.map(c => {
    const updatedChecklist = c.checklist.map(item => {
      const isDone = !!completedChecklistItems[`${activeDept}_${c.id}_${item.id}`];
      return { ...item, done: isDone };
    });
    const completedCount = updatedChecklist.filter(i => i.done).length;
    const progress = Math.round((completedCount / updatedChecklist.length) * 100);
    return {
      ...c,
      checklist: updatedChecklist,
      progress
    };
  });

  const selectedCriteria = localCriteria.find(c => c.id === selectedCriteriaId)!;

  const handleCheckboxToggle = (checklistId: string) => {
    toggleChecklistItem(activeDept, selectedCriteriaId, checklistId);
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 h-full items-start">
      
      {/* CRITERIA LIST SIDE PANEL */}
      <div className="lg:col-span-1 space-y-3">
        <h2 className="text-sm font-bold text-muted-foreground uppercase tracking-wider px-2">NAAC Chapters</h2>
        <div className="space-y-2">
          {localCriteria.map((crit) => {
            const isSelected = crit.id === selectedCriteriaId;
            return (
              <motion.div
                key={crit.id}
                onClick={() => setSelectedCriteriaId(crit.id)}
                className={`p-3.5 rounded-xl border cursor-pointer transition-all duration-200 ${
                  isSelected 
                    ? 'glass bg-primary/10 border-primary text-primary dark:text-blue-400 font-semibold' 
                    : 'glass-card border-border hover:bg-muted/40 text-muted-foreground hover:text-foreground'
                }`}
                whileHover={{ x: 4 }}
              >
                <div className="flex items-center justify-between text-xs mb-1.5">
                  <span className="font-semibold">Criterion {crit.id}</span>
                  <span className={`px-2 py-0.5 rounded-full text-[9px] font-bold ${
                    crit.status === 'Verified' ? 'bg-emerald-500/10 text-emerald-500' :
                    crit.status === 'In Review' ? 'bg-amber-500/10 text-amber-500' : 'bg-indigo-500/10 text-indigo-500'
                  }`}>
                    {crit.status}
                  </span>
                </div>
                <h3 className="text-xs text-foreground font-semibold leading-tight line-clamp-1 mb-2">
                  {crit.name}
                </h3>
                <div className="flex items-center justify-between text-[10px]">
                  <span className="text-muted-foreground">W: {crit.weightage} Pts</span>
                  <span className="font-bold">{crit.progress}% Done</span>
                </div>
                <div className="w-full h-1.5 bg-muted rounded-full overflow-hidden mt-1.5">
                  <div 
                    className={`h-full ${isSelected ? 'bg-primary dark:bg-blue-500' : 'bg-muted-foreground/30'}`} 
                    style={{ width: `${crit.progress}%` }} 
                  />
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>

      {/* CRITERION DETAIL CONTENT */}
      <div className="lg:col-span-3 space-y-6">
        <AnimatePresence mode="wait">
          <motion.div
            key={selectedCriteriaId}
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            transition={{ duration: 0.2 }}
            className="space-y-6"
          >
            {/* DETAIL TOP CARD */}
            <div className="glass-card p-6 rounded-2xl space-y-4">
              <div className="flex flex-col md:flex-row justify-between items-start gap-4 pb-4 border-b border-border/40">
                <div>
                  <span className="text-xs font-semibold text-primary dark:text-blue-400">Accreditation Criterion {selectedCriteria.id} &bull; Dept: {activeDept}</span>
                  <h1 className="text-xl font-bold text-foreground mt-0.5">{selectedCriteria.name}</h1>
                  <p className="text-xs text-muted-foreground mt-2 max-w-2xl leading-normal">{selectedCriteria.description}</p>
                </div>
                <div className="flex items-center gap-3 shrink-0">
                  <div className="text-center p-3 rounded-xl bg-muted/40 border border-border/30 w-24">
                    <div className="text-lg font-bold text-foreground">{selectedCriteria.weightage}</div>
                    <div className="text-[9px] font-semibold text-muted-foreground uppercase tracking-wider">Weightage</div>
                  </div>
                  <div className="text-center p-3 rounded-xl bg-muted/40 border border-border/30 w-24">
                    <div className="text-lg font-bold text-primary dark:text-blue-400">{selectedCriteria.progress}%</div>
                    <div className="text-[9px] font-semibold text-muted-foreground uppercase tracking-wider">Complete</div>
                  </div>
                </div>
              </div>

              {/* CRITERION LEAD ASSIGNMENT */}
              <div className="flex flex-wrap items-center justify-between text-xs pt-1 gap-2">
                <div className="flex items-center gap-2">
                  <span className="text-muted-foreground">Criterion Lead:</span>
                  <span className="font-semibold text-foreground bg-muted/60 px-2.5 py-1 rounded-lg border border-border/30">{selectedCriteria.lead}</span>
                </div>
                <button className="flex items-center gap-1.5 text-primary hover:underline font-semibold">
                  <UserPlus size={14} />
                  <span>Reassign Lead</span>
                </button>
              </div>
            </div>

            {/* CHECKLIST & EVIDENCE PANEL */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* CHECKLIST */}
              <div className="glass-card p-6 rounded-2xl space-y-4">
                <div className="flex items-center justify-between border-b border-border/40 pb-3">
                  <h3 className="text-sm font-bold flex items-center gap-2">
                    <CheckSquare size={16} className="text-primary" />
                    Workflow Checklist
                  </h3>
                  <button className="p-1 rounded-lg bg-primary/10 text-primary hover:bg-primary/20 transition-colors">
                    <Plus size={14} />
                  </button>
                </div>
                
                <div className="space-y-3">
                  {selectedCriteria.checklist.map((item) => (
                    <div 
                      key={item.id} 
                      onClick={() => handleCheckboxToggle(item.id)}
                      className={`flex items-start gap-3 p-3 rounded-xl border cursor-pointer transition-all duration-200 ${
                        item.done 
                          ? 'bg-emerald-500/5 border-emerald-500/20 text-emerald-800 dark:text-emerald-300' 
                          : 'bg-muted/30 border-transparent hover:border-border/40 text-muted-foreground hover:text-foreground'
                      }`}
                    >
                      <div className="mt-0.5 shrink-0">
                        {item.done ? (
                          <CheckCircle size={16} className="text-emerald-500 fill-emerald-500/20" />
                        ) : (
                          <Clock size={16} className="text-muted-foreground" />
                        )}
                      </div>
                      <span className="text-xs leading-normal font-medium">{item.text}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* EVIDENCE FILES */}
              <div className="glass-card p-6 rounded-2xl space-y-4">
                <div className="flex items-center justify-between border-b border-border/40 pb-3">
                  <h3 className="text-sm font-bold flex items-center gap-2">
                    <FileText size={16} className="text-primary" />
                    Mapped Evidence Documents
                  </h3>
                  <Link href="/documents">
                    <span className="text-xs font-semibold text-primary hover:underline">Link files</span>
                  </Link>
                </div>

                <div className="space-y-3">
                  {selectedCriteria.evidence.map((ev, idx) => (
                    <div 
                      key={idx} 
                      className="p-3 bg-muted/30 rounded-xl border border-border/20 text-xs flex items-center justify-between gap-3"
                    >
                      <div className="flex items-center gap-2.5 overflow-hidden">
                        <FileCode size={18} className="text-indigo-500 shrink-0" />
                        <div className="overflow-hidden">
                          <div className="font-semibold text-foreground truncate">{ev.name}</div>
                          <div className="text-[10px] text-muted-foreground mt-0.5">{ev.size} • {ev.date}</div>
                        </div>
                      </div>
                      <span className={`px-2 py-0.5 rounded-full text-[9px] font-bold shrink-0 ${
                        ev.status === 'Approved' ? 'bg-emerald-500/10 text-emerald-500' : 'bg-amber-500/10 text-amber-500'
                      }`}>
                        {ev.status}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* CRITERION STATS SUMMARY */}
            <div className="p-5 glass-card rounded-2xl flex flex-col md:flex-row items-center justify-between gap-4 border-l-4 border-l-emerald-500">
              <div className="flex items-center gap-3">
                <ShieldCheck size={28} className="text-emerald-500" />
                <div className="space-y-0.5">
                  <h4 className="text-xs font-bold text-foreground">Accreditation Audit Compliance Checked</h4>
                  <p className="text-[10px] text-muted-foreground leading-normal">
                    This criterion adheres to the NAAC Manual for Universities. Gap index is 1.2% (negligible).
                  </p>
                </div>
              </div>
              <button className="text-xs font-semibold bg-emerald-500 hover:opacity-90 transition-opacity text-white px-4 py-2 rounded-xl shrink-0">
                View Compliance Log
              </button>
            </div>
            
          </motion.div>
        </AnimatePresence>
      </div>

    </div>
  );
}
