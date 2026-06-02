import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import type { CreateDocumentInput } from "@/types";

// GET /api/documents — list owned + shared documents
export async function GET() {
  try {
    const supabase = await createClient();
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Owned documents
    const { data: owned, error: ownedError } = await supabase
      .from("documents")
      .select("id, title, owner_id, created_at, updated_at")
      .eq("owner_id", user.id)
      .order("updated_at", { ascending: false });

    if (ownedError) throw ownedError;

    // Shared documents (where I'm a collaborator)
    const { data: sharedLinks, error: sharedError } = await supabase
      .from("document_shares")
      .select("document_id, documents(id, title, owner_id, created_at, updated_at)")
      .eq("shared_with_id", user.id);

    if (sharedError) throw sharedError;

    const shared = (sharedLinks ?? []).flatMap((link) => {
      const document = Array.isArray(link.documents) ? link.documents[0] : link.documents;
      return document ? [{ ...(document as Record<string, unknown>), is_shared: true }] : [];
    });

    return NextResponse.json({
      data: {
        owned: (owned ?? []).map((d) => ({ ...d, is_shared: false })),
        shared,
      },
    });
  } catch (err) {
    console.error("GET /api/documents error:", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

// POST /api/documents — create a new document
export async function POST(request: Request) {
  try {
    const supabase = await createClient();
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body: CreateDocumentInput = await request.json().catch(() => ({}));

    const { data: doc, error: dbError } = await supabase
      .from("documents")
      .insert({
        title: body.title ?? "Untitled Document",
        content: body.content ?? { type: "doc", content: [] },
        owner_id: user.id,
      })
      .select()
      .single();

    if (dbError) {
      console.error("DB error creating document:", dbError);
      return NextResponse.json({ error: "Failed to create document" }, { status: 500 });
    }

    return NextResponse.json({ data: doc }, { status: 201 });
  } catch (err) {
    console.error("POST /api/documents error:", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
