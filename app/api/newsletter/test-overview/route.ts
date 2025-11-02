import { NextRequest, NextResponse } from 'next/server';
import { TrendsOverviewRequest, TrendsOverviewResponse } from '@/lib/types-overview';
import gmailService from '@/lib/services/gmail';
import { generateNewsletterOverviewHTML } from '@/lib/templates/newsletter-overview-email';
import https from 'https';
import fetch from 'node-fetch';

export async function POST(request: NextRequest) {
  try {
    // Parse request body to get test email (no auth required for test endpoint)
    const body = await request.json();
    const testEmail = body.email || 'vladi@kanibal.co.il';

    console.log(`Sending test newsletter overview to: ${testEmail}`);

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

    // Send test email
    console.log(`Sending test email to: ${testEmail}`);

    const result = await gmailService.sendEmail(
      undefined, // fromUser - uses EMAIL_FROM_ADDRESS from env
      testEmail,
      '[TEST] Weekly Fashion Trends Overview',
      emailHTML,
      true,
      undefined // senderName - uses EMAIL_SENDER_NAME from env
    );

    console.log('Test newsletter sent successfully');

    return NextResponse.json({
      success: true,
      message: `Test newsletter sent successfully to ${testEmail}`,
      result,
      trends: {
        categoriesCount: data.data.categories.length,
        generatedAt: data.request_info.generated_at,
        language: data.request_info.language,
        categories: data.data.categories.map(c => c.category_name)
      }
    });

  } catch (error) {
    console.error('Test newsletter send error:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to send test newsletter',
        details: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}
