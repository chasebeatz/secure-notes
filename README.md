Secure Notes is a private teaching notebook built with Next.js and Supabase.

## Note tools setup

Before deploying, run `db/note-tools.sql` in Supabase's SQL Editor on an existing database. For a fresh database use `db/schema.sql`, then optionally run the migration for its indexes. Existing owner-only row-level security policies stay in place. No student timelines are added.

- **Trash:** Move notes to Trash, restore them, or confirm permanent deletion. Trash is retained until you explicitly delete it; there is no automatic 30-day purge. Trashed notes do not appear in the main list, follow-ups, or the editor.
- **Personal dashboard:** Account-only totals for active notes, pins, open follow-ups, and Trash, plus five earliest follow-ups and five recently updated notes. Click a statistic to open that view.
- **Bulk actions:** Select up to 20 notes on the current page to pin/unpin, change/remove subjects, complete follow-ups, or move to Trash. In Trash, restore selected notes or confirm permanent deletion. Changing pages or filters clears the selection. Updates remain protected by the existing owner-only RLS policies; unavailable notes are skipped and reported. No extra database migration is needed.
- **Pinning:** Pinned notes appear before other notes in My notes. Each group stays newest first.
- **Subject tags:** One optional subject tag per note. Click a tag or type a subject filter to narrow results. Matching ignores case.
- **Follow-ups:** Add a calendar date, use the Follow-ups tab to review upcoming/overdue notes, and mark done to remove the reminder. Due labels use the viewer's local calendar day. Reminders are in-app only; no email, push notifications, or background delivery is configured.
- **Dark mode:** The theme button switches between light and dark mode. The first visit follows the system setting; an explicit choice is stored on this browser.
- **Unsaved changes:** New and edited notes show their draft status. App links, Cancel, other form submissions, refresh, and tab closing prompt before discarding a changed note. Browser warnings may require prior interaction and are not reliable on mobile app termination. Browser Back/Forward within the single-page app is not blocked. Inactivity logout takes priority over draft warnings. Draft text is kept in memory only and is not saved to browser storage.
- **Inactivity logout:** After 14 minutes without interaction, a one-minute warning appears. At 15 minutes notes are hidden and logout is submitted. Activity is shared between same-origin tabs when browser storage or BroadcastChannel is available. Unsaved changes are lost on expiry. This is a browser inactivity guard, not a server-enforced session inactivity limit, and requires JavaScript. Revoke sessions in Supabase if a device is lost.

Password reset is not included. No email sender, recovery template, or reset redirect configuration is required for the note tools.

### Validation

Run `npm run build`, `npm run lint`, and `node --test lib/note-filters.test.mjs lib/note-input.test.mjs lib/unsaved-guard.test.mjs lib/bulk-notes.test.mjs` (Node 22.18+).

Authenticated browser checks still require your configured Supabase environment. After the migration: use two tutor accounts to confirm notes and tags stay private; pin, trash, restore, and permanently delete a test note; schedule and complete a follow-up; verify inactivity logout and the warning across two tabs; compare dashboard totals to your notes; test bulk actions with multiple selected notes, then with two accounts to verify foreign note IDs cannot be modified. The note-tools migration has been applied by the project owner.

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
