import { NextRequest, NextResponse } from 'next/server';
import { TrendsApiRequest, TrendsApiResponse, FashionType, MilitaryType, SubcategoryType, TrendCategory } from '@/lib/types';
import { getPromptById } from '@/lib/models/prompt';
import https from 'https';
import fetch from 'node-fetch';

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
      trend_category: trendCategory,
      aspect_ratio: trendCategory === 'fashion' ? '3:4' : '16:9',
      language: "English",
      production: true
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


    // Create a custom HTTPS agent that accepts the certificate for socialmediaserveragent.xyz
    // This is necessary because the domain may have certificate validation issues
    const httpsAgent = new https.Agent({
      rejectUnauthorized: false, // Accept self-signed or mismatched certificates for this API
    });

    // Make the API request
    const fetchOptions: any = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': apiKey,
      },
      body: JSON.stringify(trendsRequest),
    };

    // Only add HTTPS agent for HTTPS URLs
    if (apiEndpoint.startsWith('https://')) {
      fetchOptions.agent = httpsAgent;
    }

    const response = await fetch(apiEndpoint, fetchOptions);

    if (!response.ok) {
      const errorText = await response.text();
      console.error(`API request failed with status: ${response.status}`, errorText);
      throw new Error(`API request failed with status: ${response.status}: ${errorText}`);
    }

    const responseText = await response.text();

    // Parse the external API response
    let externalApiResponse: any;
    try {
      externalApiResponse = JSON.parse(responseText);
    } catch (parseError) {
      console.error('Failed to parse JSON response:', parseError);
      console.error('Response was:', responseText.substring(0, 1000));
      throw new Error('API returned invalid JSON response');
    }

    // Transform external API response to match our TrendsApiResponse type
    // Handle both nested structure (data.trends) and flat structure (trends)
    const trendsArray = externalApiResponse.data?.trends || externalApiResponse.trends || [];

    const data: TrendsApiResponse = {
      success: externalApiResponse.success || true,
      message: 'Trends fetched successfully',
      data: {
        type: trendsRequest.type,
        total_trends: externalApiResponse.data?.total_trends || externalApiResponse.total_trends || trendsArray.length || 0,
        research_model: externalApiResponse.data?.research_model || externalApiResponse.metadata?.model || 'claude-sonnet',
        trends: trendsArray.map((trend: any, index: number) => ({
          number: index + 1,
          description: trend.description_english || trend.description || '',
          references: trend.references || [],
          image_prompts: trend.image_prompts || [],
          image_urls: trend.image_urls || trend.images?.map((img: any) => img.url) || [],
          images_count: trend.image_urls?.length || trend.images?.length || 0
        }))
      },
      request_info: {
        search_type: trendsRequest.type,
        trend_category: trendsRequest.trend_category || 'fashion',
        search_prompt: trendsRequest.prompt,
        images_per_trend: trendsRequest.images_num,
        generated_at: externalApiResponse.request_info?.generated_at || externalApiResponse.metadata?.generated_at || new Date().toISOString()
      }
    };

    // Get the last 3 trends (which contain the most detailed descriptions)
    const top3Trends = data.data.trends.slice(-3);

    const finalResponse = {
      ...data,
      data: {
        ...data.data,
        trends: top3Trends,
        total_trends: 3
      }
    };

    return NextResponse.json(finalResponse);

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