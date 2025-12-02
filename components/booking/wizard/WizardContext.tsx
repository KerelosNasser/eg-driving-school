"use client";

import React, { createContext, useContext, useState, useCallback } from "react";
import { useAuth } from "@/components/providers/AuthProvider";
import { packageService } from "@/lib/services/package-service";
import { userPackageService } from "@/lib/services/user-package-service";
import { paymentService } from "@/lib/services/payment-service";
import {
  checkAvailabilityAction,
  bookAppointmentAction,
} from "@/app/actions/calendar.action";
import { getAdminSettings } from "@/app/actions/admin-settings.action";
import { DrivingPackage } from "@/types/package";
import {
  WizardStep,
  WizardContextType,
  TimeSlot,
  AdminSettings,
  SelectedSlot,
} from "./types";
import { UserPackage } from "@/types/user-package";

const WizardContext = createContext<WizardContextType | null>(null);

export const useWizard = () => {
  const context = useContext(WizardContext);
  if (!context) {
    throw new Error("useWizard must be used within WizardProvider");
  }
  return context;
};

interface WizardProviderProps {
  children: React.ReactNode;
  onSuccess?: () => void;
}

// Simple in-memory cache
let cachedData: {
  packages: DrivingPackage[] | null;
  settings: AdminSettings | null;
  timestamp: number;
} = { packages: null, settings: null, timestamp: 0 };

const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

export const WizardProvider: React.FC<WizardProviderProps> = ({
  children,
  onSuccess,
}) => {
  const { user, profile } = useAuth();

  // Step management
  const [currentStep, setCurrentStep] = useState<WizardStep>("package");
  // Start loading immediately to show skeleton
  const [loading, setLoading] = useState(true);

  // Package state
  const [availablePackages, setAvailablePackages] = useState<DrivingPackage[]>(
    cachedData.packages || []
  );
  const [userPackages, setUserPackages] = useState<UserPackage[]>([]);
  const [selectedPackage, setSelectedPackage] = useState<DrivingPackage | null>(
    null
  );
  const [useExistingPackage, setUseExistingPackage] = useState(false);
  const [selectedUserPackageId, setSelectedUserPackageId] = useState("");

  // Payment state
  const [paymentReference, setPaymentReference] = useState("");
  const [paymentNotes, setPaymentNotes] = useState("");

  // Calendar state
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [selectedSlot, setSelectedSlot] = useState<SelectedSlot | null>(null);
  const [timeSlots, setTimeSlots] = useState<TimeSlot[]>([]);
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [adminSettings, setAdminSettings] = useState<AdminSettings | null>(
    cachedData.settings
  );

  // Load package data
  const loadPackageData = useCallback(async () => {
    if (!user) return;

    try {
      setLoading(true);

      // Use cache if valid
      const now = Date.now();
      const isCacheValid =
        cachedData.packages &&
        cachedData.settings &&
        now - cachedData.timestamp < CACHE_DURATION;

      if (isCacheValid) {
        setAvailablePackages(cachedData.packages!);
        setAdminSettings(cachedData.settings);
        // Only fetch user packages if cache is valid for others
        const userPkgs = await userPackageService.getUserPackages(user.uid);
        setUserPackages(userPkgs.filter((p) => p.remainingHours > 0));
        setLoading(false);
        return;
      }

      const [packages, userPkgs, settingsResult] = await Promise.all([
        packageService.getActivePackages(),
        userPackageService.getUserPackages(user.uid),
        getAdminSettings(),
      ]);

      setAvailablePackages(packages);
      setUserPackages(userPkgs.filter((p) => p.remainingHours > 0));

      if (settingsResult.success && settingsResult.data) {
        setAdminSettings(settingsResult.data);

        // Update cache
        cachedData = {
          packages,
          settings: settingsResult.data,
          timestamp: Date.now(),
        };
      }
    } catch (error) {
      console.error("Error loading packages:", error);
    } finally {
      setLoading(false);
    }
  }, [user]);

  // Generate time slots
  const generateTimeSlots = useCallback(
    (start: string, end: string): TimeSlot[] => {
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
    },
    []
  );

  // Load availability
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
    [adminSettings, generateTimeSlots]
  );

  // Actions
  const handlePackageContinue = useCallback(() => {
    if (useExistingPackage && selectedUserPackageId) {
      setCurrentStep("calendar");
    } else if (!useExistingPackage && selectedPackage) {
      setCurrentStep("payment");
    }
  }, [useExistingPackage, selectedUserPackageId, selectedPackage]);

  const handlePaymentContinue = useCallback(async () => {
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
  }, [
    user,
    profile,
    selectedPackage,
    paymentReference,
    paymentNotes,
    loadPackageData,
  ]);

  const handleBooking = useCallback(async () => {
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
        onSuccess?.();
      } else {
        throw new Error(result.error || "Booking failed");
      }
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : "Unknown error";
      alert(`Booking failed: ${message}`);
    } finally {
      setLoading(false);
    }
  }, [
    selectedSlot,
    user,
    profile,
    useExistingPackage,
    selectedUserPackageId,
    onSuccess,
  ]);

  const goToNextStep = useCallback(() => {
    const steps: WizardStep[] = ["package", "payment", "calendar", "success"];
    const currentIndex = steps.indexOf(currentStep);
    if (currentIndex < steps.length - 1) {
      setCurrentStep(steps[currentIndex + 1]);
    }
  }, [currentStep]);

  const goToPreviousStep = useCallback(() => {
    const steps: WizardStep[] = ["package", "payment", "calendar", "success"];
    const currentIndex = steps.indexOf(currentStep);
    if (currentIndex > 0) {
      setCurrentStep(steps[currentIndex - 1]);
    }
  }, [currentStep]);

  // Load data when date changes
  React.useEffect(() => {
    if (selectedDate && currentStep === "calendar") {
      loadAvailability(selectedDate);
    }
  }, [selectedDate, currentStep, loadAvailability]);

  // Load packages on mount
  React.useEffect(() => {
    loadPackageData();
  }, [loadPackageData]);

  const value: WizardContextType = {
    currentStep,
    setCurrentStep,
    goToNextStep,
    goToPreviousStep,
    availablePackages,
    userPackages,
    selectedPackage,
    setSelectedPackage,
    useExistingPackage,
    setUseExistingPackage,
    selectedUserPackageId,
    setSelectedUserPackageId,
    paymentReference,
    setPaymentReference,
    paymentNotes,
    setPaymentNotes,
    selectedDate,
    setSelectedDate,
    selectedSlot,
    setSelectedSlot,
    timeSlots,
    currentMonth,
    setCurrentMonth,
    adminSettings,
    handlePackageContinue,
    handlePaymentContinue,
    handleBooking,
    loading,
  };

  return (
    <WizardContext.Provider value={value}>{children}</WizardContext.Provider>
  );
};
