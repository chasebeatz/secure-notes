'use client'
import { useEffect, useState } from 'react'
function label(date: string) {
 const now = new Date()
 const today = [now.getFullYear(), String(now.getMonth()+1).padStart(2,'0'), String(now.getDate()).padStart(2,'0')].join('-')
 return date < today ? 'Overdue' : date === today ? 'Due today' : 'Follow up'
}
export default function ReminderBadge({date}:{date:string}) {
 const [status,setStatus]=useState('Follow up')
 useEffect(()=>{const update=()=>setStatus(label(date));update();const timer=setInterval(update,60000);return()=>clearInterval(timer)},[date])
 return <span className="pill">{status}: {date}</span>
}
