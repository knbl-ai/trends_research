# Newsletter Test Scripts

Scripts to test the newsletter functionality before sending to all recipients.

## Available Scripts

### 1. test-newsletter-first.ts (Recommended)

TypeScript script that reads the first active recipient from `config/newsletter-recipients.json` and sends them a test newsletter.

**Usage:**
```bash
# Make sure dev server is running first
npm run dev

# In another terminal, run:
npm run test:newsletter
```

**Features:**
- Reads first active recipient from config
- Displays recipient info before sending
- Shows detailed progress and results
- Times the entire operation
- Error handling with helpful messages

---

### 2. test-newsletter-first.sh (Quick Version)

Simple bash script using curl for quick testing.

**Usage:**
```bash
# Make sure dev server is running first
npm run dev

# In another terminal, run:
./scripts/test-newsletter-first.sh
```

**Features:**
- Minimal dependencies (just curl)
- Fast execution
- Simple output

---

## Prerequisites

Before running any test script:

1. **Start the development server:**
   ```bash
   npm run dev
   ```

2. **Ensure environment variables are set:**
   - `TRENDS_RESEARCH_API` - External trends API endpoint
   - `TRENDS_RESEARCH_API_KEY` - API key for trends endpoint
   - `GOOGLE_CLOUD_PRIVATE_KEY` - Gmail credentials
   - `GOOGLE_CLOUD_CLIENT_EMAIL` - Gmail service email
   - `GOOGLE_CLOUD_PROJECT_ID` - Google Cloud project
   - `EMAIL_FROM_ADDRESS` - Sender email
   - `EMAIL_SENDER_NAME` - Display name for sender

3. **Have active recipients in config:**
   ```
   config/newsletter-recipients.json
   ```

---

## What the Test Does

1. Fetches latest fashion trends from the external API
2. Generates 3 AI images for each trend
3. Creates a beautiful HTML email using the newsletter template
4. Sends the email to the first active recipient
5. Reports success/failure with details

**Expected time:** 20-40 seconds (due to trend fetching and image generation)

---

## Testing Other Recipients

To test with a specific email address, you can call the API directly:

```bash
curl -X POST http://localhost:3000/api/newsletter/test \
  -H "Content-Type: application/json" \
  -d '{"email": "test@example.com"}'
```

---

## Testing All Recipients

To send test newsletter to all active recipients:

```bash
curl -X POST http://localhost:3000/api/newsletter/test-all \
  -H "Content-Type: application/json"
```

**Note:** This will send to ALL active recipients with 45-second intervals, so it may take several minutes.

---

## Troubleshooting

**"Connection refused" error:**
- Make sure `npm run dev` is running

**"TRENDS_RESEARCH_API not configured" error:**
- Check your `.env.local` file has the required environment variables

**"Failed to load recipients" error:**
- Verify `config/newsletter-recipients.json` exists and is valid JSON

**"Gmail service error" error:**
- Verify Google Cloud credentials are correctly set in environment variables

---

## Production Testing

For production (Vercel), you'll need to:

1. Deploy your changes
2. Set environment variables in Vercel dashboard
3. Use the production URL instead of localhost

```bash
curl -X POST https://your-app.vercel.app/api/newsletter/test \
  -H "Content-Type: application/json" \
  -d '{"email": "test@example.com"}'
```
