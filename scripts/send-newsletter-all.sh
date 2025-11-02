#!/bin/bash
# Manual Newsletter Send - All Recipients
# Sends real newsletters to all active recipients

echo "📧 Manual Newsletter Send - All Recipients"
echo "============================================================"
echo ""

# Check if CRON_SECRET is set
if [ -z "$CRON_SECRET" ]; then
    echo "❌ Error: CRON_SECRET environment variable not set"
    echo "💡 Tip: Add it to your .env.local file or export it"
    exit 1
fi

# Read recipients file
RECIPIENTS_FILE="config/newsletter-recipients.json"

if [ ! -f "$RECIPIENTS_FILE" ]; then
    echo "❌ Error: Recipients file not found at $RECIPIENTS_FILE"
    exit 1
fi

# Count active recipients
ACTIVE_COUNT=$(grep -c '"active": true' "$RECIPIENTS_FILE")

echo "✅ Found $ACTIVE_COUNT active recipients"
echo ""
echo "🚀 Sending newsletter to all recipients..."
echo "   Endpoint: http://localhost:3000/api/newsletter/send"
echo ""
echo "⚠️  WARNING: This sends REAL newsletters (no [TEST] prefix)"
echo ""
echo "   This will:"
echo "   - Fetch latest trends from production API"
echo "   - Generate 6 trend categories with images"
echo "   - Send Hebrew newsletter with English subject"
echo "   - Use 45-second intervals between sends"
echo ""

# Calculate estimated time
ESTIMATED_MINUTES=$((ACTIVE_COUNT * 45 / 60 + 1))
echo "⏳ Estimated time: ~$ESTIMATED_MINUTES minutes"
echo ""
echo "⏸  Press Ctrl+C to cancel, or wait 5 seconds to continue..."
echo ""

sleep 5

echo "📤 Sending newsletter..."
echo ""

# Send the request
curl -s -X POST http://localhost:3000/api/newsletter/send \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $CRON_SECRET" \
  -w "\n\n✅ Request completed\nHTTP Status: %{http_code}\nTotal time: %{time_total}s\n" | \
  python3 -m json.tool 2>/dev/null || cat

echo ""
echo "============================================================"
echo "💡 Check recipients' inboxes for the newsletter!"
echo ""
