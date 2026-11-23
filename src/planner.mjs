import { validateDataset, object, string, fail, ITEM_FIELDS, QUESTION_FIELDS } from './validation.mjs';
import { linearSearchById, calculateReadiness, missingItems } from './algorithms.mjs';

export class Planner {
  #state;
  constructor(data = { version: 1, items: [], questions: [] }) { this.#state = validateDataset(data); }
  snapshot() { return validateDataset(this.#state); }
  exportJSON() { return JSON.stringify(this.#state, null, 2); }
  importJSON(json, { confirmed = false } = {}) {
    if (typeof json !== 'string') fail('Import wymaga tekstu JSON');
    const next = validateDataset(JSON.parse(json));
    if (confirmed !== true) fail('Zastąpienie zestawu wymaga potwierdzenia');
    this.#state = next;
  }
  #commit(next) { this.#state = validateDataset(next); }
  #add(collection, record) {
    this.#commit({ ...this.#state, [collection]: [...this.#state[collection], record] });
  }
  #update(collection, id, patch) {
    string(id, 'ID', true); object(patch, 'Zmiany');
    const allowed = collection === 'items' ? ITEM_FIELDS : QUESTION_FIELDS;
    for (const key of Reflect.ownKeys(patch)) {
      if (!allowed.includes(key) || !Object.hasOwn(Object.getOwnPropertyDescriptor(patch, key), 'value')) fail('Nieznane pole lub akcesor');
    }
    if (Object.hasOwn(patch, 'id') && patch.id !== id) fail('ID jest niezmienne');
    const found = linearSearchById(this.#state[collection], id);
    if (found.index === -1) fail('Nie znaleziono ID: ' + id);
    const records = [...this.#state[collection]];
    records[found.index] = { ...found.record, ...patch };
    this.#commit({ ...this.#state, [collection]: records });
  }
  #remove(collection, id) {
    string(id, 'ID', true);
    const found = linearSearchById(this.#state[collection], id);
    if (found.index === -1) fail('Nie znaleziono ID: ' + id);
    const records = [...this.#state[collection]];
    records.splice(found.index, 1);
    this.#commit({ ...this.#state, [collection]: records });
  }
  removeItem(id) { this.#remove('items', id); }
  removeQuestion(id) { this.#remove('questions', id); }
  addItem(record) { this.#add('items', record); }
  updateItem(id, patch) { this.#update('items', id, patch); }
  addQuestion(record) { this.#add('questions', record); }
  updateQuestion(id, patch) { this.#update('questions', id, patch); }
  findQuestion(id) { string(id, 'ID', true); return linearSearchById(this.#state.questions, id); }
  // Indeks pozwala przyszłemu UI przeglądać pytania kolejno, bez ukrytego kursora.
  questionAt(index) {
    if (!Number.isSafeInteger(index) || index < 0) fail('Indeks musi być nieujemną liczbą całkowitą');
    return index < this.#state.questions.length ? { ...this.#state.questions[index] } : null;
  }
  recordAttempt(id, note) {
    string(note, 'Notatka po próbie');
    const { record } = this.findQuestion(id);
    if (!record) fail('Nie znaleziono pytania');
    this.updateQuestion(id, { attempts: record.attempts + 1, attemptNote: note });
  }
  readiness() { return calculateReadiness(this.#state.items); }
  missing() { return missingItems(this.#state.items); }
}
