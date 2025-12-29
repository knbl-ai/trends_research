export type BakeryType = 'hosting-platters' | 'breads' | 'cakes' | 'gift-boxes' | 'patisserie' | 'bakery-social-media';

export interface BakeryStyleConfig {
  id: BakeryType;
  name: string;
  prompt: string;
}

export const BAKERY_PROMPTS: Record<BakeryType, BakeryStyleConfig> = {
  'hosting-platters': {
    id: 'hosting-platters',
    name: 'Hosting Platters',
    prompt: "Research the top 3 most current hosting and dessert platter trends (2025-late) in the bakery and catering industry globally. For each trend, provide: A detailed description of what the trend is, including how it's showing up in office catering, event hosting, corporate gatherings, and social celebrations. Key sub-elements (platter presentation styles, portion arrangements, dietary accommodation trends, seasonal themes, sustainable packaging). How and why it has emerged (workplace culture shifts, hosting preferences, visual social media impact, convenience demands). Links to web sources where information was taken from. Output should be a numbered list (1,2,3), one trend per number."
  },
  'breads': {
    id: 'breads',
    name: 'Breads',
    prompt: "Research the top 3 most current artisan bread trends (2025-late) in bakeries globally. For each trend, provide: A detailed description of what the trend is, including how it's showing up in bakery offerings, sourdough innovations, ancient grains usage, and bread-making techniques. Key sub-elements (fermentation methods, flour varieties, braiding and shaping techniques, health-conscious formulations, regional bread styles). How and why it has emerged (health awareness, artisanal appreciation, cultural influences, sustainability concerns). Links to web sources where information was taken from. Output should be a numbered list (1,2,3), one trend per number."
  },
  'cakes': {
    id: 'cakes',
    name: 'Cakes & Bakery',
    prompt: "Research the top 3 most current cake decorating and bakery trends (2025-late) globally. For each trend, provide: A detailed description of what the trend is, including how it's showing up in celebration cakes, wedding cakes, everyday bakery items, and custom creations. Key sub-elements (decoration techniques, flavor combinations, minimalist vs maximalist designs, texture innovations, personalization trends). How and why it has emerged (social media influence, celebration culture changes, artistic expression, dietary preferences). Links to web sources where information was taken from. Output should be a numbered list (1,2,3), one trend per number."
  },
  'gift-boxes': {
    id: 'gift-boxes',
    name: 'Gift Boxes',
    prompt: "Research the top 3 most current premium dessert gift box and packaging trends (2025-late) in bakeries globally. For each trend, provide: A detailed description of what the trend is, including how it's showing up in holiday gifting, corporate gifts, personal celebrations, and luxury bakery offerings. Key sub-elements (packaging design, unboxing experience, sustainable materials, customization options, premium presentation). How and why it has emerged (gifting culture evolution, e-commerce growth, sustainability awareness, luxury positioning). Links to web sources where information was taken from. Output should be a numbered list (1,2,3), one trend per number."
  },
  'patisserie': {
    id: 'patisserie',
    name: 'Patisserie',
    prompt: "Research the top 3 most current French patisserie and fine pastry trends (2025-late) globally. For each trend, provide: A detailed description of what the trend is, including how it's showing up in pastry techniques, flavor innovations, visual presentations, and modern interpretations of classics. Key sub-elements (technique innovations, ingredient sourcing, fusion influences, texture layering, artistic presentation). How and why it has emerged (culinary education accessibility, global influences, Instagram culture, premium dessert appreciation). Links to web sources where information was taken from. Output should be a numbered list (1,2,3), one trend per number."
  },
  'bakery-social-media': {
    id: 'bakery-social-media',
    name: 'Social Media',
    prompt: "Research the top 3 most current viral bakery and dessert trends (2025-late) on social media platforms globally. For each trend, provide: A detailed description of what the trend is, including how it's showing up on TikTok, Instagram, and other platforms in the bakery and dessert space. Key sub-elements (viral recipes, visual presentation techniques, ASMR baking content, challenge trends, influencer collaborations). How and why it has emerged (algorithm preferences, visual appeal, shareable moments, creator economy influence). Links to web sources where information was taken from. Output should be a numbered list (1,2,3), one trend per number."
  }
};

export function getPromptByType(type: BakeryType): string {
  return BAKERY_PROMPTS[type].prompt;
}

export function getAllBakeryTypes(): BakeryStyleConfig[] {
  return Object.values(BAKERY_PROMPTS);
}
