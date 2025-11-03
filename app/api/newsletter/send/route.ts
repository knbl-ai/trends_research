import { NextRequest, NextResponse } from 'next/server';
import { TrendsOverviewRequest, TrendsOverviewResponse } from '@/lib/types-overview';
import gmailService from '@/lib/services/gmail';
import { generateNewsletterOverviewHTML } from '@/lib/templates/newsletter-overview-email';
import https from 'https';
import fetch from 'node-fetch';
import fs from 'fs';
import path from 'path';

// Load recipients from JSON file
function getNewsletterRecipients() {
  try {
    const recipientsPath = path.join(process.cwd(), 'config', 'newsletter-recipients.json');
    const recipientsData = fs.readFileSync(recipientsPath, 'utf-8');
    const data = JSON.parse(recipientsData);

    // Filter only active recipients
    return data.recipients
      .filter((recipient: any) => recipient.active)
      .map((recipient: any) => recipient.email);
  } catch (error) {
    console.error('Failed to load recipients from JSON:', error);
    // Fallback to hardcoded recipients
    return [
      'vladi@kanibal.co.il',
      'ravit@kanibal.co.il',
      'raz@kanibal.co.il',
      'daniela@kanibal.co.il'
    ];
  }
}

export async function POST(request: NextRequest) {
  try {
    // Verify this is being called by Vercel Cron
    const userAgent = request.headers.get('user-agent') || '';
    const isVercelCron = userAgent.includes('vercel-cron');

    if (!isVercelCron) {
      return NextResponse.json(
        { error: 'Unauthorized - This endpoint can only be triggered by Vercel Cron' },
        { status: 401 }
      );
    }

    console.log('Starting weekly newsletter send...');

    // Prepare trends overview request with Hebrew language
    const trendsRequest: TrendsOverviewRequest = {
      language: "Hebrew",
      production: true
    };

    // Get the API endpoint and key from environment variables
    const apiEndpoint = process.env.TRENDS_RESEARCH_API;
    const apiKey = process.env.TRENDS_RESEARCH_API_KEY;

    if (!apiEndpoint || !apiKey) {
      return NextResponse.json(
        { error: 'TRENDS_RESEARCH_API or TRENDS_RESEARCH_API_KEY not configured' },
        { status: 500 }
      );
    }

    // Create HTTPS agent for self-signed certificates
    const httpsAgent = new https.Agent({
      rejectUnauthorized: false,
    });

    // Make the API request to fetch trends overview
    // Replace /generate with /trends-overview
    const overviewEndpoint = apiEndpoint.replace('/generate', '/trends-overview');
    const fetchOptions: any = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': apiKey,
      },
      body: JSON.stringify(trendsRequest),
    };

    if (overviewEndpoint.startsWith('https://')) {
      fetchOptions.agent = httpsAgent;
    }

    console.log('Fetching trends overview from API...');
    const response = await fetch(overviewEndpoint, fetchOptions);

    if (!response.ok) {
      const errorText = await response.text();
      console.error(`API request failed with status: ${response.status}`, errorText);
      throw new Error(`API request failed with status: ${response.status}: ${errorText}`);
    }

    const responseText = await response.text();
    let data: TrendsOverviewResponse;

    try {
      data = JSON.parse(responseText);
    } catch (parseError) {
      console.error('Failed to parse JSON response:', parseError);
      throw new Error('API returned invalid JSON response');
    }

    console.log(`Fetched ${data.data.categories.length} categories successfully`);

    // Generate HTML email
    const emailHTML = generateNewsletterOverviewHTML({
      categories: data.data.categories,
      generatedAt: data.request_info.generated_at,
      language: data.request_info.language
    });

    // Get recipients from JSON file
    const recipients = getNewsletterRecipients();
    console.log(`Sending newsletter to ${recipients.length} recipients...`);

    // Get email send interval from environment or use default (45 seconds)
    const intervalSeconds = parseInt(process.env.EMAIL_SEND_INTERVAL_SECONDS || '45', 10);

    // Send emails with intervals to avoid spam detection
    // Using default sender info from environment variables
    const emailResults = await gmailService.sendBulkEmailsWithInterval(
      undefined, // fromUser - uses EMAIL_FROM_ADDRESS from env
      recipients,
      'Weekly Fashion Trends Overview',
      emailHTML,
      true,
      undefined, // senderName - uses EMAIL_SENDER_NAME from env
      intervalSeconds
    );

    // Log results
    const successful = emailResults.filter(r => r.success).length;
    const failed = emailResults.filter(r => !r.success).length;

    console.log(`Newsletter send complete: ${successful} successful, ${failed} failed`);

    return NextResponse.json({
      success: true,
      message: 'Newsletter sent successfully',
      results: {
        total: emailResults.length,
        successful,
        failed,
        details: emailResults
      },
      trends: {
        categoriesCount: data.data.categories.length,
        generatedAt: data.request_info.generated_at,
        language: data.request_info.language
      }
    });

  } catch (error) {
    console.error('Newsletter send error:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to send newsletter',
        details: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}
