#!/usr/bin/env ts-node
/**
 * Manual Newsletter Send Script - All Recipients
 *
 * This script manually triggers the newsletter send to ALL active recipients
 * in newsletter-recipients.json. This sends real emails (not test emails).
 *
 * Usage:
 *   npx tsx scripts/send-newsletter-all.ts
 *
 * WARNING: This will send real newsletters to all active recipients!
 */

import fs from 'fs';
import path from 'path';

interface Recipient {
  email: string;
  name: string;
  active: boolean;
  addedAt: string;
}

interface RecipientsConfig {
  recipients: Recipient[];
  metadata: {
    lastUpdated: string;
    description: string;
  };
}

async function sendNewsletterToAll() {
  try {
    console.log('📧 Manual Newsletter Send - All Recipients\n');
    console.log('='.repeat(60));

    // Read recipients file
    const recipientsPath = path.join(process.cwd(), 'config', 'newsletter-recipients.json');
    console.log(`\n📁 Reading recipients from: ${recipientsPath}`);

    if (!fs.existsSync(recipientsPath)) {
      throw new Error('Recipients file not found');
    }

    const recipientsData = fs.readFileSync(recipientsPath, 'utf-8');
    const config: RecipientsConfig = JSON.parse(recipientsData);

    // Get all active recipients
    const activeRecipients = config.recipients.filter(r => r.active);

    if (activeRecipients.length === 0) {
      throw new Error('No active recipients found in config');
    }

    console.log(`\n✅ Found ${activeRecipients.length} active recipients:`);
    activeRecipients.forEach((r, i) => {
      console.log(`   ${i + 1}. ${r.name} (${r.email})`);
    });

    // Get CRON_SECRET from environment
    const cronSecret = process.env.CRON_SECRET;
    if (!cronSecret) {
      throw new Error('CRON_SECRET environment variable not set');
    }

    // Determine the API endpoint
    const apiUrl = process.env.NEXT_PUBLIC_APP_URL
      ? `${process.env.NEXT_PUBLIC_APP_URL}/api/newsletter/send`
      : 'http://localhost:3000/api/newsletter/send';

    console.log(`\n🚀 Sending newsletter to all ${activeRecipients.length} recipients...`);
    console.log(`   API Endpoint: ${apiUrl}`);
    console.log(`   This will:`);
    console.log(`   - Fetch latest trends from production API`);
    console.log(`   - Generate 6 trend categories with images`);
    console.log(`   - Send Hebrew newsletter with English subject`);
    console.log(`   - Use 45-second intervals between sends`);
    console.log(`\n⚠️  WARNING: This sends REAL newsletters (no [TEST] prefix)`);
    console.log(`\n⏳ Estimated time: ~${Math.ceil(activeRecipients.length * 45 / 60)} minutes for all recipients`);
    console.log(`   (Plus ~30-40 seconds for API to generate trends)\n`);

    // Ask for confirmation
    console.log('⏸  Press Ctrl+C to cancel, or wait 5 seconds to continue...\n');
    await new Promise(resolve => setTimeout(resolve, 5000));

    const startTime = Date.now();

    // Call the newsletter send endpoint
    const response = await fetch(apiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${cronSecret}`
      }
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`API request failed (${response.status}): ${errorText}`);
    }

    const result = await response.json();

    const duration = ((Date.now() - startTime) / 1000).toFixed(2);

    console.log('='.repeat(60));
    console.log(`\n✅ SUCCESS! Newsletter send completed in ${duration}s\n`);
    console.log(`📊 Results:`);
    console.log(`   Total recipients: ${result.results.total}`);
    console.log(`   Successful: ${result.results.successful}`);
    console.log(`   Failed: ${result.results.failed}`);
    console.log(`   Categories sent: ${result.trends.categoriesCount}`);
    console.log(`   Language: ${result.trends.language}`);
    console.log(`   Generated at: ${result.trends.generatedAt}`);

    if (result.results.failed > 0) {
      console.log(`\n⚠️  Failed sends:`);
      result.results.details
        .filter((d: any) => !d.success)
        .forEach((d: any) => {
          console.log(`   - ${d.email}: ${d.error}`);
        });
    }

    console.log(`\n💡 All successful recipients should receive the newsletter in their inbox!`);
    console.log('\n' + '='.repeat(60) + '\n');

  } catch (error) {
    console.error('\n❌ ERROR: Failed to send newsletter');
    console.error(`\nDetails: ${error instanceof Error ? error.message : 'Unknown error'}`);

    if (error instanceof Error) {
      if (error.message.includes('fetch')) {
        console.error('\n💡 Tip: Make sure your dev server is running (npm run dev)');
      } else if (error.message.includes('CRON_SECRET')) {
        console.error('\n💡 Tip: Make sure CRON_SECRET is set in your .env.local file');
      } else if (error.message.includes('Unauthorized')) {
        console.error('\n💡 Tip: Check that CRON_SECRET matches between .env.local and Vercel');
      }
    }

    console.log('\n' + '='.repeat(60) + '\n');
    process.exit(1);
  }
}

// Run the script
sendNewsletterToAll();
