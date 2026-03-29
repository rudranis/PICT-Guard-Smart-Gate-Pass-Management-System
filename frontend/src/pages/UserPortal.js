import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import {
  ShieldCheck,
  LogOut,
  User,
  MapPin,
  Briefcase,
  Phone,
  Mail,
  Users,
  Plus,
  Send,
  Trash2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { QRCodeSVG } from "qrcode.react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;

export default function UserPortal() {
  const navigate = useNavigate();
  const [userData, setUserData] = useState(null);
  const [showProfileModal, setShowProfileModal] = useState(false);
  const [visitors, setVisitors] = useState([]);
  const [alumni, setAlumni] = useState([]);
  const [loadingMeetings, setLoadingMeetings] = useState(false);
  const [showVisitorsModal, setShowVisitorsModal] = useState(false);
  
  // Faculty visitor registration states
  const [showRegisterVisitorModal, setShowRegisterVisitorModal] = useState(false);
  const [registeredVisitors, setRegisteredVisitors] = useState([]);
  const [loadingVisitors, setLoadingVisitors] = useState(false);
  const [registering, setRegistering] = useState(false);
  const [visitorFormData, setVisitorFormData] = useState({
    visitor_type: "HR",
    name: "",
    email: "",
    mobile_no: "",
    date_from: "",
    date_to: "",
    valid_till: "",
  });
  const [resendingEmail, setResendingEmail] = useState(null);

  useEffect(() => {
    const data = localStorage.getItem("user_data");
    if (!data) {
      navigate("/user/login");
      return;
    }
    const parsedData = JSON.parse(data);
    setUserData(parsedData);
    
    // Fetch visitors and alumni meeting this user
    fetchMeetings(parsedData);
  }, []);

  const fetchMeetings = async (userData) => {
    try {
      setLoadingMeetings(true);
      const personId = userData.data.reg_no || userData.data.faculty_id;
      console.log("Fetching meetings for person ID:", personId);
      
      // Fetch visitors
      const visitorsResponse = await axios.get(
        `${BACKEND_URL}/api/visitors/meeting/${personId}`
      );
      console.log("Visitors response:", visitorsResponse.data);
      setVisitors(visitorsResponse.data || []);
      
      // Fetch alumni
      const alumniResponse = await axios.get(
        `${BACKEND_URL}/api/alumni/meeting/${personId}`
      );
      console.log("Alumni response:", alumniResponse.data);
      setAlumni(alumniResponse.data || []);
    } catch (error) {
      console.error("Error fetching meetings:", error);
      setVisitors([]);
      setAlumni([]);
    } finally {
      setLoadingMeetings(false);
    }
  };

  const fetchRegisteredVisitors = async (facultyId) => {
    try {
      setLoadingVisitors(true);
      const response = await axios.get(
        `${BACKEND_URL}/api/faculty/${facultyId}/registered-visitors`
      );
      setRegisteredVisitors(response.data || []);
    } catch (error) {
      console.error("Error fetching registered visitors:", error);
      toast.error("Failed to fetch registered visitors");
      setRegisteredVisitors([]);
    } finally {
      setLoadingVisitors(false);
    }
  };

  const handleRegisterVisitor = async (e) => {
    e.preventDefault();
    
    if (!visitorFormData.name || !visitorFormData.email || !visitorFormData.mobile_no || 
        !visitorFormData.date_from || !visitorFormData.date_to || !visitorFormData.valid_till) {
      toast.error("Please fill all required fields");
      return;
    }

    try {
      setRegistering(true);
      const facultyId = userData.data.faculty_id;
      
      const response = await axios.post(
        `${BACKEND_URL}/api/faculty/register-visitor`,
        {
          faculty_id: facultyId,
          visitor_type: visitorFormData.visitor_type,
          name: visitorFormData.name,
          email: visitorFormData.email,
          mobile_no: visitorFormData.mobile_no,
          date_from: visitorFormData.date_from,
          date_to: visitorFormData.date_to,
          valid_till: visitorFormData.valid_till,
        }
      );

      toast.success(`Visitor registered! QR code sent to ${visitorFormData.email}`);
      
      // Reset form
      setVisitorFormData({
        visitor_type: "HR",
        name: "",
        email: "",
        mobile_no: "",
        date_from: "",
        date_to: "",
        valid_till: "",
      });

      // Refresh the list
      fetchRegisteredVisitors(facultyId);
    } catch (error) {
      console.error("Error registering visitor:", error);
      toast.error(error.response?.data?.detail || "Failed to register visitor");
    } finally {
      setRegistering(false);
    }
  };

  const handleResendEmail = async (visitorId) => {
    try {
      setResendingEmail(visitorId);
      
      const response = await axios.post(
        `${BACKEND_URL}/api/faculty/visitor/resend-email`,
        { visitor_id: visitorId }
      );

      toast.success(response.data.message);
    } catch (error) {
      console.error("Error resending email:", error);
      toast.error(error.response?.data?.detail || "Failed to resend email");
    } finally {
      setResendingEmail(null);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("user_data");
    navigate("/user/login");
  };

  if (!userData) return null;

  const user = userData.data;
  const isStudent = userData.role === "student";

  return (
    <div className="min-h-screen bg-slate-50" data-testid="user-portal">
      {/* Header */}
      <header className="bg-white border-b border-slate-200">
        <div className="container mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <ShieldCheck className="w-8 h-8 text-slate-900" />
            <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
              PICT Guard
            </h1>
          </div>
          <div className="flex items-center gap-3">
            <Dialog open={showProfileModal} onOpenChange={setShowProfileModal}>
              <DialogTrigger asChild>
                <Button
                  variant="secondary"
                  className="text-slate-900"
                  data-testid="user-profile-btn"
                >
                  <User className="w-4 h-4 mr-2" />
                  Profile
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-2xl bg-white">
                <DialogHeader>
                  <DialogTitle>Profile Information</DialogTitle>
                </DialogHeader>
                {user && (
                  <div className="space-y-6 mt-4">
                    <div className="grid grid-cols-2 gap-6">
                      <div>
                        <p className="text-sm text-slate-500 uppercase tracking-wider mb-2">
                          Full Name
                        </p>
                        <p className="text-lg font-semibold text-slate-900">
                          {user.name}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm text-slate-500 uppercase tracking-wider mb-2">
                          {isStudent ? "Registration Number" : "Faculty ID"}
                        </p>
                        <p className="text-lg font-semibold text-slate-900 font-mono">
                          {isStudent ? user.reg_no : user.faculty_id}
                        </p>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-6">
                      <div>
                        <div className="flex items-center gap-2 mb-2">
                          <Mail className="w-4 h-4 text-slate-400" />
                          <p className="text-sm text-slate-500 uppercase tracking-wider">
                            Email
                          </p>
                        </div>
                        <p className="text-slate-700">{user.email}</p>
                      </div>
                      <div>
                        <div className="flex items-center gap-2 mb-2">
                          <Phone className="w-4 h-4 text-slate-400" />
                          <p className="text-sm text-slate-500 uppercase tracking-wider">
                            Mobile
                          </p>
                        </div>
                        <p className="text-slate-700">{user.mobile_no}</p>
                      </div>
                    </div>

                    {!isStudent && (
                      <>
                        <div className="grid grid-cols-2 gap-6">
                          <div>
                            <div className="flex items-center gap-2 mb-2">
                              <Briefcase className="w-4 h-4 text-slate-400" />
                              <p className="text-sm text-slate-500 uppercase tracking-wider">
                                Department
                              </p>
                            </div>
                            <p className="text-slate-700">{user.department}</p>
                          </div>
                          <div>
                            <div className="flex items-center gap-2 mb-2">
                              <MapPin className="w-4 h-4 text-slate-400" />
                              <p className="text-sm text-slate-500 uppercase tracking-wider">
                                Building/Office
                              </p>
                            </div>
                            <p className="text-slate-700">
                              {user.building || "N/A"}
                            </p>
                          </div>
                        </div>
                      </>
                    )}

                    {isStudent && (
                      <div>
                        <div className="flex items-center gap-2 mb-2">
                          <Briefcase className="w-4 h-4 text-slate-400" />
                          <p className="text-sm text-slate-500 uppercase tracking-wider">
                            Department
                          </p>
                        </div>
                        <p className="text-slate-700">{user.department || "N/A"}</p>
                      </div>
                    )}

                    <div className="p-4 bg-sky-50 rounded-lg border border-sky-200">
                      <p className="text-sm text-sky-900">
                        <strong>Valid Till:</strong>{" "}
                        {new Date(user.valid_till).toLocaleDateString("en-US", {
                          year: "numeric",
                          month: "long",
                          day: "numeric",
                        })}
                      </p>
                    </div>
                  </div>
                )}
              </DialogContent>
            </Dialog>
            <Dialog open={showVisitorsModal} onOpenChange={setShowVisitorsModal}>
              <DialogTrigger asChild>
                <Button
                  variant="secondary"
                  className="text-slate-900"
                  data-testid="user-visitors-btn"
                >
                  <Users className="w-4 h-4 mr-2" />
                  Visitors
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-3xl bg-white max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                  <DialogTitle>Incoming Meetings</DialogTitle>
                </DialogHeader>
                {loadingMeetings ? (
                  <p className="text-slate-600 text-center py-8">Loading meetings...</p>
                ) : visitors.length === 0 && alumni.length === 0 ? (
                  <div className="text-center py-8 px-4 bg-slate-50 rounded-lg">
                    <p className="text-slate-600">No incoming visitors or alumni scheduled</p>
                  </div>
                ) : (
                  <div className="space-y-6 mt-4">
                    {/* Visitors Section */}
                    {visitors.length > 0 && (
                      <div>
                        <h4 className="text-lg font-semibold text-slate-900 mb-4 pb-2 border-b-2 border-blue-200">
                          👥 Visitors
                        </h4>
                        <div className="space-y-4">
                          {visitors.map((visitor) => (
                            <div
                              key={visitor.token}
                              className="border border-slate-200 rounded-lg p-4 bg-blue-50"
                            >
                              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                  <p className="text-xs text-slate-500 uppercase tracking-wider mb-1 font-semibold">
                                    Name
                                  </p>
                                  <p className="text-lg font-semibold text-slate-900">
                                    {visitor.full_name}
                                  </p>
                                </div>
                                <div>
                                  <p className="text-xs text-slate-500 uppercase tracking-wider mb-1 font-semibold">
                                    Visitor Type
                                  </p>
                                  <span className="inline-block px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-xs font-medium capitalize">
                                    {visitor.visitor_type}
                                  </span>
                                </div>
                                <div>
                                  <p className="text-xs text-slate-500 uppercase tracking-wider mb-1 font-semibold">
                                    Contact
                                  </p>
                                  <p className="text-slate-700 text-sm">{visitor.phone_number}</p>
                                  <p className="text-slate-600 text-xs">{visitor.email}</p>
                                </div>
                                <div>
                                  <p className="text-xs text-slate-500 uppercase tracking-wider mb-1 font-semibold">
                                    Purpose
                                  </p>
                                  <p className="text-slate-700 text-sm">{visitor.purpose}</p>
                                </div>
                                <div className="md:col-span-2">
                                  <p className="text-xs text-slate-500 uppercase tracking-wider mb-1 font-semibold">
                                    Valid Till
                                  </p>
                                  <p className="text-slate-700 text-sm">
                                    {new Date(visitor.valid_till).toLocaleDateString("en-US", {
                                      year: "numeric",
                                      month: "long",
                                      day: "numeric",
                                    })}
                                  </p>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Alumni Section */}
                    {alumni.length > 0 && (
                      <div>
                        <h4 className="text-lg font-semibold text-slate-900 mb-4 pb-2 border-b-2 border-green-200">
                          🎓 Alumni
                        </h4>
                        <div className="space-y-4">
                          {alumni.map((alumnus) => (
                            <div
                              key={alumnus.token}
                              className="border border-slate-200 rounded-lg p-4 bg-green-50"
                            >
                              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                  <p className="text-xs text-slate-500 uppercase tracking-wider mb-1 font-semibold">
                                    Name
                                  </p>
                                  <p className="text-lg font-semibold text-slate-900">
                                    {alumnus.first_name} {alumnus.last_name}
                                  </p>
                                </div>
                                <div>
                                  <p className="text-xs text-slate-500 uppercase tracking-wider mb-1 font-semibold">
                                    Enrollment Number
                                  </p>
                                  <p className="text-slate-700 font-mono text-sm">
                                    {alumnus.enrollment_number}
                                  </p>
                                </div>
                                <div>
                                  <p className="text-xs text-slate-500 uppercase tracking-wider mb-1 font-semibold">
                                    Contact
                                  </p>
                                  <p className="text-slate-700 text-sm">{alumnus.mobile_no}</p>
                                  <p className="text-slate-600 text-xs">{alumnus.email}</p>
                                </div>
                                <div>
                                  <p className="text-xs text-slate-500 uppercase tracking-wider mb-1 font-semibold">
                                    Degree / Department
                                  </p>
                                  <p className="text-slate-700 text-sm">
                                    {alumnus.degree} - {alumnus.department}
                                  </p>
                                </div>
                                <div className="md:col-span-2">
                                  <p className="text-xs text-slate-500 uppercase tracking-wider mb-1 font-semibold">
                                    Valid Till
                                  </p>
                                  <p className="text-slate-700 text-sm">
                                    {new Date(alumnus.valid_till).toLocaleDateString("en-US", {
                                      year: "numeric",
                                      month: "long",
                                      day: "numeric",
                                    })}
                                  </p>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </DialogContent>
            </Dialog>
            {!isStudent && (
              <Dialog open={showRegisterVisitorModal} onOpenChange={setShowRegisterVisitorModal}>
                <DialogTrigger asChild>
                  <Button
                    variant="secondary"
                    className="text-slate-900"
                    onClick={() => fetchRegisteredVisitors(userData.data.faculty_id)}
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    Register Visitor
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-2xl bg-white max-h-[90vh] overflow-y-auto">
                  <DialogHeader>
                    <DialogTitle>Register Visitor (HR, Relative, Other Faculty, Student, etc.)</DialogTitle>
                  </DialogHeader>
                  
                  {/* Registration Form */}
                  <form onSubmit={handleRegisterVisitor} className="space-y-6 mt-6">
                    {/* Visitor Type Section */}
                    <div className="bg-gradient-to-br from-blue-50 to-indigo-50 p-4 rounded-lg border border-blue-200">
                      <Label htmlFor="visitor_type" className="text-sm font-bold text-slate-700 uppercase tracking-wide">
                        👤 Visitor Type <span className="text-red-500">*</span>
                      </Label>
                      <select
                        id="visitor_type"
                        value={visitorFormData.visitor_type}
                        onChange={(e) => setVisitorFormData({...visitorFormData, visitor_type: e.target.value})}
                        className="w-full mt-3 px-4 py-3 border-2 border-blue-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent bg-white font-medium"
                      >
                        <option value="HR">🏢 HR</option>
                        <option value="Relative">👨‍👩‍👧 Relative</option>
                        <option value="Other Faculty">👨‍🎓 Other Faculty</option>
                        <option value="Student">📚 Student</option>
                        <option value="Other">❓ Other</option>
                      </select>
                    </div>

                    {/* Personal Info Section */}
                    <div className="bg-gradient-to-br from-purple-50 to-pink-50 p-4 rounded-lg border border-purple-200 space-y-4">
                      <h3 className="text-sm font-bold text-slate-700 uppercase tracking-wide">📋 Personal Information</h3>
                      
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor="name" className="text-sm font-semibold text-slate-700">
                            Full Name <span className="text-red-500">*</span>
                          </Label>
                          <Input
                            id="name"
                            placeholder="e.g., John Doe"
                            value={visitorFormData.name}
                            onChange={(e) => setVisitorFormData({...visitorFormData, name: e.target.value})}
                            className="mt-2 border-2 border-purple-200 focus:border-purple-500"
                            required
                          />
                        </div>
                        
                        <div>
                          <Label htmlFor="mobile_no" className="text-sm font-semibold text-slate-700">
                            Mobile No <span className="text-red-500">*</span>
                          </Label>
                          <Input
                            id="mobile_no"
                            placeholder="10-digit number"
                            value={visitorFormData.mobile_no}
                            onChange={(e) => setVisitorFormData({...visitorFormData, mobile_no: e.target.value})}
                            className="mt-2 border-2 border-purple-200 focus:border-purple-500"
                            required
                          />
                        </div>
                      </div>

                      <div>
                        <Label htmlFor="email" className="text-sm font-semibold text-slate-700">
                          Email Address <span className="text-red-500">*</span>
                        </Label>
                        <Input
                          id="email"
                          type="email"
                          placeholder="email@example.com"
                          value={visitorFormData.email}
                          onChange={(e) => setVisitorFormData({...visitorFormData, email: e.target.value})}
                          className="mt-2 border-2 border-purple-200 focus:border-purple-500"
                          required
                        />
                        <p className="text-xs text-slate-600 mt-1">✉️ QR code will be sent to this email</p>
                      </div>
                    </div>

                    {/* Validity Period Section */}
                    <div className="bg-gradient-to-br from-green-50 to-emerald-50 p-4 rounded-lg border border-green-200 space-y-4">
                      <h3 className="text-sm font-bold text-slate-700 uppercase tracking-wide">📅 Validity Period</h3>
                      
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor="date_from" className="text-sm font-semibold text-slate-700">
                            Valid From <span className="text-red-500">*</span>
                          </Label>
                          <Input
                            id="date_from"
                            type="date"
                            value={visitorFormData.date_from}
                            onChange={(e) => setVisitorFormData({...visitorFormData, date_from: e.target.value})}
                            className="mt-2 border-2 border-green-300 focus:border-green-500"
                            required
                          />
                        </div>
                        
                        <div>
                          <Label htmlFor="date_to" className="text-sm font-semibold text-slate-700">
                            Valid Till <span className="text-red-500">*</span>
                          </Label>
                          <Input
                            id="date_to"
                            type="date"
                            value={visitorFormData.date_to}
                            onChange={(e) => {
                              const newDateTo = e.target.value;
                              setVisitorFormData({
                                ...visitorFormData,
                                date_to: newDateTo,
                                valid_till: `${newDateTo}T23:59`,
                              });
                            }}
                            className="mt-2 border-2 border-green-300 focus:border-green-500"
                            required
                          />
                        </div>
                      </div>
                      <p className="text-xs text-slate-600 bg-white p-2 rounded border border-green-200">
                        ℹ️ QR code automatically valid until 23:59 on the selected date
                      </p>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex gap-3 pt-2">
                      <Button
                        type="submit"
                        disabled={registering}
                        className="flex-1 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-semibold py-3 rounded-lg transition-all shadow-md hover:shadow-lg"
                      >
                        {registering ? (
                          <>
                            <div className="animate-spin mr-2">⏳</div>
                            Registering...
                          </>
                        ) : (
                          <>
                            ✅ Register & Send QR
                          </>
                        )}
                      </Button>
                      <Button
                        type="button"
                        onClick={() => setShowRegisterVisitorModal(false)}
                        variant="outline"
                        className="px-6"
                      >
                        ✕ Cancel
                      </Button>
                    </div>
                  </form>

                  {/* Divider */}
                  <div className="border-t-2 border-slate-300 my-8"></div>

                  {/* Registered Visitors Section */}
                  <div>
                    <h3 className="text-lg font-bold text-slate-900 mb-4 flex items-center gap-2">
                      👥 Registered Visitors
                    </h3>
                    
                    {loadingVisitors ? (
                      <p className="text-slate-600 text-center py-4">Loading visitors...</p>
                    ) : registeredVisitors.length === 0 ? (
                      <div className="text-center py-4 px-4 bg-slate-50 rounded-lg">
                        <p className="text-slate-600">No registered visitors yet</p>
                      </div>
                    ) : (
                      <div className="space-y-3 max-h-64 overflow-y-auto">
                        {registeredVisitors.map((visitor) => (
                          <div
                            key={visitor.visitor_id}
                            className="border border-slate-200 rounded-lg p-4 bg-slate-50 flex justify-between items-start"
                          >
                            <div className="flex-1">
                              <div className="flex items-center gap-2 mb-2">
                                <span className="font-semibold text-slate-900">{visitor.name}</span>
                                <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded capitalize">
                                  {visitor.visitor_type}
                                </span>
                              </div>
                              <p className="text-xs text-slate-600 mb-1">📧 {visitor.email}</p>
                              <p className="text-xs text-slate-600 mb-1">📞 {visitor.mobile_no}</p>
                              <p className="text-xs text-slate-500">
                                Valid: {new Date(visitor.date_from).toLocaleDateString()} - {new Date(visitor.date_to).toLocaleDateString()}
                              </p>
                            </div>
                            <Button
                              onClick={() => handleResendEmail(visitor.visitor_id)}
                              disabled={resendingEmail === visitor.visitor_id}
                              size="sm"
                              variant="outline"
                              className="text-blue-600 hover:text-blue-700 ml-2"
                            >
                              <Send className="w-4 h-4 mr-1" />
                              {resendingEmail === visitor.visitor_id ? "Sending..." : "Resend"}
                            </Button>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </DialogContent>
              </Dialog>
            )}
            <Button
              onClick={handleLogout}
              variant="ghost"
              className="text-slate-600 hover:text-slate-900"
              data-testid="user-logout-btn"
            >
              <LogOut className="w-4 h-4 mr-2" />
              Logout
            </Button>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-6 py-12 max-w-2xl">
        {/* ID Card */}
        <div
          className="bg-white border border-slate-200 rounded-xl shadow-lg overflow-hidden"
          data-testid="id-card"
        >
          {/* Card Header */}
          <div className="bg-gradient-to-br from-slate-900 to-slate-800 p-6 text-white">
            <div className="flex items-center gap-3 mb-2">
              <ShieldCheck className="w-8 h-8" />
              <div>
                <h2 className="text-2xl font-bold tracking-tight">
                  PICT Guard
                </h2>
                <p className="text-slate-300 text-sm">
                  {isStudent ? "Student" : "Faculty"} Gate Pass
                </p>
              </div>
            </div>
          </div>

          {/* Card Body */}
          <div className="p-8">
            {/* Profile Info */}
            <div className="mb-8">
              {isStudent && (
                <p className="text-sm text-slate-500 uppercase tracking-wider mb-1">
                  Registration Number
                </p>
              )}
              {!isStudent && (
                <p className="text-sm text-slate-500 uppercase tracking-wider mb-1">
                  Faculty ID
                </p>
              )}
              <p
                className="text-2xl font-bold text-slate-900 font-mono mb-4"
                data-testid="user-id"
              >
                {isStudent ? user.reg_no : user.faculty_id}
              </p>

              <p className="text-sm text-slate-500 uppercase tracking-wider mb-1">
                Name
              </p>
              <p
                className="text-xl font-semibold text-slate-900 mb-4"
                data-testid="user-name"
              >
                {user.name}
              </p>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-slate-500 uppercase tracking-wider mb-1">
                    Email
                  </p>
                  <p
                    className="text-sm text-slate-700"
                    data-testid="user-email"
                  >
                    {user.email}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-slate-500 uppercase tracking-wider mb-1">
                    Mobile
                  </p>
                  <p
                    className="text-sm text-slate-700"
                    data-testid="user-mobile"
                  >
                    {user.mobile_no}
                  </p>
                </div>
              </div>

              {!isStudent && (
                <div className="mt-4">
                  <p className="text-sm text-slate-500 uppercase tracking-wider mb-1">
                    Department
                  </p>
                  <p className="text-sm text-slate-700">{user.department}</p>
                </div>
              )}
            </div>

            {/* QR Code */}
            <div className="flex flex-col items-center">
              <div
                className="bg-white p-4 rounded-lg border border-slate-200"
                data-testid="qr-code-container"
              >
                <QRCodeSVG value={user.token} size={200} level="H" />
              </div>
              <div className="mt-4 text-center">
                <p className="text-sm text-slate-500 uppercase tracking-wider mb-1">
                  Valid Until
                </p>
                <p
                  className="text-lg font-semibold text-slate-900 font-mono"
                  data-testid="valid-till"
                >
                  {new Date(user.valid_till).toLocaleDateString("en-US", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}
                </p>
              </div>
            </div>

            {/* Instructions */}
            <div className="mt-8 p-4 bg-sky-50 rounded-lg border border-sky-200">
              <p className="text-sm text-sky-900">
                <strong>Instructions:</strong> Show this QR code to the guard at
                the gate for entry. Ensure the code is clearly visible and not
                expired.
              </p>
            </div>

            {/* Faculty Only: Register Visitor Button */}
            {!isStudent && (
              <div className="mt-6 pt-6 border-t-2 border-slate-300">
                <Dialog open={showRegisterVisitorModal} onOpenChange={setShowRegisterVisitorModal}>
                  <DialogTrigger asChild>
                    <Button
                      onClick={() => fetchRegisteredVisitors(userData.data.faculty_id)}
                      className="w-full bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white font-semibold py-3 rounded-lg transition-all shadow-md hover:shadow-lg"
                    >
                      <Plus className="w-5 h-5 mr-2" />
                      Register New Visitor
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="max-w-2xl bg-white max-h-[90vh] overflow-y-auto">
                    <DialogHeader>
                      <DialogTitle>Register Visitor & Send QR Code</DialogTitle>
                    </DialogHeader>
                    
                    {/* Registration Form */}
                    <form onSubmit={handleRegisterVisitor} className="space-y-6 mt-6">
                      {/* Visitor Type Section */}
                      <div className="bg-gradient-to-br from-blue-50 to-indigo-50 p-4 rounded-lg border border-blue-200">
                        <Label htmlFor="visitor_type_main" className="text-sm font-bold text-slate-700 uppercase tracking-wide">
                          👤 Visitor Type <span className="text-red-500">*</span>
                        </Label>
                        <select
                          id="visitor_type_main"
                          value={visitorFormData.visitor_type}
                          onChange={(e) => setVisitorFormData({...visitorFormData, visitor_type: e.target.value})}
                          className="w-full mt-3 px-4 py-3 border-2 border-blue-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent bg-white font-medium"
                        >
                          <option value="HR">🏢 HR</option>
                          <option value="Relative">👨‍👩‍👧 Relative</option>
                          <option value="Other Faculty">👨‍🎓 Other Faculty</option>
                          <option value="Student">📚 Student</option>
                          <option value="Other">❓ Other</option>
                        </select>
                      </div>

                      {/* Personal Info Section */}
                      <div className="bg-gradient-to-br from-purple-50 to-pink-50 p-4 rounded-lg border border-purple-200 space-y-4">
                        <h3 className="text-sm font-bold text-slate-700 uppercase tracking-wide">📋 Personal Information</h3>
                        
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <Label htmlFor="name_main" className="text-sm font-semibold text-slate-700">
                              Full Name <span className="text-red-500">*</span>
                            </Label>
                            <Input
                              id="name_main"
                              placeholder="e.g., John Doe"
                              value={visitorFormData.name}
                              onChange={(e) => setVisitorFormData({...visitorFormData, name: e.target.value})}
                              className="mt-2 border-2 border-purple-200 focus:border-purple-500"
                              required
                            />
                          </div>
                          
                          <div>
                            <Label htmlFor="mobile_no_main" className="text-sm font-semibold text-slate-700">
                              Mobile No <span className="text-red-500">*</span>
                            </Label>
                            <Input
                              id="mobile_no_main"
                              placeholder="10-digit number"
                              value={visitorFormData.mobile_no}
                              onChange={(e) => setVisitorFormData({...visitorFormData, mobile_no: e.target.value})}
                              className="mt-2 border-2 border-purple-200 focus:border-purple-500"
                              required
                            />
                          </div>
                        </div>

                        <div>
                          <Label htmlFor="email_main" className="text-sm font-semibold text-slate-700">
                            Email Address <span className="text-red-500">*</span>
                          </Label>
                          <Input
                            id="email_main"
                            type="email"
                            placeholder="email@example.com"
                            value={visitorFormData.email}
                            onChange={(e) => setVisitorFormData({...visitorFormData, email: e.target.value})}
                            className="mt-2 border-2 border-purple-200 focus:border-purple-500"
                            required
                          />
                          <p className="text-xs text-slate-600 mt-1">✉️ QR code will be sent to this email</p>
                        </div>
                      </div>

                      {/* Validity Period Section */}
                      <div className="bg-gradient-to-br from-green-50 to-emerald-50 p-4 rounded-lg border border-green-200 space-y-4">
                        <h3 className="text-sm font-bold text-slate-700 uppercase tracking-wide">📅 Validity Period</h3>
                        
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <Label htmlFor="date_from_main" className="text-sm font-semibold text-slate-700">
                              Valid From <span className="text-red-500">*</span>
                            </Label>
                            <Input
                              id="date_from_main"
                              type="date"
                              value={visitorFormData.date_from}
                              onChange={(e) => setVisitorFormData({...visitorFormData, date_from: e.target.value})}
                              className="mt-2 border-2 border-green-300 focus:border-green-500"
                              required
                            />
                          </div>
                          
                          <div>
                            <Label htmlFor="date_to_main" className="text-sm font-semibold text-slate-700">
                              Valid Till <span className="text-red-500">*</span>
                            </Label>
                            <Input
                              id="date_to_main"
                              type="date"
                              value={visitorFormData.date_to}
                              onChange={(e) => {
                                const newDateTo = e.target.value;
                                setVisitorFormData({
                                  ...visitorFormData,
                                  date_to: newDateTo,
                                  valid_till: `${newDateTo}T23:59`,
                                });
                              }}
                              className="mt-2 border-2 border-green-300 focus:border-green-500"
                              required
                            />
                          </div>
                        </div>
                        <p className="text-xs text-slate-600 bg-white p-2 rounded border border-green-200">
                          ℹ️ QR code automatically valid until 23:59 on the selected date
                        </p>
                      </div>

                      {/* Action Buttons */}
                      <div className="flex gap-3 pt-2">
                        <Button
                          type="submit"
                          disabled={registering}
                          className="flex-1 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-semibold py-3 rounded-lg transition-all shadow-md hover:shadow-lg"
                        >
                          {registering ? (
                            <>
                              <div className="animate-spin mr-2">⏳</div>
                              Registering...
                            </>
                          ) : (
                            <>
                              ✅ Register & Send QR
                            </>
                          )}
                        </Button>
                        <Button
                          type="button"
                          onClick={() => setShowRegisterVisitorModal(false)}
                          variant="outline"
                          className="px-6"
                        >
                          ✕ Cancel
                        </Button>
                      </div>
                    </form>

                    {/* Divider */}
                    <div className="border-t-2 border-slate-300 my-8"></div>

                    {/* Registered Visitors Section */}
                    <div>
                      <h3 className="text-lg font-bold text-slate-900 mb-4 flex items-center gap-2">
                        👥 Registered Visitors
                      </h3>
                      
                      {loadingVisitors ? (
                        <p className="text-slate-600 text-center py-4">Loading visitors...</p>
                      ) : registeredVisitors.length === 0 ? (
                        <div className="text-center py-4 px-4 bg-slate-50 rounded-lg">
                          <p className="text-slate-600">No registered visitors yet</p>
                        </div>
                      ) : (
                        <div className="space-y-3 max-h-64 overflow-y-auto">
                          {registeredVisitors.map((visitor) => (
                            <div
                              key={visitor.visitor_id}
                              className="border border-slate-200 rounded-lg p-4 bg-slate-50 hover:bg-slate-100 transition"
                            >
                              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                <div>
                                  <p className="text-xs text-slate-500 uppercase tracking-wider font-semibold mb-1">
                                    Name
                                  </p>
                                  <p className="text-sm font-semibold text-slate-900">{visitor.name}</p>
                                </div>
                                <div>
                                  <p className="text-xs text-slate-500 uppercase tracking-wider font-semibold mb-1">
                                    Type
                                  </p>
                                  <span className="inline-block px-2 py-1 bg-blue-100 text-blue-800 rounded text-xs font-medium">
                                    {visitor.visitor_type}
                                  </span>
                                </div>
                                <div>
                                  <p className="text-xs text-slate-500 uppercase tracking-wider font-semibold mb-1">
                                    Email
                                  </p>
                                  <p className="text-xs text-slate-700">{visitor.email}</p>
                                </div>
                                <div>
                                  <p className="text-xs text-slate-500 uppercase tracking-wider font-semibold mb-1">
                                    Mobile
                                  </p>
                                  <p className="text-xs text-slate-700">{visitor.mobile_no}</p>
                                </div>
                                <div className="md:col-span-2">
                                  <p className="text-xs text-slate-500 uppercase tracking-wider font-semibold mb-1">
                                    Valid Period
                                  </p>
                                  <p className="text-xs text-slate-700">
                                    {new Date(visitor.date_from).toLocaleDateString()} to{" "}
                                    {new Date(visitor.date_to).toLocaleDateString()}
                                  </p>
                                </div>
                              </div>
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => handleResendEmail(visitor.visitor_id)}
                                disabled={resendingEmail === visitor.visitor_id}
                                className="mt-3 w-full"
                              >
                                <Send className="w-4 h-4 mr-1" />
                                {resendingEmail === visitor.visitor_id ? "Sending..." : "Resend QR Email"}
                              </Button>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </DialogContent>
                </Dialog>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}