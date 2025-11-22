import { adminDb as db } from '../firebase/admin';
import { WhereFilterOp } from 'firebase-admin/firestore';
import 'server-only';

export class FirestoreService {
  /**
   * Get all documents from a collection
   */
  async getCollection<T>(collectionPath: string): Promise<T[]> {
    const snapshot = await db.collection(collectionPath).get();
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as T));
  }

  /**
   * Get a single document by ID
   */
  async getDocument<T>(collectionPath: string, docId: string): Promise<T | null> {
    const doc = await db.collection(collectionPath).doc(docId).get();
    if (!doc.exists) return null;
    return { id: doc.id, ...doc.data() } as T;
  }

  /**
   * Add a new document (auto-generated ID)
   */
  async addDocument<T extends object>(collectionPath: string, data: T) {
    const docRef = await db.collection(collectionPath).add({
      ...data,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    });
    return docRef.id;
  }

  /**
   * Set/Create a document with a specific ID
   */
  async setDocument<T extends object>(collectionPath: string, docId: string, data: T) {
    await db.collection(collectionPath).doc(docId).set({
      ...data,
      updatedAt: new Date().toISOString(),
    }, { merge: true });
    return docId;
  }

  /**
   * Update a document
   */
  async updateDocument<T extends object>(collectionPath: string, docId: string, data: Partial<T>) {
    await db.collection(collectionPath).doc(docId).update({
      ...data,
      updatedAt: new Date().toISOString(),
    });
  }

  /**
   * Delete a document
   */
  async deleteDocument(collectionPath: string, docId: string) {
    await db.collection(collectionPath).doc(docId).delete();
  }

  /**
   * Query a collection
   */
  async query<T>(
    collectionPath: string, 
    field: string, 
    operator: WhereFilterOp, 
    value: string | number | boolean | null
  ): Promise<T[]> {
    const snapshot = await db.collection(collectionPath).where(field, operator, value).get();
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as T));
  }
}

export const firestoreService = new FirestoreService();
