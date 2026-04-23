import React from 'react';
import Sidebar from '../components/Sidebar';
import { useAuth } from '../context/AuthContext';
import { Bell, Search } from 'lucide-react';
import { useLocation } from 'react-router-dom';

export default function Layout({ children }) {
  const { user } = useAuth();
  const location = useLocation();

  return (
    <div className="flex min-h-screen bg-slate-50 text-slate-800">
      <Sidebar />

      {/* Main content — offset by sidebar width */}
      <div className="flex-1 ml-64 flex flex-col min-h-screen">

        {/* Top bar */}
        <header className="sticky top-0 z-30 bg-white border-b border-slate-200 flex items-center justify-between px-8 h-16 transition-all duration-200">
          <div className="flex-1 max-w-md hidden md:block">
            {/* Global search stub */}
            <div className="relative group">
              <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-teal-600 transition-colors" />
              <input 
                type="text" 
                placeholder="Search anything..." 
                className="w-full pl-10 pr-4 py-2 bg-slate-100/50 border border-transparent rounded-lg text-sm text-slate-800 placeholder:text-slate-500 outline-none focus:bg-white focus:border-teal-500 focus:ring-2 focus:ring-teal-500/20 transition-all duration-200 shadow-sm-soft"
              />
            </div>
          </div>
          <div className="flex items-center gap-5 ml-auto">
            <button className="relative p-2 rounded-lg text-slate-500 hover:text-slate-900 hover:bg-slate-100 transition-colors">
              <Bell size={18} />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-amber-500 rounded-full border-2 border-white"></span>
            </button>
            <div className="h-8 w-px bg-slate-200" />
            <div className="flex items-center gap-3 cursor-pointer group">
              <div className="text-right hidden sm:block">
                <p className="text-sm font-semibold text-slate-900 leading-none">{user?.name || 'Admin'}</p>
                <p className="text-xs text-slate-500 font-medium mt-1 capitalize">{user?.role || 'admin'}</p>
              </div>
              <div className="relative">
                <div className="w-9 h-9 rounded-lg bg-navy-900 flex items-center justify-center text-white font-bold text-sm shadow-sm group-hover:bg-navy-800 transition-colors">
                  {(user?.name || 'U').charAt(0).toUpperCase()}
                </div>
                <div className="absolute -bottom-1 -right-1 w-3.5 h-3.5 bg-emerald-500 border-2 border-white rounded-full" />
              </div>
            </div>
          </div>
        </header>

        {/* Page area — scrollable */}
        <main className="flex-1 overflow-y-auto p-8">
          <div className="max-w-7xl mx-auto h-full">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
