import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Layout from '../layouts/Layout';
import api from '../api/axios';
import { toast } from 'react-hot-toast';
import { AlertTriangle, MapPin, Loader2, Clock, Target, Search, ChevronRight, CheckCircle } from 'lucide-react';
import Button from '../components/ui/Button';

const priorityConfig = {
  critical: { cls: 'bg-red-50 text-red-700 border-red-200',    dot: 'bg-red-500' },
  high:     { cls: 'bg-amber-50 text-amber-700 border-amber-200', dot: 'bg-amber-500' },
  medium:   { cls: 'bg-blue-50 text-blue-700 border-blue-200',  dot: 'bg-blue-500' },
  low:      { cls: 'bg-slate-50 text-slate-700 border-slate-200', dot: 'bg-slate-500' },
};

export default function Needs() {
  const [needs, setNeeds]     = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch]   = useState('');
  const navigate              = useNavigate();

  useEffect(() => {
    (async () => {
      try {
        const res = await api.get('/needs');
        setNeeds(Array.isArray(res.data.data) ? res.data.data : []);
      } catch {
        toast.error('Failed to load field needs.');
        setNeeds([]);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const filtered = needs.filter((n) =>
    (n.title || '').toLowerCase().includes(search.toLowerCase()) ||
    (n.extractedData?.location || '').toLowerCase().includes(search.toLowerCase())
  );

  return (
    <Layout>
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Active Emergencies</h1>
          <p className="text-slate-500 text-sm mt-1">{needs.length} open requirements mapped from field intelligence.</p>
        </div>
        <div className="relative">
          <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Search incident or location..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-10 pr-4 py-2 bg-white border border-slate-200 rounded-lg text-sm font-medium text-slate-900 placeholder:text-slate-400 outline-none focus:border-teal-500 focus:ring-2 focus:ring-teal-500/20 hover:border-slate-300 transition-all shadow-sm-soft w-full sm:w-72"
          />
        </div>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-20">
          <Loader2 size={32} className="animate-spin text-teal-600" />
        </div>
      ) : filtered.length === 0 ? (
        <div className="bg-white rounded-xl border border-slate-200 text-center py-24 shadow-sm-soft">
          <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-4 border border-slate-100">
            <AlertTriangle size={32} className="text-slate-400" />
          </div>
          <h3 className="text-lg font-bold text-slate-900 mb-1">
            {needs.length === 0 ? 'No Active Operations' : 'No matches found'}
          </h3>
          <p className="text-slate-500 text-sm mb-6 max-w-sm mx-auto">
            {needs.length === 0
              ? 'Upload a field report to generate deployment requirements automatically.'
              : 'Try adjusting your search parameters.'}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
          {filtered.map((need) => {
            const p = priorityConfig[need.priority] || priorityConfig.low;
            return (
              <div key={need._id} className="bg-white rounded-xl border border-slate-200 shadow-sm-soft hover:shadow-card hover:border-slate-300 transition-all flex flex-col">
                <div className="p-6 flex-1 flex flex-col">
                  {/* Header */}
                  <div className="flex items-start justify-between gap-3 mb-4">
                    <span className={`inline-flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1 rounded-md border capitalize ${p.cls}`}>
                      <span className={`w-1.5 h-1.5 rounded-full ${p.dot}`} />
                      {need.priority || 'low'} Priority
                    </span>
                    <span className="text-xs font-medium text-slate-500 flex items-center gap-1.5">
                      <Clock size={12} className="text-slate-400" />
                      {new Date(need.createdAt).toLocaleDateString()}
                    </span>
                  </div>

                  {/* Title */}
                  <h3 className="font-bold text-slate-900 text-lg leading-tight mb-4 tracking-tight">
                    {need.title}
                  </h3>

                  {/* Details */}
                  <div className="space-y-3 mb-6 flex-1">
                    <div className="flex items-start gap-2.5 text-sm text-slate-600">
                      <MapPin size={16} className="text-slate-400 mt-0.5 flex-shrink-0" />
                      <span className="leading-snug">{need.extractedData?.location || 'Location not specified'}</span>
                    </div>
                    {need.extractedData?.requiredSkills?.length > 0 && (
                      <div className="flex items-start gap-2.5">
                        <Target size={16} className="text-slate-400 mt-0.5 flex-shrink-0" />
                        <div className="flex flex-wrap gap-1.5 mt-0.5">
                          {need.extractedData.requiredSkills.slice(0, 4).map((s, i) => (
                            <span key={i} className="text-xs font-medium bg-slate-100 border border-slate-200 text-slate-700 px-2 py-0.5 rounded-md">{s}</span>
                          ))}
                          {need.extractedData.requiredSkills.length > 4 && (
                            <span className="text-xs font-medium text-slate-500 py-0.5">+{need.extractedData.requiredSkills.length - 4}</span>
                          )}
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Action */}
                  <div className="pt-5 border-t border-slate-100 mt-auto">
                    {need.status === 'completed' ? (
                      <div className="flex items-center justify-center gap-2 py-2.5 rounded-lg bg-emerald-50 border border-emerald-100 text-emerald-800 text-sm font-semibold">
                        <CheckCircle size={18} className="text-emerald-600 shrink-0" />
                        Mission completed
                      </div>
                    ) : (
                      <Button
                        variant="primary"
                        size="md"
                        className="w-full justify-center"
                        onClick={() => navigate(`/matching?needId=${need._id}`)}
                      >
                        Find Volunteers
                        <ChevronRight size={16} className="ml-1" />
                      </Button>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </Layout>
  );
}
