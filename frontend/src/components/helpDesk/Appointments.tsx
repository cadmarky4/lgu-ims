import React, { useState } from "react";
import { Calendar, Clock, User, Phone, Mail, CheckCircle, Loader, AlertCircle } from "lucide-react";
import { AppointmentsService } from "../../services/appointments.service";
import type { CreateAppointmentData } from "../../services/appointment.types";

interface AppointmentFormData {
  fullName: string;
  email: string;
  phone: string;
  department: string;
  purpose: string;
  preferredDate: string;
  preferredTime: string;
  alternativeDate: string;
  alternativeTime: string;
  additionalNotes: string;
}

const AppointmentsPage: React.FC = () => {
  const [formData, setFormData] = useState<AppointmentFormData>({
    fullName: "",
    email: "",
    phone: "",
    department: "",
    purpose: "",
    preferredDate: "",
    preferredTime: "",
    alternativeDate: "",
    alternativeTime: "",
    additionalNotes: "",
  });

  const [submitted, setSubmitted] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>("");
  const [appointmentNumber, setAppointmentNumber] = useState<string>("");

  const appointmentsService = new AppointmentsService();

  // Test function to simulate an error - remove this after testing
  const testError = () => {
    console.log("Testing error display...");
    setError("This is a test error to verify error handling is working correctly.");
  };

  const departments: string[] = [
    "Mayor's Office",
    "Business Permits and Licensing",
    "Civil Registry",
    "Treasury Office",
    "Engineering Office",
    "Health Office",
    "Social Welfare",
    "Human Resources",
    "Legal Office",
    "Other",
  ];

  const timeSlots: string[] = [
    "8:00 AM",
    "8:30 AM",
    "9:00 AM",
    "9:30 AM",
    "10:00 AM",
    "10:30 AM",
    "11:00 AM",
    "11:30 AM",
    "1:00 PM",
    "1:30 PM",
    "2:00 PM",
    "2:30 PM",
    "3:00 PM",
    "3:30 PM",
    "4:00 PM",
    "4:30 PM",
  ];

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ): void => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  }; const handleSubmit = async (): Promise<void> => {
    console.log("Submit button clicked, form data:", formData);

    // Validate required fields
    if (
      !formData.fullName ||
      !formData.email ||
      !formData.phone ||
      !formData.department ||
      !formData.purpose ||
      !formData.preferredDate ||
      !formData.preferredTime
    ) {
      const missingFields = [];
      if (!formData.fullName) missingFields.push("Full Name");
      if (!formData.email) missingFields.push("Email");
      if (!formData.phone) missingFields.push("Phone");
      if (!formData.department) missingFields.push("Department");
      if (!formData.purpose) missingFields.push("Purpose");
      if (!formData.preferredDate) missingFields.push("Preferred Date");
      if (!formData.preferredTime) missingFields.push("Preferred Time");

      const errorMsg = `Please fill in all required fields: ${missingFields.join(", ")}`;
      console.log("Validation error:", errorMsg);
      setError(errorMsg);
      return;
    }

    setLoading(true);
    setError("");
    console.log("Starting API call...");

    try {      // Transform frontend form data to backend API format
      const appointmentData: CreateAppointmentData = {
        full_name: formData.fullName,
        email: formData.email,
        phone: formData.phone,
        department: formData.department,
        purpose: formData.purpose,
        preferred_date: formData.preferredDate,
        preferred_time: formData.preferredTime,
        alternative_date: formData.alternativeDate || undefined,
        alternative_time: formData.alternativeTime || undefined,
        additional_notes: formData.additionalNotes || undefined,
      };
      const response = await appointmentsService.createAppointment(appointmentData);
      console.log("API response received:", response);

      setAppointmentNumber(response.appointment_number);
      setSubmitted(true);
      console.log("Form submitted successfully with number:", response.appointment_number);

      // Reset form after 5 seconds
      setTimeout(() => {
        setSubmitted(false);
        setAppointmentNumber("");
        setFormData({
          fullName: "",
          email: "",
          phone: "",
          department: "",
          purpose: "",
          preferredDate: "",
          preferredTime: "",
          alternativeDate: "",
          alternativeTime: "",
          additionalNotes: "",
        });
      }, 5000);
    } catch (err) {
      console.error("Error submitting appointment:", err);

      // More detailed error handling
      if (err instanceof Error) {
        if (err.message.includes('Failed to fetch') || err.message.includes('NetworkError')) {
          setError("Unable to connect to the server. Please check your internet connection and try again.");
        } else if (err.message.includes('Authentication failed')) {
          setError("Your session has expired. Please log in again.");
        } else {
          setError(err.message || "Failed to submit appointment request");
        }
      } else {
        setError("An unexpected error occurred. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="@container/main p-6 max-w-7xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Process Appointment Request
        </h1>        <p className="text-gray-600">
          Schedule and manage resident appointments with various LGU
          departments.
        </p>
      </div>

      {submitted ? (
        <div className="bg-green-50 border border-green-200 rounded-lg p-6 flex items-center space-x-3">
          <CheckCircle className="h-6 w-6 text-green-600" />
          <div>
            <h3 className="text-lg font-semibold text-green-900">
              Appointment Successfully Processed!
            </h3>
            <p className="text-green-700">
              Your appointment request has been submitted with appointment number: <strong>{appointmentNumber}</strong>
            </p>
            <p className="text-green-700 text-sm mt-1">
              A confirmation will be sent to your email address.
            </p>
          </div>
        </div>
      ) : (
        <>          {error && (
          <div className="mb-6 bg-red-50 border border-red-200 rounded-lg p-6 flex items-center space-x-3">
            <AlertCircle className="h-6 w-6 text-red-600" />
            <div className="flex-1">
              <h3 className="text-lg font-semibold text-red-900">Error</h3>
              <p className="text-red-700">{error}</p>
              <button
                onClick={() => setError("")}
                className="mt-2 text-sm text-red-600 hover:text-red-800 underline"
              >
                Dismiss
              </button>
            </div>
          </div>
        )}

          <div className="@container/main-form bg-white shadow-lg rounded-lg p-6">
            {/* Personal Information */}
            <div className="col-span-2">
              <h2 className="text-xl font-semibold text-gray-800 mb-4 flex items-center">
                <User className="h-5 w-5 mr-2" />
                Resident Information
              </h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label
                  htmlFor="fullName"
                  className="block text-sm font-medium text-gray-700 mb-2"
                >
                  Full Name *
                </label>
                <input
                  id="fullName"
                  type="text"
                  name="fullName"
                  value={formData.fullName}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              <div>
                <label
                  htmlFor="email"
                  className="block text-sm font-medium text-gray-700 mb-2"
                >
                  Email Address *
                </label>
                <input
                  id="email"
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              <div>
                <label
                  htmlFor="phone"
                  className="block text-sm font-medium text-gray-700 mb-2"
                >
                  Contact Number *
                </label>
                <input
                  id="phone"
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              <div>
                <label
                  htmlFor="department"
                  className="block text-sm font-medium text-gray-700 mb-2"
                >
                  Department *
                </label>
                <select
                  id="department"
                  name="department"
                  value={formData.department}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="">Select a department</option>
                  {departments.map((dept) => (
                    <option key={dept} value={dept}>
                      {dept}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Appointment Details */}
            <div className="col-span-2 mt-6">
              <h2 className="text-xl font-semibold text-gray-800 mb-4 flex items-center">
                <Calendar className="h-5 w-5 mr-2" />
                Appointment Details
              </h2>
            </div>

            <div className="mb-6">
              <label
                htmlFor="purpose"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Purpose of Appointment *
              </label>
              <textarea
                id="purpose"
                name="purpose"
                value={formData.purpose}
                onChange={handleChange}
                rows={3}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Please describe the purpose of your appointment..."
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label
                  htmlFor="preferredDate"
                  className="block text-sm font-medium text-gray-700 mb-2"
                >
                  Preferred Date *
                </label>
                <input
                  id="preferredDate"
                  type="date"
                  name="preferredDate"
                  value={formData.preferredDate}
                  onChange={handleChange}
                  min={new Date().toISOString().split("T")[0]}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              <div>
                <label
                  htmlFor="preferredTime"
                  className="block text-sm font-medium text-gray-700 mb-2"
                >
                  Preferred Time *
                </label>
                <select
                  id="preferredTime"
                  name="preferredTime"
                  value={formData.preferredTime}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="">Select a time</option>
                  {timeSlots.map((time) => (
                    <option key={time} value={time}>
                      {time}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label
                  htmlFor="alternativeDate"
                  className="block text-sm font-medium text-gray-700 mb-2"
                >
                  Alternative Date
                </label>
                <input
                  id="alternativeDate"
                  type="date"
                  name="alternativeDate"
                  value={formData.alternativeDate}
                  onChange={handleChange}
                  min={new Date().toISOString().split("T")[0]}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              <div>
                <label
                  htmlFor="alternativeTime"
                  className="block text-sm font-medium text-gray-700 mb-2"
                >
                  Alternative Time
                </label>
                <select
                  id="alternativeTime"
                  name="alternativeTime"
                  value={formData.alternativeTime}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="">Select a time</option>
                  {timeSlots.map((time) => (
                    <option key={time} value={time}>
                      {time}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="mt-6 col-span-2">
              <label
                htmlFor="additionalNotes"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Additional Notes
              </label>
              <textarea
                id="additionalNotes"
                name="additionalNotes"
                value={formData.additionalNotes}
                onChange={handleChange}
                rows={3}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Any additional information or special requirements..."
              />
            </div>

            <div className="flex-col @lg/main-form:flex-row mt-6 flex gap-2 @lg/main-form:items-center justify-between">
              <p className="text-sm text-gray-500">* Required fields</p>            <button
                onClick={handleSubmit}
                disabled={loading}
                className="@lg/main-form:px-6 px-3 py-3 bg-blue-600 justify-center text-white font-semibold rounded-lg hover:bg-blue-700 transition-colors duration-200 flex items-center disabled:opacity-50"
              >
                {loading ? (
                  <Loader className="h-5 w-5 mr-2 animate-spin" />
                ) : (
                  <Calendar className="h-5 w-5 mr-2" />
                )}
                {loading ? "Submitting..." : "Submit Appointment Request"}
              </button>
            </div>
          </div>
        </>
      )}

      {/* Information Cards */}
      <div className="mt-8 grid grid-cols-1 @lg/main:grid-cols-2 @4xl/main:grid-cols-3 gap-6">
        <div className="bg-blue-50 rounded-lg p-6">
          <Clock className="h-8 w-8 text-blue-600 mb-3" />
          <h3 className="font-semibold text-gray-900 mb-2">Office Hours</h3>
          <p className="text-sm text-gray-600">
            Monday to Friday: 8:00 AM - 5:00 PM
          </p>
          <p className="text-sm text-gray-600">
            Lunch Break: 12:00 PM - 1:00 PM
          </p>
        </div>

        <div className="bg-green-50 rounded-lg p-6">
          <Mail className="h-8 w-8 text-green-600 mb-3" />
          <h3 className="font-semibold text-gray-900 mb-2">Confirmation</h3>
          <p className="text-sm text-gray-600">
            You'll receive an email confirmation within 24 hours
          </p>
        </div>

        <div className="bg-purple-50 rounded-lg p-6">
          <Phone className="h-8 w-8 text-purple-600 mb-3" />
          <h3 className="font-semibold text-gray-900 mb-2">Need Help?</h3>
          <p className="text-sm text-gray-600">Call us at: (02) 8123-4567</p>
          <p className="text-sm text-gray-600">
            Email: appointments@lgu.gov.ph
          </p>
        </div>
      </div>
    </div>
  );
};

export default AppointmentsPage;
