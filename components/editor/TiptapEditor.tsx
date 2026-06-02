"use client";

import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import UnderlineExt from "@tiptap/extension-underline";
import TextAlign from "@tiptap/extension-text-align";
import Placeholder from "@tiptap/extension-placeholder";
import Strike from "@tiptap/extension-strike";
import EditorToolbar from "./EditorToolbar";
import { useEffect, useRef } from "react";

interface Props {
  content: Record<string, unknown>;
  onChange: (json: Record<string, unknown>) => void;
  editable?: boolean;
}

export default function TiptapEditor({ content, onChange, editable = true }: Props) {
  const onChangRef = useRef(onChange);
  onChangRef.current = onChange;

  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        heading: { levels: [1, 2, 3] },
        strike: false,
      }),
      Strike,
      UnderlineExt,
      TextAlign.configure({ types: ["heading", "paragraph"] }),
      Placeholder.configure({ placeholder: "Start writing your document…" }),
    ],
    content: content as object,
    editable,
    immediatelyRender: false,
    onUpdate({ editor }) {
      onChangRef.current(editor.getJSON() as Record<string, unknown>);
    },
  });

  const contentStr = JSON.stringify(content);
  const isFirstRender = useRef(true);
  useEffect(() => {
    if (!editor) return;
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }
    const current = JSON.stringify(editor.getJSON());
    if (current !== contentStr) {
      editor.commands.setContent(JSON.parse(contentStr), { emitUpdate: false });
    }
  }, [contentStr, editor]);

  return (
    <>
      {editable && <EditorToolbar editor={editor} />}
      <EditorContent
        editor={editor}
        className="tiptap-editor !w-full !max-w-full md:!max-w-[672px] xl:!max-w-[760px] !px-6 !py-8 md:!px-10 md:!py-10 xl:!px-[56px] xl:!py-[48px]"
      />
    </>
  );
}
