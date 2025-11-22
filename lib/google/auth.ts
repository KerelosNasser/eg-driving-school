import { google } from 'googleapis';
import 'server-only';

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

  if (!credentialsJson) {
    throw new Error('Missing GOOGLE_APPLICATION_CREDENTIALS_JSON environment variable');
  }

  try {
    const credentials = JSON.parse(credentialsJson) as ServiceAccountKey;

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
    throw new Error('Invalid GOOGLE_APPLICATION_CREDENTIALS_JSON format');
  }
};
