import { NextRequest, NextResponse } from 'next/server';
import gmailService from '@/lib/services/gmail';

export async function POST(request: NextRequest) {
  try {
    console.log('=== Gmail Service Debug Test ===');

    // Check environment variables
    console.log('Checking environment variables...');
    const privateKeyExists = !!process.env.GOOGLE_CLOUD_PRIVATE_KEY;
    const privateKeyType = typeof process.env.GOOGLE_CLOUD_PRIVATE_KEY;
    const privateKeyLength = process.env.GOOGLE_CLOUD_PRIVATE_KEY?.length || 0;
    const clientEmailExists = !!process.env.GOOGLE_CLOUD_CLIENT_EMAIL;
    const projectIdExists = !!process.env.GOOGLE_CLOUD_PROJECT_ID;

    console.log(`GOOGLE_CLOUD_PRIVATE_KEY exists: ${privateKeyExists}, type: ${privateKeyType}, length: ${privateKeyLength}`);
    console.log(`GOOGLE_CLOUD_CLIENT_EMAIL exists: ${clientEmailExists}`);
    console.log(`GOOGLE_CLOUD_PROJECT_ID exists: ${projectIdExists}`);

    // Try to initialize Gmail service
    console.log('Initializing Gmail service...');
    await gmailService.initialize();
    console.log('Gmail service initialized successfully!');

    // Try to send a test email
    const body = await request.json();
    const testEmail = body.email || 'vladi@kanibal.co.il';

    console.log(`Attempting to send test email to: ${testEmail}`);

    const result = await gmailService.sendEmail(
      undefined,
      testEmail,
      '[DEBUG TEST] Newsletter System Check',
      '<h1>Test Email</h1><p>If you received this, the Gmail service is working!</p>',
      true,
      undefined
    );

    console.log('Email sent successfully!');

    return NextResponse.json({
      success: true,
      message: 'Gmail service is working correctly',
      debug: {
        privateKeyExists,
        privateKeyType,
        privateKeyLength,
        clientEmailExists,
        projectIdExists
      },
      result
    });

  } catch (error) {
    console.error('Debug test error:', error);

    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
      stack: error instanceof Error ? error.stack : undefined,
      debug: {
        privateKeyExists: !!process.env.GOOGLE_CLOUD_PRIVATE_KEY,
        privateKeyType: typeof process.env.GOOGLE_CLOUD_PRIVATE_KEY,
        privateKeyLength: process.env.GOOGLE_CLOUD_PRIVATE_KEY?.length || 0,
      }
    }, { status: 500 });
  }
}
