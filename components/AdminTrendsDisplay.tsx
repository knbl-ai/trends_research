'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { TrendCard } from '@/components/TrendCard';
import { MilitaryTrendCard } from '@/components/MilitaryTrendCard';
import { SearchingAnimation } from '@/components/SearchingAnimation';
import { TrendsApiResponse, SubcategoryType, FashionPromptDocument, MilitaryPromptDocument, TrendCategory } from '@/lib/types';
import { TrendingUp, AlertCircle, Sparkles, Users, Shirt, Heart, Star, Leaf, ExternalLink, Save, Shield, Zap, Crosshair, Truck, Lock, Globe } from 'lucide-react';
import Link from 'next/link';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';

interface AdminTrendsDisplayProps {
  category: TrendCategory;
}

export function AdminTrendsDisplay({ category }: AdminTrendsDisplayProps) {
  const [trends, setTrends] = useState<TrendsApiResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedSubcategory, setSelectedSubcategory] = useState<SubcategoryType | null>(null);
  const [prompts, setPrompts] = useState<(FashionPromptDocument | MilitaryPromptDocument)[]>([]);
  const [promptsLoading, setPromptsLoading] = useState(true);
  const [customPrompts, setCustomPrompts] = useState<Record<SubcategoryType, string>>({} as Record<SubcategoryType, string>);
  const [includeImages, setIncludeImages] = useState(true);
  const [updateStatus, setUpdateStatus] = useState<{ type: SubcategoryType; status: 'success' | 'error' | null }>({ type: 'high-fashion', status: null });
  const [updatingPrompt, setUpdatingPrompt] = useState<SubcategoryType | null>(null);

  // Fetch prompts from database on mount or category change
  useEffect(() => {
    const fetchPrompts = async () => {
      setPromptsLoading(true);
      try {
        const response = await fetch(`/api/prompts?category=${category}`);
        if (!response.ok) {
          throw new Error('Failed to fetch prompts');
        }
        const data = await response.json();
        if (data.success) {
          setPrompts(data.data);
          // Initialize customPrompts with fetched data
          const promptsMap = data.data.reduce((acc: Record<SubcategoryType, string>, prompt: FashionPromptDocument | MilitaryPromptDocument) => {
            acc[prompt.id] = prompt.prompt;
            return acc;
          }, {} as Record<SubcategoryType, string>);
          setCustomPrompts(promptsMap);
          if (data.data.length > 0) {
            setSelectedSubcategory(data.data[0].id);
          }
        }
      } catch (err) {
        console.error('Failed to fetch prompts:', err);
        setError('Failed to load prompts from database');
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
      // Fashion gets 3 images (vertical), military gets 1 image (horizontal)
      const numImages = includeImages ? (category === 'fashion' ? 3 : 1) : 0;

      const response = await fetch('/api/trends', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          subcategoryType: subcategory,
          trendCategory: category,
          prompt: customPrompts[subcategory],
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
      // Military icons
      'tactical-gear': Shield,
      'uniforms': Users,
      'weapons-systems': Crosshair,
      'vehicles': Truck,
      'cyber-defense': Lock,
      'global-conflicts': Globe
    };
    return iconMap[id] || TrendingUp;
  };

  const handleSubcategorySelect = (id: SubcategoryType) => {
    setSelectedSubcategory(id);
  };

  const handlePromptChange = (id: SubcategoryType, newPrompt: string) => {
    setCustomPrompts(prev => ({
      ...prev,
      [id]: newPrompt
    }));
  };

  const getCategoryTitle = () => {
    return category === 'fashion' ? 'Fashion' : 'Military';
  };

  const handleUpdatePrompt = async (id: SubcategoryType) => {
    setUpdatingPrompt(id);
    setUpdateStatus({ type: id, status: null });

    try {
      const response = await fetch(`/api/prompts/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          prompt: customPrompts[id],
          category: category
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to update prompt');
      }

      const data = await response.json();
      if (data.success) {
        setUpdateStatus({ type: id, status: 'success' });
        // Update the prompts list with the new data
        setPrompts(prev => prev.map(p =>
          p.id === id ? { ...p, prompt: customPrompts[id], updatedAt: new Date() } : p
        ));

        // Clear success message after 3 seconds
        setTimeout(() => {
          setUpdateStatus(prev => prev.type === id ? { ...prev, status: null } : prev);
        }, 3000);
      } else {
        throw new Error(data.error || 'Failed to update prompt');
      }
    } catch (err) {
      console.error('Failed to update prompt:', err);
      setUpdateStatus({ type: id, status: 'error' });

      // Clear error message after 5 seconds
      setTimeout(() => {
        setUpdateStatus(prev => prev.type === id ? { ...prev, status: null } : prev);
      }, 5000);
    } finally {
      setUpdatingPrompt(null);
    }
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
          {getCategoryTitle()} Trends<br />
          <span className="text-gradient">Admin Panel</span>
        </h1>
        <p className="text-gray-600 text-lg md:text-xl max-w-2xl mx-auto mb-12 font-light leading-relaxed">
          Customize prompts and settings for {category} trend research.
        </p>

        {/* Images Checkbox */}
        <div className="flex items-center justify-center gap-2 mb-8">
          <Checkbox
            id="images"
            checked={includeImages}
            onCheckedChange={(checked) => setIncludeImages(checked === true)}
          />
          <Label htmlFor="images" className="text-sm font-medium cursor-pointer">
            Images
          </Label>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-8">
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
                  className={`p-6 h-auto flex flex-col items-center gap-2 transition-all duration-300 hover:scale-105 ${
                    isSelected
                      ? 'bg-black hover:bg-gray-800 text-white border-black'
                      : 'border-gray-300 hover:bg-gray-50 text-gray-700'
                  }`}
                >
                  <IconComponent className="h-6 w-6" />
                  <span className="text-sm font-medium text-center">{prompt.name}</span>
                </Button>
              );
            })
          )}
        </div>

        {/* Prompt Editor for Selected Subcategory */}
        {!promptsLoading && selectedSubcategory && (
          <div className="mb-8 text-left">
            <Label htmlFor="prompt" className="text-sm font-medium mb-2 block">
              Prompt for {prompts.find(p => p.id === selectedSubcategory)?.name}
            </Label>
            <Textarea
              id="prompt"
              value={customPrompts[selectedSubcategory] || ''}
              onChange={(e) => handlePromptChange(selectedSubcategory, e.target.value)}
              className="min-h-[120px] bg-white/60 backdrop-blur-sm border-gray-300"
              placeholder="Enter custom prompt..."
            />

            {/* Update Button and Status Messages */}
            <div className="mt-3 flex items-center gap-3">
              <Button
                onClick={() => handleUpdatePrompt(selectedSubcategory)}
                disabled={updatingPrompt === selectedSubcategory}
                variant="outline"
                className="border-gray-300 hover:bg-gray-50 flex items-center gap-2"
              >
                <Save className="h-4 w-4" />
                {updatingPrompt === selectedSubcategory ? 'Updating...' : 'Update Prompt'}
              </Button>

              {updateStatus.type === selectedSubcategory && updateStatus.status === 'success' && (
                <span className="text-sm text-green-600 font-medium">
                  Prompt updated successfully!
                </span>
              )}

              {updateStatus.type === selectedSubcategory && updateStatus.status === 'error' && (
                <span className="text-sm text-red-600 font-medium">
                  Failed to update prompt. Please try again.
                </span>
              )}
            </div>
          </div>
        )}

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
              <div key={trend.number || index} className="space-y-4">
                {category === 'fashion' ? (
                  <TrendCard trend={trend} />
                ) : (
                  <MilitaryTrendCard trend={trend} />
                )}

                {/* Admin Prompt Display */}
                <div className="p-4 bg-gray-100/60 backdrop-blur-sm rounded-lg border border-gray-300">
                  <Label className="text-xs font-medium text-gray-600 mb-2 block">
                    Current Prompt Used
                  </Label>
                  <p className="text-sm text-gray-700 whitespace-pre-wrap">
                    {trends.request_info.search_prompt}
                  </p>
                </div>
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
                    All sources used to research these fashion trends
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
