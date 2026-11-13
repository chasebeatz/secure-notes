'use client'
import { useEffect, useState } from 'react'
export default function ThemeToggle() {
 const [dark,setDark]=useState<boolean|null>(null)
 useEffect(()=>{
  const media=window.matchMedia('(prefers-color-scheme: dark)')
  const sync=()=>{let saved:string|null=null;try{saved=localStorage.getItem('secure-notes-theme')}catch{};const value=saved==='dark'||(saved!=='light'&&media.matches);document.documentElement.dataset.theme=value?'dark':'light';setDark(value)}
  sync();media.addEventListener('change',sync);window.addEventListener('storage',sync)
  return()=>{media.removeEventListener('change',sync);window.removeEventListener('storage',sync)}
 },[])
 return <button className="button button-secondary theme-toggle" aria-label={dark?'Switch to light mode':'Switch to dark mode'} aria-pressed={dark??false} onClick={()=>{const value=!(dark??document.documentElement.dataset.theme==='dark');document.documentElement.dataset.theme=value?'dark':'light';setDark(value);try{localStorage.setItem('secure-notes-theme',value?'dark':'light')}catch{}}}>{dark?'Light mode':'Dark mode'}</button>
}
