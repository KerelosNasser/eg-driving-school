"use client";

import React, { useState, useEffect } from "react";
import {
  Calendar as CalendarIcon,
  ChevronLeft,
  ChevronRight,
  Star,
} from "lucide-react";
import { CalendarSettings } from "@/app/actions/admin-settings.action";
import { checkAvailabilityAction } from "@/app/actions/calendar.action";
import { LoadingIndicator } from "@/components/ui/loading-indicator";

interface UserCalendarViewProps {
  settings: CalendarSettings;
  userId: string;
}

interface TimeSlot {
  time: string;
  available: boolean;
  originalTime: string;
}

interface RecommendedSlot {
  date: Date;
  time: string;
}

export function UserCalendarView({ settings, userId }: UserCalendarViewProps) {
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [timeSlots, setTimeSlots] = useState<TimeSlot[]>([]);
  const [slotLoading, setSlotLoading] = useState(false);
  const [recommendedSlots, setRecommendedSlots] = useState<RecommendedSlot[]>(
    []
  );

  // Generate Recommendations
  useEffect(() => {
    const generateRecommendations = async () => {
      const recommendations: RecommendedSlot[] = [];
      const today = new Date();
      const nextWeek = new Date(today);
      nextWeek.setDate(today.getDate() + 7);

      for (let d = new Date(today); d <= nextWeek; d.setDate(d.getDate() + 1)) {
        if (recommendations.length >= 3) break;

        const dayOfWeek = d.getDay();
        if (!settings.workingDays.includes(dayOfWeek)) continue;

        const dateStr = d.toISOString().split("T")[0];
        if (settings.vacations.includes(dateStr)) continue;

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
            const [startHour] = settings.workingHours.start
              .split(":")
              .map(Number);
            const [endHour] = settings.workingHours.end.split(":").map(Number);

            for (let h = startHour; h < endHour; h++) {
              const slotTime = new Date(d);
              slotTime.setHours(h, 0, 0, 0);

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

    generateRecommendations();
  }, [settings, userId]);

  // Load Slots for Selected Date
  useEffect(() => {
    const loadSlots = async () => {
      if (!selectedDate) return;

      setSlotLoading(true);
      try {
        const dayOfWeek = selectedDate.getDay();
        if (!settings.workingDays.includes(dayOfWeek)) {
          setTimeSlots([]);
          return;
        }

        const dateStr = selectedDate.toISOString().split("T")[0];
        if (settings.vacations.includes(dateStr)) {
          setTimeSlots([]);
          return;
        }

        const timeMin = new Date(selectedDate);
        timeMin.setHours(0, 0, 0, 0);
        const timeMax = new Date(selectedDate);
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
            const slotStart = new Date(selectedDate);
            slotStart.setHours(h, 0, 0, 0);
            const slotEnd = new Date(slotStart);
            slotEnd.setHours(h + 1);

            available = !result.data.some((busy: any) => {
              const busyStart = new Date(busy.start);
              const busyEnd = new Date(busy.end);
              return slotStart < busyEnd && slotEnd > busyStart;
            });
          }

          // Check if in past
          const slotDate = new Date(selectedDate);
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

    loadSlots();
  }, [selectedDate, settings]);

  const renderCalendar = () => {
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
      const isToday = date.toDateString() === new Date().toDateString();
      const isSelected = selectedDate?.toDateString() === date.toDateString();
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
  };

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
              {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
                <div
                  key={day}
                  className="text-center text-xs font-semibold text-gray-400 py-2"
                >
                  {day}
                </div>
              ))}
            </div>

            <div className="grid grid-cols-7 gap-2">{renderCalendar()}</div>
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
