import { google } from 'googleapis';
import readline from 'readline';
import fs from 'fs';
import path from 'path';

// Load env vars manually since we might run this with tsx/ts-node without next's env loading
// Or we assume the user has them set. 
// Let's try to read .env file manually to be safe.
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
const REDIRECT_URI = 'http://localhost:3000'; // Standard for local dev

if (!CLIENT_ID || !CLIENT_SECRET) {
  console.error('Error: GOOGLE_CLIENT_ID and GOOGLE_CLIENT_SECRET must be set in .env');
  process.exit(1);
}

const oauth2Client = new google.auth.OAuth2(
  CLIENT_ID,
  CLIENT_SECRET,
  REDIRECT_URI
);

const SCOPES = [
  'https://www.googleapis.com/auth/calendar',
  'https://www.googleapis.com/auth/calendar.events',
  'https://www.googleapis.com/auth/business.manage',
];

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

async function getRefreshToken() {
  const authUrl = oauth2Client.generateAuthUrl({
    access_type: 'offline', // Critical for refresh token
    scope: SCOPES,
    prompt: 'consent', // Force consent to ensure refresh token is returned
  });

  console.log('\nAuthorize this app by visiting this url:\n');
  console.log(authUrl);
  console.log('\n');
  console.log('1. Click the link above.');
  console.log('2. Log in with your Google account.');
  console.log('3. You will be redirected to your website (localhost:3000).');
  console.log('4. COPY THE ENTIRE URL from your browser address bar (it will look like http://localhost:3000/?code=...)');
  console.log('5. Paste the FULL URL below:');

  rl.question('Paste the full URL here: ', async (inputUrl) => {
    try {
      let code = inputUrl.trim();
      
      // If user pasted full URL, extract code
      if (code.includes('code=')) {
        try {
          const url = new URL(code);
          const extractedCode = url.searchParams.get('code');
          if (extractedCode) {
            code = extractedCode;
          }
        } catch (e) {
          // If URL parsing fails, maybe they pasted just the query string or something else. 
          // Try simple string splitting as fallback
          const match = code.match(/code=([^&]+)/);
          if (match && match[1]) {
            code = match[1];
          }
        }
      }

      // Decode if it's URL encoded (sometimes happens with copy-paste)
      code = decodeURIComponent(code);

      const { tokens } = await oauth2Client.getToken(code);
      
      console.log('\nSuccessfully retrieved tokens!');
      console.log('\n-----------------------------------');
      console.log('GOOGLE_REFRESH_TOKEN=' + tokens.refresh_token);
      console.log('-----------------------------------\n');
      console.log('Add the above line to your .env file.');
      
      if (!tokens.refresh_token) {
        console.warn('Warning: No refresh token returned. Did you already authorize? You might need to revoke access or use prompt: "consent".');
      }

    } catch (error) {
      console.error('Error retrieving access token:', error);
    } finally {
      rl.close();
    }
  });
}

getRefreshToken();
