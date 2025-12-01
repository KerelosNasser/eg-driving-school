

interface BookingDetails {
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  date: string;
  timeSlots: string[];
  location?: string;
}

const BRAND_COLORS = {
  primary: '#ffd600', // Yellow
  secondary: '#000000', // Black
  text: '#333333',
  background: '#f4f4f4',
  white: '#ffffff',
  gray: '#888888',
  danger: '#d9534f',
};

const STYLES = {
  body: `font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; line-height: 1.6; color: ${BRAND_COLORS.text}; margin: 0; padding: 0; background-color: ${BRAND_COLORS.background};`,
  container: `max-width: 600px; margin: 0 auto; background-color: ${BRAND_COLORS.white}; border-radius: 8px; overflow: hidden; box-shadow: 0 4px 6px rgba(0,0,0,0.05);`,
  header: `background-color: ${BRAND_COLORS.primary}; padding: 30px 20px; text-align: center;`,
  headerTitle: `color: ${BRAND_COLORS.secondary}; margin: 0; font-size: 24px; font-weight: bold; text-transform: uppercase; letter-spacing: 1px;`,
  content: `padding: 40px 30px;`,
  footer: `background-color: #eeeeee; padding: 20px; text-align: center; font-size: 12px; color: ${BRAND_COLORS.gray};`,
  button: `display: inline-block; background-color: ${BRAND_COLORS.secondary}; color: ${BRAND_COLORS.primary}; padding: 12px 24px; text-decoration: none; border-radius: 4px; font-weight: bold; margin-top: 20px;`,
  list: `list-style: none; padding: 0; margin: 20px 0;`,
  listItem: `padding: 10px 0; border-bottom: 1px solid #eeeeee;`,
  label: `font-weight: bold; color: ${BRAND_COLORS.secondary};`,
  h1: `color: ${BRAND_COLORS.secondary}; margin-top: 0; font-size: 22px;`,
  h2: `color: ${BRAND_COLORS.secondary}; font-size: 18px; margin-top: 20px; margin-bottom: 10px;`,
  link: `color: ${BRAND_COLORS.secondary}; text-decoration: underline;`,
};

function getHtmlLayout(title: string, content: string): string {
  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>${title}</title>
    </head>
    <body style="${STYLES.body}">
      <div style="padding: 20px;">
        <div style="${STYLES.container}">
          <!-- Header -->
          <div style="${STYLES.header}">
            <h1 style="${STYLES.headerTitle}">EG Driving School</h1>
          </div>
          
          <!-- Content -->
          <div style="${STYLES.content}">
            ${content}
          </div>
          
          <!-- Footer -->
          <div style="${STYLES.footer}">
            <p style="margin: 0 0 10px 0;">&copy; ${new Date().getFullYear()} EG Driving School. All rights reserved.</p>
            <p style="margin: 0;">
              <a href="${process.env.NEXT_PUBLIC_APP_URL}" style="${STYLES.link}">Visit our website</a>
            </p>
          </div>
        </div>
      </div>
    </body>
    </html>
  `;
}

export function getBookingConfirmationTemplate(details: BookingDetails): string {
  const content = `
    <h1 style="${STYLES.h1}">Booking Confirmed!</h1>
    <p>Dear ${details.customerName},</p>
    <p>We are excited to confirm your driving lesson. Here are the details of your upcoming session:</p>
    
    <div style="background-color: #f9f9f9; padding: 20px; border-radius: 6px; margin: 20px 0;">
      <ul style="${STYLES.list}">
        <li style="${STYLES.listItem}">
          <span style="${STYLES.label}">Date:</span> ${details.date}
        </li>
        <li style="${STYLES.listItem}">
          <span style="${STYLES.label}">Time:</span> ${details.timeSlots.join(', ')}
        </li>
        ${details.location ? `
        <li style="${STYLES.listItem}">
          <span style="${STYLES.label}">Location:</span> ${details.location}
        </li>
        ` : ''}
      </ul>
    </div>

    <p>If you need to reschedule or have any questions, please don't hesitate to contact us.</p>
    
    <div style="text-align: center; margin-top: 30px;">
      <a href="${process.env.NEXT_PUBLIC_APP_URL}/profile" style="${STYLES.button}">View My Bookings</a>
    </div>
    
    <p style="margin-top: 30px;">Best regards,<br>The EG Driving School Team</p>
  `;
  
  return getHtmlLayout('Booking Confirmation', content);
}

export function getAdminNotificationTemplate(details: BookingDetails, eventId: string): string {
  const cancelLink = `${process.env.NEXT_PUBLIC_APP_URL}/admin/calendar/cancel?eventId=${eventId}`;
  
  const content = `
    <h1 style="${STYLES.h1}">New Booking Received</h1>
    <p>A new booking has been made. Please review the details below:</p>
    
    <h2 style="${STYLES.h2}">Customer Information</h2>
    <ul style="${STYLES.list}">
      <li style="${STYLES.listItem}">
        <span style="${STYLES.label}">Name:</span> ${details.customerName}
      </li>
      <li style="${STYLES.listItem}">
        <span style="${STYLES.label}">Email:</span> <a href="mailto:${details.customerEmail}" style="${STYLES.link}">${details.customerEmail}</a>
      </li>
      <li style="${STYLES.listItem}">
        <span style="${STYLES.label}">Phone:</span> <a href="tel:${details.customerPhone}" style="${STYLES.link}">${details.customerPhone}</a>
      </li>
    </ul>

    <h2 style="${STYLES.h2}">Session Details</h2>
    <ul style="${STYLES.list}">
      <li style="${STYLES.listItem}">
        <span style="${STYLES.label}">Date:</span> ${details.date}
      </li>
      <li style="${STYLES.listItem}">
        <span style="${STYLES.label}">Time:</span> ${details.timeSlots.join(', ')}
      </li>
    </ul>

    <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #eee;">
      <p style="margin-bottom: 15px;"><strong>Actions:</strong></p>
      <a href="${cancelLink}" style="${STYLES.button}; background-color: ${BRAND_COLORS.danger}; color: white;">Cancel Booking</a>
    </div>
    
    <p style="margin-top: 20px; font-size: 12px; color: #999;">Event ID: ${eventId}</p>
  `;
  
  return getHtmlLayout('New Booking Alert', content);
}

export function getCancellationNotificationTemplate(customerName: string, date: string, note?: string): string {
  const content = `
    <h1 style="${STYLES.h1}">Booking Cancelled</h1>
    <p>Dear ${customerName},</p>
    <p>This email is to confirm that your driving lesson scheduled for <strong>${date}</strong> has been cancelled.</p>
    
    ${note ? `
    <div style="background-color: #fff3cd; color: #856404; padding: 15px; border-radius: 4px; margin: 20px 0; border: 1px solid #ffeeba;">
      <strong>Reason:</strong> ${note}
    </div>
    ` : ''}
    
    <p>We apologize for any inconvenience. You are welcome to book another slot at your convenience.</p>
    
    <div style="text-align: center; margin-top: 30px;">
      <a href="${process.env.NEXT_PUBLIC_APP_URL}" style="${STYLES.button}">Book New Lesson</a>
    </div>
    
    <p style="margin-top: 30px;">Best regards,<br>The EG Driving School Team</p>
  `;
  
  return getHtmlLayout('Booking Cancellation', content);
}

export function getAnnouncementTemplate(body: string): string {
  const content = `
    <h1 style="${STYLES.h1}">Announcement</h1>
    <div style="font-size: 16px; line-height: 1.6;">
      ${body}
    </div>
    <hr style="margin-top: 30px; border: 0; border-top: 1px solid #eee;">
    <p style="font-size: 12px; color: #888; font-style: italic;">
      You received this email as a registered user of EG Driving School.
    </p>
  `;
  
  return getHtmlLayout('Announcement', content);
}
