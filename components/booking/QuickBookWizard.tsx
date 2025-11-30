"use client";

import { useState, useEffect, useCallback } from "react";
import {
  X,
  Loader2,
  Check,
  Package,
  ChevronRight,
  ArrowLeft,
} from "lucide-react";
import { useAuth } from "@/components/providers/AuthProvider";
import { packageService } from "@/lib/services/package-service";
import { userPackageService } from "@/lib/services/user-package-service";
import { paymentService } from "@/lib/services/payment-service";
import { DrivingPackage } from "@/types/package";
import { UserPackage } from "@/types/user-package";
import {
  checkAvailabilityAction,
  bookAppointmentAction,
} from "@/app/actions/calendar.action";
import { getAdminSettings } from "@/app/actions/admin-settings.action";
import { Button } from "@/components/ui/button";

type WizardStep = "package" | "payment" | "calendar" | "success";

interface QuickBookWizardProps {
  isOpen: boolean;
  onClose: () => void;
  preselectedPackageId?: string;
}

interface TimeSlot {
  time: string;
  available: boolean;
  originalTime: string;
}

export default function QuickBookWizard({
  isOpen,
  onClose,
}: QuickBookWizardProps) {
  const { user, profile } = useAuth();

  const [currentStep, setCurrentStep] = useState<WizardStep>("package");
  const [loading, setLoading] = useState(false);

  // Package state
  const [availablePackages, setAvailablePackages] = useState<DrivingPackage[]>(
    []
  );
  const [userPackages, setUserPackages] = useState<UserPackage[]>([]);
  const [selectedPackage, setSelectedPackage] = useState<DrivingPackage | null>(
    null
  );
  const [useExistingPackage, setUseExistingPackage] = useState(false);
  const [selectedUserPackageId, setSelectedUserPackageId] =
    useState<string>("");

  // Payment state
  const [paymentReference, setPaymentReference] = useState("");
  const [paymentNotes, setPaymentNotes] = useState("");

  // Calendar state
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [selectedSlot, setSelectedSlot] = useState<{
    date: string;
    time: string;
    originalTime: string;
  } | null>(null);
  const [timeSlots, setTimeSlots] = useState<TimeSlot[]>([]);
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [adminSettings, setAdminSettings] = useState<{
    workingHours: { start: string; end: string };
    workingDays: number[];
    vacations: string[];
  } | null>(null);

  // Fetch packages on open
  useEffect(() => {
    if (isOpen && user) {
      loadPackageData();
    }
  }, [isOpen, user]);

  const loadPackageData = async () => {
    try {
      setLoading(true);
      const [packages, userPkgs, settingsResult] = await Promise.all([
        packageService.getActivePackages(),
        user
          ? userPackageService.getUserPackages(user.uid)
          : Promise.resolve([]),
        getAdminSettings(),
      ]);
      setAvailablePackages(packages);
      setUserPackages(userPkgs.filter((p) => p.remainingHours > 0));
      if (settingsResult.success && settingsResult.data) {
        setAdminSettings(settingsResult.data);
      }
    } catch (error) {
      console.error("Error loading packages:", error);
    } finally {
      setLoading(false);
    }
  };

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
        originalTime: `${hour.toString().padStart(2, "0")}:00`,
      });
    }
    return slots;
  };

  const loadAvailability = useCallback(
    async (date: Date) => {
      setLoading(true);
      try {
        if (!adminSettings) return;

        const { workingHours, workingDays, vacations } = adminSettings;
        const dayOfWeek = date.getDay();

        if (!workingDays.includes(dayOfWeek)) {
          setTimeSlots([]);
          return;
        }

        const dateStr = date.toISOString().split("T")[0];
        if (vacations.includes(dateStr)) {
          setTimeSlots([]);
          return;
        }

        const slots = generateTimeSlots(workingHours.start, workingHours.end);
        const timeMin = new Date(date);
        timeMin.setHours(0, 0, 0, 0);
        const timeMax = new Date(date);
        timeMax.setHours(23, 59, 59, 999);

        const availabilityResult = await checkAvailabilityAction(
          timeMin.toISOString(),
          timeMax.toISOString()
        );

        if (availabilityResult.success && availabilityResult.data) {
          const busySlots = availabilityResult.data;
          const updatedSlots = slots.map((slot) => {
            const slotStart = new Date(date);
            const [hours, minutes] = slot.originalTime.split(":").map(Number);
            slotStart.setHours(hours, minutes, 0, 0);
            const slotEnd = new Date(slotStart);
            slotEnd.setHours(hours + 1, minutes, 0, 0);

            const isOverlapping = busySlots.some(
              (busy: { start?: string | null; end?: string | null }) => {
                if (!busy.start || !busy.end) return false;
                const busyStart = new Date(busy.start);
                const busyEnd = new Date(busy.end);
                return slotStart < busyEnd && slotEnd > busyStart;
              }
            );

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
    },
    [adminSettings]
  );

  useEffect(() => {
    if (selectedDate && currentStep === "calendar") {
      loadAvailability(selectedDate);
    }
  }, [selectedDate, currentStep, loadAvailability]);

  const handleSelectPackage = (pkg: DrivingPackage) => {
    setSelectedPackage(pkg);
    setUseExistingPackage(false);
  };

  const handlePackageContinue = () => {
    if (useExistingPackage && selectedUserPackageId) {
      setCurrentStep("calendar");
    } else if (!useExistingPackage && selectedPackage) {
      setCurrentStep("payment");
    }
  };

  const handlePaymentContinue = async () => {
    if (!user || !profile || !selectedPackage) return;

    setLoading(true);
    try {
      await paymentService.createPayment({
        userId: user.uid,
        userEmail: profile.email || user.email || "",
        userName: `${profile.firstName} ${profile.lastName || ""}`.trim(),
        amount: selectedPackage.price,
        referenceId: paymentReference,
        packageId: selectedPackage.id,
        packageName: selectedPackage.name,
        notes: paymentNotes || undefined,
      });

      await loadPackageData();
      setCurrentStep("calendar");
    } catch (error) {
      console.error("Payment recording failed:", error);
      alert("Failed to record payment. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleBooking = async () => {
    if (!selectedSlot || !user || !profile) return;

    setLoading(true);
    try {
      const result = await bookAppointmentAction({
        customerName: `${profile.firstName} ${profile.lastName || ""}`.trim(),
        customerEmail: profile.email || user.email || "",
        customerPhone: profile.phoneNumber || "",
        date: selectedSlot.date,
        timeSlots: [selectedSlot.originalTime],
        userPackageId: useExistingPackage ? selectedUserPackageId : undefined,
      });

      if (result.success) {
        setCurrentStep("success");
      } else {
        throw new Error(result.error || "Booking failed");
      }
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : "Unknown error";
      alert(`Booking failed: ${message}`);
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setCurrentStep("package");
    setSelectedPackage(null);
    setUseExistingPackage(false);
    setSelectedUserPackageId("");
    setPaymentReference("");
    setPaymentNotes("");
    setSelectedDate(null);
    setSelectedSlot(null);
    onClose();
  };

  const renderCalendar = () => {
    const year = currentMonth.getFullYear();
    const month = currentMonth.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDayOfWeek = firstDay.getDay();
    const days = [];

    for (let i = 0; i < startingDayOfWeek; i++) {
      days.push(<div key={`empty-${i}`} className="p-2"></div>);
    }

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
          className={`p-2 rounded-lg transition-all text-sm ${
            isSelected
              ? "bg-[var(--primary)] text-black font-bold"
              : isToday
              ? "bg-blue-50 text-blue-600 font-semibold"
              : isPast
              ? "text-gray-300 cursor-not-allowed"
              : "hover:bg-gray-100 text-gray-700"
          }`}
        >
          {day}
        </button>
      );
    }

    return days;
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-end md:items-center justify-center p-0 md:p-4 bg-black/50 backdrop-blur-sm">
      <div className="bg-white border-t md:border border-gray-200 rounded-t-2xl md:rounded-2xl w-full max-w-4xl overflow-hidden shadow-2xl h-[90vh] md:h-auto md:max-h-[85vh] flex flex-col">
        {/* Header */}
        <div className="flex justify-between items-center p-6 border-b border-gray-100">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Quick Book</h2>
            <p className="text-gray-500 text-sm mt-1">
              {currentStep === "package" && "Select your package"}
              {currentStep === "payment" && "Complete payment"}
              {currentStep === "calendar" && "Choose your lesson time"}
              {currentStep === "success" && "Booking confirmed!"}
            </p>
          </div>
          <button
            onClick={handleClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X size={24} />
          </button>
        </div>

        {/* Content */}
        <div className="p-4 md:p-6 overflow-y-auto flex-1">
          {/* Package Selection */}
          {currentStep === "package" && (
            <div className="space-y-6">
              {userPackages.length > 0 && (
                <div className="space-y-3">
                  <h3 className="font-semibold text-gray-900 flex items-center gap-2">
                    <Package size={18} />
                    Use Existing Package
                  </h3>
                  {userPackages.map((pkg) => (
                    <label
                      key={pkg.id}
                      className="flex items-center gap-3 p-4 bg-gray-50 border border-gray-200 rounded-lg hover:border-[var(--primary)] cursor-pointer transition-all"
                    >
                      <input
                        type="radio"
                        name="package-choice"
                        checked={
                          useExistingPackage && selectedUserPackageId === pkg.id
                        }
                        onChange={() => {
                          setUseExistingPackage(true);
                          setSelectedUserPackageId(pkg.id);
                          setSelectedPackage(null);
                        }}
                        className="accent-(--primary)"
                      />
                      <div className="flex-1">
                        <p className="font-medium text-gray-900">
                          {pkg.packageName}
                        </p>
                        <p className="text-sm text-gray-500">
                          {pkg.remainingHours} hours remaining
                        </p>
                      </div>
                    </label>
                  ))}
                </div>
              )}

              <div className="space-y-3">
                <h3 className="font-semibold text-gray-900">Buy New Package</h3>
                {availablePackages.map((pkg) => (
                  <label
                    key={pkg.id}
                    className="flex items-center gap-3 p-4 bg-gray-50 border border-gray-200 rounded-lg hover:border-[var(--primary)] cursor-pointer transition-all"
                  >
                    <input
                      type="radio"
                      name="package-choice"
                      checked={
                        !useExistingPackage && selectedPackage?.id === pkg.id
                      }
                      onChange={() => handleSelectPackage(pkg)}
                      className="accent-(--primary)"
                    />
                    <div className="flex-1">
                      <p className="font-medium text-gray-900">{pkg.name}</p>
                      <p className="text-sm text-gray-500">
                        ${pkg.price} - {pkg.hours} hours
                      </p>
                      {pkg.description && (
                        <p className="text-xs text-gray-400 mt-1">
                          {pkg.description}
                        </p>
                      )}
                    </div>
                  </label>
                ))}
              </div>

              <Button
                onClick={handlePackageContinue}
                disabled={
                  (!useExistingPackage && !selectedPackage) ||
                  (useExistingPackage && !selectedUserPackageId)
                }
                className="w-full py-6 text-lg font-bold"
                size="lg"
              >
                Continue
                <ChevronRight size={18} className="ml-2" />
              </Button>
            </div>
          )}

          {/* Payment Step */}
          {currentStep === "payment" && selectedPackage && (
            <div className="space-y-6">
              <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                <h3 className="font-semibold text-gray-900 mb-2">
                  Payment Details
                </h3>
                <p className="text-gray-500 text-sm">
                  PayID:{" "}
                  <span className="text-gray-900 font-medium">
                    admin@egdrivingschool.com.au
                  </span>
                </p>
                <p className="text-gray-500 text-sm">
                  Reference: Your Name + Package Name
                </p>
                <p className="text-gray-900 mt-2">
                  Total:{" "}
                  <span className="text-[var(--primary)] font-bold">
                    ${selectedPackage.price}
                  </span>
                </p>
              </div>

              <div className="space-y-3">
                <label className="block">
                  <span className="text-gray-700 text-sm">
                    Payment Reference / Receipt No. *
                  </span>
                  <input
                    type="text"
                    value={paymentReference}
                    onChange={(e) => setPaymentReference(e.target.value)}
                    className="w-full mt-1 bg-white border border-gray-300 rounded-lg px-4 py-2 text-gray-900 focus:outline-none focus:border-[var(--primary)]"
                    placeholder="e.g. PayID Ref or Receipt #"
                    required
                  />
                </label>

                <label className="block">
                  <span className="text-gray-700 text-sm">
                    Notes (Optional)
                  </span>
                  <textarea
                    value={paymentNotes}
                    onChange={(e) => setPaymentNotes(e.target.value)}
                    className="w-full mt-1 bg-white border border-gray-300 rounded-lg px-4 py-2 text-gray-900 focus:outline-none focus:border-[var(--primary)] min-h-[80px]"
                    placeholder="Any additional details..."
                  />
                </label>
              </div>

              <div className="flex gap-3">
                <Button
                  variant="ghost"
                  onClick={() => setCurrentStep("package")}
                  className="text-white/60 hover:text-white"
                >
                  <ArrowLeft size={18} className="mr-2" />
                  Back
                </Button>
                <Button
                  onClick={handlePaymentContinue}
                  disabled={!paymentReference || loading}
                  className="flex-1 py-6 text-lg font-bold"
                  size="lg"
                >
                  {loading && (
                    <Loader2 size={18} className="animate-spin mr-2" />
                  )}
                  Continue
                  <ChevronRight size={18} className="ml-2" />
                </Button>
              </div>
            </div>
          )}

          {/* Calendar Step */}
          {currentStep === "calendar" && (
            <div className="space-y-6">
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <div className="flex justify-between items-center mb-4">
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
                      ←
                    </button>
                    <h3 className="font-semibold text-gray-900">
                      {currentMonth.toLocaleDateString("en-AU", {
                        month: "long",
                        year: "numeric",
                      })}
                    </h3>
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
                      →
                    </button>
                  </div>

                  <div className="grid grid-cols-7 gap-2 mb-2">
                    {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map(
                      (day) => (
                        <div
                          key={day}
                          className="text-center text-xs font-semibold text-gray-400 p-2"
                        >
                          {day}
                        </div>
                      )
                    )}
                  </div>

                  <div className="grid grid-cols-7 gap-2">
                    {renderCalendar()}
                  </div>
                </div>

                <div>
                  <h3 className="font-semibold text-gray-900 mb-4">
                    {selectedDate
                      ? `Available Times - ${selectedDate.toLocaleDateString(
                          "en-AU"
                        )}`
                      : "Select a date"}
                  </h3>

                  {loading ? (
                    <div className="text-center py-8 text-gray-500">
                      Loading...
                    </div>
                  ) : selectedDate ? (
                    <div className="space-y-2 max-h-96 overflow-y-auto">
                      {timeSlots.length === 0 ? (
                        <p className="text-gray-400 text-center py-8">
                          No available slots
                        </p>
                      ) : (
                        timeSlots.map((slot) => (
                          <button
                            key={slot.time}
                            onClick={() =>
                              slot.available &&
                              setSelectedSlot({
                                date: selectedDate.toISOString().split("T")[0],
                                time: slot.time,
                                originalTime: slot.originalTime,
                              })
                            }
                            disabled={!slot.available}
                            className={`w-full p-3 rounded-lg transition-all ${
                              selectedSlot?.time === slot.time
                                ? "bg-[var(--primary)] text-black font-semibold"
                                : slot.available
                                ? "bg-gray-50 hover:bg-gray-100 text-gray-900 border border-gray-200"
                                : "bg-gray-50 text-gray-300 cursor-not-allowed border border-gray-100"
                            }`}
                          >
                            {slot.time} {!slot.available && "(Booked)"}
                          </button>
                        ))
                      )}
                    </div>
                  ) : (
                    <p className="text-gray-400 text-center py-8">
                      Please select a date
                    </p>
                  )}
                </div>
              </div>

              <div className="flex gap-3">
                <Button
                  variant="ghost"
                  onClick={() => setCurrentStep("package")}
                  className="text-white/60 hover:text-white"
                >
                  <ArrowLeft size={18} className="mr-2" />
                  Back
                </Button>
                <Button
                  onClick={handleBooking}
                  disabled={!selectedSlot || loading}
                  className="flex-1 py-6 text-lg font-bold"
                  size="lg"
                >
                  {loading && (
                    <Loader2 size={18} className="animate-spin mr-2" />
                  )}
                  Confirm Booking
                </Button>
              </div>
            </div>
          )}

          {/* Success Step */}
          {currentStep === "success" && (
            <div className="text-center space-y-6 py-8">
              <div className="w-20 h-20 bg-(--primary) rounded-full flex items-center justify-center mx-auto">
                <Check size={40} className="text-black" />
              </div>
              <div>
                <h3 className="text-2xl font-bold text-gray-900 mb-2">
                  Booking Confirmed!
                </h3>
                <p className="text-gray-500">
                  Your booking request has been submitted. You&apos;ll receive a
                  confirmation email once approved.
                </p>
              </div>
              <Button
                onClick={handleClose}
                className="px-12 py-6 text-lg font-bold"
                size="lg"
              >
                Done
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
