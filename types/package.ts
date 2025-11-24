export interface DrivingPackage {
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

export type CreatePackageInput = Omit<DrivingPackage, 'id' | 'createdAt' | 'updatedAt'>;
export type UpdatePackageInput = Partial<CreatePackageInput>;
