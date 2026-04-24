import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import Layout from '../layouts/Layout';
import api from '../api/axios';
import { toast } from 'react-hot-toast';
import { MapPin, AlertCircle, ArrowRight, ShieldCheck, Cpu, Loader2, CheckCircle } from 'lucide-react';
import Button from '../components/ui/Button';

export default function Matching() {
  const [searchParams]                      = useSearchParams();
  const needId                              = searchParams.get('needId');
  const navigate                            = useNavigate();
  const [recommendations, setRecommendations] = useState([]);
  const [loading, setLoading]               = useState(false);
  const [assigning, setAssigning]           = useState(null);
  const [needCompleted, setNeedCompleted]   = useState(false);

  useEffect(() => {
    if (!needId) return;
    setLoading(true);
    setNeedCompleted(false);
    Promise.all([
      api.get(`/needs/${needId}`).catch(() => ({ data: {} })),
      api.get(`/matching/needs/${needId}/recommendations`).catch(() => ({ data: {} })),
    ])
      .then(([needRes, matchRes]) => {
        const need = needRes.data?.data;
        if (need?.status === 'completed') setNeedCompleted(true);
        const recs = matchRes.data?.recommendations;
        setRecommendations(Array.isArray(recs) ? recs : []);
      })
      .catch(() => toast.error('AI analysis failed.'))
      .finally(() => setLoading(false));
  }, [needId]);

  const handleAssign = async (volunteerId) => {
    setAssigning(volunteerId);
    try {
      await api.post('/assignments', { volunteerId, needId });
      toast.success('Volunteer assigned successfully!');
      navigate('/assignments');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Assignment failed.');
    } finally {
      setAssigning(null);
    }
  };

  return (
    <Layout>
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">AI Operative Matching</h1>
          <p className="text-slate-500 text-sm mt-1">Intelligent skill-based routing for field deployment.</p>
        </div>
        {needId && (
          <Button variant="secondary" size="sm" onClick={() => navigate('/needs')}>
            Change Target Mission
          </Button>
        )}
      </div>

      {/* No need selected */}
      {!needId && (
        <div className="bg-white rounded-xl border border-slate-200 p-16 text-center shadow-sm-soft">
          <div className="w-16 h-16 bg-teal-50 border border-teal-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <Cpu size={32} className="text-teal-600" />
          </div>
          <h2 className="text-xl font-bold text-slate-900 mb-2">System Standby</h2>
          <p className="text-slate-500 text-sm max-w-md mx-auto mb-8">
            Select an active emergency from the Field Needs sector to initialize the intelligent matching algorithm.
          </p>
          <Button variant="primary" size="md" onClick={() => navigate('/needs')}>
            Browse Field Needs
            <ArrowRight size={16} className="ml-1" />
          </Button>
        </div>
      )}

      {/* Loading */}
      {needId && loading && (
        <div className="bg-white rounded-xl border border-slate-200 flex flex-col items-center justify-center py-24 shadow-sm-soft">
          <Loader2 size={32} className="animate-spin text-teal-600 mb-4" />
          <h3 className="text-lg font-bold text-slate-900 mb-1">Processing Analysis</h3>
          <p className="text-slate-500 text-sm">Cross-referencing skill profiles and availability...</p>
        </div>
      )}

      {/* Results */}
      {needId && !loading && (
        <>
          {needCompleted && (
            <div className="mb-6 flex items-start gap-3 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-900">
              <CheckCircle size={20} className="text-emerald-600 shrink-0 mt-0.5" />
              <div>
                <p className="font-semibold">This mission is completed</p>
                <p className="text-emerald-800/90 mt-0.5">Volunteer dispatch is closed for this need. You can still review past match scores below.</p>
              </div>
            </div>
          )}
          {recommendations.length === 0 ? (
            <div className="bg-white rounded-xl border border-slate-200 text-center py-24 shadow-sm-soft">
              <div className="w-16 h-16 bg-amber-50 rounded-full flex items-center justify-center mx-auto mb-4 border border-amber-100">
                <AlertCircle size={32} className="text-amber-500" />
              </div>
              <h3 className="text-lg font-bold text-slate-900 mb-1">Zero Operative Matches</h3>
              <p className="text-slate-500 text-sm mb-6 max-w-sm mx-auto">No available personnel meet the required skill parameters for this mission.</p>
              <Button variant="secondary" onClick={() => navigate('/volunteers')}>
                Recruit Personnel
              </Button>
            </div>
          ) : (
            <div>
              <div className="flex items-center gap-4 mb-6">
                <div className="h-px flex-1 bg-slate-200" />
                <p className="text-sm font-semibold text-slate-500">
                  Found <span className="text-slate-900">{recommendations.length}</span> Compatible Operatives
                </p>
                <div className="h-px flex-1 bg-slate-200" />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
                {recommendations.map((rec) => {
                  const v = rec.volunteer;
                  if (!v) return null;
                  const score = rec.matchScore ?? 0;
                  const isHigh = score >= 70;
                  
                  return (
                    <div key={v._id} className="bg-white rounded-xl border border-slate-200 shadow-sm-soft hover:shadow-card hover:border-slate-300 transition-all flex flex-col">
                      <div className="p-6 flex-1 flex flex-col">
                        
                        {/* Header */}
                        <div className="flex items-start justify-between mb-5">
                          <div className="flex items-center gap-3">
                            <div className="w-12 h-12 rounded-lg bg-slate-100 border border-slate-200 text-slate-700 flex items-center justify-center font-bold text-lg flex-shrink-0">
                              {(v.name || 'V').charAt(0).toUpperCase()}
                            </div>
                            <div>
                              <p className="font-bold text-slate-900 text-base">{v.name}</p>
                              <div className="flex items-center gap-1.5 text-xs text-slate-500 mt-0.5">
                                <MapPin size={12} className="text-slate-400" />
                                {v.location || 'Unknown'}
                              </div>
                            </div>
                          </div>
                          <div className="text-center">
                            <span className={`text-xl font-bold ${isHigh ? 'text-teal-600' : 'text-slate-700'}`}>
                              {score}%
                            </span>
                            <p className="text-[10px] uppercase tracking-wider text-slate-400 font-semibold mt-0.5">Match</p>
                          </div>
                        </div>

                        {/* Skills */}
                        {Array.isArray(v.skills) && v.skills.length > 0 && (
                          <div className="mb-5">
                            <p className="text-xs font-semibold text-slate-500 mb-2">Skill Profile</p>
                            <div className="flex flex-wrap gap-1.5">
                              {v.skills.map((s, i) => (
                                <span key={i} className="text-xs font-medium bg-slate-100 border border-slate-200 text-slate-700 px-2 py-0.5 rounded-md">{s}</span>
                              ))}
                            </div>
                          </div>
                        )}

                        {/* AI insight */}
                        {rec.matchedSkillsCount > 0 && (
                          <div className={`flex items-start gap-2.5 p-3 rounded-lg border mb-5 ${isHigh ? 'bg-teal-50 border-teal-100' : 'bg-slate-50 border-slate-200'}`}>
                            <ShieldCheck size={16} className={`mt-0.5 flex-shrink-0 ${isHigh ? 'text-teal-600' : 'text-slate-500'}`} />
                            <p className="text-sm text-slate-700 leading-snug">
                              Matches <span className="font-semibold">{rec.matchedSkillsCount} required skills</span> for this operation.
                            </p>
                          </div>
                        )}

                        <div className="mt-auto">
                          {needCompleted ? (
                            <div className="w-full text-center text-sm font-medium text-slate-500 py-3 rounded-lg border border-slate-200 bg-slate-50">
                              Dispatch unavailable — mission completed
                            </div>
                          ) : (
                            <Button
                              variant={isHigh ? 'teal' : 'secondary'}
                              className="w-full justify-center"
                              loading={assigning === v._id}
                              onClick={() => handleAssign(v._id)}
                            >
                              Dispatch Operative
                              <ArrowRight size={16} className="ml-1" />
                            </Button>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </>
      )}
    </Layout>
  );
}
