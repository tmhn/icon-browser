"use client";

import { useState, useMemo } from "react";
import { SearchBar } from "@/components/SearchBar";
import { FilterPanel } from "@/components/FilterPanel";
import { IconGrid } from "@/components/IconGrid";
import { IconPreviewModal } from "@/components/IconPreviewModal";
import { ChevronDownIcon, XMarkIcon } from "@heroicons/react/24/outline";
import { IconSearch } from "@/lib/search";
import { generatedIcons, categories } from "@/data/generated-icons";
import { Icon, SearchFilters } from "@/types/icon";

export default function Home() {
  const [searchQuery, setSearchQuery] = useState("");
  const [filters, setFilters] = useState<SearchFilters>({});
  const [selectedIcon, setSelectedIcon] = useState<Icon | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Initialize search engine with generated icons
  const searchEngine = useMemo(() => new IconSearch(generatedIcons), []);

  // Get search results
  const searchResults = useMemo(() => {
    return searchEngine.search(searchQuery, filters);
  }, [searchEngine, searchQuery, filters]);

  // Get suggestions for search bar
  const suggestions = useMemo(() => {
    return searchEngine.getSuggestions(searchQuery);
  }, [searchEngine, searchQuery]);

  // Get filter options
  const availableCategories = useMemo(
    () => categories.map((cat) => cat.name),
    [categories]
  );
  const formats = useMemo(() => searchEngine.getFormats(), [searchEngine]);
  const tags = useMemo(() => searchEngine.getTags(), [searchEngine]);

  const handleIconClick = (icon: Icon) => {
    setSelectedIcon(icon);
    setIsModalOpen(true);
  };

  const handleModalClose = () => {
    setIsModalOpen(false);
    setSelectedIcon(null);
  };

  const handleSuggestionClick = (suggestion: string) => {
    setSearchQuery(suggestion);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <h1 className="text-2xl font-bold text-gray-900">
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
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Top Bar with Search and Filters */}
        <div className="flex items-center justify-between gap-4 mb-6">
          <div className="flex items-center gap-4 flex-1">
            {/* Category Filter Dropdown */}
            <div className="relative">
              <select
                value={filters.category || ""}
                onChange={(e) => {
                  const category = e.target.value;
                  setFilters(category ? { category } : {});
                }}
                className="appearance-none bg-white border border-gray-300 rounded-lg px-3 py-2 pr-8 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent min-w-[140px]"
              >
                <option value="">All Categories</option>
                {categories.map((category) => (
                  <option key={category.id} value={category.name}>
                    {category.name} ({category.count})
                  </option>
                ))}
              </select>
              <div className="absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none">
                <ChevronDownIcon className="h-4 w-4 text-gray-400" />
              </div>
            </div>

            {/* Format Filter */}
            <div className="relative">
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
                className="appearance-none bg-white border border-gray-300 rounded-lg px-3 py-2 pr-8 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent min-w-[100px]"
              >
                <option value="">All Formats</option>
                {formats.map((format) => (
                  <option key={format} value={format}>
                    {format.toUpperCase()}
                  </option>
                ))}
              </select>
              <div className="absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none">
                <ChevronDownIcon className="h-4 w-4 text-gray-400" />
              </div>
            </div>

            {/* Clear Filters Button */}
            {Object.keys(filters).length > 0 && (
              <button
                onClick={() => setFilters({})}
                className="text-sm text-gray-500 hover:text-gray-700 flex items-center gap-1"
              >
                <XMarkIcon className="h-4 w-4" />
                Clear filters
              </button>
            )}
          </div>

          {/* Search Bar */}
          <div className="w-80">
            <SearchBar
              value={searchQuery}
              onChange={setSearchQuery}
              suggestions={suggestions}
              onSuggestionClick={handleSuggestionClick}
            />
          </div>
        </div>

        {/* Results Info */}
        <div className="mb-4">
          <p className="text-sm text-gray-600">
            {searchQuery ? `Search results for "${searchQuery}"` : "All icons"}
            {Object.keys(filters).length > 0 && (
              <span className="ml-2">
                • {searchResults.length} icon
                {searchResults.length !== 1 ? "s" : ""} found
              </span>
            )}
          </p>
        </div>

        {/* Category Overview - Only show when no search/filters */}
        {!searchQuery && Object.keys(filters).length === 0 && (
          <div className="mb-6">
            <h3 className="text-md font-semibold text-gray-900 mb-3">
              Browse by Category
            </h3>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 xl:grid-cols-8 gap-2">
              {categories.map((category) => (
                <button
                  key={category.id}
                  onClick={() => setFilters({ category: category.name })}
                  className="p-2 bg-white border border-gray-200 rounded-lg hover:border-blue-300 hover:bg-blue-50 transition-colors text-left"
                >
                  <div className="text-xs font-medium text-gray-900 mb-1">
                    {category.name}
                  </div>
                  <div className="text-xs text-gray-500">
                    {category.count} icons
                  </div>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Icons Grid */}
        <IconGrid results={searchResults} onIconClick={handleIconClick} />
      </div>

      {/* Icon Preview Modal */}
      <IconPreviewModal
        icon={selectedIcon}
        isOpen={isModalOpen}
        onClose={handleModalClose}
      />
    </div>
  );
}
