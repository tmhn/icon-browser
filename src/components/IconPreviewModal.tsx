"use client";

import { useState, useEffect } from "react";
import {
  XMarkIcon,
  ClipboardDocumentIcon,
  CheckIcon,
  ArrowDownTrayIcon,
} from "@heroicons/react/24/outline";
import { Icon } from "@/types/icon";

interface IconPreviewModalProps {
  icon: Icon | null;
  isOpen: boolean;
  onClose: () => void;
  iconStyle: "line" | "solid";
  onIconStyleChange: (style: "line" | "solid") => void;
}

export function IconPreviewModal({
  icon,
  isOpen,
  onClose,
  iconStyle,
  onIconStyleChange,
}: IconPreviewModalProps) {
  const [copiedField, setCopiedField] = useState<string | null>(null);
  const [mounted, setMounted] = useState(false);

  const getIconPath = (icon: Icon) =>
    icon.filePath.replace("/line/", `/${iconStyle}/`);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
      requestAnimationFrame(() => setMounted(true));
    } else {
      setMounted(false);
      const t = setTimeout(() => {
        document.body.style.overflow = "unset";
      }, 250);
      return () => clearTimeout(t);
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    if (isOpen) document.addEventListener("keydown", handleEscape);
    return () => document.removeEventListener("keydown", handleEscape);
  }, [isOpen, onClose]);

  const copyToClipboard = async (text: string, field: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedField(field);
      setTimeout(() => setCopiedField(null), 2000);
    } catch {}
  };

  if (!icon || !isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="modal-backdrop fixed inset-0 bg-black/30 transition-opacity duration-250"
        style={{ opacity: mounted ? 1 : 0 }}
        onClick={onClose}
      />

      {/* Modal */}
      <div
        className="relative w-full max-w-2xl max-h-[90vh] overflow-hidden rounded-3xl shadow-2xl transition-all duration-250"
        style={{
          background: "var(--bg2)",
          border: "1px solid var(--border-md)",
          opacity: mounted ? 1 : 0,
          transform: mounted
            ? "translateY(0) scale(1)"
            : "translateY(12px) scale(0.97)",
        }}
      >
        {/* Header */}
        <div
          className="flex items-center justify-between px-6 py-4"
          style={{ borderBottom: "1px solid var(--border-md)" }}
        >
          <div>
            <h2 className="text-lg font-bold" style={{ color: "var(--text)" }}>
              {icon.name}
            </h2>
            <p className="text-xs mt-0.5" style={{ color: "var(--text-dim)" }}>
              {icon.category}
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl transition-all"
            style={{ background: "var(--bg)", color: "var(--text-dim)" }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = "var(--bg3)";
              e.currentTarget.style.color = "var(--text)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = "var(--bg)";
              e.currentTarget.style.color = "var(--text-dim)";
            }}
          >
            <XMarkIcon className="h-4 w-4" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto max-h-[calc(90vh-80px)]">
          <div className="grid grid-cols-1 lg:grid-cols-[220px_1fr] gap-6">

            {/* Left: icon preview + actions */}
            <div className="space-y-4">
              {/* Preview box */}
              <div
                className="aspect-square rounded-2xl flex items-center justify-center"
                style={{ background: "var(--bg)", border: "1px solid var(--border-md)" }}
              >
                <img
                  src={getIconPath(icon)}
                  alt={icon.name}
                  className="w-24 h-24 object-contain"
                  onError={(e) => {
                    (e.target as HTMLImageElement).style.display = "none";
                  }}
                />
              </div>

              {/* Style toggle */}
              <div
                className="flex items-center rounded-xl p-1"
                style={{ background: "var(--bg3)" }}
              >
                {(["line", "solid"] as const).map((style) => (
                  <button
                    key={style}
                    onClick={() => onIconStyleChange(style)}
                    className="flex-1 py-1.5 rounded-lg text-xs font-semibold capitalize transition-all duration-150"
                    style={
                      iconStyle === style
                        ? {
                            background: "var(--bg2)",
                            color: "var(--text)",
                            boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
                          }
                        : { color: "var(--text-dim)" }
                    }
                  >
                    {style}
                  </button>
                ))}
              </div>

              {/* Actions */}
              <div className="grid grid-cols-2 gap-2">
                <button
                  onClick={() => copyToClipboard(icon.name, "name")}
                  className="flex items-center justify-center gap-1.5 py-2.5 rounded-xl text-xs font-bold transition-all"
                  style={{ background: "var(--accent)", color: "#ffffff" }}
                  onMouseEnter={(e) =>
                    (e.currentTarget.style.background = "#2c2b35")
                  }
                  onMouseLeave={(e) =>
                    (e.currentTarget.style.background = "var(--accent)")
                  }
                >
                  {copiedField === "name" ? (
                    <>
                      <CheckIcon className="h-3.5 w-3.5" />
                      Copied!
                    </>
                  ) : (
                    <>
                      <ClipboardDocumentIcon className="h-3.5 w-3.5" />
                      Copy name
                    </>
                  )}
                </button>
                <button
                  onClick={() => console.log("Download:", icon.filePath)}
                  className="flex items-center justify-center gap-1.5 py-2.5 rounded-xl text-xs font-bold transition-all"
                  style={{
                    background: "var(--bg)",
                    color: "var(--text)",
                    border: "1px solid var(--border-md)",
                  }}
                  onMouseEnter={(e) =>
                    (e.currentTarget.style.background = "var(--bg3)")
                  }
                  onMouseLeave={(e) =>
                    (e.currentTarget.style.background = "var(--bg)")
                  }
                >
                  <ArrowDownTrayIcon className="h-3.5 w-3.5" />
                  SVG
                </button>
              </div>
            </div>

            {/* Right: details */}
            <div className="space-y-6">
              {/* Details table */}
              <div>
                <h3
                  className="text-[10px] font-bold uppercase tracking-widest mb-3"
                  style={{ color: "var(--text-dim)" }}
                >
                  Details
                </h3>
                <div className="space-y-0">
                  {[
                    { label: "Filename", value: icon.filename, field: "filename" },
                    { label: "Category", value: icon.category, field: null },
                    { label: "Format", value: icon.format.toUpperCase(), field: null },
                    ...(icon.size
                      ? [{ label: "Size", value: `${icon.size.width} × ${icon.size.height}px`, field: null }]
                      : []),
                  ].map(({ label, value, field }) => (
                    <div
                      key={label}
                      className="flex items-center justify-between py-2.5"
                      style={{ borderBottom: "1px solid var(--border)" }}
                    >
                      <span className="text-xs" style={{ color: "var(--text-dim)" }}>
                        {label}
                      </span>
                      <div className="flex items-center gap-1.5">
                        <span className="text-xs font-medium" style={{ color: "var(--text)" }}>
                          {value}
                        </span>
                        {field && (
                          <button
                            onClick={() => copyToClipboard(value, field)}
                            className="transition-colors"
                            style={{ color: "var(--text-dim)" }}
                            onMouseEnter={(e) => (e.currentTarget.style.color = "var(--text)")}
                            onMouseLeave={(e) => (e.currentTarget.style.color = "var(--text-dim)")}
                          >
                            {copiedField === field ? (
                              <CheckIcon className="h-3 w-3" style={{ color: "#2e7d32" }} />
                            ) : (
                              <ClipboardDocumentIcon className="h-3 w-3" />
                            )}
                          </button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Tags */}
              {icon.tags.length > 0 && (
                <div>
                  <h3
                    className="text-[10px] font-bold uppercase tracking-widest mb-3"
                    style={{ color: "var(--text-dim)" }}
                  >
                    Tags
                  </h3>
                  <div className="flex flex-wrap gap-1.5">
                    {icon.tags.map((tag) => (
                      <span
                        key={tag}
                        className="px-2.5 py-1 rounded-full text-[11px] font-medium"
                        style={{
                          background: "var(--bg)",
                          color: "var(--text-mid)",
                          border: "1px solid var(--border-md)",
                        }}
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Synonyms */}
              {icon.synonyms.length > 0 && (
                <div>
                  <h3
                    className="text-[10px] font-bold uppercase tracking-widest mb-3"
                    style={{ color: "var(--text-dim)" }}
                  >
                    Also known as
                  </h3>
                  <div className="flex flex-wrap gap-1.5">
                    {icon.synonyms.map((s) => (
                      <span
                        key={s}
                        className="px-2.5 py-1 rounded-full text-[11px] font-medium"
                        style={{
                          background: "var(--bg3)",
                          color: "var(--text-mid)",
                        }}
                      >
                        {s}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Description */}
              {icon.description && (
                <div>
                  <h3
                    className="text-[10px] font-bold uppercase tracking-widest mb-2"
                    style={{ color: "var(--text-dim)" }}
                  >
                    About
                  </h3>
                  <p className="text-xs leading-relaxed" style={{ color: "var(--text-mid)" }}>
                    {icon.description}
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
