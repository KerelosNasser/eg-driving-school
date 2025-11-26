import { google } from 'googleapis';
import 'server-only';

import fs from 'fs';
import path from 'path';

// Scopes required for the various APIs
const SCOPES = [
  'https://www.googleapis.com/auth/calendar',
  'https://www.googleapis.com/auth/calendar.events',
  'https://www.googleapis.com/auth/business.manage',
  'https://www.googleapis.com/auth/gmail.send',
  'https://www.googleapis.com/auth/gmail.readonly',
  'https://www.googleapis.com/auth/cloud-platform', // For Maps & general GCP
];

interface ServiceAccountKey {
  client_email: string;
  private_key: string;
  project_id?: string;
}

let authClient: any = null;

export const getGoogleAuth = () => {
  if (authClient) return authClient;

  const credentialsJson = process.env.GOOGLE_APPLICATION_CREDENTIALS_JSON;
  const credentialsPath = process.env.GOOGLE_APPLICATION_CREDENTIALS;

  let credentials: ServiceAccountKey;

  try {
    if (credentialsJson) {
      credentials = JSON.parse(credentialsJson) as ServiceAccountKey;
    } else if (credentialsPath) {
      // Handle file path
      const resolvedPath = path.isAbsolute(credentialsPath) 
        ? credentialsPath 
        : path.join(process.cwd(), credentialsPath);
      
      if (!fs.existsSync(resolvedPath)) {
        throw new Error(`Credentials file not found at ${resolvedPath}`);
      }
      const fileContent = fs.readFileSync(resolvedPath, 'utf-8');
      credentials = JSON.parse(fileContent) as ServiceAccountKey;
    } else {
      throw new Error('Missing GOOGLE_APPLICATION_CREDENTIALS_JSON or GOOGLE_APPLICATION_CREDENTIALS environment variable');
    }

    authClient = new google.auth.GoogleAuth({
      credentials: {
        client_email: credentials.client_email,
        private_key: credentials.private_key,
      },
      projectId: credentials.project_id,
      scopes: SCOPES,
    });

    return authClient;
  } catch (error) {
    console.error('Error parsing Google credentials:', error);
    throw error;
  }
};
