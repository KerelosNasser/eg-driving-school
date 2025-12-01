"use client";

import React, { useState, useEffect } from "react";
import {
  getAdminSettings,
  updateAdminSettings,
  CalendarSettings,
} from "@/app/actions/admin-settings.action";
import { useAdmin } from "@/components/admin/AdminProvider";
import { useAuth } from "@/components/providers/AuthProvider";
import { LoadingIndicator } from "@/components/ui/loading-indicator";
import { AdminCalendarView } from "./calendar/AdminCalendarView";
import { UserCalendarView } from "./calendar/UserCalendarView";

export default function CalendarTab() {
  const { isAdmin } = useAdmin();
  const { user } = useAuth();

  const [settings, setSettings] = useState<CalendarSettings | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [warning, setWarning] = useState<string | null>(null);

  // Load Settings
  useEffect(() => {
    const loadData = async () => {
      try {
        const result = await getAdminSettings();
        if (result.success && result.data) {
          setSettings(result.data);
          if (result.warning) {
            setWarning(result.warning);
          }
        }
      } catch (error) {
        console.error("Failed to load data:", error);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  const handleSaveSettings = async () => {
    if (!settings) return;
    if (warning) {
      alert(
        "Cannot save settings in Read-Only mode. Please fix the database connection."
      );
      return;
    }
    setSaving(true);
    const result = await updateAdminSettings(settings);
    if (result.success) {
      alert("Settings saved successfully!");
    } else {
      alert(`Failed to save: ${result.error}`);
    }
    setSaving(false);
  };

  if (loading) {
    return (
      <div className="h-64 relative">
        <LoadingIndicator
          fullscreen={false}
          message="Loading calendar..."
          background="transparent"
        />
      </div>
    );
  }

  if (!settings) {
    return (
      <div className="text-center py-12">
        <p className="text-lg text-red-600">
          Failed to load calendar settings.
        </p>
      </div>
    );
  }

  return isAdmin ? (
    <AdminCalendarView
      settings={settings}
      onSettingsChange={setSettings}
      onSave={handleSaveSettings}
      saving={saving}
      warning={warning}
    />
  ) : (
    <UserCalendarView settings={settings} userId={user?.uid || ""} />
  );
}
