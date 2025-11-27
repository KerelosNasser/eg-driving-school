import { initializeApp, cert } from "firebase-admin/app";
import { getFirestore } from "firebase-admin/firestore";
import fs from "fs";
import path from "path";

// Load env vars
const envPath = path.resolve(process.cwd(), '.env');
if (fs.existsSync(envPath)) {
  const envConfig = fs.readFileSync(envPath, 'utf-8');
  envConfig.split(/\r?\n/).forEach(line => {
    const [key, ...valueParts] = line.split('=');
    if (key && valueParts.length > 0) {
      let value = valueParts.join('=').trim();
      if ((value.startsWith('"') && value.endsWith('"')) || (value.startsWith("'") && value.endsWith("'"))) {
        value = value.slice(1, -1);
      }
      process.env[key.trim()] = value;
    }
  });
}

const serviceAccount = process.env.GOOGLE_APPLICATION_CREDENTIALS;

if (!serviceAccount) {
    console.error("GOOGLE_APPLICATION_CREDENTIALS not set");
    process.exit(1);
}

let serviceAccountJson;
if (serviceAccount.trim().startsWith("{")) {
    serviceAccountJson = JSON.parse(serviceAccount);
} else {
    const filePath = serviceAccount.startsWith(".")
    ? path.resolve(process.cwd(), serviceAccount)
    : serviceAccount;
    serviceAccountJson = JSON.parse(fs.readFileSync(filePath, "utf8"));
}

const app = initializeApp({
    credential: cert(serviceAccountJson)
});

const db = getFirestore(app);

async function resetSettings() {
    try {
        console.log("Resetting Calendar ID to 'primary'...");
        await db.collection('settings').doc('calendar').set({
            calendarId: 'primary'
        }, { merge: true });
        console.log("Success! Calendar ID is now 'primary'.");
        console.log("This means the app will use the calendar of whoever generated the OAuth token.");
    } catch (error) {
        console.error("Error updating settings:", error);
    }
}

resetSettings();
