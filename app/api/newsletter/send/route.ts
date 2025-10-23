import { NextRequest, NextResponse } from 'next/server';
import { TrendsApiRequest, TrendsApiResponse } from '@/lib/types';
import { getPromptById } from '@/lib/models/prompt';
import gmailService from '@/lib/services/gmail';
import { generateNewsletterHTML } from '@/lib/templates/newsletter-email';
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
    // Verify this is being called by Vercel Cron or contains the correct authorization
    const authHeader = request.headers.get('authorization');
    const cronSecret = process.env.CRON_SECRET;

    // Allow requests from Vercel Cron or with the correct secret
    if (authHeader !== `Bearer ${cronSecret}`) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    console.log('Starting weekly newsletter send...');

    // Fetch high-fashion trends
    const subcategoryType = 'high-fashion';
    const trendCategory = 'fashion';

    // Get the prompt from database
    const promptDoc = await getPromptById(subcategoryType, trendCategory);
    if (!promptDoc) {
      return NextResponse.json(
        { error: `Prompt not found for ${trendCategory} type: ${subcategoryType}` },
        { status: 404 }
      );
    }

    const trendsRequest: TrendsApiRequest = {
      type: "reasoning",
      prompt: promptDoc.prompt,
      images_num: 3,
      trend_category: trendCategory
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

    // Make the API request to fetch trends
    const fetchOptions: any = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': apiKey,
      },
      body: JSON.stringify(trendsRequest),
    };

    if (apiEndpoint.startsWith('https://')) {
      fetchOptions.agent = httpsAgent;
    }

    console.log('Fetching trends from API...');
    const response = await fetch(apiEndpoint, fetchOptions);

    if (!response.ok) {
      const errorText = await response.text();
      console.error(`API request failed with status: ${response.status}`, errorText);
      throw new Error(`API request failed with status: ${response.status}: ${errorText}`);
    }

    const responseText = await response.text();
    let data: TrendsApiResponse;

    try {
      data = JSON.parse(responseText);
    } catch (parseError) {
      console.error('Failed to parse JSON response:', parseError);
      throw new Error('API returned invalid JSON response');
    }

    // Get the last 3 trends
    const top3Trends = data.data.trends.slice(-3);

    console.log(`Fetched ${top3Trends.length} trends successfully`);

    // Generate HTML email
    const emailHTML = generateNewsletterHTML({
      trends: top3Trends,
      generatedAt: data.request_info.generated_at,
      subcategoryName: promptDoc.name
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
      `Weekly Fashion Trends - ${promptDoc.name}`,
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
        count: top3Trends.length,
        generatedAt: data.request_info.generated_at
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
