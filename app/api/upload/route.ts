import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { textToTiptapJson, markdownToTiptapJson } from "@/lib/utils";

export async function POST(request: Request) {
  try {
    const supabase = await createClient();

    // Auth check
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const formData = await request.formData();
    const file = formData.get("file") as File | null;

    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 });
    }

    // Validate file type — only .txt and .md supported
    const fileName = file.name.toLowerCase();
    const isText = fileName.endsWith(".txt");
    const isMarkdown = fileName.endsWith(".md");

    if (!isText && !isMarkdown) {
      return NextResponse.json(
        { error: "Only .txt and .md files are supported" },
        { status: 415 }
      );
    }

    // Validate file size (max 5 MB)
    if (file.size > 5 * 1024 * 1024) {
      return NextResponse.json(
        { error: "File too large. Maximum size is 5 MB." },
        { status: 413 }
      );
    }

    // Read content
    const rawText = await file.text();

    // AI-assisted: convert raw text to structured Tiptap JSON
    const content = isMarkdown
      ? markdownToTiptapJson(rawText)
      : textToTiptapJson(rawText);

    // Derive a document title from the filename (strip extension)
    const title = file.name.replace(/\.(txt|md)$/i, "").replace(/[-_]/g, " ") || "Imported Document";

    // Create document in DB
    const { data: doc, error: dbError } = await supabase
      .from("documents")
      .insert({
        title,
        content,
        owner_id: user.id,
      })
      .select()
      .single();

    if (dbError) {
      console.error("DB error creating document from upload:", dbError);
      return NextResponse.json({ error: "Failed to create document" }, { status: 500 });
    }

    return NextResponse.json({ data: doc }, { status: 201 });
  } catch (err) {
    console.error("Upload error:", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
