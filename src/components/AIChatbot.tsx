'use client';

import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
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
  { sender: 'bot', text: 'Hello! I am your NAAC Accreditation Intelligence Assistant. How can I help you compile data or audit compliance guidelines today?', timestamp: '12:00 PM' }
];

export default function AIChatbot() {
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
    setInputValue('');
    setIsTyping(true);

    // Simulate AI response based on queries
    setTimeout(() => {
      let replyText = 'I am scanning the database...';
      const q = userMsg.text.toLowerCase();

      if (q.includes('criterion 3') || q.includes('research')) {
        replyText = 'Criterion 3 details UGC care publications, patents, and extension programs. To maximize points, make sure each publication has an attached PDF in the library with DOI links and that your department matches UGC research funding targets.';
      } else if (q.includes('curricular') || q.includes('criterion 1')) {
        replyText = 'Criterion 1 tracks Curricular Aspects. You should ensure syllabus files, BOS minutes, elective registries, and feedback reports for 2025-26 are signed by respective department heads and uploaded in the curriculum library.';
      } else if (q.includes('placement') || q.includes('progression')) {
        replyText = 'Placements and Student Progression are mapped under Criterion 5.2. Make sure you compile the annual placement spreadsheet and attach official offer letters as evidence in the library. This directly impacts the projected A++ grade score.';
      } else if (q.includes('missing') || q.includes('gap')) {
        replyText = 'Based on my latest gap audit, Criterion 3.2 has a publication count shortfall in the Computer Science department, and Criterion 5.1 has 2 scholarship logs awaiting verify checks. Click "AI Gap Analysis" on the dashboard to review.';
      } else {
        replyText = "I've logged your query. I am trained on the official NAAC Manual and can help find files, identify evidence gaps, and write SSR chapters. Ask me about specific criteria or document audits!";
      }

      const botMsg: ChatMessage = {
        sender: 'bot',
        text: replyText,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };

      setMessages(prev => [...prev, botMsg]);
      setIsTyping(false);
    }, 1200);
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
                    <span>NAAC Intel Bot</span>
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
                onClick={() => setInputValue('What is required for Criterion 3?')}
                className="px-2.5 py-1 rounded bg-muted/80 text-[10px] border border-border/40 hover:bg-muted font-semibold"
              >
                Criterion 3 Help
              </button>
              <button 
                onClick={() => setInputValue('Show evidence gap analysis')}
                className="px-2.5 py-1 rounded bg-muted/80 text-[10px] border border-border/40 hover:bg-muted font-semibold"
              >
                Evidence gaps
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
