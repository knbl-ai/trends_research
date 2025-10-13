import { NextRequest, NextResponse } from 'next/server';
import { TrendsApiRequest, TrendsApiResponse, FashionType, MilitaryType, SubcategoryType, TrendCategory } from '@/lib/types';
import { getPromptById } from '@/lib/models/prompt';

export async function POST(request: NextRequest) {
  try {
    // Parse the request body to get the subcategory type and trend category
    let subcategoryType: SubcategoryType = 'high-fashion';
    let trendCategory: TrendCategory = 'fashion';
    let customPrompt: string | undefined;
    let numImages: number = 3;

    try {
      const body = await request.json();
      // Support both old fashionType and new subcategoryType
      subcategoryType = body.subcategoryType || body.fashionType || body.militaryType || 'high-fashion';
      trendCategory = body.trendCategory || 'fashion';
      customPrompt = body.prompt;
      numImages = body.num_images !== undefined ? body.num_images : 3;
    } catch (parseError) {
      // If body parsing fails, use default values
      console.warn('Failed to parse request body, using defaults:', parseError);
    }

    // Use custom prompt if provided, otherwise get the default prompt from database
    let prompt = customPrompt;
    if (!prompt) {
      const promptDoc = await getPromptById(subcategoryType, trendCategory);
      if (!promptDoc) {
        return NextResponse.json(
          { error: `Prompt not found for ${trendCategory} type: ${subcategoryType}` },
          { status: 404 }
        );
      }
      prompt = promptDoc.prompt;
    }

    const trendsRequest: TrendsApiRequest = {
      type: "reasoning",
      prompt: prompt,
      images_num: numImages,
      trend_category: trendCategory
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
      {
        error: 'Failed to fetch trends data',
        details: error instanceof Error ? error.message : 'Unknown error',
        stack: error instanceof Error ? error.stack : undefined
      },
      { status: 500 }
    );
  }
}