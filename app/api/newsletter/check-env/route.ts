import { NextResponse } from 'next/server';

export async function GET() {
  const envVars = {
    GOOGLE_CLOUD_PRIVATE_KEY: process.env.GOOGLE_CLOUD_PRIVATE_KEY ? '✅ SET' : '❌ MISSING',
    GOOGLE_CLOUD_CLIENT_EMAIL: process.env.GOOGLE_CLOUD_CLIENT_EMAIL ? '✅ SET' : '❌ MISSING',
    GOOGLE_CLOUD_PROJECT_ID: process.env.GOOGLE_CLOUD_PROJECT_ID ? '✅ SET' : '❌ MISSING',
    EMAIL_FROM_ADDRESS: process.env.EMAIL_FROM_ADDRESS ? '✅ SET' : '❌ MISSING',
    EMAIL_SENDER_NAME: process.env.EMAIL_SENDER_NAME ? '✅ SET' : '❌ MISSING',
    TRENDS_RESEARCH_API: process.env.TRENDS_RESEARCH_API ? '✅ SET' : '❌ MISSING',
    TRENDS_RESEARCH_API_KEY: process.env.TRENDS_RESEARCH_API_KEY ? '✅ SET' : '❌ MISSING',
  };

  return NextResponse.json({
    message: 'Environment variables check',
    variables: envVars,
    allSet: Object.values(envVars).every(v => v === '✅ SET')
  });
}
