'use client';

import React, { useState } from 'react';
import { useAdmin } from './AdminProvider';
import { Edit, Palette, LogOut, Eye } from 'lucide-react';
import ThemeEditor from './ThemeEditor';

export default function AdminControls() {
  const { isAdmin, isEditing, toggleEditMode, logout } = useAdmin();
  const [showThemeEditor, setShowThemeEditor] = useState(false);

  if (!isAdmin) return null;

  return (
    <>
      <div className="fixed bottom-4 right-4 flex flex-col gap-2 z-50">
        <button
          onClick={() => setShowThemeEditor(!showThemeEditor)}
          className="bg-white text-gray-800 p-3 rounded-full shadow-lg hover:bg-gray-50 transition-all border border-gray-200"
          title="Theme Editor"
        >
          <Palette className="w-6 h-6" />
        </button>

        <button
          onClick={toggleEditMode}
          className={`p-3 rounded-full shadow-lg transition-all border border-gray-200 ${
            isEditing ? 'bg-blue-600 text-white hover:bg-blue-700' : 'bg-white text-gray-800 hover:bg-gray-50'
          }`}
          title={isEditing ? 'Exit Edit Mode' : 'Enter Edit Mode'}
        >
          {isEditing ? <Eye className="w-6 h-6" /> : <Edit className="w-6 h-6" />}
        </button>

        <button
          onClick={logout}
          className="bg-white text-red-600 p-3 rounded-full shadow-lg hover:bg-red-50 transition-all border border-gray-200"
          title="Logout"
        >
          <LogOut className="w-6 h-6" />
        </button>
      </div>

      {showThemeEditor && <ThemeEditor onClose={() => setShowThemeEditor(false)} />}
    </>
  );
}
