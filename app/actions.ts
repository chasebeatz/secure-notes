'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'

import { createClient } from '@/lib/supabase/server'

export async function logOut() {
  const supabase = await createClient()
  await supabase.auth.signOut()
  redirect('/login')
}

export async function addNote(formData: FormData) {
  const title = String(formData.get('title') ?? '').trim()
  const body = String(formData.get('body') ?? '').trim()

  if (!title) {
    return
  }

  const supabase = await createClient()
  await supabase.from('notes').insert({ title, body })

  revalidatePath('/')
}

export async function updateNote(formData: FormData) {
  const id = Number(formData.get('id'))
  const title = String(formData.get('title') ?? '').trim()
  const body = String(formData.get('body') ?? '').trim()

  if (!id || !title) {
    return
  }

  const supabase = await createClient()
  await supabase.from('notes').update({ title, body }).eq('id', id)

  revalidatePath('/')
  redirect('/')
}

export async function deleteNote(formData: FormData) {
  const id = Number(formData.get('id'))

  if (!id) {
    return
  }

  const supabase = await createClient()
  await supabase.from('notes').delete().eq('id', id)

  revalidatePath('/')
}
