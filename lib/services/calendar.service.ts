import { google } from 'googleapis';
import { getGoogleAuth } from '../google/auth';
import 'server-only';

export class CalendarService {
  private get calendar() {
    try {
      const auth = getGoogleAuth();
      if (!auth) {
        throw new Error('Google Calendar authentication not configured. Please check your service account credentials.');
      }
      return google.calendar({ version: 'v3', auth });
    } catch (error: any) {
      console.error('Calendar initialization error:', error);
      throw new Error(`Failed to initialize Google Calendar: ${error.message}`);
    }
  }

  /**
   * List upcoming events
   */
  async listEvents(calendarId = 'primary', maxResults = 10) {
    try {
      console.log(`[Calendar Service] Listing events for calendar: ${calendarId}`);
      const response = await this.calendar.events.list({
        calendarId,
        timeMin: new Date().toISOString(),
        maxResults,
        singleEvents: true,
        orderBy: 'startTime',
      });
      console.log(`[Calendar Service] Found ${response.data.items?.length || 0} events`);
      return response.data.items || [];
    } catch (error: any) {
      console.error('[Calendar Service] Error listing events:', error);
      if (error.code === 401) {
        throw new Error('Google Calendar authentication failed. Please verify your credentials.');
      } else if (error.code === 403) {
        throw new Error('Permission denied. Please ensure the account has write access to the calendar.');
      } else if (error.code === 404) {
        throw new Error(`Calendar not found: ${calendarId}`);
      }
      throw new Error(`Failed to list calendar events: ${error.message}`);
    }
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
    try {
      console.log(`[Calendar Service] Creating event: ${event.summary} at ${event.startTime}`);
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
      console.log(`[Calendar Service] Event created successfully with ID: ${response.data.id}`);
      return response.data;
    } catch (error: any) {
      console.error('[Calendar Service] Error creating event:', error);
      if (error.code === 401) {
        throw new Error('Google Calendar authentication failed. Please verify your credentials.');
      } else if (error.code === 403) {
        throw new Error('Permission denied. Please ensure the account has write access to the calendar.');
      }
      throw new Error(`Failed to create calendar event: ${error.message}`);
    }
  }

  /**
   * Check availability (Free/Busy)
   */
  async checkAvailability(calendarId: string, timeMin: string, timeMax: string) {
    try {
      console.log(`[Calendar Service] Checking availability for ${calendarId} from ${timeMin} to ${timeMax}`);
      const response = await this.calendar.freebusy.query({
        requestBody: {
          timeMin,
          timeMax,
          items: [{ id: calendarId }],
        },
      });
      const busySlots = response.data.calendars?.[calendarId]?.busy || [];
      console.log(`[Calendar Service] Found ${busySlots.length} busy slots`);
      return busySlots;
    } catch (error: any) {
      console.error('[Calendar Service] Error checking availability:', error);
      if (error.code === 401) {
        throw new Error('Google Calendar authentication failed. Please verify your credentials.');
      } else if (error.code === 403) {
        throw new Error('Permission denied. Please ensure the Google Calendar API is enabled and the account has access.');
      } else if (error.code === 404) {
        throw new Error(`Calendar not found: ${calendarId}`);
      }
      throw new Error(`Failed to check calendar availability: ${error.message}`);
    }
  }

  /**
   * Get a specific event
   */
  async getEvent(calendarId: string, eventId: string) {
    try {
      console.log(`[Calendar Service] Getting event ${eventId} from ${calendarId}`);
      const response = await this.calendar.events.get({
        calendarId,
        eventId,
      });
      return response.data;
    } catch (error: any) {
      console.error('[Calendar Service] Error getting event:', error);
      if (error.code === 404) {
        throw new Error(`Event not found: ${eventId}`);
      }
      throw new Error(`Failed to get calendar event: ${error.message}`);
    }
  }

  /**
   * Delete an event
   */
  async deleteEvent(calendarId: string, eventId: string) {
    try {
      console.log(`[Calendar Service] Deleting event ${eventId} from ${calendarId}`);
      await this.calendar.events.delete({
        calendarId,
        eventId,
      });
      console.log(`[Calendar Service] Event ${eventId} deleted successfully`);
    } catch (error: any) {
      console.error('[Calendar Service] Error deleting event:', error);
      if (error.code === 404) {
        throw new Error(`Event not found: ${eventId}`);
      }
      throw new Error(`Failed to delete calendar event: ${error.message}`);
    }
  }
}

export const calendarService = new CalendarService();
