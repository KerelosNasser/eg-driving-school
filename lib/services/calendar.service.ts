import { google } from 'googleapis';
import { getGoogleAuth } from '../google/auth';
import 'server-only';

export class CalendarService {
  private get calendar() {
    return google.calendar({ version: 'v3', auth: getGoogleAuth() });
  }

  /**
   * List upcoming events
   */
  async listEvents(calendarId = 'primary', maxResults = 10) {
    const response = await this.calendar.events.list({
      calendarId,
      timeMin: new Date().toISOString(),
      maxResults,
      singleEvents: true,
      orderBy: 'startTime',
    });
    return response.data.items || [];
  }

  /**
   * Create a new event
   */
  async createEvent(calendarId: string, event: {
    summary: string;
    description?: string;
    startTime: string; // ISO string
    endTime: string;   // ISO string
    attendees?: string[];
  }) {
    const response = await this.calendar.events.insert({
      calendarId,
      requestBody: {
        summary: event.summary,
        description: event.description,
        start: { dateTime: event.startTime },
        end: { dateTime: event.endTime },
        attendees: event.attendees?.map(email => ({ email })),
      },
    });
    return response.data;
  }

  /**
   * Check availability (Free/Busy)
   */
  async checkAvailability(calendarId: string, timeMin: string, timeMax: string) {
    const response = await this.calendar.freebusy.query({
      requestBody: {
        timeMin,
        timeMax,
        items: [{ id: calendarId }],
      },
    });
    return response.data.calendars?.[calendarId]?.busy || [];
  }
}

export const calendarService = new CalendarService();
