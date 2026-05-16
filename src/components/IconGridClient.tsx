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

  const gridClass = cn(
    "grid grid-cols-4 sm:grid-cols-6 md:grid-cols-7 lg:grid-cols-8 xl:grid-cols-10 gap-3 sm:gap-4",
    className
  );

  if (!isClient) {
    return (
      <div className={gridClass}>
        {results.map((result) => (
          <div key={result.icon.id} className="flex flex-col items-center">
            <div
              className="bg-white rounded-2xl w-full aspect-square flex items-center justify-center"
              style={{ border: "1px solid var(--border-md)" }}
            >
              <img
                src={result.icon.filePath.replace("/line/", `/${iconStyle}/`)}
                alt={result.icon.name}
                className="w-8 h-8 object-contain"
              />
            </div>
            <p
              className="mt-1.5 text-[11px] truncate w-full text-center px-1"
              style={{ color: "var(--text-dim)", fontWeight: 500 }}
            >
              {result.icon.name}
            </p>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className={gridClass}>
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
