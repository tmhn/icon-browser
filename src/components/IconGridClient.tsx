"use client";

import { useState, useEffect, memo } from "react";
import { IconCard } from "./IconCard";
import { cn } from "@/lib/utils";
import { Icon, SearchResult } from "@/types/icon";

interface IconGridClientProps {
  results: SearchResult[];
  iconStyle: "line" | "solid";
  onIconClick: (icon: Icon) => void;
  onIconStyleChange: (style: "line" | "solid") => void;
  hasSearchQuery: boolean;
  className?: string;
}

export const IconGridClient = memo(function IconGridClient({
  results,
  iconStyle,
  onIconClick,
  onIconStyleChange,
  hasSearchQuery,
  className,
}: IconGridClientProps) {
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  if (!isClient) {
    // Return SSR version during initial render
    return (
      <div
        className={cn(
          "grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 xl:grid-cols-8 gap-6",
          className
        )}
      >
        {results.map((result) => (
          <div key={result.icon.id} className="flex flex-col text-center">
            <div className="group relative bg-white border border-gray-200 rounded-2xl p-6 hover:shadow-xl hover:border-gray-300 transition-all duration-300 cursor-pointer">
              {/* Icon Preview */}
              <div className="aspect-square flex items-center justify-center mb-4 rounded-2xl group-hover:bg-gray-50 transition-colors">
                <div className="w-12 h-12 flex items-center justify-center">
                  <img
                    src={result.icon.filePath.replace(
                      "/line/",
                      `/${iconStyle}/`
                    )}
                    alt={result.icon.name}
                    className="w-8 h-8 object-contain"
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      target.style.display = "none";
                      const fallback = target.nextElementSibling as HTMLElement;
                      if (fallback) fallback.style.display = "flex";
                    }}
                  />
                  <div
                    className="w-8 h-8 bg-gray-200 rounded-xl flex items-center justify-center"
                    style={{ display: "none" }}
                  ></div>
                </div>
              </div>

              {/* Icon Info */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  {hasSearchQuery && result.score !== undefined && (
                    <span className="text-xs text-blue-600 font-medium">
                      {Math.round((1 - result.score) * 100)}% match
                    </span>
                  )}
                </div>
              </div>

              {/* Match Indicators */}
              {result.matchedFields.length > 0 && (
                <div className="absolute top-2 right-2">
                  <div
                    className="w-2 h-2 bg-blue-500 rounded-full"
                    title={`Matched: ${result.matchedFields.join(", ")}`}
                  />
                </div>
              )}
            </div>
            <h3
              className="text-sm font-semibold text-gray-900 truncate mt-2"
              title={result.icon.name}
            >
              {result.icon.name}
            </h3>
          </div>
        ))}
      </div>
    );
  }

  // Return interactive version after hydration
  return (
    <div
      className={cn(
        "grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 xl:grid-cols-8 gap-6",
        className
      )}
    >
      {results.map((result) => (
        <IconCard
          key={result.icon.id}
          result={result}
          iconStyle={iconStyle}
          onIconClick={onIconClick}
          onIconStyleChange={onIconStyleChange}
          hasSearchQuery={hasSearchQuery}
        />
      ))}
    </div>
  );
});
