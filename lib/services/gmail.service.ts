import { google } from 'googleapis';
import { getGoogleAuth } from '../google/auth';
import 'server-only';

export class GmailService {
  private get gmail() {
    return google.gmail({ version: 'v1', auth: getGoogleAuth() });
  }

  /**
   * Send an email
   */
  async sendEmail(to: string, subject: string, htmlBody: string) {
    const utf8Subject = `=?utf-8?B?${Buffer.from(subject).toString('base64')}?=`;
    const messageParts = [
      `To: ${to}`,
      'Content-Type: text/html; charset=utf-8',
      'MIME-Version: 1.0',
      `Subject: ${utf8Subject}`,
      '',
      htmlBody,
    ];
    const message = messageParts.join('\n');

    const encodedMessage = Buffer.from(message)
      .toString('base64')
      .replace(/\+/g, '-')
      .replace(/\//g, '_')
      .replace(/=+$/, '');

    const response = await this.gmail.users.messages.send({
      userId: 'me',
      requestBody: {
        raw: encodedMessage,
      },
    });

    return response.data;
  }

  /**
   * List messages (e.g., for admin panel)
   */
  async listMessages(query?: string, maxResults = 10) {
    const response = await this.gmail.users.messages.list({
      userId: 'me',
      q: query,
      maxResults,
    });
    return response.data.messages || [];
  }

  /**
   * Get full message content
   */
  async getMessage(messageId: string) {
    const response = await this.gmail.users.messages.get({
      userId: 'me',
      id: messageId,
    });
    return response.data;
  }
}

export const gmailService = new GmailService();
