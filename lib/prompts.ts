export type FashionType = 'high-fashion' | 'street-fashion' | 'casual' | 'social-media' | 'celebrities' | 'wellness';

export interface FashionStyleConfig {
  id: FashionType;
  name: string;
  prompt: string;
}

export const FASHION_PROMPTS: Record<FashionType, FashionStyleConfig> = {
  'high-fashion': {
    id: 'high-fashion',
    name: 'High Fashion',
    prompt: "Research the top 3 most current fashion trends (2025-late) globally. For each trend, provide: A detailed description of what the trend is, including how it's showing up in runway shows, streetwear, and consumer behaviour. Key sub-elements (colours, cuts, fabrics, inspirations, accessories). How and why it has emerged (cultural, economic, social drivers). Links to web sources where information was taken from. Output should be a numbered list (1,2,3), one trend per number."
  },
  'street-fashion': {
    id: 'street-fashion',
    name: 'Street Fashion',
    prompt: "Research the top 3 most current street fashion trends (2025-late) globally. For each trend, provide: A detailed description of what the trend is, including how it's showing up in urban environments, skateboarding culture, hip-hop scene, and everyday street style. Key sub-elements (colours, cuts, fabrics, streetwear brands, accessories, sneakers). How and why it has emerged (cultural movements, music influence, social drivers, youth culture). Links to web sources where information was taken from. Output should be a numbered list (1,2,3), one trend per number."
  },
  'casual': {
    id: 'casual',
    name: 'Casual',
    prompt: "Research the top 3 most current casual fashion trends (2025-late) globally. For each trend, provide: A detailed description of what the trend is, including how it's showing up in everyday wear, work-from-home attire, comfort-focused fashion, and relaxed lifestyle clothing. Key sub-elements (colours, cuts, comfortable fabrics, loungewear, athleisure, accessories). How and why it has emerged (lifestyle changes, remote work culture, health consciousness, comfort priorities). Links to web sources where information was taken from. Output should be a numbered list (1,2,3), one trend per number."
  },
  'social-media': {
    id: 'social-media',
    name: 'Social Media',
    prompt: "Research the top 3 most current social media fashion trends (2025-late) globally. For each trend, provide: A detailed description of what the trend is, including how it's showing up on Instagram, TikTok, Pinterest, and influencer content. Key sub-elements (colours, cuts, fabrics, viral pieces, photo-ready accessories, trending hashtags). How and why it has emerged (viral content, influencer endorsements, social media algorithms, Gen Z preferences). Links to web sources where information was taken from. Output should be a numbered list (1,2,3), one trend per number."
  },
  'celebrities': {
    id: 'celebrities',
    name: 'Celebrities',
    prompt: "Research the top 3 most current celebrity fashion trends (2025-late) globally. For each trend, provide: A detailed description of what the trend is, including how it's showing up in red carpet events, paparazzi photos, celebrity endorsements, and award shows. Key sub-elements (colours, cuts, designer brands, statement pieces, luxury accessories, celebrity styling). How and why it has emerged (celebrity influence, designer partnerships, media coverage, fan culture). Links to web sources where information was taken from. Output should be a numbered list (1,2,3), one trend per number."
  },
  'wellness': {
    id: 'wellness',
    name: 'Wellness',
    prompt: "Research the top 3 most current wellness fashion trends (2025-late) globally. For each trend, provide: A detailed description of what the trend is, including how it's showing up in activewear, mindful fashion, sustainable materials, and health-conscious clothing. Key sub-elements (colours, cuts, fabrics with wellness properties, breathable materials, eco-friendly brands, wellness accessories). How and why it has emerged (health consciousness, mindfulness movement, sustainability, holistic lifestyle, mental health awareness). Links to web sources where information was taken from. Output should be a numbered list (1,2,3), one trend per number."
  }
};

export function getPromptByType(type: FashionType): string {
  return FASHION_PROMPTS[type].prompt;
}

export function getAllFashionTypes(): FashionStyleConfig[] {
  return Object.values(FASHION_PROMPTS);
}