import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import { searchPattern, escapeLike, workspaceFilters, workspaceUrl, type SearchParams } from '@/lib/note-filters'
import NotesCollection from './notes-collection'
const SIZE = 20
export default async function NotesList({ searchParams }: { searchParams: Promise<SearchParams> }) {
 const { q, page, view, subject } = workspaceFilters(await searchParams)
 const supabase = await createClient()
 let query = supabase.from('notes').select('id,title,body,created_at,updated_at,subject,pinned,deleted_at,follow_up', {count:'exact'})
 query = view === 'trash' ? query.not('deleted_at','is',null).order('deleted_at',{ascending:false}) : query.is('deleted_at',null)
 if(view === 'pinned') query=query.eq('pinned',true)
 if(view === 'reminders') query = query.not('follow_up','is',null).order('follow_up',{ascending:true})
 else if(view !== 'trash') query = query.order('pinned',{ascending:false})
 query = query.order('created_at',{ascending:false}).order('id',{ascending:false})
 if(q) { const pattern=searchPattern(q); query=query.or(`title.ilike.${pattern},body.ilike.${pattern},subject.ilike.${pattern}`) }
 if(subject) query=query.ilike('subject',escapeLike(subject))
 const { data:notes, count, error } = await query.range((page-1)*SIZE,page*SIZE-1)
 const url=(p:number)=>workspaceUrl(q,p,view,subject)
 return <>
  <form action="/notes" method="get" role="search" className="mb-5 space-y-3">
   <input type="hidden" name="view" value={view}/>
   <label htmlFor="note-search" className="field-label">Search {view === 'trash' ? 'Trash' : 'notes'}</label>
   <input key={q} id="note-search" name="q" type="search" defaultValue={q} maxLength={200} placeholder="Search titles, text, or subjects..." className="field"/>
   <div className="flex flex-wrap items-end gap-2"><div className="min-w-0 flex-1"><label htmlFor="subject-filter" className="field-label">Filter by subject</label><input key={subject} id="subject-filter" name="subject" defaultValue={subject} maxLength={80} className="field" placeholder="All subjects"/></div><button className="button button-primary">Apply</button>{(q||subject)&&<Link className="button button-secondary" href={workspaceUrl('',1,view,'')}>Clear</Link>}</div>
  </form>
  {view==='trash'&&<p className="muted mb-4">Notes stay here until you restore them or delete them forever.</p>}
  {view==='reminders'&&<p className="muted mb-4">Your scheduled follow-ups, earliest first. Mark done to clear a reminder.</p>}
  {error ? <p role="alert" className="error">Could not load your notes. Please try again. If you just updated the app, make sure the database migration has been applied.</p> : <>
  <p className="muted mb-4" role="status">{count??0} {(count===1)?'note':'notes'} found</p>
  {!notes?.length?<div className="empty"><h3 className="section-title">{view==='trash'?'Trash is empty.':view==='reminders'?'No follow-ups here yet.':'No notes found.'}</h3><p className="muted mt-3">{view==='trash'?'Deleted notes will appear here.':view==='reminders'?'Set a follow-up date when writing or editing a note.':'Try another search or write a new note.'}</p>{page>1&&<Link className="button button-secondary mt-4" href={url(1)}>First page</Link>}</div>:<NotesCollection key={JSON.stringify([q,page,view,subject])} notes={notes} view={view}/>}
  {(count??0)>SIZE&&<nav aria-label="Notes pages" className="mt-6 flex flex-wrap items-center justify-between gap-2"><span className="muted">Page {page} of {Math.ceil((count??0)/SIZE)}</span><div className="flex gap-2">{page>1&&<Link href={url(page-1)} className="button button-secondary">Previous</Link>}{page*SIZE<(count??0)&&<Link href={url(page+1)} className="button button-secondary">Next</Link>}</div></nav>}
  </>}
 </>
}
