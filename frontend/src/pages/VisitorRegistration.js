import { useState, useRef, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Webcam from "react-webcam";
import { QRCodeSVG } from "qrcode.react";
import { Camera, ShieldCheck, Search, X, Upload } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;

export default function VisitorRegistration() {
  const navigate = useNavigate();
  const webcamRef = useRef(null);
  const idProofInputRef = useRef(null);
  const [step, setStep] = useState("form"); // 'form', 'camera', 'success'
  const [formData, setFormData] = useState({
    full_name: "",
    phone_number: "",
    email: "",
    gender: "",
    date_of_birth: "",
    id_type: "",
    id_number: "",
    visitor_type: "", // 'student', 'faculty', 'visitor', 'worker'
    person_to_visit_id: "",
    person_to_visit_name: "",
    person_to_visit_mobile: "",
    purpose: "",
  });

  const [photoBase64, setPhotoBase64] = useState(null);
  const [idProofBase64, setIdProofBase64] = useState(null);
  const [idProofPreview, setIdProofPreview] = useState(null);
  const [registrationData, setRegistrationData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [countdown, setCountdown] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  const [selectedPerson, setSelectedPerson] = useState(null);

  // Handle search for faculty/students
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
      if (formData.visitor_type === "faculty") {
        endpoint = `/search/faculty?query=${encodeURIComponent(query)}`;
      } else if (formData.visitor_type === "student") {
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
      person_to_visit_id: personId,
      person_to_visit_name: personName,
      person_to_visit_mobile: personMobile,
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
      person_to_visit_id: "",
      person_to_visit_name: "",
      person_to_visit_mobile: "",
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

  // Handle ID Proof Image Upload
  const handleIdProofUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        toast.error("File size must be less than 5MB");
        return;
      }

      const reader = new FileReader();
      reader.onloadend = () => {
        setIdProofBase64(reader.result);
        setIdProofPreview(reader.result);
        toast.success("ID Proof uploaded successfully");
      };
      reader.readAsDataURL(file);
    }
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

  const handleVisitorTypeChange = (value) => {
    setFormData({
      ...formData,
      visitor_type: value,
      person_to_visit_id: "",
      person_to_visit_name: "",
      person_to_visit_mobile: "",
    });
    setSelectedPerson(null);
    setSearchQuery("");
    setSearchResults([]);
  };

  // Validate required fields
  const validateForm = () => {
    const requiredFields = [
      "full_name",
      "phone_number",
      "email",
      "gender",
      "date_of_birth",
      "id_type",
      "id_number",
      "visitor_type",
      "purpose",
    ];

    for (let field of requiredFields) {
      if (!formData[field]) {
        toast.error(`Please fill in ${field.replace(/_/g, " ")}`);
        return false;
      }
    }

    // Validate phone number - exactly 10 digits
    const mobileRegex = /^\d{10}$/;
    if (!mobileRegex.test(formData.phone_number)) {
      toast.error("Phone number must be exactly 10 digits");
      return false;
    }

    if (!idProofBase64) {
      toast.error("Please upload ID Proof");
      return false;
    }

    if (
      (formData.visitor_type === "faculty" ||
        formData.visitor_type === "student") &&
      !selectedPerson
    ) {
      toast.error(`Please select a ${formData.visitor_type}`);
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
      const response = await axios.post(`${BACKEND_URL}/api/visitors`, {
        ...formData,
        photo_base64: photoBase64,
        id_proof_base64: idProofBase64,
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
      data-testid="visitor-registration"
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
                Visitor Registration
              </h1>
              <p className="text-xs text-blue-100 font-medium hidden sm:block">PICT Guard - Register as Visitor</p>
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
                Visitor Registration
              </h2>
              <p className="text-blue-100 text-xs sm:text-sm">Fill all fields to generate your digital gate pass</p>
            </div>

            <form onSubmit={handleSubmit} className="p-4 sm:p-6 md:p-8 space-y-4 sm:space-y-6 md:space-y-8">
              {/* Basic Visitor Information Section */}
              <div className="space-y-4 p-5 sm:p-6 bg-gradient-to-br from-blue-50 to-blue-100/50 rounded-xl border-2 border-blue-200">
                <div className="flex items-center gap-2 mb-4">
                  <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                    <span className="text-white font-bold text-sm">📋</span>
                  </div>
                  <h3 className="text-lg font-bold text-blue-900">Basic Visitor Information</h3>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="full_name" className="text-sm font-semibold text-blue-900 mb-2 block">
                      Full Name *
                    </Label>
                    <Input
                      id="full_name"
                      type="text"
                      placeholder="Enter your full name"
                      value={formData.full_name}
                      onChange={(e) =>
                        handleInputChange("full_name", e.target.value)
                      }
                      required
                      className="mt-2 h-11 border-2 border-blue-200 focus:border-blue-500 focus:ring-blue-500 rounded-lg"
                      data-testid="visitor-full-name"
                    />
                  </div>

                  <div>
                    <Label
                      htmlFor="phone_number"
                      className="text-sm font-semibold text-blue-900 mb-2 block"
                    >
                      Phone Number (10 digits) *
                    </Label>
                    <Input
                      id="phone_number"
                      type="tel"
                      placeholder="9876543210"
                      value={formData.phone_number}
                      onChange={(e) => {
                        const value = e.target.value.replace(/\D/g, "").slice(0, 10);
                        handleInputChange("phone_number", value);
                      }}
                      maxLength="10"
                      required
                      className="mt-2 h-11 border-2 border-blue-200 focus:border-blue-500 focus:ring-blue-500 rounded-lg"
                      data-testid="visitor-phone"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="email" className="text-sm font-semibold text-blue-900 mb-2 block">
                      Email Address *
                    </Label>
                    <Input
                      id="email"
                      type="email"
                      placeholder="your.email@domain.com"
                      value={formData.email}
                      onChange={(e) =>
                        handleInputChange("email", e.target.value)
                      }
                      required
                      className="mt-2 h-11 border-2 border-blue-200 focus:border-blue-500 focus:ring-blue-500 rounded-lg"
                      data-testid="visitor-email"
                    />
                  </div>

                  <div>
                    <Label htmlFor="gender" className="text-sm font-semibold text-blue-900 mb-2 block">
                      Gender *
                    </Label>
                    <select
                      id="gender"
                      value={formData.gender}
                      onChange={(e) =>
                        handleInputChange("gender", e.target.value)
                      }
                      required
                      className="mt-2 w-full h-11 px-4 py-2 border-2 border-blue-200 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white font-medium text-blue-900"
                      data-testid="visitor-gender"
                    >
                      <option value="">-- Select Gender --</option>
                      <option value="Male">Male</option>
                      <option value="Female">Female</option>
                      <option value="Other">Other</option>
                    </select>
                  </div>
                </div>

                <div>
                  <Label
                    htmlFor="date_of_birth"
                    className="text-sm font-semibold text-blue-900 mb-2 block"
                  >
                    Age / Date of Birth *
                  </Label>
                  <Input
                    id="date_of_birth"
                    type="date"
                    value={formData.date_of_birth}
                    onChange={(e) =>
                      handleInputChange("date_of_birth", e.target.value)
                    }
                    required
                    className="mt-2 h-11 border-2 border-blue-200 focus:border-blue-500 focus:ring-blue-500 rounded-lg"
                    data-testid="visitor-dob"
                  />
                </div>
              </div>

              {/* Identification Details Section */}
              <div className="space-y-4 p-5 sm:p-6 bg-gradient-to-br from-purple-50 to-purple-100/50 rounded-xl border-2 border-purple-200">
                <div className="flex items-center gap-2 mb-4">
                  <div className="w-8 h-8 bg-purple-600 rounded-lg flex items-center justify-center">
                    <span className="text-white font-bold text-sm">🆔</span>
                  </div>
                  <h3 className="text-lg font-bold text-purple-900">Identification Details</h3>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="id_type" className="text-sm font-medium">
                      ID Type *
                    </Label>
                    <select
                      id="id_type"
                      value={formData.id_type}
                      onChange={(e) =>
                        handleInputChange("id_type", e.target.value)
                      }
                      required
                      className="mt-2 w-full h-10 px-3 py-2 border border-slate-300 rounded-md shadow-sm focus:outline-none focus:ring-slate-900 focus:border-slate-900"
                      data-testid="visitor-id-type"
                    >
                      <option value="">-- Select ID Type --</option>
                      <option value="Aadhar Card">Aadhar Card</option>
                      <option value="Passport">Passport</option>
                      <option value="Driving License">Driving License</option>
                      <option value="PAN Card">PAN Card</option>
                      <option value="Voter ID">Voter ID</option>
                      <option value="Other">Other</option>
                    </select>
                  </div>

                  <div>
                    <Label htmlFor="id_number" className="text-sm font-medium">
                      ID Number *
                    </Label>
                    <Input
                      id="id_number"
                      type="text"
                      placeholder="Enter ID Number"
                      value={formData.id_number}
                      onChange={(e) =>
                        handleInputChange("id_number", e.target.value)
                      }
                      required
                      className="mt-2 h-10"
                      data-testid="visitor-id-number"
                    />
                  </div>
                </div>

                {/* ID Proof Upload */}
                <div>
                  <Label className="text-sm font-medium">
                    Upload ID Proof *
                  </Label>
                  <div className="mt-2">
                    <input
                      ref={idProofInputRef}
                      type="file"
                      accept="image/*,.pdf"
                      onChange={handleIdProofUpload}
                      className="hidden"
                      data-testid="visitor-id-proof-input"
                    />
                    {!idProofBase64 ? (
                      <button
                        type="button"
                        onClick={() => idProofInputRef.current?.click()}
                        className="w-full p-4 border-2 border-dashed border-slate-300 rounded-lg hover:border-slate-500 transition-colors flex items-center justify-center gap-3"
                        data-testid="visitor-upload-id"
                      >
                        <Upload className="w-5 h-5 text-slate-600" />
                        <span className="text-slate-700 font-medium">
                          Click to upload ID Proof
                        </span>
                      </button>
                    ) : (
                      <div className="space-y-3">
                        {idProofPreview && (
                          <div className="relative">
                            <img
                              src={idProofPreview}
                              alt="ID Proof Preview"
                              className="w-full max-h-64 object-contain rounded-lg border border-slate-200"
                            />
                          </div>
                        )}
                        <button
                          type="button"
                          onClick={() => idProofInputRef.current?.click()}
                          className="w-full p-3 bg-slate-100 hover:bg-slate-200 border border-slate-300 rounded-lg text-slate-700 font-medium transition-colors"
                          data-testid="visitor-change-id"
                        >
                          Change ID Proof
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Visitor Type & Search Section */}
              <div className="space-y-4 p-4 sm:p-6 bg-blue-50 rounded-lg border border-blue-200">
                <h3 className="text-lg font-semibold text-slate-900">
                  👤 Who Are You Visiting?
                </h3>

                <div>
                  <Label htmlFor="visitor_type" className="text-sm font-medium">
                    Visitor Type *
                  </Label>
                  <select
                    id="visitor_type"
                    value={formData.visitor_type}
                    onChange={(e) => handleVisitorTypeChange(e.target.value)}
                    required
                    className="mt-2 w-full h-10 px-3 py-2 border border-slate-300 rounded-md shadow-sm focus:outline-none focus:ring-slate-900 focus:border-slate-900"
                    data-testid="visitor-type"
                  >
                    <option value="">-- Select Type --</option>
                    <option value="student">Student</option>
                    <option value="faculty">Faculty Member</option>
                    <option value="visitor">Visitor/General</option>
                    <option value="worker">Worker</option>
                  </select>
                </div>

                {/* Search Section for Student/Faculty */}
                {(formData.visitor_type === "faculty" ||
                  formData.visitor_type === "student") && (
                  <div className="space-y-3 mt-4">
                    <Label htmlFor="search" className="text-sm font-medium">
                      Search by Name, Mobile, or{" "}
                      {formData.visitor_type === "faculty"
                        ? "Faculty ID"
                        : "GRN"}{" "}
                      *
                    </Label>
                    <div className="relative">
                      <Input
                        id="search"
                        type="text"
                        placeholder={`Search ${formData.visitor_type}...`}
                        value={searchQuery}
                        onChange={handleSearch}
                        className="mt-2 h-10 pl-10"
                        data-testid="visitor-search-person"
                      />
                      <Search className="w-4 h-4 text-slate-400 absolute left-3 top-4" />
                    </div>

                    {selectedPerson && (
                      <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-lg flex items-center justify-between">
                        <div>
                          <p className="font-semibold text-emerald-900 text-base">
                            {selectedPerson.name}
                          </p>
                          <p className="text-emerald-700 font-medium mt-1">
                            📱 {maskPhoneNumber(selectedPerson.mobile_no)}
                          </p>
                          {selectedPerson.faculty_id && (
                            <p className="text-sm text-emerald-600 mt-1">
                              Faculty ID: {selectedPerson.faculty_id}
                            </p>
                          )}
                          {selectedPerson.reg_no && (
                            <p className="text-sm text-emerald-600 mt-1">
                              GRN: {selectedPerson.reg_no}
                            </p>
                          )}
                        </div>
                        <button
                          type="button"
                          onClick={handleClearSelected}
                          className="text-emerald-600 hover:text-emerald-900"
                        >
                          <X className="w-5 h-5" />
                        </button>
                      </div>
                    )}

                    {searchQuery &&
                      !selectedPerson &&
                      searchResults.length > 0 && (
                        <div className="border border-slate-300 rounded-lg bg-white shadow-lg max-h-96 overflow-y-auto">
                          {searchResults.map((result, index) => (
                            <button
                              key={index}
                              type="button"
                              onClick={() => handleSelectPerson(result)}
                              className="w-full p-4 hover:bg-blue-50 text-left border-b border-slate-100 last:border-b-0 transition-colors"
                              data-testid="visitor-search-result"
                            >
                              <div className="flex justify-between items-start gap-3">
                                <div className="flex-1">
                                  <p className="font-semibold text-slate-900 text-base">
                                    {result.name}
                                  </p>
                                  <p className="text-sm font-medium text-blue-600 mt-1">
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
                      <div className="text-center p-4 text-slate-600">
                        Searching...
                      </div>
                    )}

                    {searchQuery &&
                      !selectedPerson &&
                      !isSearching &&
                      searchResults.length === 0 && (
                        <div className="text-center p-4 text-slate-600">
                          No {formData.visitor_type}s found. Try another search.
                        </div>
                      )}
                  </div>
                )}
              </div>

              {/* Purpose of Visit Section */}
              <div className="space-y-4 p-5 sm:p-6 bg-gradient-to-br from-orange-50 to-orange-100/50 rounded-xl border-2 border-orange-200">
                <div className="flex items-center gap-2 mb-4">
                  <div className="w-8 h-8 bg-orange-600 rounded-lg flex items-center justify-center">
                    <span className="text-white font-bold text-sm">🎯</span>
                  </div>
                  <h3 className="text-lg font-bold text-orange-900">Purpose of Visit</h3>
                </div>

                <div>
                  <Label htmlFor="purpose" className="text-sm font-medium">
                    Purpose of Visit *
                  </Label>
                  <select
                    id="purpose"
                    value={formData.purpose}
                    onChange={(e) =>
                      handleInputChange("purpose", e.target.value)
                    }
                    required
                    className="mt-2 w-full h-10 px-3 py-2 border border-slate-300 rounded-md shadow-sm focus:outline-none focus:ring-slate-900 focus:border-slate-900"
                    data-testid="visitor-purpose"
                  >
                    <option value="">-- Select Purpose --</option>
                    <option value="Meeting">Meeting</option>
                    <option value="Interview">Interview</option>
                    <option value="Delivery">Delivery</option>
                    <option value="Event">Event</option>
                    <option value="Maintenance">Maintenance</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
              </div>

              {/* Photo Capture */}
              <div className="space-y-4 p-5 sm:p-6 bg-gradient-to-br from-indigo-50 to-indigo-100/50 rounded-xl border-2 border-indigo-200">
                <div className="flex items-center gap-2 mb-4">
                  <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center">
                    <span className="text-white font-bold text-sm">📸</span>
                  </div>
                  <Label htmlFor="photo" className="text-lg font-bold text-indigo-900">Photo (Selfie) *</Label>
                </div>
                <div className="mt-4">
                  {!photoBase64 ? (
                    <Button
                      type="button"
                      onClick={() => setStep("camera")}
                      variant="secondary"
                      className="w-full h-12 text-base"
                      data-testid="capture-photo-btn"
                    >
                      <Camera className="w-5 h-5 mr-2" />
                      Capture Photo
                    </Button>
                  ) : (
                    <div className="space-y-4">
                      <img
                        src={photoBase64}
                        alt="Captured"
                        className="w-full max-w-sm mx-auto rounded-lg"
                      />
                      <Button
                        type="button"
                        onClick={() => setStep("camera")}
                        variant="secondary"
                        className="w-full h-12 text-base"
                        data-testid="retake-photo-btn"
                      >
                        Retake Photo
                      </Button>
                    </div>
                  )}
                </div>
              </div>

              {/* Submit Button */}
              <Button
                type="submit"
                className="w-full bg-slate-900 hover:bg-slate-800 text-white h-12 text-base font-semibold rounded-lg transition-colors"
                disabled={loading}
                data-testid="submit-visitor"
              >
                {loading ? "Registering..." : "Register & Get QR Code"}
              </Button>
            </form>
          </div>
        )}

        {/* Camera Step */}
        {step === "camera" && (
          <div className="bg-white rounded-xl sm:rounded-2xl shadow-2xl p-6 sm:p-8">
            <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 mb-6 tracking-tight text-center">
              Take a Selfie
            </h2>
            <div className="relative mb-6 rounded-lg overflow-hidden bg-black">
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
                  <span className="text-9xl font-bold text-white">
                    {countdown}
                  </span>
                </div>
              )}
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                <div className="w-48 sm:w-64 h-48 sm:h-64 border-2 border-dashed border-white/50 rounded-full"></div>
              </div>
            </div>
            <div className="flex gap-4">
              <Button
                onClick={() => setStep("form")}
                variant="secondary"
                className="flex-1 h-12 text-base"
                data-testid="cancel-camera"
              >
                Cancel
              </Button>
              <Button
                onClick={capture}
                className="flex-1 bg-slate-900 hover:bg-slate-800 h-12 text-base"
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
            className="bg-white rounded-xl sm:rounded-2xl shadow-2xl p-6 sm:p-8 text-center"
            data-testid="registration-success"
          >
            <div className="w-16 sm:w-20 h-16 sm:h-20 bg-emerald-500 rounded-full flex items-center justify-center mx-auto mb-6">
              <ShieldCheck className="w-8 sm:w-10 h-8 sm:h-10 text-white" />
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 mb-2 sm:mb-4 tracking-tight">
              Registration Successful!
            </h2>
            <p className="text-slate-600 mb-8 text-base">
              Your gate pass has been generated and sent to your email.
            </p>

            {/* Visitor Info Card */}
            {formData.visitor_type !== "worker" && (
              <div className="mb-8 p-6 bg-blue-50 rounded-lg border border-blue-200">
                <p className="text-sm text-blue-600 uppercase tracking-wider font-semibold mb-3">
                  You are meeting with
                </p>
                <div className="space-y-2">
                  <p className="text-xl sm:text-2xl font-bold text-blue-900">
                    {formData.person_to_visit_name}
                  </p>
                  <p className="text-blue-700">
                    <strong>Type:</strong>{" "}
                    {formData.visitor_type.charAt(0).toUpperCase() +
                      formData.visitor_type.slice(1)}
                  </p>
                  {formData.person_to_visit_mobile && (
                    <p className="text-blue-700">
                      <strong>Contact:</strong>{" "}
                      {formData.person_to_visit_mobile}
                    </p>
                  )}
                </div>
              </div>
            )}

            <div
              className="bg-white p-4 sm:p-6 rounded-lg border border-slate-200 inline-block mb-6"
              data-testid="visitor-qr"
            >
              <QRCodeSVG value={registrationData.token} size={200} level="H" />
            </div>

            <div className="mb-6">
              <p className="text-xs sm:text-sm text-slate-500 uppercase tracking-wider mb-1">
                Valid Until
              </p>
              <p
                className="text-lg sm:text-xl font-semibold text-slate-900 font-mono"
                data-testid="visitor-valid-till"
              >
                {new Date(registrationData.valid_till).toLocaleDateString(
                  "en-US",
                  {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                    hour: "2-digit",
                    minute: "2-digit",
                  },
                )}
              </p>
            </div>

            <div className="p-4 bg-sky-50 rounded-lg border border-sky-200 mb-6">
              <p className="text-xs sm:text-sm text-sky-900 leading-relaxed">
                Please check your email for the QR code. You can also screenshot
                this page. This pass is valid for 24 hours only.
              </p>
            </div>

            <Button
              onClick={() => navigate("/")}
              className="bg-slate-900 hover:bg-slate-800 h-12 text-base font-semibold"
              data-testid="back-home"
            >
              Back to Home
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
