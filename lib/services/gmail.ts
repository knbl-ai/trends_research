import { google } from 'googleapis';

class GmailService {
  private auth: any = null;
  private gmail: any = null;

  async initialize() {
    if (this.auth && this.gmail) {
      return;
    }

    const privateKey = process.env.GOOGLE_CLOUD_PRIVATE_KEY?.replace(/\\n/g, '\n');

    if (!privateKey || !process.env.GOOGLE_CLOUD_CLIENT_EMAIL || !process.env.GOOGLE_CLOUD_PROJECT_ID) {
      throw new Error('Missing required Google Cloud credentials: GOOGLE_CLOUD_PRIVATE_KEY, GOOGLE_CLOUD_CLIENT_EMAIL, and GOOGLE_CLOUD_PROJECT_ID');
    }

    this.auth = new google.auth.GoogleAuth({
      credentials: {
        client_email: process.env.GOOGLE_CLOUD_CLIENT_EMAIL,
        private_key: privateKey,
        project_id: process.env.GOOGLE_CLOUD_PROJECT_ID
      },
      scopes: ['https://www.googleapis.com/auth/gmail.send'],
    });

    const authClient = await this.auth.getClient();
    this.gmail = google.gmail({ version: 'v1', auth: authClient });
  }

  async sendEmail(
    fromUser: string = 'ai@kanibal.co.il',
    toEmail: string,
    subject: string,
    body: string,
    isHtml: boolean = false,
    senderName: string = 'Kanibal Fashion Trends'
  ) {
    try {
      await this.initialize();

      const authClient = await this.auth.getClient();
      authClient.subject = fromUser;

      const contentType = isHtml ? 'text/html' : 'text/plain';
      const emailLines = [
        `From: ${senderName} <${fromUser}>`,
        `To: ${toEmail}`,
        `Subject: ${subject}`,
        `Content-Type: ${contentType}; charset=utf-8`,
        ``,
        body
      ];

      const email = emailLines.join('\r\n');

      const encodedEmail = Buffer.from(email)
        .toString('base64')
        .replace(/\+/g, '-')
        .replace(/\//g, '_')
        .replace(/=+$/, '');

      const result = await this.gmail.users.messages.send({
        userId: 'me',
        requestBody: {
          raw: encodedEmail,
        },
      });

      return {
        success: true,
        messageId: result.data.id,
        data: result.data
      };

    } catch (error) {
      console.error('Failed to send email:', error instanceof Error ? error.message : error);
      throw new Error(`Gmail service error: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  async sendBulkEmails(
    fromUser: string = 'ai@kanibal.co.il',
    toEmails: string[],
    subject: string,
    body: string,
    isHtml: boolean = false,
    senderName: string = 'Kanibal Fashion Trends'
  ) {
    const results = [];

    for (const email of toEmails) {
      try {
        const result = await this.sendEmail(fromUser, email, subject, body, isHtml, senderName);
        results.push({ email, success: true, result });
      } catch (error) {
        results.push({
          email,
          success: false,
          error: error instanceof Error ? error.message : 'Unknown error'
        });
      }
    }

    return results;
  }

  /**
   * Send bulk emails with intervals to avoid spam detection
   * @param fromUser - Sender email address
   * @param toEmails - Array of recipient email addresses
   * @param subject - Email subject
   * @param body - Email body (HTML or plain text)
   * @param isHtml - Whether the body is HTML
   * @param senderName - Sender display name
   * @param intervalSeconds - Base interval between emails (will be randomized ±20%)
   * @returns Array of send results with detailed information
   */
  async sendBulkEmailsWithInterval(
    fromUser: string = 'ai@kanibal.co.il',
    toEmails: string[],
    subject: string,
    body: string,
    isHtml: boolean = false,
    senderName: string = 'Kanibal Fashion Trends',
    intervalSeconds: number = 45
  ) {
    const results = [];
    const totalEmails = toEmails.length;

    console.log(`Starting bulk email send to ${totalEmails} recipients with ${intervalSeconds}s intervals...`);

    for (let i = 0; i < toEmails.length; i++) {
      const email = toEmails[i];
      const startTime = Date.now();

      try {
        const result = await this.sendEmail(fromUser, email, subject, body, isHtml, senderName);
        const endTime = Date.now();
        const sendDuration = ((endTime - startTime) / 1000).toFixed(2);

        console.log(`[${i + 1}/${totalEmails}] Successfully sent to ${email} in ${sendDuration}s`);

        results.push({
          email,
          success: true,
          result,
          sendDuration: parseFloat(sendDuration),
          timestamp: new Date().toISOString()
        });
      } catch (error) {
        const endTime = Date.now();
        const sendDuration = ((endTime - startTime) / 1000).toFixed(2);

        console.error(`[${i + 1}/${totalEmails}] Failed to send to ${email}: ${error instanceof Error ? error.message : 'Unknown error'}`);

        results.push({
          email,
          success: false,
          error: error instanceof Error ? error.message : 'Unknown error',
          sendDuration: parseFloat(sendDuration),
          timestamp: new Date().toISOString()
        });
      }

      // Add interval delay between emails (except after the last one)
      if (i < toEmails.length - 1) {
        // Randomize interval ±20% to appear more natural
        const randomizedInterval = this.getRandomizedInterval(intervalSeconds);
        console.log(`Waiting ${randomizedInterval}s before next email...`);
        await this.sleep(randomizedInterval * 1000);
      }
    }

    const successCount = results.filter(r => r.success).length;
    const failureCount = results.filter(r => !r.success).length;

    console.log(`Bulk email send complete: ${successCount} successful, ${failureCount} failed`);

    return results;
  }

  /**
   * Get randomized interval (±20% variation)
   */
  private getRandomizedInterval(baseInterval: number): number {
    const variation = 0.2; // 20% variation
    const min = baseInterval * (1 - variation);
    const max = baseInterval * (1 + variation);
    return Math.floor(Math.random() * (max - min + 1) + min);
  }

  /**
   * Sleep utility function
   */
  private sleep(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
}

const gmailService = new GmailService();
export default gmailService;
