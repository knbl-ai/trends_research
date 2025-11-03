import { NextResponse } from 'next/server';

export async function GET() {
  const envVars = {
    GOOGLE_CLOUD_PRIVATE_KEY: process.env.GOOGLE_CLOUD_PRIVATE_KEY ? '✅ SET (length: ' + process.env.GOOGLE_CLOUD_PRIVATE_KEY.length + ')' : '❌ MISSING',
    GOOGLE_CLOUD_CLIENT_EMAIL: process.env.GOOGLE_CLOUD_CLIENT_EMAIL || '❌ MISSING',
    GOOGLE_CLOUD_PROJECT_ID: process.env.GOOGLE_CLOUD_PROJECT_ID || '❌ MISSING',
    EMAIL_FROM_ADDRESS: process.env.EMAIL_FROM_ADDRESS || '❌ MISSING',
    EMAIL_SENDER_NAME: process.env.EMAIL_SENDER_NAME || '❌ MISSING',
    TRENDS_RESEARCH_API: process.env.TRENDS_RESEARCH_API ? '✅ SET' : '❌ MISSING',
    TRENDS_RESEARCH_API_KEY: process.env.TRENDS_RESEARCH_API_KEY ? '✅ SET' : '❌ MISSING',
  };

  // Check if private key format is correct
  const privateKey = process.env.GOOGLE_CLOUD_PRIVATE_KEY || '';
  const hasLiteralBackslashN = privateKey.includes('\\n');
  const hasActualNewlines = privateKey.includes('\n') && !privateKey.includes('\\n');

  return NextResponse.json({
    message: 'Environment variables check',
    variables: envVars,
    privateKeyFormat: {
      hasLiteralBackslashN,
      hasActualNewlines,
      startsWithBegin: privateKey.startsWith('-----BEGIN'),
      endsWithEnd: privateKey.trim().endsWith('-----')
    },
    allSet: Object.values(envVars).every(v => !v.includes('❌'))
  });
}
