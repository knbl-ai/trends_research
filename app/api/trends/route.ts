import { NextRequest, NextResponse } from 'next/server';
import { TrendsApiRequest, TrendsApiResponse } from '@/lib/types';
import { FashionType, getPromptByType } from '@/lib/prompts';

export async function POST(request: NextRequest) {
  try {
    // Parse the request body to get the fashion type
    const body = await request.json();
    const fashionType: FashionType = body.fashionType || 'high-fashion';

    // Get the appropriate prompt for the selected fashion type
    const prompt = getPromptByType(fashionType);

    const trendsRequest: TrendsApiRequest = {
      type: "reasoning",
      prompt: prompt,
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