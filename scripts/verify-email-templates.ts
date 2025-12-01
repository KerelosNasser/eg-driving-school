import nodemailer from "nodemailer";
import fs from "fs";
import path from "path";
import {
  getBookingConfirmationTemplate,
  getAdminNotificationTemplate,
  getCancellationNotificationTemplate,
  getAnnouncementTemplate,
} from "../lib/services/email-templates";

// Load env vars
const envPath = path.resolve(process.cwd(), ".env");
if (fs.existsSync(envPath)) {
  const envConfig = fs.readFileSync(envPath, "utf-8");
  envConfig.split(/\r?\n/).forEach((line) => {
    const [key, ...valueParts] = line.split("=");
    if (key && valueParts.length > 0) {
      let value = valueParts.join("=").trim();
      if (
        (value.startsWith('"') && value.endsWith('"')) ||
        (value.startsWith("'") && value.endsWith("'"))
      ) {
        value = value.slice(1, -1);
      }
      process.env[key.trim()] = value;
    }
  });
}

const SMTP_USER = process.env.SMTP_USER;
const SMTP_PASS = process.env.SMTP_PASS;
const SMTP_HOST = process.env.SMTP_HOST || "smtp.gmail.com";
const SMTP_PORT = parseInt(process.env.SMTP_PORT || "587");

if (!SMTP_USER || !SMTP_PASS) {
  console.error("Error: SMTP_USER and SMTP_PASS must be set in .env");
  process.exit(1);
}

const transporter = nodemailer.createTransport({
  host: SMTP_HOST,
  port: SMTP_PORT,
  secure: false,
  auth: {
    user: SMTP_USER,
    pass: SMTP_PASS,
  },
});

async function sendTestEmail(subject: string, html: string) {
  try {
    console.log(`Sending "${subject}"...`);
    await transporter.sendMail({
      from: `"EG Driving School Test" <${SMTP_USER}>`,
      to: SMTP_USER, // Send to self
      subject: `[TEST] ${subject}`,
      html: html,
    });
    console.log(`✅ Sent "${subject}"`);
  } catch (error: any) {
    console.error(`❌ Failed to send "${subject}"`);
    console.error(error.message);
  }
}

async function runTests() {
  console.log("Starting Email Template Verification...");

  // 1. Booking Confirmation
  const bookingDetails = {
    customerName: "John Doe",
    customerEmail: "john@example.com",
    customerPhone: "0400 000 000",
    date: "2023-12-25",
    timeSlots: ["10:00 AM", "11:00 AM"],
    location: "123 Test St, Testville",
  };
  await sendTestEmail(
    "Booking Confirmation",
    getBookingConfirmationTemplate(bookingDetails)
  );

  // 2. Admin Notification
  await sendTestEmail(
    "Admin Notification",
    getAdminNotificationTemplate(bookingDetails, "test-event-id-123")
  );

  // 3. Cancellation Notification
  await sendTestEmail(
    "Cancellation Notification",
    getCancellationNotificationTemplate(
      "John Doe",
      "2023-12-25",
      "Instructor unavailable"
    )
  );

  // 4. Announcement
  await sendTestEmail(
    "Announcement",
    getAnnouncementTemplate(
      "<p>This is a test announcement to verify the email template style.</p><p>It supports <strong>HTML</strong> content.</p>"
    )
  );

  console.log("\nVerification Complete. Please check your inbox.");
}

runTests();
