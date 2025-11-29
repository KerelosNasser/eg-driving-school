import { 
  collection, 
  doc, 
  getDocs, 
  addDoc, 
  updateDoc, 
  deleteDoc,
  query, 
  where,
  getDoc
} from 'firebase/firestore';
import { db } from '@/lib/firebase/client';
import { Tier, CreateTierInput, UpdateTierInput, InvitationCode, CreateInvitationCodeInput } from '@/types/tier';

const TIERS_COLLECTION = 'tiers';
const CODES_COLLECTION = 'invitation_codes';

export const tierService = {
  // --- Tiers ---

  async getAllTiers(): Promise<Tier[]> {
    if (!db) return [];
    
    try {
      const tiersRef = collection(db, TIERS_COLLECTION);
      const snapshot = await getDocs(tiersRef);
      
      const tiers = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      } as Tier));

      // Sort by rank desc (higher rank first)
      return tiers.sort((a, b) => b.rank - a.rank);
    } catch (error) {
      console.error('Error fetching tiers:', error);
      throw error;
    }
  },

  async createTier(data: CreateTierInput): Promise<string> {
    if (!db) throw new Error('Database not initialized');
    
    try {
      const now = new Date().toISOString();
      const docRef = await addDoc(collection(db, TIERS_COLLECTION), {
        ...data,
        createdAt: now,
        updatedAt: now
      });
      return docRef.id;
    } catch (error) {
      console.error('Error creating tier:', error);
      throw error;
    }
  },

  async updateTier(id: string, data: UpdateTierInput): Promise<void> {
    if (!db) throw new Error('Database not initialized');
    
    try {
      const docRef = doc(db, TIERS_COLLECTION, id);
      await updateDoc(docRef, {
        ...data,
        updatedAt: new Date().toISOString()
      });
    } catch (error) {
      console.error('Error updating tier:', error);
      throw error;
    }
  },

  async deleteTier(id: string): Promise<void> {
    if (!db) throw new Error('Database not initialized');
    
    try {
      await deleteDoc(doc(db, TIERS_COLLECTION, id));
    } catch (error) {
      console.error('Error deleting tier:', error);
      throw error;
    }
  },

  // --- Invitation Codes ---

  async getAllCodes(): Promise<InvitationCode[]> {
    if (!db) return [];
    
    try {
      const codesRef = collection(db, CODES_COLLECTION);
      const snapshot = await getDocs(codesRef);
      
      return snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      } as InvitationCode));
    } catch (error) {
      console.error('Error fetching codes:', error);
      throw error;
    }
  },

  async createCode(data: CreateInvitationCodeInput): Promise<string> {
    if (!db) throw new Error('Database not initialized');
    
    try {
      // Check if code already exists
      const codesRef = collection(db, CODES_COLLECTION);
      const q = query(codesRef, where('code', '==', data.code));
      const snapshot = await getDocs(q);
      
      if (!snapshot.empty) {
        throw new Error('Code already exists');
      }

      const now = new Date().toISOString();
      const docRef = await addDoc(collection(db, CODES_COLLECTION), {
        ...data,
        usageCount: 0,
        createdAt: now,
        updatedAt: now
      });
      return docRef.id;
    } catch (error) {
      console.error('Error creating code:', error);
      throw error;
    }
  },

  async validateCode(code: string): Promise<{ isValid: boolean; tier?: Tier; codeId?: string }> {
    if (!db) return { isValid: false };
    
    try {
      const codesRef = collection(db, CODES_COLLECTION);
      const q = query(codesRef, where('code', '==', code), where('active', '==', true));
      const snapshot = await getDocs(q);
      
      if (snapshot.empty) {
        return { isValid: false };
      }

      const codeDoc = snapshot.docs[0];
      const codeData = codeDoc.data() as InvitationCode;
      
      // Fetch associated tier
      const tierDoc = await getDoc(doc(db, TIERS_COLLECTION, codeData.tierId));
      
      if (!tierDoc.exists()) {
        return { isValid: false };
      }

      const tierData = tierDoc.data() as Tier;

      if (!tierData.active) {
        return { isValid: false };
      }

      return { 
        isValid: true, 
        tier: { id: tierDoc.id, ...tierData },
        codeId: codeDoc.id
      };
    } catch (error) {
      console.error('Error validating code:', error);
      return { isValid: false };
    }
  },

  async incrementCodeUsage(codeId: string): Promise<void> {
    if (!db) throw new Error('Database not initialized');
    
    try {
      const docRef = doc(db, CODES_COLLECTION, codeId);
      const docSnap = await getDoc(docRef);
      
      if (docSnap.exists()) {
        const currentUsage = docSnap.data().usageCount || 0;
        await updateDoc(docRef, {
          usageCount: currentUsage + 1,
          updatedAt: new Date().toISOString()
        });
      }
    } catch (error) {
      console.error('Error incrementing code usage:', error);
      throw error;
    }
  }
};
