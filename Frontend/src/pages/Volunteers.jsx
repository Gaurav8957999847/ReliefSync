import React, { useState, useEffect } from 'react';
import Layout from '../layouts/Layout';
import api from '../api/axios';
import { toast } from 'react-hot-toast';
import {
  Plus, Search, MapPin, Phone, Mail, User, Users,
  Loader2, X, Activity, Filter
} from 'lucide-react';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';

const availabilityConfig = {
  available:     { label: 'Available',     cls: 'bg-emerald-50 text-emerald-700 border-emerald-200' },
  busy:          { label: 'Busy',          cls: 'bg-amber-50  text-amber-700  border-amber-200'  },
  on_assignment: { label: 'On Assignment', cls: 'bg-blue-50   text-blue-700   border-blue-200'   },
};

export default function Volunteers() {
  const [volunteers, setVolunteers] = useState([]);
  const [loading, setLoading]       = useState(true);
  const [showModal, setShowModal]   = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [search, setSearch]         = useState('');
  const [filterStatus, setFilterStatus] = useState('all');

  const [form, setForm] = useState({
    name: '', email: '', phone: '', skills: '', location: '',
  });

  const fetchVolunteers = async () => {
    try {
      const res = await api.get('/volunteers');
      setVolunteers(Array.isArray(res.data.data) ? res.data.data : []);
    } catch {
      toast.error('Failed to load volunteers.');
      setVolunteers([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchVolunteers(); }, []);

  const handleAdd = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const skills = form.skills.split(',').map((s) => s.trim()).filter(Boolean);
      await api.post('/volunteers', { ...form, skills });
      toast.success('Volunteer added successfully!');
      setShowModal(false);
      setForm({ name: '', email: '', phone: '', skills: '', location: '' });
      fetchVolunteers();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to add volunteer.');
    } finally {
      setSubmitting(false);
    }
  };

  const filtered = volunteers.filter((v) => {
    const q = search.toLowerCase();
    const matchSearch =
      (v.name  || '').toLowerCase().includes(q) ||
      (v.email || '').toLowerCase().includes(q) ||
      (Array.isArray(v.skills) ? v.skills : []).join(' ').toLowerCase().includes(q);
    const matchStatus = filterStatus === 'all' || v.availability === filterStatus;
    return matchSearch && matchStatus;
  });

  return (
    <Layout>
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Personnel Network</h1>
          <p className="text-slate-500 text-sm mt-1">{volunteers.length} operatives registered in the database.</p>
        </div>
        <Button variant="primary" onClick={() => setShowModal(true)}>
          <Plus size={16} /> Register Volunteer
        </Button>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl p-4 flex flex-col sm:flex-row gap-4 mb-6 shadow-sm-soft border border-slate-200">
        <div className="flex-1 relative">
          <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Search by name, email, or skill..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm text-slate-900 placeholder:text-slate-500 outline-none focus:bg-white focus:border-teal-500 focus:ring-2 focus:ring-teal-500/20 transition-all"
          />
        </div>
        <div className="relative sm:w-64">
          <Filter size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm font-medium text-slate-700 appearance-none outline-none focus:bg-white focus:border-teal-500 focus:ring-2 focus:ring-teal-500/20 transition-all cursor-pointer"
          >
            <option value="all">All Statuses</option>
            <option value="available">Available</option>
            <option value="busy">Busy / Unavailable</option>
            <option value="on_assignment">Currently Deployed</option>
          </select>
        </div>
      </div>

      {/* Content */}
      {loading ? (
        <div className="flex items-center justify-center py-20">
          <Loader2 size={32} className="animate-spin text-teal-600" />
        </div>
      ) : filtered.length === 0 ? (
        <div className="bg-white rounded-xl border border-slate-200 text-center py-24 shadow-sm-soft">
          <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-4 border border-slate-100">
            <Users size={28} className="text-slate-400" />
          </div>
          <h3 className="text-lg font-bold text-slate-900 mb-1">
            {volunteers.length === 0 ? 'Database Empty' : 'No matches found'}
          </h3>
          <p className="text-slate-500 text-sm mb-6 max-w-sm mx-auto">
            {volunteers.length === 0
              ? 'Initialize your network by registering the first volunteer.'
              : 'Try adjusting your search criteria.'}
          </p>
          {volunteers.length === 0 && (
            <Button variant="primary" onClick={() => setShowModal(true)}>
              <Plus size={16} /> Register First Volunteer
            </Button>
          )}
        </div>
      ) : (
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm-soft overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead>
                <tr className="border-b border-slate-200 bg-slate-50 text-slate-500">
                  <th className="px-6 py-4 font-semibold">Operative Name</th>
                  <th className="px-6 py-4 font-semibold">Contact Info</th>
                  <th className="px-6 py-4 font-semibold">Location</th>
                  <th className="px-6 py-4 font-semibold">Skills</th>
                  <th className="px-6 py-4 font-semibold">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filtered.map((v) => {
                  const av = availabilityConfig[v.availability] || availabilityConfig.available;
                  return (
                    <tr key={v._id} className="hover:bg-slate-50/80 transition-colors">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-9 h-9 rounded-lg bg-slate-100 border border-slate-200 text-slate-700 flex items-center justify-center font-bold text-sm flex-shrink-0">
                            {(v.name || '?').charAt(0).toUpperCase()}
                          </div>
                          <span className="font-semibold text-slate-900">{v.name || '—'}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <p className="text-slate-600">{v.email || '—'}</p>
                        {v.phone && <p className="text-slate-500 text-xs mt-1">{v.phone}</p>}
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-1.5 text-slate-600">
                          <MapPin size={14} className="text-slate-400" />
                          {v.location || '—'}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex flex-wrap gap-1.5">
                          {(Array.isArray(v.skills) ? v.skills : []).slice(0, 3).map((s, i) => (
                            <span key={i} className="bg-slate-100 border border-slate-200 text-slate-700 text-xs font-medium px-2 py-0.5 rounded-md">
                              {s}
                            </span>
                          ))}
                          {(Array.isArray(v.skills) ? v.skills : []).length > 3 && (
                            <span className="text-slate-500 text-xs font-medium py-0.5">
                              +{v.skills.length - 3}
                            </span>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`inline-flex items-center gap-1.5 text-xs font-medium px-2.5 py-1 rounded-md border ${av.cls}`}>
                          {v.availability === 'available' && <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />}
                          {v.availability === 'busy' && <Activity size={12} />}
                          {v.availability === 'on_assignment' && <Activity size={12} />}
                          {av.label}
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
          <div className="border-t border-slate-200 bg-slate-50 px-6 py-3">
            <p className="text-xs font-medium text-slate-500">Showing {filtered.length} of {volunteers.length} records</p>
          </div>
        </div>
      )}

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-modal w-full max-w-xl overflow-hidden border border-slate-200">
            <div className="flex items-center justify-between px-6 py-5 border-b border-slate-100">
              <div>
                <h2 className="text-xl font-bold text-slate-900 tracking-tight">Register Volunteer</h2>
                <p className="text-slate-500 text-sm mt-1">Add a new operative to the network.</p>
              </div>
              <button
                onClick={() => setShowModal(false)}
                className="w-8 h-8 rounded-lg flex items-center justify-center text-slate-400 hover:bg-slate-100 hover:text-slate-700 transition-colors"
              >
                <X size={20} />
              </button>
            </div>
            <form onSubmit={handleAdd} className="p-6 space-y-5">
              <div className="grid grid-cols-2 gap-5">
                <Input label="Full Name" icon={User} placeholder="Jane Smith" required
                  value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
                <Input label="Email Address" type="email" icon={Mail} placeholder="jane@org.ngo" required
                  value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
              </div>
              <div className="grid grid-cols-2 gap-5">
                <Input label="Phone Number" icon={Phone} placeholder="+91 98765 43210"
                  value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} />
                <Input label="Base Location" icon={MapPin} placeholder="Mumbai, India" required
                  value={form.location} onChange={(e) => setForm({ ...form, location: e.target.value })} />
              </div>
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1.5">
                  Skills <span className="font-normal text-slate-400">(comma separated)</span>
                </label>
                <textarea
                  rows={3}
                  placeholder="First Aid, Logistics, Rescue..."
                  required
                  value={form.skills}
                  onChange={(e) => setForm({ ...form, skills: e.target.value })}
                  className="w-full px-3.5 py-2.5 bg-white border border-slate-200 rounded-xl text-sm text-slate-800 placeholder:text-slate-400 font-medium resize-none outline-none focus:border-teal-500 focus:ring-2 focus:ring-teal-500/20 hover:border-slate-300 transition-all shadow-sm-soft"
                />
              </div>
              <div className="flex gap-3 pt-4">
                <Button variant="secondary" className="flex-1 justify-center" type="button"
                  onClick={() => setShowModal(false)}>
                  Cancel
                </Button>
                <Button variant="primary" className="flex-1 justify-center" type="submit" loading={submitting}>
                  Register Volunteer
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </Layout>
  );
}
