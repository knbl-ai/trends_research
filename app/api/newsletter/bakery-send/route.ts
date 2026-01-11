import { NextRequest, NextResponse } from 'next/server';
import { TrendsOverviewRequest, TrendsOverviewResponse } from '@/lib/types-overview';
import gmailService from '@/lib/services/gmail';
import { generateNewsletterOverviewHTML } from '@/lib/templates/newsletter-overview-email';
import https from 'https';
import fetch from 'node-fetch';
import fs from 'fs';
import path from 'path';

// Load bakery recipients from JSON file
function getBakeryNewsletterRecipients() {
    try {
        const recipientsPath = path.join(process.cwd(), 'config', 'bakery-newsletter-recipients.json');
        const recipientsData = fs.readFileSync(recipientsPath, 'utf-8');
        const data = JSON.parse(recipientsData);

        // Filter only active recipients
        return data.recipients
            .filter((recipient: any) => recipient.active)
            .map((recipient: any) => recipient.email);
    } catch (error) {
        console.error('Failed to load bakery recipients from JSON:', error);
        // Fallback to minimal recipients if file fails
        return [
            'noa@roladin.co.il',
            'orit@roladin.co.il',
            'Holly@roladin.co.il',
            'reut@roladin.co.il',
            'natalia@roladin.co.il'
        ];
    }
}

// Shared handler for both GET (Vercel Cron) and POST (manual trigger)
async function handleBakeryNewsletterSend(request: NextRequest) {
    try {
        // Verify this is being called by Vercel Cron OR manual trigger with secret
        const userAgent = request.headers.get('user-agent') || '';
        const authHeader = request.headers.get('authorization') || '';
        const cronSecret = process.env.CRON_SECRET;

        const isVercelCron = userAgent.includes('vercel-cron');
        const isManualTrigger = cronSecret && authHeader === `Bearer ${cronSecret}`;

        if (!isVercelCron && !isManualTrigger) {
            console.error('Unauthorized request - not from Vercel Cron or valid manual trigger');
            return NextResponse.json(
                { error: 'Unauthorized - Must be triggered by Vercel Cron or with valid authorization' },
                { status: 401 }
            );
        }

        console.log(`Bakery newsletter triggered by: ${isVercelCron ? 'Vercel Cron' : 'Manual trigger'}`);
        console.log('Starting weekly bakery newsletter send...');

        // Prepare trends overview request with English language (as requested)
        const trendsRequest: TrendsOverviewRequest = {
            language: "English",
            production: true
        };

        // Bakery specific endpoint and key
        // Using the endpoint provided by the user
        const bakeryEndpoint = "https://socialmediaserveragent.xyz/api/v1/trends-research/bakery-trends-overview";
        const apiKey = process.env.TRENDS_RESEARCH_API_KEY; // Reusing key as instructed or assuming same key logic

        if (!apiKey) {
            return NextResponse.json(
                { error: 'TRENDS_RESEARCH_API_KEY not configured' },
                { status: 500 }
            );
        }

        // Create HTTPS agent for self-signed certificates
        const httpsAgent = new https.Agent({
            rejectUnauthorized: false,
        });

        const fetchOptions: any = {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'x-api-key': apiKey,
            },
            body: JSON.stringify(trendsRequest),
        };

        if (bakeryEndpoint.startsWith('https://')) {
            fetchOptions.agent = httpsAgent;
        }

        console.log('Fetching bakery trends overview from API...');
        const response = await fetch(bakeryEndpoint, fetchOptions);

        if (!response.ok) {
            const errorText = await response.text();
            console.error(`API request failed with status: ${response.status}`, errorText);
            throw new Error(`API request failed with status: ${response.status}: ${errorText}`);
        }

        const responseText = await response.text();
        let data: TrendsOverviewResponse;

        try {
            data = JSON.parse(responseText);
        } catch (parseError) {
            console.error('Failed to parse JSON response:', parseError);
            throw new Error('API returned invalid JSON response');
        }

        console.log(`Fetched ${data.data.categories.length} bakery categories successfully`);

        // Generate HTML email
        const emailHTML = generateNewsletterOverviewHTML({
            categories: data.data.categories,
            generatedAt: data.request_info.generated_at,
            language: data.request_info.language,
            trendType: 'bakery'
        });

        // Get recipients from JSON file
        const recipients = getBakeryNewsletterRecipients();
        console.log(`Sending bakery newsletter to ${recipients.length} recipients...`);

        // Get email send interval from environment or use default (45 seconds)
        const intervalSeconds = parseInt(process.env.EMAIL_SEND_INTERVAL_SECONDS || '45', 10);

        // Send emails with intervals to avoid spam detection
        const emailResults = await gmailService.sendBulkEmailsWithInterval(
            undefined, // fromUser - uses EMAIL_FROM_ADDRESS from env
            recipients,
            'Weekly Bakery Trends Overview',
            emailHTML,
            true,
            undefined, // senderName - uses EMAIL_SENDER_NAME from env
            intervalSeconds
        );

        // Log results
        const successful = emailResults.filter(r => r.success).length;
        const failed = emailResults.filter(r => !r.success).length;

        console.log(`Bakery newsletter send complete: ${successful} successful, ${failed} failed`);

        return NextResponse.json({
            success: true,
            message: 'Bakery newsletter sent successfully',
            results: {
                total: emailResults.length,
                successful,
                failed,
                details: emailResults
            },
            trends: {
                categoriesCount: data.data.categories.length,
                generatedAt: data.request_info.generated_at,
                language: data.request_info.language
            }
        });

    } catch (error) {
        console.error('Bakery newsletter send error:', error);
        return NextResponse.json(
            {
                success: false,
                error: 'Failed to send bakery newsletter',
                details: error instanceof Error ? error.message : 'Unknown error',
            },
            { status: 500 }
        );
    }
}

// GET handler for Vercel Cron
export async function GET(request: NextRequest) {
    return handleBakeryNewsletterSend(request);
}

// POST handler for manual triggers
export async function POST(request: NextRequest) {
    return handleBakeryNewsletterSend(request);
}
