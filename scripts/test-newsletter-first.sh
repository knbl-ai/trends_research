#!/bin/bash
# Test Newsletter Script - Simple curl version
# Sends newsletter to first active recipient

echo "📧 Test Newsletter - First Recipient"
echo "===================================================="
echo ""

# Read first active recipient from JSON
RECIPIENTS_FILE="config/newsletter-recipients.json"

if [ ! -f "$RECIPIENTS_FILE" ]; then
    echo "❌ Error: Recipients file not found at $RECIPIENTS_FILE"
    exit 1
fi

# Extract first active recipient's email using grep and sed
FIRST_EMAIL=$(grep -A 3 '"active": true' "$RECIPIENTS_FILE" | grep '"email"' | head -1 | sed 's/.*"email": "\([^"]*\)".*/\1/')
FIRST_NAME=$(grep -B 1 '"active": true' "$RECIPIENTS_FILE" | grep '"name"' | head -1 | sed 's/.*"name": "\([^"]*\)".*/\1/')

if [ -z "$FIRST_EMAIL" ]; then
    echo "❌ Error: No active recipient found"
    exit 1
fi

echo "✅ First active recipient:"
echo "   Name: $FIRST_NAME"
echo "   Email: $FIRST_EMAIL"
echo ""
echo "🚀 Sending test newsletter..."
echo "   Endpoint: http://localhost:3000/api/newsletter/test"
echo ""
echo "⏳ Please wait... (this may take 20-40 seconds)"
echo ""

# Send the request
curl -X POST http://localhost:3000/api/newsletter/test \
  -H "Content-Type: application/json" \
  -d "{\"email\": \"$FIRST_EMAIL\"}" \
  -w "\n\nHTTP Status: %{http_code}\nTotal time: %{time_total}s\n" \
  -s

echo ""
echo "===================================================="
echo "💡 Check $FIRST_EMAIL's inbox!"
echo ""
