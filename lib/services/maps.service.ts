import { getGoogleAuth } from '../google/auth';
import 'server-only';

// Base URLs for the new APIs that support OAuth
const PLACES_API_BASE = 'https://places.googleapis.com/v1';
const ROUTES_API_BASE = 'https://routes.googleapis.com/directions/v2:computeRoutes';

export class MapsService {
  private async getAccessToken() {
    const auth = getGoogleAuth();
    const token = await auth.getAccessToken();
    return token;
  }

  /**
   * Search for a place using the Places API (New)
   */
  async searchPlace(query: string) {
    const token = await this.getAccessToken();
    
    const response = await fetch(`${PLACES_API_BASE}/places:searchText`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
        'X-Goog-FieldMask': 'places.name,places.formattedAddress,places.location,places.id'
      },
      body: JSON.stringify({
        textQuery: query
      })
    });

    if (!response.ok) {
      throw new Error(`Maps API Error: ${response.statusText}`);
    }

    return response.json();
  }

  /**
   * Get details for a specific place
   */
  async getPlaceDetails(placeId: string) {
    const token = await this.getAccessToken();
    
    const response = await fetch(`${PLACES_API_BASE}/places/${placeId}`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
        'X-Goog-FieldMask': 'name,formattedAddress,location,photos,rating,userRatingCount'
      }
    });

    if (!response.ok) {
      throw new Error(`Maps API Error: ${response.statusText}`);
    }

    return response.json();
  }

  /**
   * Calculate a route between two points
   */
  async calculateRoute(origin: {lat: number, lng: number}, destination: {lat: number, lng: number}) {
    const token = await this.getAccessToken();
    
    const response = await fetch(ROUTES_API_BASE, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
        'X-Goog-FieldMask': 'routes.duration,routes.distanceMeters,routes.polyline.encodedPolyline'
      },
      body: JSON.stringify({
        origin: {
          location: {
            latLng: {
              latitude: origin.lat,
              longitude: origin.lng
            }
          }
        },
        destination: {
          location: {
            latLng: {
              latitude: destination.lat,
              longitude: destination.lng
            }
          }
        },
        travelMode: 'DRIVE'
      })
    });

    if (!response.ok) {
      throw new Error(`Routes API Error: ${response.statusText}`);
    }

    return response.json();
  }
}

export const mapsService = new MapsService();
