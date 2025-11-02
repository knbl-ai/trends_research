// Types for the Trends Overview API endpoint
export interface TrendsOverviewCategory {
  category_id: string;
  category_name: string;
  description_english: string;
  description_translated: string;
  language: string;
  image_prompt: string;
  image_url: string;
  references: string[];
}

export interface TrendsOverviewData {
  type: string;
  total_categories: number;
  research_model: string;
  categories: TrendsOverviewCategory[];
}

export interface TrendsOverviewResponse {
  success: boolean;
  message: string;
  data: TrendsOverviewData;
  request_info: {
    language: string;
    production: boolean;
    generated_at: string;
  };
}

export interface TrendsOverviewRequest {
  language: string;
  production: boolean;
}

export interface NewsletterOverviewTemplateData {
  categories: TrendsOverviewCategory[];
  generatedAt: string;
  language: string;
}
