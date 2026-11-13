'use client'
import { useActionState } from 'react'
import { noteCommand } from './actions'
export default function NoteControls({ id, pinned, trash, reminder }: { id: number; pinned: boolean; trash: boolean; reminder: boolean }) {
 const [state, action, pending] = useActionState(noteCommand, { message: '' })
 return <div><form action={action} onSubmit={event => { const button = (event.nativeEvent as SubmitEvent).submitter as HTMLButtonElement | null; if (button?.value === 'purge' && !window.confirm('Delete this note forever? This cannot be undone.')) event.preventDefault() }} className="flex flex-wrap gap-1"><input type="hidden" name="id" value={id} />{trash ? <><button disabled={pending} className="button button-secondary" name="command" value="restore">Restore</button><button disabled={pending} className="button text-red-800" name="command" value="purge">Delete forever</button></> : <><button disabled={pending} className="button button-secondary" name="command" value={pinned ? 'unpin' : 'pin'}>{pinned ? 'Unpin' : 'Pin'}</button>{reminder && <button disabled={pending} className="button button-secondary" name="command" value="complete">Mark done</button>}<button disabled={pending} className="button text-red-800" name="command" value="trash">Move to Trash</button></>}</form>{state.message && <p className="error" role="alert">{state.message}</p>}</div>
}
