import { redirect } from 'next/navigation'

import { logOut } from './actions'
import { createClient } from '@/lib/supabase/server'

export default async function HomePage() {
  const supabase = await createClient()
  const {
    data: { user },
    error,
  } = await supabase.auth.getUser()

  if (error || !user) {
    redirect('/login')
  }

  const { data: notes } = await supabase
    .from('notes')
    .select('*')
    .order('created_at', { ascending: false })

  return (
    <main className="min-h-screen bg-slate-100 p-6">
      <div className="mx-auto max-w-3xl rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <div className="mb-6 flex items-center justify-between gap-4">
          <div>
            <p className="text-sm text-slate-500">Logged in as</p>
            <h1 className="text-2xl font-semibold text-slate-900">{user.email}</h1>
          </div>

          <form action={logOut}>
            <button
              type="submit"
              className="rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-50"
            >
              Log out
            </button>
          </form>
        </div>

        <section className="rounded-xl border border-slate-200 bg-slate-50 p-4">
          <h2 className="mb-3 text-lg font-semibold text-slate-800">My notes</h2>

          {!notes || notes.length === 0 ? (
            <p className="text-sm text-slate-600">No notes yet.</p>
          ) : (
            <ul className="space-y-3">
              {notes.map((note) => (
                <li key={note.id} className="rounded-lg border border-slate-200 bg-white p-3">
                  <p className="font-medium text-slate-900">{note.title}</p>
                  <p className="mt-1 whitespace-pre-wrap text-sm text-slate-600">{note.body}</p>
                </li>
              ))}
            </ul>
          )}
        </section>
      </div>
    </main>
  )
}
