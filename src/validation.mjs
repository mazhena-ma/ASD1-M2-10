// Format v1: jawne pola i wyłącznie wartości prymitywne, bez cichych konwersji.
export const VERSION = 1;
export const LIMIT = 1000;
export function fail(message) { throw new TypeError(message); }
export function object(value, label) {
  if (value === null || typeof value !== 'object' || Array.isArray(value) ||
      ![Object.prototype, null].includes(Object.getPrototypeOf(value))) fail(label + ': oczekiwano zwykłego obiektu');
}
export function fields(value, names, label) {
  object(value, label);
  if (Reflect.ownKeys(value).length !== names.length || names.some(k => !Object.hasOwn(value, k)))
    fail(label + ': niepełny lub nieznany zestaw pól');
  for (const key of names) if (!Object.hasOwn(Object.getOwnPropertyDescriptor(value, key), 'value')) fail(label + ': akcesory niedozwolone');
}
export function string(value, label, required = false) {
  if (typeof value !== 'string' || (required && !value.trim())) fail(label + ': oczekiwano tekstu' + (required ? ' niepustego' : ''));
}
export function date(value) {
  if (typeof value !== 'string' || !/^\d{4}-\d{2}-\d{2}$/.test(value)) fail('Termin: wymagany RRRR-MM-DD');
  const [y,m,d] = value.split('-').map(Number);
  const leap = y % 4 === 0 && (y % 100 !== 0 || y % 400 === 0);
  const days = [31,leap ? 29 : 28,31,30,31,30,31,31,30,31,30,31];
  if (y < 1 || m < 1 || m > 12 || d < 1 || d > days[m-1]) fail('Termin: niepoprawna data kalendarzowa');
}
export const ITEM_FIELDS = Object.freeze(['id','name','kind','required','deadline','ready','note']);
export const QUESTION_FIELDS = Object.freeze(['id','text','answer','attempts','attemptNote']);
export function validateItem(v) {
  fields(v, ITEM_FIELDS, 'Element');
  string(v.id, 'ID', true); string(v.name, 'Nazwa', true); string(v.note, 'Notatka');
  if (!['materiał','ćwiczenie'].includes(v.kind)) fail('Rodzaj: materiał lub ćwiczenie');
  for (const k of ['required','ready']) if (typeof v[k] !== 'boolean') fail(k + ': wymagany boolean');
  date(v.deadline);
  return { ...v };
}
export function validateQuestion(v) {
  fields(v, QUESTION_FIELDS, 'Pytanie');
  string(v.id, 'ID', true); string(v.text, 'Treść', true); string(v.answer, 'Własna odpowiedź'); string(v.attemptNote, 'Notatka po próbie');
  if (!Number.isSafeInteger(v.attempts) || v.attempts < 0) fail('Liczba prób: nieujemna bezpieczna liczba całkowita');
  return { ...v };
}
function list(value, validator, label) {
  if (!Array.isArray(value) || value.length > LIMIT) fail(label + ': wymagana lista do 1000 rekordów');
  const ids = new Set(); const result = [];
  for (const entry of value) {
    const record = validator(entry);
    if (ids.has(record.id)) fail(label + ': powtórzone ID ' + record.id);
    ids.add(record.id); result.push(record);
  }
  return result;
}
export function validateDataset(value) {
  fields(value, ['version','items','questions'], 'Zestaw');
  if (value.version !== VERSION) fail('Nieobsługiwana wersja formatu');
  return { version: VERSION, items: list(value.items, validateItem, 'Elementy'), questions: list(value.questions, validateQuestion, 'Pytania') };
}
