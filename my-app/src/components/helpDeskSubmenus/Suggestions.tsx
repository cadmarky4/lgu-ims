import React, { useState } from "react";
import {
  Lightbulb,
  User,
  Target,
  ThumbsUp,
  Send,
  Star,
  TrendingUp,
  Award,
} from "lucide-react";

interface SuggestionFormData {
  // Personal Information
  name: string;
  email: string;
  phone: string;
  isResident: "yes" | "no";

  // Suggestion Details
  category: string;
  title: string;
  description: string;
  benefits: string;
  implementation: string;
  resources: string;

  // Additional
  priority: "low" | "medium" | "high";
  allowContact: boolean;
}

interface RecentSuggestion {
  id: number;
  title: string;
  category: string;
  likes: number;
}

const SuggestionsPage: React.FC = () => {
  const [formData, setFormData] = useState<SuggestionFormData>({
    name: "",
    email: "",
    phone: "",
    isResident: "yes",
    category: "",
    title: "",
    description: "",
    benefits: "",
    implementation: "",
    resources: "",
    priority: "medium",
    allowContact: true,
  });

  const [submitted, setSubmitted] = useState<boolean>(false);

  const suggestionCategories: string[] = [
    "Community Development",
    "Infrastructure Improvement",
    "Environmental Protection",
    "Public Safety",
    "Health Services",
    "Education",
    "Tourism and Culture",
    "Economic Development",
    "Digital Services",
    "Transportation",
    "Social Welfare",
    "Youth and Sports",
    "Senior Citizens Affairs",
    "Other",
  ];

  const recentSuggestions: RecentSuggestion[] = [
    {
      id: 1,
      title: "Community Garden Project",
      category: "Environmental Protection",
      likes: 45,
    },
    {
      id: 2,
      title: "Mobile App for LGU Services",
      category: "Digital Services",
      likes: 78,
    },
    {
      id: 3,
      title: "Weekend Night Market",
      category: "Economic Development",
      likes: 62,
    },
    {
      id: 4,
      title: "Bike Lanes on Main Roads",
      category: "Transportation",
      likes: 93,
    },
  ];

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
  };

  const handleSubmit = (): void => {
    // Validate required fields
    if (
      !formData.name ||
      !formData.category ||
      !formData.title ||
      !formData.description
    ) {
      alert("Please fill in all required fields");
      return;
    }

    console.log("Suggestion submitted:", formData);
    setSubmitted(true);
    setTimeout(() => {
      setSubmitted(false);
      setFormData({
        name: "",
        email: "",
        phone: "",
        isResident: "yes",
        category: "",
        title: "",
        description: "",
        benefits: "",
        implementation: "",
        resources: "",
        priority: "medium",
        allowContact: true,
      });
    }, 3000);
  };

  const generateReferenceId = (): string => {
    return Math.random().toString(36).substr(2, 9).toUpperCase();
  };

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2 flex items-center">
          <Lightbulb className="h-8 w-8 mr-3 text-yellow-500" />
          Process Resident Suggestions
        </h1>
        <p className="text-gray-600">
          Review and manage suggestions submitted by residents for improving LGU
          services and community programs.
        </p>
      </div>

      {/* Motivational Banner */}
      <div className="bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-lg p-6 mb-6">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-xl font-bold mb-2">Community Impact</h3>
            <p className="text-purple-100">
              Track and process valuable suggestions from residents to improve
              our services.
            </p>
          </div>
          <Award className="h-16 w-16 text-yellow-300" />
        </div>
      </div>

      {/* Popular Suggestions */}
      <div className="mb-8">
        <h2 className="text-xl font-semibold text-gray-800 mb-4 flex items-center">
          <TrendingUp className="h-5 w-5 mr-2" />
          Popular Recent Suggestions
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {recentSuggestions.map((suggestion) => (
            <div
              key={suggestion.id}
              className="bg-white border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow"
            >
              <p className="font-semibold text-gray-800 text-sm mb-1">
                {suggestion.title}
              </p>
              <p className="text-xs text-gray-500 mb-2">
                {suggestion.category}
              </p>
              <div className="flex items-center text-sm text-gray-600">
                <ThumbsUp className="h-4 w-4 mr-1" />
                <span>{suggestion.likes} likes</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {submitted ? (
        <div className="bg-green-50 border border-green-200 rounded-lg p-6 flex items-center space-x-3">
          <Star className="h-6 w-6 text-green-600" />
          <div>
            <h3 className="text-lg font-semibold text-green-900">
              Suggestion Recorded Successfully!
            </h3>
            <p className="text-green-700">
              The suggestion has been logged for review. The planning committee
              will evaluate this proposal.
            </p>
            <p className="text-green-700 text-sm mt-1">
              Reference ID: #{generateReferenceId()}
            </p>
          </div>
        </div>
      ) : (
        <div className="bg-white shadow-lg rounded-lg p-6">
          {/* Personal Information */}
          <div className="mb-8">
            <h2 className="text-xl font-semibold text-gray-800 mb-4 flex items-center">
              <User className="h-5 w-5 mr-2" />
              Submitter Information
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label
                  htmlFor="name"
                  className="block text-sm font-medium text-gray-700 mb-2"
                >
                  Name *
                </label>
                <input
                  type="text"
                  name="name"
                  id="name"
                  value={formData.name}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
                />
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
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
                />
              </div>
              <div>
                <label
                  htmlFor="phone"
                  className="block text-sm font-medium text-gray-700 mb-2"
                >
                  Contact Number
                </label>
                <input
                  type="tel"
                  name="phone"
                  id="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
                />
              </div>
              <div>
                <label
                  htmlFor="isResident"
                  className="block text-sm font-medium text-gray-700 mb-2"
                >
                  Are you a resident?
                </label>
                <select
                  name="isResident"
                  id="isResident"
                  value={formData.isResident}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
                >
                  <option value="yes">Yes, I'm a resident</option>
                  <option value="no">No, I'm a visitor/non-resident</option>
                </select>
              </div>
            </div>
          </div>

          {/* Suggestion Details */}
          <div className="mb-8">
            <h2 className="text-xl font-semibold text-gray-800 mb-4 flex items-center">
              <Lightbulb className="h-5 w-5 mr-2" />
              Suggestion Details
            </h2>
            <div className="space-y-4">
              <div>
                <label
                  htmlFor="category"
                  className="block text-sm font-medium text-gray-700 mb-2"
                >
                  Category *
                </label>
                <select
                  name="category"
                  id="category"
                  value={formData.category}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
                >
                  <option value="">Select a category</option>
                  {suggestionCategories.map((category) => (
                    <option key={category} value={category}>
                      {category}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label
                  htmlFor="title"
                  className="block text-sm font-medium text-gray-700 mb-2"
                >
                  Suggestion Title *
                </label>
                <input
                  type="text"
                  name="title"
                  id="title"
                  value={formData.title}
                  onChange={handleChange}
                  placeholder="Give your suggestion a clear, descriptive title"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
                />
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
                  rows={5}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
                  placeholder="Describe your suggestion in detail. What problem does it solve? How will it work?"
                />
              </div>

              <div>
                <label
                  htmlFor="benefits"
                  className="block text-sm font-medium text-gray-700 mb-2"
                >
                  Expected Benefits
                </label>
                <textarea
                  name="benefits"
                  id="benefits"
                  value={formData.benefits}
                  onChange={handleChange}
                  rows={3}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
                  placeholder="What positive impacts will this suggestion have on the community?"
                />
              </div>

              <div>
                <label
                  htmlFor="implementation"
                  className="block text-sm font-medium text-gray-700 mb-2"
                >
                  Implementation Ideas
                </label>
                <textarea
                  name="implementation"
                  id="implementation"
                  value={formData.implementation}
                  onChange={handleChange}
                  rows={3}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
                  placeholder="Do you have ideas on how this could be implemented?"
                />
              </div>

              <div>
                <label
                  htmlFor="resources"
                  className="block text-sm font-medium text-gray-700 mb-2"
                >
                  Resources Needed
                </label>
                <input
                  type="text"
                  name="resources"
                  id="resources"
                  value={formData.resources}
                  onChange={handleChange}
                  placeholder="What resources (budget, manpower, equipment) might be needed?"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Priority Level
                </label>
                <div className="flex space-x-4">
                  <label htmlFor="priority-low" className="flex items-center">
                    <input
                      type="radio"
                      name="priority"
                      id="priority-low"
                      value="low"
                      checked={formData.priority === "low"}
                      onChange={handleChange}
                      className="h-4 w-4 text-yellow-600 focus:ring-yellow-500"
                    />
                    <span className="ml-2 text-gray-700">Low</span>
                  </label>
                  <label
                    htmlFor="priority-medium"
                    className="flex items-center"
                  >
                    <input
                      type="radio"
                      name="priority"
                      id="priority-medium"
                      value="medium"
                      checked={formData.priority === "medium"}
                      onChange={handleChange}
                      className="h-4 w-4 text-yellow-600 focus:ring-yellow-500"
                    />
                    <span className="ml-2 text-gray-700">Medium</span>
                  </label>
                  <label htmlFor="priority-high" className="flex items-center">
                    <input
                      type="radio"
                      name="priority"
                      id="priority-high"
                      value="high"
                      checked={formData.priority === "high"}
                      onChange={handleChange}
                      className="h-4 w-4 text-yellow-600 focus:ring-yellow-500"
                    />
                    <span className="ml-2 text-gray-700">High</span>
                  </label>
                </div>
              </div>

              <div className="bg-gray-50 rounded-lg p-4">
                <label
                  htmlFor="allowContact"
                  className="flex items-center cursor-pointer"
                >
                  <input
                    type="checkbox"
                    name="allowContact"
                    id="allowContact"
                    checked={formData.allowContact}
                    onChange={handleChange}
                    className="h-4 w-4 text-yellow-600 focus:ring-yellow-500 border-gray-300 rounded"
                  />
                  <span className="ml-2 text-gray-700">
                    I'm willing to be contacted for further discussion about
                    this suggestion
                  </span>
                </label>
              </div>
            </div>
          </div>

          <div className="flex items-center justify-between">
            <p className="text-sm text-gray-500">* Required fields</p>
            <button
              onClick={handleSubmit}
              className="px-6 py-3 bg-yellow-500 text-white font-semibold rounded-lg hover:bg-yellow-600 transition-colors duration-200 flex items-center"
            >
              <Send className="h-5 w-5 mr-2" />
              Submit Suggestion
            </button>
          </div>
        </div>
      )}

      {/* Tips Section */}
      <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-blue-50 rounded-lg p-6">
          <Target className="h-8 w-8 text-blue-600 mb-3" />
          <h3 className="font-semibold text-gray-900 mb-2">Be Specific</h3>
          <p className="text-sm text-gray-600">
            Clear, detailed suggestions are more likely to be implemented
          </p>
        </div>

        <div className="bg-green-50 rounded-lg p-6">
          <ThumbsUp className="h-8 w-8 text-green-600 mb-3" />
          <h3 className="font-semibold text-gray-900 mb-2">Think Practical</h3>
          <p className="text-sm text-gray-600">
            Consider feasibility and available resources
          </p>
        </div>

        <div className="bg-purple-50 rounded-lg p-6">
          <Star className="h-8 w-8 text-purple-600 mb-3" />
          <h3 className="font-semibold text-gray-900 mb-2">Focus on Impact</h3>
          <p className="text-sm text-gray-600">
            Highlight how your idea benefits the community
          </p>
        </div>
      </div>
    </div>
  );
};

export default SuggestionsPage;
