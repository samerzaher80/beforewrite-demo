import test from 'node:test';import assert from 'node:assert/strict';import {initial,simulate,execute} from '../engine.js';
test('preview computes actual deletion effect',()=>{const p=simulate(initial,['R-105']);assert.equal(p.projectedCount,3);assert.equal(p.projectedBalance,610)});
test('dependency blocks deletion',()=>{const p=simulate(initial,['R-104']);assert.equal(execute(initial,p).status,'blocked')});
test('clean approved local deletion executes',()=>{const p=simulate(initial,['R-105']);const r=execute(initial,p);assert.equal(r.status,'executed');assert.equal(r.state.records.length,3)});
test('changed version requires a new simulation',()=>{const p=simulate(initial,['R-105']);assert.equal(execute({...initial,version:2},p).status,'blocked')});
test('underpredicted side effect rolls back',()=>{const p=simulate(initial,['R-106']);const r=execute(initial,p,{injectSideEffect:true});assert.equal(r.status,'rolled-back');assert.equal(r.state.records.length,4)});
test('simulation never mutates source',()=>{const before=JSON.stringify(initial);simulate(initial,['R-104']);assert.equal(JSON.stringify(initial),before)});
