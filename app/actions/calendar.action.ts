'use server';

import { calendarService } from '@/lib/services/calendar.service';

export async function listEventsAction(calendarId = 'primary') {
  try {
    const events = await calendarService.listEvents(calendarId);
    return { success: true, data: events };
  } catch (error: any) {
    console.error('Calendar List Error:', error);
    return { success: false, error: error.message };
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
    const event = await calendarService.createEvent(calendarId, eventData);
    return { success: true, data: event };
  } catch (error: any) {
    console.error('Calendar Create Error:', error);
    return { success: false, error: error.message };
  }
}


export async function checkAvailabilityAction(calendarId: string, timeMin: string, timeMax: string) {
  try {
    const busySlots = await calendarService.checkAvailability(calendarId, timeMin, timeMax);
    return { success: true, data: busySlots };
  } catch (error: any) {
    console.error('Calendar Availability Error:', error);
    return { success: false, error: error.message };
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
}) {
  try {
    const events = [];
    // Create an event for each time slot (or one combined event if consecutive - for now, individual events for simplicity or per requirement)
    // The requirement says "pick a single time slot or multiple time slots isnt required to be consecutive"
    // It's better to create one event per slot or group them. Let's create one event per slot for now to handle non-consecutive easily.
    // OR, we can group them if they are consecutive.
    // For simplicity and robustness, let's create separate events for now, or a single event if it's just one slot.
    // Actually, if they are not consecutive, they MUST be separate events.
    
    for (const slot of bookingDetails.timeSlots) {
      const startTime = `${bookingDetails.date}T${slot}:00`;
      // Assuming 1 hour slots for now, or we need to know duration. 
      // The prompt implies standard slots. Let's assume 1 hour.
      // We should probably parse the slot string to get start time.
      
      const [hours, minutes] = slot.split(':').map(Number);
      const startDate = new Date(bookingDetails.date);
      startDate.setHours(hours, minutes, 0, 0);
      
      const endDate = new Date(startDate);
      endDate.setHours(hours + 1, minutes, 0, 0); // 1 hour duration

      const event = await calendarService.createEvent('primary', {
        summary: `Driving Lesson - ${bookingDetails.customerName}`,
        description: `Phone: ${bookingDetails.customerPhone}\nEmail: ${bookingDetails.customerEmail}`,
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
  } catch (error: any) {
    console.error('Booking Error:', error);
    return { success: false, error: error.message };
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
  } catch (error: any) {
    console.error('Cancellation Error:', error);
    return { success: false, error: error.message };
  }
}
