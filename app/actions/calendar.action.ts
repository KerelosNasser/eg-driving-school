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
