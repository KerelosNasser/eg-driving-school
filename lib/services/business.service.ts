import { google } from 'googleapis';
import { getGoogleAuth } from '../google/auth';
import 'server-only';

export class BusinessService {
  private get businessInfo() {
    return google.mybusinessbusinessinformation({ version: 'v1', auth: getGoogleAuth() });
  }

  // Note: Reviews are often handled via a separate API endpoint or the older v4 API depending on migration status.
  // For modern usage, we often use the specific sub-APIs. 
  // As of late 2024/2025, 'mybusinessreviews' might be the specific one for reviews.
  // We will use a generic authenticated fetch for reviews if the specific SDK type isn't immediately clear, 
  // or assume the 'mybusinessreviews' API is available via googleapis if installed.
  
  /**
   * List all accounts accessible by the service account
   */
  async listAccounts() {
    // Accounts are managed via mybusinessaccountmanagement
    const accountManagement = google.mybusinessaccountmanagement({ version: 'v1', auth: getGoogleAuth() });
    const response = await accountManagement.accounts.list();
    return response.data.accounts || [];
  }

  /**
   * List locations for a specific account
   */
  async listLocations(accountId: string) {
    const response = await this.businessInfo.accounts.locations.list({
      parent: accountId,
      readMask: 'name,title,storeCode,latlng,metadata',
    });
    return response.data.locations || [];
  }

  /**
   * Get reviews for a location (using generic fetch for broad compatibility)
   */
  async getReviews(locationName: string) {
    // locationName format: accounts/{accountId}/locations/{locationId}
    const auth = getGoogleAuth();
    const token = await auth.getAccessToken();
    
    // Using the My Business Reviews API
    const response = await fetch(`https://mybusinessreviews.googleapis.com/v1/${locationName}/reviews`, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch reviews: ${response.statusText}`);
    }

    const data = await response.json();
    return data.reviews || [];
  }

  /**
   * Reply to a review
   */
  async replyToReview(reviewName: string, comment: string) {
    const auth = getGoogleAuth();
    const token = await auth.getAccessToken();

    const response = await fetch(`https://mybusinessreviews.googleapis.com/v1/${reviewName}/reply`, {
      method: 'PUT',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        comment
      })
    });

    if (!response.ok) {
      throw new Error(`Failed to reply to review: ${response.statusText}`);
    }

    return response.json();
  }
}

export const businessService = new BusinessService();
