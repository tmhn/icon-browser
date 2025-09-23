"use client";

import { useState, useRef, useEffect } from "react";
import { MagnifyingGlassIcon, XMarkIcon } from "@heroicons/react/24/outline";
import { cn } from "@/lib/utils";

interface SearchBarProps {
  value: string;
  onChange: (value: string) => void;
  suggestions: string[];
  onSuggestionClick: (suggestion: string) => void;
  placeholder?: string;
  className?: string;
}

export function SearchBar({
  value,
  onChange,
  suggestions,
  onSuggestionClick,
  placeholder = "Search icons by name or category",
  className,
}: SearchBarProps) {
  const [isFocused, setIsFocused] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const suggestionsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        suggestionsRef.current &&
        !suggestionsRef.current.contains(event.target as Node) &&
        inputRef.current &&
        !inputRef.current.contains(event.target as Node)
      ) {
        setShowSuggestions(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    onChange(newValue);
    setShowSuggestions(newValue.length > 0 && suggestions.length > 0);
  };

  const handleSuggestionClick = (suggestion: string) => {
    onChange(suggestion);
    setShowSuggestions(false);
    onSuggestionClick(suggestion);
    inputRef.current?.focus();
  };

  const clearSearch = () => {
    onChange("");
    setShowSuggestions(false);
    inputRef.current?.focus();
  };

  return (
    <div className={cn("relative w-full", className)}>
      <div className="relative">
        <div className="absolute inset-y-0 left-0 pl-3 sm:pl-4 flex items-center pointer-events-none">
          <MagnifyingGlassIcon className="h-4 w-4 sm:h-5 sm:w-5 text-gray-500" />
        </div>
        <input
          ref={inputRef}
          type="text"
          value={value}
          onChange={handleInputChange}
          onFocus={() => {
            setIsFocused(true);
            setShowSuggestions(value.length > 0 && suggestions.length > 0);
          }}
          onBlur={() => setIsFocused(false)}
          placeholder={placeholder}
          className={cn(
            "block w-full pl-10 pr-10 py-3 sm:py-4 border border-gray-200 rounded-2xl",
            "bg-white text-gray-900 placeholder-gray-500 text-sm sm:text-base font-medium",
            "focus:outline-none focus:ring-2 focus:ring-gray-400 focus:border-transparent",
            "transition-all duration-200 ease-in-out",
            "shadow-sm hover:shadow-md focus:shadow-lg",
            isFocused && "ring-2 ring-gray-400 border-transparent"
          )}
        />
        {value && (
          <button
            onClick={clearSearch}
            className="absolute inset-y-0 right-0 pr-2 sm:pr-3 flex items-center"
          >
            <XMarkIcon className="h-4 w-4 sm:h-5 sm:w-5 text-gray-500 hover:text-gray-700 transition-colors" />
          </button>
        )}
      </div>

      {/* Suggestions Dropdown */}
      {showSuggestions && suggestions.length > 0 && (
        <div
          ref={suggestionsRef}
          className="absolute z-50 mt-2 w-full bg-white border border-gray-200 rounded-2xl shadow-xl max-h-60 overflow-y-auto"
        >
          <div className="py-1">
            {suggestions.map((suggestion, index) => (
              <button
                key={index}
                onClick={() => handleSuggestionClick(suggestion)}
                className="w-full px-4 py-3 text-left text-sm font-medium text-gray-700 hover:bg-gray-50 focus:bg-gray-50 focus:outline-none transition-colors"
              >
                <div className="flex items-center">
                  <MagnifyingGlassIcon className="h-4 w-4 text-gray-400 mr-2" />
                  {suggestion}
                </div>
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
