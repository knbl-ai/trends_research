import { NextRequest, NextResponse } from 'next/server';
import { updatePrompt, getPromptById } from '@/lib/models/prompt';
import { SubcategoryType, TrendCategory } from '@/lib/types';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const { searchParams } = new URL(request.url);
    const category = (searchParams.get('category') || 'fashion') as TrendCategory;

    const prompt = await getPromptById(id as SubcategoryType, category);

    if (!prompt) {
      return NextResponse.json(
        {
          success: false,
          error: 'Prompt not found'
        },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: prompt
    });
  } catch (error) {
    console.error('Failed to fetch prompt:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to fetch prompt',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();
    const { name, prompt, category } = body;
    const trendCategory = (category || 'fashion') as TrendCategory;

    if (!prompt && !name) {
      return NextResponse.json(
        {
          success: false,
          error: 'No updates provided'
        },
        { status: 400 }
      );
    }

    const updates: { name?: string; prompt?: string } = {};
    if (name) updates.name = name;
    if (prompt) updates.prompt = prompt;

    const updatedPrompt = await updatePrompt(id as SubcategoryType, updates, trendCategory);

    if (!updatedPrompt) {
      return NextResponse.json(
        {
          success: false,
          error: 'Prompt not found'
        },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: 'Prompt updated successfully',
      data: updatedPrompt
    });
  } catch (error) {
    console.error('Failed to update prompt:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to update prompt',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}
