import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import type { UpdateDocumentInput } from "@/types";

type RouteContext = { params: Promise<{ id: string }> };

// GET /api/documents/[id]
export async function GET(_req: Request, { params }: RouteContext) {
  try {
    const { id } = await params;
    const supabase = await createClient();
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { data: doc, error } = await supabase
      .from("documents")
      .select("*")
      .eq("id", id)
      .single();

    if (error || !doc) {
      return NextResponse.json({ error: "Document not found" }, { status: 404 });
    }

    // Determine if viewer is owner or collaborator
    const isOwner = doc.owner_id === user.id;
    const isShared = !isOwner; // RLS already enforces access

    // Fetch shares for owners (to display in share modal)
    let shares: { shared_with_id: string }[] = [];
    if (isOwner) {
      const { data } = await supabase
        .from("document_shares")
        .select("shared_with_id")
        .eq("document_id", id);
      shares = data ?? [];
    }

    return NextResponse.json({ data: { ...doc, is_shared: isShared, shares } });
  } catch (err) {
    console.error("GET /api/documents/[id] error:", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

// PUT /api/documents/[id] — update title and/or content
export async function PUT(request: Request, { params }: RouteContext) {
  try {
    const { id } = await params;
    const supabase = await createClient();
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body: UpdateDocumentInput = await request.json();

    // Build update payload (only allow title + content)
    const updates: UpdateDocumentInput = {};
    if (body.title !== undefined) updates.title = body.title;
    if (body.content !== undefined) updates.content = body.content;

    if (Object.keys(updates).length === 0) {
      return NextResponse.json({ error: "No valid fields to update" }, { status: 400 });
    }

    // RLS ensures only owner or shared user can update
    const { data: doc, error } = await supabase
      .from("documents")
      .update(updates)
      .eq("id", id)
      .select()
      .single();

    if (error || !doc) {
      console.error("DB error updating document:", error);
      return NextResponse.json({ error: "Failed to update document" }, { status: 500 });
    }

    return NextResponse.json({ data: doc });
  } catch (err) {
    console.error("PUT /api/documents/[id] error:", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

// DELETE /api/documents/[id] — only owner can delete
export async function DELETE(_req: Request, { params }: RouteContext) {
  try {
    const { id } = await params;
    const supabase = await createClient();
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Verify ownership before delete
    const { data: doc } = await supabase
      .from("documents")
      .select("owner_id")
      .eq("id", id)
      .single();

    if (!doc || doc.owner_id !== user.id) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const { error } = await supabase.from("documents").delete().eq("id", id);
    if (error) {
      return NextResponse.json({ error: "Failed to delete document" }, { status: 500 });
    }

    return NextResponse.json({ data: { deleted: true } });
  } catch (err) {
    console.error("DELETE /api/documents/[id] error:", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
