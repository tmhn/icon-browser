"use client";

import { useState, memo } from "react";
import {
  ClipboardDocumentIcon,
  CheckIcon,
  EyeIcon,
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
}: IconCardProps) {
  const { icon } = result;
  const [copied, setCopied] = useState(false);

  const getIconPath = (icon: Icon) =>
    icon.filePath.replace("/line/", `/${iconStyle}/`);

  const copyToClipboard = async (e: React.MouseEvent) => {
    e.stopPropagation();
    try {
      await navigator.clipboard.writeText(icon.name);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {}
  };

  return (
    <div className="flex flex-col items-center">
      <div
        className="group relative bg-white rounded-2xl cursor-pointer w-full aspect-square flex items-center justify-center transition-all duration-200 hover:scale-[1.05] hover:shadow-xl"
        style={{ border: "1px solid var(--border-md)" }}
        onClick={() => onIconClick(icon)}
      >
        <img
          src={getIconPath(icon)}
          alt={icon.name}
          className="w-8 h-8 object-contain"
          onError={(e) => {
            (e.target as HTMLImageElement).style.display = "none";
          }}
        />

        {/* Hover overlay */}
        <div
          className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-150 flex flex-col items-center justify-center gap-2"
          style={{ background: "rgba(255,255,255,0.97)" }}
        >
          <button
            onClick={copyToClipboard}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all duration-100"
            style={
              copied
                ? { background: "#e8f5e9", color: "#2e7d32" }
                : { background: "var(--accent)", color: "#ffffff" }
            }
            title="Copy name"
          >
            {copied ? (
              <>
                <CheckIcon className="h-3 w-3" />
                <span>Copied</span>
              </>
            ) : (
              <>
                <ClipboardDocumentIcon className="h-3 w-3" />
                <span>Copy</span>
              </>
            )}
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              onIconClick(icon);
            }}
            className="p-1.5 rounded-lg transition-colors"
            style={{ color: "var(--text-dim)" }}
            onMouseEnter={(e) => (e.currentTarget.style.color = "var(--text)")}
            onMouseLeave={(e) => (e.currentTarget.style.color = "var(--text-dim)")}
            title="Preview"
          >
            <EyeIcon className="h-3.5 w-3.5" />
          </button>
        </div>
      </div>

      <p
        className="mt-1.5 text-[11px] truncate w-full text-center px-1 leading-tight"
        style={{ color: "var(--text-dim)", fontWeight: 500 }}
        title={icon.name}
      >
        {icon.name}
      </p>
    </div>
  );
});
