'use client';

import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAppStore } from '@/store/appStore';
import { 
  MessageSquare, 
  X, 
  Send, 
  Bot, 
  Sparkles, 
  ArrowRight,
  ShieldCheck
} from 'lucide-react';

interface ChatMessage {
  sender: 'user' | 'bot';
  text: string;
  timestamp: string;
}

const initialMessages: ChatMessage[] = [
  { sender: 'bot', text: 'Hello! I am your AMG NAAC Accreditation Intelligence Assistant. How can I help you compile data or audit compliance guidelines today?', timestamp: '12:00 PM' }
];

export default function AIChatbot() {
  const { 
    faculty, 
    documents, 
    students, 
    meetings, 
    benchmarks, 
    currentRole, 
    completedChecklistItems 
  } = useAppStore();

  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>(initialMessages);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputValue.trim()) return;

    const userMsg: ChatMessage = {
      sender: 'user',
      text: inputValue,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages(prev => [...prev, userMsg]);
    const currentInput = inputValue;
    setInputValue('');
    setIsTyping(true);

    // Simulate AI response based on live global store data
    setTimeout(() => {
      let replyText = '';
      const q = currentInput.toLowerCase();

      // Math for dynamic responses
      const totalFaculty = faculty.length;
      const phdCount = faculty.filter(f => f.qualification.includes('Ph.D.')).length;
      const phdPercent = totalFaculty === 0 ? 0 : Math.round((phdCount / totalFaculty) * 100);
      const totalPublications = faculty.reduce((acc, curr) => acc + curr.publications, 0);
      const avgPublications = totalFaculty === 0 ? '0.0' : (totalPublications / totalFaculty).toFixed(1);

      const totalStudents = students.length;
      const placedStudents = students.filter(s => s.placed);
      const placementRate = totalStudents === 0 ? 0 : Math.round((placedStudents.length / totalStudents) * 100);
      const totalSalary = placedStudents.reduce((acc, curr) => acc + curr.salaryLPA, 0);
      const avgSalary = placedStudents.length === 0 ? 0 : (totalSalary / placedStudents.length);

      const totalDocs = documents.length;
      const verifiedDocs = documents.filter(d => d.status === 'Verified').length;
      const pendingDocs = totalDocs - verifiedDocs;

      const totalMeetings = meetings.length;
      const completedMeetings = meetings.filter(m => m.status === 'Completed').length;
      const scheduledMeetings = totalMeetings - completedMeetings;

      const metBenchmarks = benchmarks.filter(b => b.status === 'Met').length;
      const shortfallBenchmarks = benchmarks.filter(b => b.status === 'Shortfall').length;
      const exceededBenchmarks = benchmarks.filter(b => b.status === 'Exceeded').length;

      const totalCheckedItems = Object.keys(completedChecklistItems).filter(k => completedChecklistItems[k]).length;

      if (q.includes('faculty') || q.includes('teacher') || q.includes('staff')) {
        replyText = `There are currently ${totalFaculty} faculty members registered in the AMG database. Average publication count is ${avgPublications} papers/member, and ${phdPercent}% of faculty hold a Ph.D. qualification.`;
      } else if (q.includes('document') || q.includes('upload') || q.includes('evidence')) {
        replyText = `The Documents Hub contains ${totalDocs} uploaded evidence files. Out of these, ${verifiedDocs} are approved & verified, and ${pendingDocs} are awaiting compliance check.`;
      } else if (q.includes('student') || q.includes('enrollment')) {
        replyText = `The student progression database records ${totalStudents} registered students. The overall placement rate is ${placementRate}%, with an average package of INR ${avgSalary.toFixed(1)} LPA.`;
      } else if (q.includes('placement') || q.includes('salary') || q.includes('package')) {
        replyText = `Student placement rate is currently standing at ${placementRate}%. The average salary package across placed students is INR ${avgSalary.toFixed(1)} LPA.`;
      } else if (q.includes('meeting') || q.includes('iqac')) {
        replyText = `We have logged ${totalMeetings} total IQAC board meetings. ${completedMeetings} have completed minutes uploaded, and ${scheduledMeetings} meeting(s) are scheduled/upcoming.`;
      } else if (q.includes('benchmark') || q.includes('quality') || q.includes('target')) {
        replyText = `IQAC tracks 5 primary benchmarks: ${exceededBenchmarks} exceeded, ${metBenchmarks} met, and ${shortfallBenchmarks} indicating shortfalls. You can edit compliance targets directly inside the IQAC Management portal.`;
      } else if (q.includes('readiness') || q.includes('audit') || q.includes('grade') || q.includes('check')) {
        replyText = `Accreditation readiness audit is live: you have completed ${totalCheckedItems} checklist requirements. Overall compliance score projections place AMG in a favorable target standing. Run a full AI Audit to get exact projected grades.`;
      } else if (q.includes('help') || q.includes('what can you do')) {
        replyText = "I can answer specific details about your AMG NAAC compliance progress! Try asking about: 'How many faculty members?', 'What is our student placement rate?', 'Show document upload status', 'How many IQAC meetings are completed?' or 'What is our current benchmark status?'.";
      } else {
        replyText = `I have received your query: "${currentInput}". According to AMG accreditation registers, you have ${totalFaculty} faculty, ${totalDocs} uploads, and ${totalStudents} students. Ask me specific questions about these counts for detailed reports!`;
      }

      const botMsg: ChatMessage = {
        sender: 'bot',
        text: replyText,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };

      setMessages(prev => [...prev, botMsg]);
      setIsTyping(false);
    }, 1000);
  };

  return (
    <div className="fixed bottom-6 right-6 z-50">
      <AnimatePresence>
        {/* CHAT WINDOW */}
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.85, y: 50 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.85, y: 50 }}
            transition={{ duration: 0.25, ease: 'easeOut' }}
            className="w-80 md:w-96 h-[480px] rounded-2xl border border-border shadow-2xl glass-card flex flex-col overflow-hidden mb-4"
          >
            {/* CHAT HEADER */}
            <div className="p-4 bg-gradient-to-r from-blue-600 to-indigo-600 text-white flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-white/10 flex items-center justify-center">
                  <Bot size={18} className="text-white" />
                </div>
                <div>
                  <h4 className="text-xs font-bold leading-none flex items-center gap-1.5">
                    <span>AMG Intel Bot</span>
                    <Sparkles size={12} className="text-amber-300 animate-pulse" />
                  </h4>
                  <span className="text-[9px] text-white/70 font-semibold mt-0.5 inline-block">Active Assistance</span>
                </div>
              </div>
              <button 
                onClick={() => setIsOpen(false)}
                className="p-1 rounded-full hover:bg-white/10 text-white/80 hover:text-white transition-colors"
              >
                <X size={16} />
              </button>
            </div>

            {/* CHAT MESSAGES */}
            <div className="flex-1 p-4 overflow-y-auto space-y-3 flex flex-col bg-muted/20">
              {messages.map((m, idx) => (
                <div 
                  key={idx} 
                  className={`flex flex-col max-w-[80%] ${m.sender === 'user' ? 'self-end items-end' : 'self-start items-start'}`}
                >
                  <div className={`p-3 rounded-2xl text-xs leading-relaxed ${
                    m.sender === 'user' 
                      ? 'bg-primary text-primary-foreground rounded-tr-none' 
                      : 'bg-muted border border-border/40 text-foreground rounded-tl-none'
                  }`}>
                    {m.text}
                  </div>
                  <span className="text-[9px] text-muted-foreground mt-1 font-semibold px-1">{m.timestamp}</span>
                </div>
              ))}
              
              {isTyping && (
                <div className="self-start flex flex-col items-start max-w-[80%]">
                  <div className="p-3 rounded-2xl bg-muted border border-border/40 rounded-tl-none flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-muted-foreground animate-bounce" style={{ animationDelay: '0ms' }} />
                    <span className="w-1.5 h-1.5 rounded-full bg-muted-foreground animate-bounce" style={{ animationDelay: '150ms' }} />
                    <span className="w-1.5 h-1.5 rounded-full bg-muted-foreground animate-bounce" style={{ animationDelay: '300ms' }} />
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* PRESETS */}
            <div className="px-4 py-2 border-t border-border/20 flex gap-1.5 overflow-x-auto whitespace-nowrap bg-muted/40 scrollbar-none">
              <button 
                onClick={() => { setInputValue('What is our student placement rate?'); }}
                className="px-2.5 py-1 rounded bg-muted/80 text-[10px] border border-border/40 hover:bg-muted font-semibold"
              >
                Placement Stats
              </button>
              <button 
                onClick={() => { setInputValue('How many faculty members hold a Ph.D.?'); }}
                className="px-2.5 py-1 rounded bg-muted/80 text-[10px] border border-border/40 hover:bg-muted font-semibold"
              >
                Faculty Count
              </button>
              <button 
                onClick={() => { setInputValue('Show document upload status'); }}
                className="px-2.5 py-1 rounded bg-muted/80 text-[10px] border border-border/40 hover:bg-muted font-semibold"
              >
                Document Status
              </button>
              <button 
                onClick={() => { setInputValue('What is our overall readiness level?'); }}
                className="px-2.5 py-1 rounded bg-muted/80 text-[10px] border border-border/40 hover:bg-muted font-semibold"
              >
                Overall Readiness
              </button>
            </div>

            {/* CHAT INPUT FORM */}
            <form onSubmit={handleSendMessage} className="p-3 border-t border-border/40 flex items-center gap-2 bg-popover">
              <input 
                type="text" 
                placeholder="Ask about NAAC guidelines..."
                value={inputValue}
                onChange={e => setInputValue(e.target.value)}
                className="flex-1 p-2 rounded-xl bg-muted/50 border border-border/40 outline-none text-xs text-foreground placeholder-muted-foreground"
              />
              <button 
                type="submit" 
                className="p-2 rounded-xl bg-primary text-primary-foreground hover:opacity-90 transition-opacity"
              >
                <Send size={14} />
              </button>
            </form>
          </motion.div>
        )}
      </AnimatePresence>

      {/* FLOATING ACTION TRIGGER */}
      <motion.button
        onClick={() => setIsOpen(!isOpen)}
        className="w-12 h-12 rounded-full bg-gradient-to-tr from-blue-600 to-indigo-600 text-white flex items-center justify-center shadow-xl shadow-blue-500/20 hover:scale-105 transition-transform"
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        <MessageSquare size={20} />
      </motion.button>
    </div>
  );
}
