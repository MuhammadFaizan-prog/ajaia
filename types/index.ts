export interface Document {
  id: string;
  title: string;
  content: Record<string, unknown>; // Tiptap JSON
  owner_id: string;
  created_at: string;
  updated_at: string;
  // Joined fields
  owner_email?: string;
  is_shared?: boolean; // true if viewing as a shared collaborator
}

export interface DocumentShare {
  id: string;
  document_id: string;
  shared_with_id: string;
  created_at: string;
  shared_with_email?: string;
}

export interface User {
  id: string;
  email: string;
}

export type CreateDocumentInput = {
  title?: string;
  content?: Record<string, unknown>;
};

export type UpdateDocumentInput = {
  title?: string;
  content?: Record<string, unknown>;
};

export type ShareDocumentInput = {
  email: string; // email of user to share with
};

export type ApiResponse<T> =
  | { data: T; error: null }
  | { data: null; error: string };
