'use client'
import {Suspense} from 'react'
import {usePreference} from '@/lib/use-preference'
import Brand from './brand'
import WorkspaceNavigation from './workspace-navigation'
export default function WorkspaceShell({children}:{children:React.ReactNode}) {
 const [preference,setPreference]=usePreference('secure-notes-sidebar','expanded')
 const collapsed=preference==='collapsed'
 return <div className={'workspace-shell '+(collapsed?'sidebar-collapsed':'')}>
  <a className="skip-link" href="#workspace-content">Skip to content</a>
  <aside className="workspace-sidebar" aria-label="Workspace sidebar"><div className="sidebar-brand"><Brand/></div><button className="button button-secondary sidebar-toggle" aria-label={collapsed?'Expand sidebar':'Collapse sidebar'} aria-expanded={!collapsed} onClick={()=>setPreference(collapsed?'expanded':'collapsed')}>{collapsed?'→':'←'}</button><nav className="sidebar-links" aria-label="Main navigation"><Suspense fallback={<p className="muted">Navigation</p>}><WorkspaceNavigation/></Suspense></nav><p className="sidebar-caption muted">A little space for thoughtful teaching.</p></aside>
  <div id="workspace-content" className="workspace-content" tabIndex={-1}>{children}</div>
  <nav className="mobile-navigation" aria-label="Mobile navigation"><Suspense fallback={null}><WorkspaceNavigation/></Suspense></nav>
 </div>
}
