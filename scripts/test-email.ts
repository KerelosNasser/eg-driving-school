import nodemailer from "nodemailer";
import fs from "fs";
import path from "path";

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

console.log("Testing Email Configuration...");
console.log(`Host: ${SMTP_HOST}`);
console.log(`Port: ${SMTP_PORT}`);
console.log(`User: ${SMTP_USER}`);
console.log(`Pass: ${SMTP_PASS ? "********" : "Not Set"}`);

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

async function testEmail() {
  try {
    console.log("Sending test email...");
    const info = await transporter.sendMail({
      from: `"Test Script" <${SMTP_USER}>`,
      to: SMTP_USER, // Send to self
      subject: "Test Email from EG Driving School App",
      text: "If you are reading this, your email configuration is correct!",
    });

    console.log("✅ Email sent successfully!");
    console.log("Message ID:", info.messageId);
  } catch (error: any) {
    console.error("❌ Email failed to send.");
    console.error("Error:", error.message);
    if (error.code === "EAUTH") {
      console.error(
        '\nTip: If using Gmail, make sure you are using an "App Password", not your login password.'
      );
      console.error("Go to: https://myaccount.google.com/apppasswords");
    }
  }
}

testEmail();
