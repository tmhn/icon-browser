"use client";

import { useState, useEffect } from "react";
import {
  XMarkIcon,
  ClipboardDocumentIcon,
  CheckIcon,
  ArrowDownTrayIcon,
} from "@heroicons/react/24/outline";
import { cn } from "@/lib/utils";
import { Icon } from "@/types/icon";

interface IconPreviewModalProps {
  icon: Icon | null;
  isOpen: boolean;
  onClose: () => void;
}

export function IconPreviewModal({
  icon,
  isOpen,
  onClose,
}: IconPreviewModalProps) {
  const [copiedField, setCopiedField] = useState<string | null>(null);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }

    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener("keydown", handleEscape);
    }

    return () => {
      document.removeEventListener("keydown", handleEscape);
    };
  }, [isOpen, onClose]);

  const copyToClipboard = async (text: string, field: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedField(field);
      setTimeout(() => setCopiedField(null), 2000);
    } catch (err) {
      console.error("Failed to copy: ", err);
    }
  };

  const getFormatColor = (format: string) => {
    switch (format) {
      case "svg":
        return "bg-green-100 text-green-800 border-green-200";
      case "png":
        return "bg-blue-100 text-blue-800 border-blue-200";
      case "jpg":
      case "jpeg":
        return "bg-purple-100 text-purple-800 border-purple-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  if (!icon || !isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex min-h-full items-center justify-center p-4">
        {/* Backdrop */}
        <div
          className="fixed inset-0 bg-black bg-opacity-50 transition-opacity"
          onClick={onClose}
        />

        {/* Modal */}
        <div className="relative bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-hidden">
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-gray-200">
            <div>
              <h2 className="text-2xl font-bold text-gray-900">{icon.name}</h2>
              <p className="text-sm text-gray-500 mt-1">{icon.category}</p>
            </div>
            <button
              onClick={onClose}
              className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <XMarkIcon className="h-6 w-6" />
            </button>
          </div>

          {/* Content */}
          <div className="p-6 overflow-y-auto max-h-[calc(90vh-140px)]">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Icon Preview */}
              <div className="space-y-4">
                <div className="aspect-square bg-gray-50 rounded-xl flex items-center justify-center border-2 border-dashed border-gray-300">
                  <div className="w-24 h-24 flex items-center justify-center">
                    <img
                      src={icon.filePath}
                      alt={icon.name}
                      className="w-20 h-20 object-contain"
                      onError={(e) => {
                        // Fallback if icon doesn't load
                        const target = e.target as HTMLImageElement;
                        target.style.display = "none";
                        const fallback =
                          target.nextElementSibling as HTMLElement;
                        if (fallback) fallback.style.display = "flex";
                      }}
                    />
                    <div
                      className="w-20 h-20 bg-gray-300 rounded-lg flex items-center justify-center"
                      style={{ display: "none" }}
                    >
                      <span className="text-lg font-medium text-gray-600">
                        {icon.format.toUpperCase()}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Format Badge */}
                <div className="flex items-center justify-center">
                  <span
                    className={cn(
                      "inline-flex items-center px-4 py-2 rounded-full text-sm font-medium border",
                      getFormatColor(icon.format)
                    )}
                  >
                    {icon.format.toUpperCase()} Format
                  </span>
                </div>

                {/* Actions */}
                <div className="flex space-x-3">
                  <button
                    onClick={() => copyToClipboard(icon.name, "name")}
                    className="flex-1 flex items-center justify-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    {copiedField === "name" ? (
                      <CheckIcon className="h-4 w-4 mr-2" />
                    ) : (
                      <ClipboardDocumentIcon className="h-4 w-4 mr-2" />
                    )}
                    Copy Name
                  </button>

                  <button
                    onClick={() => {
                      // In a real app, this would trigger download
                      console.log("Download:", icon.filePath);
                    }}
                    className="flex-1 flex items-center justify-center px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
                  >
                    <ArrowDownTrayIcon className="h-4 w-4 mr-2" />
                    Download
                  </button>
                </div>
              </div>

              {/* Details */}
              <div className="space-y-6">
                {/* Basic Info */}
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">
                    Details
                  </h3>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center py-2 border-b border-gray-100">
                      <span className="text-sm font-medium text-gray-600">
                        Filename
                      </span>
                      <div className="flex items-center space-x-2">
                        <span className="text-sm text-gray-900">
                          {icon.filename}
                        </span>
                        <button
                          onClick={() =>
                            copyToClipboard(icon.filename, "filename")
                          }
                          className="p-1 text-gray-400 hover:text-gray-600"
                        >
                          {copiedField === "filename" ? (
                            <CheckIcon className="h-3 w-3 text-green-600" />
                          ) : (
                            <ClipboardDocumentIcon className="h-3 w-3" />
                          )}
                        </button>
                      </div>
                    </div>

                    <div className="flex justify-between items-center py-2 border-b border-gray-100">
                      <span className="text-sm font-medium text-gray-600">
                        Category
                      </span>
                      <span className="text-sm text-gray-900">
                        {icon.category}
                      </span>
                    </div>

                    <div className="flex justify-between items-center py-2 border-b border-gray-100">
                      <span className="text-sm font-medium text-gray-600">
                        Format
                      </span>
                      <span className="text-sm text-gray-900 uppercase">
                        {icon.format}
                      </span>
                    </div>

                    {icon.size && (
                      <div className="flex justify-between items-center py-2 border-b border-gray-100">
                        <span className="text-sm font-medium text-gray-600">
                          Dimensions
                        </span>
                        <span className="text-sm text-gray-900">
                          {icon.size.width} × {icon.size.height}px
                        </span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Tags */}
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">
                    Tags
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {icon.tags.map((tag) => (
                      <span
                        key={tag}
                        className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Synonyms */}
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">
                    Synonyms
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {icon.synonyms.map((synonym) => (
                      <span
                        key={synonym}
                        className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800"
                      >
                        {synonym}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Description */}
                {icon.description && (
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-3">
                      Description
                    </h3>
                    <p className="text-sm text-gray-600">{icon.description}</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
