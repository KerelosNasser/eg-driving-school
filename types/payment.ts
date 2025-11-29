export type PaymentStatus = "pending" | "approved" | "rejected";

export interface Payment {
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

export interface CreatePaymentInput {
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
