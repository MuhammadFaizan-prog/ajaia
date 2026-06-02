# Ajaia Docs — Collaborative Document Editor

A lightweight Google Docs-inspired collaborative document editor built for the Ajaia LLC technical assessment.

## Core Features
1. **Rich Text Editing**: Create, edit, and format text using Tiptap (bold, italic, underline, headings, lists, alignment).
2. **File Import**: Upload `.txt` and `.md` files to automatically convert them into editable rich-text documents.
3. **Sharing**: Securely share documents with other registered users by email.
4. **Persistence & Autosave**: Documents are saved automatically (debounced 1.5s) to Supabase.
5. **Ownership & Access Control**: View distinct "Owned" vs "Shared with me" documents. Row-Level Security (RLS) ensures data privacy.

## Tech Stack
- **Frontend/Backend**: Next.js 14 (App Router), TypeScript
- **Styling**: Tailwind CSS
- **Editor**: Tiptap v2 (ProseMirror based)
- **Database / Auth**: Supabase (PostgreSQL)
- **Testing**: Vitest

## Local Setup Instructions

1. **Clone or unzip the repository**
   ```bash
   cd ajaia
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Configure Environment Variables**
   Create a `.env.local` file in the root directory based on `.env.example`:
   ```bash
   NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
   SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key
   ```
   *(Note: The live deployment already has these configured. If you are reviewing the code locally, you can use the test accounts on the live URL, or set up your own Supabase project using the provided `supabase/schema.sql` file).*

4. **Run the development server**
   ```bash
   npm run dev
   ```
   Open [http://localhost:3000](http://localhost:3000)

5. **Run Tests**
   ```bash
   npx vitest run
   ```

## Test Accounts
You can test the sharing flow immediately on the live deployment using these seeded accounts:
- **Account 1**: `test1@ajaia.dev` / Password: `Test1234!`
- **Account 2**: `test2@ajaia.dev` / Password: `Test1234!`
