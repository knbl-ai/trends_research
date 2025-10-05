import { NextRequest, NextResponse } from 'next/server';
import { TrendsApiRequest, TrendsApiResponse } from '@/lib/types';

type FashionType = 'high-fashion' | 'street-fashion' | 'casual' | 'social-media' | 'celebrities' | 'israel';

const FASHION_PROMPTS: Record<FashionType, string> = {
  'high-fashion': "Research the top 3 most current fashion trends (2025-late) globally. For each trend, provide: A detailed description of what the trend is, including how it's showing up in runway shows, streetwear, and consumer behaviour. Key sub-elements (colours, cuts, fabrics, inspirations, accessories). How and why it has emerged (cultural, economic, social drivers). Links to web sources where information was taken from. Output should be a numbered list (1,2,3), one trend per number.",
  'street-fashion': "Research the top 3 most current street fashion trends (2025-late) globally. For each trend, provide: A detailed description of what the trend is, including how it's showing up in urban environments, skateboarding culture, hip-hop scene, and everyday street style. Key sub-elements (colours, cuts, fabrics, streetwear brands, accessories, sneakers). How and why it has emerged (cultural movements, music influence, social drivers, youth culture). Links to web sources where information was taken from. Output should be a numbered list (1,2,3), one trend per number.",
  'casual': "Research the top 3 most current casual fashion trends (2025-late) globally. For each trend, provide: A detailed description of what the trend is, including how it's showing up in everyday wear, work-from-home attire, comfort-focused fashion, and relaxed lifestyle clothing. Key sub-elements (colours, cuts, comfortable fabrics, loungewear, athleisure, accessories). How and why it has emerged (lifestyle changes, remote work culture, health consciousness, comfort priorities). Links to web sources where information was taken from. Output should be a numbered list (1,2,3), one trend per number.",
  'social-media': "Research the top 3 most current social media fashion trends (2025-late) globally. For each trend, provide: A detailed description of what the trend is, including how it's showing up on Instagram, TikTok, Pinterest, and influencer content. Key sub-elements (colours, cuts, fabrics, viral pieces, photo-ready accessories, trending hashtags). How and why it has emerged (viral content, influencer endorsements, social media algorithms, Gen Z preferences). Links to web sources where information was taken from. Output should be a numbered list (1,2,3), one trend per number.",
  'celebrities': "Research the top 3 most current celebrity fashion trends (2025-late) globally. For each trend, provide: A detailed description of what the trend is, including how it's showing up in red carpet events, paparazzi photos, celebrity endorsements, and award shows. Key sub-elements (colours, cuts, designer brands, statement pieces, luxury accessories, celebrity styling). How and why it has emerged (celebrity influence, designer partnerships, media coverage, fan culture). Links to web sources where information was taken from. Output should be a numbered list (1,2,3), one trend per number.",
  'israel': "Research the top 3 most current Israeli fashion trends (2025-late) locally and regionally. For each trend, provide: A detailed description of what the trend is, including how it's showing up in Tel Aviv fashion scene, Israeli designers, Middle Eastern influences, and local street style. Key sub-elements (colours, cuts, fabrics inspired by climate/culture, Israeli brands, regional accessories). How and why it has emerged (local culture, climate considerations, Middle Eastern influences, Israeli fashion week, local designers). Links to web sources where information was taken from. Output should be a numbered list (1,2,3), one trend per number."
};

function getPromptByType(type: FashionType): string {
  return FASHION_PROMPTS[type];
}

export async function POST(request: NextRequest) {
  try {
    // Parse the request body to get the fashion type
    let fashionType: FashionType = 'high-fashion';
    let customPrompt: string | undefined;
    let numImages: number = 3;

    try {
      const body = await request.json();
      fashionType = body.fashionType || 'high-fashion';
      customPrompt = body.prompt;
      numImages = body.num_images !== undefined ? body.num_images : 3;
    } catch (parseError) {
      // If body parsing fails, use default fashion type
      console.warn('Failed to parse request body, using default fashion type:', parseError);
    }

    // Use custom prompt if provided, otherwise get the default prompt for the fashion type
    const prompt = customPrompt || getPromptByType(fashionType);

    const trendsRequest: TrendsApiRequest = {
      type: "reasoning",
      prompt: prompt,
      images_num: numImages
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