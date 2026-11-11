import { Suspense } from 'react'
import { redirect } from 'next/navigation'

import { addNote, deleteNote, logOut } from './actions'
import { createClient } from '@/lib/supabase/server'

async function NotesList() {
  const supabase = await createClient()
  const { data: notes } = await supabase
    .from('notes')
    .select('id, title, body, created_at')
    .order('created_at', { ascending: false })

  if (!notes || notes.length === 0) {
    return <p className="text-sm text-slate-600">No notes yet.</p>
  }

  return (
    <ul className="space-y-3">
      {notes.map((note) => (
        <li key={note.id} className="rounded-xl border border-slate-200 bg-white p-3 shadow-sm">
          <p className="text-base font-semibold text-slate-900">{note.title}</p>
          <p className="mt-2 whitespace-pre-wrap text-sm leading-6 text-slate-700">{note.body}</p>

          <div className="mt-3 flex gap-2">
            <a
              href={`/notes/${note.id}`}
              className="rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-50"
            >
              Edit
            </a>

            <form action={deleteNote} className="inline-block">
              <input type="hidden" name="id" value={note.id} />
              <button
                type="submit"
                className="rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm font-medium text-red-700 transition hover:bg-red-100"
              >
                Delete
              </button>
            </form>
          </div>
        </li>
      ))}
    </ul>
  )
}

async function SessionHeader() {
  const supabase = await createClient()
  const {
    data: { user },
    error,
  } = await supabase.auth.getUser()

  if (error || !user) {
    redirect('/login')
  }

  return (
    <div className="mb-5 flex items-center justify-between gap-3">
      <p className="text-sm text-slate-500">Logged in as</p>
      <div className="flex items-center gap-3">
        <h1 className="text-base font-semibold text-slate-900 sm:text-lg">{user.email}</h1>
        <form action={logOut}>
          <button
            type="submit"
            className="rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-50"
          >
            Log out
          </button>
        </form>
      </div>
    </div>
  )
}

export default function HomePage() {
  return (
    <main className="min-h-screen bg-slate-100 px-4 py-6 sm:px-6">
      <div className="mx-auto max-w-lg rounded-2xl border border-slate-200 bg-white p-4 shadow-sm sm:p-6">
        <Suspense fallback={<div className="mb-5 h-12 animate-pulse rounded-lg bg-slate-200" />}>
          <SessionHeader />
        </Suspense>

        <section className="mb-6 rounded-2xl border border-slate-200 bg-slate-50 p-4">
          <h2 className="mb-3 text-lg font-semibold text-slate-900">New note</h2>
          <form action={addNote} className="space-y-3">
            <input
              name="title"
              type="text"
              placeholder="Title"
              className="w-full rounded-xl border border-slate-300 bg-white px-3 py-2.5 text-base text-slate-900 outline-none transition focus:border-slate-500"
            />
            <textarea
              name="body"
              rows={4}
              placeholder="Write your note here..."
              className="w-full rounded-xl border border-slate-300 bg-white px-3 py-2.5 text-base text-slate-900 outline-none transition focus:border-slate-500"
            />
            <button
              type="submit"
              className="w-full rounded-xl bg-slate-900 px-4 py-3 text-sm font-medium text-white transition hover:bg-slate-700"
            >
              Save note
            </button>
          </form>
        </section>

        <section>
          <h2 className="mb-3 text-lg font-semibold text-slate-900">My notes</h2>
          <Suspense fallback={<p className="text-sm text-slate-600">Loading notes...</p>}>
            <NotesList />
          </Suspense>
        </section>
      </div>
    </main>
  )
}
