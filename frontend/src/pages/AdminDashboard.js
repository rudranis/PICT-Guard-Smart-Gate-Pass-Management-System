import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import {
  ShieldCheck,
  LogOut,
  Users,
  Calendar,
  ScanLine,
  School,
  Upload,
  Plus,
  Download,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "sonner";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;

export default function AdminDashboard() {
  const navigate = useNavigate();
  const [stats, setStats] = useState({});
  const [students, setStudents] = useState([]);
  const [faculty, setFaculty] = useState([]);
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (typeof window === 'undefined') return; // Check for browser environment
    const token = localStorage.getItem("admin_token");
    if (!token) {
      navigate("/admin/login");
      return;
    }
    fetchStats();
    fetchStudents();
    fetchFaculty();
    fetchEvents();
  }, [navigate]);

  const fetchStats = async () => {
    try {
      const response = await axios.get(`${BACKEND_URL}/api/dashboard/stats`);
      setStats(response.data);
    } catch (error) {
      toast.error("Failed to fetch stats");
    }
  };

  const fetchStudents = async () => {
    try {
      const response = await axios.get(`${BACKEND_URL}/api/students`);
      setStudents(response.data);
    } catch (error) {
      console.error(error);
    }
  };

  const fetchFaculty = async () => {
    try {
      const response = await axios.get(`${BACKEND_URL}/api/faculty`);
      setFaculty(response.data);
    } catch (error) {
      console.error(error);
    }
  };

  const fetchEvents = async () => {
    try {
      const response = await axios.get(`${BACKEND_URL}/api/events`);
      setEvents(response.data);
    } catch (error) {
      console.error(error);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("admin_token");
    navigate("/admin/login");
  };

  return (
    <div className="min-h-screen bg-slate-50" data-testid="admin-dashboard">
      {/* Header */}
      <header className="bg-white border-b border-slate-200">
        <div className="container mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <ShieldCheck className="w-8 h-8 text-slate-900" />
            <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
              PICT Guard Admin
            </h1>
          </div>
          <Button
            onClick={handleLogout}
            variant="ghost"
            className="text-slate-600 hover:text-slate-900"
            data-testid="admin-logout-btn"
          >
            <LogOut className="w-4 h-4 mr-2" />
            Logout
          </Button>
        </div>
      </header>

      <div className="container mx-auto px-6 py-8">
        {/* Stats Cards */}
        <div className="grid md:grid-cols-2 lg:grid-cols-5 gap-6 mb-8">
          <div
            className="bg-white border border-slate-200 rounded-lg p-6"
            data-testid="stat-visitors"
          >
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-slate-500 uppercase tracking-wider">
                Visitors Today
              </span>
              <Users className="w-5 h-5 text-slate-400" />
            </div>
            <p className="text-3xl font-bold text-slate-900">
              {stats.visitors_today || 0}
            </p>
          </div>

          <div
            className="bg-white border border-slate-200 rounded-lg p-6"
            data-testid="stat-students"
          >
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-slate-500 uppercase tracking-wider">
                Total Students
              </span>
              <School className="w-5 h-5 text-slate-400" />
            </div>
            <p className="text-3xl font-bold text-slate-900">
              {stats.total_students || 0}
            </p>
          </div>

          <div
            className="bg-white border border-slate-200 rounded-lg p-6"
            data-testid="stat-faculty"
          >
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-slate-500 uppercase tracking-wider">
                Total Faculty
              </span>
              <Users className="w-5 h-5 text-slate-400" />
            </div>
            <p className="text-3xl font-bold text-slate-900">
              {stats.total_faculty || 0}
            </p>
          </div>

          <div
            className="bg-white border border-slate-200 rounded-lg p-6"
            data-testid="stat-events"
          >
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-slate-500 uppercase tracking-wider">
                Total Events
              </span>
              <Calendar className="w-5 h-5 text-slate-400" />
            </div>
            <p className="text-3xl font-bold text-slate-900">
              {stats.total_events || 0}
            </p>
          </div>

          <div
            className="bg-white border border-slate-200 rounded-lg p-6"
            data-testid="stat-registered-visitors"
          >
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-slate-500 uppercase tracking-wider">
                Registered Visitors
              </span>
              <Users className="w-5 h-5 text-slate-400" />
            </div>
            <p className="text-3xl font-bold text-slate-900">
              {stats.total_registered_visitors || 0}
            </p>
          </div>
        </div>

        {/* Tabs */}
        <Tabs defaultValue="students" className="w-full">
          <TabsList className="bg-white border border-slate-200">
            <TabsTrigger value="students" data-testid="tab-students">
              Students
            </TabsTrigger>
            <TabsTrigger value="faculty" data-testid="tab-faculty">
              Faculty
            </TabsTrigger>
            <TabsTrigger value="events" data-testid="tab-events">
              Events
            </TabsTrigger>
            <TabsTrigger value="visitors" data-testid="tab-visitors">
              Visitors
            </TabsTrigger>
            <TabsTrigger value="registered-visitors" data-testid="tab-registered-visitors">
              Registered Visitors
            </TabsTrigger>
            <TabsTrigger value="alumni" data-testid="tab-alumni">
              Alumni
            </TabsTrigger>
          </TabsList>

          <TabsContent value="students">
            <StudentsTab students={students} fetchStudents={fetchStudents} />
          </TabsContent>

          <TabsContent value="faculty">
            <FacultyTab faculty={faculty} fetchFaculty={fetchFaculty} />
          </TabsContent>

          <TabsContent value="events">
            <EventsTab
              events={events}
              fetchEvents={fetchEvents}
              students={students}
            />
          </TabsContent>

          <TabsContent value="visitors">
            <VisitorsTab />
          </TabsContent>

          <TabsContent value="registered-visitors">
            <RegisteredVisitorsTab />
          </TabsContent>

          <TabsContent value="alumni">
            <AlumniTab />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}

// Students Tab Component
function StudentsTab({ students, fetchStudents }) {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [showDetails, setShowDetails] = useState(false);
  const [formData, setFormData] = useState({
    reg_no: "",
    name: "",
    email: "",
    mobile_no: "",
    dob: "",
    current_year: 1,
    department: "",
  });
  const [bulkFile, setBulkFile] = useState(null);
  const [loading, setLoading] = useState(false);

  // Filter students based on search query
  const filteredStudents = students.filter((student) => {
    const query = searchQuery.toLowerCase();
    return (
      (student.reg_no && student.reg_no.toLowerCase().includes(query)) ||
      (student.name && student.name.toLowerCase().includes(query)) ||
      (student.email && student.email.toLowerCase().includes(query)) ||
      (student.mobile_no && student.mobile_no.includes(query))
    );
  });

  const handleViewDetails = (student) => {
    setSelectedStudent(student);
    setShowDetails(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await axios.post(`${BACKEND_URL}/api/students`, formData);
      toast.success("Student added successfully!");
      setIsDialogOpen(false);
      fetchStudents();
      setFormData({
        reg_no: "",
        name: "",
        email: "",
        mobile_no: "",
        dob: "",
        current_year: 1,
        department: "",
      });
    } catch (error) {
      toast.error(error.response?.data?.detail || "Failed to add student");
    } finally {
      setLoading(false);
    }
  };

  const handleBulkUpload = async () => {
    if (!bulkFile) return;
    setLoading(true);
    const formDataBulk = new FormData();
    formDataBulk.append("file", bulkFile);

    try {
      const response = await axios.post(
        `${BACKEND_URL}/api/students/bulk`,
        formDataBulk,
      );
      toast.success(`✅ ${response.data.created} students added!`);
      
      if (response.data.duplicates > 0) {
        const duplicateMsg = `⚠️ ${response.data.duplicates} duplicate entries found and skipped`;
        toast.error(duplicateMsg, { duration: 2000 });
      }
      
      if (response.data.error_count > 0) {
        const errorMsg = `❌ ${response.data.error_count} errors occurred:\n${response.data.error_details.slice(0, 3).join("\n")}${response.data.error_details.length > 3 ? "\n..." : ""}`;
        toast.error(errorMsg, { duration: 3000 });
        if (process.env.NODE_ENV === 'development') {
          console.log("All errors:", response.data.error_details);
        }
      }
      fetchStudents();
      setBulkFile(null);
    } catch (error) {
      toast.error("Failed to upload students");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white border border-slate-200 rounded-lg p-6">
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-xl font-semibold text-slate-900">
          Student Management
        </h3>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button
              className="bg-slate-900 hover:bg-slate-800"
              data-testid="add-student-btn"
            >
              <Plus className="w-4 h-4 mr-2" />
              Add Student
            </Button>
          </DialogTrigger>
          <DialogContent
            className="max-w-md"
            data-testid="add-student-dialog"
          >
            <DialogHeader>
              <DialogTitle>Add New Student</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <Label>Registration Number</Label>
                <Input
                  value={formData.reg_no}
                  onChange={(e) =>
                    setFormData({ ...formData, reg_no: e.target.value })
                  }
                  required
                  data-testid="student-reg-no"
                />
              </div>
              <div>
                <Label>Name</Label>
                <Input
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                  required
                  data-testid="student-name"
                />
              </div>
              <div>
                <Label>Email</Label>
                <Input
                  type="email"
                  value={formData.email}
                  onChange={(e) =>
                    setFormData({ ...formData, email: e.target.value })
                  }
                  required
                  data-testid="student-email"
                />
              </div>
              <div>
                <Label>Mobile Number</Label>
                <Input
                  value={formData.mobile_no}
                  onChange={(e) =>
                    setFormData({ ...formData, mobile_no: e.target.value })
                  }
                  required
                  data-testid="student-mobile"
                />
              </div>
              <div>
                <Label>Date of Birth</Label>
                <Input
                  type="date"
                  value={formData.dob}
                  onChange={(e) =>
                    setFormData({ ...formData, dob: e.target.value })
                  }
                  required
                  data-testid="student-dob"
                />
              </div>
              <div>
                <Label>Current Year</Label>
                <Input
                  type="number"
                  min="1"
                  max="4"
                  value={formData.current_year}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      current_year: parseInt(e.target.value),
                    })
                  }
                  required
                  data-testid="student-year"
                />
              </div>
              <div>
                <Label>Department (Optional)</Label>
                <Select value={formData.department} onValueChange={(value) => setFormData({ ...formData, department: value })}>
                  <SelectTrigger data-testid="student-department">
                    <SelectValue placeholder="Select Department" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Computer Engineering">Computer Engineering</SelectItem>
                    <SelectItem value="Information Technology">Information Technology</SelectItem>
                    <SelectItem value="Electronics Engineering">Electronics Engineering</SelectItem>
                    <SelectItem value="Mechanical Engineering">Mechanical Engineering</SelectItem>
                    <SelectItem value="Civil Engineering">Civil Engineering</SelectItem>
                    <SelectItem value="Electrical Engineering">Electrical Engineering</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <Button
                type="submit"
                className="w-full"
                disabled={loading}
                data-testid="submit-student"
              >
                {loading ? "Adding..." : "Add Student"}
              </Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Search Bar */}
      <div className="mb-6">
        <Input
          placeholder="🔍 Search by Reg No, Name, Email, or Mobile..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="h-10"
        />
      </div>

      {/* Bulk Upload */}
      <div className="mb-6 p-4 bg-slate-50 rounded-lg">
        <Label>Bulk Upload (Excel)</Label>
        <div className="flex gap-2 mt-2">
          <Input
            type="file"
            accept=".xlsx,.xls"
            onChange={(e) => setBulkFile(e.target.files[0])}
            data-testid="student-bulk-file"
          />
          <Button
            onClick={handleBulkUpload}
            disabled={!bulkFile || loading}
            data-testid="student-bulk-upload"
          >
            <Upload className="w-4 h-4 mr-2" />
            Upload
          </Button>
        </div>
        <p className="text-xs text-slate-500 mt-2">
          Format: Reg No | Name | Email | Mobile | DOB | Current Year | Department (optional)
        </p>
      </div>

      {/* Table */}
      <div className="overflow-x-auto" data-testid="students-table">
        <Table>
          <TableHeader>
            <TableRow className="bg-slate-100">
              <TableHead>Reg No</TableHead>
              <TableHead>Name</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Mobile</TableHead>
              <TableHead>Year</TableHead>
              <TableHead>Department</TableHead>
              <TableHead>Valid Till</TableHead>
              <TableHead>Action</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredStudents.length === 0 ? (
              <TableRow>
                <TableCell colSpan={8} className="text-center py-8 text-slate-500">
                  {searchQuery ? "No students found matching your search" : "No students found"}
                </TableCell>
              </TableRow>
            ) : (
              filteredStudents.map((student) => (
                <TableRow key={student.reg_no} className="hover:bg-slate-50">
                  <TableCell className="font-mono font-semibold">{student.reg_no}</TableCell>
                  <TableCell>{student.name}</TableCell>
                  <TableCell className="text-sm">{student.email}</TableCell>
                  <TableCell>{student.mobile_no}</TableCell>
                  <TableCell className="text-center font-semibold">{student.current_year}</TableCell>
                  <TableCell className="text-sm">{student.department || "—"}</TableCell>
                  <TableCell className="text-sm">
                    {new Date(student.valid_till).toLocaleDateString()}
                  </TableCell>
                  <TableCell>
                    <Button
                      onClick={() => handleViewDetails(student)}
                      variant="secondary"
                      size="sm"
                      className="text-xs"
                      data-testid="student-details-btn"
                    >
                      View Information
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {/* Details Modal */}
      {showDetails && selectedStudent && (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl">
            <div className="sticky top-0 bg-gradient-to-r from-slate-900 to-slate-800 text-white p-6 flex justify-between items-center">
              <h2 className="text-2xl font-bold">Student Information</h2>
              <button
                onClick={() => setShowDetails(false)}
                className="text-white hover:text-gray-300 text-2xl font-bold"
              >
                ×
              </button>
            </div>

            <div className="p-8 space-y-6">
              {/* Registration Number */}
              <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
                <p className="text-xs text-blue-600 uppercase font-bold tracking-wider mb-2">
                  Registration Number
                </p>
                <p className="text-2xl font-bold text-blue-900 font-mono">{selectedStudent.reg_no}</p>
              </div>

              {/* Personal Info Grid */}
              <div className="space-y-2">
                <h3 className="text-lg font-bold text-slate-900 mb-4">Personal Information</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div className="p-3 bg-slate-50 rounded-lg">
                    <p className="text-xs text-slate-600 uppercase font-bold">Name</p>
                    <p className="text-lg font-semibold text-slate-900">{selectedStudent.name}</p>
                  </div>
                  <div className="p-3 bg-slate-50 rounded-lg">
                    <p className="text-xs text-slate-600 uppercase font-bold">Date of Birth</p>
                    <p className="text-slate-900 font-semibold">
                      {new Date(selectedStudent.dob).toLocaleDateString()}
                    </p>
                  </div>
                </div>
              </div>

              {/* Contact Info */}
              <div className="space-y-2">
                <h3 className="text-lg font-bold text-slate-900 mb-4">Contact Information</h3>
                <div className="grid grid-cols-1 gap-4">
                  <div className="p-3 bg-slate-50 rounded-lg">
                    <p className="text-xs text-slate-600 uppercase font-bold">Email</p>
                    <p className="text-slate-900 break-all">{selectedStudent.email}</p>
                  </div>
                  <div className="p-3 bg-slate-50 rounded-lg">
                    <p className="text-xs text-slate-600 uppercase font-bold">Mobile Number</p>
                    <p className="text-slate-900 font-semibold">{selectedStudent.mobile_no}</p>
                  </div>
                </div>
              </div>

              {/* Academic Info */}
              <div className="space-y-2">
                <h3 className="text-lg font-bold text-slate-900 mb-4">Academic Information</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div className="p-3 bg-green-50 rounded-lg border border-green-200">
                    <p className="text-xs text-green-600 uppercase font-bold">Current Year</p>
                    <p className="text-2xl font-bold text-green-900">{selectedStudent.current_year}</p>
                  </div>
                  <div className="p-3 bg-amber-50 rounded-lg border border-amber-200">
                    <p className="text-xs text-amber-600 uppercase font-bold">Valid Till</p>
                    <p className="font-semibold text-amber-900">
                      {new Date(selectedStudent.valid_till).toLocaleDateString()}
                    </p>
                  </div>
                </div>
                {selectedStudent.department && (
                  <div className="p-3 bg-purple-50 rounded-lg border border-purple-200 mt-4">
                    <p className="text-xs text-purple-600 uppercase font-bold">Department</p>
                    <p className="text-slate-900 font-semibold">{selectedStudent.department}</p>
                  </div>
                )}
              </div>

              <div className="flex gap-4 pt-6 border-t">
                <Button
                  onClick={() => setShowDetails(false)}
                  className="flex-1 bg-slate-900 hover:bg-slate-800 text-white"
                >
                  Close
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// Faculty Registered Visitors Tab Component
function RegisteredVisitorsTab() {
  const [registeredVisitors, setRegisteredVisitors] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedVisitor, setSelectedVisitor] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    fetchRegisteredVisitors();
  }, []);

  const fetchRegisteredVisitors = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`${BACKEND_URL}/api/registered-visitors`);
      setRegisteredVisitors(response.data || []);
    } catch (error) {
      toast.error("Failed to fetch registered visitors");
    } finally {
      setLoading(false);
    }
  };

  // Filter registered visitors based on search query
  const filteredVisitors = registeredVisitors.filter((visitor) => {
    const query = searchQuery.toLowerCase();
    return (
      (visitor.name && visitor.name.toLowerCase().includes(query)) ||
      (visitor.email && visitor.email.toLowerCase().includes(query)) ||
      (visitor.mobile_no && visitor.mobile_no.includes(query)) ||
      (visitor.visitor_type && visitor.visitor_type.toLowerCase().includes(query)) ||
      (visitor.faculty_name && visitor.faculty_name.toLowerCase().includes(query))
    );
  });

  const handleViewDetails = (visitor) => {
    setSelectedVisitor(visitor);
    setShowModal(true);
  };

  return (
    <div className="bg-white border border-slate-200 rounded-lg p-6">
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-xl font-semibold text-slate-900">Faculty Registered Visitors</h3>
        <Button onClick={fetchRegisteredVisitors} variant="secondary" disabled={loading}>
          Refresh
        </Button>
      </div>

      {/* Search Bar */}
      <div className="mb-6">
        <Input
          placeholder="🔍 Search by Name, Email, Mobile, Type, or Faculty..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="h-10"
        />
      </div>

      <div className="overflow-x-auto" data-testid="registered-visitors-table">
        <Table>
          <TableHeader>
            <TableRow className="bg-slate-100">
              <TableHead>Name</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Mobile</TableHead>
              <TableHead>Type</TableHead>
              <TableHead>Faculty Name</TableHead>
              <TableHead>Valid From</TableHead>
              <TableHead>Valid Till</TableHead>
              <TableHead>Registered Date</TableHead>
              <TableHead>Action</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredVisitors.length === 0 ? (
              <TableRow>
                <TableCell colSpan={9} className="text-center py-8 text-slate-500">
                  {searchQuery ? "No registered visitors found matching your search" : "No registered visitors found"}
                </TableCell>
              </TableRow>
            ) : (
              filteredVisitors.map((visitor) => (
                <TableRow key={visitor.visitor_id} className="hover:bg-slate-50">
                  <TableCell className="font-medium">{visitor.name}</TableCell>
                  <TableCell className="text-sm">{visitor.email}</TableCell>
                  <TableCell>{visitor.mobile_no}</TableCell>
                  <TableCell>
                    <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded text-sm font-medium">
                      {visitor.visitor_type}
                    </span>
                  </TableCell>
                  <TableCell>{visitor.faculty_name || "N/A"}</TableCell>
                  <TableCell className="text-sm text-slate-600">
                    {new Date(visitor.date_from).toLocaleDateString()}
                  </TableCell>
                  <TableCell className="text-sm text-slate-600">
                    {new Date(visitor.date_to).toLocaleDateString()}
                  </TableCell>
                  <TableCell className="text-sm text-slate-600">
                    {new Date(visitor.created_at).toLocaleDateString()}
                  </TableCell>
                  <TableCell>
                    <Button
                      onClick={() => handleViewDetails(visitor)}
                      variant="secondary"
                      size="sm"
                      className="text-xs"
                      data-testid="registered-visitor-details-btn"
                    >
                      View Information
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {/* Details Modal */}
      {showModal && selectedVisitor && (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl">
            <div className="sticky top-0 bg-gradient-to-r from-indigo-900 to-indigo-800 text-white p-6 flex justify-between items-center">
              <h2 className="text-2xl font-bold">Registered Visitor Information</h2>
              <button
                onClick={() => setShowModal(false)}
                className="text-white hover:text-gray-300 text-2xl font-bold"
              >
                ×
              </button>
            </div>

            <div className="p-8 space-y-6">
              {/* Personal Info */}
              <div className="space-y-2">
                <h3 className="text-lg font-bold text-slate-900 mb-4">Personal Information</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div className="p-3 bg-slate-50 rounded-lg">
                    <p className="text-xs text-slate-600 uppercase font-bold">Full Name</p>
                    <p className="font-semibold text-slate-900">{selectedVisitor.name}</p>
                  </div>
                  <div className="p-3 bg-slate-50 rounded-lg">
                    <p className="text-xs text-slate-600 uppercase font-bold">Phone</p>
                    <p className="font-semibold text-slate-900">{selectedVisitor.mobile_no}</p>
                  </div>
                  <div className="col-span-2 p-3 bg-slate-50 rounded-lg">
                    <p className="text-xs text-slate-600 uppercase font-bold">Email</p>
                    <p className="break-all text-slate-900">{selectedVisitor.email}</p>
                  </div>
                </div>
              </div>

              {/* Visitor Type & Purpose */}
              <div className="grid grid-cols-2 gap-4">
                <div className="p-3 bg-blue-50 rounded-lg border border-blue-200">
                  <p className="text-xs text-blue-600 uppercase font-bold">Visitor Type</p>
                  <p className="font-semibold text-blue-900 capitalize">{selectedVisitor.visitor_type}</p>
                </div>
                <div className="p-3 bg-blue-50 rounded-lg border border-blue-200">
                  <p className="text-xs text-blue-600 uppercase font-bold">Faculty</p>
                  <p className="font-semibold text-blue-900">{selectedVisitor.faculty_name || "N/A"}</p>
                </div>
              </div>

              {/* Validity Period */}
              <div className="space-y-2">
                <h3 className="text-lg font-bold text-slate-900 mb-4">Validity Period</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div className="p-3 bg-green-50 rounded-lg border border-green-200">
                    <p className="text-xs text-green-600 uppercase font-bold">Valid From</p>
                    <p className="font-semibold text-green-900">
                      {new Date(selectedVisitor.date_from).toLocaleDateString()}
                    </p>
                  </div>
                  <div className="p-3 bg-amber-50 rounded-lg border border-amber-200">
                    <p className="text-xs text-amber-600 uppercase font-bold">Valid Till</p>
                    <p className="font-semibold text-amber-900">
                      {new Date(selectedVisitor.date_to).toLocaleDateString()}
                    </p>
                  </div>
                </div>
              </div>

              {/* Registration Date */}
              <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
                <p className="text-xs text-blue-600 uppercase font-bold">Registration Date</p>
                <p className="text-lg font-semibold text-blue-900">
                  {new Date(selectedVisitor.created_at).toLocaleDateString()}
                </p>
              </div>

              <div className="flex gap-4 pt-6 border-t">
                <Button
                  onClick={() => setShowModal(false)}
                  className="flex-1 bg-slate-900 hover:bg-slate-800 text-white"
                >
                  Close
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// Faculty Tab Component
function FacultyTab({ faculty, fetchFaculty }) {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedFaculty, setSelectedFaculty] = useState(null);
  const [showDetails, setShowDetails] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    mobile_no: "",
    department: "",
    profession: "",
    valid_till: "",
  });
  const [bulkFile, setBulkFile] = useState(null);
  const [loading, setLoading] = useState(false);

  // Filter faculty based on search query
  const filteredFaculty = faculty.filter((fac) => {
    const query = searchQuery.toLowerCase();
    return (
      (fac.faculty_id && fac.faculty_id.toLowerCase().includes(query)) ||
      (fac.name && fac.name.toLowerCase().includes(query)) ||
      (fac.email && fac.email.toLowerCase().includes(query)) ||
      (fac.mobile_no && fac.mobile_no.includes(query)) ||
      (fac.department && fac.department.toLowerCase().includes(query))
    );
  });

  const handleViewDetails = (fac) => {
    setSelectedFaculty(fac);
    setShowDetails(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await axios.post(`${BACKEND_URL}/api/faculty`, formData);
      toast.success("Faculty added successfully!");
      setIsDialogOpen(false);
      fetchFaculty();
      setFormData({
        name: "",
        email: "",
        mobile_no: "",
        department: "",
        profession: "",
        valid_till: "",
      });
    } catch (error) {
      const errorMsg = error.response?.data?.detail || error.message || "Failed to add faculty";
      toast.error(errorMsg);
      console.error("Faculty add error:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleBulkUpload = async () => {
    if (!bulkFile) return;
    setLoading(true);
    const formDataBulk = new FormData();
    formDataBulk.append("file", bulkFile);

    try {
      const response = await axios.post(
        `${BACKEND_URL}/api/faculty/bulk`,
        formDataBulk,
      );
      toast.success(`✅ ${response.data.created} faculty added!`);
      
      if (response.data.duplicates > 0) {
        const duplicateMsg = `⚠️ ${response.data.duplicates} duplicate entries found and skipped`;
        toast.error(duplicateMsg, { duration: 2000 });
      }
      
      if (response.data.error_count > 0) {
        const errorMsg = `❌ ${response.data.error_count} errors occurred:\n${response.data.error_details.slice(0, 3).join("\n")}${response.data.error_details.length > 3 ? "\n..." : ""}`;
        toast.error(errorMsg, { duration: 3000 });
        if (process.env.NODE_ENV === 'development') {
          console.log("All errors:", response.data.error_details);
        }
      }
      fetchFaculty();
      setBulkFile(null);
    } catch (error) {
      toast.error("Failed to upload faculty");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white border border-slate-200 rounded-lg p-6">
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-xl font-semibold text-slate-900">
          Faculty Management
        </h3>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button
              className="bg-slate-900 hover:bg-slate-800"
              data-testid="add-faculty-btn"
            >
              <Plus className="w-4 h-4 mr-2" />
              Add Faculty
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-md" data-testid="add-faculty-dialog">
            <DialogHeader>
              <DialogTitle>Add New Faculty</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <Label>Name</Label>
                <Input
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                  required
                  data-testid="faculty-name"
                />
              </div>
              <div>
                <Label>Email</Label>
                <Input
                  type="email"
                  value={formData.email}
                  onChange={(e) =>
                    setFormData({ ...formData, email: e.target.value })
                  }
                  required
                  data-testid="faculty-email"
                />
              </div>
              <div>
                <Label>Mobile Number</Label>
                <Input
                  value={formData.mobile_no}
                  onChange={(e) =>
                    setFormData({ ...formData, mobile_no: e.target.value })
                  }
                  required
                  data-testid="faculty-mobile"
                />
              </div>
              <div>
                <Label>Department</Label>
                <Select value={formData.department} onValueChange={(value) => setFormData({ ...formData, department: value })}>
                  <SelectTrigger data-testid="faculty-department">
                    <SelectValue placeholder="Select Department" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Computer Engineering">Computer Engineering</SelectItem>
                    <SelectItem value="Information Technology">Information Technology</SelectItem>
                    <SelectItem value="Electronics Engineering">Electronics Engineering</SelectItem>
                    <SelectItem value="Mechanical Engineering">Mechanical Engineering</SelectItem>
                    <SelectItem value="Civil Engineering">Civil Engineering</SelectItem>
                    <SelectItem value="Electrical Engineering">Electrical Engineering</SelectItem>
                    <SelectItem value="Administration">Administration</SelectItem>
                    <SelectItem value="Library">Library</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label>Position/Designation</Label>
                <Select value={formData.profession} onValueChange={(value) => setFormData({ ...formData, profession: value })}>
                  <SelectTrigger data-testid="faculty-profession">
                    <SelectValue placeholder="Select Position" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Professor">Professor</SelectItem>
                    <SelectItem value="Associate Professor">Associate Professor</SelectItem>
                    <SelectItem value="Assistant Professor">Assistant Professor</SelectItem>
                    <SelectItem value="Lecturer">Lecturer</SelectItem>
                    <SelectItem value="Senior Faculty">Senior Faculty</SelectItem>
                    <SelectItem value="Junior Faculty">Junior Faculty</SelectItem>
                    <SelectItem value="Department Head">Department Head</SelectItem>
                    <SelectItem value="Lab Coordinator">Lab Coordinator</SelectItem>
                    <SelectItem value="Administrative Staff">Administrative Staff</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label>Valid Till Date</Label>
                <Input
                  type="date"
                  value={formData.valid_till}
                  onChange={(e) =>
                    setFormData({ ...formData, valid_till: e.target.value })
                  }
                  required
                  data-testid="faculty-valid-till"
                />
              </div>
              <Button
                type="submit"
                className="w-full"
                disabled={loading}
                data-testid="submit-faculty"
              >
                {loading ? "Adding..." : "Add Faculty"}
              </Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Search Bar */}
      <div className="mb-6">
        <Input
          placeholder="🔍 Search by Faculty ID, Name, Email, Mobile, or Department..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="h-10"
        />
      </div>

      {/* Bulk Upload */}
      <div className="mb-6 p-4 bg-slate-50 rounded-lg">
        <Label>Bulk Upload (Excel)</Label>
        <div className="flex gap-2 mt-2">
          <Input
            type="file"
            accept=".xlsx,.xls"
            onChange={(e) => setBulkFile(e.target.files[0])}
            data-testid="faculty-bulk-file"
          />
          <Button
            onClick={handleBulkUpload}
            disabled={!bulkFile || loading}
            data-testid="faculty-bulk-upload"
          >
            <Upload className="w-4 h-4 mr-2" />
            Upload
          </Button>
        </div>
        <p className="text-xs text-slate-500 mt-2">
          Format: Name | Email | Mobile | Department | Profession | Valid Till
        </p>
      </div>

      {/* Table */}
      <div className="overflow-x-auto" data-testid="faculty-table">
        <Table>
          <TableHeader>
            <TableRow className="bg-slate-100">
              <TableHead>Faculty ID</TableHead>
              <TableHead>Name</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Department</TableHead>
              <TableHead>Profession</TableHead>
              <TableHead>Valid Till</TableHead>
              <TableHead>Action</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredFaculty.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} className="text-center py-8 text-slate-500">
                  {searchQuery ? "No faculty found matching your search" : "No faculty found"}
                </TableCell>
              </TableRow>
            ) : (
              filteredFaculty.map((fac) => (
                <TableRow key={fac.faculty_id} className="hover:bg-slate-50">
                  <TableCell className="font-mono font-semibold">{fac.faculty_id}</TableCell>
                  <TableCell className="font-medium">{fac.name}</TableCell>
                  <TableCell className="text-sm">{fac.email}</TableCell>
                  <TableCell>{fac.department}</TableCell>
                  <TableCell>{fac.profession}</TableCell>
                  <TableCell className="text-sm">
                    {new Date(fac.valid_till).toLocaleDateString()}
                  </TableCell>
                  <TableCell>
                    <Button
                      onClick={() => handleViewDetails(fac)}
                      variant="secondary"
                      size="sm"
                      className="text-xs"
                      data-testid="faculty-details-btn"
                    >
                      View Information
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {/* Details Modal */}
      {showDetails && selectedFaculty && (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl">
            <div className="sticky top-0 bg-gradient-to-r from-purple-900 to-purple-800 text-white p-6 flex justify-between items-center">
              <h2 className="text-2xl font-bold">Faculty Information</h2>
              <button
                onClick={() => setShowDetails(false)}
                className="text-white hover:text-gray-300 text-2xl font-bold"
              >
                ×
              </button>
            </div>

            <div className="p-8 space-y-6">
              {/* Faculty ID */}
              <div className="p-4 bg-purple-50 rounded-lg border border-purple-200">
                <p className="text-xs text-purple-600 uppercase font-bold tracking-wider mb-2">
                  Faculty ID
                </p>
                <p className="text-2xl font-bold text-purple-900 font-mono">{selectedFaculty.faculty_id}</p>
              </div>

              {/* Personal Info */}
              <div className="space-y-2">
                <h3 className="text-lg font-bold text-slate-900 mb-4">Personal Information</h3>
                <div className="p-3 bg-slate-50 rounded-lg">
                  <p className="text-xs text-slate-600 uppercase font-bold">Name</p>
                  <p className="text-xl font-semibold text-slate-900">{selectedFaculty.name}</p>
                </div>
              </div>

              {/* Contact Info */}
              <div className="space-y-2">
                <h3 className="text-lg font-bold text-slate-900 mb-4">Contact Information</h3>
                <div className="grid grid-cols-1 gap-4">
                  <div className="p-3 bg-slate-50 rounded-lg">
                    <p className="text-xs text-slate-600 uppercase font-bold">Email</p>
                    <p className="text-slate-900 break-all">{selectedFaculty.email}</p>
                  </div>
                  <div className="p-3 bg-slate-50 rounded-lg">
                    <p className="text-xs text-slate-600 uppercase font-bold">Mobile</p>
                    <p className="text-slate-900 font-semibold">{selectedFaculty.mobile_no}</p>
                  </div>
                </div>
              </div>

              {/* Professional Info */}
              <div className="space-y-2">
                <h3 className="text-lg font-bold text-slate-900 mb-4">Professional Information</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div className="p-3 bg-blue-50 rounded-lg border border-blue-200">
                    <p className="text-xs text-blue-600 uppercase font-bold">Department</p>
                    <p className="font-semibold text-blue-900">{selectedFaculty.department}</p>
                  </div>
                  <div className="p-3 bg-blue-50 rounded-lg border border-blue-200">
                    <p className="text-xs text-blue-600 uppercase font-bold">Profession</p>
                    <p className="font-semibold text-blue-900">{selectedFaculty.profession}</p>
                  </div>
                </div>
              </div>

              {/* Valid Till */}
              <div className="p-4 bg-amber-50 rounded-lg border border-amber-200">
                <p className="text-xs text-amber-600 uppercase font-bold">Valid Till</p>
                <p className="text-lg font-semibold text-amber-900">
                  {new Date(selectedFaculty.valid_till).toLocaleDateString()}
                </p>
              </div>

              <div className="flex gap-4 pt-6 border-t">
                <Button
                  onClick={() => setShowDetails(false)}
                  className="flex-1 bg-slate-900 hover:bg-slate-800 text-white"
                >
                  Close
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// Events Tab Component
function EventsTab({ events, fetchEvents, students }) {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [formData, setFormData] = useState({
    event_name: "",
    event_type: "",
    date_from: "",
    date_to: "",
    description: "",
  });
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [eventStudents, setEventStudents] = useState([]);
  const [studentRegNo, setStudentRegNo] = useState("");
  const [manualEntry, setManualEntry] = useState(false);
  const [manualStudentData, setManualStudentData] = useState({
    reg_no: "",
    name: "",
    email: "",
    mobile_no: "",
  });
  const [bulkFile, setBulkFile] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await axios.post(`${BACKEND_URL}/api/events`, formData);
      toast.success("Event created successfully!");
      setIsDialogOpen(false);
      fetchEvents();
      setFormData({
        event_name: "",
        event_type: "",
        date_from: "",
        date_to: "",
        description: "",
      });
    } catch (error) {
      toast.error("Failed to create event");
    } finally {
      setLoading(false);
    }
  };

  const fetchEventStudents = async (eventId) => {
    try {
      const response = await axios.get(
        `${BACKEND_URL}/api/events/${eventId}/students`,
      );
      setEventStudents(response.data);
    } catch (error) {
      console.error(error);
    }
  };

  const handleAddStudent = async () => {
    if (!selectedEvent) return;

    if (manualEntry) {
      // Manual entry for external students - only check required fields (name, email, mobile_no)
      if (
        !manualStudentData.name.trim() ||
        !manualStudentData.email.trim() ||
        !manualStudentData.mobile_no.trim()
      ) {
        toast.error("⚠️ Please fill all required fields: Name, Email, and Mobile Number");
        return;
      }
      setLoading(true);
      try {
        // Send without reg_no since it's auto-generated for external students
        await axios.post(`${BACKEND_URL}/api/events/students/manual`, {
          event_id: selectedEvent.event_id,
          name: manualStudentData.name,
          email: manualStudentData.email,
          mobile_no: manualStudentData.mobile_no,
        });
        toast.success("External student added to event!");
        fetchEventStudents(selectedEvent.event_id);
        setManualStudentData({
          reg_no: "",
          name: "",
          email: "",
          mobile_no: "",
        });
        setManualEntry(false);
      } catch (error) {
        toast.error(error.response?.data?.detail || "Failed to add student");
      } finally {
        setLoading(false);
      }
    } else {
      // Existing PICT student
      if (!studentRegNo) return;
      setLoading(true);
      try {
        await axios.post(`${BACKEND_URL}/api/events/students`, {
          event_id: selectedEvent.event_id,
          reg_no: studentRegNo,
        });
        toast.success("Student added to event and email sent!");
        fetchEventStudents(selectedEvent.event_id);
        setStudentRegNo("");
      } catch (error) {
        toast.error(
          error.response?.data?.detail ||
            "Student not found. Try manual entry for external students.",
        );
      } finally {
        setLoading(false);
      }
    }
  };

  const handleBulkAddStudents = async () => {
    if (!selectedEvent || !bulkFile) return;
    setLoading(true);
    const formDataBulk = new FormData();
    formDataBulk.append("event_id", selectedEvent.event_id);
    formDataBulk.append("file", bulkFile);

    try {
      const response = await axios.post(
        `${BACKEND_URL}/api/events/students/bulk`,
        formDataBulk,
      );
      toast.success(`✅ ${response.data.added} students added!`);
      
      // Show duplicate report if any
      if (response.data.duplicates > 0) {
        const duplicateMsg = `⚠️ ${response.data.duplicates} duplicate entries found and skipped`;
        toast.error(duplicateMsg, { duration: 2000 });
      }
      
      if (response.data.error_count > 0) {
        // Show first 3 errors
        const errorDisplay = response.data.error_details.slice(0, 3).join("\n");
        const moreErrors = response.data.error_count > 3 ? `\n...and ${response.data.error_count - 3} more` : "";
        toast.error(`❌ ${response.data.error_count} errors occurred:\n${errorDisplay}${moreErrors}`, { duration: 3000 });
        if (process.env.NODE_ENV === 'development') {
          console.log("All Event Student Upload Errors:", response.data.error_details);
        }
      }
      
      fetchEventStudents(selectedEvent.event_id);
      setBulkFile(null);
    } catch (error) {
      toast.error("Failed to add students");
    } finally {
      setLoading(false);
    }
  };

  const handleResendEmail = async (studentToken, studentName, studentEmail) => {
    setLoading(true);
    try {
      const response = await axios.post(
        `${BACKEND_URL}/api/events/${selectedEvent.event_id}/students/${studentToken}/resend-email`
      );
      toast.success(`📧 Email resent to ${studentName}`);
    } catch (error) {
      if (error.message === "Network Error" || !error.response) {
        toast.error(
          `⚠️ Network Error: Cannot reach the server.\n\n` +
          `Troubleshoot:\n` +
          `1. Check if backend is running on port 8001\n` +
          `2. Try: GET /api/health/email (from developer tools)\n` +
          `3. Check Gmail .env settings: GMAIL_PASSWORD, SENDER_EMAIL`,
          { duration: 4000 }
        );
      } else if (error.response?.status === 404) {
        toast.error(`❌ Student not found in event database`);
      } else if (error.response?.status === 500) {
        toast.error(
          `⚠️ Email Server Error:\n${error.response?.data?.detail || "Gmail SMTP connection failed"}\n\n` +
          `Check:\n` +
          `1. GMAIL_PASSWORD in backend/.env is valid\n` +
          `2. Less secure apps allowed in Gmail\n` +
          `3. Internet connection is working`,
          { duration: 4000 }
        );
      } else {
        toast.error(`Failed to resend email: ${error.response?.data?.detail || error.message}`);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleBulkResendEmails = async () => {
    if (!selectedEvent || eventStudents.length === 0) {
      toast.error("❌ No students found to send emails to");
      return;
    }

    setLoading(true);
    try {
      const response = await axios.post(
        `${BACKEND_URL}/api/events/${selectedEvent.event_id}/bulk-resend-emails`
      );
      
      toast.success(`📧 Emails sent to ${response.data.sent}/${eventStudents.length} students!`);
      
      if (response.data.failed > 0) {
        const failedList = response.data.failed_details
          .map(f => `${f.name}: ${f.reason}`)
          .slice(0, 3)
          .join("\n");
        const moreInfo = response.data.failed > 3 ? `\n...and ${response.data.failed - 3} more` : "";
        toast.error(`⚠️ Failed to send to ${response.data.failed} students:\n${failedList}${moreInfo}`, { duration: 3000 });
      }
    } catch (error) {
      if (error.message === "Network Error" || !error.response) {
        toast.error(
          `⚠️ Network Error: Cannot reach the server.\n\n` +
          `Troubleshoot:\n` +
          `1. Check if backend is running on port 8001\n` +
          `2. Check MongoDB connection in .env\n` +
          `3. Check Gmail setup: GMAIL_PASSWORD, SENDER_EMAIL`,
          { duration: 4000 }
        );
      } else if (error.response?.status === 500) {
        toast.error(
          `⚠️ Email Server Error:\n${error.response?.data?.detail || "Gmail SMTP connection failed"}\n\n` +
          `Check:\n` +
          `1. GMAIL_PASSWORD in backend/.env is valid\n` +
          `2. Less secure apps allowed in Gmail\n` +
          `3. Internet connection is working`,
          { duration: 4000 }
        );
      } else {
        toast.error(`Failed to resend emails: ${error.response?.data?.detail || error.message}`);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white border border-slate-200 rounded-lg p-6">
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-xl font-semibold text-slate-900">
          Event Management
        </h3>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button
              className="bg-slate-900 hover:bg-slate-800"
              data-testid="add-event-btn"
            >
              <Plus className="w-4 h-4 mr-2" />
              Create Event
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-md" data-testid="add-event-dialog">
            <DialogHeader>
              <DialogTitle>Create New Event</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <Label>Event Name</Label>
                <Input
                  value={formData.event_name}
                  onChange={(e) =>
                    setFormData({ ...formData, event_name: e.target.value })
                  }
                  required
                  data-testid="event-name"
                />
              </div>
              <div>
                <Label>Event Type</Label>
                <Input
                  value={formData.event_type}
                  onChange={(e) =>
                    setFormData({ ...formData, event_type: e.target.value })
                  }
                  required
                  data-testid="event-type"
                />
              </div>
              <div>
                <Label>Date From</Label>
                <Input
                  type="date"
                  value={formData.date_from}
                  onChange={(e) =>
                    setFormData({ ...formData, date_from: e.target.value })
                  }
                  required
                  data-testid="event-date-from"
                />
              </div>
              <div>
                <Label>Date To</Label>
                <Input
                  type="date"
                  value={formData.date_to}
                  onChange={(e) =>
                    setFormData({ ...formData, date_to: e.target.value })
                  }
                  required
                  data-testid="event-date-to"
                />
              </div>
              <div>
                <Label>Description</Label>
                <Input
                  value={formData.description}
                  onChange={(e) =>
                    setFormData({ ...formData, description: e.target.value })
                  }
                  required
                  data-testid="event-description"
                />
              </div>
              <Button
                type="submit"
                className="w-full"
                disabled={loading}
                data-testid="submit-event"
              >
                {loading ? "Creating..." : "Create Event"}
              </Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Events List */}
      <div className="space-y-4" data-testid="events-list">
        {events.map((event) => (
          <div
            key={event.event_id}
            className="border border-slate-200 rounded-lg p-4"
          >
            <div className="flex justify-between items-start mb-2">
              <div>
                <h4 className="font-semibold text-lg text-slate-900">
                  {event.event_name}
                </h4>
                <p className="text-sm text-slate-500">{event.event_type}</p>
              </div>
              <Button
                size="sm"
                onClick={() => {
                  setSelectedEvent(event);
                  fetchEventStudents(event.event_id);
                }}
                data-testid={`view-event-students-${event.event_id}`}
              >
                View Students
              </Button>
            </div>
            <p className="text-sm text-slate-600 mb-2">{event.description}</p>
            <p className="text-sm text-slate-500">
              {new Date(event.date_from).toLocaleDateString()} -{" "}
              {new Date(event.date_to).toLocaleDateString()}
            </p>
          </div>
        ))}
      </div>

      {/* Event Students Dialog */}
      {selectedEvent && (
        <Dialog
          open={!!selectedEvent}
          onOpenChange={() => setSelectedEvent(null)}
        >
          <DialogContent
            className="max-w-3xl max-h-[90vh] flex flex-col"
            data-testid="event-students-dialog"
          >
            <DialogHeader>
              <DialogTitle>Students for {selectedEvent.event_name}</DialogTitle>
            </DialogHeader>

            <div className="space-y-4 overflow-y-auto flex-1">
              {/* Toggle between existing and manual entry */}
              <div className="flex gap-2 mb-4">
                <Button
                  variant={!manualEntry ? "default" : "secondary"}
                  onClick={() => setManualEntry(false)}
                  data-testid="toggle-existing-student"
                >
                  PICT Student
                </Button>
                <Button
                  variant={manualEntry ? "default" : "secondary"}
                  onClick={() => setManualEntry(true)}
                  data-testid="toggle-manual-entry"
                >
                  External Student
                </Button>
              </div>

              {/* Add Student - Existing or Manual */}
              {!manualEntry ? (
                <div className="flex gap-2">
                  <Input
                    placeholder="Enter PICT student reg no"
                    value={studentRegNo}
                    onChange={(e) => setStudentRegNo(e.target.value)}
                    data-testid="event-student-reg-no"
                  />
                  <Button
                    onClick={handleAddStudent}
                    disabled={loading}
                    data-testid="add-student-to-event"
                  >
                    Add
                  </Button>
                </div>
              ) : (
                <div className="bg-slate-50 rounded-lg border-l-4 border-amber-500 flex flex-col h-96">
                  <div className="sticky top-0 bg-slate-50 p-4 border-b border-amber-200 z-10 flex-shrink-0">
                    <p className="text-sm font-semibold text-slate-800 flex items-center gap-2">
                      <span className="bg-amber-100 text-amber-800 px-2 py-1 rounded text-xs font-bold">EXTERNAL STUDENT</span>
                      Add Student from Other College
                    </p>
                  </div>
                  
                  <div className="overflow-y-auto flex-1 p-4 space-y-3">
                    {/* Generated ID Preview */}
                    {selectedEvent && (
                      <div className="bg-white border border-amber-200 rounded p-3 flex-shrink-0">
                        <p className="text-xs text-slate-600 mb-1">Generated External ID:</p>
                        <p className="font-mono text-sm font-bold text-amber-700 bg-amber-50 p-2 rounded">
                          {selectedEvent.event_name.replace(/\s+/g, "_")}_exe{String(eventStudents.length + 1).padStart(3, "0")}
                        </p>
                        <p className="text-xs text-slate-500 mt-2">✓ ID auto-generated • ✓ QR code auto-emailed</p>
                      </div>
                    )}
                    
                    <div className="space-y-3">
                      <div>
                        <Label className="text-xs font-semibold mb-1 block">Full Name *</Label>
                        <Input
                          placeholder="e.g., Rajesh Kumar"
                          value={manualStudentData.name}
                          onChange={(e) =>
                            setManualStudentData({
                              ...manualStudentData,
                              name: e.target.value,
                            })
                          }
                          data-testid="manual-name"
                        />
                      </div>
                      
                      <div>
                        <Label className="text-xs font-semibold mb-1 block">Email Address *</Label>
                        <Input
                          placeholder="e.g., rajesh@example.com"
                          type="email"
                          value={manualStudentData.email}
                          onChange={(e) =>
                            setManualStudentData({
                              ...manualStudentData,
                              email: e.target.value,
                            })
                          }
                          data-testid="manual-email"
                        />
                      </div>
                      
                      <div>
                        <Label className="text-xs font-semibold mb-1 block">Mobile Number *</Label>
                        <Input
                          placeholder="e.g., 9876543210"
                          value={manualStudentData.mobile_no}
                          onChange={(e) =>
                            setManualStudentData({
                              ...manualStudentData,
                              mobile_no: e.target.value,
                            })
                          }
                          data-testid="manual-mobile"
                        />
                      </div>
                    </div>
                  </div>
                  
                  <div className="sticky bottom-0 bg-slate-50 p-4 border-t border-amber-200 flex-shrink-0">
                    <Button
                      onClick={handleAddStudent}
                      disabled={loading || !manualStudentData.name || !manualStudentData.email || !manualStudentData.mobile_no}
                      className="w-full bg-amber-600 hover:bg-amber-700"
                      data-testid="add-manual-student"
                    >
                      ✓ Add & Send QR Email
                    </Button>
                  </div>
                </div>
              )}

              {/* Bulk Add */}
              <div className="p-4 bg-slate-50 rounded-lg border-l-4 border-blue-500">
                <Label className="font-semibold">Bulk Add Students (Excel)</Label>
                <div className="flex gap-2 mt-3">
                  <Input
                    type="file"
                    accept=".xlsx,.xls"
                    onChange={(e) => setBulkFile(e.target.files[0])}
                    data-testid="event-bulk-file"
                  />
                  <Button
                    onClick={handleBulkAddStudents}
                    disabled={!bulkFile || loading}
                    data-testid="event-bulk-upload"
                  >
                    <Upload className="w-4 h-4 mr-2" />
                    Upload
                  </Button>
                </div>
                <div className="text-xs text-slate-600 mt-3 space-y-1">
                  <p className="font-semibold text-slate-700">📌 Format Guide:</p>
                  <p><strong>PICT Students:</strong> Column 1 = Reg No only</p>
                  <p><strong>External Students:</strong> Name | Email | Mobile (3 columns)</p>
                  <p className="text-green-700">✓ ID auto-generated • ✓ Duplicates skipped • ✓ QR code emailed</p>
                </div>
              </div>

              {/* Students Table */}
              <div className="space-y-3">
                {eventStudents.length > 0 && (
                  <div className="flex flex-col gap-2">
                    <div className="flex gap-2 items-center">
                      <Button
                        onClick={handleBulkResendEmails}
                        disabled={loading}
                        variant="secondary"
                        data-testid="bulk-resend-emails"
                        className="text-xs"
                      >
                        📧 Resend All Emails ({eventStudents.length})
                      </Button>
                      <span className="text-xs text-slate-500">
                        Sends QR code to all students by email
                      </span>
                    </div>
                  </div>
                )}
                <div
                  className="border border-slate-200 rounded-lg overflow-y-auto max-h-96"
                  data-testid="event-students-table"
                >
                  <Table>
                    <TableHeader className="sticky top-0 bg-slate-50">
                      <TableRow>
                        <TableHead>Reg No</TableHead>
                        <TableHead>Name</TableHead>
                        <TableHead>Email</TableHead>
                        <TableHead>Valid Till</TableHead>
                        <TableHead className="text-right">Action</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {eventStudents.map((student) => (
                        <TableRow key={student.token}>
                          <TableCell className="font-mono text-sm">
                            {student.reg_no}
                          </TableCell>
                          <TableCell className="text-sm">{student.name}</TableCell>
                          <TableCell className="text-xs text-slate-600">
                            {student.email}
                          </TableCell>
                          <TableCell className="text-sm">
                            {new Date(student.valid_to).toLocaleDateString()}
                          </TableCell>
                          <TableCell className="text-right">
                            <Button
                              onClick={() =>
                                handleResendEmail(
                                  student.token,
                                  student.name,
                                  student.email
                                )
                              }
                              disabled={loading}
                              size="sm"
                              variant="ghost"
                              className="text-xs h-7 px-2"
                              data-testid={`resend-email-${student.token}`}
                            >
                              📧 Resend
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}

// Visitors Tab Component
function VisitorsTab() {
  const [visitors, setVisitors] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedVisitor, setSelectedVisitor] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    fetchVisitors();
  }, []);

  const fetchVisitors = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`${BACKEND_URL}/api/visitors`);
      setVisitors(response.data || []);
    } catch (error) {
      toast.error("Failed to fetch visitors");
    } finally {
      setLoading(false);
    }
  };

  // Filter visitors based on search query
  const filteredVisitors = visitors.filter((visitor) => {
    const query = searchQuery.toLowerCase();
    return (
      (visitor.full_name && visitor.full_name.toLowerCase().includes(query)) ||
      (visitor.email && visitor.email.toLowerCase().includes(query)) ||
      (visitor.phone_number && visitor.phone_number.includes(query)) ||
      (visitor.visitor_type && visitor.visitor_type.toLowerCase().includes(query)) ||
      (visitor.person_to_visit_name && visitor.person_to_visit_name.toLowerCase().includes(query))
    );
  });

  const handleViewDetails = (visitor) => {
    setSelectedVisitor(visitor);
    setShowModal(true);
  };

  return (
    <div className="bg-white border border-slate-200 rounded-lg p-6">
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-xl font-semibold text-slate-900">Visitors</h3>
        <Button onClick={fetchVisitors} variant="secondary" disabled={loading}>
          Refresh
        </Button>
      </div>

      {/* Search Bar */}
      <div className="mb-6">
        <Input
          placeholder="🔍 Search by Name, Email, Mobile, Type, or Person..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="h-10"
        />
      </div>

      <div className="overflow-x-auto" data-testid="visitors-table">
        <Table>
          <TableHeader>
            <TableRow className="bg-slate-100">
              <TableHead>Name</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Mobile</TableHead>
              <TableHead>Visitor Type</TableHead>
              <TableHead>Purpose</TableHead>
              <TableHead>Meeting With</TableHead>
              <TableHead>Valid Till</TableHead>
              <TableHead>Action</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredVisitors.length === 0 ? (
              <TableRow>
                <TableCell colSpan={8} className="text-center py-8 text-slate-500">
                  {searchQuery ? "No visitors found matching your search" : "No visitors found"}
                </TableCell>
              </TableRow>
            ) : (
              filteredVisitors.map((visitor) => (
                <TableRow key={visitor.token} className="hover:bg-slate-50">
                  <TableCell className="font-medium">
                    {visitor.full_name}
                  </TableCell>
                  <TableCell className="text-sm">{visitor.email}</TableCell>
                  <TableCell>{visitor.phone_number}</TableCell>
                  <TableCell>
                    <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded text-sm font-medium">
                      {visitor.visitor_type}
                    </span>
                  </TableCell>
                  <TableCell>{visitor.purpose}</TableCell>
                  <TableCell>{visitor.person_to_visit_name || "N/A"}</TableCell>
                  <TableCell className="text-sm text-slate-600">
                    {new Date(visitor.valid_till).toLocaleDateString()}
                  </TableCell>
                  <TableCell>
                    <Button
                      onClick={() => handleViewDetails(visitor)}
                      variant="secondary"
                      size="sm"
                      className="text-xs"
                      data-testid="visitor-details-btn"
                    >
                      View Information
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {/* Details Modal */}
      {showModal && selectedVisitor && (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl">
            <div className="sticky top-0 bg-gradient-to-r from-teal-900 to-teal-800 text-white p-6 flex justify-between items-center">
              <h2 className="text-2xl font-bold">Visitor Information</h2>
              <button
                onClick={() => setShowModal(false)}
                className="text-white hover:text-gray-300 text-2xl font-bold"
              >
                ×
              </button>
            </div>

            <div className="p-8 space-y-6">
              {/* Photo */}
              {selectedVisitor.photo_base64 && (
                <div>
                  <p className="text-sm text-slate-500 uppercase tracking-wider mb-3 font-semibold">
                    Photo
                  </p>
                  <img
                    src={selectedVisitor.photo_base64}
                    alt="Visitor"
                    className="w-full max-w-sm rounded-lg border border-slate-200"
                  />
                </div>
              )}

              {/* Personal Info */}
              <div className="space-y-2">
                <h3 className="text-lg font-bold text-slate-900 mb-4">Personal Information</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div className="p-3 bg-slate-50 rounded-lg">
                    <p className="text-xs text-slate-600 uppercase font-bold">Full Name</p>
                    <p className="font-semibold text-slate-900">{selectedVisitor.full_name}</p>
                  </div>
                  <div className="p-3 bg-slate-50 rounded-lg">
                    <p className="text-xs text-slate-600 uppercase font-bold">Gender</p>
                    <p className="font-semibold text-slate-900">{selectedVisitor.gender}</p>
                  </div>
                  <div className="p-3 bg-slate-50 rounded-lg">
                    <p className="text-xs text-slate-600 uppercase font-bold">Date of Birth</p>
                    <p className="font-semibold text-slate-900">
                      {new Date(selectedVisitor.date_of_birth).toLocaleDateString()}
                    </p>
                  </div>
                  <div className="p-3 bg-slate-50 rounded-lg">
                    <p className="text-xs text-slate-600 uppercase font-bold">Phone</p>
                    <p className="font-semibold text-slate-900">{selectedVisitor.phone_number}</p>
                  </div>
                </div>
              </div>

              {/* Contact Info */}
              <div className="space-y-2">
                <h3 className="text-lg font-bold text-slate-900 mb-4">Contact Information</h3>
                <div className="p-3 bg-slate-50 rounded-lg">
                  <p className="text-xs text-slate-600 uppercase font-bold">Email</p>
                  <p className="break-all text-slate-900">{selectedVisitor.email}</p>
                </div>
              </div>

              {/* ID Details */}
              <div className="space-y-2">
                <h3 className="text-lg font-bold text-slate-900 mb-4">Identification</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div className="p-3 bg-slate-50 rounded-lg">
                    <p className="text-xs text-slate-600 uppercase font-bold">ID Type</p>
                    <p className="font-semibold text-slate-900">{selectedVisitor.id_type}</p>
                  </div>
                  <div className="p-3 bg-slate-50 rounded-lg">
                    <p className="text-xs text-slate-600 uppercase font-bold">ID Number</p>
                    <p className="font-semibold text-slate-900">{selectedVisitor.id_number}</p>
                  </div>
                </div>

                {selectedVisitor.id_proof_base64 && (
                  <div className="mt-4">
                    <p className="text-xs text-slate-600 uppercase mb-2 font-semibold">ID Proof</p>
                    <img
                      src={selectedVisitor.id_proof_base64}
                      alt="ID Proof"
                      className="w-full max-w-sm rounded-lg border border-slate-200"
                    />
                  </div>
                )}
              </div>

              {/* Visit Details */}
              <div className="space-y-2">
                <h3 className="text-lg font-bold text-slate-900 mb-4">Visit Information</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div className="p-3 bg-blue-50 rounded-lg border border-blue-200">
                    <p className="text-xs text-blue-600 uppercase font-bold">Visitor Type</p>
                    <p className="font-semibold text-blue-900 capitalize">{selectedVisitor.visitor_type}</p>
                  </div>
                  <div className="p-3 bg-blue-50 rounded-lg border border-blue-200">
                    <p className="text-xs text-blue-600 uppercase font-bold">Purpose</p>
                    <p className="font-semibold text-blue-900">{selectedVisitor.purpose}</p>
                  </div>
                </div>

                {selectedVisitor.person_to_visit_name && (
                  <div className="p-3 bg-green-50 rounded-lg border border-green-200">
                    <p className="text-xs text-green-600 uppercase font-bold">Meeting With</p>
                    <p className="font-semibold text-green-900">{selectedVisitor.person_to_visit_name}</p>
                    {selectedVisitor.person_to_visit_mobile && (
                      <p className="text-xs text-green-600 mt-1">📱 {selectedVisitor.person_to_visit_mobile}</p>
                    )}
                  </div>
                )}
              </div>

              {/* Valid Till */}
              <div className="p-4 bg-amber-50 rounded-lg border border-amber-200">
                <p className="text-xs text-amber-600 uppercase font-bold">Valid Till</p>
                <p className="text-lg font-semibold text-amber-900">
                  {new Date(selectedVisitor.valid_till).toLocaleDateString()}
                </p>
              </div>

              <div className="flex gap-4 pt-6 border-t">
                <Button
                  onClick={() => setShowModal(false)}
                  className="flex-1 bg-slate-900 hover:bg-slate-800 text-white"
                >
                  Close
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// Alumni Tab Component
function AlumniTab() {
  const [alumni, setAlumni] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedAlumni, setSelectedAlumni] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [dateRange, setDateRange] = useState("all");
  const [exporting, setExporting] = useState(false);

  useEffect(() => {
    fetchAlumni();
  }, []);

  const fetchAlumni = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`${BACKEND_URL}/api/alumni`);
      setAlumni(response.data || []);
    } catch (error) {
      toast.error("Failed to fetch alumni");
    } finally {
      setLoading(false);
    }
  };

  // Filter alumni based on search query
  const filteredAlumni = alumni.filter((alum) => {
    const query = searchQuery.toLowerCase();
    const fullName = `${alum.first_name || ""} ${alum.middle_name || ""} ${alum.last_name || ""}`.toLowerCase();
    return (
      fullName.includes(query) ||
      (alum.email && alum.email.toLowerCase().includes(query)) ||
      (alum.mobile_no && alum.mobile_no.includes(query)) ||
      (alum.company && alum.company.toLowerCase().includes(query)) ||
      (alum.branch && alum.branch.toLowerCase().includes(query)) ||
      (alum.degree && alum.degree.toLowerCase().includes(query))
    );
  });

  const handleViewDetails = (alum) => {
    setSelectedAlumni(alum);
    setShowModal(true);
  };

  const handleExportData = async () => {
    try {
      setExporting(true);
      const response = await axios.get(
        `${BACKEND_URL}/api/alumni/export?date_range=${dateRange}`,
        { responseType: "blob" }
      );
      
      // Create a download link
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute(
        "download",
        `alumni_${dateRange}_${new Date().toISOString().split('T')[0]}.xlsx`
      );
      document.body.appendChild(link);
      link.click();
      link.parentNode.removeChild(link);
      window.URL.revokeObjectURL(url);
      
      toast.success("Alumni data exported successfully!");
    } catch (error) {
      console.error("Error exporting data:", error);
      toast.error("Failed to export alumni data");
    } finally {
      setExporting(false);
    }
  };

  // Helper function to construct full name
  const getFullName = (alum) => {
    return `${alum.first_name || ""} ${alum.middle_name || ""} ${alum.last_name || ""}`.trim();
  };

  return (
    <div className="bg-white border border-slate-200 rounded-lg p-6">
      <div className="mb-6">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-xl font-semibold text-slate-900">Alumni</h3>
          <Button onClick={fetchAlumni} variant="secondary" disabled={loading}>
            Refresh
          </Button>
        </div>
        
        {/* Export Section */}
        <div className="bg-gradient-to-br from-blue-50 to-indigo-50 p-4 rounded-lg border border-blue-200">
          <div className="flex flex-col md:flex-row gap-4 items-start md:items-center">
            <div className="flex-1">
              <Label htmlFor="date_range" className="text-sm font-semibold text-slate-700 mb-2 block">
                📅 Download Alumni Data - Select Date Range
              </Label>
              <select
                id="date_range"
                value={dateRange}
                onChange={(e) => setDateRange(e.target.value)}
                className="w-full px-4 py-2 border-2 border-blue-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent bg-white font-medium"
              >
                <option value="all">📊 All Alumni</option>
                <option value="last_month">📆 Last 1 Month</option>
                <option value="last_3_months">📅 Last 3 Months</option>
                <option value="last_6_months">📅 Last 6 Months</option>
                <option value="last_year">📆 Last 1 Year</option>
                <option value="last_2_years">📆 Last 2 Years</option>
              </select>
            </div>
            <Button
              onClick={handleExportData}
              disabled={exporting}
              className="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white font-semibold px-6 py-2 rounded-lg transition-all shadow-md hover:shadow-lg mt-6 md:mt-0"
            >
              <Download className="w-4 h-4 mr-2" />
              {exporting ? "Exporting..." : "Download Excel"}
            </Button>
          </div>
          <p className="text-xs text-slate-600 mt-2">✓ All fields from database will be included in the export</p>
        </div>
      </div>

      {/* Search Bar */}
      <div className="mb-6">
        <Input
          placeholder="🔍 Search by Name, Email, Mobile, Company, Branch, or Degree..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="h-10"
        />
      </div>

      <div className="overflow-x-auto" data-testid="alumni-table">
        <Table>
          <TableHeader>
            <TableRow className="bg-slate-100">
              <TableHead>Full Name</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Mobile</TableHead>
              <TableHead>Branch</TableHead>
              <TableHead>Degree</TableHead>
              <TableHead>Company</TableHead>
              <TableHead>Position</TableHead>
              <TableHead>Passing Year</TableHead>
              <TableHead>Action</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredAlumni.length === 0 ? (
              <TableRow>
                <TableCell colSpan={9} className="text-center py-8 text-slate-500">
                  {searchQuery ? "No alumni found matching your search" : "No alumni found"}
                </TableCell>
              </TableRow>
            ) : (
              filteredAlumni.map((alum) => (
                <TableRow key={alum.token} className="hover:bg-slate-50">
                  <TableCell className="font-medium">
                    {getFullName(alum)}
                  </TableCell>
                  <TableCell className="text-sm">{alum.email}</TableCell>
                  <TableCell>{alum.mobile_no}</TableCell>
                  <TableCell>{alum.branch || "N/A"}</TableCell>
                  <TableCell>{alum.degree || "N/A"}</TableCell>
                  <TableCell>{alum.company || "N/A"}</TableCell>
                  <TableCell>{alum.designation || "N/A"}</TableCell>
                  <TableCell>{alum.year_of_passing}</TableCell>
                  <TableCell>
                    <Button
                      onClick={() => handleViewDetails(alum)}
                      variant="secondary"
                      size="sm"
                      className="text-xs"
                      data-testid="alumni-details-btn"
                    >
                      View Information
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {/* Details Modal */}
      {showModal && selectedAlumni && (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg max-w-3xl w-full max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-gradient-to-br from-slate-900 to-slate-800 text-white p-6 flex justify-between items-center">
              <h2 className="text-2xl font-bold">Alumni Details</h2>
              <button
                onClick={() => setShowModal(false)}
                className="text-white hover:text-gray-300 text-2xl font-bold"
              >
                ×
              </button>
            </div>

            <div className="p-6 space-y-6">
              {/* Photo */}
              {selectedAlumni.photo_base64 && (
                <div>
                  <p className="text-sm text-slate-500 uppercase tracking-wider mb-3 font-semibold">
                    Photo
                  </p>
                  <img
                    src={selectedAlumni.photo_base64}
                    alt="Alumni"
                    className="w-full max-w-sm rounded-lg border border-slate-200"
                  />
                </div>
              )}

              {/* Personal Information */}
              <div>
                <p className="text-sm text-slate-500 uppercase tracking-wider mb-3 font-semibold">
                  Personal Information
                </p>
                <div className="grid grid-cols-3 gap-4 p-4 bg-slate-50 rounded-lg">
                  <div>
                    <p className="text-xs text-slate-600 uppercase">
                      First Name
                    </p>
                    <p className="font-semibold text-slate-900">
                      {selectedAlumni.first_name}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-slate-600 uppercase">
                      Middle Name
                    </p>
                    <p className="font-semibold text-slate-900">
                      {selectedAlumni.middle_name || "N/A"}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-slate-600 uppercase">
                      Last Name
                    </p>
                    <p className="font-semibold text-slate-900">
                      {selectedAlumni.last_name}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-slate-600 uppercase">Gender</p>
                    <p className="font-semibold text-slate-900">{selectedAlumni.gender || "N/A"}</p>
                  </div>
                  <div className="col-span-2">
                    <p className="text-xs text-slate-600 uppercase">Email</p>
                    <p className="font-semibold text-slate-900 break-all">
                      {selectedAlumni.email}
                    </p>
                  </div>
                  <div className="col-span-2">
                    <p className="text-xs text-slate-600 uppercase">
                      Secondary Email
                    </p>
                    <p className="font-semibold text-slate-900 break-all">
                      {selectedAlumni.secondary_email || "N/A"}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-slate-600 uppercase">Mobile</p>
                    <p className="font-semibold text-slate-900">
                      {selectedAlumni.mobile_no}
                    </p>
                  </div>
                  <div className="col-span-3">
                    <p className="text-xs text-slate-600 uppercase">
                      Secondary Phone
                    </p>
                    <p className="font-semibold text-slate-900">
                      {selectedAlumni.secondary_phone || "N/A"}
                    </p>
                  </div>
                </div>
              </div>

              {/* Academic Information */}
              <div>
                <p className="text-sm text-slate-500 uppercase tracking-wider mb-3 font-semibold">
                  Academic Information
                </p>
                <div className="grid grid-cols-2 gap-4 p-4 bg-blue-50 rounded-lg">
                  <div>
                    <p className="text-xs text-slate-600 uppercase">
                      Enrollment Number
                    </p>
                    <p className="font-semibold text-slate-900">
                      {selectedAlumni.enrollment_number || "N/A"}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-slate-600 uppercase">Degree</p>
                    <p className="font-semibold text-slate-900">
                      {selectedAlumni.degree || "N/A"}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-slate-600 uppercase">Branch</p>
                    <p className="font-semibold text-slate-900">
                      {selectedAlumni.branch || "N/A"}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-slate-600 uppercase">
                      Sub-Institute
                    </p>
                    <p className="font-semibold text-slate-900">
                      {selectedAlumni.sub_institute || "N/A"}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-slate-600 uppercase">
                      Year of Joining
                    </p>
                    <p className="font-semibold text-slate-900">
                      {selectedAlumni.year_of_joining}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-slate-600 uppercase">
                      Year of Passing
                    </p>
                    <p className="font-semibold text-slate-900">
                      {selectedAlumni.year_of_passing}
                    </p>
                  </div>
                </div>
              </div>

              {/* Portal Registration Status */}
              <div className="p-4 bg-amber-50 rounded-lg border border-amber-200">
                <p className="text-xs text-amber-600 uppercase font-bold">PICT Alumni Portal Registration</p>
                <p className="text-lg font-semibold text-amber-900 mt-2">
                  {selectedAlumni.registered_for_portal === "Yes" ? (
                    <span className="flex items-center gap-2">
                      <span className="w-3 h-3 bg-green-500 rounded-full inline-block"></span>
                      Registered
                    </span>
                  ) : (
                    <span className="flex items-center gap-2">
                      <span className="w-3 h-3 bg-red-500 rounded-full inline-block"></span>
                      Not Registered
                    </span>
                  )}
                </p>
                {selectedAlumni.registered_for_portal === "Yes" && (
                  <p className="text-sm text-amber-600 mt-3">
                    <a href="https://alumni.pict.edu/" target="_blank" rel="noopener noreferrer" className="hover:underline">
                      👉 Visit Alumni Portal
                    </a>
                  </p>
                )}
              </div>

              {/* Professional Information */}
              <div>
                <p className="text-sm text-slate-500 uppercase tracking-wider mb-3 font-semibold">
                  Professional Information
                </p>
                <div className="grid grid-cols-2 gap-4 p-4 bg-emerald-50 rounded-lg">
                  <div>
                    <p className="text-xs text-slate-600 uppercase">Company</p>
                    <p className="font-semibold text-slate-900">
                      {selectedAlumni.company || "N/A"}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-slate-600 uppercase">
                      Designation
                    </p>
                    <p className="font-semibold text-slate-900">
                      {selectedAlumni.designation || "N/A"}
                    </p>
                  </div>
                  {selectedAlumni.linkedin_profile && (
                    <div className="col-span-2">
                      <p className="text-xs text-slate-600 uppercase">
                        LinkedIn Profile
                      </p>
                      <a
                        href={selectedAlumni.linkedin_profile}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="font-semibold text-blue-600 hover:underline break-all"
                      >
                        {selectedAlumni.linkedin_profile}
                      </a>
                    </div>
                  )}
                </div>
              </div>

              {/* Address Information */}
              <div>
                <p className="text-sm text-slate-500 uppercase tracking-wider mb-3 font-semibold">
                  Address
                </p>
                <div className="p-4 bg-slate-50 rounded-lg">
                  <p className="font-semibold text-slate-900">
                    {selectedAlumni.address || "N/A"}
                  </p>
                </div>
              </div>

              {/* Visit Details */}
              <div>
                <p className="text-sm text-slate-500 uppercase tracking-wider mb-3 font-semibold">
                  Visit Information
                </p>
                <div className="grid grid-cols-2 gap-4 p-4 bg-purple-50 rounded-lg">
                  <div>
                    <p className="text-xs text-slate-600 uppercase">
                      Meeting Type
                    </p>
                    <p className="font-semibold text-slate-900 capitalize">
                      {selectedAlumni.whom_to_meet || "N/A"}
                    </p>
                  </div>
                  <div className="col-span-2">
                    <p className="text-xs text-slate-600 uppercase">
                      Meeting With
                    </p>
                    <p className="font-semibold text-slate-900">
                      {selectedAlumni.selected_person_name || "N/A"}
                    </p>
                    {selectedAlumni.selected_person_mobile && (
                      <p className="text-xs text-slate-600 mt-1">
                        📱 {selectedAlumni.selected_person_mobile}
                      </p>
                    )}
                  </div>
                </div>
              </div>

              {/* QR Code */}
              <div className="p-4 bg-slate-50 rounded-lg">
                <p className="text-xs text-slate-600 uppercase">Valid Till</p>
                <p className="font-semibold text-slate-900">
                  {new Date(selectedAlumni.valid_till).toLocaleDateString()}
                </p>
              </div>

              <div className="flex gap-4 pt-4 border-t">
                <Button
                  onClick={() => setShowModal(false)}
                  className="flex-1 bg-slate-900 hover:bg-slate-800"
                >
                  Close
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
