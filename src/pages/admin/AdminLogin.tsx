import React, { useState } from 'react';
import { Shield, Lock, Mail, ArrowRight, AlertCircle, CheckCircle2 } from 'lucide-react';
import { AdminUser } from '../../types';
import { BrandLogo } from '../../components/BrandLogo';

interface AdminLoginProps {
  onLoginSuccess: (token: string, admin: AdminUser) => void;
  onNavigateHome: () => void;
}

export const AdminLogin: React.FC<AdminLoginProps> = ({ onLoginSuccess, onNavigateHome }) => {
  const [email, setEmail] = useState('admin@ahsanailabs.com');
  const [password, setPassword] = useState('admin_password_123');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      const res = await fetch('/api/admin/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });

      const data = await res.json();
      if (data.success && data.token) {
        localStorage.setItem('ahsan_admin_token', data.token);
        onLoginSuccess(data.token, data.admin);
      } else {
        setError(data.message || 'Invalid credentials. Please verify email and password.');
      }
    } catch (err: any) {
      setError('Unable to authenticate with backend server.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#040913] text-slate-100 flex items-center justify-center p-4 sm:p-6 relative overflow-hidden">
      
      {/* Background ambient light */}
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-blue-600/10 rounded-full blur-[140px] pointer-events-none" />

      <div className="w-full max-w-md space-y-6 relative z-10">
        
        {/* Brand Header */}
        <div className="flex flex-col items-center justify-center space-y-2">
          <BrandLogo 
            size="lg" 
            onClick={onNavigateHome}
            className="justify-center"
          />
          <div className="text-xs uppercase tracking-widest text-blue-400 font-semibold pt-1">
            Administrative Management Portal
          </div>
        </div>

        {/* Demo Credentials Quick Banner */}
        <div className="p-3.5 rounded-2xl bg-blue-950/40 border border-blue-800/40 text-xs text-slate-300 space-y-1">
          <div className="font-semibold text-cyan-300 flex items-center">
            <CheckCircle2 className="w-3.5 h-3.5 mr-1" />
            Default Administrator Credentials
          </div>
          <div>Email: <code className="bg-slate-900 px-1.5 py-0.5 rounded text-white">admin@ahsanailabs.com</code></div>
          <div>Password: <code className="bg-slate-900 px-1.5 py-0.5 rounded text-white">admin_password_123</code></div>
        </div>

        {/* Login Box */}
        <div className="p-8 rounded-3xl bg-slate-900/90 border border-slate-800 shadow-2xl space-y-6">
          <div className="flex items-center space-x-2 text-xs font-semibold text-slate-400">
            <Shield className="w-4 h-4 text-cyan-400" />
            <span>Secure Role-Based Authentication</span>
          </div>

          {error && (
            <div className="p-3 rounded-xl bg-red-950/60 border border-red-800 text-red-300 text-xs flex items-center space-x-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-1 text-left">
              <label className="text-xs font-medium text-slate-300">Admin Email</label>
              <div className="relative">
                <Mail className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 rounded-xl bg-slate-950 border border-slate-800 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 text-xs sm:text-sm text-white"
                  placeholder="admin@ahsanailabs.com"
                />
              </div>
            </div>

            <div className="space-y-1 text-left">
              <label className="text-xs font-medium text-slate-300">Password</label>
              <div className="relative">
                <Lock className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500" />
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 rounded-xl bg-slate-950 border border-slate-800 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 text-xs sm:text-sm text-white"
                  placeholder="••••••••••••"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3.5 rounded-xl bg-blue-600 hover:bg-blue-500 disabled:opacity-50 text-white font-bold text-xs sm:text-sm uppercase tracking-wider transition-all shadow-lg shadow-blue-600/30 flex items-center justify-center space-x-2"
            >
              {isLoading ? (
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <>
                  <span>Sign In To Dashboard</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          <div className="pt-2 text-center">
            <button
              onClick={onNavigateHome}
              className="text-xs text-slate-400 hover:text-white transition-colors"
            >
              ← Return to Public Website
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};
