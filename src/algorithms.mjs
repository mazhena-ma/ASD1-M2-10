// Funkcje algorytmiczne przyjmują rekordy zwalidowane przez model.
// Porządek ID: deterministyczny leksykograficzny UTF-16, bez localeCompare.
export function compareItems(a, b) {
  if (a.deadline !== b.deadline) return a.deadline < b.deadline ? -1 : 1;
  return a.id === b.id ? 0 : a.id < b.id ? -1 : 1;
}
export function linearSearchById(records, id) {
  let visited = 0;
  for (let i = 0; i < records.length; i++) {
    visited++;
    if (records[i].id === id) return { record: { ...records[i] }, index: i, visited };
  }
  return { record: null, index: -1, visited };
}
export function insertionSort(items, onStep = null) {
  const records = items.map(item => ({ ...item }));
  let comparisons = 0, shifts = 0;
  for (let i = 1; i < records.length; i++) {
    const before = onStep ? records.map(x => x.id) : null;
    const decisions = onStep ? [] : null;
    const key = records[i]; let j = i - 1;
    while (j >= 0) {
      comparisons++; // Dokładnie jedno wywołanie komparatora złożonego klucza.
      const order = compareItems(records[j], key);
      if (onStep) decisions.push(records[j].id + (order <= 0 ? ' ≤ ' : ' > ') + key.id + (order <= 0 ? ': zatrzymaj' : ': przesuń'));
      if (order <= 0) break;
      records[j+1] = records[j]; shifts++; j--;
    }
    records[j+1] = key;
    if (onStep) onStep({before, decision: decisions.join('; ') + '; wstaw ' + key.id, after: records.map(x => x.id)});
  }
  return { records, comparisons, shifts };
}
export function calculateReadiness(items) {
  let required = 0, ready = 0, visited = 0;
  for (const item of items) {
    visited++;
    if (item.required) { required++; if (item.ready) ready++; }
  }
  return { required, ready, ratio: required ? ready / required : null,
    message: required ? (ready === required ? 'Wszystkie wymagane elementy gotowe' : 'Pozostały obowiązkowe braki') : 'Brak zdefiniowanych wymagań', visited };
}
export function formatReadiness(result) {
  return result.ratio === null ? result.message : (result.ratio * 100).toLocaleString('pl-PL', { maximumFractionDigits: 1 }) + '%';
}
export function missingItems(items) {
  const missing = []; let visited = 0;
  for (const item of items) { visited++; if (item.required && !item.ready) missing.push(item); }
  return { ...insertionSort(missing), visited };
}
