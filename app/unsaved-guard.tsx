'use client'
import { useEffect } from 'react'
export default function UnsavedGuard() {
 useEffect(()=>{
  const dirty=()=>!!document.querySelector('form[data-unsaved="true"]')
  const confirm=()=>!dirty()||window.confirm('You have unsaved changes. Leave without saving?')
  const unload=(event:BeforeUnloadEvent)=>{if(dirty()){event.preventDefault();event.returnValue=''}}
  const click=(event:MouseEvent)=>{
   if(event.defaultPrevented||event.button!==0||event.metaKey||event.ctrlKey||event.shiftKey||event.altKey)return
   const link=(event.target as Element).closest<HTMLAnchorElement>('a[href]')
   if(!link||link.target==='_blank'||link.hasAttribute('download'))return
   const url=new URL(link.href,location.href)
   if(url.origin===location.origin&&url.pathname===location.pathname&&url.search===location.search&&url.hash)return
   if(!confirm()){event.preventDefault();event.stopPropagation()}
  }
  const submit=(event:SubmitEvent)=>{
   const form=event.target as HTMLFormElement
   if(form.matches('[data-note-editor]'))return
   if(!confirm()){event.preventDefault();event.stopPropagation()}
  }
  window.addEventListener('beforeunload',unload)
  document.addEventListener('click',click,true)
  document.addEventListener('submit',submit,true)
  return()=>{window.removeEventListener('beforeunload',unload);document.removeEventListener('click',click,true);document.removeEventListener('submit',submit,true)}
 },[])
 return null
}
