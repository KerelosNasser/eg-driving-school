/**
 * Run this script with: npx ts-node scripts/test-gcp.ts
 * Make sure you have your .env.local variables set!
 */

import { getGoogleAuth } from '../lib/google/auth';
import { db, storage } from '../lib/firebase/admin';
import { mapsService } from '../lib/services/maps.service';
import { calendarService } from '../lib/services/calendar.service';

async function testConnection() {
  console.log('🔍 Testing GCP Integration...');

  try {
    // 1. Test Auth
    console.log('Checking Google Auth...');
    const auth = getGoogleAuth();
    const token = await auth.getAccessToken();
    console.log('✅ Auth Token retrieved successfully.');

    // 2. Test Firestore
    console.log('Checking Firestore...');
    const collections = await db.listCollections();
    console.log(`✅ Firestore connected. Found ${collections.length} collections.`);

    // 3. Test Storage
    console.log('Checking Cloud Storage...');
    const [exists] = await storage.bucket().exists();
    console.log(`✅ Storage Bucket exists: ${exists}`);

    // 4. Test Calendar
    console.log('Checking Calendar API...');
    const events = await calendarService.listEvents();
    console.log(`✅ Calendar connected. Found ${events.length} upcoming events.`);

    // 5. Test Maps (requires valid billing)
    console.log('Checking Maps API...');
    try {
      const place = await mapsService.searchPlace('Googleplex');
      console.log(`✅ Maps connected. Found place: ${place.places?.[0]?.name}`);
    } catch (e: any) {
      console.warn('⚠️ Maps check failed (might need billing enabled):', e.message);
    }

    console.log('\n🎉 All systems check complete!');
  } catch (error: any) {
    console.error('\n❌ Connection Test Failed:', error.message);
    console.error('Please check your .env.local and Service Account permissions.');
  }
}

testConnection();
