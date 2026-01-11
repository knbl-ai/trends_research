import { NextRequest, NextResponse } from 'next/server';
import { TrendsOverviewRequest, TrendsOverviewResponse } from '@/lib/types-overview';
import gmailService from '@/lib/services/gmail';
import { generateNewsletterOverviewHTML } from '@/lib/templates/newsletter-overview-email';
import https from 'https';
import fetch from 'node-fetch';

export async function POST(request: NextRequest) {
    try {
        // Parse request body to get test email
        const body = await request.json();
        const testEmail = body.email || 'vladi@kanibal.co.il';

        console.log(`Sending test bakery newsletter to: ${testEmail}`);

        // Prepare trends overview request with English language (as requested)
        const trendsRequest: TrendsOverviewRequest = {
            language: "English",
            production: true
        };

        // Bakery specific endpoint
        const bakeryEndpoint = "https://socialmediaserveragent.xyz/api/v1/trends-research/bakery-trends-overview";
        const apiKey = process.env.TRENDS_RESEARCH_API_KEY;

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

        console.log('Fetching bakery trends overview from API for test...');
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

        // Generate HTML email
        const emailHTML = generateNewsletterOverviewHTML({
            categories: data.data.categories,
            generatedAt: data.request_info.generated_at,
            language: data.request_info.language,
            trendType: 'bakery'
        });

        // Send test email
        console.log(`Sending test bakery email to: ${testEmail}`);

        const result = await gmailService.sendEmail(
            undefined, // fromUser - uses EMAIL_FROM_ADDRESS from env
            testEmail,
            `[TEST] Weekly Bakery Trends Overview`,
            emailHTML,
            true,
            undefined // senderName - uses EMAIL_SENDER_NAME from env
        );

        console.log('Test bakery newsletter sent successfully');

        return NextResponse.json({
            success: true,
            message: `Test bakery newsletter sent successfully to ${testEmail}`,
            result,
            trends: {
                categoriesCount: data.data.categories.length,
                generatedAt: data.request_info.generated_at
            }
        });

    } catch (error) {
        console.error('Test bakery newsletter send error:', error);
        return NextResponse.json(
            {
                success: false,
                error: 'Failed to send test bakery newsletter',
                details: error instanceof Error ? error.message : 'Unknown error',
            },
            { status: 500 }
        );
    }
}
