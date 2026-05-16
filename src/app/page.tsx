"use client";

import { useState, useMemo, useEffect, useCallback } from "react";
import { SearchBar } from "@/components/SearchBar";
import Image from "next/image";
import { IconGridClient } from "@/components/IconGridClient";
import { IconPreviewModal } from "@/components/IconPreviewModal";
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
  const [visibleCount, setVisibleCount] = useState(120);
  const [isLoadingMore, setIsLoadingMore] = useState(false);

  const searchEngine = useMemo(() => new IconSearch(generatedIcons), []);

  const allSearchResults = useMemo(
    () => searchEngine.search(searchQuery, filters),
    [searchEngine, searchQuery, filters]
  );

  const searchResults = useMemo(
    () => allSearchResults.slice(0, visibleCount),
    [allSearchResults, visibleCount]
  );

  const suggestions = useMemo(
    () => searchEngine.getSuggestions(searchQuery),
    [searchEngine, searchQuery]
  );

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
    setVisibleCount(120);
  }, []);

  const loadMoreIcons = useCallback(() => {
    if (isLoadingMore || visibleCount >= allSearchResults.length) return;
    setIsLoadingMore(true);
    setTimeout(() => {
      setVisibleCount((prev) => Math.min(prev + 120, allSearchResults.length));
      setIsLoadingMore(false);
    }, 100);
  }, [isLoadingMore, visibleCount, allSearchResults.length]);

  const handleIconStyleChange = useCallback((style: "line" | "solid") => {
    setIconStyle(style);
  }, []);

  useEffect(() => {
    setVisibleCount(120);
  }, [searchQuery, filters]);

  const [loadMoreRef, loadMoreEntry] = useIntersectionObserver({
    threshold: 0.1,
    rootMargin: "100px",
  });

  useEffect(() => {
    if (
      loadMoreEntry?.isIntersecting &&
      !isLoadingMore &&
      visibleCount < allSearchResults.length
    ) {
      loadMoreIcons();
    }
  }, [loadMoreEntry?.isIntersecting, isLoadingMore, visibleCount, allSearchResults.length]);

  const activeCategory = filters.category ?? null;

  return (
    <div className="min-h-screen" style={{ background: "var(--bg)" }}>
      {/* ── Header ─────────────────────────────────── */}
      <header
        className="sticky top-0 z-40"
        style={{
          background: "rgba(244,243,239,0.88)",
          backdropFilter: "blur(20px)",
          WebkitBackdropFilter: "blur(20px)",
          borderBottom: "1px solid var(--border-md)",
        }}
      >
        <div className="max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-14">
            {/* Logo + wordmark */}
            <div className="flex items-center gap-3">
              <Image
                src="/logo.png"
                alt="Icon Browser"
                width={22}
                height={22}
              />
              <h1 className="text-base font-bold tracking-tight" style={{ color: "var(--text)" }}>
                Icon Browser
              </h1>
            </div>

            {/* Credits */}
            <div className="flex items-center gap-1.5 text-xs" style={{ color: "var(--text-dim)" }}>
              <span>
                Icons by{" "}
                <a
                  href="https://www.zachroszczewski.com/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="underline underline-offset-2 transition-colors"
                  style={{ color: "var(--text-mid)" }}
                  onMouseEnter={(e) => (e.currentTarget.style.color = "var(--text)")}
                  onMouseLeave={(e) => (e.currentTarget.style.color = "var(--text-mid)")}
                >
                  Zach
                </a>
              </span>
              <span>·</span>
              <span className="hidden sm:inline">
                App by{" "}
                <a
                  href="https://tmhn.io"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="underline underline-offset-2 transition-colors"
                  style={{ color: "var(--text-mid)" }}
                  onMouseEnter={(e) => (e.currentTarget.style.color = "var(--text)")}
                  onMouseLeave={(e) => (e.currentTarget.style.color = "var(--text-mid)")}
                >
                  Tom
                </a>
              </span>
            </div>
          </div>
        </div>
      </header>

      {/* ── Main ───────────────────────────────────── */}
      <main className="max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">

        {/* Search + style toggle — always on the same row */}
        <div className="flex items-center gap-3 mb-5">
          <div className="flex-1">
            <SearchBar
              value={searchQuery}
              onChange={setSearchQuery}
              suggestions={suggestions}
              onSuggestionClick={handleSuggestionClick}
            />
          </div>

          <div
            className="flex items-center rounded-xl p-1 flex-shrink-0"
            style={{ background: "var(--bg3)" }}
          >
            {(["line", "solid"] as const).map((style) => (
              <button
                key={style}
                onClick={() => setIconStyle(style)}
                className="px-3 py-1.5 rounded-lg text-xs font-semibold capitalize transition-all duration-150"
                style={
                  iconStyle === style
                    ? { background: "var(--bg2)", color: "var(--text)", boxShadow: "0 1px 3px rgba(0,0,0,0.1)" }
                    : { color: "var(--text-dim)" }
                }
              >
                {style}
              </button>
            ))}
          </div>
        </div>

        {/* Category pills — own full-width row, left-aligned with everything else */}
        <div className="mb-6">
          <div className="flex items-center gap-1.5 overflow-x-auto pills-scroll pb-0.5">
            <button
              onClick={() => setFilters({})}
              className="px-3 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap flex-shrink-0 transition-all duration-150"
              style={
                !activeCategory
                  ? { background: "var(--accent)", color: "#ffffff" }
                  : { background: "var(--bg3)", color: "var(--text-dim)" }
              }
              onMouseEnter={(e) => {
                if (activeCategory) e.currentTarget.style.background = "#e2e1dd";
              }}
              onMouseLeave={(e) => {
                if (activeCategory) e.currentTarget.style.background = "var(--bg3)";
              }}
            >
              All
            </button>

            {categories.map(
              (category: { id: string; name: string; count: number }) => {
                const isActive = activeCategory === category.name;
                return (
                  <button
                    key={category.id}
                    onClick={() => setFilters(isActive ? {} : { category: category.name })}
                    className="px-3 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap flex-shrink-0 transition-all duration-150"
                    style={
                      isActive
                        ? { background: "var(--accent)", color: "#ffffff" }
                        : { background: "var(--bg3)", color: "var(--text-dim)" }
                    }
                    onMouseEnter={(e) => {
                      if (!isActive) {
                        e.currentTarget.style.background = "#e2e1dd";
                        e.currentTarget.style.color = "var(--text)";
                      }
                    }}
                    onMouseLeave={(e) => {
                      if (!isActive) {
                        e.currentTarget.style.background = "var(--bg3)";
                        e.currentTarget.style.color = "var(--text-dim)";
                      }
                    }}
                  >
                    {category.name}
                    <span className="ml-1.5 opacity-40 font-normal">{category.count}</span>
                  </button>
                );
              }
            )}
          </div>
        </div>

        {/* Result count */}
        <p className="text-xs mb-5 font-medium" style={{ color: "var(--text-dim)" }}>
          {allSearchResults.length === searchResults.length
            ? `${allSearchResults.length.toLocaleString()} icons`
            : `Showing ${searchResults.length.toLocaleString()} of ${allSearchResults.length.toLocaleString()} icons`}
          {activeCategory && (
            <span style={{ color: "var(--text-mid)" }}>
              {" "}in <span style={{ color: "var(--text)" }}>{activeCategory}</span>
            </span>
          )}
          {searchQuery && (
            <span style={{ color: "var(--text-mid)" }}>
              {" "}for &ldquo;<span style={{ color: "var(--text)" }}>{searchQuery}</span>&rdquo;
            </span>
          )}
        </p>

        {/* Empty state */}
        {allSearchResults.length === 0 && (
          <div className="flex flex-col items-center justify-center py-24 text-center">
            <div
              className="w-16 h-16 rounded-2xl mb-4 flex items-center justify-center"
              style={{ background: "var(--bg3)" }}
            >
              <svg
                className="w-7 h-7"
                fill="none"
                stroke="currentColor"
                strokeWidth={1.5}
                viewBox="0 0 24 24"
                style={{ color: "var(--text-dim)" }}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z"
                />
              </svg>
            </div>
            <p className="text-sm font-semibold" style={{ color: "var(--text)" }}>
              No icons found
            </p>
            <p className="text-xs mt-1" style={{ color: "var(--text-dim)" }}>
              Try a different search or category
            </p>
          </div>
        )}

        {/* Icon grid */}
        <IconGridClient
          results={searchResults}
          onIconClick={handleIconClick}
          iconStyle={iconStyle}
          onIconStyleChange={handleIconStyleChange}
          hasSearchQuery={!!searchQuery.trim()}
        />

        {/* Load more */}
        {visibleCount < allSearchResults.length && (
          <div className="mt-10 flex justify-center">
            <button
              ref={loadMoreRef}
              onClick={loadMoreIcons}
              disabled={isLoadingMore}
              className="flex items-center gap-2 px-8 py-2.5 rounded-2xl text-sm font-semibold transition-all disabled:opacity-50"
              style={{
                background: "var(--bg2)",
                color: "var(--text)",
                border: "1px solid var(--border-md)",
              }}
              onMouseEnter={(e) => (e.currentTarget.style.background = "var(--bg3)")}
              onMouseLeave={(e) => (e.currentTarget.style.background = "var(--bg2)")}
            >
              {isLoadingMore ? (
                <>
                  <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                  </svg>
                  Loading...
                </>
              ) : (
                `Load ${Math.min(120, allSearchResults.length - visibleCount)} more`
              )}
            </button>
          </div>
        )}
      </main>

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
