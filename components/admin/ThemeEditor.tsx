'use client';

import React, { useState, useEffect } from 'react';
import { useAdmin } from './AdminProvider';
import { cmsService, ThemeSettings } from '@/lib/services/cms.service';
import { X, Save, RotateCcw } from 'lucide-react';

export default function ThemeEditor({ onClose }: { onClose: () => void }) {
  const { isAdmin } = useAdmin();
  const [settings, setSettings] = useState<ThemeSettings>({
    primaryColor: '#3b82f6', // Default blue-500
    secondaryColor: '#10b981', // Default emerald-500
    accentColor: '#f59e0b', // Default amber-500
    fontFamily: 'Inter',
  });
  const [originalSettings, setOriginalSettings] = useState<ThemeSettings | null>(null);

  const applyTheme = (theme: ThemeSettings) => {
    const root = document.documentElement;
    root.style.setProperty('--primary', theme.primaryColor);
    root.style.setProperty('--secondary', theme.secondaryColor);
    root.style.setProperty('--accent', theme.accentColor);
    // Add more variables as needed
  };

  useEffect(() => {
    const loadTheme = async () => {
      const theme = await cmsService.getTheme();
      if (theme) {
        setSettings(theme);
        setOriginalSettings(theme);
        applyTheme(theme);
      }
    };
    loadTheme();
  }, []);

  const handleChange = (key: keyof ThemeSettings, value: string) => {
    const newSettings = { ...settings, [key]: value };
    setSettings(newSettings);
    applyTheme(newSettings);
  };

  const handleSave = async () => {
    await cmsService.updateTheme(settings);
    setOriginalSettings(settings);
    onClose();
  };

  const handleReset = () => {
    if (originalSettings) {
      setSettings(originalSettings);
      applyTheme(originalSettings);
    }
  };

  if (!isAdmin) return null;

  return (
    <div className="fixed top-20 right-4 w-80 bg-white shadow-xl rounded-lg border border-gray-200 z-50 p-4">
      <div className="flex justify-between items-center mb-4">
        <h3 className="font-bold text-lg">Theme Editor</h3>
        <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
          <X className="w-5 h-5" />
        </button>
      </div>

      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Primary Color</label>
          <div className="flex gap-2">
            <input
              type="color"
              value={settings.primaryColor}
              onChange={(e) => handleChange('primaryColor', e.target.value)}
              className="h-8 w-8 rounded cursor-pointer border border-gray-300"
            />
            <input
              type="text"
              value={settings.primaryColor}
              onChange={(e) => handleChange('primaryColor', e.target.value)}
              className="flex-1 border border-gray-300 rounded px-2 py-1 text-sm"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Secondary Color</label>
          <div className="flex gap-2">
            <input
              type="color"
              value={settings.secondaryColor}
              onChange={(e) => handleChange('secondaryColor', e.target.value)}
              className="h-8 w-8 rounded cursor-pointer border border-gray-300"
            />
            <input
              type="text"
              value={settings.secondaryColor}
              onChange={(e) => handleChange('secondaryColor', e.target.value)}
              className="flex-1 border border-gray-300 rounded px-2 py-1 text-sm"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Accent Color</label>
          <div className="flex gap-2">
            <input
              type="color"
              value={settings.accentColor}
              onChange={(e) => handleChange('accentColor', e.target.value)}
              className="h-8 w-8 rounded cursor-pointer border border-gray-300"
            />
            <input
              type="text"
              value={settings.accentColor}
              onChange={(e) => handleChange('accentColor', e.target.value)}
              className="flex-1 border border-gray-300 rounded px-2 py-1 text-sm"
            />
          </div>
        </div>
      </div>

      <div className="flex justify-between mt-6 pt-4 border-t border-gray-100">
        <button
          onClick={handleReset}
          className="flex items-center text-sm text-gray-600 hover:text-gray-900"
        >
          <RotateCcw className="w-4 h-4 mr-1" />
          Reset
        </button>
        <button
          onClick={handleSave}
          className="flex items-center bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 text-sm font-medium"
        >
          <Save className="w-4 h-4 mr-2" />
          Save Changes
        </button>
      </div>
    </div>
  );
}
