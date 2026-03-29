import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { ShieldCheck, Lock, User, GraduationCap, Eye, EyeOff } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;

export default function AdminLogin() {
  const navigate = useNavigate();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await axios.post(`${BACKEND_URL}/api/auth/admin/login`, { username, password });
      if (response.data.success) {
        localStorage.setItem('admin_token', response.data.token);
        toast.success('Login successful!');
        navigate('/admin/dashboard');
      }
    } catch (error) {
      toast.error(error.response?.data?.detail || 'Invalid credentials');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex bg-gradient-to-br from-slate-900 via-blue-950 to-slate-900">
      {/* Left Panel */}
      <div className="hidden lg:flex w-1/2 flex-col justify-center items-center p-12 relative overflow-hidden">
        <div className="absolute inset-0 opacity-10" style={{backgroundImage:'radial-gradient(circle at 30% 40%, rgba(59,130,246,0.5) 0%, transparent 60%), radial-gradient(circle at 70% 70%, rgba(99,102,241,0.3) 0%, transparent 50%)'}}></div>
        <div className="relative z-10 text-center max-w-md">
          <div className="w-24 h-24 bg-gradient-to-br from-sky-400 to-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-8 shadow-2xl">
            <GraduationCap className="w-14 h-14 text-white" />
          </div>
          <h1 className="text-3xl font-extrabold text-white mb-4 leading-tight">
            Pune Institute of<br/>Computer Technology
          </h1>
          <p className="text-blue-200 text-lg mb-8">PICT Guard — Smart Gate Pass Management System</p>
          <div className="grid grid-cols-2 gap-4">
            {[{label:'NAAC Grade','value':"'A+'"},{label:'Established','value':'1983'},{label:'Students','value':'4000+'},{label:'Programs','value':'NBA Accredited'}].map(s=>(
              <div key={s.label} className="bg-white/10 border border-white/20 rounded-xl p-4 text-center backdrop-blur-sm">
                <p className="text-sky-400 font-bold text-lg">{s.value}</p>
                <p className="text-blue-200 text-xs mt-1">{s.label}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Right Panel - Login Form */}
      <div className="flex-1 flex items-center justify-center p-4 sm:p-8">
        <div className="w-full max-w-md">
          <div className="bg-white rounded-2xl shadow-2xl overflow-hidden" data-testid="admin-login-form">
            {/* Top accent */}
            <div className="h-2 bg-gradient-to-r from-blue-600 to-sky-500"></div>
            <div className="p-8 sm:p-10">
              <div className="flex justify-center mb-6">
                <div className="w-16 h-16 bg-gradient-to-br from-blue-700 to-blue-600 rounded-2xl flex items-center justify-center shadow-lg">
                  <ShieldCheck className="w-9 h-9 text-white" />
                </div>
              </div>
              <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 text-center mb-1 tracking-tight">Admin Portal</h2>
              <p className="text-slate-500 text-center mb-8 text-sm">Sign in to manage the PICT Guard system</p>

              <form onSubmit={handleLogin} className="space-y-5">
                <div>
                  <Label htmlFor="username" className="text-sm font-semibold text-slate-700">Username</Label>
                  <div className="relative mt-2">
                    <User className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                    <Input id="username" type="text" placeholder="Enter username" value={username} onChange={e=>setUsername(e.target.value)} required className="pl-10 h-11 border-slate-200 focus:border-blue-500 focus:ring-blue-200" data-testid="admin-username-input" />
                  </div>
                </div>
                <div>
                  <Label htmlFor="password" className="text-sm font-semibold text-slate-700">Password</Label>
                  <div className="relative mt-2">
                    <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                    <Input id="password" type={showPassword?'text':'password'} placeholder="Enter password" value={password} onChange={e=>setPassword(e.target.value)} required className="pl-10 pr-10 h-11 border-slate-200 focus:border-blue-500 focus:ring-blue-200" data-testid="admin-password-input" />
                    <button type="button" onClick={()=>setShowPassword(!showPassword)} className="absolute right-3 top-3 text-slate-400 hover:text-slate-600">
                      {showPassword ? <EyeOff className="w-4 h-4"/> : <Eye className="w-4 h-4"/>}
                    </button>
                  </div>
                </div>
                <Button type="submit" className="w-full bg-gradient-to-r from-blue-700 to-blue-600 hover:from-blue-600 hover:to-blue-500 text-white h-11 text-base font-semibold mt-2 shadow-md transition-all" disabled={loading} data-testid="admin-login-submit">
                  {loading ? <span className="flex items-center gap-2"><svg className="animate-spin w-4 h-4" viewBox="0 0 24 24" fill="none"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z"/></svg> Signing in...</span> : 'Sign In'}
                </Button>
              </form>

              <div className="mt-6 p-4 bg-blue-50 border border-blue-100 rounded-xl">
                <p className="text-xs text-blue-600 text-center font-semibold mb-1">Demo Credentials</p>
                <p className="text-sm text-blue-900 text-center font-mono">admin / admin123</p>
              </div>

              <div className="mt-4 text-center">
                <Button variant="ghost" onClick={()=>navigate('/')} className="text-slate-500 hover:text-slate-700 text-sm" data-testid="back-to-home">
                  ← Back to Home
                </Button>
              </div>
            </div>
          </div>

          {/* Other login links */}
          <div className="mt-6 flex gap-3 justify-center text-sm">
            <button onClick={()=>navigate('/user/login')} className="text-blue-300 hover:text-white transition-colors">Student/Faculty Login</button>
            <span className="text-slate-600">|</span>
            <button onClick={()=>navigate('/guard/login')} className="text-blue-300 hover:text-white transition-colors">Guard Login</button>
          </div>
        </div>
      </div>
    </div>
  );
}
