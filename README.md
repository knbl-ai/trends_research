# trends_research

# Fashion Trends Research App

A sophisticated Next.js application that researches the latest global fashion trends using AI-powered analysis. Built with a minimalistic, Vogue-inspired design aesthetic.

## Features

- **AI-Powered Trend Research**: Makes API calls to TRENDS_RESEARCH_API for comprehensive fashion trend analysis
- **Elegant Design**: Minimalistic, high-end fashion magazine aesthetic inspired by Vogue
- **Responsive Layout**: Optimized for all devices with sophisticated typography
- **Image Galleries**: Displays trend images with elegant hover effects
- **Source Links**: Direct links to research sources and references
- **Loading States**: Beautiful skeleton loading screens
- **Error Handling**: Graceful error states with retry functionality

## Tech Stack

- **Next.js 15** with App Router
- **TypeScript** for type safety
- **Tailwind CSS** for styling
- **shadcn/ui** components
- **Lucide React** icons
- **Google Fonts** (Playfair Display & Inter)

## Setup Instructions

### 1. Install Dependencies

```bash
npm install
```

### 2. Configure Environment Variables

Update the `.env.local` file with your TRENDS_RESEARCH_API endpoint and API key:

```env
TRENDS_RESEARCH_API=https://your-api-endpoint.com/trends
TRENDS_RESEARCH_API_KEY=your-api-key-here
```

### 3. Run the Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to view the application.

### 4. Build for Production

```bash
npm run build
npm start
```

## API Request Format

The app makes the following hardcoded request to your TRENDS_RESEARCH_API:

```json
{
  "type": "reasoning",
  "prompt": "Research the top 3 most current fashion trends (2025-late) globally. For each trend, provide: A detailed description of what the trend is, including how it's showing up in runway shows, streetwear, and consumer behaviour. Key sub-elements (colours, cuts, fabrics, inspirations, accessories). How and why it has emerged (cultural, economic, social drivers). Links to web sources where information was taken from. Output should be a numbered list (1,2,3), one trend per number.",
  "images_num": 3
}
```

## Expected API Response

Your TRENDS_RESEARCH_API should return data in this format:

```json
{
  "success": true,
  "message": "Successfully processed trends with images",
  "data": {
    "type": "trends_research",
    "total_trends": 3,
    "research_model": "sonar-reasoning",
    "trends": [
      {
        "number": 1,
        "description": "Detailed trend description...",
        "references": ["https://source1.com", "https://source2.com"],
        "image_urls": ["https://image1.jpg", "https://image2.jpg", "https://image3.jpg"],
        "images_count": 3
      }
    ]
  },
  "request_info": {
    "search_type": "reasoning",
    "search_prompt": "...",
    "images_per_trend": 3,
    "generated_at": "2025-09-18T16:04:28.737584"
  }
}
```

## File Structure

```
trends_app/
├── app/
│   ├── api/
│   │   └── trends/
│   │       └── route.ts          # API endpoint
│   ├── globals.css               # Global styles
│   ├── layout.tsx                # Root layout
│   └── page.tsx                  # Homepage
├── components/
│   ├── ui/                       # shadcn/ui components
│   ├── TrendCard.tsx             # Individual trend display
│   └── TrendsDisplay.tsx         # Main trends component
├── lib/
│   ├── types.ts                  # TypeScript types
│   └── utils.ts                  # Utilities
├── .env.local                    # Environment variables
├── components.json               # shadcn/ui config
├── next.config.js               # Next.js config
├── package.json
├── tailwind.config.ts
└── tsconfig.json
```

## Customization

### Styling
- Modify `app/globals.css` for global styles
- Update `tailwind.config.ts` for theme customization
- Edit component files for specific styling changes

### API Integration
- Update `app/api/trends/route.ts` to modify the API request
- Change `lib/types.ts` for different response formats

### Content
- Modify the hardcoded prompt in `app/api/trends/route.ts`
- Adjust `components/TrendsDisplay.tsx` for different layouts

## Development

```bash
# Run development server
npm run dev

# Run linting
npm run lint

# Build for production
npm run build
```

## License

MIT License - feel free to use this project for your fashion research needs!