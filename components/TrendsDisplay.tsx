'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { TrendCard } from '@/components/TrendCard';
import { TrendsApiResponse } from '@/lib/types';
type FashionType = 'high-fashion' | 'street-fashion' | 'casual' | 'social-media' | 'celebrities' | 'israel';

interface FashionStyleConfig {
  id: FashionType;
  name: string;
}

const FASHION_STYLES: FashionStyleConfig[] = [
  { id: 'high-fashion', name: 'High Fashion' },
  { id: 'street-fashion', name: 'Street Fashion' },
  { id: 'casual', name: 'Casual' },
  { id: 'social-media', name: 'Social Media' },
  { id: 'celebrities', name: 'Celebrities' },
  { id: 'israel', name: 'Israel' }
];

function getAllFashionTypes(): FashionStyleConfig[] {
  return FASHION_STYLES;
}
import { TrendingUp, AlertCircle, Sparkles, Users, Shirt, Heart, Star, Flag } from 'lucide-react';

export function TrendsDisplay() {
  const [trends, setTrends] = useState<TrendsApiResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedFashionType, setSelectedFashionType] = useState<FashionType>('high-fashion');

  const fetchTrends = async (fashionType: FashionType = selectedFashionType) => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/trends', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ fashionType }),
      });

      if (!response.ok) {
        throw new Error('Failed to fetch trends');
      }

      const data: TrendsApiResponse = await response.json();
      setTrends(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  const getFashionIcon = (type: FashionType) => {
    switch (type) {
      case 'high-fashion': return Sparkles;
      case 'street-fashion': return Users;
      case 'casual': return Shirt;
      case 'social-media': return Heart;
      case 'celebrities': return Star;
      case 'israel': return Flag;
      default: return TrendingUp;
    }
  };

  const handleFashionTypeSelect = (type: FashionType) => {
    setSelectedFashionType(type);
    fetchTrends(type);
  };

  const renderSkeletons = () => (
    <div className="space-y-12">
      {[1, 2, 3].map((i) => (
        <div key={i} className="space-y-6 p-8 border rounded-lg bg-white/50">
          <Skeleton className="h-8 w-32" />
          <Skeleton className="h-24 w-full" />
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {[1, 2, 3].map((j) => (
              <Skeleton key={j} className="aspect-[3/4] w-full" />
            ))}
          </div>
          <div className="space-y-2">
            <Skeleton className="h-6 w-48" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-3/4" />
          </div>
        </div>
      ))}
    </div>
  );

  return (
    <div className="max-w-7xl mx-auto px-6 py-12 relative z-10">
      {/* Header Section */}
      <div className="text-center mb-16 animate-fade-in-up">
        <h1 className="font-serif text-5xl md:text-7xl text-gray-900 mb-6 tracking-tight">
          Fashion<br />
          <span className="text-gradient">Trends Research</span>
        </h1>
        <p className="text-gray-600 text-lg md:text-xl max-w-2xl mx-auto mb-12 font-light leading-relaxed">
          Discover the latest global fashion trends with AI-powered research.
          Explore cutting-edge styles, colors, and inspirations shaping the future of fashion.
        </p>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-8">
          {getAllFashionTypes().map((fashionStyle) => {
            const IconComponent = getFashionIcon(fashionStyle.id);
            const isSelected = selectedFashionType === fashionStyle.id;

            return (
              <Button
                key={fashionStyle.id}
                onClick={() => handleFashionTypeSelect(fashionStyle.id)}
                disabled={loading}
                variant={isSelected ? "default" : "outline"}
                className={`p-6 h-auto flex flex-col items-center gap-2 transition-all duration-300 hover:scale-105 ${
                  isSelected
                    ? 'bg-black hover:bg-gray-800 text-white border-black'
                    : 'border-gray-300 hover:bg-gray-50 text-gray-700'
                }`}
              >
                <IconComponent className="h-6 w-6" />
                <span className="text-sm font-medium text-center">{fashionStyle.name}</span>
              </Button>
            );
          })}
        </div>

        {loading && (
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-black mx-auto mb-4"></div>
            <p className="text-gray-600">Researching {getAllFashionTypes().find(f => f.id === selectedFashionType)?.name} trends...</p>
          </div>
        )}
      </div>

      {/* Error State */}
      {error && (
        <div className="text-center py-12">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-red-100 rounded-full mb-4">
            <AlertCircle className="h-8 w-8 text-red-600" />
          </div>
          <h3 className="font-serif text-2xl text-gray-900 mb-2">Something went wrong</h3>
          <p className="text-gray-600 mb-6">{error}</p>
          <Button
            onClick={() => fetchTrends()}
            variant="outline"
            className="border-gray-300 hover:bg-gray-50"
          >
            Try Again
          </Button>
        </div>
      )}

      {/* Loading State */}
      {loading && renderSkeletons()}

      {/* Trends Display */}
      {trends && !loading && (
        <div className="space-y-16">
          <div className="text-center">
            <h2 className="font-serif text-3xl md:text-4xl text-gray-900 mb-4">
              Latest {getAllFashionTypes().find(f => f.id === selectedFashionType)?.name} Trends
            </h2>
            <p className="text-gray-600 text-lg">
              Generated on {new Date(trends.request_info.generated_at).toLocaleDateString()}
            </p>
          </div>

          <div className="space-y-12">
            {trends.data.trends.map((trend, index) => (
              <div key={trend.number || index}>
                <TrendCard trend={trend} />
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}