import { useState } from 'react';
import { Activity, Eye, EyeOff, AlertCircle, Loader2 } from 'lucide-react';
import { authenticateDemoAccount } from '../demoAuth';
import type { Page, UserSession } from '../types';

interface Props { onLogin: (session: UserSession) => void; onNavigate: (page: Page) => void; }

export default function LoginPage({ onLogin, onNavigate }: Props) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPw, setShowPw] = useState(false);
  const [remember, setRemember] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) { setError('Please enter your email and password.'); return; }
    const session = authenticateDemoAccount(email, password);
    if (!session) {
      setError('Invalid email or password.');
      return;
    }
    setError('');
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      onLogin(session);
    }, 1200);
  };

  return (
    <div className="min-h-screen flex">
      {/* Left panel */}
      <div className="hidden lg:flex lg:w-5/12 bg-[#0B1F3A] flex-col justify-between p-12 relative overflow-hidden">
        <div className="absolute inset-0 opacity-[0.04]" style={{
          backgroundImage: 'radial-gradient(circle at 1px 1px, white 1px, transparent 0)',
          backgroundSize: '28px 28px'
        }} />
        <div className="absolute bottom-0 left-0 right-0 h-1/2 bg-gradient-to-t from-[#071426] to-transparent" />

        <div className="relative flex items-center gap-3">
          <div className="w-9 h-9 rounded bg-[#C9A227] flex items-center justify-center">
            <Activity size={18} className="text-[#071426]" />
          </div>
          <div>
            <div className="text-white font-700">FieldOps</div>
            <div className="text-[#C9A227] text-xs font-600 tracking-widest uppercase">Nexus</div>
          </div>
        </div>

        <div className="relative">
          <div className="text-xs font-600 text-[#C9A227] uppercase tracking-widest mb-4">Enterprise Platform</div>
          <h2 className="text-3xl font-700 text-white mb-4 leading-tight">
            Field Operations.<br />
            Asset Management.<br />
            One Platform.
          </h2>
          <p className="text-white/50 text-sm mb-8 leading-relaxed">
            Manage assets, maintenance, field service, inventory and operational workflows across your entire organization.
          </p>
          <div className="space-y-3">
            {[
              'Asset lifecycle management',
              'Preventive maintenance scheduling',
              'Real-time field technician dispatch',
              'SLA monitoring and escalation',
              'Complete audit and compliance',
            ].map(item => (
              <div key={item} className="flex items-center gap-3">
                <div className="w-1.5 h-1.5 bg-[#C9A227] rounded-full flex-shrink-0" />
                <span className="text-white/60 text-sm">{item}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="relative text-white/30 text-xs">
          © 2026 FieldOps Nexus. Enterprise Field Service ERP.
        </div>
      </div>

      {/* Right panel */}
      <div className="flex-1 flex items-center justify-center p-8 bg-[#F8FAFC]">
        <div className="w-full max-w-sm">
          {/* Mobile logo */}
          <div className="lg:hidden flex items-center gap-2 mb-8">
            <div className="w-8 h-8 rounded bg-[#C9A227] flex items-center justify-center">
              <Activity size={15} className="text-[#071426]" />
            </div>
            <span className="font-700 text-[#172033]">FieldOps <span className="text-[#C9A227]">Nexus</span></span>
          </div>

          <h1 className="text-2xl font-700 text-[#172033] mb-1">Welcome back</h1>
          <p className="text-sm text-[#64748B] mb-8">Sign in to your FieldOps Nexus account</p>

          {error && (
            <div className="flex items-center gap-2 p-3 bg-red-50 border border-red-200 rounded mb-5 text-sm text-red-700">
              <AlertCircle size={15} className="flex-shrink-0" />
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-500 text-[#172033] mb-1.5">Email Address</label>
              <input
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="name@organization.com"
                className="w-full px-3 py-2.5 bg-white border border-[#E2E8F0] rounded text-sm text-[#172033] placeholder-[#94A3B8] outline-none focus:border-[#C9A227] transition-colors"
                autoComplete="email"
              />
            </div>

            <div>
              <label className="block text-xs font-500 text-[#172033] mb-1.5">Password</label>
              <div className="relative">
                <input
                  type={showPw ? 'text' : 'password'}
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  placeholder="Enter your password"
                  className="w-full px-3 py-2.5 pr-10 bg-white border border-[#E2E8F0] rounded text-sm text-[#172033] placeholder-[#94A3B8] outline-none focus:border-[#C9A227] transition-colors"
                  autoComplete="current-password"
                />
                <button
                  type="button"
                  onClick={() => setShowPw(!showPw)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-[#94A3B8] hover:text-[#64748B]"
                >
                  {showPw ? <EyeOff size={15} /> : <Eye size={15} />}
                </button>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={remember}
                  onChange={e => setRemember(e.target.checked)}
                  className="rounded"
                />
                <span className="text-xs text-[#64748B]">Remember me</span>
              </label>
              <button
                type="button"
                onClick={() => onNavigate('forgot-password')}
                className="text-xs text-[#C9A227] hover:text-[#a8841e] transition-colors font-500"
              >
                Forgot password?
              </button>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full flex items-center justify-center gap-2 py-2.5 bg-[#0B1F3A] text-white text-sm font-600 rounded hover:bg-[#102A43] disabled:opacity-70 transition-colors mt-2"
            >
              {loading ? (
                <>
                  <Loader2 size={15} className="animate-spin" />
                  Signing in…
                </>
              ) : 'Sign In'}
            </button>
          </form>

          <div className="mt-5 text-center text-xs text-[#64748B]">
            Don't have an account?{' '}
            <button
              type="button"
              onClick={() => onNavigate('client-register')}
              className="font-600 text-[#C9A227] transition-colors hover:text-[#a8841e]"
            >
              Register as Client
            </button>
          </div>

          <div className="mt-6 p-3 bg-[#F7EFCF] border border-[#C9A227]/30 rounded text-xs text-[#a8841e] space-y-1.5">
            <div className="font-700 mb-1">Demo credentials — default password: <span className="font-800">demo1234</span></div>
            {[
              { label: 'Super Admin',         email: 'superadmin@fieldopsnexus.com' },
              { label: 'Operations Manager',  email: 'operations@fieldopsnexus.com' },
              { label: 'Asset Manager',       email: 'assetmanager@fieldopsnexus.com' },
              { label: 'Maintenance Planner', email: 'maintenance@fieldopsnexus.com' },
              { label: 'Field Technician',    email: 'technician@fieldopsnexus.com' },
              { label: 'Storekeeper (Store@1234)', email: 'storekeeper@fieldopsnexus.com', password: 'Store@1234' },
              { label: 'Auditor (Audit@1234)', email: 'auditor@fieldopsnexus.com', password: 'Audit@1234' },
              { label: 'Client',              email: 'client@fieldopsnexus.com' },
            ].map(a => (
              <button key={a.email} type="button"
                onClick={() => { setEmail(a.email); if (a.password) setPassword(a.password); }}
                className="flex items-center gap-2 w-full hover:text-[#7a6015] transition-colors">
                <span className="w-1.5 h-1.5 rounded-full bg-[#C9A227] flex-shrink-0"/>
                <span className="font-600">{a.label}:</span>
                <span className="truncate">{a.email}</span>
              </button>
            ))}
          </div>

          <p className="mt-6 text-center text-xs text-[#64748B]">
            Need access?{' '}
            <button className="text-[#C9A227] font-500 hover:text-[#a8841e]">Contact your system administrator</button>
          </p>
        </div>
      </div>
    </div>
  );
}
