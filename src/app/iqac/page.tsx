'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Award, 
  Calendar, 
  CheckSquare, 
  FileText, 
  Plus, 
  Send, 
  Users, 
  TrendingUp, 
  Briefcase, 
  ChevronRight,
  ShieldCheck,
  CheckCircle,
  HelpCircle,
  BarChart2
} from 'lucide-react';

interface IQACMeeting {
  id: string;
  title: string;
  date: string;
  agenda: string;
  attendance: string;
  minutesLink: string;
  status: 'Scheduled' | 'Completed';
}

interface Benchmark {
  id: string;
  indicator: string;
  target: string;
  current: string;
  status: 'Met' | 'Shortfall' | 'Exceeded';
}

const initialMeetings: IQACMeeting[] = [];

const benchmarksList: Benchmark[] = [
  { id: 'b-1', indicator: 'Student-Teacher Ratio', target: '15:1', current: 'Not Audited', status: 'Shortfall' },
  { id: 'b-2', indicator: 'Ph.D. Qualified Faculty', target: '70%', current: 'Not Audited', status: 'Shortfall' },
  { id: 'b-3', indicator: 'UGC-CARE Publications / Yr', target: '60 papers', current: 'Not Audited', status: 'Shortfall' },
  { id: 'b-4', indicator: 'Smart Classrooms Percentage', target: '80%', current: 'Not Audited', status: 'Shortfall' },
  { id: 'b-5', indicator: 'Placement percentage', target: '90%', current: 'Not Audited', status: 'Shortfall' },
];

export default function IQACDashboard() {
  const [meetings, setMeetings] = useState<IQACMeeting[]>(initialMeetings);
  const [benchmarks, setBenchmarks] = useState<Benchmark[]>(benchmarksList);
  const [newMeetingTitle, setNewMeetingTitle] = useState('');
  const [newMeetingDate, setNewMeetingDate] = useState('');
  const [newMeetingAgenda, setNewMeetingAgenda] = useState('');
  const [showMeetForm, setShowMeetForm] = useState(false);

  const handleCreateMeeting = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMeetingTitle || !newMeetingDate) return;

    const newM: IQACMeeting = {
      id: 'm-' + (meetings.length + 1),
      title: newMeetingTitle,
      date: newMeetingDate,
      agenda: newMeetingAgenda || 'General accreditation reviews and workflow updates.',
      attendance: 'Pending Schedule',
      minutesLink: '#',
      status: 'Scheduled',
    };

    setMeetings([newM, ...meetings]);
    setNewMeetingTitle('');
    setNewMeetingDate('');
    setNewMeetingAgenda('');
    setShowMeetForm(false);
  };

  return (
    <div className="space-y-6">
      {/* HEADER */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-xl font-bold">IQAC Quality Assurance Board</h1>
          <p className="text-xs text-muted-foreground">Criterion 6.5 (Internal Quality Assurance System) compliance control center</p>
        </div>
        <button 
          onClick={() => setShowMeetForm(!showMeetForm)}
          className="text-xs font-semibold px-4 py-2.5 rounded-xl bg-primary text-primary-foreground hover:opacity-90 flex items-center gap-1.5"
        >
          <Plus size={14} />
          <span>Schedule IQAC Meeting</span>
        </button>
      </div>

      {/* SCHEDULE MEETING FORM MOCKUP */}
      {showMeetForm && (
        <motion.div 
          initial={{ opacity: 0, y: -10 }} 
          animate={{ opacity: 1, y: 0 }}
          className="p-5 glass-card rounded-2xl border-l-4 border-l-primary max-w-2xl"
        >
          <h3 className="text-sm font-bold text-foreground mb-4">Schedule IQAC Review Meeting</h3>
          <form onSubmit={handleCreateMeeting} className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
            <div className="space-y-1">
              <label className="text-muted-foreground font-semibold">Meeting Subject</label>
              <input 
                type="text" 
                placeholder="15th IQAC Meeting..."
                value={newMeetingTitle}
                onChange={e => setNewMeetingTitle(e.target.value)}
                className="w-full p-2.5 rounded-xl bg-muted/40 border border-border/40 text-foreground"
                required
              />
            </div>
            <div className="space-y-1">
              <label className="text-muted-foreground font-semibold">Date & Time</label>
              <input 
                type="text" 
                placeholder="2026-06-12 11:00 AM..."
                value={newMeetingDate}
                onChange={e => setNewMeetingDate(e.target.value)}
                className="w-full p-2.5 rounded-xl bg-muted/40 border border-border/40 text-foreground"
                required
              />
            </div>
            <div className="md:col-span-2 space-y-1">
              <label className="text-muted-foreground font-semibold">Meeting Agenda / Notes</label>
              <textarea 
                placeholder="Review of Criterion 5 progression data, placement offer verifications..."
                value={newMeetingAgenda}
                onChange={e => setNewMeetingAgenda(e.target.value)}
                rows={3}
                className="w-full p-2.5 rounded-xl bg-muted/40 border border-border/40 text-foreground resize-none"
              />
            </div>
            <div className="md:col-span-2 pt-2 flex justify-end gap-2">
              <button 
                type="button" 
                onClick={() => setShowMeetForm(false)}
                className="px-4 py-2 border border-border rounded-xl text-foreground hover:bg-muted font-semibold"
              >
                Cancel
              </button>
              <button 
                type="submit" 
                className="px-4 py-2 bg-primary text-primary-foreground rounded-xl font-bold"
              >
                Schedule & Email Board
              </button>
            </div>
          </form>
        </motion.div>
      )}

      {/* BENCHMARKS AND MEETINGS CORES */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* QUALITY BENCHMARKS TABLE */}
        <div className="glass-card p-5 rounded-2xl lg:col-span-2 space-y-4">
          <div className="border-b border-border/40 pb-3">
            <h3 className="font-bold text-sm flex items-center gap-2">
              <Award size={16} className="text-primary" />
              IQAC Quality Benchmarking Registers
            </h3>
            <p className="text-[10px] text-muted-foreground">Annual key performance indicators compared with regulatory targets</p>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="border-b border-border/30 bg-muted/30 text-muted-foreground font-semibold">
                  <th className="p-3">Institutional Quality Indicator</th>
                  <th className="p-3">UGC Target</th>
                  <th className="p-3">Current Compliance</th>
                  <th className="p-3 text-right">Status</th>
                </tr>
              </thead>
              <tbody>
                {benchmarks.map((b) => (
                  <tr key={b.id} className="border-b border-border/10 last:border-0 hover:bg-muted/20 transition-colors">
                    <td className="p-3 font-semibold text-foreground">{b.indicator}</td>
                    <td className="p-3 text-muted-foreground">{b.target}</td>
                    <td className="p-3 font-bold">{b.current}</td>
                    <td className="p-3 text-right">
                      <span className={`px-2 py-0.5 rounded-full text-[9px] font-bold ${
                        b.status === 'Exceeded' ? 'bg-emerald-500/10 text-emerald-500' :
                        b.status === 'Met' ? 'bg-blue-500/10 text-blue-500' : 'bg-red-500/10 text-red-500'
                      }`}>
                        {b.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* FEEDBACK DRIVES CAMPAIGNS */}
        <div className="glass-card p-5 rounded-2xl space-y-4 flex flex-col justify-between">
          <div className="border-b border-border/40 pb-3">
            <h3 className="font-bold text-sm flex items-center gap-2">
              <TrendingUp size={16} className="text-primary" />
              Quality Feedback Campaigns
            </h3>
            <p className="text-[10px] text-muted-foreground">Stakeholder reviews (Curricular aspects mapping)</p>
          </div>

          <div className="space-y-3.5">
            <div className="space-y-1.5">
              <div className="flex justify-between text-xs font-semibold">
                <span>Student Satisfaction Survey (2025)</span>
                <span className="text-primary font-bold">0 responses</span>
              </div>
              <div className="w-full h-1.5 bg-muted rounded-full overflow-hidden">
                <div className="h-full bg-blue-600" style={{ width: '0%' }} />
              </div>
            </div>

            <div className="space-y-1.5">
              <div className="flex justify-between text-xs font-semibold">
                <span>Alumni Curriculum Feedback</span>
                <span className="text-primary font-bold">0 responses</span>
              </div>
              <div className="w-full h-1.5 bg-muted rounded-full overflow-hidden">
                <div className="h-full bg-blue-600" style={{ width: '0%' }} />
              </div>
            </div>

            <div className="space-y-1.5">
              <div className="flex justify-between text-xs font-semibold">
                <span>Employer Feedback Campaign</span>
                <span className="text-primary font-bold">0 responses</span>
              </div>
              <div className="w-full h-1.5 bg-muted rounded-full overflow-hidden">
                <div className="h-full bg-blue-600" style={{ width: '0%' }} />
              </div>
            </div>
          </div>

          <button className="w-full text-xs font-semibold py-2.5 rounded-xl bg-primary/10 text-primary dark:bg-primary/20 dark:text-blue-400 hover:opacity-90 transition-opacity flex items-center justify-center gap-1.5 mt-2">
            <Send size={14} />
            <span>Launch New Feedback Drive</span>
          </button>
        </div>

      </div>

      {/* MEETINGS LOGS */}
      <div className="glass-card p-5 rounded-2xl space-y-4">
        <div className="border-b border-border/40 pb-3">
          <h3 className="font-bold text-sm flex items-center gap-2">
            <Calendar size={16} className="text-primary" />
            IQAC Meeting Schedule & Minutes of Meeting (MoM)
          </h3>
          <p className="text-[10px] text-muted-foreground">Historical records compiled for regulatory Criterion 6.5.2 audits</p>
        </div>

        <div className="space-y-3">
          {meetings.map((m) => (
            <div key={m.id} className="p-4 bg-muted/30 border border-border/20 rounded-xl flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div className="space-y-1 flex-1">
                <div className="flex items-center gap-3">
                  <h4 className="font-bold text-xs text-foreground">{m.title}</h4>
                  <span className={`px-2 py-0.5 rounded-full text-[9px] font-bold ${
                    m.status === 'Completed' ? 'bg-emerald-500/10 text-emerald-500' : 'bg-blue-500/10 text-blue-500'
                  }`}>
                    {m.status}
                  </span>
                </div>
                <div className="flex items-center gap-1.5 text-[10px] text-muted-foreground font-semibold">
                  <Calendar size={12} />
                  <span>Date: {m.date}</span>
                  <span>•</span>
                  <span>Board Attendance: {m.attendance}</span>
                </div>
                <p className="text-[11px] text-muted-foreground leading-normal mt-1">{m.agenda}</p>
              </div>

              {m.status === 'Completed' ? (
                <button className="text-xs font-semibold px-3 py-2 rounded-lg bg-muted border border-border/40 hover:bg-border transition-colors flex items-center gap-1.5 shrink-0">
                  <FileText size={14} className="text-indigo-600" />
                  <span>Download Minutes</span>
                </button>
              ) : (
                <button className="text-xs font-semibold px-3 py-2 rounded-lg bg-primary/10 text-primary border border-primary/20 hover:bg-primary/20 transition-colors flex items-center gap-1.5 shrink-0">
                  <Users size={14} />
                  <span>Notify Panel</span>
                </button>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
