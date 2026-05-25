'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { 
  ResponsiveContainer, 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  Tooltip, 
  CartesianGrid,
  BarChart,
  Bar
} from 'recharts';
import { 
  GraduationCap, 
  TrendingUp, 
  Briefcase, 
  Heart, 
  Award, 
  Users,
  AlertCircle
} from 'lucide-react';

const placementTimeline = [
  { year: '2022', rate: 0, avgSalary: 0 },
  { year: '2023', rate: 0, avgSalary: 0 },
  { year: '2024', rate: 0, avgSalary: 0 },
  { year: '2025', rate: 0, avgSalary: 0 },
  { year: '2026 (Proj.)', rate: 0, avgSalary: 0 },
];

const satisfactionMetrics = [
  { aspect: 'Teaching & Curriculum', rating: 0 },
  { aspect: 'Infrastructure & Labs', rating: 0 },
  { aspect: 'Library & E-Resources', rating: 0 },
  { aspect: 'Hostel & Amenities', rating: 0 },
  { aspect: 'Placement Assistance', rating: 0 },
];

const demographicData = [
  { category: 'Within State', value: 0 },
  { category: 'Other States', value: 0 },
  { category: 'International', value: 0 },
  { category: 'Scholarship Recip.', value: 0 },
];

export default function StudentAnalytics() {
  return (
    <div className="space-y-6">
      {/* HEADER */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-xl font-bold">Student Analytics & Progression</h1>
          <p className="text-xs text-muted-foreground">Criterion 5.1 (Student Support) and Criterion 5.2 (Student Progression & Placements)</p>
        </div>
      </div>

      {/* STATS */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="glass-card p-5 rounded-2xl flex items-center justify-between">
          <div className="space-y-1">
            <span className="text-xs text-muted-foreground">Total Enrollment</span>
            <div className="text-2xl font-bold">0</div>
          </div>
          <div className="w-10 h-10 rounded-xl bg-blue-500/10 dark:bg-blue-500/20 flex items-center justify-center text-blue-500">
            <Users size={20} />
          </div>
        </div>

        <div className="glass-card p-5 rounded-2xl flex items-center justify-between">
          <div className="space-y-1">
            <span className="text-xs text-muted-foreground">Placement Rate</span>
            <div className="text-2xl font-bold">0%</div>
          </div>
          <div className="w-10 h-10 rounded-xl bg-emerald-500/10 dark:bg-emerald-500/20 flex items-center justify-center text-emerald-500">
            <Briefcase size={20} />
          </div>
        </div>

        <div className="glass-card p-5 rounded-2xl flex items-center justify-between">
          <div className="space-y-1">
            <span className="text-xs text-muted-foreground">Avg Salary Package</span>
            <div className="text-2xl font-bold">INR 0.0 LPA</div>
          </div>
          <div className="w-10 h-10 rounded-xl bg-indigo-500/10 dark:bg-indigo-500/20 flex items-center justify-center text-indigo-500">
            <TrendingUp size={20} />
          </div>
        </div>

        <div className="glass-card p-5 rounded-2xl flex items-center justify-between">
          <div className="space-y-1">
            <span className="text-xs text-muted-foreground">Satisfaction Index</span>
            <div className="text-2xl font-bold">0.00 / 5.0</div>
          </div>
          <div className="w-10 h-10 rounded-xl bg-purple-500/10 dark:bg-purple-500/20 flex items-center justify-center text-purple-500">
            <Heart size={20} />
          </div>
        </div>
      </div>

      {/* PLACEMENT AREA CHART */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* PLACEMENT PLOTS */}
        <div className="glass-card p-5 rounded-2xl lg:col-span-2 flex flex-col justify-between">
          <div className="border-b border-border/40 pb-3 mb-3">
            <h3 className="font-bold text-sm flex items-center gap-2">
              <Briefcase size={16} className="text-primary" />
              Annual Placement Trends & Package Growth
            </h3>
            <p className="text-[10px] text-muted-foreground">Year-over-Year Progression statistics mapped to Criterion 5.2</p>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={placementTimeline} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorRate" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#2563eb" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#2563eb" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(148, 163, 184, 0.1)" />
                <XAxis dataKey="year" fontSize={11} tickLine={false} axisLine={false} />
                <YAxis fontSize={11} tickLine={false} axisLine={false} />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: 'hsl(var(--popover))', 
                    borderColor: 'hsl(var(--border))', 
                    borderRadius: '8px',
                    fontSize: '11px' 
                  }} 
                />
                <Area type="monotone" dataKey="rate" name="Placement Rate %" stroke="#2563eb" fillOpacity={1} fill="url(#colorRate)" strokeWidth={2} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* DEMOGRAPHICS & DIVERSITY */}
        <div className="glass-card p-5 rounded-2xl flex flex-col justify-between">
          <div className="border-b border-border/40 pb-3 mb-3">
            <h3 className="font-bold text-sm flex items-center gap-2">
              <Award size={16} className="text-primary" />
              Institutional Support & Diversity
            </h3>
            <p className="text-[10px] text-muted-foreground">Student profiling numbers for Criterion 5.1 & 7.1</p>
          </div>

          <div className="space-y-4">
            {demographicData.map((data, idx) => (
              <div key={idx} className="flex justify-between items-center p-3 bg-muted/40 border border-border/20 rounded-xl">
                <div>
                  <div className="text-xs font-semibold text-foreground">{data.category}</div>
                  <div className="text-[10px] text-muted-foreground mt-0.5">Accreditation Record Map</div>
                </div>
                <div className="text-sm font-bold text-primary">{data.value}</div>
              </div>
            ))}
          </div>

          <div className="p-3 bg-blue-500/5 border border-blue-500/10 rounded-xl flex gap-2 text-[10px] text-muted-foreground leading-normal mt-3">
            <AlertCircle size={14} className="text-blue-500 shrink-0 mt-0.5" />
            <span>Scholarship documents (Criterion 5.1.1) verified via state database integration.</span>
          </div>
        </div>

      </div>

      {/* SENTIMENT / SURVEY SECTION */}
      <div className="glass-card p-6 rounded-2xl">
        <div className="border-b border-border/40 pb-4 mb-4">
          <h3 className="font-bold text-sm">Criterion 2.7: Student Satisfaction Survey (SSS)</h3>
          <p className="text-[10px] text-muted-foreground">Aggregate feedback percentages across core criteria variables</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
          {satisfactionMetrics.map((sm, idx) => (
            <div key={idx} className="p-4 bg-muted/40 border border-border/30 rounded-xl text-center space-y-3">
              <div className="text-xs font-bold text-foreground line-clamp-1">{sm.aspect}</div>
              <div className="relative w-20 h-20 mx-auto flex items-center justify-center">
                <svg className="w-full h-full transform -rotate-90">
                  <circle cx="40" cy="40" r="34" className="stroke-muted fill-transparent" strokeWidth="6" />
                  <circle 
                    cx="40" 
                    cy="40" 
                    r="34" 
                    className="stroke-primary fill-transparent" 
                    strokeWidth="6" 
                    strokeDasharray={213}
                    strokeDashoffset={213 - (213 * sm.rating) / 100}
                    strokeLinecap="round"
                  />
                </svg>
                <span className="absolute text-xs font-extrabold">{sm.rating}%</span>
              </div>
              <div className="text-[10px] font-semibold text-muted-foreground">Score: {(sm.rating / 20).toFixed(1)} / 5.0</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
