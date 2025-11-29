import { 
  collection, 
  doc, 
  getDocs, 
  addDoc, 
  updateDoc, 
  query, 
  where,
  getDoc
} from 'firebase/firestore';
import { db } from '@/lib/firebase/client';
import { UserPackage, CreateUserPackageInput } from '@/types/user-package';

const USER_PACKAGES_COLLECTION = 'user_packages';

export const userPackageService = {
  async getUserPackages(userId: string): Promise<UserPackage[]> {
    if (!db) return [];
    
    try {
      const q = query(
        collection(db, USER_PACKAGES_COLLECTION), 
        where('userId', '==', userId),
        where('active', '==', true)
      );
      const snapshot = await getDocs(q);
      
      return snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      } as UserPackage));
    } catch (error) {
      console.error('Error fetching user packages:', error);
      throw error;
    }
  },

  async grantPackage(data: CreateUserPackageInput): Promise<string> {
    if (!db) throw new Error('Database not initialized');
    
    try {
      const now = new Date().toISOString();
      const docRef = await addDoc(collection(db, USER_PACKAGES_COLLECTION), {
        ...data,
        active: true,
        createdAt: now,
        updatedAt: now
      });
      return docRef.id;
    } catch (error) {
      console.error('Error granting package:', error);
      throw error;
    }
  },

  async deductHours(userPackageId: string, hours: number): Promise<void> {
    if (!db) throw new Error('Database not initialized');
    
    try {
      const docRef = doc(db, USER_PACKAGES_COLLECTION, userPackageId);
      const docSnap = await getDoc(docRef);
      
      if (!docSnap.exists()) {
        throw new Error('User package not found');
      }

      const currentData = docSnap.data() as UserPackage;
      const newRemaining = currentData.remainingHours - hours;

      if (newRemaining < 0) {
        throw new Error('Insufficient hours in package');
      }

      await updateDoc(docRef, {
        remainingHours: newRemaining,
        active: newRemaining > 0, // Deactivate if 0 hours left? Or keep active but empty? Let's keep active for history unless explicit deactivation. Actually, usually 0 hours means consumed. Let's keep it active but 0 hours for now, or maybe 'active' means 'usable'. Let's stick to just updating hours.
        updatedAt: new Date().toISOString()
      });
    } catch (error) {
      console.error('Error deducting hours:', error);
      throw error;
    }
  }
};
