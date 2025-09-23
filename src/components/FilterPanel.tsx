"use client";

import { useState } from "react";
import { LocalIcon } from "./Icon";
import { cn } from "@/lib/utils";
import { SearchFilters } from "@/types/icon";

interface FilterPanelProps {
  filters: SearchFilters;
  onFiltersChange: (filters: SearchFilters) => void;
  categories: string[];
  formats: string[];
  tags: string[];
  className?: string;
}

export function FilterPanel({
  filters,
  onFiltersChange,
  categories,
  formats,
  tags,
  className,
}: FilterPanelProps) {
  const [expandedSections, setExpandedSections] = useState<Set<string>>(
    new Set(["category"])
  );

  const toggleSection = (section: string) => {
    const newExpanded = new Set(expandedSections);
    if (newExpanded.has(section)) {
      newExpanded.delete(section);
    } else {
      newExpanded.add(section);
    }
    setExpandedSections(newExpanded);
  };

  const updateFilter = <K extends keyof SearchFilters>(
    key: K,
    value: SearchFilters[K]
  ) => {
    onFiltersChange({
      ...filters,
      [key]: value,
    });
  };

  const clearFilter = (key: keyof SearchFilters) => {
    const newFilters = { ...filters };
    delete newFilters[key];
    onFiltersChange(newFilters);
  };

  const clearAllFilters = () => {
    onFiltersChange({});
  };

  const hasActiveFilters = Object.keys(filters).length > 0;

  return (
    <div
      className={cn(
        "bg-white border border-gray-200 rounded-xl shadow-sm",
        className
      )}
    >
      <div className="p-4 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold text-gray-900">Filters</h3>
          {hasActiveFilters && (
            <button
              onClick={clearAllFilters}
              className="text-sm text-blue-600 hover:text-blue-800 font-medium transition-colors"
            >
              Clear all
            </button>
          )}
        </div>
      </div>

      <div className="p-4 space-y-4">
        {/* Category Filter */}
        <div>
          <button
            onClick={() => toggleSection("category")}
            className="flex items-center justify-between w-full text-left font-medium text-gray-900 hover:text-gray-700 transition-colors"
          >
            <span>Category</span>
            <LocalIcon
              src="/icons/ui/chevron-down.svg"
              className={cn(
                "h-4 w-4 transition-transform",
                expandedSections.has("category") && "rotate-180"
              )}
            />
          </button>

          {expandedSections.has("category") && (
            <div className="mt-2 space-y-2">
              {filters.category && (
                <div className="flex items-center justify-between bg-blue-50 px-3 py-2 rounded-lg">
                  <span className="text-sm text-blue-800">
                    {filters.category}
                  </span>
                  <button
                    onClick={() => clearFilter("category")}
                    className="text-blue-600 hover:text-blue-800"
                  >
                    <LocalIcon src="/icons/ui/x.svg" className="h-4 w-4" />
                  </button>
                </div>
              )}

              <div className="grid grid-cols-1 gap-1">
                {categories.map((category) => (
                  <button
                    key={category}
                    onClick={() => updateFilter("category", category)}
                    className={cn(
                      "text-left px-3 py-2 text-sm rounded-lg transition-colors",
                      filters.category === category
                        ? "bg-blue-100 text-blue-800 font-medium"
                        : "text-gray-700 hover:bg-gray-50"
                    )}
                  >
                    {category}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Format Filter */}
        <div>
          <button
            onClick={() => toggleSection("format")}
            className="flex items-center justify-between w-full text-left font-medium text-gray-900 hover:text-gray-700 transition-colors"
          >
            <span>Format</span>
            <LocalIcon
              src="/icons/ui/chevron-down.svg"
              className={cn(
                "h-4 w-4 transition-transform",
                expandedSections.has("format") && "rotate-180"
              )}
            />
          </button>

          {expandedSections.has("format") && (
            <div className="mt-2 space-y-2">
              {filters.format && (
                <div className="flex items-center justify-between bg-blue-50 px-3 py-2 rounded-lg">
                  <span className="text-sm text-blue-800 uppercase">
                    {filters.format}
                  </span>
                  <button
                    onClick={() => clearFilter("format")}
                    className="text-blue-600 hover:text-blue-800"
                  >
                    <LocalIcon src="/icons/ui/x.svg" className="h-4 w-4" />
                  </button>
                </div>
              )}

              <div className="grid grid-cols-2 gap-1">
                {formats.map((format) => (
                  <button
                    key={format}
                    onClick={() => updateFilter("format", format)}
                    className={cn(
                      "text-left px-3 py-2 text-sm rounded-lg transition-colors uppercase",
                      filters.format === format
                        ? "bg-blue-100 text-blue-800 font-medium"
                        : "text-gray-700 hover:bg-gray-50"
                    )}
                  >
                    {format}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Tags Filter */}
        <div>
          <button
            onClick={() => toggleSection("tags")}
            className="flex items-center justify-between w-full text-left font-medium text-gray-900 hover:text-gray-700 transition-colors"
          >
            <span>Tags</span>
            <LocalIcon
              src="/icons/ui/chevron-down.svg"
              className={cn(
                "h-4 w-4 transition-transform",
                expandedSections.has("tags") && "rotate-180"
              )}
            />
          </button>

          {expandedSections.has("tags") && (
            <div className="mt-2 space-y-2">
              {filters.tags && filters.tags.length > 0 && (
                <div className="flex flex-wrap gap-1">
                  {filters.tags.map((tag) => (
                    <div
                      key={tag}
                      className="flex items-center bg-blue-50 px-2 py-1 rounded-md"
                    >
                      <span className="text-xs text-blue-800">{tag}</span>
                      <button
                        onClick={() => {
                          const newTags =
                            filters.tags?.filter((t) => t !== tag) || [];
                          updateFilter(
                            "tags",
                            newTags.length > 0 ? newTags : undefined
                          );
                        }}
                        className="ml-1 text-blue-600 hover:text-blue-800"
                      >
                        <LocalIcon src="/icons/ui/x.svg" className="h-3 w-3" />
                      </button>
                    </div>
                  ))}
                </div>
              )}

              <div className="max-h-32 overflow-y-auto">
                <div className="grid grid-cols-2 gap-1">
                  {tags.slice(0, 20).map((tag) => (
                    <button
                      key={tag}
                      onClick={() => {
                        const currentTags = filters.tags || [];
                        const newTags = currentTags.includes(tag)
                          ? currentTags.filter((t) => t !== tag)
                          : [...currentTags, tag];
                        updateFilter(
                          "tags",
                          newTags.length > 0 ? newTags : undefined
                        );
                      }}
                      className={cn(
                        "text-left px-2 py-1 text-xs rounded transition-colors",
                        filters.tags?.includes(tag)
                          ? "bg-blue-100 text-blue-800 font-medium"
                          : "text-gray-700 hover:bg-gray-50"
                      )}
                    >
                      {tag}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
