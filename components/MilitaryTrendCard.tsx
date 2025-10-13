'use client';

import Image from 'next/image';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { TrendData } from '@/lib/types';

interface MilitaryTrendCardProps {
  trend: TrendData;
}

export function MilitaryTrendCard({ trend }: MilitaryTrendCardProps) {
  return (
    <Card className="overflow-hidden border-0 shadow-lg hover-lift bg-white/80 backdrop-blur-sm animate-fade-in-up">
      <CardHeader className="pb-4">
        <CardTitle className="font-serif text-2xl md:text-3xl text-gray-900 leading-tight">
          Trend #{trend.number}
        </CardTitle>
      </CardHeader>

      <CardContent className="space-y-6">
        {/* Trend Description */}
        <div className="max-w-none prose prose-lg prose-gray max-w-none">
          <ReactMarkdown
            remarkPlugins={[remarkGfm]}
            components={{
              h1: ({ node, ...props }) => (
                <h1 className="text-2xl font-serif font-bold text-gray-900 mt-6 mb-4" {...props} />
              ),
              h2: ({ node, ...props }) => (
                <h2 className="text-xl font-serif font-bold text-gray-900 mt-5 mb-3" {...props} />
              ),
              h3: ({ node, ...props }) => (
                <h3 className="text-lg font-semibold text-gray-900 mt-4 mb-2" {...props} />
              ),
              p: ({ node, ...props }) => (
                <p className="text-gray-700 leading-relaxed font-light text-base md:text-lg mb-4" {...props} />
              ),
              strong: ({ node, ...props }) => (
                <strong className="font-semibold text-gray-900" {...props} />
              ),
              ul: ({ node, ...props }) => (
                <ul className="list-disc list-inside space-y-2 ml-4 mb-4" {...props} />
              ),
              ol: ({ node, ...props }) => (
                <ol className="list-decimal list-inside space-y-2 ml-4 mb-4" {...props} />
              ),
              li: ({ node, ...props }) => (
                <li className="text-gray-700 leading-relaxed font-light text-base md:text-lg" {...props} />
              ),
              blockquote: ({ node, ...props }) => (
                <blockquote className="border-l-4 border-gray-300 pl-4 italic text-gray-600 my-4" {...props} />
              ),
              code: ({ node, ...props }) => (
                <code className="bg-gray-100 px-1.5 py-0.5 rounded text-sm font-mono text-gray-800" {...props} />
              ),
            }}
          >
            {trend.description}
          </ReactMarkdown>
        </div>

        {/* Images Grid - Landscape 16:9 aspect ratio */}
        {trend.image_urls && trend.image_urls.length > 0 && (
          <div className="space-y-4">
            <h4 className="font-serif text-xl text-gray-900">Visual Inspiration</h4>
            <div className="grid grid-cols-1 gap-4">
              {trend.image_urls.map((imageUrl, index) => (
                <div
                  key={index}
                  className="relative aspect-video overflow-hidden rounded-lg bg-gray-100 hover:scale-[1.02] transition-transform duration-300"
                >
                  <Image
                    src={imageUrl}
                    alt={`Trend ${trend.number} - Image ${index + 1}`}
                    fill
                    className="object-cover"
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 90vw, 80vw"
                  />
                </div>
              ))}
            </div>
          </div>
        )}

      </CardContent>
    </Card>
  );
}
