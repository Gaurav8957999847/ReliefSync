import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { toast } from 'react-hot-toast';
import { ShieldCheck, Building2, User, Mail, Lock, ArrowLeft } from 'lucide-react';
import Input from '../components/ui/Input';
import Button from '../components/ui/Button';

export default function Register() {
  const [form, setForm] = useState({
    adminName: '', adminEmail: '', adminPassword: '',
    ngoName: '', ngoEmail: '',
  });
  const [loading, setLoading] = useState(false);
  const { register } = useAuth();
  const navigate = useNavigate();

  const set = (field) => (e) => setForm((p) => ({ ...p, [field]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    const result = await register({
      ngo:   { name: form.ngoName,   email: form.ngoEmail },
      admin: { name: form.adminName, email: form.adminEmail, password: form.adminPassword },
    });
    if (result.success) {
      toast.success('NGO registered successfully!');
      navigate('/');
    } else {
      toast.error(result.message || 'Registration failed.');
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-6 py-12">
      <div className="w-full max-w-2xl">
        <Link to="/login" className="inline-flex items-center gap-2 text-sm font-semibold text-slate-500 hover:text-slate-900 mb-8 transition-colors">
          <ArrowLeft size={16} /> Back to Sign in
        </Link>

        {/* Header */}
        <div className="text-center mb-10">
          <div className="inline-flex items-center gap-3 mb-6">
            <div className="w-12 h-12 bg-teal-500 rounded-xl flex items-center justify-center shadow-sm">
              <ShieldCheck size={26} className="text-white" />
            </div>
            <span className="text-slate-900 font-bold text-2xl tracking-tight">ReliefSync AI</span>
          </div>
          <h1 className="text-3xl font-bold text-slate-900 tracking-tight mb-3">Create your organization account</h1>
          <p className="text-slate-500 text-base font-medium max-w-lg mx-auto">Set up your NGO and administrator details to access the platform.</p>
        </div>

        {/* Card */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-card p-8 sm:p-10">
          <form onSubmit={handleSubmit} className="space-y-8">
            
            {/* NGO Section */}
            <div>
              <div className="flex items-center gap-2 mb-5">
                <Building2 size={18} className="text-teal-600" />
                <h3 className="text-base font-bold text-slate-900">Organization Details</h3>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <Input label="Organization Name" icon={Building2} placeholder="e.g. Global Rescue" required
                  value={form.ngoName} onChange={set('ngoName')} />
                <Input label="Organization Email" type="email" icon={Mail} placeholder="contact@organization.ngo" required
                  value={form.ngoEmail} onChange={set('ngoEmail')} />
              </div>
            </div>

            <div className="h-px w-full bg-slate-100" />

            {/* Admin Section */}
            <div>
              <div className="flex items-center gap-2 mb-5">
                <User size={18} className="text-teal-600" />
                <h3 className="text-base font-bold text-slate-900">Administrator Details</h3>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <Input label="Full Name" icon={User} placeholder="Jane Smith" required
                  value={form.adminName} onChange={set('adminName')} />
                <Input label="Admin Email" type="email" icon={Mail} placeholder="admin@organization.ngo" required
                  value={form.adminEmail} onChange={set('adminEmail')} />
                <div className="sm:col-span-2">
                  <Input label="Password" type="password" icon={Lock} placeholder="Minimum 8 characters" required
                    value={form.adminPassword} onChange={set('adminPassword')} />
                </div>
              </div>
            </div>

            <Button type="submit" variant="primary" size="lg" loading={loading} className="w-full mt-2">
              Create Account
            </Button>
          </form>
        </div>

        <p className="text-center text-sm font-medium text-slate-500 mt-8">
          By registering, you agree to our Terms of Service and Privacy Policy.
        </p>
      </div>
    </div>
  );
}
