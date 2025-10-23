import { NextRequest, NextResponse } from 'next/server';
import { TrendsApiRequest, TrendsApiResponse } from '@/lib/types';
import { getPromptById } from '@/lib/models/prompt';
import gmailService from '@/lib/services/gmail';
import { generateNewsletterHTML } from '@/lib/templates/newsletter-email';
import https from 'https';
import fetch from 'node-fetch';

export async function POST(request: NextRequest) {
  try {
    // Parse request body to get test email (no auth required for test endpoint)
    const body = await request.json();
    const testEmail = body.email || 'vladi@kanibal.co.il';

    console.log(`Sending test newsletter to: ${testEmail}`);

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

    // Send test email
    console.log(`Sending test email to: ${testEmail}`);

    const result = await gmailService.sendEmail(
      'ai@kanibal.co.il',
      testEmail,
      `[TEST] Weekly Fashion Trends - ${promptDoc.name}`,
      emailHTML,
      true,
      'Kanibal Fashion Trends'
    );

    console.log('Test newsletter sent successfully');

    return NextResponse.json({
      success: true,
      message: `Test newsletter sent successfully to ${testEmail}`,
      result,
      trends: {
        count: top3Trends.length,
        generatedAt: data.request_info.generated_at
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
