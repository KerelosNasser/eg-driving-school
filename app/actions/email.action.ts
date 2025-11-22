'use server';

import { gmailService } from '@/lib/services/gmail.service';

export async function sendEmailAction(to: string, subject: string, htmlBody: string) {
  try {
    const result = await gmailService.sendEmail(to, subject, htmlBody);
    return { success: true, data: result };
  } catch (error: any) {
    console.error('Email Send Error:', error);
    return { success: false, error: error.message };
  }
}

export async function listMessagesAction(query?: string) {
  try {
    const messages = await gmailService.listMessages(query);
    return { success: true, data: messages };
  } catch (error: any) {
    console.error('Email List Error:', error);
    return { success: false, error: error.message };
  }
}

export async function getMessageContentAction(messageId: string) {
  try {
    const message = await gmailService.getMessage(messageId);
    return { success: true, data: message };
  } catch (error: any) {
    console.error('Email Content Error:', error);
    return { success: false, error: error.message };
  }
}
