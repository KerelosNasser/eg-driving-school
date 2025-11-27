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

  // 1. Try OAuth 2.0 (Preferred for Personal Accounts / Attendee Invites)
  const clientId = process.env.GOOGLE_CLIENT_ID;
  const clientSecret = process.env.GOOGLE_CLIENT_SECRET;
  const refreshToken = process.env.GOOGLE_REFRESH_TOKEN;

  if (clientId && clientSecret && refreshToken) {
    try {
      console.log('[Google Auth] Initializing with OAuth 2.0 (Refresh Token)');
      console.log(`[Google Auth] Client ID present: ${!!clientId}`);
      console.log(`[Google Auth] Client Secret present: ${!!clientSecret}`);
      console.log(`[Google Auth] Refresh Token length: ${refreshToken.length}`);
      console.log(`[Google Auth] Refresh Token starts with: ${refreshToken.substring(0, 5)}...`);

      if (refreshToken.startsWith('GOOGLE_REFRESH_TOKEN=') || refreshToken.startsWith('GOOGL')) {
        console.error('\n[Google Auth] CRITICAL ERROR: Your GOOGLE_REFRESH_TOKEN in .env seems to include the variable name or is incorrect.');
        console.error('[Google Auth] It should look like: "1//0g..."');
        console.error('[Google Auth] Current value starts with: "' + refreshToken.substring(0, 20) + '..."\n');
      }

      const oauth2Client = new google.auth.OAuth2(
        clientId,
        clientSecret,
        'http://localhost:3000' // Redirect URI (unused for server-to-server but required by constructor)
      );

      oauth2Client.setCredentials({
        refresh_token: refreshToken
      });

      authClient = oauth2Client;
      return authClient;
    } catch (error) {
      console.error('[Google Auth] OAuth 2.0 initialization failed:', error);
      // Fallthrough to Service Account
    }
  }

  // 2. Fallback to Service Account (Workspace Only for Invites)
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
      // If neither OAuth nor Service Account is configured
      throw new Error('Missing Google Credentials. Please configure GOOGLE_CLIENT_ID/SECRET/REFRESH_TOKEN or GOOGLE_APPLICATION_CREDENTIALS.');
    }

    console.log('[Google Auth] Initializing with Service Account');
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
