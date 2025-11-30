'use server';

import { calendarService } from '@/lib/services/calendar.service';
import { userPackageServerService } from '@/lib/services/server/user-package.server';

export async function listEventsAction(calendarId = 'primary') {
  try {
    console.log(`[Calendar Action] Listing events for ${calendarId}`);
    const events = await calendarService.listEvents(calendarId);
    console.log(`[Calendar Action] Successfully retrieved ${events.length} events`);
    return { success: true, data: events };
  } catch (error) {
    console.error('[Calendar Action] List events failed:', error);
    return { 
      success: false, 
      error: error instanceof Error ? error.message : 'Failed to retrieve calendar events. Please check your Google Calendar configuration.' 
    };
  }
}

export async function createEventAction(calendarId: string, eventData: {
  summary: string;
  description?: string;
  startTime: string;
  endTime: string;
  attendees?: string[];
}) {
  try {
    console.log(`[Calendar Action] Creating event: ${eventData.summary}`);
    const event = await calendarService.createEvent(calendarId, eventData);
    console.log(`[Calendar Action] Event created with ID: ${event.id}`);
    return { success: true, data: event };
  } catch (error) {
    console.error('[Calendar Action] Create event failed:', error);
    return { 
      success: false, 
      error: error instanceof Error ? error.message : 'Failed to create calendar event. Please try again.' 
    };
  }
}


export async function checkAvailabilityAction(timeMin: string, timeMax: string) {
  try {
    console.log(`[Calendar Action] Checking availability from ${timeMin} to ${timeMax}`);
    
    // Fetch calendar ID from settings
    const { getAdminSettings } = await import('./admin-settings.action');
    const settingsResult = await getAdminSettings();
    const calendarId = settingsResult.data?.calendarId || 'primary';
    
    console.log(`[Calendar Action] Using calendar ID: ${calendarId}`);
    
    const busySlots = await calendarService.checkAvailability(calendarId, timeMin, timeMax);
    console.log(`[Calendar Action] Found ${busySlots.length} busy time slots`);
    return { success: true, data: busySlots };
  } catch (error) {
    console.error('[Calendar Action] Check availability failed:', error);
    return { 
      success: false, 
      error: error instanceof Error ? error.message : 'Failed to check calendar availability. Please verify your Google Calendar setup.' 
    };
  }
}

import { sendBookingConfirmation, sendAdminNotification, sendCancellationNotification } from '@/lib/services/email.service';

export async function bookAppointmentAction(bookingDetails: {
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  date: string; // YYYY-MM-DD
  timeSlots: string[]; // ["10:00", "11:00"]
  location?: string;
  userPackageId?: string;
}) {
  try {
    // Fetch calendar ID from settings
    const { getAdminSettings } = await import('./admin-settings.action');
    const settingsResult = await getAdminSettings();
    const calendarId = settingsResult.data?.calendarId || 'primary';
    
    console.log(`[Calendar Action] Booking appointment using calendar ID: ${calendarId}`);

    // --- Package Deduction Logic ---
    const { adminDb } = await import('@/lib/firebase/admin');
    
    // 1. Find user by email
    const usersSnapshot = await adminDb.collection('users').where('email', '==', bookingDetails.customerEmail).limit(1).get();
    
    if (!usersSnapshot.empty) {
      const userId = usersSnapshot.docs[0].id;
      const hoursToDeduct = bookingDetails.timeSlots.length;
      
      try {
        await userPackageServerService.deductPackageHours(userId, hoursToDeduct, bookingDetails.userPackageId);
      } catch (error) {
        console.error('[Calendar Action] Failed to deduct package hours:', error);
        // Decide if we should block booking. For now, log and proceed as per previous behavior.
      }
    } else {
        console.log(`[Calendar Action] User not found for email ${bookingDetails.customerEmail}. Proceeding with standard booking.`);
    }
    // -------------------------------
    
    const events = [];
    // Create an event for each time slot (or one combined event if consecutive - for now, individual events for simplicity or per requirement)
    // The requirement says "pick a single time slot or multiple time slots isnt required to be consecutive"
    // It's better to create one event per slot or group them. Let's create one event per slot for now to handle non-consecutive easily.
    // OR, we can group them if they are consecutive.
    // For simplicity and robustness, let's create separate events for now, or a single event if it's just one slot.
    // Actually, if they are not consecutive, they MUST be separate events.
    
    for (const slot of bookingDetails.timeSlots) {
      // Assuming 1 hour slots for now, or we need to know duration. 
      // The prompt implies standard slots. Let's assume 1 hour.
      // We should probably parse the slot string to get start time.
      
      const [hours, minutes] = slot.split(':').map(Number);
      const startDate = new Date(bookingDetails.date);
      startDate.setHours(hours, minutes, 0, 0);
      
      const endDate = new Date(startDate);
      endDate.setHours(hours + 1, minutes, 0, 0); // 1 hour duration

      const event = await calendarService.createEvent(calendarId, {
        summary: `Driving Lesson - ${bookingDetails.customerName}`,
        description: `Phone: ${bookingDetails.customerPhone}\\nEmail: ${bookingDetails.customerEmail}`,
        startTime: startDate.toISOString(),
        endTime: endDate.toISOString(),
        attendees: [bookingDetails.customerEmail],
      });
      events.push(event);
    }

    // Send Emails
    // We use the ID of the first event for the admin link for now, or we need a way to cancel all.
    // For the MVP, let's just use the first one.
    const mainEventId = events[0]?.id;

    await sendBookingConfirmation(bookingDetails);
    if (mainEventId) {
        await sendAdminNotification(bookingDetails, mainEventId);
    }

    return { success: true, data: events };
  } catch (error) {
    console.error('Booking Error:', error);
    return { success: false, error: error instanceof Error ? error.message : 'Unknown booking error' };
  }
}

export async function cancelAppointmentAction(eventId: string, note?: string) {
  try {
    // 1. Get event to find user email
    const event = await calendarService.getEvent('primary', eventId);
    
    if (!event) {
      throw new Error('Event not found');
    }

    const customerEmail = event.attendees?.[0]?.email;
    const customerName = event.summary?.replace('Driving Lesson - ', '') || 'Customer';
    const eventDate = event.start?.dateTime ? new Date(event.start.dateTime).toLocaleString() : 'Unknown Date';

    // 2. Delete event from Google Calendar
    await calendarService.deleteEvent('primary', eventId);

    // 3. Send Cancellation Email
    if (customerEmail) {
      await sendCancellationNotification(customerEmail, customerName, eventDate, note);
    }

    return { success: true };
  } catch (error) {
    console.error('Cancellation Error:', error);
    return { success: false, error: error instanceof Error ? error.message : 'Unknown cancellation error' };
  }
}
