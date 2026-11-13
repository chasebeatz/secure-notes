'use client'
import { useActionState, useState } from 'react'
import Link from 'next/link'
import { addNote, updateNote } from './actions'
type Draft = {title:string;body:string;subject:string;follow_up:string}
type Note = {id:number;title:string;body:string;subject:string;follow_up:string|null}
export default function NoteEditor({note}:{note?:Note}) {
 const initial:Draft={title:note?.title??'',body:note?.body??'',subject:note?.subject??'',follow_up:note?.follow_up??''}
 const [values,setValues]=useState(initial)
 const [saved,setSaved]=useState(initial)
 const dirty=JSON.stringify(values)!==JSON.stringify(saved)
 const [state,action,pending]=useActionState(async(previous:{message:string},form:FormData)=>{
  const result=await (note?updateNote:addNote)(previous,form)
  if(!result.message){const empty={title:'',body:'',subject:'',follow_up:''};setValues(empty);setSaved(empty)}
  return result
 },{message:''})
 const field=(name:keyof Draft)=>({value:values[name],onChange:(event:React.ChangeEvent<HTMLInputElement|HTMLTextAreaElement>)=>setValues(current=>({...current,[name]:event.target.value}))})
 const prefix=note?'edit':'new'
 return <><form action={action} data-note-editor data-unsaved={dirty?'true':'false'} className="space-y-5">
  {note&&<input type="hidden" name="id" value={note.id}/>}
  <div><label htmlFor={note?'edit-title':'note-title'} className="field-label">Title (required)</label><input id={note?'edit-title':'note-title'} name="title" {...field('title')} className="field" placeholder="e.g. English comprehension" disabled={pending}/></div>
  <div><label htmlFor={prefix+'-body'} className="field-label">Your note</label><textarea id={prefix+'-body'} name="body" {...field('body')} rows={note?12:7} className="field" placeholder="What went well? What needs more practice?" disabled={pending}/></div>
  <div><label htmlFor={prefix+'-subject'} className="field-label">Subject tag (optional)</label><input id={prefix+'-subject'} name="subject" {...field('subject')} maxLength={80} className="field" placeholder="e.g. Maths" disabled={pending}/></div>
  <div><label htmlFor={prefix+'-follow-up'} className="field-label">Follow-up reminder (optional)</label><input id={prefix+'-follow-up'} name="follow_up" type="date" {...field('follow_up')} className="field" disabled={pending}/><p className="muted mt-1 text-xs">Shown in your in-app follow-up list.</p></div>
  <p className="muted text-xs" role="status">{pending?'Saving...':dirty?'Unsaved changes':'No unsaved changes'}</p>
  <div className="flex gap-3"><button className="button button-primary flex-1" disabled={pending}>{pending?'Saving...':note?'Save changes':'Save note'}</button>{note&&<Link href="/" className="button button-secondary">Cancel</Link>}</div>
 </form>{state.message&&<p className="error" role="alert">{state.message}</p>}</>
}
