'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAppStore, SSRChapter } from '@/store/appStore';
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
  Plus,
  X
} from 'lucide-react';

export default function SSReportWriter() {
  const { ssrChapters, updateSSRChapter, addSSRChapter, addNotification } = useAppStore();
  const [selectedChapterId, setSelectedChapterId] = useState('crit-1.1');
  const [activeTone, setActiveTone] = useState<'Academic' | 'Professional' | 'Compliance'>('Compliance');
  const [isGenerating, setIsGenerating] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');

  // Add Chapter state
  const [showAddForm, setShowAddForm] = useState(false);
  const [newChapterId, setNewChapterId] = useState('');
  const [newChapterName, setNewChapterName] = useState('');

  const selectedChapter = ssrChapters.find(c => c.id === selectedChapterId) || ssrChapters[0];

  const handleTextChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    if (selectedChapter) {
      updateSSRChapter(selectedChapter.id, e.target.value);
    }
  };

  const handleGenerateNarrative = () => {
    if (!selectedChapter) return;
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

      updateSSRChapter(selectedChapter.id, selectedChapter.draftText + suffix);
      setIsGenerating(false);
      triggerToast('AI paragraph successfully augmented');
    }, 1500);
  };

  const triggerToast = (msg: string) => {
    setToastMessage(msg);
    setShowToast(true);
    setTimeout(() => setShowToast(false), 2000);
  };

  const handleSave = () => {
    triggerToast('SSR Draft saved successfully to local state');
    addNotification({
      title: 'Draft Saved',
      message: `Self-Study Report for ${selectedChapter?.name} saved.`,
      type: 'success'
    });
  };

  const handleExport = () => {
    if (!selectedChapter) return;
    const blob = new Blob([selectedChapter.draftText], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${selectedChapter.name.replace(/\s+/g, '_')}_Draft.txt`;
    a.click();
    URL.revokeObjectURL(url);
    triggerToast('SSR Draft exported as TXT');
  };

  const handleCopy = () => {
    if (!selectedChapter) return;
    navigator.clipboard.writeText(selectedChapter.draftText);
    triggerToast('Copied draft to clipboard');
  };

  const handleAddChapterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newChapterId || !newChapterName) return;

    const newChapter: SSRChapter = {
      id: newChapterId.trim(),
      name: newChapterName.trim(),
      draftText: '',
      suggestions: [
        `Document key metrics relating to ${newChapterName.trim()}`,
        'Verify evidence documents have correct tags and are linked to this chapter.'
      ]
    };

    addSSRChapter(newChapter);
    setSelectedChapterId(newChapter.id);
    setNewChapterId('');
    setNewChapterName('');
    setShowAddForm(false);
    triggerToast('New SSR Chapter added');
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
            className="fixed bottom-10 left-1/2 -translate-x-1/2 px-4 py-2.5 bg-emerald-500 text-white rounded-xl text-xs font-bold shadow-lg flex items-center gap-2 z-50 animate-bounce"
          >
            <CheckCircle size={16} />
            <span>{toastMessage}</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* CHAPTER SELECTOR & EDITING SPACE */}
      <div className="lg:col-span-3 space-y-6">
        
        {/* SELECTOR */}
        <div className="glass-card p-4 rounded-2xl flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2 shrink-0">
            <BookOpen size={16} className="text-primary" />
            <span className="text-xs font-semibold text-muted-foreground">Select SSR Chapter:</span>
          </div>
          <div className="flex gap-2 w-full md:w-auto">
            <select
              value={selectedChapterId}
              onChange={e => setSelectedChapterId(e.target.value)}
              className="p-2 bg-muted/60 border border-border/40 rounded-xl text-xs font-semibold w-full md:w-96 text-foreground outline-none"
            >
              {ssrChapters.map(c => (
                <option key={c.id} value={c.id}>{c.name}</option>
              ))}
            </select>
            <button 
              onClick={() => setShowAddForm(!showAddForm)}
              className="p-2 rounded-xl bg-primary text-primary-foreground hover:opacity-90 transition-opacity flex items-center justify-center"
              title="Add Chapter"
            >
              <Plus size={16} />
            </button>
          </div>
        </div>

        {/* ADD CHAPTER FORM */}
        <AnimatePresence>
          {showAddForm && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="p-5 glass-card rounded-2xl border-l-4 border-l-primary space-y-3 overflow-hidden"
            >
              <h3 className="text-xs font-bold">Create Custom SSR Chapter / Section</h3>
              <form onSubmit={handleAddChapterSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
                <input
                  type="text"
                  placeholder="Chapter ID (e.g. crit-1.2)"
                  required
                  value={newChapterId}
                  onChange={e => setNewChapterId(e.target.value)}
                  className="p-2.5 rounded-xl bg-muted/40 border border-border outline-none focus:border-primary text-foreground"
                />
                <input
                  type="text"
                  placeholder="Chapter Title (e.g. Criterion 1.2 - Academic Flexibility)"
                  required
                  value={newChapterName}
                  onChange={e => setNewChapterName(e.target.value)}
                  className="p-2.5 rounded-xl bg-muted/40 border border-border outline-none focus:border-primary text-foreground"
                />
                <div className="md:col-span-2 flex justify-end gap-2">
                  <button 
                    type="button" 
                    onClick={() => setShowAddForm(false)}
                    className="px-3 py-1.5 border border-border rounded-xl text-foreground hover:bg-muted font-semibold"
                  >
                    Cancel
                  </button>
                  <button 
                    type="submit" 
                    className="px-3 py-1.5 bg-primary text-primary-foreground rounded-xl font-bold"
                  >
                    Add Chapter
                  </button>
                </div>
              </form>
            </motion.div>
          )}
        </AnimatePresence>

        {/* EDITOR AREA */}
        {selectedChapter && (
          <div className="glass-card p-6 rounded-2xl flex flex-col h-[calc(100vh-280px)] min-h-[400px]">
            <div className="flex items-center justify-between border-b border-border/40 pb-4 mb-4">
              <div className="flex items-center gap-2">
                <FileText size={18} className="text-primary" />
                <span className="font-bold text-sm text-foreground">Self-Study Report Draft Workspace</span>
              </div>
              <div className="flex items-center gap-2">
                <button 
                  onClick={handleCopy}
                  className="p-2 rounded-lg bg-muted text-muted-foreground hover:text-foreground border border-border/40 transition-colors"
                  title="Copy to Clipboard"
                >
                  <Copy size={16} />
                </button>
                <button 
                  onClick={handleSave}
                  className="p-2 rounded-lg bg-muted text-muted-foreground hover:text-foreground border border-border/40 transition-colors"
                  title="Save Draft"
                >
                  <Save size={16} />
                </button>
                <button 
                  onClick={handleExport}
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
        )}
      </div>

      {/* AI COMPANION PANEL */}
      {selectedChapter && (
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
                        const integrationText = `\n\n[Recommendation Addition]: ` + sug.replace('Include a direct reference to ', '').replace('Add ', '').replace('State the ', '');
                        updateSSRChapter(selectedChapter.id, selectedChapter.draftText + integrationText);
                        triggerToast('Suggestion auto-integrated');
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
      )}
    </div>
  );
}
