import {Suspense} from 'react'
import {redirect} from 'next/navigation'
import Link from 'next/link'
import Brand from './brand'
import WorkspaceShell from './workspace-shell'
import SessionHeader from './session-header'
import PersonalDashboard from './personal-dashboard'
import {workspaceFilters,workspaceUrl,type SearchParams} from '@/lib/note-filters'
async function Dashboard({searchParams}:{searchParams:Promise<SearchParams>}) {
 const params=await searchParams
 if(params.view||params.q||params.subject||params.page){const filters=workspaceFilters(params);redirect(workspaceUrl(filters.q,filters.page,filters.view,filters.subject))}
 return <><div className="screen-heading"><div><p className="eyebrow mb-3">Your private workspace</p><h1 className="display-title">A little clarity for your day.</h1><p className="muted mt-3">Start with what needs attention, then pick up where you left off.</p></div><Link href="/notes/new" className="button button-primary">+ New note</Link></div><PersonalDashboard/></>
}
export default function HomePage({searchParams}:{searchParams:Promise<SearchParams>}) {
 return <WorkspaceShell><main className="workspace"><header className="topbar"><Brand/><Suspense fallback={<p className="muted">Loading account...</p>}><SessionHeader/></Suspense></header><Suspense fallback={<p className="muted my-8" role="status">Loading your dashboard...</p>}><Dashboard searchParams={searchParams}/></Suspense></main></WorkspaceShell>
}
