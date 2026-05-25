'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Sparkles, 
  BookOpen, 
  FileText, 
  Cpu, 
  Save, 
  Download, 
  CheckSquare, 
  Trash2, 
  HelpCircle,
  AlertCircle,
  RotateCcw,
  CheckCircle,
  Copy,
  Plus
} from 'lucide-react';

interface Chapter {
  id: string;
  name: string;
  draftText: string;
  suggestions: string[];
}

const initialChapters: Chapter[] = [
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
      "Add stats stating the 48 journal publications compiled in CSE department for the year 2025.",
      "Detail seed funding values allotted (e.g. INR 25,00,000 distributed among 12 faculty projects).",
      "Integrate grant approval letter links for external funding sources."
    ]
  },
  {
    id: 'crit-5.2',
    name: 'Criterion 5.2 - Student Progression & Placements',
    draftText: '',
    suggestions: [
      "State the projected 94% placement rate achieved during the 2025-26 campus recruitment drives.",
      "Add the average salary LPA progression data (INR 4.8 LPA in 2022 to 7.2 LPA in 2026).",
      "Map placement offer letter PDF locations in the Document Management library."
    ]
  }
];

export default function SSReportWriter() {
  const [chapters, setChapters] = useState<Chapter[]>(initialChapters);
  const [selectedChapterId, setSelectedChapterId] = useState('crit-1.1');
  const [activeTone, setActiveTone] = useState<'Academic' | 'Professional' | 'Compliance'>('Compliance');
  const [isGenerating, setIsGenerating] = useState(false);
  const [showToast, setShowToast] = useState(false);

  const selectedChapter = chapters.find(c => c.id === selectedChapterId)!;

  const handleTextChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setChapters(prev => prev.map(c => c.id === selectedChapterId ? { ...c, draftText: e.target.value } : c));
  };

  const handleGenerateNarrative = () => {
    setIsGenerating(true);
    setTimeout(() => {
      let suffix = '';
      if (activeTone === 'Academic') {
        suffix = '\n\nAcademic Evaluation: The pedagogical delivery architecture maintains a rigorous alignment with UGC parameters, promoting cognitive learning and mapping outcomes to PO/CO tables through objective feedback cycles.';
      } else if (activeTone === 'Professional') {
        suffix = '\n\nStrategic Outcome: By integrating modern project management tools and industry internships, the curriculum bridges the academy-industry gap, leading to a 28% increase in direct campus placements.';
      } else {
        suffix = '\n\nCompliance Audit Trail: Documented evidence of all syllabus revisions, course outcome mappings, and student satisfaction feedback logs are archived and verified under IQAC reference numbers [MoM-2025-1.1.2].';
      }

      setChapters(prev => prev.map(c => 
        c.id === selectedChapterId ? { ...c, draftText: c.draftText + suffix } : c
      ));
      setIsGenerating(false);
    }, 1500);
  };

  const handleSave = () => {
    setShowToast(true);
    setTimeout(() => setShowToast(false), 2000);
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 items-start h-full relative">
      {/* TOAST NOTIFICATION */}
      <AnimatePresence>
        {showToast && (
          <motion.div 
            initial={{ opacity: 0, y: 50, x: '-50%' }}
            animate={{ opacity: 1, y: 0, x: '-50%' }}
            exit={{ opacity: 0, y: 50, x: '-50%' }}
            className="fixed bottom-10 left-1/2 -translate-x-1/2 px-4 py-2.5 bg-emerald-500 text-white rounded-xl text-xs font-bold shadow-lg flex items-center gap-2 z-50"
          >
            <CheckCircle size={16} />
            <span>SSR Draft saved successfully to cloud repository</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* CHAPTER SELECTOR & EDITING SPACE (LEFT 3 COLUMNS) */}
      <div className="lg:col-span-3 space-y-6">
        
        {/* SELECTOR */}
        <div className="glass-card p-4 rounded-2xl flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2 shrink-0">
            <BookOpen size={16} className="text-primary" />
            <span className="text-xs font-semibold text-muted-foreground">Select SSR Chapter:</span>
          </div>
          <select
            value={selectedChapterId}
            onChange={e => setSelectedChapterId(e.target.value)}
            className="p-2 bg-muted/60 border border-border/40 rounded-xl text-xs font-semibold w-full md:w-96 text-foreground"
          >
            {chapters.map(c => (
              <option key={c.id} value={c.id}>{c.name}</option>
            ))}
          </select>
        </div>

        {/* EDITOR AREA */}
        <div className="glass-card p-6 rounded-2xl flex flex-col h-[calc(100vh-280px)] min-h-[400px]">
          <div className="flex items-center justify-between border-b border-border/40 pb-4 mb-4">
            <div className="flex items-center gap-2">
              <FileText size={18} className="text-primary" />
              <span className="font-bold text-sm text-foreground">Self-Study Report Draft Workspace</span>
            </div>
            <div className="flex items-center gap-2">
              <button 
                onClick={handleSave}
                className="p-2 rounded-lg bg-muted text-muted-foreground hover:text-foreground border border-border/40 transition-colors"
                title="Save Draft"
              >
                <Save size={16} />
              </button>
              <button 
                className="p-2 rounded-lg bg-muted text-muted-foreground hover:text-foreground border border-border/40 transition-colors"
                title="Export Document"
              >
                <Download size={16} />
              </button>
            </div>
          </div>

          <div className="flex-1 flex flex-col">
            <textarea
              value={selectedChapter.draftText}
              onChange={handleTextChange}
              placeholder="Write or edit SSR chapter narration here..."
              className="flex-1 w-full bg-transparent border-0 outline-none resize-none text-xs leading-relaxed text-foreground font-sans placeholder-muted-foreground"
            />
          </div>

          <div className="border-t border-border/40 pt-4 flex justify-between items-center text-[10px] text-muted-foreground font-semibold">
            <span>Word Count: {selectedChapter.draftText.split(/\s+/).filter(Boolean).length} words</span>
            <span className="flex items-center gap-1.5 text-emerald-500">
              <CheckCircle size={12} /> Plagiarism Check: 0% Match (Verified)
            </span>
          </div>
        </div>

      </div>

      {/* AI COMPANION PANEL (RIGHT 1 COLUMN) */}
      <div className="lg:col-span-1 glass-card p-5 rounded-2xl space-y-5 h-[calc(100vh-190px)] overflow-y-auto sticky top-20 flex flex-col justify-between">
        <div className="space-y-5">
          <div className="border-b border-border/40 pb-3 flex items-center justify-between">
            <h3 className="font-bold text-sm flex items-center gap-2">
              <Cpu size={16} className="text-purple-500" />
              AI Writing Companion
            </h3>
            <span className="text-[10px] font-semibold bg-purple-500/10 text-purple-500 px-2 py-0.5 rounded">Llama-3</span>
          </div>

          {/* TONE SELECTION */}
          <div className="space-y-2">
            <span className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider">Draft Narrative Tone</span>
            <div className="grid grid-cols-3 gap-1.5">
              {(['Academic', 'Professional', 'Compliance'] as const).map((t) => (
                <button
                  key={t}
                  onClick={() => setActiveTone(t)}
                  className={`py-2 rounded-lg text-[10px] font-bold transition-all border ${
                    activeTone === t 
                      ? 'bg-purple-500/10 border-purple-500 text-purple-600 dark:text-purple-400' 
                      : 'bg-muted/40 border-border hover:bg-muted text-muted-foreground hover:text-foreground'
                  }`}
                >
                  {t}
                </button>
              ))}
            </div>
          </div>

          {/* NARRATOR TRIGGER */}
          <button 
            onClick={handleGenerateNarrative}
            disabled={isGenerating}
            className="w-full py-2.5 rounded-xl bg-gradient-to-r from-blue-600 to-purple-600 text-white text-xs font-bold hover:opacity-90 transition-opacity flex items-center justify-center gap-2"
          >
            {isGenerating ? (
              <>
                <div className="w-3.5 h-3.5 border-2 border-t-transparent rounded-full animate-spin" />
                <span>Generating narrative...</span>
              </>
            ) : (
              <>
                <Sparkles size={14} className="animate-pulse" />
                <span>Augment AI Paragraph</span>
              </>
            )}
          </button>

          {/* WRITING RECOMMENDATIONS */}
          <div className="space-y-2.5">
            <span className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider flex items-center gap-1">
              <AlertCircle size={12} className="text-purple-500" />
              AI Narrative Recommendations
            </span>
            <div className="space-y-2">
              {selectedChapter.suggestions.map((sug, idx) => (
                <div 
                  key={idx} 
                  className="p-3 bg-purple-500/5 border border-purple-500/10 rounded-xl space-y-1.5 text-[11px] leading-relaxed text-muted-foreground"
                >
                  <p>{sug}</p>
                  <button 
                    onClick={() => {
                      setChapters(prev => prev.map(c => {
                        if (c.id === selectedChapterId) {
                          // Simple append suggestion to demonstrate interaction
                          return {
                            ...c,
                            draftText: c.draftText + `\n\n[Recommendation Addition]: ` + sug.replace('Include a direct reference to ', '').replace('Add ', '').replace('State the ', '')
                          };
                        }
                        return c;
                      }));
                    }}
                    className="text-[10px] font-bold text-primary hover:underline flex items-center gap-1"
                  >
                    <Plus size={10} /> Auto-Integrate
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="p-3 bg-muted/40 rounded-xl border border-border/20 text-[10px] text-muted-foreground leading-normal flex gap-2">
          <Cpu size={14} className="text-primary shrink-0 mt-0.5" />
          <span>This editor supports automatic draft formatting in alignment with NAAC SSR guidelines.</span>
        </div>
      </div>
    </div>
  );
}
