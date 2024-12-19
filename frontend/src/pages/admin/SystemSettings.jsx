import React, { useState, useEffect } from 'react';

const SystemSettings = () => {
  const [settings, setSettings] = useState(null);
  const [generalSettingsOpen, setGeneralSettingsOpen] = useState(true);
  const [branchSettingsOpen, setBranchSettingsOpen] = useState(false);
  const [parcelSettingsOpen, setParcelSettingsOpen] = useState(false);
  const [performanceSettingsOpen, setPerformanceSettingsOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  // Fetch system settings on component mount
  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const response = await fetch('/api/user/admin/read-system-setting');
        if (!response.ok) {
          throw new Error('Failed to fetch settings');
        }
        const data = await response.json();
        setSettings(data);
      } catch (error) {
        console.error('Error fetching settings:', error);
      }
    };
    fetchSettings();
  }, []);

  const handleSave = async () => {
    try {
      setLoading(true);

      // Prepare the updated settings object
      const updatedSettings = {
        generalSettings: settings.generalSettings,
        branchManagementSettings: settings.branchManagementSettings,
        parcelSettings: settings.parcelSettings,
      };

      // Call the API to update settings
      const response = await fetch('/api/user/admin/update-system-setting/', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updatedSettings),
      });

      if (!response.ok) {
        throw new Error('Failed to update settings');
      }

      alert('Settings updated successfully!');
    } catch (error) {
      console.error('Error updating settings:', error);
      alert('Failed to update settings');
    } finally {
      setLoading(false);
    }
  };

  if (!settings) {
    return <div>Loading settings...</div>;
  }

  return (
    <div className="container mx-auto px-4 py-6">
      <h1 className="text-2xl font-bold mb-6">System Settings</h1>

      {/* General Settings */}
      <div className="mb-4">
        <div
          className="cursor-pointer bg-gray-100 p-4 rounded-md shadow-sm"
          onClick={() => setGeneralSettingsOpen(!generalSettingsOpen)}
        >
          <h2 className="font-semibold text-xl">General Settings</h2>
        </div>
        {generalSettingsOpen && (
          <div className="p-4 border border-gray-200 rounded-md mt-2">
            <div className="mb-4">
              <label className="block font-medium mb-1">System Name</label>
              <input
                type="text"
                value={settings.generalSettings.system_name}
                onChange={(e) =>
                  setSettings({
                    ...settings,
                    generalSettings: {
                      ...settings.generalSettings,
                      system_name: e.target.value,
                    },
                  })
                }
                className="border border-gray-300 rounded-lg p-2 w-full"
              />
            </div>
            <div className="mb-4">
              <label className="block font-medium mb-1">Timezone</label>
              <select
                value={settings.generalSettings.timezone}
                onChange={(e) =>
                  setSettings({
                    ...settings,
                    generalSettings: {
                      ...settings.generalSettings,
                      timezone: e.target.value,
                    },
                  })
                }
                className="border border-gray-300 rounded-lg p-2 w-full"
              >
                <option>UTC</option>
                <option>Asia/Kolkata</option>
                <option>America/New_York</option>
              </select>
            </div>
            <div className="mb-4">
              <label className="block font-medium mb-1">Currency</label>
              <select
                value={settings.generalSettings.currency}
                onChange={(e) =>
                  setSettings({
                    ...settings,
                    generalSettings: {
                      ...settings.generalSettings,
                      currency: e.target.value,
                    },
                  })
                }
                className="border border-gray-300 rounded-lg p-2 w-full"
              >
                <option>USD</option>
                <option>INR</option>
                <option>EUR</option>
              </select>
            </div>
            <div className="mb-4">
              <label className="block font-medium mb-1">Language</label>
              <select
                value={settings.generalSettings.language}
                onChange={(e) =>
                  setSettings({
                    ...settings,
                    generalSettings: {
                      ...settings.generalSettings,
                      language: e.target.value,
                    },
                  })
                }
                className="border border-gray-300 rounded-lg p-2 w-full"
              >
                <option>English</option>
                <option>Hindi</option>
                <option>Spanish</option>
              </select>
            </div>
          </div>
        )}
      </div>

      {/* Branch Management Settings */}
      <div className="mb-4">
        <div
          className="cursor-pointer bg-gray-100 p-4 rounded-md shadow-sm"
          onClick={() => setBranchSettingsOpen(!branchSettingsOpen)}
        >
          <h2 className="font-semibold text-xl">Branch Management Settings</h2>
        </div>
        {branchSettingsOpen && (
          <div className="p-4 border border-gray-200 rounded-md mt-2">
            <div className="mb-4">
              <label className="block font-medium mb-1">Default Branch Capacity</label>
              <input
                type="number"
                value={settings.branchManagementSettings.default_capacity}
                onChange={(e) =>
                  setSettings({
                    ...settings,
                    branchManagementSettings: {
                      ...settings.branchManagementSettings,
                      default_capacity: e.target.value,
                    },
                  })
                }
                className="border border-gray-300 rounded-lg p-2 w-full"
              />
            </div>
            <div className="mb-4">
              <label className="block font-medium mb-1">Max Active Branches</label>
              <input
                type="number"
                value={settings.branchManagementSettings.max_active_branches}
                onChange={(e) =>
                  setSettings({
                    ...settings,
                    branchManagementSettings: {
                      ...settings.branchManagementSettings,
                      max_active_branches: e.target.value,
                    },
                  })
                }
                className="border border-gray-300 rounded-lg p-2 w-full"
              />
            </div>
            <div className="mb-4">
              <label className="block font-medium mb-1">Enable Branch Alerts</label>
              <select
                value={settings.branchManagementSettings.enable_alerts}
                onChange={(e) =>
                  setSettings({
                    ...settings,
                    branchManagementSettings: {
                      ...settings.branchManagementSettings,
                      enable_alerts: e.target.value === 'true',
                    },
                  })
                }
                className="border border-gray-300 rounded-lg p-2 w-full"
              >
                <option value="true">Yes</option>
                <option value="false">No</option>
              </select>
            </div>
          </div>
        )}
      </div>

      {/* Parcel Settings */}
      <div className="mb-4">
        <div
          className="cursor-pointer bg-gray-100 p-4 rounded-md shadow-sm"
          onClick={() => setParcelSettingsOpen(!parcelSettingsOpen)}
        >
          <h2 className="font-semibold text-xl">Parcel Settings</h2>
        </div>
        {parcelSettingsOpen && (
          <div className="p-4 border border-gray-200 rounded-md mt-2">
            <div className="mb-4">
              <label className="block font-medium mb-1">Default Parcel Weight Limit</label>
              <input
                type="number"
                value={settings.parcelSettings.default_weight_limit}
                onChange={(e) =>
                  setSettings({
                    ...settings,
                    parcelSettings: {
                      ...settings.parcelSettings,
                      default_weight_limit: e.target.value,
                    },
                  })
                }
                className="border border-gray-300 rounded-lg p-2 w-full"
              />
            </div>
            <div className="mb-4">
              <label className="block font-medium mb-1">Max Parcel Size</label>
              <input
                type="number"
                value={settings.parcelSettings.max_parcel_size}
                onChange={(e) =>
                  setSettings({
                    ...settings,
                    parcelSettings: {
                      ...settings.parcelSettings,
                      max_parcel_size: e.target.value,
                    },
                  })
                }
                className="border border-gray-300 rounded-lg p-2 w-full"
              />
            </div>
            <div className="mb-4">
              <label className="block font-medium mb-1">Insurance Required for High Value</label>
              <select
                value={settings.parcelSettings.insurance_required}
                onChange={(e) =>
                  setSettings({
                    ...settings,
                    parcelSettings: {
                      ...settings.parcelSettings,
                      insurance_required: e.target.value === 'true',
                    },
                  })
                }
                className="border border-gray-300 rounded-lg p-2 w-full"
              >
                <option value="true">Yes</option>
                <option value="false">No</option>
              </select>
            </div>
          </div>
        )}
      </div>


      {/* Performance Tracking Settings (Read-only) */}
      <div className="mb-4">
        <div
          className="cursor-pointer bg-gray-100 p-4 rounded-md shadow-sm"
          onClick={() => setPerformanceSettingsOpen(!performanceSettingsOpen)}
        >
          <h2 className="font-semibold text-xl">Performance Tracking Settings</h2>
        </div>
        {performanceSettingsOpen && (
          <div className="p-4 border border-gray-200 rounded-md mt-2">
            <p>
              <strong>Total Delivered Parcels:</strong>{' '}
              {settings.performanceTracking.total_delivered_parcels}
            </p>
            <p>
              <strong>Total Pickup Parcels:</strong>{' '}
              {settings.performanceTracking.total_pickup_parcels}
            </p>
            <p>
              <strong>Average Delivery Time:</strong>{' '}
              {settings.performanceTracking.average_delivery_time} hours
            </p>
            <p>
              <strong>Total Complaints:</strong> {settings.performanceTracking.total_complaints}
            </p>
          </div>
        )}
      </div>

      {/* Save and Cancel Buttons */}
      <div className="flex justify-end mt-6 space-x-4">
        <button
          className="bg-gray-400 text-white py-2 px-4 rounded-lg hover:bg-gray-500"
          disabled={loading}
          onClick={() => window.location.reload()}
        >
          Cancel
        </button>
        <button
          className="bg-indigo-600 text-white py-2 px-4 rounded-lg hover:bg-indigo-500"
          disabled={loading}
          onClick={handleSave}
        >
          {loading ? 'Saving...' : 'Save'}
        </button>
      </div>
    </div>
  );
};

export default SystemSettings;
