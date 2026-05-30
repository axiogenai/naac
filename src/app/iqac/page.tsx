'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAppStore, IQACMeeting, Benchmark, FeedbackDrive } from '@/store/appStore';
import { 
  Award, 
  Calendar, 
  CheckSquare, 
  FileText, 
  Plus, 
  Send, 
  Users, 
  TrendingUp, 
  ChevronRight,
  ShieldCheck,
  CheckCircle,
  HelpCircle,
  BarChart2,
  Edit2,
  Check,
  X
} from 'lucide-react';

export default function IQACDashboard() {
  const { 
    meetings, 
    addMeeting, 
    completeMeeting, 
    benchmarks, 
    updateBenchmark, 
    feedbackDrives, 
    addFeedbackDrive, 
    addNotification 
  } = useAppStore();

  const [newMeetingTitle, setNewMeetingTitle] = useState('');
  const [newMeetingDate, setNewMeetingDate] = useState('');
  const [newMeetingAgenda, setNewMeetingAgenda] = useState('');
  const [showMeetForm, setShowMeetForm] = useState(false);

  // Feedback Drive form state
  const [showFeedbackForm, setShowFeedbackForm] = useState(false);
  const [feedbackName, setFeedbackName] = useState('');
  const [feedbackAudience, setFeedbackAudience] = useState('Students');
  const [feedbackTarget, setFeedbackTarget] = useState(500);
  const [feedbackDeadline, setFeedbackDeadline] = useState('');

  // Benchmark inline editing state
  const [editingBenchmarkId, setEditingBenchmarkId] = useState<string | null>(null);
  const [editValue, setEditValue] = useState('');

  // Mark Completed state
  const [completingMeetingId, setCompletingMeetingId] = useState<string | null>(null);
  const [attendanceInput, setAttendanceInput] = useState('');

  const handleCreateMeeting = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMeetingTitle || !newMeetingDate) return;

    const newM: IQACMeeting = {
      id: 'm-' + Date.now(),
      title: newMeetingTitle,
      date: newMeetingDate,
      agenda: newMeetingAgenda || 'General accreditation reviews and workflow updates.',
      attendance: 'Pending Schedule',
      minutesLink: '#',
      status: 'Scheduled',
    };

    addMeeting(newM);
    setNewMeetingTitle('');
    setNewMeetingDate('');
    setNewMeetingAgenda('');
    setShowMeetForm(false);

    addNotification({
      title: 'Meeting Scheduled',
      message: `"${newM.title}" has been successfully added to the IQAC calendar for ${newM.date}.`,
      type: 'success'
    });
  };

  const handleLaunchFeedback = (e: React.FormEvent) => {
    e.preventDefault();
    if (!feedbackName || !feedbackDeadline) return;

    const newDrive: FeedbackDrive = {
      id: 'fd-' + Date.now(),
      name: feedbackName,
      audience: feedbackAudience,
      target: Number(feedbackTarget),
      responses: 0,
      deadline: feedbackDeadline
    };

    addFeedbackDrive(newDrive);
    setFeedbackName('');
    setFeedbackDeadline('');
    setFeedbackTarget(500);
    setShowFeedbackForm(false);

    addNotification({
      title: 'Feedback Drive Active',
      message: `New feedback drive "${newDrive.name}" targeting ${newDrive.audience} is now live.`,
      type: 'success'
    });
  };

  const handleNotifyPanel = (m: IQACMeeting) => {
    addNotification({
      title: 'IQAC Meeting Notice',
      message: `Meeting "${m.title}" scheduled for ${m.date}. All panel members have been notified via email.`,
      type: 'info'
    });
  };

  const handleDownloadMinutes = (m: IQACMeeting) => {
    const text = `NAIP IQAC MEETING MINUTES\n==========================\nTitle: ${m.title}\nDate: ${m.date}\nAttendance: ${m.attendance}\nStatus: ${m.status}\n\nAgenda:\n${m.agenda}\n\nCompiled via NAAC Accreditation Intelligence Platform.`;
    const blob = new Blob([text], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `IQAC_Meeting_${m.id}_Minutes.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleStartEditBenchmark = (b: Benchmark) => {
    setEditingBenchmarkId(b.id);
    setEditValue(b.current === 'Not Audited' ? '' : b.current);
  };

  const handleSaveBenchmark = (id: string) => {
    updateBenchmark(id, editValue.trim() || 'Not Audited');
    setEditingBenchmarkId(null);
  };

  const handleCompleteMeetingSubmit = (id: string) => {
    completeMeeting(id, attendanceInput || '10/12 Members');
    setCompletingMeetingId(null);
    setAttendanceInput('');

    addNotification({
      title: 'Meeting Closed',
      message: `IQAC meeting minutes log compiled and benchmark parameters updated.`,
      type: 'success'
    });
  };

  return (
    <div className="space-y-6">
      {/* HEADER */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-xl font-bold">IQAC Quality Assurance Board</h1>
          <p className="text-xs text-muted-foreground">Criterion 6.5 (Internal Quality Assurance System) compliance control center</p>
        </div>
        <div className="flex gap-2">
          <button 
            onClick={() => {
              setShowMeetForm(!showMeetForm);
              setShowFeedbackForm(false);
            }}
            className="text-xs font-semibold px-4 py-2.5 rounded-xl bg-primary text-primary-foreground hover:opacity-90 flex items-center gap-1.5"
          >
            {showMeetForm ? <X size={14} /> : <Plus size={14} />}
            <span>Schedule Meeting</span>
          </button>
          <button 
            onClick={() => {
              setShowFeedbackForm(!showFeedbackForm);
              setShowMeetForm(false);
            }}
            className="text-xs font-semibold px-4 py-2.5 rounded-xl bg-indigo-600 text-white hover:opacity-90 flex items-center gap-1.5"
          >
            {showFeedbackForm ? <X size={14} /> : <Send size={14} />}
            <span>Feedback Drive</span>
          </button>
        </div>
      </div>

      {/* MEETINGS FORM */}
      <AnimatePresence>
        {showMeetForm && (
          <motion.div 
            initial={{ opacity: 0, y: -10 }} 
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="p-5 glass-card rounded-2xl border-l-4 border-l-primary max-w-2xl"
          >
            <h3 className="text-sm font-bold text-foreground mb-4">Schedule IQAC Review Meeting</h3>
            <form onSubmit={handleCreateMeeting} className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
              <div className="space-y-1">
                <label className="text-muted-foreground font-semibold">Meeting Subject</label>
                <input 
                  type="text" 
                  placeholder="e.g. 15th IQAC Meeting"
                  value={newMeetingTitle}
                  onChange={e => setNewMeetingTitle(e.target.value)}
                  className="w-full p-2.5 rounded-xl bg-muted/40 border border-border/40 text-foreground outline-none focus:border-primary"
                  required
                />
              </div>
              <div className="space-y-1">
                <label className="text-muted-foreground font-semibold">Date & Time</label>
                <input 
                  type="text" 
                  placeholder="e.g. 2026-06-12 11:00 AM"
                  value={newMeetingDate}
                  onChange={e => setNewMeetingDate(e.target.value)}
                  className="w-full p-2.5 rounded-xl bg-muted/40 border border-border/40 text-foreground outline-none focus:border-primary"
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
                  className="w-full p-2.5 rounded-xl bg-muted/40 border border-border/40 text-foreground resize-none outline-none focus:border-primary"
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
      </AnimatePresence>

      {/* FEEDBACK DRIVE FORM */}
      <AnimatePresence>
        {showFeedbackForm && (
          <motion.div 
            initial={{ opacity: 0, y: -10 }} 
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="p-5 glass-card rounded-2xl border-l-4 border-l-indigo-600 max-w-2xl"
          >
            <h3 className="text-sm font-bold text-foreground mb-4">Launch New Stakeholder Feedback Drive</h3>
            <form onSubmit={handleLaunchFeedback} className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
              <div className="space-y-1">
                <label className="text-muted-foreground font-semibold">Campaign Name</label>
                <input 
                  type="text" 
                  placeholder="e.g. Student Curriculum Review 2026"
                  value={feedbackName}
                  onChange={e => setFeedbackName(e.target.value)}
                  className="w-full p-2.5 rounded-xl bg-muted/40 border border-border/40 text-foreground outline-none focus:border-indigo-600"
                  required
                />
              </div>
              <div className="space-y-1">
                <label className="text-muted-foreground font-semibold">Audience Profile</label>
                <select
                  value={feedbackAudience}
                  onChange={e => setFeedbackAudience(e.target.value)}
                  className="w-full p-2.5 rounded-xl bg-muted/40 border border-border/40 text-foreground outline-none focus:border-indigo-600"
                >
                  <option value="Students">Students</option>
                  <option value="Alumni">Alumni</option>
                  <option value="Employers">Employers</option>
                  <option value="Faculty">Faculty</option>
                </select>
              </div>
              <div className="space-y-1">
                <label className="text-muted-foreground font-semibold">Target Responses</label>
                <input 
                  type="number"
                  placeholder="e.g. 500"
                  value={feedbackTarget}
                  onChange={e => setFeedbackTarget(Number(e.target.value) || 0)}
                  className="w-full p-2.5 rounded-xl bg-muted/40 border border-border/40 text-foreground outline-none focus:border-indigo-600"
                  required
                />
              </div>
              <div className="space-y-1">
                <label className="text-muted-foreground font-semibold">Deadline Date</label>
                <input 
                  type="text" 
                  placeholder="e.g. 2026-06-30"
                  value={feedbackDeadline}
                  onChange={e => setFeedbackDeadline(e.target.value)}
                  className="w-full p-2.5 rounded-xl bg-muted/40 border border-border/40 text-foreground outline-none focus:border-indigo-600"
                  required
                />
              </div>
              <div className="md:col-span-2 pt-2 flex justify-end gap-2">
                <button 
                  type="button" 
                  onClick={() => setShowFeedbackForm(false)}
                  className="px-4 py-2 border border-border rounded-xl text-foreground hover:bg-muted font-semibold"
                >
                  Cancel
                </button>
                <button 
                  type="submit" 
                  className="px-4 py-2 bg-indigo-600 text-white rounded-xl font-bold"
                >
                  Launch Campaign
                </button>
              </div>
            </form>
          </motion.div>
        )}
      </AnimatePresence>

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
                  <th className="p-3 text-right">Status / Actions</th>
                </tr>
              </thead>
              <tbody>
                {benchmarks.map((b) => (
                  <tr key={b.id} className="border-b border-border/10 last:border-0 hover:bg-muted/20 transition-colors">
                    <td className="p-3 font-semibold text-foreground">{b.indicator}</td>
                    <td className="p-3 text-muted-foreground">{b.target}</td>
                    <td className="p-3 font-bold">
                      {editingBenchmarkId === b.id ? (
                        <div className="flex items-center gap-1">
                          <input 
                            type="text"
                            value={editValue}
                            onChange={(e) => setEditValue(e.target.value)}
                            onKeyDown={(e) => {
                              if (e.key === 'Enter') handleSaveBenchmark(b.id);
                              else if (e.key === 'Escape') setEditingBenchmarkId(null);
                            }}
                            className="p-1 rounded bg-muted border border-border text-xs w-24 outline-none focus:border-primary text-foreground"
                          />
                          <button onClick={() => handleSaveBenchmark(b.id)} className="p-1 bg-emerald-500/20 text-emerald-500 rounded hover:bg-emerald-500/30">
                            <Check size={12} />
                          </button>
                          <button onClick={() => setEditingBenchmarkId(null)} className="p-1 bg-red-500/20 text-red-500 rounded hover:bg-red-500/30">
                            <X size={12} />
                          </button>
                        </div>
                      ) : (
                        <div className="flex items-center gap-2">
                          <span>{b.current}</span>
                          <button onClick={() => handleStartEditBenchmark(b)} className="p-1 rounded hover:bg-muted text-muted-foreground hover:text-foreground">
                            <Edit2 size={12} />
                          </button>
                        </div>
                      )}
                    </td>
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

          <div className="space-y-4 overflow-y-auto max-h-[220px] pr-1">
            {/* HARDCODED BASE DRIVES */}
            <div className="space-y-1.5">
              <div className="flex justify-between text-xs font-semibold">
                <span>Student Satisfaction Survey</span>
                <span className="text-primary font-bold">482 / 500</span>
              </div>
              <div className="w-full h-1.5 bg-muted rounded-full overflow-hidden">
                <div className="h-full bg-blue-600" style={{ width: '96.4%' }} />
              </div>
            </div>

            <div className="space-y-1.5">
              <div className="flex justify-between text-xs font-semibold">
                <span>Alumni Curriculum Feedback</span>
                <span className="text-primary font-bold">148 / 200</span>
              </div>
              <div className="w-full h-1.5 bg-muted rounded-full overflow-hidden">
                <div className="h-full bg-blue-600" style={{ width: '74%' }} />
              </div>
            </div>

            {/* DYNAMIC FEEDBACK DRIVES */}
            {feedbackDrives.map(fd => {
              const pct = Math.min(100, Math.round((fd.responses / fd.target) * 100)) || 0;
              return (
                <div key={fd.id} className="space-y-1.5 pt-2 border-t border-border/10">
                  <div className="flex justify-between text-xs font-semibold">
                    <span>{fd.name} ({fd.audience})</span>
                    <span className="text-primary font-bold">{fd.responses} / {fd.target}</span>
                  </div>
                  <div className="w-full h-1.5 bg-muted rounded-full overflow-hidden">
                    <div className="h-full bg-indigo-600" style={{ width: `${pct}%` }} />
                  </div>
                  <div className="flex justify-between text-[9px] text-muted-foreground">
                    <span>Deadline: {fd.deadline}</span>
                    <button 
                      onClick={() => useAppStore.getState().incrementFeedbackResponses(fd.id, 25)}
                      className="text-primary hover:underline font-bold"
                    >
                      + Sim 25 Responses
                    </button>
                  </div>
                </div>
              );
            })}
          </div>

          <button 
            onClick={() => {
              setShowFeedbackForm(true);
              setShowMeetForm(false);
            }} 
            className="w-full text-xs font-semibold py-2.5 rounded-xl bg-primary/10 text-primary dark:bg-primary/20 dark:text-blue-400 hover:opacity-90 transition-opacity flex items-center justify-center gap-1.5 mt-2"
          >
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
          {meetings.length === 0 ? (
            <p className="text-center py-6 text-xs text-muted-foreground">No meetings scheduled. Use the Schedule button above to register the first meeting.</p>
          ) : (
            meetings.map((m) => (
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

                <div className="flex items-center gap-2 shrink-0">
                  {m.status === 'Completed' ? (
                    <button 
                      onClick={() => handleDownloadMinutes(m)}
                      className="text-xs font-semibold px-3 py-2 rounded-lg bg-muted border border-border/40 hover:bg-border transition-colors flex items-center gap-1.5"
                    >
                      <FileText size={14} className="text-indigo-600" />
                      <span>Download Minutes</span>
                    </button>
                  ) : (
                    <>
                      {completingMeetingId === m.id ? (
                        <div className="flex items-center gap-1.5 bg-popover p-2 rounded-xl border border-border">
                          <input 
                            type="text"
                            placeholder="e.g. 10/12 members"
                            value={attendanceInput}
                            onChange={(e) => setAttendanceInput(e.target.value)}
                            className="p-1 rounded bg-muted border border-border text-xs w-28 outline-none text-foreground"
                          />
                          <button 
                            onClick={() => handleCompleteMeetingSubmit(m.id)}
                            className="px-2 py-1 bg-emerald-500 text-white rounded text-[10px] font-bold"
                          >
                            Save
                          </button>
                          <button 
                            onClick={() => setCompletingMeetingId(null)}
                            className="p-1 bg-muted border border-border rounded text-[10px]"
                          >
                            Cancel
                          </button>
                        </div>
                      ) : (
                        <button 
                          onClick={() => {
                            setCompletingMeetingId(m.id);
                            setAttendanceInput('');
                          }}
                          className="text-xs font-semibold px-3 py-2 rounded-lg bg-emerald-600/10 text-emerald-500 border border-emerald-500/20 hover:bg-emerald-600/20 transition-colors"
                        >
                          Mark Completed
                        </button>
                      )}
                      <button 
                        onClick={() => handleNotifyPanel(m)}
                        className="text-xs font-semibold px-3 py-2 rounded-lg bg-primary/10 text-primary border border-primary/20 hover:bg-primary/20 transition-colors flex items-center gap-1.5"
                      >
                        <Users size={14} />
                        <span>Notify Panel</span>
                      </button>
                    </>
                  )}
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
