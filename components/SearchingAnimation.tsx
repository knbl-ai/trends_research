'use client';

export function SearchingAnimation() {
  return (
    <div className="text-center py-8">
      {/* Fashionable animated circles */}
      <div className="relative h-24 w-24 mx-auto mb-6">
        {/* Outer ring */}
        <div className="absolute inset-0 rounded-full border-4 border-gray-200 animate-ping opacity-20"></div>

        {/* Middle ring */}
        <div className="absolute inset-2 rounded-full border-4 border-gray-300 animate-pulse"></div>

        {/* Inner spinning circles */}
        <div className="absolute inset-0 animate-spin">
          <div className="absolute top-0 left-1/2 -ml-2 h-4 w-4 rounded-full bg-black"></div>
          <div className="absolute bottom-0 left-1/2 -ml-2 h-4 w-4 rounded-full bg-gray-700"></div>
          <div className="absolute left-0 top-1/2 -mt-2 h-4 w-4 rounded-full bg-gray-500"></div>
          <div className="absolute right-0 top-1/2 -mt-2 h-4 w-4 rounded-full bg-gray-400"></div>
        </div>

        {/* Center dot */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="h-3 w-3 rounded-full bg-black animate-pulse"></div>
        </div>
      </div>

      {/* Animated text */}
      <div className="space-y-2">
        <h3 className="font-serif text-2xl md:text-3xl text-gray-900 animate-fade-in">
          Searching Latest Trends
        </h3>

        {/* Animated dots */}
        <div className="flex justify-center items-center gap-2">
          <div className="h-2 w-2 rounded-full bg-black animate-bounce" style={{ animationDelay: '0ms' }}></div>
          <div className="h-2 w-2 rounded-full bg-gray-700 animate-bounce" style={{ animationDelay: '150ms' }}></div>
          <div className="h-2 w-2 rounded-full bg-gray-500 animate-bounce" style={{ animationDelay: '300ms' }}></div>
        </div>

        {/* Subtitle */}
        <p className="text-gray-600 text-sm font-light animate-pulse">
          Analyzing global insights...
        </p>
      </div>

      {/* Bottom wave animation */}
      <div className="mt-8 flex justify-center gap-1">
        {[...Array(7)].map((_, i) => (
          <div
            key={i}
            className="w-1 bg-gradient-to-t from-black to-gray-400 rounded-full animate-wave"
            style={{
              height: '20px',
              animationDelay: `${i * 100}ms`,
            }}
          ></div>
        ))}
      </div>

      <style jsx>{`
        @keyframes fade-in {
          from {
            opacity: 0;
            transform: translateY(-10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes wave {
          0%, 100% {
            transform: scaleY(1);
          }
          50% {
            transform: scaleY(1.8);
          }
        }

        .animate-fade-in {
          animation: fade-in 0.5s ease-out;
        }

        .animate-wave {
          animation: wave 1s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
}
