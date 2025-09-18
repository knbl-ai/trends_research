'use client';

import Image from 'next/image';
import Link from 'next/link';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { TrendData } from '@/lib/types';
import { ExternalLink } from 'lucide-react';

interface TrendCardProps {
  trend: TrendData;
}

export function TrendCard({ trend }: TrendCardProps) {
  return (
    <Card className="overflow-hidden border-0 shadow-lg hover-lift bg-white/80 backdrop-blur-sm animate-fade-in-up">
      <CardHeader className="pb-4">
        <CardTitle className="font-serif text-2xl md:text-3xl text-gray-900 leading-tight">
          Trend #{trend.number}
        </CardTitle>
      </CardHeader>

      <CardContent className="space-y-6">
        {/* Trend Description */}
        <div className="max-w-none">
          <div className="text-gray-700 leading-relaxed font-light text-base md:text-lg space-y-4">
            {trend.description.split('\n\n').map((paragraph, index) => {
              // Handle bullet points
              if (paragraph.includes('- **') || paragraph.includes('- ')) {
                const bulletItems = paragraph.split('\n').filter(line => line.trim().startsWith('- '));
                if (bulletItems.length > 0) {
                  return (
                    <ul key={index} className="list-disc list-inside space-y-2 ml-4">
                      {bulletItems.map((item, itemIndex) => (
                        <li key={itemIndex} className="leading-relaxed">
                          {item.replace('- ', '').split(/(\*\*.*?\*\*)/).map((part, partIndex) => {
                            if (part.startsWith('**') && part.endsWith('**')) {
                              return (
                                <strong key={partIndex} className="font-semibold text-gray-900">
                                  {part.slice(2, -2)}
                                </strong>
                              );
                            }
                            return part;
                          })}
                        </li>
                      ))}
                    </ul>
                  );
                }
              }

              // Handle regular paragraphs
              return (
                <p key={index} className="leading-relaxed">
                  {paragraph.split(/(\*\*.*?\*\*)/).map((part, partIndex) => {
                    if (part.startsWith('**') && part.endsWith('**')) {
                      return (
                        <strong key={partIndex} className="font-semibold text-gray-900">
                          {part.slice(2, -2)}
                        </strong>
                      );
                    }
                    return part;
                  })}
                </p>
              );
            })}
          </div>
        </div>

        {/* Images Grid */}
        {trend.image_urls && trend.image_urls.length > 0 && (
          <div className="space-y-4">
            <h4 className="font-serif text-xl text-gray-900">Visual Inspiration</h4>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {trend.image_urls.map((imageUrl, index) => (
                <div
                  key={index}
                  className="relative aspect-[3/4] overflow-hidden rounded-lg bg-gray-100 hover:scale-105 transition-transform duration-300"
                >
                  <Image
                    src={imageUrl}
                    alt={`Trend ${trend.number} - Image ${index + 1}`}
                    fill
                    className="object-cover"
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 33vw, 33vw"
                  />
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Sources */}
        {trend.references && trend.references.length > 0 && (
          <div className="space-y-3">
            <h4 className="font-serif text-xl text-gray-900">Sources & References</h4>
            <div className="space-y-2">
              {trend.references.map((reference, index) => (
                <Link
                  key={index}
                  href={reference}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors duration-200 text-sm group"
                >
                  <ExternalLink size={14} className="group-hover:scale-110 transition-transform duration-200" />
                  <span className="break-all">{reference}</span>
                </Link>
              ))}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}