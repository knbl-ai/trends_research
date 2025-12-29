import { NextRequest, NextResponse } from 'next/server';
import { getAllPrompts } from '@/lib/models/prompt';
import { TrendCategory } from '@/lib/types';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const category = (searchParams.get('category') || 'fashion') as TrendCategory;

    if (category !== 'fashion' && category !== 'military' && category !== 'bakery') {
      return NextResponse.json(
        {
          success: false,
          error: 'Invalid category. Must be "fashion", "military", or "bakery"'
        },
        { status: 400 }
      );
    }

    const prompts = await getAllPrompts(category);

    return NextResponse.json({
      success: true,
      data: prompts,
      category
    });
  } catch (error) {
    console.error('Failed to fetch prompts:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to fetch prompts',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}
