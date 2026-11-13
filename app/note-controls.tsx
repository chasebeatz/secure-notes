'use client'
import {useActionState,useEffect,useRef} from 'react'
import Link from 'next/link'
import {noteCommand} from './actions'
export default function NoteControls({id,pinned,trash,reminder}:{id:number;pinned:boolean;trash:boolean;reminder:boolean}) {
 const details=useRef<HTMLDetailsElement>(null)
 const [state,action,pending]=useActionState(async(previous:{message:string},form:FormData)=>{const result=await noteCommand(previous,form);if(!result.message&&details.current)details.current.open=false;return result},{message:''})
 useEffect(()=>{const outside=(event:PointerEvent)=>{if(details.current&&!details.current.contains(event.target as Node))details.current.open=false};document.addEventListener('pointerdown',outside);return()=>document.removeEventListener('pointerdown',outside)},[])
 return <div><details ref={details} className="note-actions" onKeyDown={event=>{if(event.key==='Escape'&&details.current){details.current.open=false;details.current.querySelector('summary')?.focus()}}}><summary className="button button-secondary" aria-label={`Actions for note ${id}`} title="Note actions">&#8943;</summary><div className="note-action-menu">
 {!trash&&<Link href={`/notes/${id}`} className="button">Open / edit</Link>}
 <form action={action} onSubmit={event=>{const button=(event.nativeEvent as SubmitEvent).submitter as HTMLButtonElement|null;if(button?.value==='purge'&&!window.confirm('Delete this note forever? This cannot be undone.'))event.preventDefault()}}><input type="hidden" name="id" value={id}/>{trash?<><button className="button" name="command" value="restore" disabled={pending}>Restore</button><button className="button text-red-800" name="command" value="purge" disabled={pending}>Delete forever</button></>:<><button className="button" name="command" value={pinned?'unpin':'pin'} disabled={pending}>{pinned?'Unpin':'Pin'}</button>{reminder&&<button className="button" name="command" value="complete" disabled={pending}>Complete follow-up</button>}<button className="button text-red-800" name="command" value="trash" disabled={pending}>Move to Trash</button></>}</form>
 </div></details>{state.message&&<p className="error" role="alert">{state.message}</p>}</div>
}
