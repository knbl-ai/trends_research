'use client';

import Image from 'next/image';
import Link from 'next/link';
import { Button } from '@/components/ui/button';

export function CategorySelector() {
  return (
    <div className="max-w-5xl mx-auto px-6 py-24 relative z-10">
      <div className="text-center mb-20 animate-fade-in-up">
        <h1 className="font-serif text-6xl md:text-8xl text-gray-900 mb-8 tracking-tight">
          Trends<br />
          <span className="text-gradient">Research Platform</span>
        </h1>
        <p className="text-gray-600 text-xl md:text-2xl max-w-3xl mx-auto font-light leading-relaxed">
          What trends are you interested in?
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
        {/* Fashion Card */}
        <Link href="/fashion" className="group">
          <div className="relative overflow-hidden rounded-2xl border-2 border-gray-200 bg-white/60 backdrop-blur-sm hover:bg-white hover:border-black transition-all duration-300 hover:shadow-2xl hover:scale-105 p-12">
            <div className="flex flex-col items-center text-center space-y-6">
              <Image
                src="/hO.png"
                alt="Fashion Logo"
                width={200}
                height={100}
                priority
                className="h-24 w-auto group-hover:scale-110 transition-transform duration-300"
              />
              <div>
                <p className="text-gray-600 text-lg font-light leading-relaxed">
                  Trends Research. Global Fashion and Style
                </p>
              </div>
              <Button
                variant="outline"
                className="mt-4 border-gray-300 hover:bg-black hover:text-white transition-all duration-300"
              >
                Explore Fashion Trends
              </Button>
            </div>
          </div>
        </Link>

        {/* Military Card */}
        <Link href="/military" className="group">
          <div className="relative overflow-hidden rounded-2xl border-2 border-gray-200 bg-white/60 backdrop-blur-sm hover:bg-white hover:border-black transition-all duration-300 hover:shadow-2xl hover:scale-105 p-12">
            <div className="flex flex-col items-center text-center space-y-6">
              <Image
                src="/Rafael.png"
                alt="Rafael Logo"
                width={200}
                height={100}
                priority
                className="h-24 w-auto group-hover:scale-110 transition-transform duration-300"
              />
              <div>
                <p className="text-gray-600 text-lg font-light leading-relaxed">
                  Trends Research. Global Defence Systems
                </p>
              </div>
              <Button
                variant="outline"
                className="mt-4 border-gray-300 hover:bg-black hover:text-white transition-all duration-300"
              >
                Explore Military Trends
              </Button>
            </div>
          </div>
        </Link>
      </div>

      <div className="mt-16 text-center">
        <p className="text-gray-500 text-sm">
          Powered by AI-driven research and analysis
        </p>
      </div>
    </div>
  );
}
