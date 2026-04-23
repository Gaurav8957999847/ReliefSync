import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Layout from '../layouts/Layout';
import api from '../api/axios';
import { toast } from 'react-hot-toast';
import {
  Users, HeartPulse, ClipboardList, AlertTriangle,
  TrendingUp, Zap, ArrowUpRight, RefreshCw, ShieldCheck, Activity
} from 'lucide-react';
import Button from '../components/ui/Button';

const StatCard = ({ title, value, icon: Icon, colorClass, sub }) => (
  <div className="bg-white rounded-xl border border-slate-200 p-5 flex flex-col hover:border-slate-300 transition-colors shadow-sm-soft">
    <div className="flex items-start justify-between mb-4">
      <div className={`w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0 ${colorClass}`}>
        <Icon size={20} />
      </div>
    </div>
    
    <div className="mt-auto">
      <p className="text-sm font-semibold text-slate-500 mb-1">{title}</p>
      <p className="text-3xl font-bold text-slate-900 tracking-tight">{value}</p>
      {sub && <p className="text-sm font-medium text-slate-500 mt-2">{sub}</p>}
    </div>
  </div>
);

export default function Dashboard() {
  const navigate = useNavigate();
  const [stats, setStats] = useState({
    totalNeeds: '—', criticalNeeds: '—', activeAssignments: '—', totalVolunteers: '—',
  });
  const [loading, setLoading] = useState(true);

  const fetchStats = async () => {
    setLoading(true);
    try {
      const [overview, critical, active, volStats] = await Promise.all([
        api.get('/dashboard/overview'),
        api.get('/dashboard/critical-needs'),
        api.get('/dashboard/active-assignments'),
        api.get('/dashboard/volunteer-stats'),
      ]);
      setStats({
        totalNeeds:        overview.data.data?.totalNeeds        ?? 0,
        criticalNeeds:     critical.data.count                   ?? 0,
        activeAssignments: active.data.count                     ?? 0,
        totalVolunteers:   volStats.data.data?.total             ?? 0,
      });
    } catch {
      toast.error('Could not load dashboard data.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchStats(); }, []);

  return (
    <Layout>
      {/* Page header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Dashboard</h1>
          <p className="text-slate-500 text-sm mt-1">Overview of your NGO field operations.</p>
        </div>
        <Button variant="secondary" size="sm" onClick={fetchStats}>
          <RefreshCw size={14} className={loading ? 'animate-spin' : ''} />
          {loading ? 'Syncing...' : 'Sync Data'}
        </Button>
      </div>

      {/* Stat cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-5 mb-6">
        <StatCard
          title="Total Needs"
          value={stats.totalNeeds}
          icon={HeartPulse}
          colorClass="bg-teal-50 text-teal-600 border border-teal-100"
          sub="Open field incidents"
        />
        <StatCard
          title="Critical Alerts"
          value={stats.criticalNeeds}
          icon={AlertTriangle}
          colorClass="bg-amber-50 text-amber-600 border border-amber-100"
          sub="Priority 1 emergencies"
        />
        <StatCard
          title="Active Missions"
          value={stats.activeAssignments}
          icon={ClipboardList}
          colorClass="bg-blue-50 text-blue-600 border border-blue-100"
          sub="Teams currently deployed"
        />
        <StatCard
          title="Network Strength"
          value={stats.totalVolunteers}
          icon={Users}
          colorClass="bg-slate-50 text-slate-600 border border-slate-200"
          sub="Registered volunteers"
        />
      </div>

      {/* Bottom row */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">

        {/* Overview card */}
        <div className="xl:col-span-2 bg-white border border-slate-200 rounded-xl p-8 shadow-sm-soft">
          <div className="flex items-center gap-2 mb-6">
            <TrendingUp size={18} className="text-teal-600" />
            <span className="text-sm font-semibold text-slate-700">Live Intelligence</span>
          </div>
          
          <h3 className="text-2xl font-bold text-slate-900 mb-3 tracking-tight">Global NGO Operations Overview</h3>
          <p className="text-slate-500 text-base leading-relaxed mb-8 max-w-2xl">
            ReliefSync monitors your field operations in real time. Use the matching engine to deploy the right volunteer to the right emergency automatically, ensuring efficient resource allocation.
          </p>
          
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 border-t border-slate-100 pt-8">
            {[
              { icon: Zap, label: 'AI Matching',  sub: 'Skill-based auto-routing', color: 'text-amber-500', bg: 'bg-amber-50 border border-amber-100' },
              { icon: ShieldCheck, label: 'Geo-Tracking', sub: 'Live unit mapping', color: 'text-emerald-600', bg: 'bg-emerald-50 border border-emerald-100' },
              { icon: Activity, label: 'Cloud Sync',   sub: 'Real-time state replication', color: 'text-blue-600', bg: 'bg-blue-50 border border-blue-100' },
            ].map((f, i) => (
              <div key={f.label} className="p-4 bg-slate-50 rounded-lg border border-slate-100">
                <div className={`w-8 h-8 rounded-md flex items-center justify-center mb-3 ${f.bg}`}>
                  <f.icon size={16} className={f.color} />
                </div>
                <p className="text-slate-900 text-sm font-semibold mb-1">{f.label}</p>
                <p className="text-slate-500 text-xs">{f.sub}</p>
              </div>
            ))}
          </div>
        </div>

        {/* CTA card */}
        <div className="bg-navy-900 rounded-xl p-8 flex flex-col text-white shadow-md">
          <div className="w-12 h-12 rounded-lg bg-teal-500 text-white flex items-center justify-center mb-6 shadow-sm">
            <Zap size={22} />
          </div>
          <h3 className="text-xl font-bold mb-2 tracking-tight">AI Matching Engine</h3>
          <p className="text-slate-300 text-sm leading-relaxed mb-8">
            Automatically match available volunteers to urgent field needs based on skills, location, and past performance metrics.
          </p>
          
          <div className="mt-auto space-y-3">
            <Button variant="teal" className="w-full justify-center bg-teal-500 hover:bg-teal-600 text-white border-0" onClick={() => navigate('/matching')}>
              Initialize Matching
              <ArrowUpRight size={16} />
            </Button>
            <Button variant="secondary" className="w-full justify-center bg-white/10 hover:bg-white/20 text-white border-0" onClick={() => navigate('/needs')}>
              Review Field Needs
            </Button>
          </div>
        </div>
      </div>
    </Layout>
  );
}
