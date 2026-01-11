'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { TrendCard } from '@/components/TrendCard';
import { MilitaryTrendCard } from '@/components/MilitaryTrendCard';
import { SearchingAnimation } from '@/components/SearchingAnimation';
import { TrendsApiResponse, TrendCategory, SubcategoryType, FashionPromptDocument, MilitaryPromptDocument, BakeryPromptDocument } from '@/lib/types';
import { TrendingUp, AlertCircle, Sparkles, Users, Shirt, Heart, Star, Leaf, ExternalLink, Shield, Zap, Ship, Radio, Briefcase, UtensilsCrossed, Wheat, Cake, Gift, Croissant, Share2, Sun } from 'lucide-react';
import Link from 'next/link';

interface TrendsDisplayProps {
  category: TrendCategory;
}

export function TrendsDisplay({ category }: TrendsDisplayProps) {
  const [trends, setTrends] = useState<TrendsApiResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [prompts, setPrompts] = useState<(FashionPromptDocument | MilitaryPromptDocument | BakeryPromptDocument)[]>([]);
  const [selectedSubcategory, setSelectedSubcategory] = useState<SubcategoryType | null>(null);
  const [promptsLoading, setPromptsLoading] = useState(true);

  // Fetch prompts on mount or category change
  useEffect(() => {
    const fetchPrompts = async () => {
      setPromptsLoading(true);
      try {
        const response = await fetch(`/api/prompts?category=${category}`);
        if (!response.ok) throw new Error('Failed to fetch prompts');

        const data = await response.json();
        if (data.success) {
          setPrompts(data.data);
          if (data.data.length > 0) {
            setSelectedSubcategory(data.data[0].id);
          }
        }
      } catch (err) {
        console.error('Failed to fetch prompts:', err);
        setError('Failed to load prompts');
      } finally {
        setPromptsLoading(false);
      }
    };

    fetchPrompts();
  }, [category]);

  const fetchTrends = async (subcategory: SubcategoryType = selectedSubcategory!) => {
    setLoading(true);
    setError(null);

    try {
      // Fashion gets 3 images (vertical), military and bakery get 1 image (horizontal)
      const numImages = category === 'fashion' ? 3 : 1;

      const response = await fetch('/api/trends', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          subcategoryType: subcategory,
          trendCategory: category,
          num_images: numImages
        }),
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

  const getIcon = (id: SubcategoryType) => {
    const iconMap: Record<SubcategoryType, typeof TrendingUp> = {
      // Fashion icons
      'high-fashion': Sparkles,
      'street-fashion': Users,
      'casual': Shirt,
      'social-media': Heart,
      'celebrities': Star,
      'wellness': Leaf,
      'summer-2026': Sun,
      // Military icons
      'air-sea-land': Ship,
      'counterterrorism-intelligence': Shield,
      'operational-innovation': Zap,
      'drones': Radio,
      'employer-branding': Briefcase,
      // Bakery icons
      'hosting-platters': UtensilsCrossed,
      'breads': Wheat,
      'cakes': Cake,
      'gift-boxes': Gift,
      'patisserie': Croissant,
      'bakery-social-media': Share2
    };
    return iconMap[id] || TrendingUp;
  };

  const handleSubcategorySelect = (id: SubcategoryType) => {
    setSelectedSubcategory(id);
  };

  const getCategoryTitle = () => {
    if (category === 'fashion') return 'Fashion';
    if (category === 'military') return 'Rafael Trends';
    return 'Roladin Trends';
  };

  const getCategorySubtitle = () => {
    if (category === 'fashion') {
      return 'Discover the latest global fashion trends with AI-powered research. Explore cutting-edge insights and developments shaping the future.';
    }
    if (category === 'military') {
      return 'Trends Research. Global Defence Systems';
    }
    return 'Bakery Trends Research';
  };

  const renderSkeletons = () => {
    const isFashion = category === 'fashion';

    return (
      <div className="space-y-12">
        {[1, 2, 3].map((i) => (
          <div key={i} className="space-y-6 p-8 border rounded-lg bg-white/50">
            <Skeleton className="h-8 w-32" />
            <Skeleton className="h-24 w-full" />
            {isFashion ? (
              // Fashion: 3 vertical images
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {[1, 2, 3].map((j) => (
                  <Skeleton key={j} className="aspect-[3/4] w-full" />
                ))}
              </div>
            ) : (
              // Military: 1 horizontal image
              <Skeleton className="aspect-video w-full" />
            )}
            <div className="space-y-2">
              <Skeleton className="h-6 w-48" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-3/4" />
            </div>
          </div>
        ))}
      </div>
    );
  };

  return (
    <div className="max-w-7xl mx-auto px-6 py-12 relative z-10">
      {/* Header Section */}
      <div className="text-center mb-16 animate-fade-in-up">
        {category === 'military' ? (
          <div className="mb-6 flex justify-center">
            <Image
              src="/Rafael.png"
              alt="Rafael Logo"
              width={300}
              height={150}
              priority
              className="max-w-full h-auto"
            />
          </div>
        ) : category === 'bakery' ? (
          <div className="mb-6 flex justify-center">
            <Image
              src="/roladin.png"
              alt="Roladin Logo"
              width={300}
              height={150}
              priority
              className="max-w-full h-auto"
            />
          </div>
        ) : (
          <h1 className="font-serif text-5xl md:text-7xl text-gray-900 mb-6 tracking-tight">
            {getCategoryTitle()}<br />
            <span className="text-gradient">Trends Research</span>
          </h1>
        )}
        <p className="text-gray-600 text-lg md:text-xl max-w-2xl mx-auto mb-12 font-light leading-relaxed">
          {getCategorySubtitle()}
        </p>

        <div className={`grid gap-4 mb-8 ${category === 'military'
            ? 'grid-cols-2 md:grid-cols-3 lg:grid-cols-5'
            : 'grid-cols-2 md:grid-cols-3 lg:grid-cols-6'
          }`}>
          {promptsLoading ? (
            <div className="col-span-full text-center py-4">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-black mx-auto"></div>
            </div>
          ) : (
            prompts.map((prompt) => {
              const IconComponent = getIcon(prompt.id);
              const isSelected = selectedSubcategory === prompt.id;

              return (
                <Button
                  key={prompt.id}
                  onClick={() => handleSubcategorySelect(prompt.id)}
                  disabled={loading}
                  variant={isSelected ? "default" : "outline"}
                  className={`p-6 h-auto min-h-[120px] flex flex-col items-center justify-center gap-2 transition-all duration-300 hover:scale-105 ${isSelected
                      ? 'bg-black hover:bg-gray-800 text-white border-black'
                      : 'border-gray-300 hover:bg-gray-50 text-gray-700'
                    }`}
                >
                  <IconComponent className="h-6 w-6 flex-shrink-0" />
                  <span className="text-sm font-medium text-center whitespace-normal break-words leading-tight">{prompt.name}</span>
                </Button>
              );
            })
          )}
        </div>

        <Button
          onClick={() => fetchTrends(selectedSubcategory!)}
          disabled={loading || !selectedSubcategory}
          className="mb-8 px-8 py-6 text-lg font-medium bg-black hover:bg-gray-800 text-white"
        >
          Show Trends
        </Button>

        {loading && <SearchingAnimation />}
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
              Latest {prompts.find(p => p.id === selectedSubcategory)?.name} Trends
            </h2>
            <p className="text-gray-600 text-lg">
              Generated on {new Date(trends.request_info.generated_at).toLocaleDateString()}
            </p>
          </div>

          <div className="space-y-12">
            {trends.data.trends.map((trend, index) => (
              <div key={trend.number || index}>
                {category === 'fashion' ? (
                  <TrendCard trend={trend} />
                ) : (
                  // Military and Bakery both use horizontal 16:9 images
                  <MilitaryTrendCard trend={trend} />
                )}
              </div>
            ))}
          </div>

          {/* References Section */}
          {(() => {
            const allReferences = trends.data.trends
              .flatMap(trend => trend.references || [])
              .filter((reference, index, arr) => arr.indexOf(reference) === index); // Remove duplicates

            return allReferences.length > 0 && (
              <div className="mt-16 pt-12 border-t border-gray-200">
                <div className="text-center mb-8">
                  <h3 className="font-serif text-2xl md:text-3xl text-gray-900 mb-4">
                    Sources & References
                  </h3>
                  <p className="text-gray-600 text-lg">
                    All sources used to research these trends
                  </p>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {allReferences.map((reference, index) => (
                    <Link
                      key={index}
                      href={reference}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-3 p-4 bg-white/60 backdrop-blur-sm rounded-lg border hover:bg-white/80 hover:shadow-md transition-all duration-200 text-sm group"
                    >
                      <ExternalLink size={16} className="text-gray-500 group-hover:text-gray-700 group-hover:scale-110 transition-all duration-200 flex-shrink-0" />
                      <span className="break-all text-gray-700 group-hover:text-gray-900 leading-tight">
                        {reference}
                      </span>
                    </Link>
                  ))}
                </div>
              </div>
            );
          })()}
        </div>
      )}
    </div>
  );
}