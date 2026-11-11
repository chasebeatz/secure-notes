import { notFound, redirect } from 'next/navigation'

import { logOut, updateNote } from '@/app/actions'
import { createClient } from '@/lib/supabase/server'

export default async function EditNotePage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const noteId = Number(id)

  const supabase = await createClient()
  const {
    data: { user },
    error,
  } = await supabase.auth.getUser()

  if (error || !user) {
    redirect('/login')
  }

  const { data: note } = await supabase
    .from('notes')
    .select('id, title, body')
    .eq('id', noteId)
    .single()

  if (!note) {
    notFound()
  }

  return (
    <main className="min-h-screen bg-slate-100 px-4 py-6 sm:px-6">
      <div className="mx-auto max-w-lg rounded-2xl border border-slate-200 bg-white p-4 shadow-sm sm:p-6">
        <div className="mb-5 flex items-center justify-between gap-3">
          <div>
            <p className="text-sm text-slate-500">Logged in as</p>
            <h1 className="text-base font-semibold text-slate-900 sm:text-lg">{user.email}</h1>
          </div>

          <form action={logOut}>
            <button
              type="submit"
              className="rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-50"
            >
              Log out
            </button>
          </form>
        </div>

        <section className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
          <h2 className="mb-3 text-lg font-semibold text-slate-900">Edit note</h2>

          <form action={updateNote} className="space-y-3">
            <input type="hidden" name="id" value={note.id} />

            <input
              name="title"
              type="text"
              defaultValue={note.title}
              className="w-full rounded-xl border border-slate-300 bg-white px-3 py-2.5 text-base text-slate-900 outline-none transition focus:border-slate-500"
            />

            <textarea
              name="body"
              rows={6}
              defaultValue={note.body}
              className="w-full rounded-xl border border-slate-300 bg-white px-3 py-2.5 text-base text-slate-900 outline-none transition focus:border-slate-500"
            />

            <div className="flex gap-3">
              <button
                type="submit"
                className="flex-1 rounded-xl bg-slate-900 px-4 py-3 text-sm font-medium text-white transition hover:bg-slate-700"
              >
                Save changes
              </button>

              <a
                href="/"
                className="flex flex-1 items-center justify-center rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm font-medium text-slate-700 transition hover:bg-slate-50"
              >
                Cancel
              </a>
            </div>
          </form>
        </section>
      </div>
    </main>
  )
}
