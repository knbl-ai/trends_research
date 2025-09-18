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
    search_prompt: string;
    images_per_trend: number;
    generated_at: string;
  };
}

export interface TrendsApiRequest {
  type: "basic" | "reasoning" | "deep";
  prompt: string;
  images_num: number;
}