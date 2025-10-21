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
  trend_category?: 'fashion' | 'military';
  aspect_ratio?: '3:4' | '16:9';
}

export type TrendCategory = 'fashion' | 'military';

export type FashionType = 'high-fashion' | 'street-fashion' | 'casual' | 'social-media' | 'celebrities' | 'wellness';

export type MilitaryType = 'tactical-gear' | 'uniforms' | 'weapons-systems' | 'vehicles' | 'cyber-defense' | 'global-conflicts';

export type SubcategoryType = FashionType | MilitaryType;

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

export type TrendPromptDocument = FashionPromptDocument | MilitaryPromptDocument;

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