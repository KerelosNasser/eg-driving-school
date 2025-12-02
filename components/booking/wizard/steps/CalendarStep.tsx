"use client";

import React from "react";
import { ArrowLeft, ChevronLeft, ChevronRight } from "lucide-react";
import { useWizard } from "../WizardContext";
import { Button } from "@/components/ui/button";
import { WizardButton } from "../ui/WizardButton";

export const CalendarStep: React.FC = () => {
  const {
    selectedDate,
    setSelectedDate,
    selectedSlot,
    setSelectedSlot,
    timeSlots,
    currentMonth,
    setCurrentMonth,
    setCurrentStep,
    handleBooking,
    loading,
  } = useWizard();

  const renderCalendar = () => {
    const year = currentMonth.getFullYear();
    const month = currentMonth.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDayOfWeek = firstDay.getDay();
    const days = [];

    // Empty cells for days before month starts
    for (let i = 0; i < startingDayOfWeek; i++) {
      days.push(<div key={`empty-${i}`} className="p-2" />);
    }

    // Calendar days
    for (let day = 1; day <= daysInMonth; day++) {
      const date = new Date(year, month, day);
      const isToday = date.toDateString() === new Date().toDateString();
      const isSelected = selectedDate?.toDateString() === date.toDateString();
      const isPast = date < new Date() && !isToday;

      days.push(
        <button
          key={day}
          onClick={() => !isPast && setSelectedDate(date)}
          disabled={isPast}
          className={`
            relative p-3 rounded-xl transition-all duration-200 text-sm font-medium
            ${
              isSelected
                ? "bg-(--primary) text-black font-bold shadow-lg scale-110 z-10"
                : isToday
                ? "bg-blue-50 text-blue-600 font-semibold ring-2 ring-blue-400 ring-opacity-50"
                : isPast
                ? "text-gray-300 cursor-not-allowed"
                : "hover:bg-gray-100 text-gray-700 hover:scale-105 hover:shadow-md"
            }
            ${!isPast && !isSelected ? "hover:ring-2 hover:ring-gray-200" : ""}
          `}
        >
          {day}
          {isToday && !isSelected && (
            <div className="absolute bottom-1 left-1/2 -translate-x-1/2 w-1 h-1 bg-blue-600 rounded-full animate-pulse" />
          )}
        </button>
      );
    }

    return days;
  };

  const previousMonth = () => {
    const newMonth = new Date(currentMonth);
    newMonth.setMonth(newMonth.getMonth() - 1);
    setCurrentMonth(newMonth);
  };

  const nextMonth = () => {
    const newMonth = new Date(currentMonth);
    newMonth.setMonth(newMonth.getMonth() + 1);
    setCurrentMonth(newMonth);
  };

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-500">
      <div className="grid md:grid-cols-2 gap-6">
        {/* Calendar */}
        <div className="bg-linear-to-br from-white to-gray-50 border-2 border-gray-200 rounded-2xl p-5 shadow-sm">
          <div className="flex justify-between items-center mb-5">
            <button
              onClick={previousMonth}
              className="p-2.5 hover:bg-gray-100 rounded-xl text-gray-600 transition-all duration-200 hover:scale-110 active:scale-95"
            >
              <ChevronLeft size={20} />
            </button>
            <h3 className="font-bold text-gray-900 text-lg">
              {currentMonth.toLocaleDateString("en-AU", {
                month: "long",
                year: "numeric",
              })}
            </h3>
            <button
              onClick={nextMonth}
              className="p-2.5 hover:bg-gray-100 rounded-xl text-gray-600 transition-all duration-200 hover:scale-110 active:scale-95"
            >
              <ChevronRight size={20} />
            </button>
          </div>

          {/* Day headers */}
          <div className="grid grid-cols-7 gap-2 mb-3">
            {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
              <div
                key={day}
                className="text-center text-xs font-bold text-gray-400 uppercase tracking-wider p-2"
              >
                {day}
              </div>
            ))}
          </div>

          {/* Calendar grid */}
          <div className="grid grid-cols-7 gap-2">{renderCalendar()}</div>
        </div>

        {/* Time Slots */}
        <div className="bg-linear-to-br from-white to-gray-50 border-2 border-gray-200 rounded-2xl p-5 shadow-sm">
          <h3 className="font-bold text-gray-900 mb-4 text-lg">
            {selectedDate ? `Available Times` : "Select a date"}
          </h3>
          {selectedDate && (
            <p className="text-sm text-gray-500 mb-4">
              {selectedDate.toLocaleDateString("en-AU", {
                weekday: "long",
                month: "long",
                day: "numeric",
              })}
            </p>
          )}

          {loading ? (
            <div className="space-y-2">
              {[1, 2, 3, 4].map((i) => (
                <div
                  key={i}
                  className="h-12 bg-gray-200 rounded-lg animate-pulse"
                />
              ))}
            </div>
          ) : selectedDate ? (
            <div className="space-y-2 max-h-80 overflow-y-auto pr-1 custom-scrollbar">
              {timeSlots.length === 0 ? (
                <div className="text-center py-12">
                  <p className="text-gray-400 text-sm">
                    No available slots for this date
                  </p>
                </div>
              ) : (
                timeSlots.map((slot, index) => (
                  <button
                    key={slot.time}
                    style={{ animationDelay: `${index * 30}ms` }}
                    onClick={() =>
                      slot.available &&
                      setSelectedSlot({
                        date: selectedDate.toISOString().split("T")[0],
                        time: slot.time,
                        originalTime: slot.originalTime,
                      })
                    }
                    disabled={!slot.available}
                    className={`
                      w-full p-3.5 rounded-xl transition-all duration-200 font-medium text-sm
                      animate-in fade-in slide-in-from-right-2
                      ${
                        selectedSlot?.time === slot.time
                          ? "bg-(--primary) text-black font-bold shadow-lg scale-105 ring-2 ring-(--primary) ring-offset-2"
                          : slot.available
                          ? "bg-white hover:bg-gray-50 text-gray-900 border-2 border-gray-200 hover:border-(--primary) hover:scale-102 hover:shadow-md"
                          : "bg-gray-100 text-gray-400 cursor-not-allowed border-2 border-gray-100"
                      }
                    `}
                  >
                    <span className="flex items-center justify-between">
                      <span>{slot.time}</span>
                      {!slot.available && (
                        <span className="text-xs">(Booked)</span>
                      )}
                    </span>
                  </button>
                ))
              )}
            </div>
          ) : (
            <div className="text-center py-12">
              <p className="text-gray-400 text-sm">
                Please select a date to view available times
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex gap-3 pt-2">
        <Button
          variant="ghost"
          onClick={() => setCurrentStep("package")}
          className="px-6 hover:bg-gray-100"
        >
          <ArrowLeft size={18} className="mr-2" />
          Back
        </Button>
        <WizardButton
          onClick={handleBooking}
          disabled={!selectedSlot || loading}
          loading={loading}
          className="flex-1 py-6 text-lg"
          size="lg"
        >
          Confirm Booking
        </WizardButton>
      </div>
    </div>
  );
};
