export interface UserProfile {
  uid: string;
  email: string | null;
  firstName: string | null;
  lastName: string | null;
  displayName: string | null;
  phoneNumber: string | null;
  photoURL: string | null;
  invitationCode: string;
  role: 'user' | 'admin';
  createdAt: string;
  updatedAt: string;
}
