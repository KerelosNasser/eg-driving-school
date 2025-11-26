"use client";

import React, { useState, useEffect } from "react";
import {
  checkAvailabilityAction,
  bookAppointmentAction,
} from "@/app/actions/calendar.action";
import { getAdminSettings } from "@/app/actions/admin-settings.action";
import BookingModal from "../calendar/BookingModal";

interface TimeSlot {
  time: string;
  available: boolean;
  originalTime: string;
}

export default function CalendarSection() {
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [selectedSlots, setSelectedSlots] = useState<
    Array<{ date: string; time: string; originalTime: string }>
  >([]);
  const [timeSlots, setTimeSlots] = useState<TimeSlot[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [currentMonth, setCurrentMonth] = useState(new Date());

  const generateTimeSlots = (start: string, end: string): TimeSlot[] => {
    const slots: TimeSlot[] = [];
    const [startHour] = start.split(":").map(Number);
    const [endHour] = end.split(":").map(Number);

    for (let hour = startHour; hour < endHour; hour++) {
      const ampm = hour >= 12 ? "PM" : "AM";
      const displayHour = hour % 12 || 12;
      slots.push({
        time: `${displayHour}:00 ${ampm}`,
        available: true,
        originalTime: `${hour.toString().padStart(2, "0")}:00`, // Keep 24h for logic
      });
    }

    return slots;
  };

  const loadAvailability = React.useCallback(async (date: Date) => {
    setLoading(true);
    try {
      // Get admin settings
      const settingsResult = await getAdminSettings();
      if (!settingsResult.success || !settingsResult.data) {
        console.error("Failed to load settings");
        return;
      }

      const { workingHours, workingDays, vacations } = settingsResult.data;

      // Check if date is a working day
      const dayOfWeek = date.getDay();
      if (!workingDays.includes(dayOfWeek)) {
        setTimeSlots([]);
        return;
      }

      // Check if date is a vacation day
      const dateStr = date.toISOString().split("T")[0];
      if (vacations.includes(dateStr)) {
        setTimeSlots([]);
        return;
      }

      // Generate time slots based on working hours
      const slots = generateTimeSlots(workingHours.start, workingHours.end);

      // Check Google Calendar availability
      const timeMin = new Date(date);
      timeMin.setHours(0, 0, 0, 0);
      const timeMax = new Date(date);
      timeMax.setHours(23, 59, 59, 999);

      const availabilityResult = await checkAvailabilityAction(
        "primary",
        timeMin.toISOString(),
        timeMax.toISOString()
      );

      if (availabilityResult.success && availabilityResult.data) {
        // Mark slots as unavailable if they overlap with busy times
        const busySlots = availabilityResult.data;
        const updatedSlots = slots.map((slot) => {
          const slotStart = new Date(date);
          const [hours, minutes] = slot.originalTime.split(":").map(Number);
          slotStart.setHours(hours, minutes, 0, 0);
          const slotEnd = new Date(slotStart);
          slotEnd.setHours(hours + 1, minutes, 0, 0);

          const isOverlapping = busySlots.some((busy: any) => {
            const busyStart = new Date(busy.start);
            const busyEnd = new Date(busy.end);
            return slotStart < busyEnd && slotEnd > busyStart;
          });

          return { ...slot, available: !isOverlapping };
        });

        setTimeSlots(updatedSlots);
      } else {
        setTimeSlots(slots);
      }
    } catch (error) {
      console.error("Error loading availability:", error);
    } finally {
      setLoading(false);
    }
  }, []);

  // Fetch admin settings and availability when date changes
  useEffect(() => {
    if (selectedDate) {
      loadAvailability(selectedDate);
    }
  }, [selectedDate, loadAvailability]);

  const toggleSlotSelection = (time: string) => {
    if (!selectedDate) return;

    const dateStr = selectedDate.toISOString().split("T")[0];
    const slot = timeSlots.find((s) => s.time === time);
    if (!slot) return;

    const slotKey = {
      date: dateStr,
      time: slot.time,
      originalTime: slot.originalTime,
    };

    setSelectedSlots((prev) => {
      const exists = prev.some(
        (s) => s.date === dateStr && s.originalTime === slot.originalTime
      );
      if (exists) {
        return prev.filter(
          (s) => !(s.date === dateStr && s.originalTime === slot.originalTime)
        );
      } else {
        return [...prev, slotKey];
      }
    });
  };

  const handleBooking = async (customerData: any) => {
    if (selectedSlots.length === 0) return;

    // Group slots by date
    const slotsByDate = selectedSlots.reduce((acc, slot) => {
      if (!acc[slot.date]) acc[slot.date] = [];
      acc[slot.date].push(slot.originalTime);
      return acc;
    }, {} as Record<string, string[]>);

    try {
      // Book each date separately
      for (const [date, times] of Object.entries(slotsByDate)) {
        const result = await bookAppointmentAction({
          ...customerData,
          date,
          timeSlots: times,
        });

        if (!result.success) {
          throw new Error(result.error || "Booking failed");
        }
      }

      alert("Booking successful! Check your email for confirmation.");
      setSelectedSlots([]);
      setIsModalOpen(false);
      if (selectedDate) {
        loadAvailability(selectedDate);
      }
    } catch (error: any) {
      alert(`Booking failed: ${error.message}`);
    }
  };

  // Calendar rendering helpers
  const getDaysInMonth = (date: Date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDayOfWeek = firstDay.getDay();

    return { daysInMonth, startingDayOfWeek };
  };

  const renderCalendar = () => {
    const { daysInMonth, startingDayOfWeek } = getDaysInMonth(currentMonth);
    const days = [];

    // Empty cells for days before month starts
    for (let i = 0; i < startingDayOfWeek; i++) {
      days.push(<div key={`empty-${i}`} className="p-2"></div>);
    }

    // Actual days
    for (let day = 1; day <= daysInMonth; day++) {
      const date = new Date(
        currentMonth.getFullYear(),
        currentMonth.getMonth(),
        day
      );
      const isToday = date.toDateString() === new Date().toDateString();
      const isSelected = selectedDate?.toDateString() === date.toDateString();
      const isPast = date < new Date() && !isToday;

      days.push(
        <button
          key={day}
          onClick={() => !isPast && setSelectedDate(date)}
          disabled={isPast}
          className={`p-2 rounded-lg transition-all ${
            isSelected
              ? "bg-blue-600 text-white font-bold"
              : isToday
              ? "bg-blue-100 text-blue-600 font-semibold"
              : isPast
              ? "text-gray-300 cursor-not-allowed"
              : "hover:bg-gray-100"
          }`}
        >
          {day}
        </button>
      );
    }

    return days;
  };

  return (
    <section
      id="calendar"
      className="py-16 bg-gradient-to-b from-white to-gray-50"
    >
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            Book Your Driving Lesson
          </h2>
          <p className="text-lg text-gray-600">
            Select a date and choose your preferred time slots
          </p>
        </div>

        <div className="max-w-5xl mx-auto grid md:grid-cols-2 gap-8">
          {/* Calendar */}
          <div className="bg-white rounded-xl shadow-lg p-6">
            <div className="flex justify-between items-center mb-6">
              <button
                onClick={() =>
                  setCurrentMonth(
                    new Date(currentMonth.setMonth(currentMonth.getMonth() - 1))
                  )
                }
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                ←
              </button>
              <h3 className="text-xl font-bold">
                {currentMonth.toLocaleDateString("en-AU", {
                  month: "long",
                  year: "numeric",
                })}
              </h3>
              <button
                onClick={() =>
                  setCurrentMonth(
                    new Date(currentMonth.setMonth(currentMonth.getMonth() + 1))
                  )
                }
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                →
              </button>
            </div>

            <div className="grid grid-cols-7 gap-2 mb-2">
              {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
                <div
                  key={day}
                  className="text-center text-sm font-semibold text-gray-600 p-2"
                >
                  {day}
                </div>
              ))}
            </div>

            <div className="grid grid-cols-7 gap-2">{renderCalendar()}</div>
          </div>

          {/* Time Slots */}
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h3 className="text-xl font-bold mb-4">
              {selectedDate
                ? `Available Times - ${selectedDate.toLocaleDateString(
                    "en-AU"
                  )}`
                : "Select a date"}
            </h3>

            {loading ? (
              <div className="text-center py-8">Loading...</div>
            ) : selectedDate ? (
              <div className="space-y-2 max-h-96 overflow-y-auto">
                {timeSlots.length === 0 ? (
                  <p className="text-gray-500 text-center py-8">
                    No available slots for this day
                  </p>
                ) : (
                  timeSlots.map((slot) => {
                    const isSelected = selectedSlots.some(
                      (s) =>
                        s.date === selectedDate.toISOString().split("T")[0] &&
                        s.originalTime === slot.originalTime
                    );
                    return (
                      <button
                        key={slot.time}
                        onClick={() =>
                          slot.available && toggleSlotSelection(slot.time)
                        }
                        disabled={!slot.available}
                        className={`w-full p-3 rounded-lg transition-all ${
                          isSelected
                            ? "bg-blue-600 text-white font-semibold"
                            : slot.available
                            ? "bg-gray-100 hover:bg-gray-200"
                            : "bg-gray-50 text-gray-400 cursor-not-allowed"
                        }`}
                      >
                        {slot.time} {!slot.available && "(Booked)"}
                      </button>
                    );
                  })
                )}
              </div>
            ) : (
              <p className="text-gray-500 text-center py-8">
                Please select a date to view available times
              </p>
            )}

            {selectedSlots.length > 0 && (
              <button
                onClick={() => setIsModalOpen(true)}
                className="w-full mt-6 bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors shadow-lg"
              >
                Book {selectedSlots.length} Slot
                {selectedSlots.length > 1 ? "s" : ""}
              </button>
            )}
          </div>
        </div>
      </div>

      <BookingModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        selectedSlots={selectedSlots}
        onConfirm={handleBooking}
      />
    </section>
  );
}
