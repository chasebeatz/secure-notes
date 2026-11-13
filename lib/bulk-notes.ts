export type BulkCommand = 'pin' | 'unpin' | 'tag' | 'clear-tag' | 'complete' | 'trash' | 'restore' | 'purge'
export function bulkInput(form: FormData) {
 const raw = form.getAll('ids')
 if (!raw.length || raw.length > 20) return { error: 'Select between 1 and 20 notes on this page.' } as const
 if (raw.some(value => typeof value !== 'string' || !/^[1-9]\d*$/.test(value))) return { error: 'Invalid selection.' } as const
 const ids = [...new Set(raw.map(Number))]
 if (ids.some(id => !Number.isSafeInteger(id))) return { error: 'Invalid selection.' } as const
 const command = String(form.get('command'))
 if (!['pin','unpin','tag','clear-tag','complete','trash','restore','purge'].includes(command)) return { error: 'Choose a valid bulk action.' } as const
 const subject = String(form.get('subject') ?? '').trim().replace(/\s+/g, ' ')
 if (command === 'tag' && (!subject || subject.length > 80)) return { error: 'Enter a subject of 1 to 80 characters.' } as const
 return { value: { ids, command: command as BulkCommand, subject } } as const
}
export function bulkChange(command: BulkCommand, subject: string, now: string) {
 const changes = { updated_at: now }
 switch (command) {
 case 'pin': case 'unpin': return { ...changes, pinned: command === 'pin' }
 case 'tag': case 'clear-tag': return { ...changes, subject: command === 'clear-tag' ? '' : subject }
 case 'complete': return { ...changes, follow_up: null }
 case 'trash': return { ...changes, deleted_at: now }
 case 'restore': return { ...changes, deleted_at: null }
 case 'purge': return null
 }
}
