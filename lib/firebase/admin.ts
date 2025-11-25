import "server-only";
import { getApps, initializeApp, cert, getApp, App } from "firebase-admin/app";
import { getAuth } from "firebase-admin/auth";
import { getFirestore } from "firebase-admin/firestore";
import { getStorage } from "firebase-admin/storage";

import fs from "fs";
import path from "path";

const serviceAccount = process.env.GOOGLE_APPLICATION_CREDENTIALS;

let app: App;

if (!getApps().length) {
  if (!serviceAccount) {
    throw new Error(
      "GOOGLE_APPLICATION_CREDENTIALS environment variable is not set."
    );
  }
   
  try {
    let serviceAccountJson;
    // Check if the environment variable contains the JSON string directly
    if (serviceAccount.trim().startsWith("{")) {
      serviceAccountJson = JSON.parse(serviceAccount);
    } else {
      // Otherwise treat it as a file path
      const filePath = serviceAccount.startsWith(".")
        ? path.resolve(process.cwd(), serviceAccount)
        : serviceAccount;
        
      if (!fs.existsSync(filePath)) {
        throw new Error(`Service account file not found at: ${filePath}`);
      }
      
      serviceAccountJson = JSON.parse(fs.readFileSync(filePath, "utf8"));
    }

    app = initializeApp({
      credential: cert(serviceAccountJson),
      storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET, 
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
