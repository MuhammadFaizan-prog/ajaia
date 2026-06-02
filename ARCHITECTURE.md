# Architecture & Tradeoffs

## What I Prioritized

1. **Architecture & Component Decoupling**: I separated the frontend presentation layer from the data mutation layer using explicit Next.js API routes (`/api/documents`) rather than directly querying Supabase from Client Components. This allows for clear RESTful boundaries and easier testing.
2. **Security & Data Isolation**: Implemented Row Level Security (RLS) policies directly in PostgreSQL (Supabase). This ensures that even if an API bug occurs, a user cannot read or modify a document they do not own or haven't been shared.
3. **UX & State Management**: I prioritized a debounced "autosave" mechanism (1.5s delay) paired with optimistic UI updates for document titles and content. This mimics the seamless feel of modern editors without overwhelming the database with updates on every keystroke.
4. **Rich Text Reliability**: I chose Tiptap over Slate or Quill because it relies on ProseMirror's robust JSON-based schema, ensuring that imported text and formatted content persist reliably without HTML sanitization headaches.

## What I Cut and Why

1. **Real-time multiplayer (Yjs/WebSockets)**: While Tiptap supports Yjs for live cursor tracking and conflict resolution, implementing a WebRTC/WebSocket signaling server robustly within 4–6 hours is too risky. I opted for a reliable async save model instead.
2. **.docx Parsing**: Supporting `.docx` uploads requires heavy parsing libraries (like `mammoth.js`) which add significant edge cases. I restricted uploads to `.txt` and `.md` to cleanly demonstrate the *logic* of file ingestion and document creation without getting bogged down in proprietary format parsing.
3. **Role-Based Access Control (RBAC)**: Currently, sharing grants implicit "Editor" access. Implementing granular Viewer vs. Editor permissions would require a more complex schema (`role` enum on the share table) and conditional rendering in the Tiptap toolbar. I cut this to prioritize core sharing functionality.

## What I'd Improve with More Time

- Add a `document_versions` table to support undo-history across sessions (Version History).
- Implement a Yjs provider (like Supabase Realtime or Liveblocks) for true multiplayer collaboration and presence indicators.
- Add debounced collaborative locking to prevent race conditions if two users edit the exact same block simultaneously in the current async model.
