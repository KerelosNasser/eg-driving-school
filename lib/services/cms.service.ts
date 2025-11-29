import { db } from '@/lib/firebase/client';
import { doc, getDoc, setDoc } from 'firebase/firestore';

export interface SiteContent {
  [key: string]: any;
}

export interface ThemeSettings {
  primaryColor: string;
  secondaryColor: string;
  accentColor: string;
  fontFamily: string;
  [key: string]: any;
}

class CmsService {
  private contentCollection = 'site_content';
  private themeDocId = 'theme_settings';

  /**
   * Get content for a specific section (e.g., 'home', 'header')
   */
  async getSiteContent(section: string): Promise<SiteContent | null> {
    try {
      if (!db) return null;
      const docRef = doc(db, this.contentCollection, section);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        return docSnap.data();
      } else {
        return null;
      }
    } catch (error) {
      console.error(`Error fetching content for section ${section}:`, error);
      return null;
    }
  }

  /**
   * Update content for a specific section
   */
  async updateSiteContent(section: string, data: SiteContent): Promise<void> {
    try {
      if (!db) throw new Error("Firestore is not initialized");
      const docRef = doc(db, this.contentCollection, section);
      await setDoc(docRef, data, { merge: true });
    } catch (error) {
      console.error(`Error updating content for section ${section}:`, error);
      throw error;
    }
  }

  /**
   * Get theme settings
   */
  async getTheme(): Promise<ThemeSettings | null> {
    try {
      if (!db) return null;
      const docRef = doc(db, this.contentCollection, this.themeDocId);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        return docSnap.data() as ThemeSettings;
      } else {
        return null;
      }
    } catch (error) {
      console.error('Error fetching theme settings:', error);
      return null;
    }
  }

  /**
   * Update theme settings
   */
  async updateTheme(settings: Partial<ThemeSettings>): Promise<void> {
    try {
      if (!db) throw new Error("Firestore is not initialized");
      const docRef = doc(db, this.contentCollection, this.themeDocId);
      await setDoc(docRef, settings, { merge: true });
    } catch (error) {
      console.error('Error updating theme settings:', error);
      throw error;
    }
  }
}

export const cmsService = new CmsService();
