export interface TrendData {
  number: number;
  description: string;
  references: string[];
  image_prompts: string[];
  image_urls: string[];
  images_count: number;
}

export interface TrendsApiResponse {
  success: boolean;
  message: string;
  data: {
    type: string;
    total_trends: number;
    research_model: string;
    trends: TrendData[];
  };
  request_info: {
    search_type: string;
    trend_category: string;
    search_prompt: string;
    images_per_trend: number;
    generated_at: string;
  };
}

export interface TrendsApiRequest {
  type: "basic" | "reasoning" | "deep";
  prompt: string;
  images_num: number;
  trend_category?: 'fashion' | 'military' | 'bakery';
  aspect_ratio?: '3:4' | '16:9';
  language: string;
  production: boolean;
}

export type TrendCategory = 'fashion' | 'military' | 'bakery';

export type FashionType = 'high-fashion' | 'street-fashion' | 'casual' | 'social-media' | 'celebrities' | 'wellness' | 'summer-2026';

export type MilitaryType = 'air-sea-land' | 'counterterrorism-intelligence' | 'operational-innovation' | 'drones' | 'employer-branding';

export type BakeryType = 'hosting-platters' | 'breads' | 'cakes' | 'gift-boxes' | 'patisserie' | 'bakery-social-media';

export type SubcategoryType = FashionType | MilitaryType | BakeryType;

export interface FashionPromptDocument {
  _id?: string;
  id: FashionType;
  name: string;
  prompt: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface MilitaryPromptDocument {
  _id?: string;
  id: MilitaryType;
  name: string;
  prompt: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface BakeryPromptDocument {
  _id?: string;
  id: BakeryType;
  name: string;
  prompt: string;
  createdAt: Date;
  updatedAt: Date;
}

export type TrendPromptDocument = FashionPromptDocument | MilitaryPromptDocument | BakeryPromptDocument;

// User and Authentication Types
export type UserRole = 'admin' | 'editor' | 'viewer';

export interface UserDocument {
  _id?: string;
  email: string;
  password: string; // hashed password
  name: string;
  role: UserRole;
  createdAt: Date;
  updatedAt: Date;
}