export interface Tier {
  id: string;
  name: string;
  rank: number; // Higher rank = better tier
  discountPercentage: number;
  freePackageId?: string; // Optional free package ID granted with this tier
  active: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface InvitationCode {
  id: string;
  code: string;
  tierId: string;
  active: boolean;
  usageCount: number;
  createdAt: string;
  updatedAt: string;
}

export type CreateTierInput = Omit<Tier, 'id' | 'createdAt' | 'updatedAt'>;
export type UpdateTierInput = Partial<CreateTierInput>;

export type CreateInvitationCodeInput = Omit<InvitationCode, 'id' | 'createdAt' | 'updatedAt' | 'usageCount'>;
