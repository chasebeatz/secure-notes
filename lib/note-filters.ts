export type SearchParams = Record<string, string | string[] | undefined>

export function escapeLike(value: string) {
  return value.replace(/[\\%_]/g, '\\$&')
}

// Quote the pattern for PostgREST's filter grammar, separately from SQL LIKE escaping.
export function searchPattern(value: string) {
  const pattern = `%${escapeLike(value)}%`
  return `"${pattern.replace(/\\/g, '\\\\').replace(/"/g, '\\"')}"`
}

export function readFilters(params: SearchParams) {
  const text = (key: string) => typeof params[key] === 'string' ? params[key] as string : ''
  const page = Number(text('page'))
  return {
    q: text('q').trim().slice(0, 200),
    page: Number.isSafeInteger(page) && page > 0 ? Math.min(page, 10000) : 1,
  }
}

export function notesUrl(q = '', page = 1) {
  const params = new URLSearchParams()
  if (q) params.set('q', q)
  if (page > 1) params.set('page', String(page))
  return params.size ? `/?${params}` : '/'
}
export function workspaceFilters(params: SearchParams) {
 const base = readFilters(params)
 const view = params.view === 'trash' || params.view === 'reminders' || params.view === 'pinned' ? params.view : 'notes'
 const subject = typeof params.subject === 'string' ? params.subject.trim().slice(0,80) : ''
 return { ...base, view, subject }
}
export function workspaceUrl(q: string, page: number, view: string, subject: string) {
 const params = new URLSearchParams()
 if(q) params.set('q', q)
 if(page > 1) params.set('page', String(page))
 if(view !== 'notes') params.set('view', view)
 if(subject) params.set('subject', subject)
 return params.size ? '/notes?' + params : '/notes'
}
