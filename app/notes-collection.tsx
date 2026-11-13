'use client'
import { useActionState, useId, useState } from 'react'
import Link from 'next/link'
import { bulkNoteCommand } from './actions'
import NoteControls from './note-controls'
import ReminderBadge from './reminder-badge'
import {usePreference} from '@/lib/use-preference'
import { workspaceUrl } from '@/lib/note-filters'
export type ListNote = { id: number; title: string; body: string; created_at: string; updated_at: string; subject: string; pinned: boolean; deleted_at: string | null; follow_up: string | null }
export default function NotesCollection({ notes, view }: { notes: ListNote[]; view: string }) {
 const [selectedIds, setSelected] = useState<number[]>([])
 const selected = selectedIds.filter(id => notes.some(note => note.id === id))
 const [command, setCommand] = useState(view === 'trash' ? 'restore' : 'pin')
 const [layout,chooseLayout]=usePreference('secure-notes-layout','list')
 const id = useId()
 const [state, action, pending] = useActionState(async (previous: {message:string;ok:boolean}, form: FormData) => {
  const result = await bulkNoteCommand(previous, form)
  if (result.ok) setSelected([])
  return result
 }, {message:'',ok:false})
 return <>
  <div className="collection-layout-toggle mb-4" role="group" aria-label="Note display"><button className="button button-secondary" aria-pressed={layout==='list'} onClick={()=>chooseLayout('list')}>List</button><button className="button button-secondary" aria-pressed={layout==='grid'} onClick={()=>chooseLayout('grid')}>Grid</button></div>
  {selected.length>0&&<div className="panel mb-5 bulk-toolbar">
   <label className="flex items-center gap-3 text-sm"><input type="checkbox" className="note-checkbox" disabled={pending} checked={selected.length === notes.length} onChange={event => setSelected(event.target.checked ? notes.map(note => note.id) : [])} />Select all {notes.length} notes on this page</label>
   <p className="muted mt-2 text-xs" role="status">{selected.length} selected. Selection resets when the page or filters change.</p>
   <form action={action} className="mt-4 flex flex-wrap items-end gap-3" onSubmit={event => { if(command === 'purge' && !window.confirm(`Permanently delete ${selected.length} selected notes? This cannot be undone.`)) event.preventDefault() }}>
    {selected.map(noteId => <input key={noteId} type="hidden" name="ids" value={noteId} />)}
    <div className="min-w-0 flex-1"><label htmlFor={id+'-action'} className="field-label">Bulk action</label><select id={id+'-action'} className="field" name="command" value={command} onChange={event=>setCommand(event.target.value)} disabled={pending}>{view === 'trash' ? <><option value="restore">Restore</option><option value="purge">Delete forever</option></> : <><option value="pin">Pin</option><option value="unpin">Unpin</option><option value="tag">Change subject</option><option value="clear-tag">Remove subject</option><option value="complete">Complete follow-ups</option><option value="trash">Move to Trash</option></>}</select></div>
    {command === 'tag' && <div className="min-w-0 flex-1"><label htmlFor={id+'-subject'} className="field-label">New subject</label><input id={id+'-subject'} name="subject" className="field" required maxLength={80} disabled={pending} /></div>}
    <button className="button button-primary" disabled={pending || !selected.length}>{pending ? 'Applying...' : 'Apply to selected'}</button>
    {!!selected.length && <button type="button" className="button button-secondary" disabled={pending} onClick={()=>setSelected([])}>Clear selection</button>}
   </form>
  </div>}
  {state.message && <p className={state.ok?'muted mb-4':'error'} role={state.ok?'status':'alert'}>{state.message}</p>}
  <ul className={layout==='grid'?'notes-display-grid':'space-y-4'}>{notes.map(note => <li key={note.id} className={'note-card compact-note '+(selected.includes(note.id)?'note-selected':'')}>
   <label className="card-select flex items-center gap-2 text-sm"><input type="checkbox" className="note-checkbox" checked={selected.includes(note.id)} disabled={pending} onChange={event=>setSelected(current=>event.target.checked?[...current,note.id]:current.filter(value=>value!==note.id))}/><span className="sr-only">Select {note.title}</span></label>
   <div className="mb-3 flex flex-wrap gap-2">{note.pinned&&<span className="pill">Pinned</span>}{note.subject&&<Link className="pill hover:underline" href={workspaceUrl('',1,view,note.subject)}>{note.subject}</Link>}{note.follow_up&&<ReminderBadge date={note.follow_up}/>}</div>
   <h3>{view==='trash'?note.title:<Link href={`/notes/${note.id}`} className="hover:underline">{note.title}</Link>}</h3><p className="note-body">{note.body}</p>
   <div className="note-footer"><time dateTime={note.created_at} className="muted text-xs">{new Intl.DateTimeFormat('en',{dateStyle:'medium',timeZone:'UTC'}).format(new Date(note.created_at))}</time><NoteControls id={note.id} pinned={note.pinned} trash={view==='trash'} reminder={!!note.follow_up}/></div>
  </li>)}</ul>
 </>
}
