# Audyt pakietu ASD1-M2-10

## Weryfikacja zakresu

| Element wymagany | Lokalizacja / sposób sprawdzenia |
| --- | --- |
| Materiały/ćwiczenia (CRUD) | `aplikacja/asystent-asd.html`, moduł ASD |
| Pytania, próby, notatki | `aplikacja/asystent-asd.html`, trening |
| Gotowość obowiązkowych | `src/planner.mjs`, `src/algorithms.mjs` |
| Wyszukiwanie liniowe po ID | `src/algorithms.mjs` |
| Sortowanie przez wstawianie | `src/algorithms.mjs` |
| Walidacja ID i danych | `src/validation.mjs` |
| Import/eksport JSON | aplikacja i `src/planner.mjs` |
| Scenariusz 66,7% → 100% | `src/scenario-control.json` |
| Testy automatyczne | `tests/stage1.test.mjs`, `tests/stage2.test.mjs` |
| Scenariusze demonstracyjne | `demos/` |
| Dokumentacja akademicka | `docs/*_WZOR.docx` i `docs/*_WZOR.pdf` |
| Prezentacja | `presentation/*_WZOR_10_slajdow.pptx` |
| Uruchomienie offline | `index.html` → `aplikacja/index.html` |

## Porządkowanie

Usunięto starszą, zastąpioną prezentację i starsze wersje dokumentacji oraz lustrzaną kopię plików `src/asd/`. Zachowano źródłowe moduły w `src/` (to one są używane w testach). Nie usunięto `aplikacja/asystent-asd.html`, ponieważ stanowi działający samodzielny moduł w wersji offline.

## Ograniczenia

- Zewnętrzne pliki `src/praca-modul-*.js` i `src/styles.css` pozostają **materiałem źródłowym do przeglądu**, natomiast wersja offline zawiera skrypty i style bezpośrednio w HTML; edycja tylko plików `src` nie aktualizuje automatycznie działającego HTML.
- Dane plików DOCX/PDF w aplikacji są sprawdzane tylko częściowo. To nie jest formalne zatwierdzenie pracy.
- Automatyczne testy algorytmiczne **nie zastępują** testu interfejsu Safari ani sprawdzenia publikacji GitHub Pages.
- Po nowej publikacji GitHub należy uzupełnić URL i commit w README, dokumentacji i prezentacji.
