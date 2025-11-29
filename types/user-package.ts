export interface UserPackage {
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

export type CreateUserPackageInput = Omit<UserPackage, 'id' | 'createdAt' | 'updatedAt'>;
