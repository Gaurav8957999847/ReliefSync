import React, { useState, useEffect } from 'react';
import Layout from '../layouts/Layout';
import api from '../api/axios';
import { toast } from 'react-hot-toast';
import { ClipboardList, MapPin, Loader2, Activity, CheckCircle, ChevronRight, Play } from 'lucide-react';
import Button from '../components/ui/Button';

const statusConfig = {
  pending:     { label: 'Pending Dispatch',     cls: 'bg-slate-50 text-slate-600 border-slate-200' },
  assigned:    { label: 'Units Assigned',       cls: 'bg-blue-50  text-blue-700  border-blue-200'  },
  in_progress: { label: 'Mission Active',       cls: 'bg-teal-50  text-teal-700 border-teal-200' },
  completed:   { label: 'Mission Accomplished', cls: 'bg-emerald-50 text-emerald-700 border-emerald-200' },
};

export default function Assignments() {
  const [assignments, setAssignments] = useState([]);
  const [loading, setLoading]         = useState(true);
  const [updating, setUpdating]       = useState(null);

  const fetchAssignments = async () => {
    try {
      const res = await api.get('/assignments');
      setAssignments(Array.isArray(res.data.data) ? res.data.data : []);
    } catch {
      toast.error('Failed to load assignments.');
      setAssignments([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchAssignments(); }, []);

  const updateStatus = async (id, status) => {
    setUpdating(id + status);
    try {
      await api.put(`/assignments/${id}/status`, { status });
      toast.success(`Mission status updated: ${statusConfig[status]?.label || status}`);
      fetchAssignments();
    } catch {
      toast.error('Failed to update status.');
    } finally {
      setUpdating(null);
    }
  };

  return (
    <Layout>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Mission Assignments</h1>
        <p className="text-slate-500 text-sm mt-1">{assignments.length} total operations logged.</p>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-20">
          <Loader2 size={32} className="animate-spin text-teal-600" />
        </div>
      ) : assignments.length === 0 ? (
        <div className="bg-white rounded-xl border border-slate-200 text-center py-24 shadow-sm-soft">
          <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-4 border border-slate-100">
            <ClipboardList size={32} className="text-slate-400" />
          </div>
          <h3 className="text-lg font-bold text-slate-900 mb-1">No active operations</h3>
          <p className="text-slate-500 text-sm mb-6 max-w-sm mx-auto">Use AI Matching to assign operative volunteers to active field emergencies.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {assignments.map((a) => {
            const sc = statusConfig[a.status] || statusConfig.pending;
            return (
              <div key={a._id} className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm-soft hover:shadow-card transition-shadow">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">

                  {/* Left: volunteer + need */}
                  <div className="flex items-center gap-4 flex-1 min-w-0">
                    <div className="w-12 h-12 rounded-lg bg-slate-100 border border-slate-200 text-slate-700 flex items-center justify-center font-bold text-lg flex-shrink-0">
                      {(a.volunteerId?.name || 'V').charAt(0).toUpperCase()}
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="font-bold text-slate-900 text-base mb-0.5 truncate">{a.volunteerId?.name || 'Unknown Operative'}</p>
                      <p className="text-slate-500 text-sm font-medium truncate mb-2">Deployed to: <span className="text-slate-700">{a.needId?.title || 'Unknown Mission Target'}</span></p>

                      <div className="flex flex-wrap items-center gap-2.5">
                        {a.needId?.extractedData?.location && (
                          <span className="flex items-center gap-1.5 text-xs font-medium text-slate-600 bg-slate-50 px-2.5 py-1 rounded border border-slate-200">
                            <MapPin size={12} className="text-slate-400" />
                            {a.needId.extractedData.location}
                          </span>
                        )}
                        <span className={`inline-flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1 rounded border ${sc.cls}`}>
                          {a.status === 'in_progress' && <Activity size={12} className="text-teal-600" />}
                          {sc.label}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Right: actions */}
                  <div className="flex items-center gap-3 flex-shrink-0 md:ml-4">
                    {a.status === 'assigned' && (
                      <Button
                        variant="primary"
                        size="md"
                        loading={updating === a._id + 'in_progress'}
                        onClick={() => updateStatus(a._id, 'in_progress')}
                      >
                        <Play size={14} />
                        Launch Mission
                      </Button>
                    )}
                    {a.status === 'in_progress' && (
                      <Button
                        variant="emerald"
                        size="md"
                        loading={updating === a._id + 'completed'}
                        onClick={() => updateStatus(a._id, 'completed')}
                      >
                        <CheckCircle size={16} />
                        Complete
                      </Button>
                    )}
                    {a.status === 'completed' && (
                      <span className="flex items-center gap-1.5 text-sm font-semibold text-emerald-600 px-2 py-2">
                        <CheckCircle size={16} />
                        Mission Successful
                      </span>
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
