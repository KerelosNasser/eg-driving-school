import "server-only";
import { getApps, initializeApp, cert, getApp, App } from "firebase-admin/app";
import { getAuth } from "firebase-admin/auth";
import { getFirestore } from "firebase-admin/firestore";
import { getStorage } from "firebase-admin/storage";

const serviceAccount = process.env.GOOGLE_APPLICATION_CREDENTIALS;

let app: App;

if (!getApps().length) {
  if (!serviceAccount) {
    throw new Error(
      "GOOGLE_APPLICATION_CREDENTIALS environment variable is not set."
    );
  }
   
  try {
     // eslint-disable-next-line @typescript-eslint/no-require-imports
    const serviceAccountJson = require(serviceAccount.startsWith(".") ? `../../${serviceAccount}` : serviceAccount);
    app = initializeApp({
      credential: cert(serviceAccountJson),
      storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET, // Add storage bucket if needed
    });
  } catch (error) {
      console.error("Failed to load service account", error);
      // Fallback or re-throw
      throw error;
  }

} else {
  app = getApp();
}

const adminAuth = getAuth(app);
const adminDb = getFirestore(app);
const storage = getStorage(app);

export { adminAuth, adminDb, storage };
