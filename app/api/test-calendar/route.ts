
import { NextResponse } from 'next/server';
import { calendarService } from '@/lib/services/calendar.service';

export async function GET() {
  try {
    const now = new Date();
    const nextWeek = new Date(now);
    nextWeek.setDate(nextWeek.getDate() + 7);

    // 1. List Events
    const events = await calendarService.listEvents('primary', 10);

    // 2. Check Availability (FreeBusy)
    const busySlots = await calendarService.checkAvailability(
      'primary',
      now.toISOString(),
      nextWeek.toISOString()
    );

    return NextResponse.json({
      success: true,
      time: now.toISOString(),
      events,
      busySlots
    });
  } catch (error: any) {
    console.error('Test Calendar Error:', error);
    return NextResponse.json({
      success: false,
      error: error.message,
      stack: error.stack
    }, { status: 200 });
  }
}
