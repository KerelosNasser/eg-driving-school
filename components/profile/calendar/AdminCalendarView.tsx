"use client";

import React from "react";
import { Calendar as CalendarIcon } from "lucide-react";
import { CalendarSettings } from "@/app/actions/admin-settings.action";

interface AdminCalendarViewProps {
  settings: CalendarSettings;
  onSettingsChange: (settings: CalendarSettings) => void;
  onSave: () => void;
  saving: boolean;
  warning: string | null;
}

export function AdminCalendarView({
  settings,
  onSettingsChange,
  onSave,
  saving,
  warning,
}: AdminCalendarViewProps) {
  const toggleWorkingDay = (day: number) => {
    const workingDays = settings.workingDays.includes(day)
      ? settings.workingDays.filter((d) => d !== day)
      : [...settings.workingDays, day].sort((a, b) => a - b);
    onSettingsChange({ ...settings, workingDays });
  };

  const addVacation = (date: string) => {
    if (!settings.vacations.includes(date)) {
      onSettingsChange({
        ...settings,
        vacations: [...settings.vacations, date].sort(),
      });
    }
  };

  const removeVacation = (date: string) => {
    onSettingsChange({
      ...settings,
      vacations: settings.vacations.filter((d) => d !== date),
    });
  };

  return (
    <div className="space-y-8">
      <div className="flex items-center gap-4 mb-6">
        <div className="w-12 h-12 rounded-xl bg-(--primary) flex items-center justify-center text-black">
          <CalendarIcon size={24} />
        </div>
        <div>
          <h2 className="text-2xl font-bold text-gray-900">
            Calendar Management
          </h2>
          <p className="text-gray-500">Manage working hours and availability</p>
        </div>
      </div>

      {warning && (
        <div className="bg-yellow-500/10 border border-yellow-500/20 rounded-xl p-4 mb-6">
          <div className="flex items-center gap-3">
            <div className="w-2 h-2 rounded-full bg-yellow-500 animate-pulse" />
            <p className="text-yellow-600 font-medium">
              Read-Only Mode: {warning}
            </p>
          </div>
        </div>
      )}

      {/* Working Days */}
      <div className="bg-gray-50 border border-gray-200 rounded-xl p-6">
        <h3 className="text-xl font-bold text-gray-900 mb-4">Working Days</h3>
        <div className="flex flex-wrap gap-3">
          {[
            "Sunday",
            "Monday",
            "Tuesday",
            "Wednesday",
            "Thursday",
            "Friday",
            "Saturday",
          ].map((day, idx) => (
            <button
              key={idx}
              onClick={() => toggleWorkingDay(idx)}
              className={`px-4 py-2 rounded-lg font-semibold transition-all ${
                settings.workingDays.includes(idx)
                  ? "bg-(--primary) text-black"
                  : "bg-gray-100 text-gray-500 hover:bg-gray-200"
              }`}
            >
              {day}
            </button>
          ))}
        </div>
      </div>

      {/* Working Hours */}
      <div className="bg-gray-50 border border-gray-200 rounded-xl p-6">
        <h3 className="text-xl font-bold text-gray-900 mb-4">Working Hours</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-600 mb-2">
              Start Time
            </label>
            <input
              type="time"
              value={settings.workingHours.start}
              onChange={(e) =>
                onSettingsChange({
                  ...settings,
                  workingHours: {
                    ...settings.workingHours,
                    start: e.target.value,
                  },
                })
              }
              className="w-full px-4 py-3 bg-white border border-gray-300 rounded-lg text-gray-900 focus:border-(--primary) focus:outline-none transition-colors"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-600 mb-2">
              End Time
            </label>
            <input
              type="time"
              value={settings.workingHours.end}
              onChange={(e) =>
                onSettingsChange({
                  ...settings,
                  workingHours: {
                    ...settings.workingHours,
                    end: e.target.value,
                  },
                })
              }
              className="w-full px-4 py-3 bg-white border border-gray-300 rounded-lg text-gray-900 focus:border-(--primary) focus:outline-none transition-colors"
            />
          </div>
        </div>
      </div>

      {/* Google Calendar ID */}
      <div className="bg-gray-50 border border-gray-200 rounded-xl p-6">
        <h3 className="text-xl font-bold text-gray-900 mb-2">
          Google Calendar ID
        </h3>
        <p className="text-sm text-gray-500 mb-4">
          Enter your Google Calendar ID to sync events and manage availability.
          <br />
          <span className="text-xs">
            Find it in Google Calendar → Settings → Your calendar → Integrate
            calendar → Calendar ID
          </span>
        </p>
        <input
          type="text"
          value={settings.calendarId || ""}
          onChange={(e) =>
            onSettingsChange({
              ...settings,
              calendarId: e.target.value,
            })
          }
          placeholder="example@gmail.com or primary"
          className="w-full px-4 py-3 bg-white border border-gray-300 rounded-lg text-gray-900 placeholder-gray-400 focus:border-(--primary) focus:outline-none transition-colors"
        />
        <p className="text-xs text-gray-400 mt-2">
          💡 Usually your email address. Leave empty to use &apos;primary&apos;
          (service account&apos;s calendar).
        </p>
      </div>

      {/* Vacation Days */}
      <div className="bg-gray-50 border border-gray-200 rounded-xl p-6">
        <h3 className="text-xl font-bold text-gray-900 mb-4">Vacation Days</h3>
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-600 mb-2">
            Add Vacation Date
          </label>
          <input
            type="date"
            onChange={(e) => {
              if (e.target.value) {
                addVacation(e.target.value);
                e.target.value = ""; // Reset input
              }
            }}
            className="w-full px-4 py-3 bg-white border border-gray-300 rounded-lg text-gray-900 focus:border-(--primary) focus:outline-none transition-colors"
          />
        </div>
        <div className="space-y-2">
          {settings.vacations.length === 0 ? (
            <p className="text-gray-400 italic">No vacation days set</p>
          ) : (
            settings.vacations.map((date) => (
              <div
                key={date}
                className="flex justify-between items-center bg-white p-3 rounded-lg border border-gray-200"
              >
                <span className="text-gray-900">
                  {new Date(date).toLocaleDateString("en-AU")}
                </span>
                <button
                  onClick={() => removeVacation(date)}
                  className="text-red-600 hover:text-red-700 font-semibold text-sm"
                >
                  Remove
                </button>
              </div>
            ))
          )}
        </div>
      </div>

      <button
        onClick={onSave}
        disabled={saving || !!warning}
        className="w-full bg-(--primary) text-black py-4 rounded-xl font-bold text-lg hover:opacity-90 transition-colors disabled:opacity-50 shadow-md"
      >
        {saving ? "Saving..." : "Save Settings"}
      </button>
    </div>
  );
}
