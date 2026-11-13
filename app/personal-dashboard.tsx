import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import PriorityFollowUps from './priority-follow-ups'
export default async function PersonalDashboard() {
 const supabase = await createClient()
 const results = await Promise.all([
  supabase.from('notes').select('id',{count:'exact',head:true}).is('deleted_at',null),
  supabase.from('notes').select('id',{count:'exact',head:true}).is('deleted_at',null).eq('pinned',true),
  supabase.from('notes').select('id',{count:'exact',head:true}).is('deleted_at',null).not('follow_up','is',null),
  supabase.from('notes').select('id',{count:'exact',head:true}).not('deleted_at','is',null),
  supabase.from('notes').select('id,title,updated_at').is('deleted_at',null).order('updated_at',{ascending:false}).order('id',{ascending:false}).limit(3),
  supabase.from('notes').select('id,title,follow_up').is('deleted_at',null).not('follow_up','is',null).order('follow_up',{ascending:true}).order('id',{ascending:false}).limit(5),
 ])
 if(results.some(result=>result.error)) return <section className="panel mb-8" aria-label="Personal dashboard"><p className="error" role="alert">Your dashboard could not be loaded. Refresh to try again.</p></section>
 const [active,pinned,reminders,trash,recent,upcoming] = results
 const cards = [
  {label:'Active notes',count:active.count,href:'/notes?view=notes'},
  {label:'Pinned notes',count:pinned.count,href:'/notes?view=pinned'},
  {label:'Open follow-ups',count:reminders.count,href:'/notes?view=reminders'},
  {label:'In Trash',count:trash.count,href:'/notes?view=trash'},
 ]
 return <section className="mb-9" aria-labelledby="dashboard-title">
  <div className="mb-5 flex flex-wrap items-center justify-between gap-3"><h2 id="dashboard-title" className="section-title">Your day, in focus</h2><span className="pill">Your account only</span></div>
  <div className="mb-6"><PriorityFollowUps notes={upcoming.data??[]} /></div>
  <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">{cards.map(card=><Link key={card.label} href={card.href+'#notes-heading'} className="panel dashboard-stat"><span className="muted">{card.label}</span><span className="mt-2 block text-3xl font-semibold">{card.count??0}</span></Link>)}</div>
  <div className="mt-6">
   <section className="panel"><h3 className="section-title mb-4">Recently edited</h3>{!recent.data?.length?<p className="muted">Your latest notes will appear here.</p>:<ul className="dashboard-list">{recent.data.map(note=><li key={note.id}><Link className="block break-words font-medium hover:underline" href={`/notes/${note.id}`}>{note.title}</Link><time className="muted text-xs" dateTime={note.updated_at}>Updated {new Intl.DateTimeFormat('en',{dateStyle:'medium',timeZone:'UTC'}).format(new Date(note.updated_at))}</time></li>)}</ul>}</section>
  </div>
 </section>
}
