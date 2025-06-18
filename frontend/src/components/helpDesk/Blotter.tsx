import React, { useState } from "react";
import { Shield, AlertTriangle, User, CheckCircle, Phone, Loader, AlertCircle } from "lucide-react";
import { BlotterService } from "../../services/blotter.service";
import type { CreateBlotterData, IncidentType } from "../../services/blotter.types";

interface BlotterFormData {
  // Complainant Information
  complainantName: string;
  complainantAddress: string;
  complainantContact: string;
  complainantEmail: string;
  // Incident Details
  incidentType: IncidentType | "";
  incidentDate: string;
  incidentTime: string;
  incidentLocation: string;
  incidentDescription: string;

  // Respondent Information
  respondentName: string;
  respondentAddress: string;
  respondentContact: string;

  // Witnesses
  witnesses: string;
  evidence: string;
}

const BlotterPage: React.FC = () => {
  const [formData, setFormData] = useState<BlotterFormData>({
    complainantName: "",
    complainantAddress: "",
    complainantContact: "",
    complainantEmail: "",
    incidentType: "",
    incidentDate: "",
    incidentTime: "",
    incidentLocation: "",
    incidentDescription: "",
    respondentName: "",
    respondentAddress: "",
    respondentContact: "",
    witnesses: "",
    evidence: "",
  });

  const [submitted, setSubmitted] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>("");
  const [blotterNumber, setBlotterNumber] = useState<string>("");

  const blotterService = new BlotterService();
  const incidentTypes: IncidentType[] = [
    "Theft",
    "Physical Assault",
    "Verbal Assault",
    "Property Damage",
    "Disturbance",
    "Trespassing",
    "Fraud",
    "Harassment",
    "Domestic Dispute",
    "Noise Complaint",
    "Other",
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
  };
  const handleSubmit = async (): Promise<void> => {
    console.log("Submit button clicked, form data:", formData);

    // Validate required fields
    if (
      !formData.complainantName ||
      !formData.complainantAddress ||
      !formData.complainantContact ||
      !formData.incidentType ||
      !formData.incidentDate ||
      !formData.incidentTime ||
      !formData.incidentLocation ||
      !formData.incidentDescription
    ) {
      const missingFields = [];
      if (!formData.complainantName) missingFields.push("Complainant Name");
      if (!formData.complainantAddress) missingFields.push("Complainant Address");
      if (!formData.complainantContact) missingFields.push("Complainant Contact");
      if (!formData.incidentType) missingFields.push("Incident Type");
      if (!formData.incidentDate) missingFields.push("Incident Date");
      if (!formData.incidentTime) missingFields.push("Incident Time");
      if (!formData.incidentLocation) missingFields.push("Incident Location");
      if (!formData.incidentDescription) missingFields.push("Incident Description");
      
      const errorMsg = `Please fill in all required fields: ${missingFields.join(", ")}`;
      console.log("Validation error:", errorMsg);
      setError(errorMsg);
      return;
    }

    setLoading(true);
    setError("");
    console.log("Starting API call...");

    try {
      // Transform frontend form data to backend API format
      const blotterData: CreateBlotterData = {
        complainant_name: formData.complainantName,
        complainant_address: formData.complainantAddress,
        complainant_contact: formData.complainantContact,
        complainant_email: formData.complainantEmail || undefined,
        incident_type: formData.incidentType as IncidentType,
        incident_date: formData.incidentDate,
        incident_time: formData.incidentTime,
        incident_location: formData.incidentLocation,
        incident_description: formData.incidentDescription,
        respondent_name: formData.respondentName || undefined,
        respondent_address: formData.respondentAddress || undefined,
        respondent_contact: formData.respondentContact || undefined,
        witnesses: formData.witnesses || undefined,
        evidence: formData.evidence || undefined,
      };

      const response = await blotterService.createBlotterCase(blotterData);
      console.log("API response received:", response);
      
      setBlotterNumber(response.case_number);
      setSubmitted(true);
      console.log("Form submitted successfully with number:", response.case_number);
      
      // Reset form after 5 seconds
      setTimeout(() => {
        setSubmitted(false);
        setBlotterNumber("");
        setFormData({
          complainantName: "",
          complainantAddress: "",
          complainantContact: "",
          complainantEmail: "",
          incidentType: "",
          incidentDate: "",
          incidentTime: "",
          incidentLocation: "",
          incidentDescription: "",
          respondentName: "",
          respondentAddress: "",
          respondentContact: "",
          witnesses: "",
          evidence: "",
        });
      }, 5000);
    } catch (err) {
      console.error("Error submitting blotter report:", err);
      const errorMessage = err instanceof Error ? err.message : "An unexpected error occurred. Please try again.";
      console.log("Setting error message:", errorMessage);
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2 flex items-center">
          <Shield className="h-8 w-8 mr-3 text-red-600" />
          File Blotter Report
        </h1>
        <p className="text-gray-600">
          Process and document incidents reported by residents. All information
          will be recorded in the barangay blotter system.
        </p>
      </div>

      {/* Important Notice */}
      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
        <div className="flex items-start">
          <AlertTriangle className="h-5 w-5 text-yellow-600 mr-2 mt-0.5" />
          <div>
            <h3 className="font-semibold text-yellow-900">Important Notice</h3>
            <p className="text-sm text-yellow-800 mt-1">
              For emergency situations or crimes in progress, please call the
              emergency hotline immediately at 911. This online blotter is for
              non-emergency reports only.
            </p>
          </div>
        </div>
      </div>      {submitted ? (
        <div className="bg-green-50 border border-green-200 rounded-lg p-6 flex items-center space-x-3">
          <CheckCircle className="h-6 w-6 text-green-600" />
          <div>
            <h3 className="text-lg font-semibold text-green-900">
              Blotter Report Filed Successfully!
            </h3>
            <p className="text-green-700 mb-2">
              The report has been recorded in the system. Your blotter case number is:
            </p>
            <p className="text-xl font-bold text-green-800">
              {blotterNumber}
            </p>
            <p className="text-green-600 text-sm mt-2">
              Please keep this reference number for your records and future follow-ups.
            </p>
          </div>
        </div>      ) : (
        <>
          {/* Error Display */}
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6 flex items-center space-x-3">
              <AlertCircle className="h-5 w-5 text-red-600" />
              <div>
                <p className="font-medium">Error</p>
                <p className="text-sm">{error}</p>
              </div>
            </div>
          )}

        <div className="bg-white shadow-lg rounded-lg p-6">
          {/* Complainant Information */}
          <div className="mb-8">
            <h2 className="text-xl font-semibold text-gray-800 mb-4 flex items-center">
              <User className="h-5 w-5 mr-2" />
              Complainant Information
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label
                  htmlFor="first-name"
                  className="block text-sm font-medium text-gray-700 mb-2"
                >
                  Full Name *
                </label>
                <input
                  id="first-name"
                  type="text"
                  name="complainantName"
                  value={formData.complainantName}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                />
              </div>
              <div>
                <label
                  htmlFor="contact-number"
                  className="block text-sm font-medium text-gray-700 mb-2"
                >
                  Contact Number *
                </label>
                <input
                  id="contact-number"
                  type="tel"
                  name="complainantContact"
                  value={formData.complainantContact}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                />
              </div>
              <div>
                <label
                  htmlFor="complete-address"
                  className="block text-sm font-medium text-gray-700 mb-2"
                >
                  Complete Address *
                </label>
                <input
                  id="complete-address"
                  type="text"
                  name="complainantAddress"
                  value={formData.complainantAddress}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                />
              </div>
              <div>
                <label
                  htmlFor="email-address"
                  className="block text-sm font-medium text-gray-700 mb-2"
                >
                  Email Address
                </label>
                <input
                  id="email-address"
                  type="email"
                  name="complainantEmail"
                  value={formData.complainantEmail}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                />
              </div>
            </div>
          </div>

          {/* Incident Details */}
          <div className="mb-8">
            <h2 className="text-xl font-semibold text-gray-800 mb-4 flex items-center">
              <AlertTriangle className="h-5 w-5 mr-2" />
              Incident Details
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label
                  htmlFor="incidentType"
                  className="block text-sm font-medium text-gray-700 mb-2"
                >
                  Type of Incident *
                </label>
                <select
                  id="incidentType"
                  name="incidentType"
                  value={formData.incidentType}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                >
                  <option value="">Select incident type</option>
                  {incidentTypes.map((type) => (
                    <option key={type} value={type}>
                      {type}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label
                  htmlFor="incidentDate"
                  className="block text-sm font-medium text-gray-700 mb-2"
                >
                  Date of Incident *
                </label>
                <input
                  id="incidentDate"
                  type="date"
                  name="incidentDate"
                  value={formData.incidentDate}
                  onChange={handleChange}
                  max={new Date().toISOString().split("T")[0]}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                />
              </div>
              <div>
                <label
                  htmlFor="incidentTime"
                  className="block text-sm font-medium text-gray-700 mb-2"
                >
                  Time of Incident *
                </label>
                <input
                  id="incidentTime"
                  type="time"
                  name="incidentTime"
                  value={formData.incidentTime}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                />
              </div>
              <div>
                <label
                  htmlFor="incidentLocation"
                  className="block text-sm font-medium text-gray-700 mb-2"
                >
                  Location of Incident *
                </label>
                <input
                  id="incidentLocation"
                  type="text"
                  name="incidentLocation"
                  value={formData.incidentLocation}
                  onChange={handleChange}
                  placeholder="Street, Barangay, Municipality"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                />
              </div>
              <div className="md:col-span-2">
                <label
                  htmlFor="incidentDescription"
                  className="block text-sm font-medium text-gray-700 mb-2"
                >
                  Detailed Description of Incident *
                </label>
                <textarea
                  id="incidentDescription"
                  name="incidentDescription"
                  value={formData.incidentDescription}
                  onChange={handleChange}
                  rows={4}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                  placeholder="Please provide a detailed account of what happened..."
                />
              </div>
            </div>
          </div>

          {/* Respondent Information */}
          <div className="mb-8">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">
              Respondent Information
            </h2>
            <p className="text-sm text-gray-600 mb-4">
              If known, please provide information about the person(s) involved
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label
                  htmlFor="respondentName"
                  className="block text-sm font-medium text-gray-700 mb-2"
                >
                  Name
                </label>
                <input
                  id="respondentName"
                  type="text"
                  name="respondentName"
                  value={formData.respondentName}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                />
              </div>
              <div>
                <label
                  htmlFor="respondentContact"
                  className="block text-sm font-medium text-gray-700 mb-2"
                >
                  Contact Number
                </label>
                <input
                  id="respondentContact"
                  type="tel"
                  name="respondentContact"
                  value={formData.respondentContact}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                />
              </div>
              <div className="md:col-span-2">
                <label
                  htmlFor="respondentAddress"
                  className="block text-sm font-medium text-gray-700 mb-2"
                >
                  Address
                </label>
                <input
                  id="respondentAddress"
                  type="text"
                  name="respondentAddress"
                  value={formData.respondentAddress}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                />
              </div>
            </div>
          </div>

          {/* Additional Information */}
          <div className="mb-8">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">
              Additional Information
            </h2>
            <div className="space-y-4">
              <div>
                <label
                  htmlFor="witnesses"
                  className="block text-sm font-medium text-gray-700 mb-2"
                >
                  Witnesses (if any)
                </label>
                <textarea
                  id="witnesses"
                  name="witnesses"
                  value={formData.witnesses}
                  onChange={handleChange}
                  rows={3}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                  placeholder="Names and contact information of witnesses..."
                />
              </div>
              <div>
                <label
                  htmlFor="evidence"
                  className="block text-sm font-medium text-gray-700 mb-2"
                >
                  Evidence/Supporting Documents
                </label>
                <textarea
                  id="evidence"
                  name="evidence"
                  value={formData.evidence}
                  onChange={handleChange}
                  rows={3}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                  placeholder="Description of any evidence or documents you have..."
                />
              </div>
            </div>
          </div>

          <div className="flex flex-col gap-2 sm:flex-row sm:items-center justify-between">
            <p className="text-sm text-gray-500">* Required fields</p>            <button
              onClick={handleSubmit}
              disabled={loading}
              className="px-6 py-3 bg-red-600 text-white font-semibold rounded-lg hover:bg-red-700 transition-colors duration-200 flex justify-center items-center disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <>
                  <Loader className="h-5 w-5 mr-2 animate-spin" />
                  Submitting Report...
                </>
              ) : (
                <>
                  <Shield className="h-5 w-5 mr-2" />
                  Submit Blotter Report
                </>
              )}
            </button>
          </div>
        </div>
        </>
      )}

      {/* Emergency Contact Card */}
      <div className="mt-8 bg-red-50 rounded-lg p-6">
        <h3 className="font-semibold text-gray-900 mb-3 flex items-center">
          <Phone className="h-5 w-5 mr-2 text-red-600" />
          Emergency Contacts
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
          <div>
            <p className="font-medium text-gray-700">Police Emergency</p>
            <p className="text-gray-600">911 or (02) 8123-4567</p>
          </div>
          <div>
            <p className="font-medium text-gray-700">Barangay Hall</p>
            <p className="text-gray-600">(02) 8456-7890</p>
          </div>
          <div>
            <p className="font-medium text-gray-700">Fire Department</p>
            <p className="text-gray-600">(02) 8234-5678</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BlotterPage;
