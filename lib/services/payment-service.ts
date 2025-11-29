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
import { Payment, CreatePaymentInput, PaymentStatus } from '@/types/payment';

const PAYMENTS_COLLECTION = 'payments';

export const paymentService = {
  // Create a new payment record
  async createPayment(data: CreatePaymentInput): Promise<string> {
    if (!db) throw new Error('Database not initialized');
    
    try {
      const now = new Date().toISOString();
      const docRef = await addDoc(collection(db, PAYMENTS_COLLECTION), {
        ...data,
        status: 'pending',
        createdAt: now,
        updatedAt: now
      });
      return docRef.id;
    } catch (error) {
      console.error('Error creating payment:', error);
      throw error;
    }
  },

  // Get payments for a specific user
  async getUserPayments(userId: string): Promise<Payment[]> {
    if (!db) return [];
    
    try {
      const paymentsRef = collection(db, PAYMENTS_COLLECTION);
      const q = query(
        paymentsRef, 
        where('userId', '==', userId)
      );
      const snapshot = await getDocs(q);
      
      const payments = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      } as Payment));

      // Sort in memory by date desc
      return payments.sort((a, b) => 
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      );
    } catch (error) {
      console.error('Error fetching user payments:', error);
      throw error;
    }
  },

  // Get all payments (for admin)
  async getAllPayments(): Promise<Payment[]> {
    if (!db) return [];
    
    try {
      const paymentsRef = collection(db, PAYMENTS_COLLECTION);
      const q = query(paymentsRef);
      const snapshot = await getDocs(q);
      
      const payments = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      } as Payment));

      // Sort in memory by date desc
      return payments.sort((a, b) => 
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      );
    } catch (error) {
      console.error('Error fetching all payments:', error);
      throw error;
    }
  },

  // Update payment status
  async updatePaymentStatus(id: string, status: PaymentStatus, notes?: string): Promise<void> {
    if (!db) throw new Error('Database not initialized');
    
    try {
      const docRef = doc(db, PAYMENTS_COLLECTION, id);
      const paymentSnap = await getDoc(docRef);
      
      if (!paymentSnap.exists()) {
        throw new Error('Payment not found');
      }

      const paymentData = paymentSnap.data() as Payment;

      // If approving, grant package and increment code usage
      if (status === 'approved' && paymentData.status !== 'approved') {
        if (paymentData.packageId) {
          // Import here to avoid circular dependencies if any, or just use the service
          const { packageService } = await import('./package-service');
          const { userPackageService } = await import('./user-package-service');
          
          const pkg = await packageService.getPackage(paymentData.packageId);
          
          if (pkg) {
            await userPackageService.grantPackage({
              userId: paymentData.userId,
              packageId: pkg.id,
              packageName: pkg.name,
              totalHours: pkg.hours,
              remainingHours: pkg.hours,
              active: true
            });
          }
        }

        if (paymentData.invitationCode) {
          const { tierService } = await import('./tier-service');
          // We need the code ID, but we only stored the code string. 
          // Let's find the code ID first.
          // Actually, tierService.validateCode returns codeId. 
          // But here we just want to increment usage. 
          // Let's add a method to tierService to increment by code string or just find it here.
          // Better: Let's assume we can find it.
          // For now, let's just query for it.
          const codes = await tierService.getAllCodes();
          const code = codes.find(c => c.code === paymentData.invitationCode);
          if (code) {
            await tierService.incrementCodeUsage(code.id);
          }
        }
      }

      const updateData: Record<string, any> = {
        status,
        updatedAt: new Date().toISOString()
      };
      
      if (notes) {
        updateData.notes = notes;
      }

      await updateDoc(docRef, updateData);
    } catch (error) {
      console.error('Error updating payment status:', error);
      throw error;
    }
  }
};

