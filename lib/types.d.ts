import { User, RecaptchaVerifier } from "firebase/auth";

declare global {
  // --- From types/user.ts ---
  interface UserProfile {
    uid: string;
    email: string | null;
    firstName: string | null;
    lastName: string | null;
    displayName: string | null;
    phoneNumber: string | null;
    photoURL: string | null;
    invitationCode: string;
    role: "user" | "admin";
    createdAt: string;
    updatedAt: string;
  }

  // --- From types/user-package.ts ---
  interface UserPackage {
    id: string;
    userId: string;
    packageId: string;
    packageName: string;
    totalHours: number;
    remainingHours: number;
    active: boolean;
    createdAt: string;
    updatedAt: string;
  }

  type CreateUserPackageInput = Omit<
    UserPackage,
    "id" | "createdAt" | "updatedAt"
  >;

  // --- From types/tier.ts ---
  interface Tier {
    id: string;
    name: string;
    rank: number; // Higher rank = better tier
    discountPercentage: number;
    freePackageId?: string; // Optional free package ID granted with this tier
    active: boolean;
    createdAt: string;
    updatedAt: string;
  }

  interface InvitationCode {
    id: string;
    code: string;
    tierId: string;
    active: boolean;
    usageCount: number;
    createdAt: string;
    updatedAt: string;
  }

  type CreateTierInput = Omit<Tier, "id" | "createdAt" | "updatedAt">;
  type UpdateTierInput = Partial<CreateTierInput>;
  type CreateInvitationCodeInput = Omit<
    InvitationCode,
    "id" | "createdAt" | "updatedAt" | "usageCount"
  >;

  // --- From types/payment.ts ---
  type PaymentStatus = "pending" | "approved" | "rejected";

  interface Payment {
    id: string;
    userId: string;
    userEmail: string;
    userName: string;
    amount: number;
    referenceId: string; // e.g., PayID reference or receipt number
    packageId?: string;
    packageName?: string;
    invitationCode?: string;
    originalAmount?: number;
    discountApplied?: number;
    status: PaymentStatus;
    notes?: string;
    createdAt: string;
    updatedAt: string;
  }

  interface CreatePaymentInput {
    userId: string;
    userEmail: string;
    userName: string;
    amount: number;
    referenceId: string;
    packageId?: string;
    packageName?: string;
    invitationCode?: string;
    originalAmount?: number;
    discountApplied?: number;
    notes?: string;
  }

  // --- From types/package.ts ---
  interface DrivingPackage {
    id: string;
    name: string;
    price: number;
    hours: number;
    description?: string;
    warning?: string;
    isTestPackage: boolean;
    active: boolean;
    createdAt: string;
    updatedAt: string;
  }

  type CreatePackageInput = Omit<
    DrivingPackage,
    "id" | "createdAt" | "updatedAt"
  >;
  type UpdatePackageInput = Partial<CreatePackageInput>;

  // --- From app/actions/admin-settings.action.ts ---
  interface CalendarSettings {
    workingDays: number[]; // 0-6 (Sunday-Saturday)
    workingHours: {
      start: string; // "09:00"
      end: string; // "17:00"
    };
    vacations: string[]; // ["2024-12-25", "2024-12-26"]
    calendarId?: string; // Google Calendar ID
  }

  // --- From components/booking/wizard/types.ts ---
  type WizardStep = "package" | "payment" | "calendar" | "success";

  interface TimeSlot {
    time: string;
    available: boolean;
    originalTime: string;
  }

  // Merging AdminSettings with CalendarSettings or keeping separate alias
  // Since they are almost identical, we'll use CalendarSettings as the source of truth
  // and make AdminSettings an alias or interface that matches it.
  type AdminSettings = CalendarSettings;

  interface SelectedSlot {
    date: string; // ISO string format often used in wizard
    time: string;
    originalTime: string;
  }

  interface WizardContextType {
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

  // --- Component Props & Local Types ---

  // From components/booking/wizard/WizardContext.tsx
  interface WizardProviderProps {
    children: React.ReactNode;
    onSuccess?: () => void;
  }

  // From components/auth/EnhancedAuthForm.tsx
  interface EnhancedAuthFormProps {
    onComplete?: (data: {
      user: User; // Requires firebase/auth import
      phoneNumber: string;
      additionalPhone?: string;
      healthNote?: string;
      address?: string;
    }) => void;
    className?: string;
  }

  // From lib/services/user.service.ts
  interface UserData {
    uid: string;
    email: string;
    displayName: string;
    phoneNumber?: string;
    role?: string;
    createdAt: string;
    lastSignInTime: string;
  }

  // From components/profile/calendar/UserCalendarView.tsx
  interface UserCalendarViewProps {
    settings: CalendarSettings;
    userId: string;
  }

  interface RecommendedSlot {
    date: Date;
    time: string;
  }

  // From components/auth/EnhancedAuthForm.tsx
  interface Window {
    recaptchaVerifier: RecaptchaVerifier | undefined;
  }
}
