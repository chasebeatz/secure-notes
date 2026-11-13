'use client'
import Link from 'next/link'
import {usePathname,useSearchParams} from 'next/navigation'
const destinations=[['dashboard','Dashboard','/','#dashboard-title'],['notes','Notes','/notes',''],['pinned','Pinned','/notes?view=pinned',''],['reminders','Follow-ups','/notes?view=reminders',''],['trash','Trash','/notes?view=trash','']]
export default function WorkspaceNavigation() {
 const params=useSearchParams()
 const path=usePathname()
 const active=path==='/notes'?(params.get('view')||'notes'):path.startsWith('/notes/')?'notes':'dashboard'
 return <>{destinations.map(([key,label,href,hash],index)=><Link key={key} href={href+hash} title={label} className="workspace-nav-link" aria-current={active===key?'page':undefined}><span className="nav-symbol" aria-hidden="true">{['▦','≡','☆','◷','⌫'][index]}</span><span className="nav-label">{label}</span></Link>)}</>
}
