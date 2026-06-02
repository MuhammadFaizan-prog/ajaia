import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import EditorPage from "@/components/editor/EditorPage";

type Props = { params: Promise<{ id: string }> };

export default async function DocumentPage({ params }: Props) {
  const { id } = await params;
  const supabase = await createClient();

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const { data: doc, error } = await supabase
    .from("documents")
    .select("id, title, content, owner_id, updated_at")
    .eq("id", id)
    .single();

  if (error || !doc) redirect("/");

  const isOwner = doc.owner_id === user.id;

  return (
    <EditorPage
      docId={id}
      initialTitle={doc.title}
      initialContent={doc.content as Record<string, unknown>}
      isOwner={isOwner}
      userEmail={user.email ?? ""}
      userId={user.id}
    />
  );
}
