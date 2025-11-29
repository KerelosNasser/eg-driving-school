import nodemailer from 'nodemailer';
import 'server-only';

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

  const mailOptions = {
    from: `"EG Driving School" <${process.env.SMTP_USER}>`,
    to: details.customerEmail,
    subject: 'Booking Confirmation - EG Driving School',
    html: `
      <div style="font-family: Arial, sans-serif; color: #333;">
        <h1>Booking Confirmed!</h1>
        <p>Dear ${details.customerName},</p>
        <p>Your driving lesson has been successfully booked.</p>
        <h3>Booking Details:</h3>
        <ul>
          <li><strong>Date:</strong> ${details.date}</li>
          <li><strong>Time:</strong> ${details.timeSlots.join(', ')}</li>
          ${details.location ? `<li><strong>Location:</strong> ${details.location}</li>` : ''}
        </ul>
        <p>If you need to reschedule, please contact us.</p>
        <p>Best regards,<br>EG Driving School Team</p>
      </div>
    `,
  };

  await transporter.sendMail(mailOptions);
}

export async function sendAdminNotification(details: BookingDetails, eventId: string) {
  if (!process.env.SMTP_USER || !process.env.SMTP_PASS) {
    console.warn('SMTP credentials missing. Skipping email.');
    return;
  }

  // Generate a cancellation link (this would ideally point to an admin API or page)
  // For now, we'll just include the event ID for reference
  const cancelLink = `${process.env.NEXT_PUBLIC_APP_URL}/admin/calendar/cancel?eventId=${eventId}`;

  const mailOptions = {
    from: `"EG Driving School System" <${process.env.SMTP_USER}>`,
    to: process.env.ADMIN_EMAIL || process.env.SMTP_USER, // Fallback to sender if ADMIN_EMAIL not set
    subject: 'New Booking Received',
    html: `
      <div style="font-family: Arial, sans-serif; color: #333;">
        <h1>New Booking Alert</h1>
        <p><strong>Customer:</strong> ${details.customerName}</p>
        <p><strong>Email:</strong> ${details.customerEmail}</p>
        <p><strong>Phone:</strong> ${details.customerPhone}</p>
        <h3>Booking Details:</h3>
        <ul>
          <li><strong>Date:</strong> ${details.date}</li>
          <li><strong>Time:</strong> ${details.timeSlots.join(', ')}</li>
        </ul>
        <hr>
        <p>To cancel this booking, click below:</p>
        <a href="${cancelLink}" style="background-color: #d9534f; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px;">Cancel Booking</a>
        <p style="margin-top: 10px; font-size: 12px; color: #666;">Event ID: ${eventId}</p>
      </div>
    `,
  };

  await transporter.sendMail(mailOptions);
}

export async function sendCancellationNotification(customerEmail: string, customerName: string, date: string, note?: string) {
  if (!process.env.SMTP_USER || !process.env.SMTP_PASS) {
    console.warn('SMTP credentials missing. Skipping email.');
    return;
  }

  const mailOptions = {
    from: `"EG Driving School" <${process.env.SMTP_USER}>`,
    to: customerEmail,
    subject: 'Booking Cancellation - EG Driving School',
    html: `
      <div style="font-family: Arial, sans-serif; color: #333;">
        <h1>Booking Cancelled</h1>
        <p>Dear ${customerName},</p>
        <p>Your booking for <strong>${date}</strong> has been cancelled.</p>
        ${note ? `<p><strong>Reason:</strong> ${note}</p>` : ''}
        <p>Please visit our website to book another slot or contact us for more information.</p>
        <p>Best regards,<br>EG Driving School Team</p>
      </div>
    `,
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
  
  const mailOptions = {
    from: `"EG Driving School" <${process.env.SMTP_USER}>`,
    bcc: recipients, // Use BCC for privacy
    subject: subject,
    html: `
      <div style="font-family: Arial, sans-serif; color: #333;">
        ${body}
        <hr style="margin-top: 20px; border: 0; border-top: 1px solid #eee;">
        <p style="font-size: 12px; color: #888;">
          You received this email as a registered user of EG Driving School.
        </p>
      </div>
    `,
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log(`Announcement sent to ${recipients.length} recipients`);
  } catch (error) {
    console.error('Error sending announcement:', error);
    throw error;
  }
}

