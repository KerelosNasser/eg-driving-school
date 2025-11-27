# EG Driving School - Service Configuration Guide

This guide explains how to correctly configure the Google Calendar and Email services for the production environment.

> [!IMPORTANT]
> These steps must be performed using the **Business Owner's Google Account** (`emealghobrial@gmail.com`).

## 1. Google Calendar Configuration

To allow the app to book appointments and send invites on behalf of the business, we use **OAuth 2.0**.

### Step A: Google Cloud Console (One-time setup)

1.  Log in to [Google Cloud Console](https://console.cloud.google.com/) with the business email.
2.  Go to **APIs & Services > Credentials**.
3.  Create an **OAuth 2.0 Client ID** (Web Application).
    - **Authorized Redirect URIs**: Add `http://localhost:3000` (and your production domain).
4.  Copy the **Client ID** and **Client Secret**.
5.  Add them to your `.env` file:
    ```env
    GOOGLE_CLIENT_ID=your_client_id
    GOOGLE_CLIENT_SECRET=your_client_secret
    ```

### Step B: Generate Refresh Token

This "keys" the app to the specific calendar account.

1.  In your project terminal, run:
    ```bash
    npx tsx scripts/get-refresh-token.ts
    ```
2.  Click the link provided.
3.  **Log in with `emealghobrial@gmail.com`**. (Crucial!)
4.  Copy the full redirect URL (from the address bar) and paste it back into the terminal.
5.  Copy the generated `GOOGLE_REFRESH_TOKEN` and add it to `.env`:
    ```env
    GOOGLE_REFRESH_TOKEN=1//0g...
    ```

### Step C: Set Calendar ID

Ensure the app writes to the main calendar of the logged-in user.

1.  Run this script to reset the database setting to 'primary':
    ```bash
    npx tsx scripts/reset-calendar-settings.ts
    ```

---

## 2. Email Configuration (Gmail SMTP)

To send booking confirmations and admin notifications.

### Step A: Generate App Password

You cannot use your regular Gmail password. You must use an App Password.

1.  Go to [Google Account Security](https://myaccount.google.com/security).
2.  Enable **2-Step Verification** (if not already on).
3.  Search for **"App Passwords"**.
4.  Create a new app password named "Driving School App".
5.  Copy the 16-character password (e.g., `xxxx xxxx xxxx xxxx`).

### Step B: Update Environment Variables

Update your `.env` file:

```env
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=emealghobrial@gmail.com
SMTP_PASS=xxxx xxxx xxxx xxxx   <-- Paste App Password here
```

### Step C: Verify

Run the test script to confirm emails are sending:

```bash
npx tsx scripts/test-email.ts
```

---

## Summary of Required `.env` Variables

```env
# Google Calendar (OAuth)
GOOGLE_CLIENT_ID=...
GOOGLE_CLIENT_SECRET=...
GOOGLE_REFRESH_TOKEN=...

# Email (SMTP)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=emealghobrial@gmail.com
SMTP_PASS=...
```
