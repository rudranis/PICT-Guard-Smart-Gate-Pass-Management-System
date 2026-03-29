import { useState, useRef, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Webcam from "react-webcam";
import { QRCodeSVG } from "qrcode.react";
import { Camera, ShieldCheck, Search, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;

export default function AlumniRegistration() {
  const navigate = useNavigate();
  const webcamRef = useRef(null);
  const [step, setStep] = useState("form"); // 'form', 'camera', 'success'
  const [formData, setFormData] = useState({
    first_name: "",
    middle_name: "",
    last_name: "",
    email: "",
    secondary_email: "",
    mobile_no: "",
    secondary_phone: "",
    enrollment_number: "",
    gender: "",
    degree: "",
    branch: "",
    address: "",
    designation: "",
    company: "",
    year_of_passing: "",
    year_of_joining: "",
    sub_institute: "",
    registered_for_portal: "",
    linkedin_profile: "",
    whom_to_meet: "", // 'faculty', 'student', 'visitor'
    selected_person_id: "",
    selected_person_name: "",
    selected_person_mobile: "",
  });

  const [photoBase64, setPhotoBase64] = useState(null);
  const [registrationData, setRegistrationData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [countdown, setCountdown] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  const [selectedPerson, setSelectedPerson] = useState(null);

  const degreeOptions = ["BE", "BTech", "ME","MTech", "PhD", "PhDM"];
  const branchOptions = [
    "Computer Engineering",
    "Information Technology",
    "Artificial Intelligence",
    "Electronics and Telecommunication Engineering",
    "Electronics and Computer Engineering",
    "Other",
  ];
  const genderOptions = ["Male", "Female", "Other"];
  const subInstituteOptions = [
    "Pune Institute of Computer Technology",
    "SCTR'S Pune Institute of Computer Technology",
  ];
  const handleSearch = async (e) => {
    const query = e.target.value;
    setSearchQuery(query);

    if (query.trim().length < 2) {
      setSearchResults([]);
      return;
    }

    setIsSearching(true);
    try {
      let endpoint = "";
      if (formData.whom_to_meet === "faculty") {
        endpoint = `/search/faculty?query=${encodeURIComponent(query)}`;
      } else if (formData.whom_to_meet === "student") {
        endpoint = `/search/students?query=${encodeURIComponent(query)}`;
      }

      if (endpoint) {
        const response = await axios.get(`${BACKEND_URL}/api${endpoint}`);
        setSearchResults(response.data);
      }
    } catch (error) {
      console.error("Search error:", error);
      toast.error("Error searching. Please try again.");
    } finally {
      setIsSearching(false);
    }
  };

  // Handle selecting a person from search results
  const handleSelectPerson = (person) => {
    const personId = person.faculty_id || person.reg_no || "";
    const personName = person.name || "";
    const personMobile = person.mobile_no || "";

    setSelectedPerson(person);
    setFormData({
      ...formData,
      selected_person_id: personId,
      selected_person_name: personName,
      selected_person_mobile: personMobile,
    });
    setSearchResults([]);
    setSearchQuery("");
    toast.success(`Selected: ${personName}`);
  };

  // Handle clearing selected person
  const handleClearSelected = () => {
    setSelectedPerson(null);
    setFormData({
      ...formData,
      selected_person_id: "",
      selected_person_name: "",
      selected_person_mobile: "",
    });
    setSearchQuery("");
  };

  // Mask phone number - show only last 4 digits
  const maskPhoneNumber = (phone) => {
    if (!phone) return "";
    const phoneStr = phone.toString();
    if (phoneStr.length <= 4) return phoneStr;
    return "XXXX" + phoneStr.slice(-4);
  };

  const capture = useCallback(() => {
    // Countdown
    let count = 3;
    setCountdown(count);
    const interval = setInterval(() => {
      count--;
      if (count === 0) {
        clearInterval(interval);
        setCountdown(null);
        const imageSrc = webcamRef.current.getScreenshot();
        setPhotoBase64(imageSrc);
        setStep("form");
      } else {
        setCountdown(count);
      }
    }, 1000);
  }, [webcamRef]);

  const handleInputChange = (field, value) => {
    setFormData({ ...formData, [field]: value });
  };

  const handleWhomToMeetChange = (value) => {
    setFormData({
      ...formData,
      whom_to_meet: value,
      selected_person_id: "",
      selected_person_name: "",
      selected_person_mobile: "",
    });
    setSelectedPerson(null);
    setSearchQuery("");
    setSearchResults([]);
  };

  // Validate required fields
  const validateForm = () => {
    const requiredFields = [
      "first_name",
      "last_name",
      "email",
      "mobile_no",
      "gender",
      "degree",
      "branch",
      "address",
      "designation",
      "company",
      "year_of_passing",
      "year_of_joining",
      "sub_institute",
      "whom_to_meet",
      "registered_for_portal",
    ];

    for (let field of requiredFields) {
      if (!formData[field]) {
        toast.error(`Please fill in ${field.replace(/_/g, " ")}`);
        return false;
      }
    }

    // Validate mobile number - exactly 10 digits
    const mobileRegex = /^\d{10}$/;
    if (!mobileRegex.test(formData.mobile_no)) {
      toast.error("Mobile number must be exactly 10 digits");
      return false;
    }

    // Validate secondary phone if provided - must be 10 digits
    if (formData.secondary_phone && !mobileRegex.test(formData.secondary_phone)) {
      toast.error("Secondary mobile number must be exactly 10 digits");
      return false;
    }

    if (
      (formData.whom_to_meet === "faculty" ||
        formData.whom_to_meet === "student") &&
      !selectedPerson
    ) {
      toast.error(`Please select a ${formData.whom_to_meet}`);
      return false;
    }

    if (!photoBase64) {
      toast.error("Please capture a photo");
      return false;
    }

    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setLoading(true);

    try {
      const response = await axios.post(`${BACKEND_URL}/api/alumni`, {
        ...formData,
        photo_base64: photoBase64,
      });

      setRegistrationData(response.data);
      setStep("success");
      toast.success("Registration successful! QR code sent to your email.");
    } catch (error) {
      toast.error(error.response?.data?.detail || "Registration failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="min-h-screen bg-gradient-to-b from-white to-blue-50"
      data-testid="alumni-registration"
    >
      {/* Header */}
      <header className="bg-gradient-to-r from-blue-700 to-blue-600 border-b-4 border-blue-400 shadow-lg sticky top-0 z-50">
        <div className="container mx-auto px-3 sm:px-4 md:px-6 py-4 sm:py-5 flex items-center justify-between gap-2 sm:gap-3">
          <div className="flex items-center gap-2 sm:gap-3 flex-1 min-w-0">
            <div className="w-10 sm:w-12 h-10 sm:h-12 bg-white rounded-lg flex items-center justify-center shadow-md flex-shrink-0">
              <ShieldCheck className="w-5 sm:w-7 h-5 sm:h-7 text-blue-700" />
            </div>
            <div className="min-w-0">
              <h1 className="text-base sm:text-xl md:text-2xl font-bold text-white tracking-tight truncate">
                Alumni Registration
              </h1>
              <p className="text-xs text-blue-100 font-medium hidden sm:block">PICT Guard - Register as Alumni</p>
            </div>
          </div>
          <Button
            onClick={() => navigate("/")}
            variant="ghost"
            className="text-white hover:bg-white/20 font-semibold text-xs sm:text-sm h-9 sm:h-10 px-3 sm:px-5 rounded-lg transition-all duration-300 flex-shrink-0"
            data-testid="back-to-home"
          >
            Home
          </Button>
        </div>
      </header>

      <div className="container mx-auto px-3 sm:px-4 md:px-6 py-4 sm:py-6 md:py-12 max-w-4xl">
        {/* Form Step */}
        {step === "form" && (
          <div className="bg-white rounded-lg sm:rounded-2xl shadow-xl border-2 border-blue-100 overflow-hidden">
            {/* Form Header */}
            <div className="bg-gradient-to-r from-blue-600 to-blue-500 px-4 sm:px-6 md:px-8 py-4 sm:py-6 md:py-8">
              <h2 className="text-lg sm:text-2xl md:text-3xl font-bold text-white mb-1 sm:mb-2">
                Alumni Profile
              </h2>
              <p className="text-blue-100 text-xs sm:text-sm">Fill all fields to generate your digital gate pass</p>
            </div>

            <form onSubmit={handleSubmit} className="p-4 sm:p-6 md:p-8 space-y-4 sm:space-y-6 md:space-y-8">
              {/* Personal Information Section */}
              <div className="space-y-4 p-3 sm:p-4 md:p-6 bg-gradient-to-br from-blue-50 to-blue-100/50 rounded-lg sm:rounded-xl border-2 border-blue-200">
                <div className="flex items-center gap-2 mb-3 sm:mb-4">
                  <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center flex-shrink-0">
                    <span className="text-white font-bold text-sm">👤</span>
                  </div>
                  <h3 className="text-base sm:text-lg font-bold text-blue-900">Personal Info</h3>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
                  <div>
                    <Label htmlFor="first_name" className="text-xs sm:text-sm font-semibold text-blue-900 mb-1 sm:mb-2 block">
                      First Name *
                    </Label>
                    <Input
                      id="first_name"
                      type="text"
                      placeholder="First name"
                      value={formData.first_name}
                      onChange={(e) =>
                        handleInputChange("first_name", e.target.value)
                      }
                      required
                      className="h-9 sm:h-10 md:h-11 text-sm border-2 border-blue-200 focus:border-blue-500 focus:ring-blue-500 rounded-lg"
                      data-testid="alumni-first-name"
                    />
                  </div>

                  <div>
                    <Label
                      htmlFor="middle_name"
                      className="text-xs sm:text-sm font-semibold text-blue-900 mb-1 sm:mb-2 block"
                    >
                      Middle Name
                    </Label>
                    <Input
                      id="middle_name"
                      type="text"
                      placeholder="Middle name"
                      value={formData.middle_name}
                      onChange={(e) =>
                        handleInputChange("middle_name", e.target.value)
                      }
                      className="h-9 sm:h-10 md:h-11 text-sm border-2 border-blue-200 focus:border-blue-500 focus:ring-blue-500 rounded-lg"
                      data-testid="alumni-middle-name"
                    />
                  </div>

                  <div>
                    <Label htmlFor="last_name" className="text-xs sm:text-sm font-semibold text-blue-900 mb-1 sm:mb-2 block">
                      Last Name *
                    </Label>
                    <Input
                      id="last_name"
                      type="text"
                      placeholder="Last name"
                      value={formData.last_name}
                      onChange={(e) =>
                        handleInputChange("last_name", e.target.value)
                      }
                      required
                      className="h-9 sm:h-10 md:h-11 text-sm border-2 border-blue-200 focus:border-blue-500 focus:ring-blue-500 rounded-lg"
                      data-testid="alumni-last-name"
                    />
                  </div>
                </div>

                {/* Gender Field */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                  <div>
                    <Label htmlFor="gender" className="text-xs sm:text-sm font-semibold text-blue-900 mb-1 sm:mb-2 block">
                      Gender *
                    </Label>
                    <select
                      id="gender"
                      value={formData.gender}
                      onChange={(e) =>
                        handleInputChange("gender", e.target.value)
                      }
                      required
                      className="w-full h-9 sm:h-10 md:h-11 px-3 sm:px-4 py-1 sm:py-2 text-sm border-2 border-blue-200 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white font-medium text-blue-900"
                      data-testid="alumni-gender"
                    >
                      <option value="">-- Select Gender --</option>
                      {genderOptions.map((option) => (
                        <option key={option} value={option}>
                          {option}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>

              {/* Contact Information Section */}
              <div className="space-y-3 sm:space-y-4 p-3 sm:p-4 md:p-6 bg-gradient-to-br from-emerald-50 to-emerald-100/50 rounded-lg sm:rounded-xl border-2 border-emerald-200">
                <div className="flex items-center gap-2 mb-3 sm:mb-4">
                  <div className="w-8 h-8 bg-emerald-600 rounded-lg flex items-center justify-center flex-shrink-0">
                    <span className="text-white font-bold text-sm">📧</span>
                  </div>
                  <h3 className="text-base sm:text-lg font-bold text-emerald-900">Contact Info</h3>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4">
                  <div>
                    <Label htmlFor="email" className="text-xs sm:text-sm font-semibold text-emerald-900 mb-1 sm:mb-2 block">
                      Primary Email *
                    </Label>
                    <Input
                      id="email"
                      type="email"
                      placeholder="your@email.com"
                      value={formData.email}
                      onChange={(e) =>
                        handleInputChange("email", e.target.value)
                      }
                      required
                      className="h-9 sm:h-10 md:h-11 text-sm border-2 border-emerald-200 focus:border-emerald-500 focus:ring-emerald-500 rounded-lg"
                      data-testid="alumni-email"
                    />
                  </div>

                  <div>
                    <Label
                      htmlFor="secondary_email"
                      className="text-xs sm:text-sm font-semibold text-emerald-900 mb-1 sm:mb-2 block"
                    >
                      Secondary Email
                    </Label>
                    <Input
                      id="secondary_email"
                      type="email"
                      placeholder="alternate@email.com"
                      value={formData.secondary_email}
                      onChange={(e) =>
                        handleInputChange("secondary_email", e.target.value)
                      }
                      className="h-9 sm:h-10 md:h-11 text-sm border-2 border-emerald-200 focus:border-emerald-500 focus:ring-emerald-500 rounded-lg"
                      data-testid="alumni-secondary-email"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4">
                  <div>
                    <Label htmlFor="mobile_no" className="text-xs sm:text-sm font-semibold text-emerald-900 mb-1 sm:mb-2 block">
                      Primary Mobile *
                    </Label>
                    <Input
                      id="mobile_no"
                      type="tel"
                      placeholder="9876543210"
                      value={formData.mobile_no}
                      onChange={(e) => {
                        const value = e.target.value.replace(/\D/g, "").slice(0, 10);
                        handleInputChange("mobile_no", value);
                      }}
                      maxLength="10"
                      required
                      className="h-9 sm:h-10 md:h-11 text-sm border-2 border-emerald-200 focus:border-emerald-500 focus:ring-emerald-500 rounded-lg"
                      data-testid="alumni-mobile"
                    />
                  </div>

                  <div>
                    <Label
                      htmlFor="secondary_phone"
                      className="text-xs sm:text-sm font-semibold text-emerald-900 mb-1 sm:mb-2 block"
                    >
                      Secondary Mobile
                    </Label>
                    <Input
                      id="secondary_phone"
                      type="tel"
                      placeholder="9876543210"
                      value={formData.secondary_phone}
                      onChange={(e) => {
                        const value = e.target.value.replace(/\D/g, "").slice(0, 10);
                        handleInputChange("secondary_phone", value);
                      }}
                      maxLength="10"
                      className="h-9 sm:h-10 md:h-11 text-sm border-2 border-emerald-200 focus:border-emerald-500 focus:ring-emerald-500 rounded-lg"
                      data-testid="alumni-secondary-phone"
                    />
                  </div>
                </div>
              </div>

              {/* Academic Information Section */}
              <div className="space-y-3 sm:space-y-4 p-3 sm:p-4 md:p-6 bg-gradient-to-br from-purple-50 to-purple-100/50 rounded-lg sm:rounded-xl border-2 border-purple-200">
                <div className="flex items-center gap-2 mb-3 sm:mb-4">
                  <div className="w-8 h-8 bg-purple-600 rounded-lg flex items-center justify-center flex-shrink-0">
                    <span className="text-white font-bold text-sm">🎓</span>
                  </div>
                  <h3 className="text-base sm:text-lg font-bold text-purple-900">Academic Info</h3>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4">
                  <div>
                    <Label
                      htmlFor="enrollment_number"
                      className="text-xs sm:text-sm font-semibold text-purple-900 mb-1 sm:mb-2 block"
                    >
                      Enrollment Number / GRN
                    </Label>
                    <Input
                      id="enrollment_number"
                      type="text"
                      placeholder="Enter enrollment number"
                      value={formData.enrollment_number}
                      onChange={(e) =>
                        handleInputChange("enrollment_number", e.target.value)
                      }
                      className="h-9 sm:h-10 md:h-11 text-sm border-2 border-purple-200 focus:border-purple-500 focus:ring-purple-500 rounded-lg"
                      data-testid="alumni-enrollment"
                    />
                  </div>

                  <div>
                    <Label htmlFor="degree" className="text-xs sm:text-sm font-semibold text-purple-900 mb-1 sm:mb-2 block">
                      Degree *
                    </Label>
                    <select
                      id="degree"
                      value={formData.degree}
                      onChange={(e) =>
                        handleInputChange("degree", e.target.value)
                      }
                      required
                      className="w-full h-9 sm:h-10 md:h-11 px-3 sm:px-4 py-1 sm:py-2 text-sm border-2 border-purple-200 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500 bg-white font-medium text-purple-900"
                      data-testid="alumni-degree"
                    >
                      <option value="">-- Select Degree --</option>
                      {degreeOptions.map((option) => (
                        <option key={option} value={option}>
                          {option}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4">
                  <div>
                    <Label htmlFor="branch" className="text-xs sm:text-sm font-semibold text-purple-900 mb-1 sm:mb-2 block">
                      Branch *
                    </Label>
                    <select
                      id="branch"
                      value={formData.branch}
                      onChange={(e) =>
                        handleInputChange("branch", e.target.value)
                      }
                      required
                      className="w-full h-9 sm:h-10 md:h-11 px-3 sm:px-4 py-1 sm:py-2 text-sm border-2 border-purple-200 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500 bg-white font-medium text-purple-900"
                      data-testid="alumni-branch"
                    >
                      <option value="">-- Select Branch --</option>
                      {branchOptions.map((option) => (
                        <option key={option} value={option}>
                          {option}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <Label
                      htmlFor="sub_institute"
                      className="text-xs sm:text-sm font-semibold text-purple-900 mb-1 sm:mb-2 block"
                    >
                      College *
                    </Label>
                    <select
                      id="sub_institute"
                      value={formData.sub_institute}
                      onChange={(e) =>
                        handleInputChange("sub_institute", e.target.value)
                      }
                      required
                      className="w-full h-9 sm:h-10 md:h-11 px-3 sm:px-4 py-1 sm:py-2 text-sm border-2 border-purple-200 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500 bg-white font-medium text-purple-900"
                      data-testid="alumni-sub-institute"
                    >
                      <option value="">-- Select College --</option>
                      {subInstituteOptions.map((option) => (
                        <option key={option} value={option}>
                          {option}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                  <div>
                    <Label
                      htmlFor="year_of_joining"
                      className="text-xs sm:text-sm font-semibold text-purple-900 mb-1 sm:mb-2 block"
                    >
                      Year of Joining *
                    </Label>
                    <Input
                      id="year_of_joining"
                      type="number"
                      placeholder="2019"
                      value={formData.year_of_joining}
                      onChange={(e) =>
                        handleInputChange("year_of_joining", e.target.value)
                      }
                      required
                      className="h-9 sm:h-10 md:h-11 text-sm border-2 border-purple-200 focus:border-purple-500 focus:ring-purple-500 rounded-lg"
                      data-testid="alumni-year-joining"
                    />
                  </div>

                  <div>
                    <Label
                      htmlFor="year_of_passing"
                      className="text-xs sm:text-sm font-semibold text-purple-900 mb-1 sm:mb-2 block"
                    >
                      Year of Passing *
                    </Label>
                    <Input
                      id="year_of_passing"
                      type="number"
                      placeholder="2023"
                      value={formData.year_of_passing}
                      onChange={(e) =>
                        handleInputChange("year_of_passing", e.target.value)
                      }
                      required
                      className="h-9 sm:h-10 md:h-11 text-sm border-2 border-purple-200 focus:border-purple-500 focus:ring-purple-500 rounded-lg"
                      data-testid="alumni-year-passing"
                    />
                  </div>
                </div>
              </div>

              {/* Professional Information Section */}
              <div className="space-y-3 sm:space-y-4 p-3 sm:p-4 md:p-6 bg-gradient-to-br from-orange-50 to-orange-100/50 rounded-lg sm:rounded-xl border-2 border-orange-200">
                <div className="flex items-center gap-2 mb-3 sm:mb-4">
                  <div className="w-8 h-8 bg-orange-600 rounded-lg flex items-center justify-center flex-shrink-0">
                    <span className="text-white font-bold text-sm">💼</span>
                  </div>
                  <h3 className="text-base sm:text-lg font-bold text-orange-900">Professional Info</h3>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4">
                  <div>
                    <Label htmlFor="company" className="text-xs sm:text-sm font-semibold text-orange-900 mb-1 sm:mb-2 block">
                      Current Company *
                    </Label>
                    <Input
                      id="company"
                      type="text"
                      placeholder="Enter company name"
                      value={formData.company}
                      onChange={(e) =>
                        handleInputChange("company", e.target.value)
                      }
                      required
                      className="h-9 sm:h-10 md:h-11 text-sm border-2 border-orange-200 focus:border-orange-500 focus:ring-orange-500 rounded-lg"
                      data-testid="alumni-company"
                    />
                  </div>

                  <div>
                    <Label
                      htmlFor="designation"
                      className="text-xs sm:text-sm font-semibold text-orange-900 mb-1 sm:mb-2 block"
                    >
                      Designation *
                    </Label>
                    <Input
                      id="designation"
                      type="text"
                      placeholder="Enter your designation"
                      value={formData.designation}
                      onChange={(e) =>
                        handleInputChange("designation", e.target.value)
                      }
                      required
                      className="h-9 sm:h-10 md:h-11 text-sm border-2 border-orange-200 focus:border-orange-500 focus:ring-orange-500 rounded-lg"
                      data-testid="alumni-designation"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4">
                  <div>
                    <Label htmlFor="address" className="text-xs sm:text-sm font-semibold text-orange-900 mb-1 sm:mb-2 block">
                      Current Address *
                    </Label>
                    <Input
                      id="address"
                      type="text"
                      placeholder="Enter your current address"
                      value={formData.address}
                      onChange={(e) =>
                        handleInputChange("address", e.target.value)
                      }
                      required
                      className="h-9 sm:h-10 md:h-11 text-sm border-2 border-orange-200 focus:border-orange-500 focus:ring-orange-500 rounded-lg"
                      data-testid="alumni-address"
                    />
                  </div>

                  <div>
                    <Label
                      htmlFor="linkedin_profile"
                      className="text-xs sm:text-sm font-semibold text-orange-900 mb-1 sm:mb-2 block"
                    >
                      LinkedIn Profile
                    </Label>
                    <Input
                      id="linkedin_profile"
                      type="url"
                      placeholder="https://linkedin.com/in/profile"
                      value={formData.linkedin_profile}
                      onChange={(e) =>
                        handleInputChange("linkedin_profile", e.target.value)
                      }
                      className="h-9 sm:h-10 md:h-11 text-sm border-2 border-orange-200 focus:border-orange-500 focus:ring-orange-500 rounded-lg"
                      data-testid="alumni-linkedin"
                    />
                  </div>
                </div>
              </div>

              {/* Alumni Portal Registration */}
              <div className="space-y-3 sm:space-y-4 p-3 sm:p-4 md:p-6 bg-blue-50 rounded-lg sm:rounded-xl border-2 border-blue-200">
                <h3 className="text-base sm:text-lg font-semibold text-slate-900">
                  PICT Alumni Portal
                </h3>

                <div className="space-y-2 sm:space-y-3">
                  <Label className="text-xs sm:text-sm font-medium">
                    Have you registered for the PICT Alumni Portal? *
                  </Label>
                  <div className="flex items-center gap-4 sm:gap-6">
                    <div className="flex items-center">
                      <input
                        type="radio"
                        id="portal-yes"
                        name="registered_for_portal"
                        value="yes"
                        checked={formData.registered_for_portal === "yes"}
                        onChange={(e) =>
                          handleInputChange("registered_for_portal", e.target.value)
                        }
                        className="w-4 h-4 text-blue-600"
                        data-testid="alumni-portal-yes"
                      />
                      <Label htmlFor="portal-yes" className="ml-2 cursor-pointer font-normal text-sm">
                        Yes
                      </Label>
                    </div>
                    <div className="flex items-center">
                      <input
                        type="radio"
                        id="portal-no"
                        name="registered_for_portal"
                        value="no"
                        checked={formData.registered_for_portal === "no"}
                        onChange={(e) =>
                          handleInputChange("registered_for_portal", e.target.value)
                        }
                        className="w-4 h-4 text-blue-600"
                        data-testid="alumni-portal-no"
                      />
                      <Label htmlFor="portal-no" className="ml-2 cursor-pointer font-normal text-sm">
                        No
                      </Label>
                    </div>
                  </div>

                  {formData.registered_for_portal === "no" && (
                    <div className="p-3 sm:p-4 bg-blue-100 border border-blue-300 rounded-lg mt-3 sm:mt-4">
                      <p className="text-xs sm:text-sm text-blue-900 font-medium mb-2">
                        Register for the PICT Alumni Portal:
                      </p>
                      <a
                        href="https://alumni.pict.edu/"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-xs sm:text-sm text-blue-600 hover:text-blue-800 font-semibold underline break-all"
                      >
                        https://alumni.pict.edu/
                      </a>
                    </div>
                  )}
                </div>
              </div>

              {/* Whom to Meet Section */}
              <div className="space-y-3 sm:space-y-4 p-3 sm:p-4 md:p-6 bg-blue-50 rounded-lg sm:rounded-xl border-2 border-blue-200">
                <h3 className="text-base sm:text-lg font-semibold text-slate-900">
                  Meet With
                </h3>

                <div>
                  <Label htmlFor="whom_to_meet" className="text-xs sm:text-sm font-medium">
                    Who do you want to meet? *
                  </Label>
                  <select
                    id="whom_to_meet"
                    value={formData.whom_to_meet}
                    onChange={(e) => handleWhomToMeetChange(e.target.value)}
                    required
                    className="w-full h-9 sm:h-10 md:h-11 px-3 sm:px-4 py-1 sm:py-2 text-sm border-2 border-blue-200 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white font-medium text-slate-900 mt-1 sm:mt-2"
                    data-testid="alumni-whom-to-meet"
                  >
                    <option value="">-- Select --</option>
                    <option value="faculty">Faculty Member</option>
                    <option value="student">Student</option>
                    <option value="visitor">Visitor</option>
                  </select>
                </div>

                {/* Search Section */}
                {(formData.whom_to_meet === "faculty" ||
                  formData.whom_to_meet === "student") && (
                  <div className="space-y-2 sm:space-y-3 mt-3 sm:mt-4">
                    <Label htmlFor="search" className="text-xs sm:text-sm font-medium">
                      Search by Name, Mobile, or{" "}
                      {formData.whom_to_meet === "faculty"
                        ? "Faculty ID"
                        : "GRN"}{" "}
                      *
                    </Label>
                    <div className="relative">
                      <Input
                        id="search"
                        type="text"
                        placeholder={`Search ${formData.whom_to_meet}...`}
                        value={searchQuery}
                        onChange={handleSearch}
                        className="h-9 sm:h-10 md:h-11 text-sm pl-10 border-2 border-blue-200 focus:border-blue-500 focus:ring-blue-500 rounded-lg"
                        data-testid="alumni-search-person"
                      />
                      <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
                    </div>

                    {selectedPerson && (
                      <div className="p-3 sm:p-4 bg-emerald-50 border border-emerald-200 rounded-lg flex items-center justify-between gap-2 text-sm">
                        <div>
                          <p className="font-semibold text-emerald-900">
                            {selectedPerson.name}
                          </p>
                          <p className="text-emerald-700 font-medium mt-1 text-xs">
                            📱 {maskPhoneNumber(selectedPerson.mobile_no)}
                          </p>
                          {selectedPerson.faculty_id && (
                            <p className="text-xs text-emerald-600 mt-1">
                              Faculty ID: {selectedPerson.faculty_id}
                            </p>
                          )}
                          {selectedPerson.reg_no && (
                            <p className="text-xs text-emerald-600 mt-1">
                              GRN: {selectedPerson.reg_no}
                            </p>
                          )}
                        </div>
                        <button
                          type="button"
                          onClick={handleClearSelected}
                          className="text-emerald-600 hover:text-emerald-900 flex-shrink-0"
                        >
                          <X className="w-5 h-5" />
                        </button>
                      </div>
                    )}

                    {searchQuery &&
                      !selectedPerson &&
                      searchResults.length > 0 && (
                        <div className="border border-slate-300 rounded-lg bg-white shadow-lg max-h-64 sm:max-h-96 overflow-y-auto">
                          {searchResults.map((result, index) => (
                            <button
                              key={index}
                              type="button"
                              onClick={() => handleSelectPerson(result)}
                              className="w-full p-2 sm:p-4 hover:bg-blue-50 text-left border-b border-slate-100 last:border-b-0 transition-colors"
                              data-testid="alumni-search-result"
                            >
                              <div className="flex justify-between items-start gap-2 text-sm">
                                <div className="flex-1 min-w-0">
                                  <p className="font-semibold text-slate-900">
                                    {result.name}
                                  </p>
                                  <p className="text-xs sm:text-sm font-medium text-blue-600 mt-1">
                                    📱 {maskPhoneNumber(result.mobile_no)}
                                  </p>
                                </div>
                              </div>
                              {result.faculty_id && (
                                <p className="text-xs text-slate-500 mt-2">
                                  Faculty ID: {result.faculty_id}
                                </p>
                              )}
                              {result.reg_no && (
                                <p className="text-xs text-slate-500 mt-2">
                                  GRN: {result.reg_no}
                                </p>
                              )}
                            </button>
                          ))}
                        </div>
                      )}

                    {searchQuery && !selectedPerson && isSearching && (
                      <div className="text-center p-3 sm:p-4 text-slate-600 text-sm">
                        Searching...
                      </div>
                    )}

                    {searchQuery &&
                      !selectedPerson &&
                      !isSearching &&
                      searchResults.length === 0 && (
                        <div className="text-center p-3 sm:p-4 text-slate-600 text-sm">
                          No {formData.whom_to_meet}s found. Try another search.
                        </div>
                      )}
                  </div>
                )}
              </div>

              {/* Photo Capture */}
              <div className="space-y-3 sm:space-y-4 p-3 sm:p-4 md:p-6 bg-gradient-to-br from-indigo-50 to-indigo-100/50 rounded-lg sm:rounded-xl border-2 border-indigo-200">
                <div className="flex items-center gap-2 mb-3 sm:mb-4">
                  <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center flex-shrink-0">
                    <span className="text-white font-bold text-sm">📸</span>
                  </div>
                  <Label className="text-base sm:text-lg font-bold text-indigo-900">Photo (Selfie) *</Label>
                </div>
                <div>
                  {!photoBase64 ? (
                    <Button
                      type="button"
                      onClick={() => setStep("camera")}
                      className="w-full h-10 sm:h-11 md:h-12 bg-indigo-600 hover:bg-indigo-700 font-semibold text-sm sm:text-base text-white rounded-lg transition-all duration-300"
                      data-testid="capture-photo-btn"
                    >
                      <Camera className="w-4 h-4 mr-2" />
                      Capture Photo
                    </Button>
                  ) : (
                    <div className="space-y-3 sm:space-y-4">
                      <img
                        src={photoBase64}
                        alt="Captured"
                        className="w-full h-auto rounded-lg max-h-40 sm:max-h-56 object-cover"
                      />
                      <Button
                        type="button"
                        onClick={() => setStep("camera")}
                        className="w-full h-10 sm:h-11 bg-indigo-600 hover:bg-indigo-700 font-semibold text-sm sm:text-base text-white rounded-lg"
                        data-testid="retake-photo-btn"
                      >
                        Retake Photo
                      </Button>
                    </div>
                  )}
                </div>
              </div>

              {/* Submit Button */}
              <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
                <Button
                  type="button"
                  onClick={() => navigate("/")}
                  variant="outline"
                  className="flex-1 h-10 sm:h-11 md:h-12 font-semibold text-sm sm:text-base border-2 hover:bg-gray-100 rounded-lg"
                  data-testid="alumni-cancel"
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  className="flex-1 h-10 sm:h-11 md:h-12 bg-blue-600 hover:bg-blue-700 font-semibold text-sm sm:text-base text-white rounded-lg transition-all duration-300 disabled:opacity-50"
                  disabled={loading}
                  data-testid="alumni-submit-btn"
                >
                  {loading ? "Registering..." : "Complete Registration"}
                </Button>
              </div>
            </form>
          </div>
        )}

        {/* Camera Step */}
        {step === "camera" && (
          <div className="bg-white rounded-lg sm:rounded-2xl shadow-xl p-3 sm:p-6 md:p-8 max-w-4xl mx-auto">
            <h2 className="text-lg sm:text-2xl md:text-3xl font-bold text-slate-900 mb-4 sm:mb-6 tracking-tight text-center">
              Take a Selfie
            </h2>
            <div className="relative mb-4 sm:mb-6 rounded-lg overflow-hidden bg-black">
              <Webcam
                ref={webcamRef}
                audio={false}
                screenshotFormat="image/jpeg"
                className="w-full qr-scanner-video"
                mirrored
                data-testid="webcam"
              />
              {countdown && (
                <div className="absolute inset-0 flex items-center justify-center bg-black/50 rounded-lg">
                  <span className="text-6xl sm:text-8xl font-bold text-white">
                    {countdown}
                  </span>
                </div>
              )}
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                <div className="w-40 sm:w-64 h-40 sm:h-64 border-2 border-dashed border-white/50 rounded-full"></div>
              </div>
            </div>
            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
              <Button
                onClick={() => setStep("form")}
                variant="outline"
                className="flex-1 h-10 sm:h-11 md:h-12 text-sm sm:text-base border-2 hover:bg-gray-100 rounded-lg font-semibold"
                data-testid="cancel-camera"
              >
                Cancel
              </Button>
              <Button
                onClick={capture}
                className="flex-1 h-10 sm:h-11 md:h-12 bg-blue-600 hover:bg-blue-700 text-sm sm:text-base text-white font-semibold rounded-lg"
                disabled={countdown !== null}
                data-testid="capture-btn"
              >
                <Camera className="w-4 h-4 mr-2" />
                Capture
              </Button>
            </div>
          </div>
        )}

        {/* Success Step */}
        {step === "success" && registrationData && (
          <div
            className="bg-white rounded-lg sm:rounded-2xl shadow-xl p-3 sm:p-6 md:p-8 text-center max-w-4xl mx-auto"
            data-testid="registration-success"
          >
            <div className="w-12 sm:w-16 md:w-20 h-12 sm:h-16 md:h-20 bg-emerald-500 rounded-full flex items-center justify-center mx-auto mb-3 sm:mb-4 md:mb-6">
              <ShieldCheck className="w-6 sm:w-8 md:w-10 h-6 sm:h-8 md:h-10 text-white" />
            </div>
            <h2 className="text-lg sm:text-2xl md:text-3xl font-bold text-slate-900 mb-1 sm:mb-2 md:mb-4 tracking-tight">
              Registration Successful!
            </h2>
            <p className="text-sm sm:text-base text-slate-600 mb-4 sm:mb-6 md:mb-8 px-2">
              Your gate pass has been generated and sent to your email.
            </p>

            {/* Alumni Meeting Info Card */}
            {formData.whom_to_meet && (
              <div className="mb-4 sm:mb-6 md:mb-8 p-3 sm:p-4 md:p-6 bg-green-50 rounded-lg border-2 border-green-200 mx-auto max-w-2xl">
                <p className="text-xs sm:text-sm text-green-600 uppercase tracking-wider font-semibold mb-2 sm:mb-3">
                  You are meeting with
                </p>
                <div className="space-y-1 sm:space-y-2">
                  <p className="text-base sm:text-lg md:text-xl font-bold text-green-900">
                    {formData.selected_person_name || "Not Specified"}
                  </p>
                  <p className="text-xs sm:text-sm text-green-700">
                    <strong>Type:</strong>{" "}
                    {formData.whom_to_meet.charAt(0).toUpperCase() +
                      formData.whom_to_meet.slice(1)}
                  </p>
                  {formData.selected_person_mobile && (
                    <p className="text-xs sm:text-sm text-green-700">
                      <strong>Contact:</strong>{" "}
                      {formData.selected_person_mobile}
                    </p>
                  )}
                </div>
              </div>
            )}

            <div
              className="bg-white p-2 sm:p-3 md:p-6 rounded-lg border-2 border-slate-200 inline-flex items-center justify-center mb-4 sm:mb-6 md:mb-6"
              data-testid="alumni-qr"
            >
              <QRCodeSVG value={registrationData.token} size={150} level="H" className="sm:w-56 md:w-64" />
            </div>

            <div className="mb-4 sm:mb-6">
              <p className="text-xs text-slate-500 uppercase tracking-wider mb-1">
                Valid Until
              </p>
              <p
                className="text-sm sm:text-base md:text-lg font-semibold text-slate-900 font-mono"
                data-testid="alumni-valid-till"
              >
                {new Date(registrationData.valid_till).toLocaleDateString(
                  "en-US",
                  {
                    year: "numeric",
                    month: "short",
                    day: "numeric",
                    hour: "2-digit",
                    minute: "2-digit",
                  },
                )}
              </p>
            </div>

            <div className="p-2 sm:p-3 md:p-4 bg-sky-50 rounded-lg border-2 border-sky-200 mb-4 sm:mb-6 mx-2 sm:mx-auto">
              <p className="text-xs sm:text-sm text-sky-900 leading-relaxed">
                Please check your email for the QR code. You can also screenshot
                this page. This pass is valid for 24 hours only.
              </p>
            </div>

            <Button
              onClick={() => navigate("/")}
              className="w-full sm:w-auto h-10 sm:h-11 md:h-12 bg-blue-600 hover:bg-blue-700 text-white font-semibold text-sm sm:text-base px-4 sm:px-6 rounded-lg transition-all duration-300"
            >
              Go Back to Home
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
