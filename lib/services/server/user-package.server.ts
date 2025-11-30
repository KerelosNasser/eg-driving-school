import 'server-only';
import { adminDb } from '@/lib/firebase/admin';
import { FieldValue } from 'firebase-admin/firestore';

export const userPackageServerService = {
  /**
   * Deducts hours from a user's active package.
   * Prioritizes packages with the most remaining hours.
   * If the best package doesn't have enough hours, it deducts all remaining hours from it (best effort).
   */
  /**
   * Deducts hours from a user's active package.
   * If specificPackageId is provided, deducts from that package.
   * Otherwise, prioritizes packages with the most remaining hours.
   */
  async deductPackageHours(userId: string, hoursToDeduct: number, specificPackageId?: string): Promise<void> {
    let targetPackageDoc = null;

    if (specificPackageId) {
        const docRef = adminDb.collection('user_packages').doc(specificPackageId);
        const docSnap = await docRef.get();
        
        if (docSnap.exists) {
            const data = docSnap.data();
            // Verify ownership and status
            if (data && data.userId === userId && data.active && data.remainingHours > 0) {
                 targetPackageDoc = docSnap;
            }
        }
        
        if (!targetPackageDoc) {
             console.warn(`[UserPackageServer] Specific package ${specificPackageId} not found or invalid for user ${userId}. Falling back to auto-selection.`);
        }
    }

    if (!targetPackageDoc) {
        // Auto-selection logic
        const packagesSnapshot = await adminDb.collection('user_packages')
          .where('userId', '==', userId)
          .where('active', '==', true)
          .where('remainingHours', '>', 0)
          .orderBy('remainingHours', 'desc')
          .get();

        if (packagesSnapshot.empty) {
          console.warn(`[UserPackageServer] No active package found for user ${userId} to deduct ${hoursToDeduct} hours.`);
          return;
        }

        // Find first with enough hours
        for (const doc of packagesSnapshot.docs) {
            const data = doc.data();
            if (data.remainingHours >= hoursToDeduct) {
                targetPackageDoc = doc;
                break;
            }
        }

        // Fallback to first available
        if (!targetPackageDoc) {
            targetPackageDoc = packagesSnapshot.docs[0];
        }
    }

    const data = targetPackageDoc.data();
    if (!data) return; // Should not happen

    if (data.remainingHours < hoursToDeduct) {
        console.warn(`[UserPackageServer] Insufficient hours in package ${targetPackageDoc.id}. Required: ${hoursToDeduct}, Available: ${data.remainingHours}. Deducting all.`);
        await targetPackageDoc.ref.update({
            remainingHours: 0,
            updatedAt: new Date().toISOString()
        });
        return;
    }

    // Deduct
    await targetPackageDoc.ref.update({
        remainingHours: FieldValue.increment(-hoursToDeduct),
        updatedAt: new Date().toISOString()
    });
    
    console.log(`[UserPackageServer] Deducted ${hoursToDeduct} hours from package ${targetPackageDoc.id}`);
  }
};
