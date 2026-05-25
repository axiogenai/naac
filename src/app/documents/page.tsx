'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAppStore } from '@/store/appStore';
import { 
  FileText, 
  Search, 
  UploadCloud, 
  Trash2, 
  FolderPlus, 
  Sparkles, 
  Eye, 
  Check, 
  X, 
  File, 
  Info, 
  BookOpen, 
  Compass, 
  Cpu, 
  CheckCircle,
  AlertTriangle
} from 'lucide-react';

interface DocFile {
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

const initialFiles: DocFile[] = [];

export default function DocumentsHub() {
  const { user } = useAppStore();
  const [files, setFiles] = useState<DocFile[]>(initialFiles);
  const [selectedFileId, setSelectedFileId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDept, setSelectedDept] = useState('All');
  const [isUploading, setIsUploading] = useState(false);

  const selectedFile = files.find(f => f.id === selectedFileId);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const uploadedFile = e.target.files?.[0];
    if (!uploadedFile) return;

    setIsUploading(true);

    // Simulate OCR delay
    setTimeout(() => {
      const newDoc: DocFile = {
        id: 'doc-' + (files.length + 1),
        name: uploadedFile.name,
        department: 'Computer Science',
        criteria: 'Criterion 2.1.1',
        uploader: user ? `${user.name} (${user.role})` : 'System (Auto)',
        date: new Date().toISOString().split('T')[0],
        size: (uploadedFile.size / (1024 * 1024)).toFixed(1) + ' MB',
        status: 'Awaiting OCR',
        ocrContent: 'SIMULATED EXTRACTED TEXT FROM ' + uploadedFile.name.toUpperCase() + ':\nThis document contains student evaluation reports and internal assessment scores for the Spring Semester 2026. The total pass percentage is recorded at 94.6% with 12 students scoring perfect CGPAs...',
        suggestedTags: [
          { tag: 'Criterion 2.1.1 - Student Performance', confidence: 94 },
          { tag: 'Criterion 2.2.1 - Catering to Diversity', confidence: 76 }
        ]
      };
      setFiles(prev => [newDoc, ...prev]);
      setSelectedFileId(newDoc.id);
      setIsUploading(false);
    }, 1500);
  };

  const handleApproveTags = (fileId: string) => {
    setFiles(prev => prev.map(f => f.id === fileId ? { ...f, status: 'Verified' } : f));
  };

  const handleDeleteFile = (fileId: string) => {
    setFiles(prev => prev.filter(f => f.id !== fileId));
    if (selectedFileId === fileId) {
      setSelectedFileId(null);
    }
  };

  const filteredFiles = files.filter(file => {
    const matchesSearch = file.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          file.ocrContent.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesDept = selectedDept === 'All' || file.department === selectedDept;
    return matchesSearch && matchesDept;
  });

  const departments = ['All', 'Computer Science', 'Electronics', 'Mechanical', 'AIML', 'AIDS'];

  return (
    <div className="grid grid-cols-1 xl:grid-cols-4 gap-6 items-start h-full">
      {/* LEFT 3 COLUMNS: UPLOADER & FILE LIST */}
      <div className="xl:col-span-3 space-y-6">
        
        {/* DRAG-AND-DROP FILE UPLOADER MOCKUP */}
        <div className="glass-card p-6 rounded-2xl">
          <h2 className="text-sm font-bold mb-3 flex items-center gap-2">
            <UploadCloud size={18} className="text-primary" />
            Upload Accreditation Evidence
          </h2>
          <div className="relative border-2 border-dashed border-border/60 hover:border-primary/50 rounded-xl p-8 flex flex-col items-center justify-center text-center transition-colors bg-muted/20 cursor-pointer group">
            <input 
              type="file" 
              onChange={handleFileUpload} 
              className="absolute inset-0 opacity-0 cursor-pointer z-10" 
              disabled={isUploading}
            />
            {isUploading ? (
              <div className="space-y-3">
                <div className="w-10 h-10 border-4 border-t-primary border-r-transparent rounded-full animate-spin mx-auto" />
                <p className="text-xs font-semibold text-primary">AI Engine is running OCR and parsing document layout...</p>
              </div>
            ) : (
              <div className="space-y-2">
                <div className="w-12 h-12 rounded-xl bg-primary/10 text-primary flex items-center justify-center mx-auto group-hover:scale-110 transition-transform">
                  <UploadCloud size={24} />
                </div>
                <div>
                  <p className="text-xs font-bold">Drag and drop institutional PDFs or spreadsheets here</p>
                  <p className="text-[10px] text-muted-foreground mt-1">Accepts PDF, XLS, DOCX up to 25MB (automatic OCR and auto-tagging)</p>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* SEARCH AND FILTERS */}
        <div className="glass-card p-4 rounded-2xl flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2 px-3 py-2 rounded-xl bg-muted/60 border border-border/40 text-xs w-full md:w-80">
            <Search size={14} className="text-muted-foreground" />
            <input 
              type="text" 
              placeholder="Search file name or OCR text..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="bg-transparent border-0 outline-none w-full text-foreground placeholder-muted-foreground"
            />
          </div>

          <div className="flex items-center gap-2 w-full md:w-auto overflow-x-auto py-1">
            {departments.map((dept) => (
              <button
                key={dept}
                onClick={() => setSelectedDept(dept)}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors border ${
                  selectedDept === dept 
                    ? 'bg-primary border-primary text-white' 
                    : 'bg-muted/40 border-border hover:bg-muted text-muted-foreground hover:text-foreground'
                }`}
              >
                {dept}
              </button>
            ))}
          </div>
        </div>

        {/* DOCUMENT GRID/LIST */}
        <div className="glass-card rounded-2xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="border-b border-border/40 bg-muted/40 text-muted-foreground font-semibold">
                  <th className="p-4">Document Title</th>
                  <th className="p-4">Department</th>
                  <th className="p-4">Mapped Criteria</th>
                  <th className="p-4">Uploaded By</th>
                  <th className="p-4 text-center">Status</th>
                  <th className="p-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredFiles.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="p-8 text-center text-muted-foreground">
                      No documents found matching the criteria.
                    </td>
                  </tr>
                ) : (
                  filteredFiles.map((file) => (
                    <tr 
                      key={file.id} 
                      onClick={() => setSelectedFileId(file.id)}
                      className={`border-b border-border/20 last:border-0 hover:bg-muted/30 cursor-pointer transition-colors ${
                        selectedFileId === file.id ? 'bg-primary/5 dark:bg-primary/10' : ''
                      }`}
                    >
                      <td className="p-4">
                        <div className="flex items-center gap-2.5">
                          <FileText size={18} className="text-primary" />
                          <div>
                            <div className="font-semibold text-foreground">{file.name}</div>
                            <div className="text-[10px] text-muted-foreground mt-0.5">{file.size} • {file.date}</div>
                          </div>
                        </div>
                      </td>
                      <td className="p-4 text-muted-foreground font-medium">{file.department}</td>
                      <td className="p-4">
                        <span className="px-2 py-0.5 bg-indigo-500/10 text-indigo-500 rounded font-semibold text-[10px]">
                          {file.criteria}
                        </span>
                      </td>
                      <td className="p-4 text-muted-foreground">{file.uploader}</td>
                      <td className="p-4">
                        <div className="flex justify-center">
                          <span className={`px-2 py-0.5 rounded-full text-[9px] font-bold ${
                            file.status === 'Verified' ? 'bg-emerald-500/10 text-emerald-500' :
                            file.status === 'Tagged' ? 'bg-blue-500/10 text-blue-500' :
                            file.status === 'Failed Audit' ? 'bg-red-500/10 text-red-500' : 'bg-amber-500/10 text-amber-500'
                          }`}>
                            {file.status}
                          </span>
                        </div>
                      </td>
                      <td className="p-4 text-right" onClick={(e) => e.stopPropagation()}>
                        <div className="flex items-center justify-end gap-2">
                          <button 
                            onClick={() => setSelectedFileId(file.id)}
                            className="p-1 rounded hover:bg-muted text-muted-foreground hover:text-foreground"
                          >
                            <Eye size={14} />
                          </button>
                          <button 
                            onClick={() => handleDeleteFile(file.id)}
                            className="p-1 rounded hover:bg-muted text-red-500"
                          >
                            <Trash2 size={14} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

      </div>

      {/* RIGHT COLUMN: OCR PREVIEW & AI TAG DRAWER */}
      <div className="xl:col-span-1 glass-card p-5 rounded-2xl space-y-5 h-[calc(100vh-120px)] overflow-y-auto sticky top-20">
        {selectedFile ? (
          <div className="space-y-5">
            {/* FILE GENERAL DATA */}
            <div className="border-b border-border/40 pb-4">
              <div className="w-10 h-10 rounded-lg bg-primary/10 text-primary flex items-center justify-center mb-3">
                <File size={20} />
              </div>
              <h3 className="font-bold text-sm leading-tight text-foreground">{selectedFile.name}</h3>
              <p className="text-[10px] text-muted-foreground mt-1">Uploaded by {selectedFile.uploader} on {selectedFile.date}</p>
            </div>

            {/* OCR EXTRACTED TEXT PANEL */}
            <div className="space-y-2">
              <h4 className="text-xs font-bold text-muted-foreground uppercase tracking-wider flex items-center gap-1.5">
                <Compass size={14} />
                OCR Extracted Text
              </h4>
              <div className="p-3 bg-muted/40 rounded-xl border border-border/20 max-h-40 overflow-y-auto text-[11px] leading-relaxed text-muted-foreground font-mono">
                {selectedFile.ocrContent}
              </div>
            </div>

            {/* AI SUGGESTED ACCREDITATION TAGS */}
            <div className="space-y-3">
              <h4 className="text-xs font-bold text-muted-foreground uppercase tracking-wider flex items-center gap-1.5">
                <Cpu size={14} className="text-purple-500" />
                AI Suggested Criteria Tags
              </h4>
              
              <div className="space-y-2">
                {selectedFile.suggestedTags.map((st, idx) => (
                  <div 
                    key={idx} 
                    className="p-3 bg-purple-500/5 border border-purple-500/10 rounded-xl space-y-1.5"
                  >
                    <div className="flex justify-between text-xs">
                      <span className="font-bold text-purple-600 dark:text-purple-400">{st.tag}</span>
                      <span className="font-bold text-muted-foreground">{st.confidence}%</span>
                    </div>
                    <div className="w-full h-1 bg-muted rounded-full overflow-hidden">
                      <div className="h-full bg-purple-500" style={{ width: `${st.confidence}%` }} />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* ERROR COMPLIANCE FLAGS (AUDITS) */}
            {selectedFile.status === 'Failed Audit' && (
              <div className="p-3 bg-red-500/5 border border-red-500/10 rounded-xl flex gap-2.5 items-start text-xs text-red-600 dark:text-red-400">
                <AlertTriangle size={16} className="shrink-0 mt-0.5" />
                <div className="space-y-0.5">
                  <div className="font-bold">Missing Compliance Evidence</div>
                  <p className="text-[10px] text-muted-foreground leading-normal">
                    This document was flagged during automatic format screening because it lacks a doctor stamp or medical registry number.
                  </p>
                </div>
              </div>
            )}

            {/* DECISIONS PANEL */}
            <div className="pt-2 space-y-2">
              {selectedFile.status !== 'Verified' ? (
                <button 
                  onClick={() => handleApproveTags(selectedFile.id)}
                  className="w-full py-2.5 rounded-xl bg-primary text-primary-foreground text-xs font-bold hover:opacity-90 transition-opacity flex items-center justify-center gap-1.5"
                >
                  <Check size={14} />
                  <span>Approve & Link Tags</span>
                </button>
              ) : (
                <div className="p-2.5 bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 dark:text-emerald-400 rounded-xl text-center font-bold text-xs flex items-center justify-center gap-1.5">
                  <CheckCircle size={14} />
                  <span>Verified & Synced to SSR</span>
                </div>
              )}
              
              <button className="w-full py-2.5 rounded-xl border border-border text-foreground hover:bg-muted text-xs font-semibold transition-colors">
                Re-run AI Analysis
              </button>
            </div>
          </div>
        ) : (
          <div className="h-full flex flex-col items-center justify-center text-center text-muted-foreground py-10 space-y-2">
            <Info size={24} />
            <p className="text-xs">Select a file from the database list to inspect AI tagging and OCR text</p>
          </div>
        )}
      </div>
    </div>
  );
}
