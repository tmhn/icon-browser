"use client";

import { memo } from "react";
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
  return (
    <div
      className={cn(
        "grid grid-cols-4 sm:grid-cols-6 md:grid-cols-7 lg:grid-cols-8 xl:grid-cols-10 gap-3 sm:gap-4",
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
