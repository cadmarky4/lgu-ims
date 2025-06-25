import React, { useState, useEffect } from 'react';
import { FiSettings, FiShield, FiServer, FiLoader } from 'react-icons/fi';
import { SettingsService, type SettingsData } from '../../services/settings/settings.service';

const SettingsPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState('general');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [errors, setErrors] = useState<Record<string, string[]>>({});
  const [successMessage, setSuccessMessage] = useState('');
  const [settingsService] = useState(new SettingsService());

  const [formData, setFormData] = useState<SettingsData>({
    // General Information
    barangay: '',
    city: '',
    province: '',
    region: '',
    type: '',
    contactNumber: '',
    emailAddress: '',
    openingHours: '',
    closingHours: '',
    primaryLanguage: '',
    secondaryLanguage: '',
    
    // Privacy and Security
    sessionTimeout: '30',
    maxLoginAttempts: '3',
    dataRetention: '7',
    backupFrequency: 'Daily',
    
    // System
    systemName: '',
    versionNumber: ''
  });
  const [originalData, setOriginalData] = useState<SettingsData | null>(null);

  // Fetch settings from API
  const fetchSettings = async () => {
    try {
      setLoading(true);
      const result = await settingsService.getSettings();
      
      if (result.data) {
        setFormData(result.data);
        setOriginalData(result.data);
      } else {
        console.error('Failed to fetch settings:', result.message);
      }
    } catch (error) {
      console.error('Error fetching settings:', error);
      // You might want to show a toast notification here
    } finally {
      setLoading(false);
    }
  };
  // Save settings to API
  const saveSettings = async () => {
    try {
      setSaving(true);
      setErrors({});
      setSuccessMessage('');

      const result = await settingsService.updateSettings(formData);

      if (result.data) {
        setSuccessMessage('Settings saved successfully!');
        setOriginalData(formData);
        
        // Clear success message after 3 seconds
        setTimeout(() => setSuccessMessage(''), 3000);
      } else {
        if (result.errors) {
          setErrors(result.errors);
        } else {
          console.error('Failed to save settings:', result.message);
        }
      }
    } catch (error) {
      console.error('Error saving settings:', error);
      // You might want to show a toast notification here
    } finally {
      setSaving(false);
    }
  };

  // Reset settings to default values
  const resetSettings = async () => {
    try {
      setSaving(true);
      setErrors({});
      setSuccessMessage('');

      const result = await settingsService.resetSettings();

      if (result.data) {
        setFormData(result.data);
        setOriginalData(result.data);
        setSuccessMessage('Settings reset to default values successfully!');
        
        // Clear success message after 3 seconds
        setTimeout(() => setSuccessMessage(''), 3000);
      } else {
        console.error('Failed to reset settings:', result.message);
      }
    } catch (error) {
      console.error('Error resetting settings:', error);
      // You might want to show a toast notification here
    } finally {
      setSaving(false);
    }
  };

  // Load settings on component mount
  useEffect(() => {
    fetchSettings();
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));

    // Clear specific field error when user starts typing
    if (errors[name]) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  };

  // Check if form has unsaved changes
  const hasUnsavedChanges = () => {
    if (!originalData) return false;
    return JSON.stringify(formData) !== JSON.stringify(originalData);
  };

  const getFieldError = (fieldName: string): string | null => {
    return errors[fieldName] ? errors[fieldName][0] : null;
  };

  const tabs = [
    {
      id: 'general',
      label: 'General Information',
      icon: FiSettings
    },
    {
      id: 'privacy',
      label: 'Privacy and Security',
      icon: FiShield
    },
    {
      id: 'system',
      label: 'System',
      icon: FiServer
    }
  ];

  if (loading) {
    return (
      <main className="p-6 bg-gray-50 min-h-screen flex items-center justify-center">
        <div className="flex items-center space-x-2">
          <FiLoader className="w-6 h-6 animate-spin text-smblue-400" />
          <span className="text-gray-600">Loading settings...</span>
        </div>
      </main>
    );
  }

  return (
    <main className="p-6 bg-gray-50 min-h-screen flex flex-col gap-4">
      {/* Page Header */}
      <div className="mb-2">
        <h1 className="text-2xl font-bold text-darktext pl-0">Settings</h1>
      </div>

      {/* Success Message */}
      {successMessage && (
        <div className="bg-green-50 border border-green-200 text-green-800 px-4 py-3 rounded-lg">
          {successMessage}
        </div>
      )}

      {/* Tabs */}
      <div className="flex space-x-1 mb-4">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex items-center space-x-2 px-6 py-3 rounded-lg font-medium transition-colors ${
              activeTab === tab.id
                ? 'bg-smblue-400 text-white'
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
          >
            <tab.icon className="w-4 h-4" />
            <span>{tab.label}</span>
          </button>
        ))}
      </div>

      <section className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
        {/* General Information Tab */}
        {activeTab === 'general' && (
          <div>
            <h2 className="text-lg font-semibold text-darktext mb-6 border-l-4 border-smblue-400 pl-4">General Information</h2>
            <div className="border-b border-gray-200 mb-6"></div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Barangay *
                </label>
                <input
                  type="text"
                  name="barangay"
                  value={formData.barangay}
                  onChange={handleInputChange}
                  className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-smblue-200 focus:border-smblue-200 ${
                    getFieldError('barangay') ? 'border-red-300' : 'border-gray-300'
                  }`}
                />
                {getFieldError('barangay') && (
                  <p className="mt-1 text-sm text-red-600">{getFieldError('barangay')}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  City *
                </label>
                <input
                  type="text"
                  name="city"
                  value={formData.city}
                  onChange={handleInputChange}
                  className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-smblue-200 focus:border-smblue-200 ${
                    getFieldError('city') ? 'border-red-300' : 'border-gray-300'
                  }`}
                />
                {getFieldError('city') && (
                  <p className="mt-1 text-sm text-red-600">{getFieldError('city')}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Province *
                </label>
                <input
                  type="text"
                  name="province"
                  value={formData.province}
                  onChange={handleInputChange}
                  className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-smblue-200 focus:border-smblue-200 ${
                    getFieldError('province') ? 'border-red-300' : 'border-gray-300'
                  }`}
                />
                {getFieldError('province') && (
                  <p className="mt-1 text-sm text-red-600">{getFieldError('province')}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Region *
                </label>
                <input
                  type="text"
                  name="region"
                  value={formData.region}
                  onChange={handleInputChange}
                  className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-smblue-200 focus:border-smblue-200 ${
                    getFieldError('region') ? 'border-red-300' : 'border-gray-300'
                  }`}
                />
                {getFieldError('region') && (
                  <p className="mt-1 text-sm text-red-600">{getFieldError('region')}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Type *
                </label>
                <select
                  name="type"
                  value={formData.type}
                  onChange={handleInputChange}
                  className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-smblue-200 focus:border-smblue-200 ${
                    getFieldError('type') ? 'border-red-300' : 'border-gray-300'
                  }`}
                  title="Select type"
                >
                  <option value="">Select type</option>
                  <option value="Urban">Urban</option>
                  <option value="Rural">Rural</option>
                  <option value="Highly Urbanized">Highly Urbanized</option>
                </select>
                {getFieldError('type') && (
                  <p className="mt-1 text-sm text-red-600">{getFieldError('type')}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Contact Number *
                </label>
                <input
                  type="tel"
                  name="contactNumber"
                  value={formData.contactNumber}
                  onChange={handleInputChange}
                  className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-smblue-200 focus:border-smblue-200 ${
                    getFieldError('contactNumber') ? 'border-red-300' : 'border-gray-300'
                  }`}
                />
                {getFieldError('contactNumber') && (
                  <p className="mt-1 text-sm text-red-600">{getFieldError('contactNumber')}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Email Address *
                </label>
                <input
                  type="email"
                  name="emailAddress"
                  value={formData.emailAddress}
                  onChange={handleInputChange}
                  className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-smblue-200 focus:border-smblue-200 ${
                    getFieldError('emailAddress') ? 'border-red-300' : 'border-gray-300'
                  }`}
                />
                {getFieldError('emailAddress') && (
                  <p className="mt-1 text-sm text-red-600">{getFieldError('emailAddress')}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Opening Hours *
                </label>
                <input
                  type="text"
                  name="openingHours"
                  value={formData.openingHours}
                  onChange={handleInputChange}
                  className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-smblue-200 focus:border-smblue-200 ${
                    getFieldError('openingHours') ? 'border-red-300' : 'border-gray-300'
                  }`}
                />
                {getFieldError('openingHours') && (
                  <p className="mt-1 text-sm text-red-600">{getFieldError('openingHours')}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Closing Hours *
                </label>
                <input
                  type="text"
                  name="closingHours"
                  value={formData.closingHours}
                  onChange={handleInputChange}
                  className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-smblue-200 focus:border-smblue-200 ${
                    getFieldError('closingHours') ? 'border-red-300' : 'border-gray-300'
                  }`}
                />
                {getFieldError('closingHours') && (
                  <p className="mt-1 text-sm text-red-600">{getFieldError('closingHours')}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Primary Language
                </label>
                <input
                  type="text"
                  name="primaryLanguage"
                  value={formData.primaryLanguage}
                  onChange={handleInputChange}
                  className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-smblue-200 focus:border-smblue-200 ${
                    getFieldError('primaryLanguage') ? 'border-red-300' : 'border-gray-300'
                  }`}
                />
                {getFieldError('primaryLanguage') && (
                  <p className="mt-1 text-sm text-red-600">{getFieldError('primaryLanguage')}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Secondary Language
                </label>
                <input
                  type="text"
                  name="secondaryLanguage"
                  value={formData.secondaryLanguage}
                  onChange={handleInputChange}
                  className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-smblue-200 focus:border-smblue-200 ${
                    getFieldError('secondaryLanguage') ? 'border-red-300' : 'border-gray-300'
                  }`}
                />
                {getFieldError('secondaryLanguage') && (
                  <p className="mt-1 text-sm text-red-600">{getFieldError('secondaryLanguage')}</p>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Privacy and Security Tab */}
        {activeTab === 'privacy' && (
          <div>
            <h2 className="text-lg font-semibold text-darktext mb-6 border-l-4 border-smblue-400 pl-4">Privacy and Security</h2>
            <div className="border-b border-gray-200 mb-6"></div>
            
            {/* Authentication and Authorization */}
            <div className="mb-8">
              <h3 className="text-md font-medium text-gray-800 mb-4">Authentication and Authorization</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Session Timeout (minutes) *
                  </label>
                  <input
                    type="number"
                    name="sessionTimeout"
                    value={formData.sessionTimeout}
                    onChange={handleInputChange}
                    className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-smblue-200 focus:border-smblue-200 ${
                      getFieldError('sessionTimeout') ? 'border-red-300' : 'border-gray-300'
                    }`}
                  />
                  {getFieldError('sessionTimeout') && (
                    <p className="mt-1 text-sm text-red-600">{getFieldError('sessionTimeout')}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Max Login Attempts *
                  </label>
                  <input
                    type="number"
                    name="maxLoginAttempts"
                    value={formData.maxLoginAttempts}
                    onChange={handleInputChange}
                    className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-smblue-200 focus:border-smblue-200 ${
                      getFieldError('maxLoginAttempts') ? 'border-red-300' : 'border-gray-300'
                    }`}
                  />
                  {getFieldError('maxLoginAttempts') && (
                    <p className="mt-1 text-sm text-red-600">{getFieldError('maxLoginAttempts')}</p>
                  )}
                </div>
              </div>
            </div>

            {/* Data Retention */}
            <div className="mb-8">
              <h3 className="text-md font-medium text-gray-800 mb-4">Data Retention</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Length of data retention (years) *
                  </label>
                  <input
                    type="number"
                    name="dataRetention"
                    value={formData.dataRetention}
                    onChange={handleInputChange}
                    className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-smblue-200 focus:border-smblue-200 ${
                      getFieldError('dataRetention') ? 'border-red-300' : 'border-gray-300'
                    }`}
                  />
                  {getFieldError('dataRetention') && (
                    <p className="mt-1 text-sm text-red-600">{getFieldError('dataRetention')}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Backup Frequency
                  </label>
                  <select
                    name="backupFrequency"
                    value={formData.backupFrequency}
                    onChange={handleInputChange}
                    className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-smblue-200 focus:border-smblue-200 ${
                      getFieldError('backupFrequency') ? 'border-red-300' : 'border-gray-300'
                    }`}
                    title="Select backup frequency"
                  >
                    <option value="Daily">Daily</option>
                    <option value="Weekly">Weekly</option>
                    <option value="Monthly">Monthly</option>
                  </select>
                  {getFieldError('backupFrequency') && (
                    <p className="mt-1 text-sm text-red-600">{getFieldError('backupFrequency')}</p>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* System Tab */}
        {activeTab === 'system' && (
          <div>
            <h2 className="text-lg font-semibold text-darktext mb-6 border-l-4 border-smblue-400 pl-4">System</h2>
            <div className="border-b border-gray-200 mb-6"></div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  System Name
                </label>
                <input
                  type="text"
                  name="systemName"
                  value={formData.systemName}
                  onChange={handleInputChange}
                  className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-smblue-200 focus:border-smblue-200 ${
                    getFieldError('systemName') ? 'border-red-300' : 'border-gray-300'
                  }`}
                />
                {getFieldError('systemName') && (
                  <p className="mt-1 text-sm text-red-600">{getFieldError('systemName')}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Version Number
                </label>
                <input
                  type="text"
                  name="versionNumber"
                  value={formData.versionNumber}
                  onChange={handleInputChange}
                  className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-smblue-200 focus:border-smblue-200 ${
                    getFieldError('versionNumber') ? 'border-red-300' : 'border-gray-300'
                  }`}
                />
                {getFieldError('versionNumber') && (
                  <p className="mt-1 text-sm text-red-600">{getFieldError('versionNumber')}</p>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Save and Reset Buttons */}
        <div className="flex justify-between items-center mt-8 pt-6 border-t border-gray-200">
          {hasUnsavedChanges() && (
            <p className="text-sm text-amber-600">You have unsaved changes</p>
          )}
          <div className="ml-auto flex space-x-2">
            <button
              type="button"
              onClick={resetSettings}
              disabled={saving}
              className="px-6 py-2 bg-red-400 hover:bg-red-300 disabled:bg-gray-400 text-white rounded-lg transition-colors flex items-center space-x-2"
            >
              {saving && <FiLoader className="w-4 h-4 animate-spin" />}
              <span>{saving ? 'Resetting...' : 'Reset to Default'}</span>
            </button>
            <button
              type="button"
              onClick={saveSettings}
              disabled={saving}
              className="px-6 py-2 bg-smblue-400 hover:bg-smblue-300 disabled:bg-gray-400 text-white rounded-lg transition-colors flex items-center space-x-2"
            >
              {saving && <FiLoader className="w-4 h-4 animate-spin" />}
              <span>{saving ? 'Saving...' : 'Save Changes'}</span>
            </button>
          </div>
        </div>
      </section>
    </main>
  );
};

export default SettingsPage;
