#!/usr/bin/env ts-node
/**
 * Test Newsletter Script - Sends to First Recipient
 *
 * This script reads the first active recipient from newsletter-recipients.json
 * and sends them a test newsletter by calling the test API endpoint.
 *
 * Usage:
 *   npx tsx scripts/test-newsletter-first.ts
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

async function sendTestNewsletter() {
  try {
    console.log('📧 Test Newsletter Script - First Recipient\n');
    console.log('='.repeat(50));

    // Read recipients file
    const recipientsPath = path.join(process.cwd(), 'config', 'newsletter-recipients.json');
    console.log(`\n📁 Reading recipients from: ${recipientsPath}`);

    if (!fs.existsSync(recipientsPath)) {
      throw new Error('Recipients file not found');
    }

    const recipientsData = fs.readFileSync(recipientsPath, 'utf-8');
    const config: RecipientsConfig = JSON.parse(recipientsData);

    // Get first active recipient
    const firstRecipient = config.recipients.find(r => r.active);

    if (!firstRecipient) {
      throw new Error('No active recipients found in config');
    }

    console.log(`\n✅ First active recipient found:`);
    console.log(`   Name: ${firstRecipient.name}`);
    console.log(`   Email: ${firstRecipient.email}`);
    console.log(`   Added: ${firstRecipient.addedAt}`);

    // Determine the API endpoint
    const apiUrl = process.env.NEXT_PUBLIC_APP_URL
      ? `${process.env.NEXT_PUBLIC_APP_URL}/api/newsletter/test`
      : 'http://localhost:3000/api/newsletter/test';

    console.log(`\n🚀 Sending test newsletter to: ${firstRecipient.email}`);
    console.log(`   API Endpoint: ${apiUrl}`);
    console.log(`\n⏳ Please wait... (this may take 20-40 seconds to fetch trends and generate images)\n`);

    const startTime = Date.now();

    // Call the test endpoint
    const response = await fetch(apiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email: firstRecipient.email
      })
    });

    const duration = ((Date.now() - startTime) / 1000).toFixed(2);

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`API request failed (${response.status}): ${errorText}`);
    }

    const result = await response.json();

    console.log('='.repeat(50));
    console.log(`\n✅ SUCCESS! Test newsletter sent in ${duration}s\n`);
    console.log(`📊 Results:`);
    console.log(`   Recipient: ${firstRecipient.name} (${firstRecipient.email})`);
    console.log(`   Trends included: ${result.trends.count}`);
    console.log(`   Generated at: ${result.trends.generatedAt}`);
    console.log(`   Message ID: ${result.result.messageId || 'N/A'}`);

    console.log(`\n💡 Check ${firstRecipient.email}'s inbox for the test newsletter!`);
    console.log('\n' + '='.repeat(50) + '\n');

  } catch (error) {
    console.error('\n❌ ERROR: Failed to send test newsletter');
    console.error(`\nDetails: ${error instanceof Error ? error.message : 'Unknown error'}`);

    if (error instanceof Error && error.message.includes('fetch')) {
      console.error('\n💡 Tip: Make sure your dev server is running (npm run dev)');
    }

    console.log('\n' + '='.repeat(50) + '\n');
    process.exit(1);
  }
}

// Run the script
sendTestNewsletter();
