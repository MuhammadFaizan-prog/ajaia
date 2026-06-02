-- ============================================================
-- Ajaia Docs — Supabase Schema
-- Run this in your Supabase SQL Editor
-- ============================================================

-- Enable UUID extension (usually already enabled)
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ─── Documents ───────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS documents (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title       TEXT NOT NULL DEFAULT 'Untitled Document',
  content     JSONB NOT NULL DEFAULT '{"type":"doc","content":[]}',
  owner_id    UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at  TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Auto-update updated_at
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER documents_updated_at
  BEFORE UPDATE ON documents
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- ─── Document Shares ─────────────────────────────────────────
CREATE TABLE IF NOT EXISTS document_shares (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  document_id     UUID NOT NULL REFERENCES documents(id) ON DELETE CASCADE,
  shared_with_id  UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  created_at      TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE(document_id, shared_with_id)
);

-- ─── Row Level Security ──────────────────────────────────────
ALTER TABLE documents ENABLE ROW LEVEL SECURITY;
ALTER TABLE document_shares ENABLE ROW LEVEL SECURITY;

-- Documents: owner can do everything
CREATE POLICY "documents_owner_all" ON documents
  FOR ALL USING (auth.uid() = owner_id);

-- Documents: shared users can select + update
CREATE POLICY "documents_shared_select" ON documents
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM document_shares
      WHERE document_id = documents.id
        AND shared_with_id = auth.uid()
    )
  );

CREATE POLICY "documents_shared_update" ON documents
  FOR UPDATE USING (
    EXISTS (
      SELECT 1 FROM document_shares
      WHERE document_id = documents.id
        AND shared_with_id = auth.uid()
    )
  );

-- Helper function to check document ownership without RLS recursion.
-- AI-assisted: keep SECURITY DEFINER helpers outside exposed schemas.
CREATE SCHEMA IF NOT EXISTS private;

DROP FUNCTION IF EXISTS public.is_document_owner(UUID);

CREATE OR REPLACE FUNCTION private.is_document_owner(doc_id UUID)
RETURNS BOOLEAN
LANGUAGE sql
SECURITY DEFINER
SET search_path = ''
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.documents
    WHERE public.documents.id = doc_id
      AND public.documents.owner_id = auth.uid()
  );
$$;

-- Shares: owner can manage shares for their documents
CREATE POLICY "shares_owner_all" ON document_shares
  FOR ALL TO authenticated USING (
    private.is_document_owner(document_id)
  );

-- Shares: shared users can see their own share records
CREATE POLICY "shares_shared_select" ON document_shares
  FOR SELECT USING (shared_with_id = auth.uid());

-- ─── Seed Test Accounts (optional, do via Supabase Auth UI) ─
-- test1@ajaia.dev / Test1234!
-- test2@ajaia.dev / Test1234!
