import { test } from 'node:test'
import assert from 'node:assert/strict'
import { escapeLike, searchPattern, notesUrl, readFilters } from './note-filters.ts'

test('literal search escapes SQL LIKE wildcards and backslashes', () => {
  assert.equal(escapeLike('50%_\\'), '50\\%\\_\\\\')
  assert.equal(escapeLike("Ada, (Maths) O'Neil"), "Ada, (Maths) O'Neil")
})
test('filter grammar characters remain inside a quoted search pattern', () => {
  assert.equal(searchPattern('a,b).title.eq."x"'), '"%a,b).title.eq.\\"x\\"%"')
  assert.equal(searchPattern('50%'), '"%50\\\\%%"')
})
test('URL filters reject repeated values and invalid pages', () => {
  assert.deepEqual(readFilters({ q: ['one', 'two'], page: '-1' }), { q: '', page: 1 })
  assert.equal(readFilters({ page: 'Infinity' }).page, 1)
  assert.equal(readFilters({ page: '1.5' }).page, 1)
  assert.equal(readFilters({ q: 'x'.repeat(300) }).q.length, 200)
})
test('pagination retains encoded search', () => {
  const url = new URL(notesUrl('a & b', 2), 'https://example.test')
  assert.equal(url.searchParams.get('q'), 'a & b')
  assert.equal(url.searchParams.get('page'), '2')
  assert.equal(notesUrl(), '/')
})
