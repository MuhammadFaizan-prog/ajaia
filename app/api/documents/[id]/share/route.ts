import { NextResponse } from "next/server";
import { createClient, createServiceClient } from "@/lib/supabase/server";
import type { ShareDocumentInput } from "@/types";

type RouteContext = { params: Promise<{ id: string }> };

// POST /api/documents/[id]/share — share with another user by email
export async function POST(request: Request, { params }: RouteContext) {
  try {
    const { id: documentId } = await params;
    const supabase = await createClient();
    const serviceClient = await createServiceClient();

    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Verify requester is the owner
    const { data: doc } = await supabase
      .from("documents")
      .select("owner_id")
      .eq("id", documentId)
      .single();

    if (!doc || doc.owner_id !== user.id) {
      return NextResponse.json({ error: "Forbidden: only owner can share" }, { status: 403 });
    }

    const body: ShareDocumentInput = await request.json();
    const email = body.email?.trim().toLowerCase();

    if (!email) {
      return NextResponse.json({ error: "Email is required" }, { status: 400 });
    }

    if (email === user.email?.toLowerCase()) {
      return NextResponse.json({ error: "You cannot share a document with yourself" }, { status: 400 });
    }

    // Look up user by email using service role (bypasses RLS on auth.users)
    // AI-assisted: listUsers with filter is the correct Supabase Admin API approach
    const { data: { users: allUsers }, error: listError } = await serviceClient.auth.admin.listUsers({
      perPage: 1000,
    });

    if (listError) {
      console.error("Error listing users:", listError);
      return NextResponse.json({ error: "Failed to look up user" }, { status: 500 });
    }

    const targetUser = allUsers.find((u) => u.email?.toLowerCase() === email);

    if (!targetUser) {
      return NextResponse.json(
        { error: `No account found for ${email}. Ask them to sign up first.` },
        { status: 404 }
      );
    }

    // Create the share record
    const { data: share, error: shareError } = await supabase
      .from("document_shares")
      .upsert(
        { document_id: documentId, shared_with_id: targetUser.id },
        { onConflict: "document_id,shared_with_id" }
      )
      .select()
      .single();

    if (shareError) {
      console.error("DB error creating share:", shareError);
      return NextResponse.json({ error: "Failed to create share" }, { status: 500 });
    }

    return NextResponse.json({
      data: { ...share, shared_with_email: targetUser.email },
    });
  } catch (err) {
    console.error("POST /api/documents/[id]/share error:", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

// DELETE /api/documents/[id]/share — remove a share
export async function DELETE(request: Request, { params }: RouteContext) {
  try {
    const { id: documentId } = await params;
    const supabase = await createClient();

    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { sharedWithId } = await request.json();

    const { error } = await supabase
      .from("document_shares")
      .delete()
      .eq("document_id", documentId)
      .eq("shared_with_id", sharedWithId);

    if (error) {
      return NextResponse.json({ error: "Failed to remove share" }, { status: 500 });
    }

    return NextResponse.json({ data: { removed: true } });
  } catch (err) {
    console.error("DELETE /api/documents/[id]/share error:", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
