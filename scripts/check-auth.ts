import { google } from 'googleapis';
import fs from 'fs';
import path from 'path';

// Load env vars
const envPath = path.resolve(process.cwd(), '.env');
if (fs.existsSync(envPath)) {
  const envConfig = fs.readFileSync(envPath, 'utf-8');
  envConfig.split(/\r?\n/).forEach(line => {
    const [key, value] = line.split('=');
    if (key && value) {
      process.env[key.trim()] = value.trim();
    }
  });
}

const CLIENT_ID = process.env.GOOGLE_CLIENT_ID;
const CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET;
const REFRESH_TOKEN = process.env.GOOGLE_REFRESH_TOKEN;

if (!CLIENT_ID || !CLIENT_SECRET || !REFRESH_TOKEN) {
  console.error('Missing env vars');
  process.exit(1);
}

const oauth2Client = new google.auth.OAuth2(
  CLIENT_ID,
  CLIENT_SECRET,
  'http://localhost:3000'
);

oauth2Client.setCredentials({
  refresh_token: REFRESH_TOKEN
});

async function checkAuth() {
  try {
    // Get a new access token
    const { token } = await oauth2Client.getAccessToken();
    console.log('Access Token obtained.');

    // Get user info - SKIPPED (Missing Scope)
    // const oauth2 = google.oauth2({
    //   auth: oauth2Client,
    //   version: 'v2'
    // });
    // const { data } = await oauth2.userinfo.get();

    // Try to list calendars to see permissions
    const calendar = google.calendar({ version: 'v3', auth: oauth2Client });
    const calendars = await calendar.calendarList.list();
    
    console.log('Accessible Calendars:');
    calendars.data.items?.forEach(cal => {
      console.log(`- ${cal.summary} (${cal.id}) - Access: ${cal.accessRole} - Primary: ${cal.primary}`);
      if (cal.primary) {
          console.log('\n*** AUTHENTICATED USER EMAIL seems to be: ' + cal.id + ' ***\n');
      }
    });

  } catch (error: any) {
    console.error('Auth Check Failed:', error.message);
    if (error.response) {
        console.error('Error details:', error.response.data);
    }
  }
}

checkAuth();
