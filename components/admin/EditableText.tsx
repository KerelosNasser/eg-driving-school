'use client';

import React, { useState, useEffect } from 'react';
import { useAdmin } from './AdminProvider';
import { cmsService } from '@/lib/services/cms.service';
import { Loader2, Check, X } from 'lucide-react';

interface EditableTextProps {
  section: string;
  field: string;
  initialValue: string;
  className?: string;
  multiline?: boolean;
}

export default function EditableText({ section, field, initialValue, className = '', multiline = false }: EditableTextProps) {
  const { isAdmin, isEditing } = useAdmin();
  const [value, setValue] = useState(initialValue);
  const [editValue, setEditValue] = useState(initialValue);
  const [isSaving, setIsSaving] = useState(false);
  const [isLocalEditing, setIsLocalEditing] = useState(false);

  useEffect(() => {
    setValue(initialValue);
    setEditValue(initialValue);
  }, [initialValue]);

  const handleSave = async () => {
    setIsSaving(true);
    try {
      await cmsService.updateSiteContent(section, { [field]: editValue });
      setValue(editValue);
      setIsLocalEditing(false);
    } catch (error) {
      console.error('Failed to save text:', error);
      // Optionally show error toast
    } finally {
      setIsSaving(false);
    }
  };

  const handleCancel = () => {
    setEditValue(value);
    setIsLocalEditing(false);
  };

  if (isAdmin && isEditing) {
    if (isLocalEditing) {
      return (
        <div className="relative group inline-block w-full">
          {multiline ? (
            <textarea
              value={editValue}
              onChange={(e) => setEditValue(e.target.value)}
              className={`w-full p-2 border rounded bg-white text-black ${className}`}
              rows={4}
            />
          ) : (
            <input
              type="text"
              value={editValue}
              onChange={(e) => setEditValue(e.target.value)}
              className={`w-full p-2 border rounded bg-white text-black ${className}`}
            />
          )}
          <div className="absolute top-0 right-0 transform -translate-y-full flex gap-1 bg-white p-1 rounded shadow z-50">
            <button
              onClick={handleSave}
              disabled={isSaving}
              className="p-1 text-green-600 hover:bg-green-50 rounded"
            >
              {isSaving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Check className="w-4 h-4" />}
            </button>
            <button
              onClick={handleCancel}
              disabled={isSaving}
              className="p-1 text-red-600 hover:bg-red-50 rounded"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
      );
    }

    return (
      <div
        onClick={() => setIsLocalEditing(true)}
        className={`cursor-pointer border-2 border-dashed border-blue-300 hover:border-blue-500 hover:bg-blue-50/10 rounded transition-colors relative group ${className}`}
        title="Click to edit"
      >
        {multiline ? (
            <div className="whitespace-pre-wrap">{value}</div>
        ) : (
            <span>{value}</span>
        )}
        <span className="absolute -top-3 -right-3 bg-blue-500 text-white text-xs px-1 rounded opacity-0 group-hover:opacity-100 transition-opacity">
          Edit
        </span>
      </div>
    );
  }

  return multiline ? <div className={`whitespace-pre-wrap ${className}`}>{value}</div> : <span className={className}>{value}</span>;
}
