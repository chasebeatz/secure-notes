import { test } from 'node:test'
import assert from 'node:assert/strict'
import {bulkInput,bulkChange} from './bulk-notes.ts'
const form=(ids,command='pin',subject='')=>{const f=new FormData();ids.forEach(id=>f.append('ids',id));f.set('command',command);f.set('subject',subject);return f}
test('bulk selection is bounded and rejects malformed IDs',()=>{
 for(const ids of [[],Array.from({length:21},(_,i)=>String(i+1)),['0'],['-1'],['1.5'],['1e2'],['9007199254740992']]) assert.ok(bulkInput(form(ids)).error)
 assert.deepEqual(bulkInput(form(['1','1','2'])).value.ids,[1,2])
})
test('bulk commands are whitelisted and tag lengths are validated',()=>{
 assert.ok(bulkInput(form(['1'],'delete-everything')).error)
 assert.ok(bulkInput(form(['1'],'tag','  ')).error)
 assert.ok(bulkInput(form(['1'],'tag','x'.repeat(81))).error)
 assert.equal(bulkInput(form(['1'],'tag',' English   Literature ')).value.subject,'English Literature')
})
test('bulk operations change only intended fields',()=>{
 assert.deepEqual(bulkChange('trash','','now'),{updated_at:'now',deleted_at:'now'})
 assert.deepEqual(bulkChange('restore','','now'),{updated_at:'now',deleted_at:null})
 assert.deepEqual(bulkChange('pin','','now'),{updated_at:'now',pinned:true})
 assert.deepEqual(bulkChange('unpin','','now'),{updated_at:'now',pinned:false})
 assert.deepEqual(bulkChange('complete','','now'),{updated_at:'now',follow_up:null})
 assert.deepEqual(bulkChange('clear-tag','unused','now'),{updated_at:'now',subject:''})
 assert.equal(bulkChange('purge','','now'),null)
})
