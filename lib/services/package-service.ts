import { 
  collection, 
  doc, 
  getDocs, 
  getDoc, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  query, 
  where
} from 'firebase/firestore';
import { db } from '@/lib/firebase/client';
import { DrivingPackage, CreatePackageInput, UpdatePackageInput } from '@/types/package';

const PACKAGES_COLLECTION = 'packages';

export const packageService = {
  // Get all packages (for admin)
  async getAllPackages(): Promise<DrivingPackage[]> {
    if (!db) return [];
    
    try {
      const packagesRef = collection(db, PACKAGES_COLLECTION);
      const q = query(packagesRef);
      const snapshot = await getDocs(q);
      
      const packages = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      } as DrivingPackage));

      return packages.sort((a, b) => a.price - b.price);
    } catch (error) {
      console.error('Error fetching packages:', error);
      throw error;
    }
  },

  // Get active packages (for public price list)
  async getActivePackages(): Promise<DrivingPackage[]> {
    if (!db) return [];
    
    try {
      const packagesRef = collection(db, PACKAGES_COLLECTION);
      const q = query(
        packagesRef, 
        where('active', '==', true)
      );
      const snapshot = await getDocs(q);
      
      const packages = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      } as DrivingPackage));

      // Sort in memory to avoid needing a composite index
      return packages.sort((a, b) => a.price - b.price);
    } catch (error) {
      console.error('Error fetching active packages:', error);
      throw error;
    }
  },

  // Get single package
  async getPackage(id: string): Promise<DrivingPackage | null> {
    if (!db) return null;
    
    try {
      const docRef = doc(db, PACKAGES_COLLECTION, id);
      const docSnap = await getDoc(docRef);
      
      if (docSnap.exists()) {
        return { id: docSnap.id, ...docSnap.data() } as DrivingPackage;
      }
      return null;
    } catch (error) {
      console.error('Error fetching package:', error);
      throw error;
    }
  },

  // Create package
  async createPackage(data: CreatePackageInput): Promise<string> {
    if (!db) throw new Error('Database not initialized');
    
    try {
      const now = new Date().toISOString();
      const docRef = await addDoc(collection(db, PACKAGES_COLLECTION), {
        ...data,
        createdAt: now,
        updatedAt: now
      });
      return docRef.id;
    } catch (error) {
      console.error('Error creating package:', error);
      throw error;
    }
  },

  // Update package
  async updatePackage(id: string, data: UpdatePackageInput): Promise<void> {
    if (!db) throw new Error('Database not initialized');
    
    try {
      const docRef = doc(db, PACKAGES_COLLECTION, id);
      await updateDoc(docRef, {
        ...data,
        updatedAt: new Date().toISOString()
      });
    } catch (error) {
      console.error('Error updating package:', error);
      throw error;
    }
  },

  // Delete package
  async deletePackage(id: string): Promise<void> {
    if (!db) throw new Error('Database not initialized');
    
    try {
      const docRef = doc(db, PACKAGES_COLLECTION, id);
      await deleteDoc(docRef);
    } catch (error) {
      console.error('Error deleting package:', error);
      throw error;
    }
  }
};
