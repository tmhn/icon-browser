"use client";

import { useState, useMemo, useEffect, useCallback } from "react";
import { SearchBar } from "@/components/SearchBar";
import Image from "next/image";
import { IconGridClient } from "@/components/IconGridClient";
import { IconPreviewModal } from "@/components/IconPreviewModal";
import { ChevronDownIcon, XMarkIcon } from "@heroicons/react/24/outline";
import { IconSearch } from "@/lib/search";
import { generatedIcons, categories } from "@/data/generated-icons";
import { Icon, SearchFilters } from "@/types/icon";
import { useIntersectionObserver } from "@/hooks/useIntersectionObserver";

export default function Home() {
  const [searchQuery, setSearchQuery] = useState("");
  const [filters, setFilters] = useState<SearchFilters>({});
  const [selectedIcon, setSelectedIcon] = useState<Icon | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [iconStyle, setIconStyle] = useState<"line" | "solid">("line");
  const [visibleCount, setVisibleCount] = useState(120); // Start with 120 icons
  const [isLoadingMore, setIsLoadingMore] = useState(false);

  // Initialize search engine with generated icons
  const searchEngine = useMemo(() => new IconSearch(generatedIcons), []);

  // Get search results
  const allSearchResults = useMemo(() => {
    return searchEngine.search(searchQuery, filters);
  }, [searchEngine, searchQuery, filters]);

  // Get paginated results
  const searchResults = useMemo(() => {
    return allSearchResults.slice(0, visibleCount);
  }, [allSearchResults, visibleCount]);

  // Get suggestions for search bar
  const suggestions = useMemo(() => {
    return searchEngine.getSuggestions(searchQuery);
  }, [searchEngine, searchQuery]);

  const handleIconClick = useCallback((icon: Icon) => {
    setSelectedIcon(icon);
    setIsModalOpen(true);
  }, []);

  const handleModalClose = useCallback(() => {
    setIsModalOpen(false);
    setSelectedIcon(null);
  }, []);

  const handleSuggestionClick = useCallback((suggestion: string) => {
    setSearchQuery(suggestion);
    setVisibleCount(120); // Reset visible count
  }, []);

  const loadMoreIcons = useCallback(() => {
    if (isLoadingMore || visibleCount >= allSearchResults.length) return;

    setIsLoadingMore(true);
    // Simulate a small delay for better UX
    setTimeout(() => {
      setVisibleCount((prev) => Math.min(prev + 120, allSearchResults.length));
      setIsLoadingMore(false);
    }, 100);
  }, [isLoadingMore, visibleCount, allSearchResults.length]);

  const handleIconStyleChange = useCallback((style: "line" | "solid") => {
    setIconStyle(style);
  }, []);

  // Reset visible count when search or filters change
  useEffect(() => {
    setVisibleCount(120);
  }, [searchQuery, filters]);

  // Intersection observer for automatic loading
  const [loadMoreRef, loadMoreEntry] = useIntersectionObserver({
    threshold: 0.1,
    rootMargin: "100px",
  });

  // Auto-load more when intersection observer triggers
  useEffect(() => {
    if (
      loadMoreEntry?.isIntersecting &&
      !isLoadingMore &&
      visibleCount < allSearchResults.length
    ) {
      loadMoreIcons();
    }
  }, [
    loadMoreEntry?.isIntersecting,
    isLoadingMore,
    visibleCount,
    allSearchResults.length,
  ]);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center">
              <div className="flex-shrink-0 flex flex-row items-center">
                <Image
                  src="/logo.png"
                  alt="Icon Browser"
                  width={28}
                  height={28}
                />
                <h1 className="ml-4 text-2xl font-bold text-gray-900">
                  Icon Browser
                </h1>
              </div>
              <div className="ml-6">
                <p className="text-sm text-gray-500">
                  {searchResults.length} icon
                  {searchResults.length !== 1 ? "s" : ""} found
                </p>
              </div>
            </div>
            <div className="flex flex-row gap-2">
              <p className="text-sm text-gray-500">
                Icons by{" "}
                <a
                  href="https://www.zachroszczewski.com/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-500 hover:text-gray-900"
                >
                  Zach.
                </a>
              </p>
              <p className="text-sm text-gray-500">
                App by{" "}
                <a
                  href="https://tmhn.io"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-500 hover:text-gray-900"
                >
                  Tom.
                </a>
              </p>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12 py-8">
        {/* Top Bar with Search and Filters */}
        <div className="flex items-center justify-between gap-6 mb-8">
          <div className="flex items-center gap-4 flex-1">
            {/* Category Filter Dropdown */}
            <div className="relative">
              <select
                value={filters.category || ""}
                onChange={(e) => {
                  const category = e.target.value;
                  setFilters(category ? { category } : {});
                }}
                className="appearance-none bg-white border border-gray-200 rounded-2xl px-4 py-3 pr-10 text-sm font-medium text-gray-900 focus:outline-none focus:ring-2 focus:ring-gray-400 focus:border-transparent min-w-[160px] shadow-sm hover:shadow-md transition-shadow"
              >
                <option value="">All Categories</option>
                {categories.map((category) => (
                  <option key={category.id} value={category.name}>
                    {category.name} ({category.count})
                  </option>
                ))}
              </select>
              <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                <ChevronDownIcon className="h-4 w-4 text-gray-500" />
              </div>
            </div>

            {/* Format Filter */}
            {/* <div className="relative">
              <select
                value={filters.format || ""}
                onChange={(e) => {
                  const format = e.target.value;
                  setFilters(
                    format
                      ? { ...filters, format }
                      : { ...filters, format: undefined }
                  );
                }}
                className="appearance-none bg-white border border-gray-200 rounded-2xl px-4 py-3 pr-10 text-sm font-medium text-gray-900 focus:outline-none focus:ring-2 focus:ring-gray-400 focus:border-transparent min-w-[120px] shadow-sm hover:shadow-md transition-shadow"
              >
                <option value="">All Formats</option>
                {formats.map((format) => (
                  <option key={format} value={format}>
                    {format.toUpperCase()}
                  </option>
                ))}
              </select>
              <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                <ChevronDownIcon className="h-4 w-4 text-gray-500" />
              </div>
            </div> */}

            {/* Icon Style Toggle */}
            <div className="flex items-center bg-gray-100 rounded-2xl p-1">
              <button
                onClick={() => setIconStyle("line")}
                className={`px-4 py-2 rounded-xl text-sm font-medium transition-colors ${
                  iconStyle === "line"
                    ? "bg-white text-gray-900 shadow-sm"
                    : "text-gray-600 hover:text-gray-900"
                }`}
              >
                Line
              </button>
              <button
                onClick={() => setIconStyle("solid")}
                className={`px-4 py-2 rounded-xl text-sm font-medium transition-colors ${
                  iconStyle === "solid"
                    ? "bg-white text-gray-900 shadow-sm"
                    : "text-gray-600 hover:text-gray-900"
                }`}
              >
                Solid
              </button>
            </div>

            {/* Clear Filters Button */}
            {Object.keys(filters).length > 0 && (
              <button
                onClick={() => setFilters({})}
                className="text-sm text-gray-600 hover:text-gray-900 flex items-center gap-2 px-3 py-2 rounded-xl hover:bg-gray-50 transition-colors font-medium"
              >
                <XMarkIcon className="h-4 w-4" />
                Clear filters
              </button>
            )}
          </div>

          {/* Search Bar */}
          <div className="w-96">
            <SearchBar
              value={searchQuery}
              onChange={setSearchQuery}
              suggestions={suggestions}
              onSuggestionClick={handleSuggestionClick}
            />
          </div>
        </div>

        {/* Results Info */}
        <div className="mb-6">
          {/* <h2 className="text-2xl font-semibold text-gray-900 mb-2">
            {searchQuery ? `Search results for "${searchQuery}"` : "Discover"}
          </h2> */}
          <p className="text-gray-600 font-medium">
            Showing {searchResults.length} of {allSearchResults.length} icons
            {Object.keys(filters).length > 0 && " found"}
          </p>
        </div>

        {/* Category Overview - Only show when no search/filters */}
        {/* {!searchQuery && Object.keys(filters).length === 0 && (
          <div className="mb-10">
            <h3 className="text-xl font-semibold text-gray-900 mb-6">
              Browse by Category
            </h3>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 xl:grid-cols-8 gap-3">
              {categories.map((category) => (
                <button
                  key={category.id}
                  onClick={() => setFilters({ category: category.name })}
                  className="p-4 bg-white border border-gray-200 rounded-2xl hover:border-gray-300 hover:bg-gray-50 transition-all duration-200 text-left shadow-sm hover:shadow-md group"
                >
                  <div className="text-sm font-semibold text-gray-900 mb-1 group-hover:text-gray-700 transition-colors">
                    {category.name}
                  </div>
                  <div className="text-xs text-gray-500 font-medium">
                    {category.count} icons
                  </div>
                </button>
              ))}
            </div>
          </div>
        )} */}

        {/* Icons Grid */}
        <IconGridClient
          results={searchResults}
          onIconClick={handleIconClick}
          iconStyle={iconStyle}
          onIconStyleChange={handleIconStyleChange}
          hasSearchQuery={!!searchQuery.trim()}
        />

        {/* Load More Button */}
        {visibleCount < allSearchResults.length && (
          <div className="mt-8 flex justify-center">
            <button
              ref={loadMoreRef}
              onClick={loadMoreIcons}
              disabled={isLoadingMore}
              className="px-8 py-3 bg-white border border-gray-200 rounded-2xl text-gray-700 font-medium hover:bg-gray-50 hover:border-gray-300 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoadingMore ? (
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 border-2 border-gray-300 border-t-gray-600 rounded-full animate-spin" />
                  Loading...
                </div>
              ) : (
                `Load More (${
                  allSearchResults.length - visibleCount
                } remaining)`
              )}
            </button>
          </div>
        )}

        {/* Auto-loading indicator */}
        {isLoadingMore && visibleCount < allSearchResults.length && (
          <div className="mt-4 flex justify-center">
            <div className="flex items-center gap-2 text-gray-500 text-sm">
              <div className="w-4 h-4 border-2 border-gray-300 border-t-gray-600 rounded-full animate-spin" />
              Loading more icons...
            </div>
          </div>
        )}
      </div>

      {/* Icon Preview Modal */}
      <IconPreviewModal
        icon={selectedIcon}
        isOpen={isModalOpen}
        onClose={handleModalClose}
        iconStyle={iconStyle}
        onIconStyleChange={handleIconStyleChange}
      />
    </div>
  );
}
