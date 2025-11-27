"use client";

import React, { useState, useEffect } from "react";
import {
  getAdminSettings,
  updateAdminSettings,
  CalendarSettings,
} from "@/app/actions/admin-settings.action";
import { useAdmin } from "@/components/admin/AdminProvider";
import { Calendar as CalendarIcon } from "lucide-react";
import Link from "next/link";

export default function CalendarTab() {
  const { isAdmin } = useAdmin();
  const [settings, setSettings] = useState<CalendarSettings | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [currentWeek, setCurrentWeek] = useState(new Date());
  const [warning, setWarning] = useState<string | null>(null);

  useEffect(() => {
    const loadSettings = async () => {
      const result = await getAdminSettings();
      if (result.success && result.data) {
        setSettings(result.data);
        if (result.warning) {
          setWarning(result.warning);
        }
      }
      setLoading(false);
    };

    loadSettings();
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

  const toggleWorkingDay = (day: number) => {
    if (!settings) return;
    const workingDays = settings.workingDays.includes(day)
      ? settings.workingDays.filter((d) => d !== day)
      : [...settings.workingDays, day].sort((a, b) => a - b);
    setSettings({ ...settings, workingDays });
  };

  const addVacation = (date: string) => {
    if (!settings) return;
    if (!settings.vacations.includes(date)) {
      setSettings({
        ...settings,
        vacations: [...settings.vacations, date].sort(),
      });
    }
  };

  const removeVacation = (date: string) => {
    if (!settings) return;
    setSettings({
      ...settings,
      vacations: settings.vacations.filter((d) => d !== date),
    });
  };

  const getWeekDays = () => {
    const week = [];
    const start = new Date(currentWeek);
    start.setDate(start.getDate() - start.getDay()); // Start from Sunday

    for (let i = 0; i < 7; i++) {
      const date = new Date(start);
      date.setDate(start.getDate() + i);
      week.push(date);
    }

    return week;
  };

  if (loading) {
    return (
      <div className="text-center py-12">
        <p className="text-lg text-white/60">Loading calendar settings...</p>
      </div>
    );
  }

  if (!settings) {
    return (
      <div className="text-center py-12">
        <p className="text-lg text-red-400">
          Failed to load calendar settings.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="flex items-center gap-4 mb-6">
        <div className="w-12 h-12 rounded-xl bg-(--primary) flex items-center justify-center text-black">
          <CalendarIcon size={24} />
        </div>
        <div>
          <h2 className="text-2xl font-bold text-white">Calendar Management</h2>
          <p className="text-white/60">Manage working hours and availability</p>
        </div>
      </div>

      {warning && (
        <div className="bg-yellow-500/10 border border-yellow-500/20 rounded-xl p-4 mb-6">
          <div className="flex items-center gap-3">
            <div className="w-2 h-2 rounded-full bg-yellow-500 animate-pulse" />
            <p className="text-yellow-200 font-medium">
              Read-Only Mode: {warning}
            </p>
          </div>
        </div>
      )}

      {isAdmin ? (
        // Admin View
        <div className="space-y-8">
          {/* Working Days */}
          <div className="bg-white/5 border border-white/10 rounded-xl p-6">
            <h3 className="text-xl font-bold text-white mb-4">Working Days</h3>
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
                      : "bg-white/10 text-white/60 hover:bg-white/20"
                  }`}
                >
                  {day}
                </button>
              ))}
            </div>
          </div>

          {/* Working Hours */}
          <div className="bg-white/5 border border-white/10 rounded-xl p-6">
            <h3 className="text-xl font-bold text-white mb-4">Working Hours</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-white/60 mb-2">
                  Start Time
                </label>
                <input
                  type="time"
                  value={settings.workingHours.start}
                  onChange={(e) =>
                    setSettings({
                      ...settings,
                      workingHours: {
                        ...settings.workingHours,
                        start: e.target.value,
                      },
                    })
                  }
                  className="w-full px-4 py-3 bg-black/40 border border-white/10 rounded-lg text-white focus:border-(--primary) focus:outline-none transition-colors"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-white/60 mb-2">
                  End Time
                </label>
                <input
                  type="time"
                  value={settings.workingHours.end}
                  onChange={(e) =>
                    setSettings({
                      ...settings,
                      workingHours: {
                        ...settings.workingHours,
                        end: e.target.value,
                      },
                    })
                  }
                  className="w-full px-4 py-3 bg-black/40 border border-white/10 rounded-lg text-white focus:border-(--primary) focus:outline-none transition-colors"
                />
              </div>
            </div>
          </div>

          {/* Google Calendar ID */}
          <div className="bg-white/5 border border-white/10 rounded-xl p-6">
            <h3 className="text-xl font-bold text-white mb-2">
              Google Calendar ID
            </h3>
            <p className="text-sm text-white/60 mb-4">
              Enter your Google Calendar ID to sync events and manage
              availability.
              <br />
              <span className="text-xs">
                Find it in Google Calendar → Settings → Your calendar →
                Integrate calendar → Calendar ID
              </span>
            </p>
            <input
              type="text"
              value={settings.calendarId || ""}
              onChange={(e) =>
                setSettings({
                  ...settings,
                  calendarId: e.target.value,
                })
              }
              placeholder="example@gmail.com or primary"
              className="w-full px-4 py-3 bg-black/40 border border-white/10 rounded-lg text-white placeholder-white/30 focus:border-(--primary) focus:outline-none transition-colors"
            />
            <p className="text-xs text-white/40 mt-2">
              💡 Usually your email address. Leave empty to use 'primary'
              (service account's calendar).
            </p>
          </div>

          {/* Vacation Days */}
          <div className="bg-white/5 border border-white/10 rounded-xl p-6">
            <h3 className="text-xl font-bold text-white mb-4">Vacation Days</h3>
            <div className="mb-6">
              <label className="block text-sm font-medium text-white/60 mb-2">
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
                className="w-full px-4 py-3 bg-black/40 border border-white/10 rounded-lg text-white focus:border-(--primary) focus:outline-none transition-colors"
              />
            </div>
            <div className="space-y-2">
              {settings.vacations.length === 0 ? (
                <p className="text-white/40 italic">No vacation days set</p>
              ) : (
                settings.vacations.map((date) => (
                  <div
                    key={date}
                    className="flex justify-between items-center bg-white/5 p-3 rounded-lg border border-white/5"
                  >
                    <span className="text-white">
                      {new Date(date).toLocaleDateString("en-AU")}
                    </span>
                    <button
                      onClick={() => removeVacation(date)}
                      className="text-red-400 hover:text-red-300 font-semibold text-sm"
                    >
                      Remove
                    </button>
                  </div>
                ))
              )}
            </div>
          </div>

          <button
            onClick={handleSaveSettings}
            disabled={saving}
            className="w-full bg-(--primary) text-black py-4 rounded-xl font-bold text-lg hover:bg-white transition-colors disabled:opacity-50 shadow-[0_0_20px_rgba(255,214,0,0.2)]"
          >
            {saving ? "Saving..." : "Save Settings"}
          </button>
        </div>
      ) : (
        // User View - Weekly Calendar
        <div className="bg-white/5 border border-white/10 rounded-xl p-6">
          <div className="flex justify-between items-center mb-6">
            <button
              onClick={() => {
                const newWeek = new Date(currentWeek);
                newWeek.setDate(newWeek.getDate() - 7);
                setCurrentWeek(newWeek);
              }}
              className="px-4 py-2 bg-white/10 rounded-lg hover:bg-white/20 text-white transition-colors"
            >
              ← Previous
            </button>
            <h2 className="text-xl font-bold text-white">
              Week of {getWeekDays()[0].toLocaleDateString("en-AU")}
            </h2>
            <button
              onClick={() => {
                const newWeek = new Date(currentWeek);
                newWeek.setDate(newWeek.getDate() + 7);
                setCurrentWeek(newWeek);
              }}
              className="px-4 py-2 bg-white/10 rounded-lg hover:bg-white/20 text-white transition-colors"
            >
              Next →
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-7 gap-4">
            {getWeekDays().map((date, idx) => {
              const isWorkingDay = settings.workingDays.includes(date.getDay());
              const dateStr = date.toISOString().split("T")[0];
              const isVacation = settings.vacations.includes(dateStr);

              return (
                <div
                  key={idx}
                  className="border border-white/10 rounded-lg p-4 bg-black/20"
                >
                  <div className="text-center mb-2">
                    <div className="font-semibold text-sm text-[var(--primary)]">
                      {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"][idx]}
                    </div>
                    <div className="text-lg font-bold text-white">
                      {date.getDate()}
                    </div>
                  </div>
                  {isVacation ? (
                    <div className="text-center text-sm text-red-400 font-semibold">
                      Closed
                    </div>
                  ) : isWorkingDay ? (
                    <div className="text-center text-sm text-green-400 font-semibold">
                      {settings.workingHours.start} -{" "}
                      {settings.workingHours.end}
                    </div>
                  ) : (
                    <div className="text-center text-sm text-white/40">
                      Closed
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          <div className="mt-8 text-center">
            <p className="text-white/60 mb-4">
              To book a lesson, visit our home page calendar.
            </p>
            <Link
              href="/#calendar"
              className="inline-block bg-[var(--primary)] text-black px-8 py-3 rounded-xl font-bold hover:bg-white transition-colors"
            >
              Book Now
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}
