import { DrivingPackage } from "@/types/package";
import { UserPackage } from "@/types/user-package";

export type WizardStep = "package" | "payment" | "calendar" | "success";

export interface TimeSlot {
  time: string;
  available: boolean;
  originalTime: string;
}

export interface AdminSettings {
  workingHours: { start: string; end: string };
  workingDays: number[];
  vacations: string[];
}

export interface SelectedSlot {
  date: string;
  time: string;
  originalTime: string;
}

export interface WizardContextType {
  // Step management
  currentStep: WizardStep;
  setCurrentStep: (step: WizardStep) => void;
  goToNextStep: () => void;
  goToPreviousStep: () => void;

  // Package state
  availablePackages: DrivingPackage[];
  userPackages: UserPackage[];
  selectedPackage: DrivingPackage | null;
  setSelectedPackage: (pkg: DrivingPackage | null) => void;
  useExistingPackage: boolean;
  setUseExistingPackage: (value: boolean) => void;
  selectedUserPackageId: string;
  setSelectedUserPackageId: (id: string) => void;

  // Payment state
  paymentReference: string;
  setPaymentReference: (ref: string) => void;
  paymentNotes: string;
  setPaymentNotes: (notes: string) => void;

  // Calendar state
  selectedDate: Date | null;
  setSelectedDate: (date: Date | null) => void;
  selectedSlot: SelectedSlot | null;
  setSelectedSlot: (slot: SelectedSlot | null) => void;
  timeSlots: TimeSlot[];
  currentMonth: Date;
  setCurrentMonth: (date: Date) => void;
  adminSettings: AdminSettings | null;

  // Actions
  handlePackageContinue: () => void;
  handlePaymentContinue: () => Promise<void>;
  handleBooking: () => Promise<void>;

  // Loading state
  loading: boolean;
}
