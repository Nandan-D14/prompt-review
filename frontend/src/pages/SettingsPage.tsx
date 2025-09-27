import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Settings, Shield, Bell, Palette, Database, Key, Download, Trash2, Save, RefreshCw } from 'lucide-react';

export const SettingsPage: React.FC = () => {
  const [settings, setSettings] = useState({
    // Security Settings
    strictMode: true,
    blockExplicitContent: true,
    detectInjectionAttempts: true,
    multiLanguageSupport: true,
    
    // Notification Settings
    emailNotifications: true,
    browserNotifications: false,
    weeklyReports: true,
    securityAlerts: true,
    
    // Interface Settings
    darkMode: true,
    compactView: false,
    showScores: true,
    autoCollapseSidebar: false,
    
    // Data Settings
    saveHistory: true,
    dataRetention: '90-days',
    anonymizeData: false,
    
    // API Settings
    apiKey: 'sk-...hidden...',
    maxRequestsPerMinute: 100,
    timeout: 30,
  });

  const [unsavedChanges, setUnsavedChanges] = useState(false);

  const handleSettingChange = (key: string, value: any) => {
    setSettings(prev => ({ ...prev, [key]: value }));
    setUnsavedChanges(true);
  };

  const handleSaveSettings = () => {
    // In a real app, this would call an API to save settings
    console.log('Saving settings:', settings);
    setUnsavedChanges(false);
  };

  const handleResetSettings = () => {
    // Reset to defaults
    setSettings({
      strictMode: true,
      blockExplicitContent: true,
      detectInjectionAttempts: true,
      multiLanguageSupport: true,
      emailNotifications: true,
      browserNotifications: false,
      weeklyReports: true,
      securityAlerts: true,
      darkMode: true,
      compactView: false,
      showScores: true,
      autoCollapseSidebar: false,
      saveHistory: true,
      dataRetention: '90-days',
      anonymizeData: false,
      apiKey: 'sk-...hidden...',
      maxRequestsPerMinute: 100,
      timeout: 30,
    });
    setUnsavedChanges(true);
  };

  const handleExportSettings = () => {
    const dataStr = JSON.stringify(settings, null, 2);
    const dataBlob = new Blob([dataStr], {type: 'application/json'});
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'promptguard-settings.json';
    link.click();
  };

  const handleClearAllData = () => {
    if (confirm('Are you sure you want to clear all data? This action cannot be undone.')) {
      console.log('Clearing all data...');
    }
  };

  const SettingToggle: React.FC<{
    label: string;
    description: string;
    checked: boolean;
    onChange: (checked: boolean) => void;
  }> = ({ label, description, checked, onChange }) => (
    <div className="flex items-center justify-between p-4 glass-panel rounded-lg border border-gray-700/50 light:border-gray-300/50">
      <div>
        <h3 className="font-semibold dark:text-white light:text-black">{label}</h3>
        <p className="text-sm text-gray-400">{description}</p>
      </div>
      <label className="relative inline-flex items-center cursor-pointer">
        <input
          type="checkbox"
          checked={checked}
          onChange={(e) => onChange(e.target.checked)}
          className="sr-only peer"
        />
        <div className="w-11 h-6 bg-gray-600 peer-focus:outline-none rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-indigo-600"></div>
      </label>
    </div>
  );

  const SettingSelect: React.FC<{
    label: string;
    description: string;
    value: string;
    options: { value: string; label: string }[];
    onChange: (value: string) => void;
  }> = ({ label, description, value, options, onChange }) => (
    <div className="p-4 glass-panel rounded-lg border border-gray-700/50 light:border-gray-300/50">
      <div className="mb-3">
        <h3 className="font-semibold dark:text-white light:text-black">{label}</h3>
        <p className="text-sm text-gray-400">{description}</p>
      </div>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full px-3 py-2 glass-panel rounded-lg border border-gray-700/50 light:border-gray-300/50 bg-transparent dark:text-white light:text-black focus:outline-none focus:border-indigo-500"
      >
        {options.map(option => (
          <option key={option.value} value={option.value}>{option.label}</option>
        ))}
      </select>
    </div>
  );

  const SettingInput: React.FC<{
    label: string;
    description: string;
    value: string | number;
    type?: string;
    onChange: (value: string | number) => void;
  }> = ({ label, description, value, type = 'text', onChange }) => (
    <div className="p-4 glass-panel rounded-lg border border-gray-700/50 light:border-gray-300/50">
      <div className="mb-3">
        <h3 className="font-semibold dark:text-white light:text-black">{label}</h3>
        <p className="text-sm text-gray-400">{description}</p>
      </div>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(type === 'number' ? parseInt(e.target.value) : e.target.value)}
        className="w-full px-3 py-2 glass-panel rounded-lg border border-gray-700/50 light:border-gray-300/50 bg-transparent dark:text-white light:text-black focus:outline-none focus:border-indigo-500"
      />
    </div>
  );

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="p-6 border-b border-gray-700/50 light:border-gray-300/50 flex-shrink-0">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Settings className="w-6 h-6 text-indigo-400" />
            <h1 className="text-2xl font-bold dark:text-white light:text-black">
              Settings
            </h1>
            {unsavedChanges && (
              <span className="px-2 py-1 bg-amber-500/20 text-amber-400 text-xs rounded-full">
                Unsaved changes
              </span>
            )}
          </div>
          
          <div className="flex gap-2">
            <button
              onClick={handleExportSettings}
              className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors flex items-center gap-2"
            >
              <Download className="w-4 h-4" />
              Export
            </button>
            <button
              onClick={handleResetSettings}
              className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors flex items-center gap-2"
            >
              <RefreshCw className="w-4 h-4" />
              Reset
            </button>
            <button
              onClick={handleSaveSettings}
              disabled={!unsavedChanges}
              className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center gap-2"
            >
              <Save className="w-4 h-4" />
              Save Changes
            </button>
          </div>
        </div>
      </div>

      {/* Settings Content */}
      <div className="flex-1 overflow-y-auto custom-scrollbar p-6">
        <div className="max-w-4xl mx-auto space-y-8">
          
          {/* Security Settings */}
          <motion.section
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            <div className="flex items-center gap-2 mb-4">
              <Shield className="w-5 h-5 text-indigo-400" />
              <h2 className="text-xl font-semibold dark:text-white light:text-black">Security</h2>
            </div>
            <div className="space-y-4">
              <SettingToggle
                label="Strict Mode"
                description="Enable stricter content filtering and security checks"
                checked={settings.strictMode}
                onChange={(checked) => handleSettingChange('strictMode', checked)}
              />
              <SettingToggle
                label="Block Explicit Content"
                description="Automatically block prompts containing explicit or inappropriate content"
                checked={settings.blockExplicitContent}
                onChange={(checked) => handleSettingChange('blockExplicitContent', checked)}
              />
              <SettingToggle
                label="Detect Injection Attempts"
                description="Identify and block prompt injection and system manipulation attempts"
                checked={settings.detectInjectionAttempts}
                onChange={(checked) => handleSettingChange('detectInjectionAttempts', checked)}
              />
              <SettingToggle
                label="Multi-Language Support"
                description="Enable detection and analysis of mixed-language content"
                checked={settings.multiLanguageSupport}
                onChange={(checked) => handleSettingChange('multiLanguageSupport', checked)}
              />
            </div>
          </motion.section>

          {/* Notification Settings */}
          <motion.section
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <div className="flex items-center gap-2 mb-4">
              <Bell className="w-5 h-5 text-indigo-400" />
              <h2 className="text-xl font-semibold dark:text-white light:text-black">Notifications</h2>
            </div>
            <div className="space-y-4">
              <SettingToggle
                label="Email Notifications"
                description="Receive email alerts for important security events"
                checked={settings.emailNotifications}
                onChange={(checked) => handleSettingChange('emailNotifications', checked)}
              />
              <SettingToggle
                label="Browser Notifications"
                description="Show desktop notifications for real-time alerts"
                checked={settings.browserNotifications}
                onChange={(checked) => handleSettingChange('browserNotifications', checked)}
              />
              <SettingToggle
                label="Weekly Reports"
                description="Receive weekly summary reports of your prompt analysis activity"
                checked={settings.weeklyReports}
                onChange={(checked) => handleSettingChange('weeklyReports', checked)}
              />
              <SettingToggle
                label="Security Alerts"
                description="Get immediate notifications for security threats and blocked content"
                checked={settings.securityAlerts}
                onChange={(checked) => handleSettingChange('securityAlerts', checked)}
              />
            </div>
          </motion.section>

          {/* Interface Settings */}
          <motion.section
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <div className="flex items-center gap-2 mb-4">
              <Palette className="w-5 h-5 text-indigo-400" />
              <h2 className="text-xl font-semibold dark:text-white light:text-black">Interface</h2>
            </div>
            <div className="space-y-4">
              <SettingToggle
                label="Dark Mode"
                description="Use dark theme for the interface"
                checked={settings.darkMode}
                onChange={(checked) => handleSettingChange('darkMode', checked)}
              />
              <SettingToggle
                label="Compact View"
                description="Use a more compact layout to fit more content on screen"
                checked={settings.compactView}
                onChange={(checked) => handleSettingChange('compactView', checked)}
              />
              <SettingToggle
                label="Show Safety Scores"
                description="Display numerical safety scores alongside verdict classifications"
                checked={settings.showScores}
                onChange={(checked) => handleSettingChange('showScores', checked)}
              />
              <SettingToggle
                label="Auto-Collapse Sidebar"
                description="Automatically collapse the sidebar on smaller screens"
                checked={settings.autoCollapseSidebar}
                onChange={(checked) => handleSettingChange('autoCollapseSidebar', checked)}
              />
            </div>
          </motion.section>

          {/* Data Settings */}
          <motion.section
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            <div className="flex items-center gap-2 mb-4">
              <Database className="w-5 h-5 text-indigo-400" />
              <h2 className="text-xl font-semibold dark:text-white light:text-black">Data & Privacy</h2>
            </div>
            <div className="space-y-4">
              <SettingToggle
                label="Save History" 
                description="Store prompt analysis history for future reference and exports"
                checked={settings.saveHistory}
                onChange={(checked) => handleSettingChange('saveHistory', checked)}
              />
              <SettingSelect
                label="Data Retention Period"
                description="How long to keep your prompt history and analysis data"
                value={settings.dataRetention}
                options={[
                  { value: '7-days', label: '7 days' },
                  { value: '30-days', label: '30 days' },
                  { value: '90-days', label: '90 days' },
                  { value: '1-year', label: '1 year' },
                  { value: 'forever', label: 'Forever' },
                ]}
                onChange={(value) => handleSettingChange('dataRetention', value)}
              />
              <SettingToggle
                label="Anonymize Data"
                description="Remove identifying information from stored data and exports"
                checked={settings.anonymizeData}
                onChange={(checked) => handleSettingChange('anonymizeData', checked)}
              />
            </div>
          </motion.section>

          {/* API Settings */}
          <motion.section
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
          >
            <div className="flex items-center gap-2 mb-4">
              <Key className="w-5 h-5 text-indigo-400" />
              <h2 className="text-xl font-semibold dark:text-white light:text-black">API Configuration</h2>
            </div>
            <div className="space-y-4">
              <SettingInput
                label="API Key"
                description="Your Gemini API key for enhanced analysis capabilities"
                value={settings.apiKey}
                onChange={(value) => handleSettingChange('apiKey', value)}
              />
              <SettingInput
                label="Rate Limit (requests/minute)"
                description="Maximum number of API requests per minute"
                value={settings.maxRequestsPerMinute}
                type="number"
                onChange={(value) => handleSettingChange('maxRequestsPerMinute', value)}
              />
              <SettingInput
                label="Request Timeout (seconds)"
                description="How long to wait for API responses before timing out"
                value={settings.timeout}
                type="number"
                onChange={(value) => handleSettingChange('timeout', value)}
              />
            </div>
          </motion.section>

          {/* Danger Zone */}
          <motion.section
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
          >
            <div className="flex items-center gap-2 mb-4">
              <Trash2 className="w-5 h-5 text-red-400" />
              <h2 className="text-xl font-semibold text-red-400">Danger Zone</h2>
            </div>
            <div className="p-4 glass-panel rounded-lg border border-red-500/50 bg-red-500/10">
              <h3 className="font-semibold text-red-400 mb-2">Clear All Data</h3>
              <p className="text-sm text-gray-400 mb-4">
                Permanently delete all your prompt history, analysis data, and settings. This action cannot be undone.
              </p>
              <button
                onClick={handleClearAllData}
                className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors flex items-center gap-2"
              >
                <Trash2 className="w-4 h-4" />
                Clear All Data
              </button>
            </div>
          </motion.section>

        </div>
      </div>
    </div>
  );
};
