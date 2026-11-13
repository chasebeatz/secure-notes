import { Suspense } from 'react'
import { notFound, redirect } from 'next/navigation'
import Link from 'next/link'
import Brand from '@/app/brand'
import WorkspaceShell from '@/app/workspace-shell'

import { logOut } from '@/app/actions'
import EditNoteForm from './edit-note-form'
import { createClient } from '@/lib/supabase/server'

export default function EditNotePage({ params }: { params: Promise<{ id: string }> }) {
  return (
    <Suspense fallback={
      <main className="workspace" aria-busy="true">
        <header className="topbar"><Brand /></header>
        <div className="panel mx-auto mt-10 max-w-2xl" role="status">
          <p className="eyebrow mb-3">Your private notebook</p>
          <h1 className="section-title">Opening your note...</h1>
          <p className="muted mt-2">Getting your editor ready.</p>
        </div>
      </main>
    }>
      <EditNoteContent params={params} />
    </Suspense>
  )
}

async function EditNoteContent({
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
    .select('id, title, body, subject, follow_up')
    .eq('id', noteId)
    .is('deleted_at', null)
    .single()

  if (!note) {
    notFound()
  }

  return (
    <WorkspaceShell><main className="workspace">
      <header className="topbar"><Brand /><div className="account"><div><p className="eyebrow mb-1">Logged in as</p><p className="account-email">{user.email}</p></div><form action={logOut}><button className="button button-secondary">Log out ↗</button></form></div></header>
      <div className="mx-auto max-w-2xl"><div className="hero"><Link href="/notes" className="muted hover:underline">← Back to my notes</Link><p className="eyebrow mt-8 mb-3">A little more clarity</p><h1 className="display-title">Refine your note.</h1><p className="muted mt-4">Revisit the details. Keep the next step in focus.</p></div><section className="panel composer"><EditNoteForm note={note} /></section></div>
    </main></WorkspaceShell>
  )
}
