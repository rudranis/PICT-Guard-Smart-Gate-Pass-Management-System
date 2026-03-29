import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { ScanLine, Lock, User, Shield, Eye, EyeOff } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;

export default function GuardLogin() {
  const navigate = useNavigate();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await axios.post(`${BACKEND_URL}/api/auth/guard/login`, { username, password });
      if (response.data.success) {
        localStorage.setItem('guard_data', JSON.stringify(response.data));
        toast.success('Login successful!');
        navigate('/guard/scanner');
      }
    } catch (error) {
      toast.error(error.response?.data?.detail || 'Invalid credentials');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex bg-gradient-to-br from-blue-900 via-blue-800 to-slate-900">
      {/* Left Panel */}
      <div className="hidden lg:flex w-1/2 flex-col justify-center items-center p-12 relative overflow-hidden">
        <div className="absolute inset-0 opacity-10" style={{backgroundImage:'radial-gradient(circle at 30% 40%, rgba(59,130,246,0.5) 0%, transparent 60%)'}}></div>
        <div className="relative z-10 text-center max-w-md">
          <div className="w-24 h-24 bg-gradient-to-br from-blue-500 to-blue-700 rounded-2xl flex items-center justify-center mx-auto mb-8 shadow-2xl">
            <Shield className="w-14 h-14 text-white" />
          </div>
          <h1 className="text-3xl font-extrabold text-white mb-4">Guard Security Portal</h1>
          <p className="text-blue-200 text-lg mb-8">Campus gate security — Scan & validate QR codes for authorized entry</p>
          <div className="space-y-3 text-left">
            {['Scan QR codes instantly','Manual token verification','Camera-based QR scanning','Real-time validity check'].map(item=>(
              <div key={item} className="flex items-center gap-3 bg-white/10 border border-white/20 rounded-xl p-3 backdrop-blur-sm">
                <ScanLine className="w-4 h-4 text-blue-300 flex-shrink-0" />
                <span className="text-blue-100 text-sm">{item}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Right Panel */}
      <div className="flex-1 flex items-center justify-center p-4 sm:p-8">
        <div className="w-full max-w-md">
          <div className="bg-white rounded-2xl shadow-2xl overflow-hidden" data-testid="guard-login-form">
            <div className="h-2 bg-gradient-to-r from-blue-600 to-blue-500"></div>
            <div className="p-8 sm:p-10">
              <div className="flex justify-center mb-6">
                <div className="w-16 h-16 bg-gradient-to-br from-blue-700 to-blue-600 rounded-2xl flex items-center justify-center shadow-lg">
                  <ScanLine className="w-9 h-9 text-white" />
                </div>
              </div>
              <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 text-center mb-1">Guard Security Portal</h2>
              <p className="text-slate-500 text-center mb-8 text-sm">Sign in to scan and validate QR codes</p>

              <form onSubmit={handleLogin} className="space-y-5">
                <div>
                  <Label htmlFor="username" className="text-sm font-semibold text-slate-700">Username</Label>
                  <div className="relative mt-2">
                    <User className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                    <Input id="username" type="text" placeholder="Enter username (e.g., guard1)" value={username} onChange={e=>setUsername(e.target.value)} required className="pl-10 h-11 border-slate-200 focus:border-blue-500 focus:ring-blue-500" data-testid="guard-username-input" />
                  </div>
                </div>
                <div>
                  <Label htmlFor="password" className="text-sm font-semibold text-slate-700">Password</Label>
                  <div className="relative mt-2">
                    <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                    <Input id="password" type={showPassword?'text':'password'} placeholder="Enter password" value={password} onChange={e=>setPassword(e.target.value)} required className="pl-10 pr-10 h-11 border-slate-200 focus:border-blue-500 focus:ring-blue-500" data-testid="guard-password-input" />
                    <button type="button" onClick={()=>setShowPassword(!showPassword)} className="absolute right-3 top-3 text-slate-400 hover:text-slate-600">
                      {showPassword?<EyeOff className="w-4 h-4"/>:<Eye className="w-4 h-4"/>}
                    </button>
                  </div>
                </div>
                <Button type="submit" className="w-full bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white h-11 text-base font-semibold shadow-md" disabled={loading} data-testid="guard-login-submit">
                  {loading ? 'Signing in...' : 'Sign In to Guard Portal'}
                </Button>
              </form>

              <div className="mt-6 p-4 bg-blue-50 border border-blue-100 rounded-xl">
                <p className="text-xs text-blue-600 text-center font-semibold mb-1">Demo Credentials</p>
                <p className="text-sm text-blue-900 text-center font-mono">guard1 / guard123</p>
              </div>

              <div className="mt-4 text-center">
                <Button variant="ghost" onClick={()=>navigate('/')} className="text-slate-500 hover:text-slate-700 text-sm" data-testid="back-to-home">
                  ← Back to Home
                </Button>
              </div>
            </div>
          </div>
          <div className="mt-6 flex gap-3 justify-center text-sm">
            <button onClick={()=>navigate('/admin/login')} className="text-blue-300 hover:text-white transition-colors">Admin Login</button>
            <span className="text-slate-600">|</span>
            <button onClick={()=>navigate('/user/login')} className="text-blue-300 hover:text-white transition-colors">Student/Faculty</button>
          </div>
        </div>
      </div>
    </div>
  );
}
