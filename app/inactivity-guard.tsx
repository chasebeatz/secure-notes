'use client'
import {useEffect,useState} from 'react'
import {usePathname} from 'next/navigation'
import {createBrowserClient} from '@supabase/ssr'
const TIMEOUT=15*60*1000
const WARNING=60*1000
export default function InactivityGuard() {
 const path=usePathname()
 const [remaining,setRemaining]=useState<number|null>(null)
 const [stay,setStay]=useState<(()=>void)|null>(null)
 useEffect(()=>{
  if(path === '/login') return
  let disposed=false
  let timer:ReturnType<typeof setInterval>|undefined
  let cleanup=()=>{}
  const client=createBrowserClient(process.env.NEXT_PUBLIC_SUPABASE_URL!,process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!)
  void client.auth.getUser().then(({data:{user}})=>{
   if(disposed||!user) return
   const key='secure-notes-activity:'+user.id+':'+user.last_sign_in_at
   const channel=typeof BroadcastChannel!=='undefined'?new BroadcastChannel(key):null
   let last=Date.now()
   try { const saved=Number(localStorage.getItem(key)); if(saved>0&&saved<=last) last=saved } catch {}
   let expired=false
   const logout=()=>{
    if(expired) return
    expired=true
    document.querySelectorAll('form[data-unsaved]').forEach(form=>form.setAttribute('data-unsaved','false'))
    channel?.postMessage('logout')
    document.getElementById('app-content')?.setAttribute('inert','')
    const content=document.getElementById('app-content'); if(content) content.style.visibility='hidden'
    const form=document.createElement('form'); form.method='post'; form.action='/auth/logout'; document.body.appendChild(form); form.submit()
   }
   const update=()=>{last=Date.now();try {localStorage.setItem(key,String(last))}catch{};channel?.postMessage(last);setRemaining(null)}
   const activity=()=>{if(Date.now()-last>=TIMEOUT) {logout();return} if(Date.now()-last<TIMEOUT-WARNING&&Date.now()-last>1000) update()}
   const tick=()=>{const ms=TIMEOUT-(Date.now()-last);if(ms<=0)logout();else setRemaining(ms<=WARNING?Math.ceil(ms/1000):null)}
   const storage=(event:StorageEvent)=>{if(event.key===key){const value=Number(event.newValue);if(value>last&&value<=Date.now())last=value}}
   if(channel) channel.onmessage=event=>{if(event.data==='logout')logout();else if(typeof event.data==='number'&&event.data>last&&event.data<=Date.now())last=event.data}
   const events=['pointerdown','keydown','scroll','touchstart'] as const
   events.forEach(event=>window.addEventListener(event,activity,{passive:true}))
   window.addEventListener('storage',storage)
   document.addEventListener('visibilitychange',tick)
   setStay(()=>()=>{if(Date.now()-last>=TIMEOUT)logout();else update()})
   tick();timer=setInterval(tick,1000)
   cleanup=()=>{events.forEach(event=>window.removeEventListener(event,activity));window.removeEventListener('storage',storage);document.removeEventListener('visibilitychange',tick);channel?.close()}
  })
  return ()=>{disposed=true;if(timer)clearInterval(timer);cleanup()}
 },[path])
 if(path === '/login'||remaining===null) return null
 return <div className="fixed inset-0 z-50 grid place-items-center bg-black/50 p-5"><section onKeyDown={event=>{if(event.key==='Tab')event.preventDefault()}} role="alertdialog" aria-modal="true" aria-labelledby="idle-title" aria-describedby="idle-description" className="panel max-w-md"><h2 id="idle-title" className="section-title">Still working?</h2><p id="idle-description" className="muted my-4">To protect your notes on shared computers, you will be logged out in {remaining} seconds. Unsaved changes will be lost.</p><button autoFocus className="button button-primary" onClick={()=>stay?.()}>Keep me logged in</button></section></div>
}
