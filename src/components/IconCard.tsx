"use client";

import { useState, memo } from "react";
import {
  ClipboardDocumentIcon,
  CheckIcon,
  EyeIcon,
  ArrowDownTrayIcon,
} from "@heroicons/react/24/outline";
import { Icon, SearchResult } from "@/types/icon";

interface IconCardProps {
  result: SearchResult;
  iconStyle: "line" | "solid";
  onIconClick: (icon: Icon) => void;
  onIconStyleChange: (style: "line" | "solid") => void;
  hasSearchQuery: boolean;
}

export const IconCard = memo(function IconCard({
  result,
  iconStyle,
  onIconClick,
  onIconStyleChange,
  hasSearchQuery,
}: IconCardProps) {
  const { icon, score, matchedFields } = result;
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const getIconPath = (icon: Icon) => {
    // Replace the directory path to switch between line and solid
    return icon.filePath.replace("/line/", `/${iconStyle}/`);
  };

  const copyToClipboard = async (text: string, iconId: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedId(iconId);
      setTimeout(() => setCopiedId(null), 2000);
    } catch (err) {
      console.error("Failed to copy: ", err);
    }
  };

  return (
    <div className="flex flex-col text-center">
      <div
        className="group relative bg-white border border-gray-200 rounded-2xl p-6 hover:shadow-xl hover:border-gray-300 transition-all duration-300 cursor-pointer aspect-square"
        onClick={() => onIconClick(icon)}
      >
        {/* Icon Preview */}
        <div className="aspect-square flex items-center justify-center rounded-2xl group-hover:bg-gray-50 transition-colors">
          <div className="w-12 h-12 flex items-center justify-center">
            <img
              src={getIconPath(icon)}
              alt={icon.name}
              className="w-8 h-8 object-contain"
              onError={(e) => {
                // Fallback if icon doesn't load
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
            {hasSearchQuery && score !== undefined && (
              <span className="text-xs text-blue-600 font-medium">
                {Math.round((1 - score) * 100)}% match
              </span>
            )}
          </div>
        </div>

        {/* Hover Actions */}
        <div className="absolute px-4 inset-0 bg-white bg-opacity-95 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
          <div className="grid grid-cols-2 gap-2">
            <button
              onClick={(e) => {
                e.stopPropagation();
                copyToClipboard(icon.name, icon.id);
              }}
              className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-xl transition-colors hover:cursor-pointer"
              title="Copy name"
            >
              {copiedId === icon.id ? (
                <CheckIcon className="h-4 w-4 text-green-600" />
              ) : (
                <ClipboardDocumentIcon className="h-4 w-4" />
              )}
            </button>

            <button
              onClick={(e) => {
                e.stopPropagation();
                onIconClick(icon);
              }}
              className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-xl transition-colors hover:cursor-pointer"
              title="Preview"
            >
              <EyeIcon className="h-4 w-4" />
            </button>

            <button
              onClick={(e) => {
                e.stopPropagation();
                onIconStyleChange(iconStyle === "line" ? "solid" : "line");
              }}
              className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-xl transition-colors hover:cursor-pointer"
              title={`Switch to ${
                iconStyle === "line" ? "solid" : "line"
              } style`}
            >
              <div className="w-4 h-4 flex items-center justify-center">
                <div
                  className={`w-3 h-3 rounded-sm ${
                    iconStyle === "line"
                      ? "border border-gray-600"
                      : "bg-gray-600"
                  }`}
                />
              </div>
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation();
                // In a real app, this would trigger download
                console.log("Download:", icon.filePath);
              }}
              className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-xl transition-colors hover:cursor-pointer"
              title="Download"
            >
              <ArrowDownTrayIcon className="h-4 w-4" />
            </button>
          </div>
        </div>

        {/* Match Indicators */}
        {matchedFields.length > 0 && (
          <div className="absolute top-2 right-2">
            <div
              className="w-2 h-2 bg-blue-500 rounded-full"
              title={`Matched: ${matchedFields.join(", ")}`}
            />
          </div>
        )}
      </div>
      <h3
        className="text-sm font-semibold text-gray-900 truncate mt-2"
        title={icon.name}
      >
        {icon.name}
      </h3>
    </div>
  );
});
