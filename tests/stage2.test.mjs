import test from 'node:test';
import assert from 'node:assert/strict';
import {Planner} from '../src/planner.mjs';
import {insertionSort} from '../src/algorithms.mjs';
import {readFileSync} from 'node:fs';
const control=JSON.parse(readFileSync(new URL('../src/scenario-control.json',import.meta.url)));
test('usuwanie elementu, pytania i atomowość błędu',()=>{const p=new Planner(control);p.removeItem('B');assert.equal(p.readiness().ratio,1);p.removeQuestion('Q-1');assert.equal(p.questionAt(0),null);const before=p.exportJSON();for(const fn of [()=>p.removeItem('X'),()=>p.removeQuestion('X'),()=>p.removeItem('')]){assert.throws(fn);assert.equal(p.exportJSON(),before);}assert.equal(p.snapshot().items.length,3);});
test('ślad rzeczywistych kroków nie zmienia wyniku ani liczników',()=>{const input=['C','A','B'].map(id=>({id,deadline:'2026-06-10'})),steps=[];const a=insertionSort(input,s=>steps.push(s));assert.deepEqual(a,insertionSort(input));assert.equal(steps.length,2);assert.deepEqual(steps[0].before,['C','A','B']);assert.deepEqual(steps[0].after,['A','C','B']);assert.deepEqual(steps[1].after,['A','B','C']);assert.match(steps[1].decision,/C > B: przesuń; A ≤ B: zatrzymaj/);});
