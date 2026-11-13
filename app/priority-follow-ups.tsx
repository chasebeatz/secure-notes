'use client'
import {useEffect,useState} from 'react'
import Link from 'next/link'
import ReminderBadge from './reminder-badge'
type Reminder={id:number;title:string;follow_up:string|null}
export default function PriorityFollowUps({notes}:{notes:Reminder[]}) {
 const [today,setToday]=useState('')
 useEffect(()=>{const update=()=>{const date=new Date();setToday([date.getFullYear(),String(date.getMonth()+1).padStart(2,'0'),String(date.getDate()).padStart(2,'0')].join('-'))};update();const timer=setInterval(update,60000);return()=>clearInterval(timer)},[])
 const overdue=notes.filter(note=>today&&note.follow_up&&note.follow_up<today)
 const due=notes.filter(note=>note.follow_up===today)
 const upcoming=notes.filter(note=>!today||!note.follow_up||note.follow_up>today)
 return <section className="panel priority-panel"><div className="mb-3 flex flex-wrap items-center justify-between gap-3"><div><p className="eyebrow mb-2">Start here</p><h3 className="section-title">What needs your attention</h3></div><Link className="button button-secondary" href="/notes?view=reminders#notes-heading">All follow-ups</Link></div>{!notes.length?<p className="muted">You have no open follow-ups. Set a reminder on a note when you need to return to it.</p>:<div className="priority-groups">{[['Overdue',overdue],['Due today',due],['Coming up',upcoming]].map(([label,items])=>{const group=items as Reminder[];return group.length?<div key={String(label)} className={label==='Overdue'?'priority-overdue':''}><h4 className="eyebrow mb-3">{String(label)}</h4><ul className="dashboard-list">{group.map(note=><li key={note.id}><Link href={`/notes/${note.id}`} className="block break-words font-medium hover:underline">{note.title}</Link>{note.follow_up&&<div className="mt-2"><ReminderBadge date={note.follow_up}/></div>}</li>)}</ul></div>:null})}</div>}<p className="muted mt-4 text-xs">Showing up to five earliest follow-ups. Overdue items come first.</p></section>
}
