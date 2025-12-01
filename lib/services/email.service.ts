import nodemailer from 'nodemailer';
import 'server-only';
import {
  getBookingConfirmationTemplate,
  getAdminNotificationTemplate,
  getCancellationNotificationTemplate,
  getAnnouncementTemplate
} from './email-templates';

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST || 'smtp.gmail.com',
  port: parseInt(process.env.SMTP_PORT || '587'),
  secure: false, // true for 465, false for other ports
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

interface BookingDetails {
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  date: string;
  timeSlots: string[];
  location?: string;
}

export async function sendBookingConfirmation(details: BookingDetails) {
  if (!process.env.SMTP_USER || !process.env.SMTP_PASS) {
    console.warn('SMTP credentials missing. Skipping email.');
    return;
  }

  const html = getBookingConfirmationTemplate(details);

  const mailOptions = {
    from: `"EG Driving School" <${process.env.SMTP_USER}>`,
    to: details.customerEmail,
    subject: 'Booking Confirmation - EG Driving School',
    html: html,
  };

  await transporter.sendMail(mailOptions);
}

export async function sendAdminNotification(details: BookingDetails, eventId: string) {
  if (!process.env.SMTP_USER || !process.env.SMTP_PASS) {
    console.warn('SMTP credentials missing. Skipping email.');
    return;
  }

  const html = getAdminNotificationTemplate(details, eventId);

  const mailOptions = {
    from: `"EG Driving School System" <${process.env.SMTP_USER}>`,
    to: process.env.ADMIN_EMAIL || process.env.SMTP_USER, // Fallback to sender if ADMIN_EMAIL not set
    subject: 'New Booking Received',
    html: html,
  };

  await transporter.sendMail(mailOptions);
}

export async function sendCancellationNotification(customerEmail: string, customerName: string, date: string, note?: string) {
  if (!process.env.SMTP_USER || !process.env.SMTP_PASS) {
    console.warn('SMTP credentials missing. Skipping email.');
    return;
  }

  const html = getCancellationNotificationTemplate(customerName, date, note);

  const mailOptions = {
    from: `"EG Driving School" <${process.env.SMTP_USER}>`,
    to: customerEmail,
    subject: 'Booking Cancellation - EG Driving School',
    html: html,
  };


  await transporter.sendMail(mailOptions);
}

export async function sendAnnouncement(subject: string, body: string, recipients: string[]) {
  if (!process.env.SMTP_USER || !process.env.SMTP_PASS) {
    console.warn('SMTP credentials missing. Skipping email.');
    return;
  }

  // Send individually to avoid exposing all emails in "To" field
  // In a real production app with many users, use a bulk email service or BCC
  // For this scale, loop is acceptable or BCC
  
  const html = getAnnouncementTemplate(body);

  const mailOptions = {
    from: `"EG Driving School" <${process.env.SMTP_USER}>`,
    bcc: recipients, // Use BCC for privacy
    subject: subject,
    html: html,
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log(`Announcement sent to ${recipients.length} recipients`);
  } catch (error) {
    console.error('Error sending announcement:', error);
    throw error;
  }
}

