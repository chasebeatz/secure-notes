import {test} from 'node:test'
import assert from 'node:assert/strict'
import {noteInput} from './note-input.ts'
import {workspaceFilters,workspaceUrl} from './note-filters.ts'
const input=(values)=>{const form=new FormData();for(const [key,value] of Object.entries(values)) form.set(key,value);return noteInput(form)}
test('notes require title and normalize subject tags',()=>{
 assert.equal(input({title:'  '}).error,'Title is required.')
 assert.deepEqual(input({title:' Topic ',body:' Work ',subject:'  English   Literature ',follow_up:'2028-02-29'}).value,{title:'Topic',body:'Work',subject:'English Literature',follow_up:'2028-02-29'})
})
test('invalid and overflowing follow-up dates are rejected',()=>{
 for(const date of ['2026-02-29','2026-04-31','not-a-date','2026-1-01']) assert.ok(input({title:'Topic',follow_up:date}).error)
 assert.equal(input({title:'Topic'}).value.follow_up,null)
 assert.ok(input({title:'Topic',subject:'x'.repeat(81)}).error)
})
test('view filters whitelist notebook views and retain filters on pagination',()=>{
 assert.equal(workspaceFilters({view:'purge'}).view,'notes')
 assert.equal(workspaceFilters({view:'trash'}).view,'trash')
 assert.equal(workspaceFilters({view:'reminders'}).view,'reminders')
 const url=new URL(workspaceUrl('a & b',2,'reminders','Maths & Science'),'https://example.test')
 assert.equal(url.pathname,'/notes')
 assert.equal(url.searchParams.get('subject'),'Maths & Science')
 assert.equal(url.searchParams.get('view'),'reminders')
 assert.equal(url.searchParams.get('page'),'2')
})
