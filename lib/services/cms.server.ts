import { adminDb as db } from '@/lib/firebase/admin';
import 'server-only';

export interface SiteContent {
  [key: string]: unknown;
}

export interface ThemeSettings {
  primaryColor: string;
  secondaryColor: string;
  accentColor: string;
  fontFamily: string;
  [key: string]: unknown;
}

class CmsServerService {
  private contentCollection = 'site_content';
  private themeDocId = 'theme_settings';

  /**
   * Get content for a specific section (Server-side)
   */
  async getSiteContent(section: string): Promise<SiteContent | null> {
    try {
      const docRef = db.collection(this.contentCollection).doc(section);
      const docSnap = await docRef.get();

      if (docSnap.exists) {
        return docSnap.data() as SiteContent;
      } else {
        return null;
      }
    } catch (error) {
      console.error(`Error fetching content for section ${section}:`, error);
      return null;
    }
  }

  /**
   * Get theme settings (Server-side)
   */
  async getTheme(): Promise<ThemeSettings | null> {
    try {
      const docRef = db.collection(this.contentCollection).doc(this.themeDocId);
      const docSnap = await docRef.get();

      if (docSnap.exists) {
        return docSnap.data() as ThemeSettings;
      } else {
        return null;
      }
    } catch (error) {
      console.error('Error fetching theme settings:', error);
      return null;
    }
  }
}

export const cmsServerService = new CmsServerService();
