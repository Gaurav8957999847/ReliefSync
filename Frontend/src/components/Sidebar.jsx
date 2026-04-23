import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard, Users, HeartPulse, ClipboardList,
  Zap, FileText, LogOut, ShieldCheck
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const nav = [
  { label: 'Dashboard',   icon: LayoutDashboard, to: '/',            end: true },
  { label: 'Volunteers',  icon: Users,            to: '/volunteers' },
  { label: 'Field Needs', icon: HeartPulse,       to: '/needs' },
  { label: 'Assignments', icon: ClipboardList,    to: '/assignments' },
  { label: 'AI Matching', icon: Zap,              to: '/matching' },
  { label: 'Reports',     icon: FileText,         to: '/reports' },
];

export default function Sidebar() {
  const { logout, user } = useAuth();
  const navigate = useNavigate();

  return (
    <aside className="fixed inset-y-0 left-0 w-64 flex flex-col z-40 overflow-y-auto bg-navy-900 text-slate-300 border-r border-navy-800 shadow-xl">

      {/* Logo */}
      <div className="flex items-center gap-3 px-6 py-6 border-b border-white/10">
        <div className="w-9 h-9 rounded-lg bg-teal-500 flex items-center justify-center shadow-md flex-shrink-0">
          <ShieldCheck size={20} className="text-white" />
        </div>
        <div>
          <p className="text-white font-bold text-base leading-none tracking-tight">ReliefSync</p>
          <p className="text-teal-400 text-[10px] font-bold uppercase tracking-widest mt-1">AI Platform</p>
        </div>
      </div>

      {/* Nav */}
      <nav className="flex-1 px-4 py-6 space-y-1">
        <p className="px-3 text-xs font-semibold text-slate-500 uppercase tracking-wider mb-3">Main Menu</p>
        {nav.map(({ label, icon: Icon, to, end }) => (
          <NavLink
            key={to}
            to={to}
            end={end}
            className={({ isActive }) =>
              `flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                isActive
                  ? 'text-white bg-white/10'
                  : 'text-slate-400 hover:text-white hover:bg-white/5'
              }`
            }
          >
            {({ isActive }) => (
              <>
                <Icon size={18} className={isActive ? 'text-teal-400' : 'text-slate-500'} />
                {label}
              </>
            )}
          </NavLink>
        ))}
      </nav>

      {/* User + Logout */}
      <div className="px-4 py-4 border-t border-white/10 bg-navy-950/30">
        {/* System status */}
        <div className="flex items-center gap-2.5 px-3 py-2 mb-2">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-teal-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-teal-500"></span>
          </span>
          <span className="text-xs text-slate-400 font-medium">Systems Operational</span>
        </div>

        {/* User pill */}
        {user && (
          <div className="flex items-center gap-3 px-3 py-2.5 rounded-lg bg-white/5 mb-2 border border-white/5">
            <div className="w-8 h-8 rounded bg-teal-600 flex items-center justify-center text-white font-bold text-sm flex-shrink-0">
              {(user.name || 'U').charAt(0).toUpperCase()}
            </div>
            <div className="min-w-0">
              <p className="text-white text-sm font-semibold leading-none truncate">{user.name || 'Admin'}</p>
              <p className="text-slate-400 text-xs mt-1 truncate capitalize">{user.role || 'admin'}</p>
            </div>
          </div>
        )}

        <button
          onClick={() => { logout(); navigate('/login'); }}
          className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-slate-400 hover:text-white hover:bg-red-500/10 hover:text-red-400 transition-colors"
        >
          <LogOut size={16} />
          Sign out
        </button>
      </div>
    </aside>
  );
}
