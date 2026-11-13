import {Suspense} from 'react'
import Link from 'next/link'
import Brand from '@/app/brand'
import SessionHeader from '@/app/session-header'
import WorkspaceShell from '@/app/workspace-shell'
import NoteEditor from '@/app/note-editor'
export default function NewNotePage() {
 return <WorkspaceShell><main className="workspace"><header className="topbar"><Brand/><Suspense fallback={<p className="muted">Loading account...</p>}><SessionHeader/></Suspense></header><div className="editor-page"><div className="screen-heading"><div><Link href="/notes" className="muted hover:underline">Back to notes</Link><h1 className="display-title mt-5">A fresh page.</h1><p className="muted mt-3">Capture one observation. Leave yourself a clear next step.</p></div></div><section className="panel composer"><NoteEditor/></section></div></main></WorkspaceShell>
}
