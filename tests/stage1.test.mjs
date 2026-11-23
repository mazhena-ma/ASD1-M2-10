import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { Planner } from '../src/planner.mjs';
import { ITEM_FIELDS, QUESTION_FIELDS } from '../src/validation.mjs';
import { insertionSort, linearSearchById, formatReadiness } from '../src/algorithms.mjs';
const control = () => JSON.parse(readFileSync(new URL('../src/scenario-control.json', import.meta.url), 'utf8'));
const item = (id='A', extra={}) => ({ id, name:'Materiał', kind:'materiał', required:true, deadline:'2026-06-10', ready:false, note:'', ...extra });
const question = (id='Q', extra={}) => ({ id, text:'Pytanie?', answer:'Moja odpowiedź', attempts:0, attemptNote:'', ...extra });
const dataset = (items=[],questions=[]) => ({version:1,items,questions});
const ids = records => records.map(x=>x.id);
const unchanged = (p, action) => { const before=p.exportJSON(); assert.throws(action); assert.equal(p.exportJSON(),before); };
// Niezależny wzorzec nie wywołuje komparatora implementacji.
const oracle = records => [...records].sort((a,b) => {
  const ak=a.deadline+'|'+a.id, bk=b.deadline+'|'+b.id;
  return ak < bk ? -1 : ak > bk ? 1 : 0;
});
test('01 kontrolny: 2/3 -> B gotowe -> 100%',()=>{
  const p=new Planner(control()); const r=p.readiness();
  assert.equal(r.ready,2); assert.equal(r.required,3); assert.equal(r.ratio,2/3); assert.equal(r.visited,4);
  assert.equal(formatReadiness(r),'66,7%'); assert.deepEqual(ids(p.missing().records),['B']);
  p.updateItem('B',{ready:true}); assert.equal(p.readiness().ratio,1); assert.equal(formatReadiness(p.readiness()),'100%'); assert.deepEqual(p.missing().records,[]);
});
test('02 opcjonalne nie zmieniają wyniku',()=>{
  const p=new Planner(control()); p.updateItem('D',{ready:false}); assert.equal(p.readiness().ratio,2/3);
  p.addItem(item('E',{required:false,ready:true})); assert.equal(p.readiness().required,3); assert.equal(p.readiness().ratio,2/3);
});
test('03 brak obowiązkowych ma osobny komunikat',()=>{
  const p=new Planner(dataset([item('A',{required:false,ready:true})]));
  assert.equal(p.readiness().ratio,null); assert.equal(formatReadiness(p.readiness()),'Brak zdefiniowanych wymagań');
});
test('04 cofnięcie statusu przywraca brak',()=>{
  const p=new Planner(control()); p.updateItem('A',{ready:false}); assert.equal(p.readiness().ratio,1/3); assert.deepEqual(ids(p.missing().records),['A','B']);
});
test('05 remisy dat rozstrzyga ID i filtr obowiązkowych',()=>{
  const p=new Planner(dataset([item('Z'),item('B'),item('A'),item('0',{required:false}),item('1',{ready:true})]));
  assert.deepEqual(ids(p.missing().records),['A','B','Z']); assert.equal(p.missing().visited,5);
});
test('06 puste listy: liczniki zero, brak dzielenia przez zero',()=>{
  const p=new Planner(); assert.equal(p.readiness().ratio,null); assert.equal(p.readiness().visited,0);
  assert.deepEqual(p.missing(),{records:[],comparisons:0,shifts:0,visited:0});
  assert.deepEqual(p.findQuestion('X'),{record:null,index:-1,visited:0}); assert.equal(p.questionAt(0),null);
});
test('07 roundtrip JSON, potwierdzenie i atomowość błędnego importu',()=>{
  const p=new Planner(control()), copy=new Planner(); copy.importJSON(p.exportJSON(),{confirmed:true});
  assert.deepEqual(copy.snapshot(),p.snapshot()); assert.deepEqual(copy.readiness(),p.readiness()); assert.deepEqual(copy.missing(),p.missing());
  unchanged(p,()=>p.importJSON(JSON.stringify(dataset())));
  for(const json of ['{','null','[]',JSON.stringify({...control(),version:2}),JSON.stringify({...control(),version:'1'})]) unchanged(p,()=>p.importJSON(json,{confirmed:true}));
  const bad=control(); bad.questions.push(question('LAST',{attempts:'1'})); unchanged(p,()=>p.importJSON(JSON.stringify(bad),{confirmed:true}));
  const badLast=control(); badLast.items.push(item('LAST',{deadline:'2026-02-29'})); unchanged(p,()=>p.importJSON(JSON.stringify(badLast),{confirmed:true}));
});
test('08 kalendarz: format, miesiące i lata przestępne',()=>{
  for(const deadline of ['2000-02-29','2024-02-29','0001-01-01','9999-12-31']) assert.doesNotThrow(()=>new Planner(dataset([item('A',{deadline})])));
  for(const deadline of ['',null,20260610,'10.06','2026-6-10','0000-01-01','1900-02-29','2100-02-29','2026-02-29','2026-04-31','2026-00-01','2026-13-01','2026-01-00','2026-01-32','2026-06-10T00:00:00Z']) assert.throws(()=>new Planner(dataset([item('A',{deadline})])));
  assert.throws(()=>new Planner(dataset([item('D',{required:false,deadline:''})])));
});
test('09 ID niepuste, unikalne w rodzaju, bez zmian przy aktualizacji',()=>{
  for(const id of ['', '  ', 1, null]) { assert.throws(()=>new Planner(dataset([item(id)]))); assert.throws(()=>new Planner(dataset([], [question(id)]))); }
  assert.throws(()=>new Planner(dataset([item(),item()]))); assert.throws(()=>new Planner(dataset([], [question(),question()])));
  const p=new Planner(dataset([item('A')],[question('A')]));
  unchanged(p,()=>p.updateItem('A',{id:'B',name:'Zmiana'})); unchanged(p,()=>p.updateQuestion('A',{id:'B',answer:'Zmiana'}));
  p.updateItem('A',{id:'A',name:'Nowa'}); assert.equal(p.snapshot().items[0].name,'Nowa');
  unchanged(p,()=>p.addItem(item('A'))); unchanged(p,()=>p.updateItem('BRAK',{ready:true}));
});
test('10 ścisłe bool/number/teksty i pełne pola',()=>{
  for(const key of ['required','ready']) for(const value of [0,1,'true',null,undefined]) assert.throws(()=>new Planner(dataset([item('A',{[key]:value})])));
  for(const attempts of ['1',null,-1,1.1,NaN,Infinity,Number.MAX_SAFE_INTEGER+1]) assert.throws(()=>new Planner(dataset([], [question('Q',{attempts})])));
  for(const extra of [{name:''},{name:2},{note:{}},{kind:'inne'},{unknown:true}]) assert.throws(()=>new Planner(dataset([item('A',extra)])));
  for(const extra of [{text:' '},{answer:null},{attemptNote:[]},{unknown:true}]) assert.throws(()=>new Planner(dataset([], [question('Q',extra)])));
  const partial=item(); delete partial.note; assert.throws(()=>new Planner(dataset([partial])));
  assert.throws(()=>new Planner({...dataset(),extra:true})); assert.throws(()=>new Planner(dataset(new Array(1))));
});
test('11 limit 1000 osobno, 1001 odrzucony bez zapisu',()=>{
  const items=Array.from({length:1000},(_,i)=>item('I-'+i)); const questions=Array.from({length:1000},(_,i)=>question('Q-'+i));
  const p=new Planner(dataset(items,questions)); assert.equal(p.snapshot().items.length,1000); assert.equal(p.snapshot().questions.length,1000);
  unchanged(p,()=>p.addItem(item('EXTRA'))); unchanged(p,()=>p.addQuestion(question('EXTRA')));
  unchanged(p,()=>p.importJSON(JSON.stringify(dataset([...items,item('EXTRA')],questions)),{confirmed:true}));
  unchanged(p,()=>p.importJSON(JSON.stringify(dataset(items,[...questions,question('EXTRA')])),{confirmed:true}));
});
test('12 brak referencji pozwalających zmienić stan',()=>{
  const input=control(),p=new Planner(input); input.items[0].name='Zepsute'; input.questions[0].text='Zepsute';
  const s=p.snapshot(); s.items[0].name='Zepsute'; s.questions[0].answer='Zepsute';
  p.findQuestion('Q-1').record.answer='Zepsute'; p.questionAt(0).text='Zepsute'; p.missing().records[0].name='Zepsute';
  assert.deepEqual(p.snapshot(),control());
  const added=item('E'); p.addItem(added); added.name='Zepsute'; assert.equal(p.snapshot().items[4].name,'Materiał');
  const patch={name:'Nowa'}; p.updateItem('E',patch); patch.name='Zepsute'; assert.equal(p.snapshot().items[4].name,'Nowa');
});
test('13 trening: kolejność, licznik, oddzielna notatka, atomowość',()=>{
  const p=new Planner(dataset([], [question('Q1'),question('Q2')]));
  assert.equal(p.questionAt(0).id,'Q1'); assert.equal(p.questionAt(1).id,'Q2'); assert.equal(p.questionAt(2),null); assert.throws(()=>p.questionAt(-1));
  p.recordAttempt('Q1','Do powtórki'); p.recordAttempt('Q1','Lepiej');
  assert.deepEqual(p.findQuestion('Q1').record,question('Q1',{attempts:2,attemptNote:'Lepiej'}));
  unchanged(p,()=>p.recordAttempt('Q1',null)); unchanged(p,()=>p.recordAttempt('BRAK','Notatka'));
  p.updateQuestion('Q1',{attempts:Number.MAX_SAFE_INTEGER}); unchanged(p,()=>p.recordAttempt('Q1','Przepełnienie'));
  unchanged(p,()=>p.updateQuestion('Q2',{text:'Zmieniona',attempts:-1}));
});
test('14 linear search: pierwsze dopasowanie, początek/koniec/brak',()=>{
  const records=[question('A'),question('B'),question('C')];
  assert.deepEqual(linearSearchById(records,'A'),{record:records[0],index:0,visited:1});
  assert.deepEqual(linearSearchById(records,'C'),{record:records[2],index:2,visited:3});
  assert.deepEqual(linearSearchById(records,'X'),{record:null,index:-1,visited:3});
  assert.equal(linearSearchById([question('A'),question('A')],'A').visited,1);
});
test('15 sortowanie: mały krok, stabilność i brak mutacji',()=>{
  const input=[item('C'),item('A'),item('B')], before=structuredClone(input), r=insertionSort(input);
  assert.deepEqual(ids(r.records),['A','B','C']); assert.equal(r.comparisons,3); assert.equal(r.shifts,2); assert.deepEqual(input,before);
  r.records[0].name='Zmiana'; assert.deepEqual(input,before);
  const tied=insertionSort([item('A',{note:'pierwszy'}),item('A',{note:'drugi'})]); assert.deepEqual(tied.records.map(x=>x.note),['pierwszy','drugi']);
});
for(const n of [10,100,1000]) test('16 porównania i oracle n='+n, t=>{
  const ordered=Array.from({length:n},(_,i)=>item('I-'+String(i).padStart(4,'0'),{deadline:'2026-06-'+String(1+Math.floor(i/50)).padStart(2,'0')}));
  const reversed=[...ordered].reverse();
  const ties=Array.from({length:n},(_,i)=>item('I-'+String((i*37)%n).padStart(4,'0')));
  for(const input of [ordered,reversed,ties]) assert.deepEqual(insertionSort(input).records,oracle(input));
  const a=insertionSort(ordered), b=insertionSort(reversed);
  assert.equal(a.comparisons,n-1); assert.equal(a.shifts,0); assert.equal(b.comparisons,n*(n-1)/2); assert.equal(b.shifts,n*(n-1)/2);
  const qs=ordered.map(x=>question(x.id)); const search=[qs[0].id,qs[n-1].id,'MISSING'].map(id=>linearSearchById(qs,id).visited);
  assert.deepEqual(search,[1,n,n]); t.diagnostic(JSON.stringify({n,orderedComparisons:a.comparisons,orderedShifts:a.shifts,reversedComparisons:b.comparisons,reversedShifts:b.shifts,search}));
});
test('18 publiczny schemat nie pozwala zmienić walidacji',()=>{
  assert.throws(()=>ITEM_FIELDS.push('extra')); assert.throws(()=>QUESTION_FIELDS.pop());
  assert.doesNotThrow(()=>new Planner(control()));
});
test('17 błędna aktualizacja jest atomowa; tekst HTML jest tylko danymi',()=>{
  const p=new Planner(control()); unchanged(p,()=>p.updateItem('B',{name:'Zmienione',ready:'true'})); unchanged(p,()=>p.updateItem('B',{unknown:1}));
  p.updateItem('B',{note:'<script>throw 1</script>'}); assert.equal(p.snapshot().items[1].note,'<script>throw 1</script>');
  const patch={}; Object.defineProperty(patch,'ready',{get(){throw Error('Getter nie powinien być czytany');}}); unchanged(p,()=>p.updateItem('B',patch));
});
