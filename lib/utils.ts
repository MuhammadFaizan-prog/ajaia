/**
 * Utility helpers
 * AI-assisted: clsx + tailwind-merge pattern for conditional class merging
 */
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatDate(dateString: string): string {
  const date = new Date(dateString);
  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(date);
}

export function truncate(str: string, maxLength: number): string {
  if (str.length <= maxLength) return str;
  return str.slice(0, maxLength) + "…";
}

/** Convert plain text to a minimal Tiptap JSON document */
export function textToTiptapJson(text: string): Record<string, unknown> {
  const paragraphs = text.split(/\n+/).filter(Boolean);
  return {
    type: "doc",
    content: paragraphs.map((p) => ({
      type: "paragraph",
      content: [{ type: "text", text: p }],
    })),
  };
}

/** Convert markdown headings/bold/italic/lists to Tiptap JSON (basic) */
export function markdownToTiptapJson(md: string): Record<string, unknown> {
  const lines = md.split("\n");
  const content: Record<string, unknown>[] = [];

  for (const line of lines) {
    const trimmed = line.trim();
    if (!trimmed) continue;

    // Headings
    const h3 = trimmed.match(/^### (.+)/);
    const h2 = trimmed.match(/^## (.+)/);
    const h1 = trimmed.match(/^# (.+)/);
    // Unordered list
    const ul = trimmed.match(/^[-*] (.+)/);
    // Ordered list
    const ol = trimmed.match(/^\d+\. (.+)/);

    if (h1) {
      content.push({ type: "heading", attrs: { level: 1 }, content: [{ type: "text", text: h1[1] }] });
    } else if (h2) {
      content.push({ type: "heading", attrs: { level: 2 }, content: [{ type: "text", text: h2[1] }] });
    } else if (h3) {
      content.push({ type: "heading", attrs: { level: 3 }, content: [{ type: "text", text: h3[1] }] });
    } else if (ul) {
      content.push({
        type: "bulletList",
        content: [{ type: "listItem", content: [{ type: "paragraph", content: [{ type: "text", text: ul[1] }] }] }],
      });
    } else if (ol) {
      content.push({
        type: "orderedList",
        content: [{ type: "listItem", content: [{ type: "paragraph", content: [{ type: "text", text: ol[1] }] }] }],
      });
    } else {
      // Inline bold/italic (simplified)
      const text = trimmed.replace(/\*\*(.+?)\*\*/g, "$1").replace(/\*(.+?)\*/g, "$1").replace(/_(.+?)_/g, "$1");
      content.push({ type: "paragraph", content: [{ type: "text", text }] });
    }
  }

  return { type: "doc", content: content.length ? content : [{ type: "paragraph" }] };
}
