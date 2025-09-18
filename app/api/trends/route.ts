import { NextResponse } from 'next/server';
import { TrendsApiRequest, TrendsApiResponse } from '@/lib/types';

export async function POST() {
  try {
    // Hardcoded request as specified by the user
    const trendsRequest: TrendsApiRequest = {
      type: "reasoning",
      prompt: "Research the top 3 most current fashion trends (2025-late) globally. For each trend, provide:A detailed description of what the trend is, including how it's showing up in runway shows, streetwear, and consumer behaviour.Key sub-elements (colours, cuts, fabrics, inspirations, accessories).How and why it has emerged (cultural, economic, social drivers). Links to web sources where information was taken from. Output should be a numbered list (1,2,3), one trend per number.",
      images_num: 3
    };

    // Get the API endpoint and key from environment variables
    const apiEndpoint = process.env.TRENDS_RESEARCH_API;
    const apiKey = process.env.TRENDS_RESEARCH_API_KEY;

    if (!apiEndpoint) {
      return NextResponse.json(
        { error: 'TRENDS_RESEARCH_API environment variable is not set' },
        { status: 500 }
      );
    }

    if (!apiKey) {
      return NextResponse.json(
        { error: 'TRENDS_RESEARCH_API_KEY environment variable is not set' },
        { status: 500 }
      );
    }

    // Log request details for debugging
    console.log('Making API request to:', apiEndpoint);
    console.log('Request headers:', { 'Content-Type': 'application/json', 'x-api-key': apiKey?.substring(0, 8) + '...' });
    console.log('Request body:', JSON.stringify(trendsRequest, null, 2));

    // Make the API request
    const response = await fetch(apiEndpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': apiKey,
      },
      body: JSON.stringify(trendsRequest),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error(`API request failed with status: ${response.status}`, errorText);
      throw new Error(`API request failed with status: ${response.status}: ${errorText}`);
    }

    const responseText = await response.text();
    console.log('API Response:', responseText.substring(0, 500)); // Log first 500 chars

    let data: TrendsApiResponse;
    try {
      data = JSON.parse(responseText);
    } catch (parseError) {
      console.error('Failed to parse JSON response:', parseError);
      console.error('Response was:', responseText.substring(0, 1000));
      throw new Error('API returned invalid JSON response');
    }

    // Get the last 3 trends (which contain the most detailed descriptions)
    const top3Trends = data.data.trends.slice(-3);

    return NextResponse.json({
      ...data,
      data: {
        ...data.data,
        trends: top3Trends,
        total_trends: 3
      }
    });

  } catch (error) {
    console.error('Trends API Error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch trends data' },
      { status: 500 }
    );
  }
}