import { describe, it, expect } from "vitest";
import { textToTiptapJson, markdownToTiptapJson, truncate } from "../lib/utils";

describe("Utils", () => {
  describe("truncate", () => {
    it("should truncate long strings", () => {
      expect(truncate("Hello World", 5)).toBe("Hello…");
    });

    it("should not truncate short strings", () => {
      expect(truncate("Hello", 10)).toBe("Hello");
    });
  });

  describe("textToTiptapJson", () => {
    it("should convert plain text to Tiptap JSON format", () => {
      const input = "Line 1\n\nLine 2";
      const result = textToTiptapJson(input);
      expect(result).toEqual({
        type: "doc",
        content: [
          { type: "paragraph", content: [{ type: "text", text: "Line 1" }] },
          { type: "paragraph", content: [{ type: "text", text: "Line 2" }] },
        ],
      });
    });
  });

  describe("markdownToTiptapJson", () => {
    it("should convert basic markdown headings to Tiptap JSON", () => {
      const input = "# Heading 1\n## Heading 2\nNormal text";
      const result = markdownToTiptapJson(input);
      
      expect(result.type).toBe("doc");
      expect((result.content as any[])[0]).toEqual({
        type: "heading",
        attrs: { level: 1 },
        content: [{ type: "text", text: "Heading 1" }],
      });
      expect((result.content as any[])[1]).toEqual({
        type: "heading",
        attrs: { level: 2 },
        content: [{ type: "text", text: "Heading 2" }],
      });
      expect((result.content as any[])[2]).toEqual({
        type: "paragraph",
        content: [{ type: "text", text: "Normal text" }],
      });
    });
    
    it("should handle empty strings gracefully", () => {
      const result = markdownToTiptapJson("");
      expect(result).toEqual({ type: "doc", content: [{ type: "paragraph" }] });
    });
  });
});
