import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { toast } from 'react-hot-toast';
import { ShieldCheck, Mail, Lock, Eye, EyeOff } from 'lucide-react';
import Input from '../components/ui/Input';
import Button from '../components/ui/Button';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPw, setShowPw] = useState(false);
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    const result = await login(email, password);
    if (result.success) {
      toast.success('Welcome back!');
      navigate('/');
    } else {
      toast.error(result.message || 'Invalid credentials');
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-slate-50 flex">
      {/* Left Panel */}
      <div className="hidden lg:flex lg:w-1/2 flex-col justify-between p-12 bg-navy-900 text-white relative">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-teal-500 rounded-lg flex items-center justify-center shadow-sm">
            <ShieldCheck size={24} className="text-white" />
          </div>
          <span className="text-white font-bold text-xl tracking-tight">ReliefSync AI</span>
        </div>
        
        <div className="max-w-md">
          <h2 className="text-4xl font-bold leading-tight mb-6 tracking-tight">
            Coordinate relief operations with precision.
          </h2>
          <p className="text-slate-300 text-lg leading-relaxed font-medium mb-12">
            The intelligent platform connecting NGO volunteers with emergency needs, powered by AI matching and real-time field data.
          </p>

          <div className="grid grid-cols-2 gap-8">
            <div>
              <p className="text-3xl font-bold text-white mb-1">98%</p>
              <p className="text-teal-400 text-sm font-semibold tracking-wide uppercase">Match Accuracy</p>
            </div>
            <div>
              <p className="text-3xl font-bold text-white mb-1">12K+</p>
              <p className="text-teal-400 text-sm font-semibold tracking-wide uppercase">Active Volunteers</p>
            </div>
          </div>
        </div>
        
        <div className="text-slate-400 text-sm font-medium">
          © 2025 ReliefSync AI Platform
        </div>
      </div>

      {/* Right Panel */}
      <div className="flex-1 flex items-center justify-center p-8 bg-white lg:bg-slate-50">
        <div className="w-full max-w-md bg-white lg:p-10 lg:rounded-2xl lg:shadow-card lg:border lg:border-slate-100">
          
          {/* Mobile Logo */}
          <div className="flex items-center gap-3 mb-10 lg:hidden">
            <div className="w-10 h-10 bg-teal-500 rounded-lg flex items-center justify-center shadow-sm">
              <ShieldCheck size={22} className="text-white" />
            </div>
            <span className="text-slate-900 font-bold text-xl tracking-tight">ReliefSync AI</span>
          </div>

          <div className="mb-8">
            <h1 className="text-2xl font-bold text-slate-900 tracking-tight mb-2">Sign in to your account</h1>
            <p className="text-slate-500 text-sm font-medium">Enter your credentials to access the operations dashboard.</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <Input
              label="Email Address"
              type="email"
              icon={Mail}
              placeholder="admin@yourorg.ngo"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />

            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="block text-sm font-semibold text-slate-700">Password</label>
                <button type="button" className="text-xs text-teal-600 hover:text-teal-700 font-semibold transition-colors">
                  Forgot password?
                </button>
              </div>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                  <Lock size={16} className="text-slate-400 group-focus-within:text-teal-600 transition-colors" />
                </div>
                <input
                  type={showPw ? 'text' : 'password'}
                  required
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-10 pr-10 py-2.5 bg-white border border-slate-200 rounded-xl text-sm text-slate-800 placeholder:text-slate-400 font-medium transition-all duration-200 outline-none focus:border-teal-500 focus:ring-2 focus:ring-teal-500/20 hover:border-slate-300 shadow-sm-soft"
                />
                <button
                  type="button"
                  onClick={() => setShowPw(!showPw)}
                  className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-slate-400 hover:text-slate-600 transition-colors"
                >
                  {showPw ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            <Button
              type="submit"
              variant="primary"
              size="lg"
              loading={loading}
              className="w-full mt-2"
            >
              Sign In
            </Button>
          </form>

          <p className="mt-8 text-center text-sm font-medium text-slate-500">
            Don't have an account?{' '}
            <Link to="/register" className="text-teal-600 font-semibold hover:text-teal-700 hover:underline transition-colors">
              Register your NGO
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
