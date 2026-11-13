'use client'
import {useCallback,useSyncExternalStore} from 'react'
const fallback=new Map<string,string>()
export function usePreference(key:string,initial:string) {
 const subscribe=useCallback((notify:()=>void)=>{window.addEventListener('storage',notify);window.addEventListener('secure-notes-preference',notify);return()=>{window.removeEventListener('storage',notify);window.removeEventListener('secure-notes-preference',notify)}},[])
 const snapshot=useCallback(()=>{try{return localStorage.getItem(key)??initial}catch{return fallback.get(key)??initial}},[key,initial])
 const server=useCallback(()=>initial,[initial])
 const value=useSyncExternalStore(subscribe,snapshot,server)
 const set=(next:string)=>{try{localStorage.setItem(key,next)}catch{fallback.set(key,next)}window.dispatchEvent(new Event('secure-notes-preference'))}
 return [value,set] as const
}
