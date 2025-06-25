import React, { useState, useEffect } from "react";
import { AlertCircle, User, CheckCircle, Info, Loader } from "lucide-react";
import { ComplaintsService } from "../../services/helpDesk/complaints/complaints.service";
import type { CreateComplaintData } from "../../services/helpDesk/complaints/complaints.types";
import Breadcrumb from "../_global/Breadcrumb";

interface ComplaintFormData {
  // Personal Information
  fullName: string;
  email: string;
  phone: string;
  address: string;

  // Complaint Details
  complaintCategory: string;
  department: string;
  subject: string;
  description: string;
  location: string;

  // Additional Information
  urgency: "low" | "medium" | "high" | "critical";
  anonymous: boolean;
  attachments: string;
}

interface FormErrors {
  fullName?: string;
  phone?: string;
  complaintCategory?: string;
  subject?: string;
  description?: string;
}

const ComplaintsPage: React.FC = () => {
  const [formData, setFormData] = useState<ComplaintFormData>({
    fullName: "",
    email: "",
    phone: "",
    address: "",
    complaintCategory: "",
    department: "",
    subject: "",
    description: "",
    location: "",
    urgency: "medium",
    anonymous: false,
    attachments: "",
  });

  const [submitted, setSubmitted] = useState<boolean>(false);
  // form-post submission loading ni adrian
  const [loading, setLoading] = useState<boolean>(false);
  // error na dapat lumabas pag unsuccessful yung submit pero valid naman yung fields (network error, etc.)
  const [error, setError] = useState<string>("");
  const [complaintNumber, setComplaintNumber] = useState<string>("");

  const complaintsService = new ComplaintsService();
  // field-related errors for inline display
  const [errors, setErrors] = useState<FormErrors>({});
  // loading ng breadcrumbs ni sean
  const [isLoaded, setIsLoaded] = useState(false);

  const complaintCategories: string[] = [
    "Public Services",
    "Infrastructure",
    "Health and Sanitation",
    "Education",
    "Social Welfare",
    "Environmental Concerns",
    "Public Safety",
    "Government Services",
    "Corruption/Misconduct",
    "Other",
  ];

  const departments: string[] = [
    "Mayor's Office",
    "Engineering Department",
    "Health Department",
    "Social Welfare",
    "Treasury",
    "Human Resources",
    "Environmental Management",
    "Public Safety",
    "Education",
    "General Services",
  ];

  // Animation trigger on component mount
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoaded(true);
    }, 100);
    return () => clearTimeout(timer);
  }, []);

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ): void => {
    const { name, value, type } = e.target;

    if (type === "checkbox") {
      const target = e.target as HTMLInputElement;
      setFormData({
        ...formData,
        [name]: target.checked,
      });
    } else {
      setFormData({
        ...formData,
        [name]: value,
      });
    }

    // Clear error when user starts typing
    if (errors[name as keyof FormErrors]) {
      setErrors({
        ...errors,
        [name]: undefined,
      });
    }
  };

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};

    // Validate personal information if not anonymous
    if (!formData.anonymous) {
      if (!formData.fullName.trim()) {
        newErrors.fullName = "Full name is required";
      }
      if (!formData.phone.trim()) {
        newErrors.phone = "Contact number is required";
      }
    }

    // Validate complaint details
    if (!formData.complaintCategory) {
      newErrors.complaintCategory = "Please select a complaint category";
    }
    if (!formData.subject.trim()) {
      newErrors.subject = "Subject/Title is required";
    }
    if (!formData.description.trim()) {
      newErrors.description = "Detailed description is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };  

  const handleSubmit = async (): Promise<void> => {
    if (!validateForm()) return;

    console.log("Submit button clicked, form data:", formData);
    
    // }

    setLoading(true);
    setError("");
    console.log("Starting API call...");

    try {
      // Transform frontend form data to backend API format
      const complaintData: CreateComplaintData = {
        subject: formData.subject,
        description: formData.description,
        complaint_category: formData.complaintCategory,
        department: formData.department || undefined,
        location: formData.location || undefined,
        urgency: formData.urgency,
        is_anonymous: formData.anonymous,
        attachments: formData.attachments || undefined,
      };

      // Add personal information only if not anonymous
      if (!formData.anonymous) {
        complaintData.full_name = formData.fullName;
        complaintData.email = formData.email || undefined;
        complaintData.phone = formData.phone;
        complaintData.address = formData.address || undefined;
      }      const response = await complaintsService.createComplaint(complaintData);
      console.log("API response received:", response);
      
      setComplaintNumber(response.complaint_number);
      setSubmitted(true);
      console.log("Form submitted successfully with number:", response.complaint_number);
      
      // Reset form after 5 seconds
      setTimeout(() => {
        setSubmitted(false);
        setComplaintNumber("");
        setFormData({
          fullName: "",
          email: "",
          phone: "",
          address: "",
          complaintCategory: "",
          department: "",
          subject: "",
          description: "",
          location: "",
          urgency: "medium",
          anonymous: false,
          attachments: "",
        });
      }, 5000);
        } catch (err) {
      console.error("Error submitting complaint:", err);
      
      // More detailed error handling
      if (err instanceof Error) {
        if (err.message.includes('Failed to fetch') || err.message.includes('NetworkError')) {
          setError("Unable to connect to the server. Please check your internet connection and try again.");
        } else if (err.message.includes('Authentication failed')) {
          setError("Your session has expired. Please log in again.");
        } else {
          setError(err.message || "Failed to submit complaint");
        }
      } else {
        setError("An unexpected error occurred. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  const getFieldClasses = (fieldName: keyof FormErrors, baseClasses: string): string => {
    return errors[fieldName] 
      ? `${baseClasses} border-red-500 focus:ring-red-500 focus:border-red-500`
      : `${baseClasses} border-gray-300 focus:ring-orange-500 focus:border-transparent`;
  };

  return (
    <div className="p-6 max-w-7xl mx-auto">
      {/* Breadcrumb */}
      <Breadcrumb isLoaded={isLoaded} />

      {/* Header */}
      <div className={`mb-8 transition-all duration-700 ease-out ${
        isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-4'
      }`}>
        <h1 className="text-3xl font-bold text-gray-900 mb-2 flex items-center">
          <AlertCircle className="h-8 w-8 mr-3 text-orange-600" />
          Process Complaint
        </h1>
        <p className="text-gray-600">
          Log and manage complaints received from residents regarding government
          services and facilities.
        </p>
      </div>

      {/* Information Banner */}
      <div className={`bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6 transition-all duration-700 ease-out ${
        isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
      }`} style={{ transitionDelay: '100ms' }}>
        <div className="flex items-start">
          <Info className="h-5 w-5 text-blue-600 mr-2 mt-0.5" />
          <div>
            <h3 className="font-semibold text-blue-900">
              Processing Guidelines
            </h3>
            <ul className="text-sm text-blue-800 mt-1 space-y-1">
              <li>• Verify complainant details before processing</li>
              <li>• Document all relevant information accurately</li>
              <li>• Assign to appropriate department for action</li>
              <li>• Update status regularly until resolution</li>
            </ul>
          </div>
        </div>
      </div>

      {submitted ? (
        <div className={`bg-green-50 border border-green-200 rounded-lg p-6 flex items-center space-x-3 transition-all duration-700 ease-out ${
          isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
        }`} style={{ transitionDelay: '200ms' }}>
          <CheckCircle className="h-6 w-6 text-green-600" />
          <div>
            <h3 className="text-lg font-semibold text-green-900">
              Complaint Logged Successfully!
            </h3>
            <p className="text-green-700">
              Your complaint has been recorded with reference number: <strong>{complaintNumber}</strong>
            </p>
            <p className="text-green-700 text-sm mt-1">
              The assigned department will process this complaint within 3-5 business days.
            </p>
          </div>
        </div>
      ) : (
        <>
          {error && (
            <div className="mb-6 bg-red-50 border border-red-200 rounded-lg p-6 flex items-center space-x-3">
              <AlertCircle className="h-6 w-6 text-red-600" />
              <div>
                <h3 className="text-lg font-semibold text-red-900">Error</h3>
                <p className="text-red-700">{error}</p>
              </div>
            </div>
          )}
          
          <div className={`@container/main-form bg-white shadow-lg rounded-lg p-6 transition-all duration-700 ease-out ${
          isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
        }`} style={{ transitionDelay: '200ms' }}>
          {/* Anonymous Option */}
          <div className="mb-6 bg-gray-50 rounded-lg p-4">
            <label
              htmlFor="anonymous"
              className="flex items-center cursor-pointer"
            >
              <input
                type="checkbox"
                name="anonymous"
                id="anonymous"
                checked={formData.anonymous}
                onChange={handleChange}
                className="h-4 w-4 text-orange-600 focus:ring-orange-500 border-gray-300 rounded"
              />
              <span className="ml-2 text-gray-700">
                Submit this complaint anonymously
              </span>
            </label>
            <p className="text-sm text-gray-500 mt-1 ml-6">
              Your identity will be kept confidential
            </p>
          </div>

          {/* Personal Information */}
          {!formData.anonymous && (
            <div className="mb-8">
              <h2 className="text-xl font-semibold text-gray-800 mb-4 flex items-center">
                <User className="h-5 w-5 mr-2" />
                Complainant Information
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label
                    htmlFor="fullName"
                    className="block text-sm font-medium text-gray-700 mb-2"
                  >
                    Full Name *
                  </label>
                  <input
                    type="text"
                    name="fullName"
                    id="fullName"
                    value={formData.fullName}
                    onChange={handleChange}
                    className={getFieldClasses('fullName', 'w-full px-4 py-2 border rounded-lg focus:ring-2')}
                  />
                  {errors.fullName && (
                    <p className="text-red-500 text-sm mt-1">{errors.fullName}</p>
                  )}
                </div>
                <div>
                  <label
                    htmlFor="phone"
                    className="block text-sm font-medium text-gray-700 mb-2"
                  >
                    Contact Number *
                  </label>
                  <input
                    type="tel"
                    name="phone"
                    id="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    className={getFieldClasses('phone', 'w-full px-4 py-2 border rounded-lg focus:ring-2')}
                  />
                  {errors.phone && (
                    <p className="text-red-500 text-sm mt-1">{errors.phone}</p>
                  )}
                </div>
                <div>
                  <label
                    htmlFor="email"
                    className="block text-sm font-medium text-gray-700 mb-2"
                  >
                    Email Address
                  </label>
                  <input
                    type="email"
                    name="email"
                    id="email"
                    value={formData.email}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label
                    htmlFor="address"
                    className="block text-sm font-medium text-gray-700 mb-2"
                  >
                    Address
                  </label>
                  <input
                    type="text"
                    name="address"
                    id="address"
                    value={formData.address}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                  />
                </div>
              </div>
            </div>
          )}

          {/* Complaint Details */}
          <div className="mb-8">
            <h2 className="text-xl font-semibold text-gray-800 mb-4 flex items-center">
              <AlertCircle className="h-5 w-5 mr-2" />
              Complaint Details
            </h2>
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label
                    htmlFor="complaintCategory"
                    className="block text-sm font-medium text-gray-700 mb-2"
                  >
                    Complaint Category *
                  </label>
                  <select
                    name="complaintCategory"
                    id="complaintCategory"
                    value={formData.complaintCategory}
                    onChange={handleChange}
                    className={getFieldClasses('complaintCategory', 'w-full px-4 py-2 border rounded-lg focus:ring-2')}
                  >
                    <option value="">Select a category</option>
                    {complaintCategories.map((category) => (
                      <option key={category} value={category}>
                        {category}
                      </option>
                    ))}
                  </select>
                  {errors.complaintCategory && (
                    <p className="text-red-500 text-sm mt-1">{errors.complaintCategory}</p>
                  )}
                </div>
                <div>
                  <label
                    htmlFor="department"
                    className="block text-sm font-medium text-gray-700 mb-2"
                  >
                    Department/Office
                  </label>
                  <select
                    name="department"
                    id="department"
                    value={formData.department}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                  >
                    <option value="">Select if applicable</option>
                    {departments.map((dept) => (
                      <option key={dept} value={dept}>
                        {dept}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label
                  htmlFor="subject"
                  className="block text-sm font-medium text-gray-700 mb-2"
                >
                  Subject/Title *
                </label>
                <input
                  type="text"
                  name="subject"
                  id="subject"
                  value={formData.subject}
                  onChange={handleChange}
                  placeholder="Brief description of your complaint"
                  className={getFieldClasses('subject', 'w-full px-4 py-2 border rounded-lg focus:ring-2')}
                />
                {errors.subject && (
                  <p className="text-red-500 text-sm mt-1">{errors.subject}</p>
                )}
              </div>

              <div>
                <label
                  htmlFor="description"
                  className="block text-sm font-medium text-gray-700 mb-2"
                >
                  Detailed Description *
                </label>
                <textarea
                  name="description"
                  id="description"
                  value={formData.description}
                  onChange={handleChange}
                  rows={6}
                  className={getFieldClasses('description', 'w-full px-4 py-2 border rounded-lg focus:ring-2')}
                  placeholder="Please provide a detailed description of your complaint. Include what happened, when it happened, who was involved, and any other relevant information..."
                />
                {errors.description && (
                  <p className="text-red-500 text-sm mt-1">{errors.description}</p>
                )}
              </div>

              <div>
                <label
                  htmlFor="location"
                  className="block text-sm font-medium text-gray-700 mb-2"
                >
                  Location (if applicable)
                </label>
                <input
                  type="text"
                  name="location"
                  id="location"
                  value={formData.location}
                  onChange={handleChange}
                  placeholder="Where did this issue occur?"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Urgency Level *
                </label>
                <div className="flex flex-col @sm/main-form:flex-row @sm/main-form:space-x-4">
                  <label htmlFor="urgency-low" className="flex items-center">
                    <input
                      type="radio"
                      name="urgency"
                      id="urgency-low"
                      value="low"
                      checked={formData.urgency === "low"}
                      onChange={handleChange}
                      className="h-4 w-4 text-orange-600 focus:ring-orange-500"
                    />
                    <span className="ml-2 text-gray-700">Low</span>
                  </label>
                  <label htmlFor="urgency-medium" className="flex items-center">
                    <input
                      type="radio"
                      name="urgency"
                      id="urgency-medium"
                      value="medium"
                      checked={formData.urgency === "medium"}
                      onChange={handleChange}
                      className="h-4 w-4 text-orange-600 focus:ring-orange-500"
                    />
                    <span className="ml-2 text-gray-700">Medium</span>
                  </label>
                  <label htmlFor="urgency-high" className="flex items-center">
                    <input
                      type="radio"
                      name="urgency"
                      id="urgency-high"
                      value="high"
                      checked={formData.urgency === "high"}
                      onChange={handleChange}
                      className="h-4 w-4 text-orange-600 focus:ring-orange-500"
                    />
                    <span className="ml-2 text-gray-700">High</span>
                  </label>
                  <label
                    htmlFor="urgency-critical"
                    className="flex items-center"
                  >
                    <input
                      type="radio"
                      name="urgency"
                      id="urgency-critical"
                      value="critical"
                      checked={formData.urgency === "critical"}
                      onChange={handleChange}
                      className="h-4 w-4 text-orange-600 focus:ring-orange-500"
                    />
                    <span className="ml-2 text-gray-700">Critical</span>
                  </label>
                </div>
              </div>

              <div>
                <label
                  htmlFor="attachments"
                  className="block text-sm font-medium text-gray-700 mb-2"
                >
                  Supporting Documents/Evidence
                </label>
                <textarea
                  name="attachments"
                  id="attachments"
                  value={formData.attachments}
                  onChange={handleChange}
                  rows={2}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                  placeholder="Describe any photos, documents, or evidence you have. You may be asked to provide these later."
                />
              </div>
            </div>
          </div>

          <div className="flex flex-col gap-2 sm:flex-row sm:items-center justify-between">
            <p className="text-sm text-gray-500">* Required fields</p>            <button
              onClick={handleSubmit}
              disabled={loading}
              className="px-6 py-3 bg-orange-600 text-white font-semibold rounded-lg hover:bg-orange-700 transition-colors duration-200 flex justify-center items-center disabled:opacity-50"
            >
              {loading ? (
                <Loader className="h-5 w-5 mr-2 animate-spin" />
              ) : (
                <AlertCircle className="h-5 w-5 mr-2" />
              )}
              {loading ? "Submitting..." : "Submit Complaint"}
            </button>
          </div>
        </div>
        </>
      )}

      {/* Process Timeline */}
      <div className={`mt-8 bg-gray-50 rounded-lg p-6 transition-all duration-700 ease-out ${
        isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
      }`} style={{ transitionDelay: '300ms' }}>
        <h3 className="font-semibold text-gray-900 mb-4">
          Complaint Process Timeline
        </h3>
        <div className="space-y-3">
          <div className="flex items-start">
            <div className="bg-orange-600 text-white rounded-full min-w-8 min-h-8 flex items-center justify-center text-sm font-semibold mr-3">
              1
            </div>
            <div>
              <p className="font-medium text-gray-800">Submission</p>
              <p className="text-sm text-gray-600">
                Your complaint is received and logged in our system
              </p>
            </div>
          </div>
          <div className="flex items-start">
            <div className="bg-orange-600 text-white rounded-full min-w-8 min-h-8 flex items-center justify-center text-sm font-semibold mr-3">
              2
            </div>
            <div>
              <p className="font-medium text-gray-800">Review (1-2 days)</p>
              <p className="text-sm text-gray-600">
                Complaint is reviewed and assigned to the appropriate department
              </p>
            </div>
          </div>
          <div className="flex items-start">
            <div className="bg-orange-600 text-white rounded-full min-w-8 min-h-8 flex items-center justify-center text-sm font-semibold mr-3">
              3
            </div>
            <div>
              <p className="font-medium text-gray-800">
                Investigation (3-5 days)
              </p>
              <p className="text-sm text-gray-600">
                Department investigates the complaint and gathers information
              </p>
            </div>
          </div>
          <div className="flex items-start">
            <div className="bg-orange-600 text-white rounded-full min-w-8 min-h-8 flex items-center justify-center text-sm font-semibold mr-3">
              4
            </div>
            <div>
              <p className="font-medium text-gray-800">Resolution</p>
              <p className="text-sm text-gray-600">
                Action is taken and you are notified of the outcome
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ComplaintsPage;