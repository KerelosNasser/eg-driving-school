"use client";

import React, { useState, useEffect, useCallback } from "react";
import {
  getAdminSettings,
  updateAdminSettings,
  CalendarSettings,
} from "@/app/actions/admin-settings.action";
import { useAdmin } from "@/components/admin/AdminProvider";
import { useAuth } from "@/components/providers/AuthProvider";
import {
  Calendar as CalendarIcon,
  Clock,
  ChevronLeft,
  ChevronRight,
  Star,
} from "lucide-react";
import { checkAvailabilityAction } from "@/app/actions/calendar.action";
import { userPackageService } from "@/lib/services/user-package-service";
import { UserPackage } from "@/types/user-package";

import { LoadingIndicator } from "@/components/ui/loading-indicator";

export default function CalendarTab() {
  const { isAdmin } = useAdmin();
  const { user } = useAuth();

  // Admin State
  const [settings, setSettings] = useState<CalendarSettings | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [warning, setWarning] = useState<string | null>(null);

  // User View State
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [timeSlots, setTimeSlots] = useState<
    { time: string; available: boolean; originalTime: string }[]
  >([]);
  const [slotLoading, setSlotLoading] = useState(false);
  const [recommendedSlots, setRecommendedSlots] = useState<
    { date: Date; time: string }[]
  >([]);

  // Load Settings & User Data
  useEffect(() => {
    const loadData = async () => {
      try {
        const result = await getAdminSettings();
        if (result.success && result.data) {
          setSettings(result.data);
          if (result.warning) {
            setWarning(result.warning);
          }

          // If user, generate recommendations based on settings
          if (!isAdmin && user) {
            generateRecommendations(result.data);
          }
        }
      } catch (error) {
        console.error("Failed to load data:", error);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [isAdmin, user]);

  // Generate Recommendations for User
  const generateRecommendations = async (adminSettings: CalendarSettings) => {
    const recommendations: { date: Date; time: string }[] = [];
    const today = new Date();
    const nextWeek = new Date(today);
    nextWeek.setDate(today.getDate() + 7);

    // Simple heuristic: Check next 3 available days, morning slots
    for (let d = new Date(today); d <= nextWeek; d.setDate(d.getDate() + 1)) {
      if (recommendations.length >= 3) break;

      const dayOfWeek = d.getDay();
      if (!adminSettings.workingDays.includes(dayOfWeek)) continue;

      const dateStr = d.toISOString().split("T")[0];
      if (adminSettings.vacations.includes(dateStr)) continue;

      // Check availability for this day
      const timeMin = new Date(d);
      timeMin.setHours(0, 0, 0, 0);
      const timeMax = new Date(d);
      timeMax.setHours(23, 59, 59, 999);

      try {
        const result = await checkAvailabilityAction(
          timeMin.toISOString(),
          timeMax.toISOString()
        );
        if (result.success && result.data) {
          const [startHour] = adminSettings.workingHours.start
            .split(":")
            .map(Number);
          const [endHour] = adminSettings.workingHours.end
            .split(":")
            .map(Number);

          for (let h = startHour; h < endHour; h++) {
            const slotTime = new Date(d);
            slotTime.setHours(h, 0, 0, 0);

            // Check if busy
            const isBusy = result.data.some((busy: any) => {
              const busyStart = new Date(busy.start);
              const busyEnd = new Date(busy.end);
              const slotEnd = new Date(slotTime);
              slotEnd.setHours(h + 1);
              return slotTime < busyEnd && slotEnd > busyStart;
            });

            if (!isBusy && slotTime > new Date()) {
              recommendations.push({
                date: new Date(d),
                time: `${h % 12 || 12}:00 ${h >= 12 ? "PM" : "AM"}`,
              });
              if (recommendations.length >= 3) break;
            }
          }
        }
      } catch (e) {
        console.error(e);
      }
    }
    setRecommendedSlots(recommendations);
  };

  // Load Slots for Selected Date
  const loadSlots = async (date: Date) => {
    if (!settings) return;
    setSlotLoading(true);
    try {
      const dayOfWeek = date.getDay();
      if (!settings.workingDays.includes(dayOfWeek)) {
        setTimeSlots([]);
        return;
      }

      const dateStr = date.toISOString().split("T")[0];
      if (settings.vacations.includes(dateStr)) {
        setTimeSlots([]);
        return;
      }

      const timeMin = new Date(date);
      timeMin.setHours(0, 0, 0, 0);
      const timeMax = new Date(date);
      timeMax.setHours(23, 59, 59, 999);

      const result = await checkAvailabilityAction(
        timeMin.toISOString(),
        timeMax.toISOString()
      );

      const [startHour] = settings.workingHours.start.split(":").map(Number);
      const [endHour] = settings.workingHours.end.split(":").map(Number);
      const slots = [];

      for (let h = startHour; h < endHour; h++) {
        const displayHour = h % 12 || 12;
        const ampm = h >= 12 ? "PM" : "AM";
        const timeStr = `${displayHour}:00 ${ampm}`;
        const originalTime = `${h.toString().padStart(2, "0")}:00`;

        let available = true;
        if (result.success && result.data) {
          const slotStart = new Date(date);
          slotStart.setHours(h, 0, 0, 0);
          const slotEnd = new Date(slotStart);
          slotEnd.setHours(h + 1);

          available = !result.data.some((busy: any) => {
            const busyStart = new Date(busy.start);
            const busyEnd = new Date(busy.end);
            return slotStart < busyEnd && slotEnd > busyStart;
          });
        }

        // Also check if in past
        const slotDate = new Date(date);
        slotDate.setHours(h, 0, 0, 0);
        if (slotDate < new Date()) available = false;

        slots.push({ time: timeStr, available, originalTime });
      }
      setTimeSlots(slots);
    } catch (error) {
      console.error(error);
    } finally {
      setSlotLoading(false);
    }
  };

  useEffect(() => {
    if (selectedDate) {
      loadSlots(selectedDate);
    }
  }, [selectedDate]);

  // Admin Functions
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
        <p className="text-lg text-red-400">
          Failed to load calendar settings.
        </p>
      </div>
    );
  }

  // --- USER VIEW ---
  if (!isAdmin) {
    return (
      <div className="space-y-8">
        <div className="flex items-center gap-4 mb-8">
          <div className="w-12 h-12 rounded-full bg-(--primary)/20 flex items-center justify-center text-(--primary)">
            <CalendarIcon size={24} />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Book a Lesson</h2>
            <p className="text-gray-500">
              Select a date and time for your next driving lesson
            </p>
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
            {/* Calendar Component */}
            <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-lg font-bold text-gray-900">
                  {currentMonth.toLocaleDateString("en-AU", {
                    month: "long",
                    year: "numeric",
                  })}
                </h3>
                <div className="flex gap-2">
                  <button
                    onClick={() =>
                      setCurrentMonth(
                        new Date(
                          currentMonth.setMonth(currentMonth.getMonth() - 1)
                        )
                      )
                    }
                    className="p-2 hover:bg-gray-100 rounded-lg text-gray-600"
                  >
                    <ChevronLeft size={20} />
                  </button>
                  <button
                    onClick={() =>
                      setCurrentMonth(
                        new Date(
                          currentMonth.setMonth(currentMonth.getMonth() + 1)
                        )
                      )
                    }
                    className="p-2 hover:bg-gray-100 rounded-lg text-gray-600"
                  >
                    <ChevronRight size={20} />
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-7 gap-2 mb-2">
                {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map(
                  (day) => (
                    <div
                      key={day}
                      className="text-center text-xs font-semibold text-gray-400 py-2"
                    >
                      {day}
                    </div>
                  )
                )}
              </div>

              <div className="grid grid-cols-7 gap-2">
                {(() => {
                  const year = currentMonth.getFullYear();
                  const month = currentMonth.getMonth();
                  const firstDay = new Date(year, month, 1);
                  const lastDay = new Date(year, month + 1, 0);
                  const days = [];

                  for (let i = 0; i < firstDay.getDay(); i++) {
                    days.push(<div key={`empty-${i}`} />);
                  }

                  for (let d = 1; d <= lastDay.getDate(); d++) {
                    const date = new Date(year, month, d);
                    const isToday =
                      date.toDateString() === new Date().toDateString();
                    const isSelected =
                      selectedDate?.toDateString() === date.toDateString();
                    const isPast = date < new Date() && !isToday;

                    days.push(
                      <button
                        key={d}
                        onClick={() => !isPast && setSelectedDate(date)}
                        disabled={isPast}
                        className={`
                          aspect-square rounded-xl flex items-center justify-center text-sm font-medium transition-all
                          ${
                            isSelected
                              ? "bg-(--primary) text-black shadow-md scale-105"
                              : isToday
                              ? "bg-blue-50 text-blue-600 ring-1 ring-blue-200"
                              : isPast
                              ? "text-gray-300 cursor-not-allowed"
                              : "hover:bg-gray-50 text-gray-700 hover:scale-105"
                          }
                        `}
                      >
                        {d}
                      </button>
                    );
                  }
                  return days;
                })()}
              </div>
            </div>

            {/* Smart Suggestions */}
            {recommendedSlots.length > 0 && (
              <div className="bg-linear-to-r from-yellow-50 to-white border border-yellow-200 rounded-2xl p-6">
                <div className="flex items-center gap-2 mb-4">
                  <Star className="text-yellow-500 fill-yellow-500" size={20} />
                  <h3 className="font-bold text-gray-900">Recommended Times</h3>
                </div>
                <div className="grid sm:grid-cols-3 gap-4">
                  {recommendedSlots.map((slot, idx) => (
                    <button
                      key={idx}
                      onClick={() => {
                        setCurrentMonth(slot.date);
                        setSelectedDate(slot.date);
                      }}
                      className="flex flex-col items-center p-3 bg-white border border-yellow-100 rounded-xl hover:border-yellow-300 hover:shadow-md transition-all group"
                    >
                      <span className="text-xs text-gray-500 font-medium uppercase tracking-wider">
                        {slot.date.toLocaleDateString("en-AU", {
                          weekday: "short",
                          day: "numeric",
                        })}
                      </span>
                      <span className="text-lg font-bold text-gray-900 group-hover:text-yellow-600">
                        {slot.time}
                      </span>
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Time Slots Panel */}
          <div className="bg-gray-50 border border-gray-200 rounded-2xl p-6 h-fit">
            <h3 className="font-bold text-gray-900 mb-4">
              {selectedDate
                ? selectedDate.toLocaleDateString("en-AU", {
                    weekday: "long",
                    month: "long",
                    day: "numeric",
                  })
                : "Select a date"}
            </h3>

            {selectedDate ? (
              slotLoading ? (
                <div className="py-12 flex justify-center">
                  <LoadingIndicator
                    fullscreen={false}
                    size="sm"
                    background="transparent"
                  />
                </div>
              ) : timeSlots.length > 0 ? (
                <div className="grid grid-cols-2 gap-3">
                  {timeSlots.map((slot, idx) => (
                    <button
                      key={idx}
                      disabled={!slot.available}
                      className={`
                        py-2 px-3 rounded-lg text-sm font-medium transition-all
                        ${
                          slot.available
                            ? "bg-white border border-gray-200 text-gray-900 hover:border-(--primary) hover:shadow-sm"
                            : "bg-gray-100 text-gray-400 cursor-not-allowed"
                        }
                      `}
                    >
                      {slot.time}
                    </button>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 text-gray-500">
                  No available slots for this date.
                </div>
              )
            ) : (
              <div className="text-center py-12 text-gray-400">
                <CalendarIcon className="mx-auto mb-2 opacity-20" size={48} />
                <p>Choose a date from the calendar to view available times</p>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }

  // --- ADMIN VIEW ---
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
            <p className="text-yellow-200 font-medium">
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
                setSettings({
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
                setSettings({
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
            setSettings({
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
        className="w-full bg-(--primary) text-black py-4 rounded-xl font-bold text-lg hover:opacity-90 transition-colors disabled:opacity-50 shadow-md"
      >
        {saving ? "Saving..." : "Save Settings"}
      </button>
    </div>
  );
}
