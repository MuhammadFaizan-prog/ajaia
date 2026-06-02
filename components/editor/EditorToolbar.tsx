"use client";

import { type Editor } from "@tiptap/react";
import {
  TextB,
  TextItalic,
  TextUnderline,
  TextStrikethrough,
  ListBullets,
  ListNumbers,
  Link as LinkIcon,
  Image as ImageIcon,
  Minus,
  TextAlignLeft,
  CaretDown
} from "@phosphor-icons/react";
import { cn } from "@/lib/utils";

interface Props {
  editor: Editor | null;
}

export default function EditorToolbar({ editor }: Props) {
  if (!editor) return null;

  const ToolbarBtn = ({ 
    action, 
    isActive, 
    children 
  }: { 
    action?: () => void; 
    isActive?: boolean; 
    children: React.ReactNode 
  }) => (
    <button
      type="button"
      onClick={action}
      className={cn(
        "w-8 h-8 flex items-center justify-center radius-button transition-colors",
        isActive
          ? "bg-[#EEF2FF] text-[#4F6EF7]"
          : "text-primary hover:bg-gray-100"
      )}
    >
      {children}
    </button>
  );

  const Divider = () => <div className="mx-1 hidden h-6 w-px bg-base sm:block" />;

  return (
    <div className="sticky top-4 z-20 mx-auto mb-6 w-full max-w-[860px] px-2 sm:px-0">
      <div className="radius-card flex flex-nowrap items-center gap-1.5 border border-base bg-white px-3 py-2 shadow-lg sm:gap-2 overflow-x-auto scrollbar-hide">
        <div className="flex items-center shrink-0 gap-0.5 text-xs font-bold text-primary">
          <ToolbarBtn
            action={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
            isActive={editor.isActive("heading", { level: 1 })}
          >
            H1
          </ToolbarBtn>
          <ToolbarBtn
            action={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
            isActive={editor.isActive("heading", { level: 2 })}
          >
            H2
          </ToolbarBtn>
          <ToolbarBtn
            action={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
            isActive={editor.isActive("heading", { level: 3 })}
          >
            H3
          </ToolbarBtn>
        </div>
        
        <Divider />
        
        <div className="flex items-center gap-0.5">
          <ToolbarBtn
            action={() => editor.chain().focus().toggleBold().run()}
            isActive={editor.isActive("bold")}
          >
            <TextB weight="bold" />
          </ToolbarBtn>
          <ToolbarBtn
            action={() => editor.chain().focus().toggleItalic().run()}
            isActive={editor.isActive("italic")}
          >
            <TextItalic weight="bold" />
          </ToolbarBtn>
          <ToolbarBtn
            action={() => editor.chain().focus().toggleUnderline().run()}
            isActive={editor.isActive("underline")}
          >
            <TextUnderline weight="bold" />
          </ToolbarBtn>
          <ToolbarBtn
            action={() => editor.chain().focus().toggleStrike().run()}
            isActive={editor.isActive("strike")}
          >
            <TextStrikethrough weight="bold" />
          </ToolbarBtn>
        </div>
        
        <Divider />
        
        <div className="flex items-center gap-0.5">
          <ToolbarBtn
            action={() => editor.chain().focus().toggleBulletList().run()}
            isActive={editor.isActive("bulletList")}
          >
            <ListBullets weight="bold" />
          </ToolbarBtn>
          <ToolbarBtn
            action={() => editor.chain().focus().toggleOrderedList().run()}
            isActive={editor.isActive("orderedList")}
          >
            <ListNumbers weight="bold" />
          </ToolbarBtn>
        </div>
        
        <Divider />
        
        <div className="flex items-center gap-0.5">
          <ToolbarBtn>
            <LinkIcon weight="bold" />
          </ToolbarBtn>
          <ToolbarBtn>
            <ImageIcon weight="bold" />
          </ToolbarBtn>
          <ToolbarBtn action={() => editor.chain().focus().setHorizontalRule().run()}>
            <Minus weight="bold" />
          </ToolbarBtn>
        </div>
        
        <Divider />
        
        <button className="radius-button flex items-center gap-2 px-2 py-1 text-xs font-medium text-secondary hover:bg-gray-100">
          <TextAlignLeft weight="bold" />
          <CaretDown className="text-[10px]" />
        </button>
      </div>
    </div>
  );
}
