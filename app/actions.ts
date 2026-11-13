'use server'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { bulkInput, bulkChange } from '@/lib/bulk-notes'
import { noteInput } from '@/lib/note-input'
export type ActionMessage = { message: string }
export async function logOut() {
 const supabase = await createClient()
 const { error } = await supabase.auth.signOut()
 if (error) throw new Error('Could not log out. Please try again.')
 redirect('/login')
}
export async function addNote(_state: ActionMessage | undefined, form: FormData): Promise<ActionMessage> {
 const input = noteInput(form)
 if (input.error) return { message: input.error }
 const supabase = await createClient()
 const { error } = await supabase.from('notes').insert(input.value)
 if (error) return { message: 'Could not save your note. Please try again.' }
 revalidatePath('/', 'layout')
 redirect('/notes')
}
export async function updateNote(_state: ActionMessage | undefined, form: FormData): Promise<ActionMessage> {
 const id = Number(form.get('id'))
 if (!Number.isSafeInteger(id) || id <= 0) return { message: 'Invalid note.' }
 const input = noteInput(form)
 if (input.error) return { message: input.error }
 const supabase = await createClient()
 const { data, error } = await supabase.from('notes').update({ ...input.value, updated_at: new Date().toISOString() }).eq('id', id).is('deleted_at', null).select('id').single()
 if (error || !data) return { message: 'Could not update this note. It may have been moved to Trash.' }
 revalidatePath('/', 'layout')
 redirect('/notes')
}
export async function noteCommand(_state: ActionMessage, form: FormData): Promise<ActionMessage> {
 const id = Number(form.get('id'))
 const command = String(form.get('command'))
 if (!Number.isSafeInteger(id) || id <= 0) return { message: 'Invalid note.' }
 const supabase = await createClient()
 const timestamp = { updated_at: new Date().toISOString() }
 let query
 switch (command) {
 case 'trash': query = supabase.from('notes').update({ deleted_at: timestamp.updated_at, ...timestamp }).eq('id', id).is('deleted_at', null); break
 case 'restore': query = supabase.from('notes').update({ deleted_at: null, ...timestamp }).eq('id', id).not('deleted_at', 'is', null); break
 case 'pin': case 'unpin': query = supabase.from('notes').update({ pinned: command === 'pin', ...timestamp }).eq('id', id).is('deleted_at', null); break
 case 'complete': query = supabase.from('notes').update({ follow_up: null, ...timestamp }).eq('id', id).is('deleted_at', null); break
 case 'purge': query = supabase.from('notes').delete().eq('id', id).not('deleted_at', 'is', null); break
 default: return { message: 'Unknown action.' }
 }
 const { data, error } = await query.select('id').single()
 if (error || !data) return { message: 'Could not change this note. Refresh and try again.' }
 revalidatePath('/', 'layout')
 return { message: '' }
}
export type BulkResult = { message: string; ok: boolean }
export async function bulkNoteCommand(_state: BulkResult, form: FormData): Promise<BulkResult> {
 const input = bulkInput(form)
 if (input.error) return { message: input.error, ok: false }
 const { ids, command, subject } = input.value
 const supabase = await createClient()
 const change = bulkChange(command, subject, new Date().toISOString())
 let query = change ? supabase.from('notes').update(change).in('id', ids) : supabase.from('notes').delete().in('id', ids)
 query = command === 'restore' || command === 'purge' ? query.not('deleted_at', 'is', null) : query.is('deleted_at', null)
 const { data, error } = await query.select('id')
 if (error) return { message: 'Could not apply this action. Your selection is kept; please try again.', ok: false }
 revalidatePath('/', 'layout')
 const count = data?.length ?? 0
 return { message: count === ids.length ? `Updated ${count} ${count === 1 ? 'note' : 'notes'}.` : `Updated ${count} notes. Some selected notes were no longer available.`, ok: true }
}
