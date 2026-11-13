import {test} from 'node:test'
import assert from 'node:assert/strict'
import fs from 'node:fs'
import vm from 'node:vm'
import ts from 'typescript'
function setup() {
 const listeners=new Map();let dirty=true;let confirmations=0
 const document={querySelector:()=>dirty?{}:null,addEventListener:(name,fn)=>listeners.set(name,fn),removeEventListener:()=>{}}
 const window={confirm:()=>{confirmations++;return false},addEventListener:(name,fn)=>listeners.set(name,fn),removeEventListener:()=>{}}
 const testModule={exports:{}}
 const code=ts.transpileModule(fs.readFileSync(new URL('../app/unsaved-guard.tsx',import.meta.url),'utf8'),{compilerOptions:{module:ts.ModuleKind.CommonJS}}).outputText
 vm.runInNewContext(code,{module:testModule,exports:testModule.exports,require:()=>({useEffect:fn=>fn()}),document,window,URL,location:new URL('https://example.test/')})
 testModule.exports.default()
 return {listeners,setDirty:value=>dirty=value,confirmations:()=>confirmations}
}
test('refresh warns only when a draft has changes',()=>{
 const app=setup();let prevented=false
 app.listeners.get('beforeunload')({preventDefault(){prevented=true},returnValue:null})
 assert.equal(prevented,true)
 app.setDirty(false);prevented=false
 app.listeners.get('beforeunload')({preventDefault(){prevented=true}})
 assert.equal(prevented,false)
})
test('cancelled app navigation is stopped; opening a new tab is allowed',()=>{
 const app=setup();let stopped=false
 const event={button:0,target:{closest:()=>({href:'https://example.test/notes/1',target:'',hasAttribute:()=>false})},preventDefault(){stopped=true},stopPropagation(){}}
 app.listeners.get('click')(event);assert.equal(stopped,true);assert.equal(app.confirmations(),1)
 stopped=false;app.listeners.get('click')({...event,ctrlKey:true});assert.equal(stopped,false);assert.equal(app.confirmations(),1)
})
test('saving a draft bypasses leave confirmation; logout asks first',()=>{
 const app=setup();let prevented=false
 app.listeners.get('submit')({target:{matches:()=>true},preventDefault(){prevented=true},stopPropagation(){}})
 assert.equal(app.confirmations(),0)
 app.listeners.get('submit')({target:{matches:()=>false},preventDefault(){prevented=true},stopPropagation(){}})
 assert.equal(prevented,true);assert.equal(app.confirmations(),1)
})
