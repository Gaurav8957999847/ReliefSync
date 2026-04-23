import React, { useState, useEffect } from 'react';
import Layout from '../layouts/Layout';
import api from '../api/axios';
import { toast } from 'react-hot-toast';
import {
  FileText, Upload, File, Loader2, Calendar,
  MessageSquare, X, ExternalLink, ChevronRight,
  ShieldCheck, Zap, Activity, Plus, Database
} from 'lucide-react';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';

export default function Reports() {
  const [reports, setReports]         = useState([]);
  const [loading, setLoading]         = useState(true);
  const [activeTab, setActiveTab]     = useState('list');
  const [reportType, setReportType]   = useState('text');
  const [selected, setSelected]       = useState(null);

  const [textTitle, setTextTitle]     = useState('');
  const [textContent, setTextContent] = useState('');
  const [pdfTitle, setPdfTitle]       = useState('');
  const [pdfFile, setPdfFile]         = useState(null);
  const [submitting, setSubmitting]   = useState(false);

  const fetchReports = async () => {
    setLoading(true);
    try {
      const res = await api.get('/reports');
      setReports(Array.isArray(res.data.data) ? res.data.data : []);
    } catch {
      toast.error('Failed to load reports.');
      setReports([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchReports(); }, []);

  const handleTextSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await api.post('/reports/text', { title: textTitle, rawText: textContent });
      toast.success('Report submitted successfully!');
      setActiveTab('list');
      setTextTitle('');
      setTextContent('');
      fetchReports();
    } catch {
      toast.error('Submission failed.');
    } finally {
      setSubmitting(false);
    }
  };

  const handlePdfSubmit = async (e) => {
    e.preventDefault();
    if (!pdfFile) { toast.error('Please select a PDF document.'); return; }
    setSubmitting(true);
    const fd = new FormData();
    fd.append('pdf', pdfFile);
    fd.append('title', pdfTitle);
    try {
      await api.post('/reports/pdf', fd, { headers: { 'Content-Type': 'multipart/form-data' } });
      toast.success('PDF document uploaded successfully!');
      setActiveTab('list');
      setPdfTitle('');
      setPdfFile(null);
      fetchReports();
    } catch {
      toast.error('Upload failed.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Layout>
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Field Intelligence Reports</h1>
          <p className="text-slate-500 text-sm mt-1">{reports.length} documents in archive.</p>
        </div>
        
        {/* Tab switcher */}
        <div className="flex bg-slate-200/50 p-1 rounded-lg border border-slate-200">
          <button
            onClick={() => setActiveTab('list')}
            className={`px-4 py-1.5 text-sm font-semibold rounded-md transition-all flex items-center gap-2 ${
              activeTab === 'list' 
                ? 'bg-white text-slate-900 shadow-sm border border-slate-200/50' 
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Database size={14} /> Archive
          </button>
          <button
            onClick={() => setActiveTab('upload')}
            className={`px-4 py-1.5 text-sm font-semibold rounded-md transition-all flex items-center gap-2 ${
              activeTab === 'upload' 
                ? 'bg-white text-slate-900 shadow-sm border border-slate-200/50' 
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Plus size={14} /> Upload Intel
          </button>
        </div>
      </div>

      {/* ── ARCHIVE TAB ── */}
      {activeTab === 'list' && (
        <div>
          {loading ? (
            <div className="flex items-center justify-center py-20">
              <Loader2 size={32} className="animate-spin text-teal-600" />
            </div>
          ) : reports.length === 0 ? (
            <div className="bg-white rounded-xl border border-slate-200 text-center py-24 shadow-sm-soft">
              <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-4 border border-slate-100">
                <FileText size={32} className="text-slate-400" />
              </div>
              <h3 className="text-lg font-bold text-slate-900 mb-1">Archive Empty</h3>
              <p className="text-slate-500 text-sm mb-6 max-w-md mx-auto">Submit your first field report to populate the intelligence database.</p>
              <Button variant="primary" onClick={() => setActiveTab('upload')}>
                <Plus size={16} /> New Intel Report
              </Button>
            </div>
          ) : (
            <div className="grid grid-cols-1 xl:grid-cols-2 gap-5">
              {reports.map((r) => (
                <div
                  key={r._id}
                  className="bg-white rounded-xl border border-slate-200 shadow-sm-soft hover:shadow-card hover:border-slate-300 transition-all p-6 flex flex-col"
                >
                  {/* Top row */}
                  <div className="flex items-start gap-4 mb-4">
                    <div className={`w-12 h-12 rounded-lg flex items-center justify-center flex-shrink-0 border ${r.pdfPath ? 'bg-red-50 text-red-600 border-red-100' : 'bg-teal-50 text-teal-600 border-teal-100'}`}>
                      {r.pdfPath ? <File size={20} /> : <FileText size={20} />}
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-bold text-slate-900 text-lg truncate tracking-tight">
                        {r.title}
                      </h3>
                      <div className="flex items-center gap-3 text-xs text-slate-500 mt-1.5 font-medium">
                        <span className="flex items-center gap-1.5">
                          <Calendar size={12} className="text-slate-400" />
                          {new Date(r.createdAt).toLocaleDateString()}
                        </span>
                        <span className="font-semibold px-2 py-0.5 rounded bg-slate-100 text-slate-600">
                          {r.pdfPath ? 'PDF Document' : 'Text Record'}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Preview */}
                  {r.rawText && (
                    <p className="text-sm text-slate-600 leading-relaxed line-clamp-2 mb-5 bg-slate-50 p-3 rounded-lg border border-slate-100">
                      {r.rawText}
                    </p>
                  )}

                  {/* Footer */}
                  <div className="mt-auto flex items-center justify-between pt-4 border-t border-slate-100">
                    <span className={`text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-md border ${
                      r.status === 'processed' ? 'bg-emerald-50 text-emerald-700 border-emerald-200' : 'bg-slate-50 text-slate-600 border-slate-200'
                    }`}>
                      {r.status === 'processed' ? 'AI Processed' : 'Pending'}
                    </span>
                    <button
                      onClick={() => setSelected(r)}
                      className="flex items-center gap-1 text-sm font-semibold text-teal-600 hover:text-teal-700 transition-colors"
                    >
                      View Record <ChevronRight size={14} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* ── UPLOAD TAB ── */}
      {activeTab === 'upload' && (
        <div className="max-w-2xl mx-auto">
          {/* Type selector */}
          <div className="flex gap-4 mb-6">
            {[
              { key: 'text', icon: MessageSquare, label: 'Text Input' },
              { key: 'pdf',  icon: Upload,        label: 'PDF Upload' },
            ].map(({ key, icon: Icon, label }) => (
              <button
                key={key}
                onClick={() => setReportType(key)}
                className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-xl border text-sm font-semibold transition-all ${
                  reportType === key
                    ? 'border-teal-500 bg-teal-50 text-teal-700'
                    : 'border-slate-200 bg-white text-slate-600 hover:bg-slate-50'
                }`}
              >
                <Icon size={18} />
                {label}
              </button>
            ))}
          </div>

          <div className="bg-white rounded-xl shadow-sm-soft border border-slate-200 p-6 sm:p-8">
            {reportType === 'text' ? (
              <form onSubmit={handleTextSubmit} className="space-y-5">
                <Input label="Report Title" placeholder="e.g. Sector Delta Assessment" required
                  value={textTitle} onChange={(e) => setTextTitle(e.target.value)} />
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-1.5">Raw Field Data</label>
                  <textarea
                    rows={8}
                    placeholder="Input detailed situation report, casualty numbers, structural damage, exact coordinates..."
                    required
                    value={textContent}
                    onChange={(e) => setTextContent(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-white border border-slate-200 rounded-xl text-sm text-slate-800 placeholder:text-slate-400 outline-none focus:border-teal-500 focus:ring-2 focus:ring-teal-500/20 hover:border-slate-300 transition-all shadow-sm-soft resize-none"
                  />
                </div>
                <Button type="submit" variant="primary" size="md" loading={submitting} className="w-full justify-center">
                  Process Text Report
                </Button>
              </form>
            ) : (
              <form onSubmit={handlePdfSubmit} className="space-y-5">
                <Input label="Document Title" placeholder="e.g. Operation Flood Response PDF" required
                  value={pdfTitle} onChange={(e) => setPdfTitle(e.target.value)} />
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-1.5">PDF Document File</label>
                  <label className="flex flex-col items-center justify-center w-full h-40 border-2 border-dashed border-slate-300 bg-slate-50 rounded-xl cursor-pointer hover:border-teal-500 hover:bg-teal-50 transition-all">
                    {pdfFile ? (
                      <div className="text-center">
                        <div className="w-10 h-10 bg-teal-100 rounded-full flex items-center justify-center mx-auto mb-2">
                          <File size={20} className="text-teal-600" />
                        </div>
                        <p className="text-sm font-semibold text-slate-900 mb-1 px-4 truncate max-w-[250px]">{pdfFile.name}</p>
                      </div>
                    ) : (
                      <div className="text-center">
                        <Upload size={24} className="text-slate-400 mx-auto mb-2" />
                        <p className="text-sm text-slate-600 font-medium">
                          <span className="text-teal-600 font-bold">Click to locate</span> or drop file here
                        </p>
                      </div>
                    )}
                    <input type="file" accept=".pdf" className="hidden" onChange={(e) => setPdfFile(e.target.files[0])} />
                  </label>
                </div>
                <Button type="submit" variant="primary" size="md" loading={submitting} className="w-full justify-center">
                  Upload PDF Document
                </Button>
              </form>
            )}
          </div>
        </div>
      )}

      {/* ── DETAIL MODAL ── */}
      {selected && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm"
          onClick={(e) => { if (e.target === e.currentTarget) setSelected(null); }}
        >
          <div className="bg-white rounded-2xl shadow-modal w-full max-w-3xl my-8 flex flex-col overflow-hidden border border-slate-200">

            {/* Modal header */}
            <div className="flex items-start justify-between px-8 py-6 border-b border-slate-100 bg-slate-50">
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded border ${selected.pdfPath ? 'bg-red-50 text-red-700 border-red-200' : 'bg-teal-50 text-teal-700 border-teal-200'}`}>
                    {selected.pdfPath ? 'PDF Document' : 'Text Record'}
                  </span>
                  <span className="text-xs font-medium text-slate-500">
                    {new Date(selected.createdAt).toLocaleDateString()}
                  </span>
                </div>
                <h2 className="text-2xl font-bold text-slate-900 tracking-tight">{selected.title}</h2>
              </div>
              <button
                onClick={() => setSelected(null)}
                className="w-8 h-8 rounded-lg flex items-center justify-center bg-white border border-slate-200 text-slate-400 hover:bg-slate-50 hover:text-slate-700 transition-colors shadow-sm-soft"
              >
                <X size={18} />
              </button>
            </div>

            {/* Modal body */}
            <div className="p-8 overflow-y-auto max-h-[60vh] bg-white">
              {selected.pdfPath && (
                <a
                  href={`http://localhost:5000${selected.pdfPath}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-4 p-5 bg-slate-50 border border-slate-200 rounded-xl mb-6 hover:border-teal-500 transition-colors group"
                >
                  <div className="w-12 h-12 bg-white border border-slate-200 rounded-lg flex items-center justify-center shadow-sm-soft group-hover:border-teal-200">
                    <File size={24} className="text-red-500" />
                  </div>
                  <div className="flex-1">
                    <p className="font-bold text-slate-900 text-base">View PDF Document</p>
                    <p className="text-slate-500 text-sm mt-0.5">Opens file in a new tab</p>
                  </div>
                  <ExternalLink size={18} className="text-slate-400 group-hover:text-teal-600" />
                </a>
              )}

              {selected.rawText && (
                <div className="mb-6">
                  <h3 className="text-sm font-semibold text-slate-900 mb-2">Raw Field Data</h3>
                  <div className="bg-slate-50 border border-slate-200 rounded-xl p-5 text-sm text-slate-700 font-medium leading-relaxed whitespace-pre-wrap">
                    {selected.rawText}
                  </div>
                </div>
              )}

              {selected.aiExtractedData && Object.keys(selected.aiExtractedData).length > 0 && (
                <div>
                  <h3 className="text-sm font-semibold text-slate-900 mb-2">AI Parsed Parameters</h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {Object.entries(selected.aiExtractedData).map(([k, v]) => (
                      <div key={k} className="bg-white border border-slate-200 rounded-lg p-4 shadow-sm-soft">
                        <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">{k.replace(/_/g, ' ')}</p>
                        <p className="text-sm font-semibold text-slate-900">{String(v)}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <div className="px-8 py-4 border-t border-slate-100 bg-slate-50 flex justify-end">
              <Button variant="secondary" onClick={() => setSelected(null)}>Close</Button>
            </div>
          </div>
        </div>
      )}
    </Layout>
  );
}
