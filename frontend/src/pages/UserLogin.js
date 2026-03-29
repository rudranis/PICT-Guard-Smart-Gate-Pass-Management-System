import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Users, Mail, Phone, GraduationCap, Eye, EyeOff } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;

export default function UserLogin() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [mobileNo, setMobileNo] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    if (!/^\d{10}$/.test(mobileNo)) { toast.error('Mobile number must be exactly 10 digits'); return; }
    setLoading(true);
    try {
      const response = await axios.post(`${BACKEND_URL}/api/auth/user/login`, { email, mobile_no: mobileNo });
      if (response.data.success) {
        localStorage.setItem('user_data', JSON.stringify(response.data));
        toast.success('Login successful!');
        navigate('/user/portal');
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
          <div className="w-24 h-24 bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-8 shadow-2xl">
            <GraduationCap className="w-14 h-14 text-white" />
          </div>
          <h1 className="text-3xl font-extrabold text-white mb-4">Student & Faculty Portal</h1>
          <p className="text-blue-200 text-lg mb-8">Secure PICT Gate Pass and QR code for campus access</p>
          <div className="space-y-3 text-left">
            {['View your digital gate pass','Download secure QR code','Register visitor passes','Manage your profile'].map(item=>(
              <div key={item} className="flex items-center gap-3 bg-white/10 border border-white/20 rounded-xl p-3 backdrop-blur-sm">
                <div className="w-2 h-2 bg-blue-400 rounded-full flex-shrink-0"></div>
                <span className="text-blue-100 text-sm">{item}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Right Panel */}
      <div className="flex-1 flex items-center justify-center p-4 sm:p-8">
        <div className="w-full max-w-md">
          <div className="bg-white rounded-2xl shadow-2xl overflow-hidden" data-testid="user-login-form">
            <div className="h-2 bg-gradient-to-r from-blue-600 to-blue-500"></div>
            <div className="p-8 sm:p-10">
              <div className="flex justify-center mb-6">
                <div className="w-16 h-16 bg-gradient-to-br from-blue-700 to-blue-600 rounded-2xl flex items-center justify-center shadow-lg">
                  <Users className="w-9 h-9 text-white" />
                </div>
              </div>
              <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 text-center mb-1">Student / Faculty</h2>
              <p className="text-slate-500 text-center mb-8 text-sm">Sign in to access your PICT gate pass</p>

              <form onSubmit={handleLogin} className="space-y-5">
                <div>
                  <Label htmlFor="email" className="text-sm font-semibold text-slate-700">Email Address</Label>
                  <div className="relative mt-2">
                    <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                    <Input id="email" type="email" placeholder="Enter your registered email" value={email} onChange={e=>setEmail(e.target.value)} required className="pl-10 h-11 border-slate-200 focus:border-blue-500 focus:ring-blue-200" data-testid="user-email-input" />
                  </div>
                </div>
                <div>
                  <Label htmlFor="mobile" className="text-sm font-semibold text-slate-700">Mobile Number (10 digits)</Label>
                  <div className="relative mt-2">
                    <Phone className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                    <Input id="mobile" type="tel" placeholder="Enter 10-digit mobile number" value={mobileNo} onChange={e=>setMobileNo(e.target.value.replace(/\D/g,'').slice(0,10))} maxLength="10" required className="pl-10 h-11 border-slate-200 focus:border-blue-500 focus:ring-blue-200" data-testid="user-mobile-input" />
                  </div>
                  {mobileNo && mobileNo.length < 10 && <p className="text-xs text-red-500 mt-1">{mobileNo.length}/10 digits</p>}
                </div>
                <Button type="submit" className="w-full bg-gradient-to-r from-blue-700 to-blue-600 hover:from-blue-600 hover:to-blue-500 text-white h-11 text-base font-semibold shadow-md transition-all" disabled={loading} data-testid="user-login-submit">
                  {loading ? 'Signing in...' : 'Sign In'}
                </Button>
              </form>

              <div className="mt-4 text-center">
                <Button variant="ghost" onClick={()=>navigate('/')} className="text-slate-500 hover:text-slate-700 text-sm" data-testid="back-to-home">
                  ← Back to Home
                </Button>
              </div>
            </div>
          </div>
          <div className="mt-6 flex gap-3 justify-center text-sm">
            <button onClick={()=>navigate('/admin/login')} className="text-purple-300 hover:text-white transition-colors">Admin Login</button>
            <span className="text-slate-600">|</span>
            <button onClick={()=>navigate('/guard/login')} className="text-purple-300 hover:text-white transition-colors">Guard Login</button>
          </div>
        </div>
      </div>
    </div>
  );
}
