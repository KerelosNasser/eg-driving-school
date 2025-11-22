import * as admin from 'firebase-admin';
import 'server-only';

interface ServiceAccountKey {
  client_email: string;
  private_key: string;
  project_id: string;
}

const initFirebaseAdmin = () => {
  if (admin.apps.length > 0) {
    return admin.app();
  }

  const credentialsJson = process.env.GOOGLE_APPLICATION_CREDENTIALS_JSON;

  if (!credentialsJson) {
    throw new Error('Missing GOOGLE_APPLICATION_CREDENTIALS_JSON environment variable');
  }

  try {
    const credentials = JSON.parse(credentialsJson) as ServiceAccountKey;

    return admin.initializeApp({
      credential: admin.credential.cert({
        projectId: credentials.project_id,
        clientEmail: credentials.client_email,
        privateKey: credentials.private_key,
      }),
      projectId: credentials.project_id || process.env.FIREBASE_PROJECT_ID,
      storageBucket: process.env.FIREBASE_STORAGE_BUCKET,
    });
  } catch (error) {
    console.error('Error initializing Firebase Admin:', error);
    throw new Error('Failed to initialize Firebase Admin');
  }
};

const app = initFirebaseAdmin();
export const db = app.firestore();
export const storage = app.storage();
export const auth = app.auth();
