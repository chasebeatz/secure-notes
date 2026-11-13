export function noteInput(form: FormData) {
  const title = String(form.get('title') ?? '').trim()
  const body = String(form.get('body') ?? '').trim()
  const subject = String(form.get('subject') ?? '').trim().replace(/\s+/g, ' ')
  const follow_up = String(form.get('follow_up') ?? '') || null
  if (!title) return { error: 'Title is required.' } as const
  if (subject.length > 80) return { error: 'Subject must be 80 characters or fewer.' } as const
  if (follow_up && (!/^\d{4}-\d{2}-\d{2}$/.test(follow_up) || !Number.isFinite(Date.parse(follow_up)) || new Date(follow_up).toISOString().slice(0,10) !== follow_up)) return { error: 'Choose a valid follow-up date.' } as const
  return { value: { title, body, subject, follow_up } } as const
}
