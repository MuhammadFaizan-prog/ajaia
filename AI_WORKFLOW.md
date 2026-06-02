# AI Leverage Log

This document details how AI tooling was utilized to accelerate the development of this assignment, maintaining high engineering standards without outsourcing architectural judgment.

## How AI Was Used

| Task | How AI Was Used | Time Saved (est.) |
|------|----------------|-------------------|
| **Architecture Design** | Used AI to rapidly draft a C4-style component map and pressure-test the decision to use Supabase vs. Prisma+Postgres for the 4-hour timebox. | ~20 min |
| **Database Schema & RLS** | Generated the initial PostgreSQL schema and Row Level Security (RLS) policies for document sharing, which I then audited for exact ownership boundaries. | ~15 min |
| **Boilerplate Scaffolding** | Used AI to generate the tedious `Tailwind` + `clsx` + `tailwind-merge` configuration and generic UI components (like standard buttons and inputs). | ~30 min |
| **File Parsing Logic** | Prompted AI to write the RegExp and plain-text-to-Tiptap-JSON converters (`utils.ts`) for `.md` and `.txt` ingestion, ensuring edge cases (like empty strings) were covered. | ~25 min |
| **UI Aesthetics** | Passed the provided reference image (`FileMax`) to the AI to extract a unified color palette (`--color-brand-500`, etc.) and adapt the layout padding/spacing into Tailwind classes. | ~20 min |

## What I Changed or Rejected

- **Rejected AI's suggestion for Yjs Realtime**: The AI initially suggested scaffolding a Liveblocks or Yjs setup for real-time multiplayer editing. I rejected this because implementing custom auth tokens and edge-case conflict resolution for real-time cursors would blow past the 6-hour time limit. I instructed the AI to pivot to a debounced async-save model instead.
- **Modified API Route Structure**: AI generated client-side Supabase queries (`supabase.from('documents')...`) directly inside the React components. I refactored these into strict Next.js API Route handlers (`app/api/...`) to ensure better separation of concerns and easier mocking/testing.
- **Tiptap Hydration Fixes**: AI generated a standard Tiptap React implementation that caused SSR hydration mismatches in Next.js 14. I manually patched this using `immediatelyRender: false` and a `useEffect` synchronization pattern.

## Verification Approach

1. **UX Validation**: Manually tested the drag-and-drop zones, ensuring error states (e.g., file too large, wrong type) appeared correctly without crashing the app.
2. **Security Testing**: Used the seeded test accounts in two different browser profiles to verify that User A could absolutely not view or edit User B's unshared documents via direct URL manipulation.
3. **Automated Testing**: Used Vitest to run assertions against the pure utility functions (`textToTiptapJson`) to ensure the file ingestion parser wouldn't break the editor schema.
