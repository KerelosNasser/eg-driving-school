'use server';

import { mapsService } from '@/lib/services/maps.service';

export async function searchPlaceAction(query: string) {
  try {
    const result = await mapsService.searchPlace(query);
    return { success: true, data: result };
  } catch (error: any) {
    console.error('Maps Search Error:', error);
    return { success: false, error: error.message };
  }
}

export async function getPlaceDetailsAction(placeId: string) {
  try {
    const result = await mapsService.getPlaceDetails(placeId);
    return { success: true, data: result };
  } catch (error: any) {
    console.error('Maps Details Error:', error);
    return { success: false, error: error.message };
  }
}

export async function calculateRouteAction(origin: {lat: number, lng: number}, destination: {lat: number, lng: number}) {
  try {
    const result = await mapsService.calculateRoute(origin, destination);
    return { success: true, data: result };
  } catch (error: any) {
    console.error('Maps Route Error:', error);
    return { success: false, error: error.message };
  }
}
