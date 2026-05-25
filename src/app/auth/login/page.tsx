'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { 
  Bot, 
  Sparkles, 
  Mail, 
  Lock, 
  ArrowRight, 
  Building2, 
  ShieldAlert,
  UserCheck
} from 'lucide-react';
import { useAppStore, UserRole } from '@/store/appStore';

export default function LoginPage() {
  const router = useRouter();
  const { login, isAuthenticated } = useAppStore();
  
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState<UserRole>('IQAC Coordinator');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // If already authenticated, redirect to dashboard
  useEffect(() => {
    if (isAuthenticated) {
      router.push('/dashboard');
    }
  }, [isAuthenticated, router]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim() || !password.trim()) {
      setError('Please fill out all credentials.');
      return;
    }
    
    setLoading(true);
    setError('');

    // Simulate login delay
    setTimeout(() => {
      login(email, role);
      setLoading(false);
      router.push('/dashboard');
    }, 1200);
  };

  const handleDemoAutofill = (demoRole: UserRole) => {
    const roleEmails: Record<UserRole, string> = {
      'IQAC Coordinator': 'iqac.director@amg.edu.in',
      'Principal': 'principal@amg.edu.in',
      'HOD': 'hod.cse@amg.edu.in',
      'Faculty': 'prof.aditya@amg.edu.in',
      'College Admin': 'admin@amg.edu.in',
      'Super Admin': 'super.admin@naip.com',
      'Student': 'student.union@amg.edu.in'
    };

    setEmail(roleEmails[demoRole] || 'user@amg.edu.in');
    setPassword('••••••••••••');
    setRole(demoRole);
  };

  return (
    <div className="min-h-[calc(100vh-80px)] flex items-center justify-center relative py-12 z-10">
      
      {/* FLOATING DESIGN BACKGROUNDS */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden z-0">
        <div className="absolute top-[20%] left-[20%] w-[350px] h-[350px] rounded-full bg-blue-600/10 blur-[100px] dark:bg-blue-600/5 animate-pulse" />
        <div className="absolute bottom-[20%] right-[20%] w-[350px] h-[350px] rounded-full bg-purple-600/10 blur-[100px] dark:bg-purple-600/5 animate-pulse" />
      </div>

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="w-full max-w-md glass-card p-8 rounded-3xl relative z-10"
      >
        {/* LOGO */}
        <div className="text-center space-y-2 mb-8">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-blue-600 to-indigo-600 flex items-center justify-center text-white text-sm font-extrabold shadow-lg shadow-blue-500/20 mx-auto">
            AMG
          </div>
          <div>
            <h1 className="text-xl font-bold tracking-tight text-gradient-primary">AMG NAAC Portal</h1>
            <p className="text-[11px] text-muted-foreground font-semibold mt-1">Enterprise-Grade Accreditation SaaS</p>
          </div>
        </div>

        {/* ERROR DISPLAY */}
        {error && (
          <div className="p-3 mb-4 bg-red-500/5 border border-red-500/10 text-red-600 dark:text-red-400 rounded-xl text-xs flex gap-2 items-center">
            <ShieldAlert size={14} className="shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {/* FORM */}
        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          <div className="space-y-1">
            <label className="text-muted-foreground font-semibold">Institutional Email</label>
            <div className="relative flex items-center">
              <Mail size={14} className="absolute left-3 text-muted-foreground" />
              <input 
                type="email" 
                placeholder="you@amg.edu.in"
                value={email}
                onChange={e => setEmail(e.target.value)}
                className="w-full pl-9 pr-4 py-2.5 rounded-xl bg-muted/40 border border-border/40 text-foreground outline-none focus:border-primary/50 transition-colors"
                required
              />
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-muted-foreground font-semibold">Password</label>
            <div className="relative flex items-center">
              <Lock size={14} className="absolute left-3 text-muted-foreground" />
              <input 
                type="password" 
                placeholder="Enter password"
                value={password}
                onChange={e => setPassword(e.target.value)}
                className="w-full pl-9 pr-4 py-2.5 rounded-xl bg-muted/40 border border-border/40 text-foreground outline-none focus:border-primary/50 transition-colors"
                required
              />
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-muted-foreground font-semibold">Sign in Role</label>
            <select
              value={role}
              onChange={e => setRole(e.target.value as UserRole)}
              className="w-full p-2.5 rounded-xl bg-muted/40 border border-border/40 text-foreground outline-none focus:border-primary/50 transition-colors"
            >
              <option value="IQAC Coordinator">IQAC Coordinator</option>
              <option value="Principal">Principal</option>
              <option value="HOD">Head of Department (HOD)</option>
              <option value="Faculty">Faculty Member</option>
              <option value="College Admin">College Admin</option>
            </select>
          </div>

          <button 
            type="submit" 
            disabled={loading}
            className="w-full py-2.5 rounded-xl bg-primary text-primary-foreground font-bold hover:opacity-90 transition-opacity flex items-center justify-center gap-1.5 mt-2"
          >
            {loading ? (
              <>
                <div className="w-3.5 h-3.5 border-2 border-t-transparent rounded-full animate-spin" />
                <span>Authenticating...</span>
              </>
            ) : (
              <>
                <span>Sign In Securely</span>
                <ArrowRight size={14} />
              </>
            )}
          </button>
        </form>

        {/* DEMO PROFILE PICKER (EXTREMELY USEFUL FOR PROTOTYPE) */}
        <div className="mt-8 pt-6 border-t border-border/40 space-y-3">
          <div className="flex items-center gap-1.5 text-[10px] font-bold text-muted-foreground uppercase tracking-wider">
            <UserCheck size={12} className="text-primary" />
            <span>Interactive Demo Auto-fill Profiles</span>
          </div>
          <div className="grid grid-cols-2 gap-2">
            {(['IQAC Coordinator', 'Principal', 'HOD', 'Faculty', 'College Admin'] as UserRole[]).map((r) => (
              <button
                key={r}
                onClick={() => handleDemoAutofill(r)}
                className="p-2 text-[10px] text-left font-semibold border border-border/30 rounded-xl bg-muted/40 hover:bg-muted transition-colors flex items-center justify-between"
              >
                <span>{r}</span>
                <ArrowRight size={10} className="text-muted-foreground" />
              </button>
            ))}
          </div>
        </div>
      </motion.div>
    </div>
  );
}
