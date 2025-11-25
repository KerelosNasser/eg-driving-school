'use server';

import { adminDb } from '@/lib/firebase/admin';

export interface CalendarSettings {
  workingDays: number[]; // 0-6 (Sunday-Saturday)
  workingHours: {
    start: string; // "09:00"
    end: string;   // "17:00"
  };
  vacations: string[]; // ["2024-12-25", "2024-12-26"]
}

const SETTINGS_COLLECTION = 'settings';
const CALENDAR_DOC = 'calendar';

export async function getAdminSettings(): Promise<{ success: boolean; data?: CalendarSettings; error?: string }> {
  try {
    if (!adminDb) {
      console.error('Firestore is not initialized in getAdminSettings');
      throw new Error('Firestore is not initialized');
    }

    const docRef = adminDb.collection(SETTINGS_COLLECTION).doc(CALENDAR_DOC);
    const doc = await docRef.get();

    if (!doc.exists) {
      console.log('No calendar settings found, returning defaults');
      // Return default settings if none exist
      const defaultSettings: CalendarSettings = {
        workingDays: [1, 2, 3, 4, 5], // Monday-Friday
        workingHours: {
          start: '09:00',
          end: '17:00',
        },
        vacations: [],
      };
      return { success: true, data: defaultSettings };
    }

    return { success: true, data: doc.data() as CalendarSettings };
  } catch (error: any) {
    console.error('Get Admin Settings Error:', error);
    return { success: false, error: error.message };
  }
}

export async function updateAdminSettings(settings: CalendarSettings): Promise<{ success: boolean; error?: string }> {
  try {
    if (!adminDb) {
      throw new Error('Firestore is not initialized');
    }

    const docRef = adminDb.collection(SETTINGS_COLLECTION).doc(CALENDAR_DOC);
    await docRef.set(settings, { merge: true });

    return { success: true };
  } catch (error: any) {
    console.error('Update Admin Settings Error:', error);
    return { success: false, error: error.message };
  }
}
