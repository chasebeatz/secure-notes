import {Suspense} from 'react'
import Link from 'next/link'
import Brand from '../brand'
import SessionHeader from '../session-header'
import WorkspaceShell from '../workspace-shell'
import NotesList from '../notes-list'
import {workspaceFilters,type SearchParams} from '@/lib/note-filters'
async function NotesScreen({searchParams}:{searchParams:Promise<SearchParams>}) {
 const {view}=workspaceFilters(await searchParams)
 const title=view==='trash'?'Trash':view==='pinned'?'Pinned notes':view==='reminders'?'Follow-ups':'Your notes'
 return <><div className="screen-heading"><div><p className="eyebrow mb-3">Your notebook</p><h1 id="notes-heading" className="display-title">{title}</h1><p className="muted mt-3">{view==='trash'?'Restore what you need. Let go of what you don?t.':view==='reminders'?'Keep the next step in sight.':'A space for observations, ideas, and the next small breakthrough.'}</p></div><Link href="/notes/new" className="button button-primary">+ New note</Link></div><NotesList searchParams={searchParams}/></>
}
export default function NotesPage({searchParams}:{searchParams:Promise<SearchParams>}) {
 return <WorkspaceShell><main className="workspace"><header className="topbar"><Brand/><Suspense fallback={<p className="muted">Loading account...</p>}><SessionHeader/></Suspense></header><Suspense fallback={<p role="status" className="muted my-8">Opening your notes...</p>}><NotesScreen searchParams={searchParams}/></Suspense></main></WorkspaceShell>
}
