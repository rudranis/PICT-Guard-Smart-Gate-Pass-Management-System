import { useNavigate } from 'react-router-dom';
import { ShieldCheck, Users, Calendar, ScanLine, GraduationCap, BookOpen, Award, MapPin, Phone, Mail, ExternalLink, ChevronRight, Building2, Cpu, Network, Microscope, Star, Zap, Lock, Clock, UserCheck } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function Home() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-white font-sans">
      {/* Top Bar - Official Information */}
      <div className="bg-gradient-to-r from-blue-700 to-blue-600 text-white py-3 px-4 border-b-2 border-blue-800 shadow-md">
        <div className="container mx-auto flex flex-col sm:flex-row justify-between items-center gap-3 text-xs sm:text-sm font-medium">
          <div className="flex items-center gap-6">
            <span className="flex items-center gap-2 hover:text-blue-100 transition-colors"><Phone className="w-4 h-4" />+91-20-24371101</span>
            <span className="hidden sm:flex items-center gap-2 hover:text-blue-100 transition-colors"><Mail className="w-4 h-4" />info@pict.edu</span>
          </div>
          <div className="flex items-center gap-6">
            <a href="https://pict.edu" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors flex items-center gap-1 hover:underline">
              Official Website <ExternalLink className="w-3 h-3" />
            </a>
            <a href="https://alumni.pict.edu" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors flex items-center gap-1 hover:underline">
              Alumni Portal <ExternalLink className="w-3 h-3" />
            </a>
          </div>
        </div>
      </div>

      {/* Main Header - Professional with Two Login Buttons */}
      <header className="bg-white border-b-4 border-blue-400 shadow-lg sticky top-0 z-50">
        <div className="container mx-auto px-4 sm:px-6 py-4 flex items-center justify-between gap-4">
          {/* Logo and Branding */}
          <div className="flex items-center gap-4 flex-1">
            <div className="w-12 h-12 bg-gradient-to-br from-blue-600 to-blue-800 rounded-lg flex items-center justify-center shadow-lg border-2 border-blue-300 hover:shadow-xl transition-shadow">
              <span className="text-2xl">🛡️</span>
            </div>
            <div>
              <h1 className="text-lg sm:text-xl font-bold text-blue-900 leading-tight">
                PICT Guard
              </h1>
              <p className="text-xs sm:text-sm text-blue-600 font-semibold">Digital Campus Access</p>
            </div>
          </div>
          
          {/* Two Login Buttons */}
          <nav className="hidden sm:flex items-center gap-3">
            <Button 
              onClick={() => navigate('/user/login')} 
              className="bg-blue-600 hover:bg-blue-700 text-white font-semibold h-10 px-6 rounded-lg shadow-md hover:shadow-lg transition-all duration-300 text-sm"
            >
              Student/Faculty Login
            </Button>
            <Button 
              onClick={() => navigate('/admin/login')} 
              variant="outline"
              className="text-blue-600 border-2 border-blue-600 hover:bg-blue-50 font-semibold h-10 px-6 rounded-lg transition-all duration-300 text-sm"
            >
              Admin Login
            </Button>
          </nav>
          
          {/* Mobile Navigation */}
          <div className="flex sm:hidden gap-2">
            <Button 
              onClick={() => navigate('/user/login')} 
              size="sm" 
              className="bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs px-3 h-9 rounded-lg"
            >
              Student
            </Button>
            <Button 
              onClick={() => navigate('/admin/login')} 
              variant="outline"
              size="sm" 
              className="text-blue-600 border-2 border-blue-600 text-xs px-3 h-9 rounded-lg"
            >
              Admin
            </Button>
          </div>
        </div>
      </header>

      {/* Hero Section - Formal Professional White & Blue */}
      <section className="relative bg-gradient-to-b from-white to-blue-50 overflow-hidden border-b-2 border-blue-200">
        {/* Background Logo with Low Opacity */}
        <div className="absolute inset-0 flex items-center justify-center opacity-5 pointer-events-none overflow-hidden">
          <img 
            src="/pict-logo.png" 
            alt="" 
            className="w-96 h-96 object-contain"
            aria-hidden="true"
          />
        </div>
        
        <div className="absolute top-0 right-0 -mr-20 -mt-20 w-60 h-60 bg-blue-100/40 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 left-0 -ml-20 -mb-20 w-60 h-60 bg-blue-100/30 rounded-full blur-3xl"></div>
        
        <div className="container mx-auto px-4 sm:px-6 py-16 sm:py-24 relative z-10">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Left Content */}
            <div>
              <div className="inline-flex items-center gap-2 bg-blue-100 border-2 border-blue-400 rounded-full px-4 py-2 text-sm mb-8 font-semibold text-blue-700">
                <ShieldCheck className="w-4 h-4" />
                <span>Secure Digital Solution</span>
              </div>
              
              <h2 className="text-5xl sm:text-6xl font-bold mb-6 leading-tight bg-gradient-to-r from-blue-900 to-blue-600 bg-clip-text text-transparent">
                PICT Guard
              </h2>
              
              <h3 className="text-3xl sm:text-4xl font-bold mb-8 text-blue-600">
                Intelligent Campus Access
              </h3>
              
              <p className="text-gray-700 text-lg mb-6 leading-relaxed font-medium max-w-xl">
                State-of-the-art digital gate pass management system designed for modern educational institutions
              </p>
              
              <p className="text-gray-600 text-base mb-10 leading-relaxed max-w-xl font-normal">
                Secure QR-based access verification with real-time tracking, comprehensive audit logs, and seamless integration for students, faculty, visitors, and alumni.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4 mb-10">
                <Button onClick={() => navigate('/alumni/register')} size="lg" className="bg-blue-600 hover:bg-blue-700 text-white shadow-lg h-12 px-8 text-base font-semibold rounded-lg transition-all duration-300">
                  Alumni Registration <ChevronRight className="w-5 h-5 ml-2" />
                </Button>
                <Button onClick={() => navigate('/visitor/register')} size="lg" className="bg-blue-100 hover:bg-blue-200 text-blue-700 h-12 px-8 text-base font-semibold rounded-lg transition-all duration-300 border-2 border-blue-300">
                  Get Visitor Pass <ChevronRight className="w-5 h-5 ml-2" />
                </Button>
              </div>

              {/* Stats */}
              <div className="grid grid-cols-3 gap-6 pt-8 border-t-2 border-blue-200">
                {[
                  { value: '4000+', label: 'Students', icon: GraduationCap },
                  { value: '200+', label: 'Faculty', icon: Users },
                  { value: '42', label: 'Years Serving', icon: Award }
                ].map((stat) => (
                  <div key={stat.label} className="flex flex-col items-center sm:items-start">
                    <div className="flex items-center gap-2 mb-2">
                      <stat.icon className="w-5 h-5 text-blue-600" />
                      <p className="text-2xl sm:text-3xl font-bold text-blue-700">{stat.value}</p>
                    </div>
                    <p className="text-xs sm:text-sm text-gray-600 font-medium">{stat.label}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Right Content - Institution Info Card */}
            <div className="hidden lg:block">
              <div className="bg-gradient-to-br from-blue-50 to-blue-100 border-3 border-blue-400 rounded-2xl p-8 shadow-2xl hover:shadow-2xl transition-all duration-300">
                <div className="mb-8 pb-6 border-b-3 border-blue-300">
                  <h3 className="text-3xl font-bold text-blue-900 mb-3">Pune Institute of</h3>
                  <h3 className="text-3xl font-bold text-blue-900 mb-4">Computer Technology</h3>
                  <p className="text-blue-700 text-sm font-semibold">Est. 1983 • Autonomous Institute</p>
                  <p className="text-blue-600 text-xs mt-2">Affiliated with Savitribai Phule Pune University</p>
                </div>

                <div className="space-y-4">
                  <div className="flex items-start gap-4 bg-white rounded-xl p-4 border-2 border-blue-300 hover:bg-blue-50 transition-colors shadow-md hover:shadow-lg">
                    <Award className="w-6 h-6 text-blue-600 flex-shrink-0 mt-1" />
                    <div>
                      <p className="font-semibold text-sm text-blue-900">NAAC A+ Accredited</p>
                      <p className="text-blue-600 text-xs mt-1">National Assessment & Accreditation Council</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-4 bg-white rounded-xl p-4 border-2 border-blue-300 hover:bg-blue-50 transition-colors shadow-md hover:shadow-lg">
                    <BookOpen className="w-6 h-6 text-blue-600 flex-shrink-0 mt-1" />
                    <div>
                      <p className="font-semibold text-sm text-blue-900">NBA Accredited</p>
                      <p className="text-blue-600 text-xs mt-1">Engineering Programs Nationally Recognized</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-4 bg-white rounded-xl p-4 border-2 border-blue-300 hover:bg-blue-50 transition-colors shadow-md hover:shadow-lg">
                    <Building2 className="w-6 h-6 text-blue-600 flex-shrink-0 mt-1" />
                    <div>
                      <p className="font-semibold text-sm text-blue-900">Autonomous Affiliation</p>
                      <p className="text-blue-600 text-xs mt-1">Savitribai Phule Pune University</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-4 bg-white rounded-xl p-4 border-2 border-blue-300 hover:bg-blue-50 transition-colors shadow-md hover:shadow-lg">
                    <MapPin className="w-6 h-6 text-blue-600 flex-shrink-0 mt-1" />
                    <div>
                      <p className="font-semibold text-sm text-blue-900">Dhankawadi, Pune</p>
                      <p className="text-blue-600 text-xs mt-1">Survey No. 27, Pin Code 411043</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Wave SVG */}
        <div className="absolute bottom-0 left-0 right-0">
          <svg viewBox="0 0 1440 60" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M0 60L60 50C120 40 240 20 360 15C480 10 600 20 720 25C840 30 960 30 1080 25C1200 20 1320 10 1380 5L1440 0V60H0Z" fill="white"/>
          </svg>
        </div>
      </section>

      {/* Portal Access Section */}
      <section className="py-16 sm:py-20 md:py-28 bg-gradient-to-br from-white via-blue-50 to-white">
        <div className="container mx-auto px-4 sm:px-6">
          <div className="text-center mb-12 sm:mb-16 md:mb-20">
            <h2 className="text-4xl sm:text-5xl font-bold text-blue-900 mb-4 bg-gradient-to-r from-blue-900 to-blue-600 bg-clip-text text-transparent">Campus Access Portals</h2>
            <p className="text-gray-700 text-lg font-medium max-w-2xl mx-auto">Streamlined access management for all PICT community members</p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8 max-w-6xl mx-auto px-2">
            {/* Student Portal */}
            <div className="group bg-gradient-to-br from-blue-700 via-blue-600 to-blue-800 rounded-3xl p-8 text-white shadow-xl hover:shadow-2xl transition-all duration-300 border-2 border-blue-500 cursor-pointer hover:scale-105 overflow-hidden relative"
              onClick={() => navigate('/student/login')}>
              <div className="absolute top-0 right-0 w-32 h-32 bg-blue-400 rounded-full -mr-16 -mt-16 opacity-15 blur-xl group-hover:opacity-25 transition-all"></div>
              <div className="absolute bottom-0 left-0 w-24 h-24 bg-blue-300 rounded-full -ml-12 -mb-12 opacity-10 blur-xl"></div>
              <div className="relative z-10">
                <div className="bg-white/15 backdrop-blur-sm rounded-2xl w-16 h-16 flex items-center justify-center mb-6 group-hover:bg-white/25 transition-all border border-white/20">
                  <GraduationCap className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-2xl font-bold mb-3 text-white leading-tight">Student Portal</h3>
                <p className="text-blue-100 text-sm font-medium leading-relaxed mb-6 min-h-16">
                  Access cyber lounge QR pass, facility booking, and campus resources
                </p>
                <div className="inline-flex items-center gap-2 text-white font-semibold bg-white/15 px-4 py-2 rounded-lg group-hover:bg-white/25 transition-all border border-white/20">
                  <span>Login to Portal</span>
                  <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            </div>

            {/* Faculty Portal */}
            <div className="group bg-gradient-to-br from-blue-600 via-blue-500 to-blue-700 rounded-3xl p-8 text-white shadow-xl hover:shadow-2xl transition-all duration-300 border-2 border-blue-400 cursor-pointer hover:scale-105 overflow-hidden relative"
              onClick={() => navigate('/student/login')}>
              <div className="absolute top-0 right-0 w-32 h-32 bg-blue-300 rounded-full -mr-16 -mt-16 opacity-15 blur-xl group-hover:opacity-25 transition-all"></div>
              <div className="absolute bottom-0 left-0 w-24 h-24 bg-blue-200 rounded-full -ml-12 -mb-12 opacity-10 blur-xl"></div>
              <div className="relative z-10">
                <div className="bg-white/15 backdrop-blur-sm rounded-2xl w-16 h-16 flex items-center justify-center mb-6 group-hover:bg-white/25 transition-all border border-white/20">
                  <Users className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-2xl font-bold mb-3 text-white leading-tight">Faculty Portal</h3>
                <p className="text-blue-100 text-sm font-medium leading-relaxed mb-6 min-h-16">
                  Manage lab access, research resources, and department activities
                </p>
                <div className="inline-flex items-center gap-2 text-white font-semibold bg-white/15 px-4 py-2 rounded-lg group-hover:bg-white/25 transition-all border border-white/20">
                  <span>Login to Portal</span>
                  <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            </div>

            {/* Alumni Portal */}
            <div className="group bg-gradient-to-br from-blue-500 via-blue-400 to-blue-600 rounded-3xl p-8 text-white shadow-xl hover:shadow-2xl transition-all duration-300 border-2 border-blue-300 cursor-pointer hover:scale-105 overflow-hidden relative"
              onClick={() => navigate('/alumni/register')}>
              <div className="absolute top-0 right-0 w-32 h-32 bg-blue-200 rounded-full -mr-16 -mt-16 opacity-15 blur-xl group-hover:opacity-25 transition-all"></div>
              <div className="absolute bottom-0 left-0 w-24 h-24 bg-blue-100 rounded-full -ml-12 -mb-12 opacity-10 blur-xl"></div>
              <div className="relative z-10">
                <div className="bg-white/15 backdrop-blur-sm rounded-2xl w-16 h-16 flex items-center justify-center mb-6 group-hover:bg-white/25 transition-all border border-white/20">
                  <Award className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-2xl font-bold mb-3 text-white leading-tight">Alumni Portal</h3>
                <p className="text-blue-100 text-sm font-medium leading-relaxed mb-6 min-h-16">
                  Generate alumni passes, network events, and maintain campus access privileges
                </p>
                <div className="inline-flex items-center gap-2 text-white font-semibold bg-white/15 px-4 py-2 rounded-lg group-hover:bg-white/25 transition-all border border-white/20">
                  <span>Register Now</span>
                  <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            </div>

            {/* Visitor Portal */}
            <div className="group bg-gradient-to-br from-blue-400 via-blue-300 to-blue-500 rounded-3xl p-8 text-white shadow-xl hover:shadow-2xl transition-all duration-300 border-2 border-blue-200 cursor-pointer hover:scale-105 overflow-hidden relative"
              onClick={() => navigate('/visitor/register')}>
              <div className="absolute top-0 right-0 w-32 h-32 bg-blue-100 rounded-full -mr-16 -mt-16 opacity-15 blur-xl group-hover:opacity-25 transition-all"></div>
              <div className="absolute bottom-0 left-0 w-24 h-24 bg-blue-50 rounded-full -ml-12 -mb-12 opacity-10 blur-xl"></div>
              <div className="relative z-10">
                <div className="bg-white/15 backdrop-blur-sm rounded-2xl w-16 h-16 flex items-center justify-center mb-6 group-hover:bg-white/25 transition-all border border-white/20">
                  <UserCheck className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-2xl font-bold mb-3 text-white leading-tight">Visitor Pass</h3>
                <p className="text-blue-100 text-sm font-medium leading-relaxed mb-6 min-h-16">
                  Quick registration for campus visits with secure QR-based access verification
                </p>
                <div className="inline-flex items-center gap-2 text-white font-semibold bg-white/15 px-4 py-2 rounded-lg group-hover:bg-white/25 transition-all border border-white/20">
                  <span>Get Pass</span>
                  <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* System Features */}
      <section className="py-20 bg-white border-y border-slate-200">
        <div className="container mx-auto px-4 sm:px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-slate-900 mb-4">System Features</h2>
            <p className="text-slate-600 text-lg max-w-3xl mx-auto font-light">Advanced digital campus access management powered by modern security technology</p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              {
                icon: ScanLine,
                title: 'QR Code Technology',
                desc: 'Instant QR generation enabling secure, contactless access verification at all campus gates',
                color: 'text-sky-600',
                bg: 'bg-sky-100/50',
                borderColor: 'border-sky-200'
              },
              {
                icon: ShieldCheck,
                title: 'Secure Access',
                desc: 'Time-bound validity checks and encrypted tokens ensure only authorized personnel enter campus',
                color: 'text-emerald-600',
                bg: 'bg-emerald-100/50',
                borderColor: 'border-emerald-200'
              },
              {
                icon: Calendar,
                title: 'Event Management',
                desc: 'Create campus events and issue event-specific time-bound passes to registered participants',
                color: 'text-purple-600',
                bg: 'bg-purple-100/50',
                borderColor: 'border-purple-200'
              },
              {
                icon: Users,
                title: 'Multi-User Support',
                desc: 'Comprehensive system supporting students, faculty, visitors, alumni, and support staff',
                color: 'text-orange-600',
                bg: 'bg-orange-100/50',
                borderColor: 'border-orange-200'
              },
              {
                icon: Lock,
                title: 'Data Security',
                desc: 'End-to-end encryption with secure authentication and compliance with campus policies',
                color: 'text-red-600',
                bg: 'bg-red-100/50',
                borderColor: 'border-red-200'
              },
              {
                icon: Clock,
                title: 'Real-Time Tracking',
                desc: 'Live monitoring of campus entries with audit logs for security and administrative purposes',
                color: 'text-indigo-600',
                bg: 'bg-indigo-100/50',
                borderColor: 'border-indigo-200'
              },
              {
                icon: Zap,
                title: 'Instant Delivery',
                desc: 'Automatic gate pass generation and email delivery for seamless visitor onboarding',
                color: 'text-yellow-600',
                bg: 'bg-yellow-100/50',
                borderColor: 'border-yellow-200'
              },
              {
                icon: BookOpen,
                title: 'Admin Dashboard',
                desc: 'Comprehensive dashboard for campus administrators to manage users and access logs',
                color: 'text-teal-600',
                bg: 'bg-teal-100/50',
                borderColor: 'border-teal-200'
              },
            ].map((f) => (
              <div
                key={f.title}
                className={`${f.bg} border-2 ${f.borderColor} rounded-xl p-6 hover:shadow-lg hover:border-opacity-100 transition-all duration-300 group`}
              >
                <div className={`w-12 h-12 rounded-lg bg-white/60 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300 border border-opacity-20`}>
                  <f.icon className={`w-6 h-6 ${f.color}`} />
                </div>
                <h3 className="text-lg font-semibold text-slate-900 mb-3">{f.title}</h3>
                <p className="text-slate-600 text-sm leading-relaxed font-light">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Academic Programs */}
      <section className="py-20 bg-slate-50 border-y border-slate-200">
        <div className="container mx-auto px-4 sm:px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-slate-900 mb-4">Academic Excellence</h2>
            <p className="text-slate-600 text-lg max-w-3xl mx-auto font-light">World-class engineering and computer science programs accredited by NBA and recognized by leading universities</p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 max-w-5xl mx-auto mb-12">
            {[
              { icon: Cpu, dept: 'Computer Engineering', programs: 'B.E. • M.Tech', intake: '240 Students/Year', color: 'from-blue-500 to-blue-600' },
              { icon: Network, dept: 'Information Technology', programs: 'B.E. • M.Tech', intake: '120 Students/Year', color: 'from-indigo-500 to-indigo-600' },
              { icon: Cpu, dept: 'Artificial Intelligence', programs: 'B.E. • M.Tech', intake: '60 Students/Year', color: 'from-purple-500 to-purple-600' },
              { icon: Microscope, dept: 'Electronics & Telecom', programs: 'B.E.', intake: '60 Students/Year', color: 'from-green-500 to-green-600' },
              { icon: Network, dept: 'Electronics & Computer', programs: 'B.E.', intake: '60 Students/Year', color: 'from-teal-500 to-teal-600' },
              { icon: GraduationCap, dept: 'Master of Computer Applications', programs: 'M.C.A.', intake: '60 Students/Year', color: 'from-orange-500 to-orange-600' },
            ].map((prog) => (
              <div key={prog.dept} className="bg-white border-2 border-slate-200 rounded-xl p-6 hover:shadow-lg hover:border-blue-300 transition-all duration-300 group">
                <div className={`w-12 h-12 bg-gradient-to-br ${prog.color} rounded-xl flex items-center justify-center mb-4 shadow-md group-hover:scale-110 transition-transform duration-300`}>
                  <prog.icon className="w-6 h-6 text-white" />
                </div>
                <h3 className="font-bold text-slate-900 text-base mb-2 leading-tight">{prog.dept}</h3>
                <div className="space-y-1">
                  <p className="text-sm font-semibold text-blue-600">{prog.programs}</p>
                  <p className="text-xs text-slate-500 font-medium">{prog.intake}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="text-center">
            <p className="text-slate-600 font-light">All programs are <span className="font-semibold text-blue-700">NAAC A+ Accredited</span> and recognized by <span className="font-semibold text-blue-700">Savitribai Phule Pune University</span></p>
          </div>
        </div>
      </section>

      {/* Contact & Campus Information */}
      <section className="bg-gradient-to-r from-blue-900 to-slate-900 text-white py-20">
        <div className="container mx-auto px-4 sm:px-6">
          <div className="grid md:grid-cols-2 gap-16 items-start">
            {/* Left Side - Contact & Info */}
            <div>
              <h2 className="text-4xl font-bold mb-2">Campus Information</h2>
              <div className="w-16 h-1 bg-amber-400 mb-8"></div>

              <p className="text-blue-100 text-lg mb-10 leading-relaxed font-light">
                Visit our state-of-the-art campus in Pune and experience academic excellence. Register as a visitor to access the campus and participate in campus activities and events.
              </p>

              <div className="space-y-6">
                <div className="flex gap-4">
                  <div className="w-12 h-12 bg-blue-800/50 border border-blue-600 rounded-lg flex items-center justify-center flex-shrink-0">
                    <MapPin className="w-6 h-6 text-amber-300" />
                  </div>
                  <div>
                    <p className="font-bold text-white mb-1">Main Campus Address</p>
                    <p className="text-blue-100 text-sm leading-relaxed">
                      Survey No. 27, Near Trimurti Chowk, Dhankawadi<br />
                      Pune - 411043, Maharashtra, India
                    </p>
                  </div>
                </div>

                <div className="flex gap-4">
                  <div className="w-12 h-12 bg-blue-800/50 border border-blue-600 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Phone className="w-6 h-6 text-amber-300" />
                  </div>
                  <div>
                    <p className="font-bold text-white mb-1">Telephone</p>
                    <p className="text-blue-100 text-sm">
                      <a href="tel:+912024371101" className="hover:text-amber-300 transition-colors">+91-20-24371101</a>
                      <br />
                      <a href="tel:+912024372136" className="hover:text-amber-300 transition-colors">+91-20-24372136</a>
                    </p>
                  </div>
                </div>

                <div className="flex gap-4">
                  <div className="w-12 h-12 bg-blue-800/50 border border-blue-600 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Mail className="w-6 h-6 text-amber-300" />
                  </div>
                  <div>
                    <p className="font-bold text-white mb-1">Email</p>
                    <p className="text-blue-100 text-sm">
                      <a href="mailto:info@pict.edu" className="hover:text-amber-300 transition-colors">info@pict.edu</a>
                    </p>
                  </div>
                </div>

                <div className="flex gap-4">
                  <div className="w-12 h-12 bg-blue-800/50 border border-blue-600 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Star className="w-6 h-6 text-amber-300" />
                  </div>
                  <div>
                    <p className="font-bold text-white mb-1">Accreditations</p>
                    <p className="text-blue-100 text-sm">
                      NAAC 'A+' Grade • NBA Accredited<br />
                      Affiliated to SPPU
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Side - Quick Access Panel */}
            <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl p-8 shadow-2xl">
              <h3 className="text-2xl font-bold mb-2">Visitor Access</h3>
              <p className="text-blue-100 text-sm mb-8 font-light">Quick access to get your campus gate pass and portal login</p>

              <div className="space-y-4">
                <Button
                  onClick={() => navigate('/visitor/register')}
                  className="w-full bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-white h-12 text-base font-semibold rounded-lg"
                >
                  <Users className="w-5 h-5 mr-2" /> Register as Visitor
                </Button>

                <Button
                  onClick={() => navigate('/alumni/register')}
                  className="w-full bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 text-white h-12 text-base font-semibold rounded-lg"
                >
                  <GraduationCap className="w-5 h-5 mr-2" /> Alumni Registration
                </Button>

                <Button
                  onClick={() => navigate('/user/login')}
                  variant="outline"
                  className="w-full border-2 border-white text-white hover:bg-white/10 h-12 text-base font-semibold rounded-lg"
                >
                  <Users className="w-5 h-5 mr-2" /> Student / Faculty Login
                </Button>

                <div className="grid grid-cols-2 gap-3 pt-3 border-t border-white/20">
                  <Button
                    onClick={() => navigate('/admin/login')}
                    variant="outline"
                    className="border-white/30 text-white hover:bg-white/10 h-10 rounded-lg font-semibold text-sm"
                  >
                    Admin
                  </Button>
                  <Button
                    onClick={() => navigate('/guard/login')}
                    variant="outline"
                    className="border-white/30 text-white hover:bg-white/10 h-10 rounded-lg font-semibold text-sm"
                  >
                    Security
                  </Button>
                </div>
              </div>

              <div className="mt-8 pt-6 border-t border-white/20">
                <p className="text-xs text-blue-200 text-center font-light">Secure digital gate pass system for safe campus access</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-slate-950 text-slate-400 py-8">
        <div className="container mx-auto px-4 sm:px-6">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-blue-700 rounded-lg flex items-center justify-center">
                <GraduationCap className="w-5 h-5 text-white" />
              </div>
              <div>
                <p className="text-white text-sm font-semibold">Pune Institute of Computer Technology</p>
                <p className="text-xs text-slate-500">Pune, Maharashtra — Est. 1983</p>
              </div>
            </div>
            <div className="text-center text-sm">
              <p>© 2026 PICT Guard — Smart Gate Pass Management System</p>
              <p className="text-xs text-slate-600 mt-1">All rights reserved. Developed for PICT Campus Security.</p>
            </div>
            <div className="flex gap-4 text-sm">
              <a href="https://pict.edu" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors">pict.edu</a>
              <a href="https://alumni.pict.edu" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors">Alumni</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
