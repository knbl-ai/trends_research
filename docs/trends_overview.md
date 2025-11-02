# API Documentation

Welcome to the Social Media Agent API documentation.

## Available Endpoints

### Trends Overview API

Get comprehensive fashion trend overviews across 6 major categories with AI-generated images and multi-language support.

**Documentation:**
- 📘 [Complete API Documentation](./API_TRENDS_OVERVIEW.md) - Full reference with all details
- ⚡ [Quick Start Guide](./QUICKSTART_TRENDS_OVERVIEW.md) - Get started in 5 minutes

**Key Features:**
- 6 fashion categories (High Fashion, Street Fashion, Casual, Celebrities, Social Media, Wellness)
- AI-generated images for each trend
- Translation into 40+ languages
- Web research with citations
- 20-40 second response time

**Quick Example:**
```bash
curl -X POST "https://your-domain.com/api/v1/trends-research/trends-overview" \
  -H "Content-Type: application/json" \
  -H "X-API-Key: YOUR_API_KEY" \
  -d '{"language": "Hebrew", "production": false}'
```

---

## Getting Started

1. **Get Your API Key**
   - Contact your administrator or sign up at `https://your-domain.com/signup`

2. **Choose Your Endpoint**
   - [Trends Overview](./QUICKSTART_TRENDS_OVERVIEW.md) - Fashion trend snapshots

3. **Make Your First Request**
   - Follow the quick start guide for your chosen endpoint

4. **Integrate**
   - Use our code examples in Python, JavaScript, PHP, etc.

---

## Authentication

All API requests require an API key in the header:

```http
X-API-Key: your_api_key_here
```

---

## Rate Limits

| Tier | Requests/Minute | Requests/Day |
|------|-----------------|--------------|
| Free | 5 | 100 |
| Basic | 10 | 500 |
| Pro | 30 | 2000 |
| Enterprise | Custom | Custom |

---

## Support

- **Email:** api@your-domain.com
- **Documentation:** https://docs.your-domain.com
- **API Status:** https://status.your-domain.com
- **Community:** https://community.your-domain.com

---

## Updates

Subscribe to our [changelog](https://your-domain.com/changelog) for API updates and new features.

---

## License

API usage is subject to our [Terms of Service](https://your-domain.com/terms).
