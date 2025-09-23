"use client";

import { IconCard } from "./IconCard";
import { cn } from "@/lib/utils";
import { Icon, SearchResult } from "@/types/icon";

interface IconGridProps {
  results: SearchResult[];
  onIconClick: (icon: Icon) => void;
  iconStyle: "line" | "solid";
  onIconStyleChange: (style: "line" | "solid") => void;
  className?: string;
}

export function IconGrid({
  results,
  onIconClick,
  iconStyle,
  onIconStyleChange,
  className,
}: IconGridProps) {
  if (results.length === 0) {
    return (
      <div
        className={cn(
          "flex flex-col items-center justify-center py-12",
          className
        )}
      >
        <div className="text-center">
          <div className="mx-auto h-12 w-12 text-gray-400">
            <svg fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1}
                d="M9.172 16.172a4 4 0 015.656 0M9 12h6m-6-4h6m2 5.291A7.962 7.962 0 0112 15c-2.34 0-4.29-1.009-5.824-2.709M15 6.291A7.962 7.962 0 0012 5c-2.34 0-4.29 1.009-5.824 2.709"
              />
            </svg>
          </div>
          <h3 className="mt-2 text-sm font-medium text-gray-900">
            No icons found
          </h3>
          <p className="mt-1 text-sm text-gray-500">
            Try adjusting your search terms or filters.
          </p>
        </div>
      </div>
    );
  }

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
        />
      ))}
    </div>
  );
}
