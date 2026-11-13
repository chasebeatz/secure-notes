import { Suspense } from 'react'
import { redirect } from 'next/navigation'
import { logOut } from './actions'
import NewNoteForm from './new-note-form'
import Brand from './brand'
import NotesList from './notes-list'
import PersonalDashboard from './personal-dashboard'
import type { SearchParams } from '@/lib/note-filters'
import { createClient } from '@/lib/supabase/server'

async function SessionHeader() {
  const supabase = await createClient()
  const { data: { user }, error } = await supabase.auth.getUser()
  if (error || !user) redirect('/login')
  return <div className="account"><div><p className="eyebrow mb-1">Logged in as</p><p className="account-email">{user.email}</p></div><form action={logOut}><button className="button button-secondary">Log out <span aria-hidden="true">&#8599;</span></button></form></div>
}
export default function HomePage({ searchParams }: { searchParams: Promise<SearchParams> }) {
  return <main className="workspace"><header className="topbar"><Brand /><Suspense fallback={<p className="muted">Loading account…</p>}><SessionHeader /></Suspense></header><div className="hero"><p className="eyebrow mb-3">Your private teaching notebook</p><h1 className="display-title">Small notes. Big progress.</h1><p className="muted mt-4">Capture the moments that help your students move forward.</p></div><Suspense fallback={<p className="muted mb-8" role="status">Loading your dashboard...</p>}><PersonalDashboard /></Suspense><div className="dashboard-grid"><div><NewNoteForm /><p className="muted mt-4 px-2 text-xs">A little structure helps: student name, subject, and one clear next step.</p></div><section aria-labelledby="notes-heading"><div className="mb-5 flex items-center justify-between"><h2 id="notes-heading" className="section-title">My notes</h2><span className="pill"><span aria-hidden="true">&#9679;</span> Personal workspace</span></div><Suspense fallback={<p className="muted" role="status">Opening your notebook…</p>}><NotesList searchParams={searchParams} /></Suspense></section></div><footer className="mt-14 border-t border-[#dce0d5] pt-5 text-xs text-[#7b8475]">Secure Notes <span className="mx-2">/</span> More space for thoughtful teaching.</footer></main>
}
