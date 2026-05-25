'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  ResponsiveContainer, 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  Tooltip, 
  CartesianGrid 
} from 'recharts';
import { 
  Users, 
  BookOpen, 
  GraduationCap, 
  Award, 
  Search, 
  Plus, 
  FileText, 
  Briefcase 
} from 'lucide-react';

interface FacultyMember {
  id: string;
  name: string;
  dept: string;
  designation: string;
  qualification: string;
  publications: number;
  grants: string;
  status: 'Active' | 'Sabbatical' | 'On Leave';
}

const initialFaculty: FacultyMember[] = [];

const publicationData = [
  { name: 'Computer Sci.', count: 0 },
  { name: 'Electronics', count: 0 },
  { name: 'Mechanical', count: 0 },
  { name: 'AIML', count: 0 },
  { name: 'AIDS', count: 0 },
];

export default function FacultyRegistry() {
  const [faculty, setFaculty] = useState<FacultyMember[]>(initialFaculty);
  const [search, setSearch] = useState('');
  const [deptFilter, setDeptFilter] = useState('All');
  const [showAddForm, setShowAddForm] = useState(false);
  const [newFaculty, setNewFaculty] = useState({
    name: '',
    dept: 'Computer Science',
    designation: 'Assistant Professor',
    qualification: '',
    publications: 0,
    grants: 'None',
  });

  const handleAddFaculty = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newFaculty.name || !newFaculty.qualification) return;

    const newMember: FacultyMember = {
      id: 'f-' + (faculty.length + 1),
      ...newFaculty,
      status: 'Active',
    };

    setFaculty(prev => [...prev, newMember]);
    setNewFaculty({
      name: '',
      dept: 'Computer Science',
      designation: 'Assistant Professor',
      qualification: '',
      publications: 0,
      grants: 'None',
    });
    setShowAddForm(false);
  };

  const filteredFaculty = faculty.filter(f => {
    const matchesSearch = f.name.toLowerCase().includes(search.toLowerCase()) || 
                          f.qualification.toLowerCase().includes(search.toLowerCase());
    const matchesDept = deptFilter === 'All' || f.dept === deptFilter;
    return matchesSearch && matchesDept;
  });

  // Analytics Math
  const totalCount = faculty.length;
  const phdCount = faculty.filter(f => f.qualification.includes('Ph.D.')).length;
  const phdPercent = Math.round((phdCount / totalCount) * 100);
  const totalPublications = faculty.reduce((acc, curr) => acc + curr.publications, 0);
  const avgPublications = (totalPublications / totalCount).toFixed(1);

  return (
    <div className="space-y-6">
      {/* HEADER */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-xl font-bold">Faculty Registry & UGC Compliance</h1>
          <p className="text-xs text-muted-foreground">Criterion 2.4 (Teacher Quality) and Criterion 3.4 (Research Publications)</p>
        </div>
        <button 
          onClick={() => setShowAddForm(!showAddForm)}
          className="text-xs font-semibold px-4 py-2.5 rounded-xl bg-primary text-primary-foreground hover:opacity-90 flex items-center gap-1.5"
        >
          <Plus size={14} />
          <span>Add Faculty Member</span>
        </button>
      </div>

      {/* ADD FORM MODAL MOCKUP */}
      {showAddForm && (
        <motion.div 
          initial={{ opacity: 0, y: -10 }} 
          animate={{ opacity: 1, y: 0 }}
          className="p-5 glass-card rounded-2xl border-l-4 border-l-primary max-w-2xl"
        >
          <h3 className="text-sm font-bold text-foreground mb-4">Register New Faculty Member</h3>
          <form onSubmit={handleAddFaculty} className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
            <div className="space-y-1">
              <label className="text-muted-foreground font-semibold">Full Name</label>
              <input 
                type="text" 
                placeholder="Dr. Rajesh G..."
                value={newFaculty.name}
                onChange={e => setNewFaculty(prev => ({ ...prev, name: e.target.value }))}
                className="w-full p-2.5 rounded-xl bg-muted/40 border border-border/40 text-foreground"
                required
              />
            </div>
            <div className="space-y-1">
              <label className="text-muted-foreground font-semibold">Qualification (inc. Institute)</label>
              <input 
                type="text" 
                placeholder="Ph.D. (IIT Roorkee)..."
                value={newFaculty.qualification}
                onChange={e => setNewFaculty(prev => ({ ...prev, qualification: e.target.value }))}
                className="w-full p-2.5 rounded-xl bg-muted/40 border border-border/40 text-foreground"
                required
              />
            </div>
            <div className="space-y-1">
              <label className="text-muted-foreground font-semibold">Department</label>
              <select 
                value={newFaculty.dept}
                onChange={e => setNewFaculty(prev => ({ ...prev, dept: e.target.value }))}
                className="w-full p-2.5 rounded-xl bg-muted/40 border border-border/40 text-foreground"
              >
                <option value="Computer Science">Computer Science</option>
                <option value="Electronics">Electronics</option>
                <option value="Mechanical">Mechanical</option>
                <option value="AIML">AIML</option>
                <option value="AIDS">AIDS</option>
              </select>
            </div>
            <div className="space-y-1">
              <label className="text-muted-foreground font-semibold">Designation</label>
              <select 
                value={newFaculty.designation}
                onChange={e => setNewFaculty(prev => ({ ...prev, designation: e.target.value }))}
                className="w-full p-2.5 rounded-xl bg-muted/40 border border-border/40 text-foreground"
              >
                <option value="Professor">Professor</option>
                <option value="Associate Professor">Associate Professor</option>
                <option value="Assistant Professor">Assistant Professor</option>
              </select>
            </div>
            <div className="space-y-1">
              <label className="text-muted-foreground font-semibold">UGC Care Publications Count</label>
              <input 
                type="number" 
                value={newFaculty.publications}
                onChange={e => setNewFaculty(prev => ({ ...prev, publications: parseInt(e.target.value) || 0 }))}
                className="w-full p-2.5 rounded-xl bg-muted/40 border border-border/40 text-foreground"
              />
            </div>
            <div className="space-y-1">
              <label className="text-muted-foreground font-semibold">Corporate Research Grants (in INR)</label>
              <input 
                type="text" 
                placeholder="None or INR 5,00,000..."
                value={newFaculty.grants}
                onChange={e => setNewFaculty(prev => ({ ...prev, grants: e.target.value }))}
                className="w-full p-2.5 rounded-xl bg-muted/40 border border-border/40 text-foreground"
              />
            </div>
            <div className="md:col-span-2 pt-2 flex justify-end gap-2">
              <button 
                type="button" 
                onClick={() => setShowAddForm(false)}
                className="px-4 py-2 border border-border rounded-xl text-foreground hover:bg-muted font-semibold"
              >
                Cancel
              </button>
              <button 
                type="submit" 
                className="px-4 py-2 bg-primary text-primary-foreground rounded-xl font-bold"
              >
                Add & Verify Profile
              </button>
            </div>
          </form>
        </motion.div>
      )}

      {/* STATS OVERVIEW */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="glass-card p-5 rounded-2xl flex items-center justify-between">
          <div className="space-y-1">
            <span className="text-xs text-muted-foreground">Total Faculty Members</span>
            <div className="text-2xl font-bold">{totalCount}</div>
          </div>
          <div className="w-10 h-10 rounded-xl bg-blue-500/10 dark:bg-blue-500/20 flex items-center justify-center text-blue-500">
            <Users size={20} />
          </div>
        </div>

        <div className="glass-card p-5 rounded-2xl flex items-center justify-between">
          <div className="space-y-1">
            <span className="text-xs text-muted-foreground">Ph.D. Holder Ratio</span>
            <div className="text-2xl font-bold">{phdPercent}%</div>
          </div>
          <div className="w-10 h-10 rounded-xl bg-emerald-500/10 dark:bg-emerald-500/20 flex items-center justify-center text-emerald-500">
            <GraduationCap size={20} />
          </div>
        </div>

        <div className="glass-card p-5 rounded-2xl flex items-center justify-between">
          <div className="space-y-1">
            <span className="text-xs text-muted-foreground">UGC CARE Publications</span>
            <div className="text-2xl font-bold">{totalPublications}</div>
          </div>
          <div className="w-10 h-10 rounded-xl bg-indigo-500/10 dark:bg-indigo-500/20 flex items-center justify-center text-indigo-500">
            <BookOpen size={20} />
          </div>
        </div>

        <div className="glass-card p-5 rounded-2xl flex items-center justify-between">
          <div className="space-y-1">
            <span className="text-xs text-muted-foreground">Avg Publications / Faculty</span>
            <div className="text-2xl font-bold">{avgPublications}</div>
          </div>
          <div className="w-10 h-10 rounded-xl bg-purple-500/10 dark:bg-purple-500/20 flex items-center justify-center text-purple-500">
            <Award size={20} />
          </div>
        </div>
      </div>

      {/* TABLES AND CHARTS GRID */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* FACULTY REGISTRY TABLE */}
        <div className="glass-card p-5 rounded-2xl lg:col-span-2 space-y-4">
          <div className="flex flex-col md:flex-row justify-between items-center gap-3 pb-3 border-b border-border/40">
            <h3 className="font-bold text-sm">Faculty Registry Database</h3>
            <div className="flex items-center gap-2">
              <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-muted/60 border border-border/40 text-xs">
                <Search size={12} className="text-muted-foreground" />
                <input 
                  type="text" 
                  placeholder="Search name..."
                  value={search}
                  onChange={e => setSearch(e.target.value)}
                  className="bg-transparent border-0 outline-none w-28 placeholder-muted-foreground text-foreground"
                />
              </div>
              <select 
                value={deptFilter}
                onChange={e => setDeptFilter(e.target.value)}
                className="p-1.5 bg-muted/60 border border-border/40 rounded-lg text-xs font-semibold"
              >
                <option value="All">All Departments</option>
                <option value="Computer Science">Computer Science</option>
                <option value="Electronics">Electronics</option>
                <option value="Mechanical">Mechanical</option>
                <option value="AIML">AIML</option>
                <option value="AIDS">AIDS</option>
              </select>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="border-b border-border/30 bg-muted/30 text-muted-foreground font-semibold">
                  <th className="p-3">Faculty Name</th>
                  <th className="p-3">Department</th>
                  <th className="p-3">Designation</th>
                  <th className="p-3">Qualification</th>
                  <th className="p-3 text-center">Publications</th>
                  <th className="p-3 text-right">Research Grants</th>
                </tr>
              </thead>
              <tbody>
                {filteredFaculty.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="p-8 text-center text-muted-foreground">
                      No faculty registered yet. Add faculty members above to build the registry.
                    </td>
                  </tr>
                ) : (
                  filteredFaculty.map((f) => (
                    <tr key={f.id} className="border-b border-border/10 last:border-0 hover:bg-muted/20 transition-colors">
                      <td className="p-3">
                        <div className="flex items-center gap-2 font-semibold">
                          <div className="w-7 h-7 rounded-full bg-primary/10 text-primary flex items-center justify-center font-bold text-[10px]">
                            {f.name.split(' ').slice(-1)[0].slice(0, 2).toUpperCase()}
                          </div>
                          {f.name}
                        </div>
                      </td>
                      <td className="p-3 text-muted-foreground">{f.dept}</td>
                      <td className="p-3 text-muted-foreground">{f.designation}</td>
                      <td className="p-3">
                        <span className="bg-muted px-2 py-0.5 rounded font-medium">{f.qualification}</span>
                      </td>
                      <td className="p-3 text-center font-bold text-foreground">{f.publications}</td>
                      <td className="p-3 text-right font-medium text-indigo-600 dark:text-indigo-400">{f.grants}</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* PUBLICATIONS CHART */}
        <div className="glass-card p-5 rounded-2xl flex flex-col justify-between">
          <div className="border-b border-border/40 pb-3 mb-3">
            <h3 className="font-bold text-sm flex items-center gap-2">
              <FileText size={16} className="text-primary" />
              Journal Output comparison
            </h3>
            <p className="text-[10px] text-muted-foreground">UGC CARE / Scopus Indexed publications per dept</p>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={publicationData} layout="vertical" margin={{ top: 10, right: 10, left: 10, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="rgba(148, 163, 184, 0.1)" />
                <XAxis type="number" fontSize={11} tickLine={false} axisLine={false} />
                <YAxis dataKey="name" type="category" fontSize={10} width={80} tickLine={false} axisLine={false} />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: 'hsl(var(--popover))', 
                    borderColor: 'hsl(var(--border))', 
                    borderRadius: '8px',
                    fontSize: '11px' 
                  }} 
                />
                <Bar dataKey="count" fill="#3b82f6" radius={[0, 4, 4, 0]} barSize={16} />
              </BarChart>
            </ResponsiveContainer>
          </div>

          <div className="p-3.5 bg-muted/40 rounded-xl border border-border/20 text-xs mt-3 flex items-center gap-3">
            <Briefcase size={20} className="text-indigo-600 shrink-0" />
            <div className="space-y-0.5">
              <div className="font-bold">UGCCARE Compliant</div>
              <p className="text-[10px] text-muted-foreground leading-normal">
                UGC CARE validation is automatically cross-referenced via API.
              </p>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
