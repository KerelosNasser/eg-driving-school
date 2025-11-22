'use server';

import { businessService } from '@/lib/services/business.service';

export async function listLocationsAction(accountId: string) {
  try {
    const locations = await businessService.listLocations(accountId);
    return { success: true, data: locations };
  } catch (error: any) {
    console.error('Business Locations Error:', error);
    return { success: false, error: error.message };
  }
}

export async function getReviewsAction(locationName: string) {
  try {
    const reviews = await businessService.getReviews(locationName);
    return { success: true, data: reviews };
  } catch (error: any) {
    console.error('Business Reviews Error:', error);
    return { success: false, error: error.message };
  }
}

export async function replyToReviewAction(reviewName: string, comment: string) {
  try {
    const result = await businessService.replyToReview(reviewName, comment);
    return { success: true, data: result };
  } catch (error: any) {
    console.error('Business Reply Error:', error);
    return { success: false, error: error.message };
  }
}
