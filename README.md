# ASD1-M2-10 — Moja praca dyplomowa i asystent przygotowania do obrony

**Autor:** Marzena Magadia · nr albumu 93782 · Informatyka · Filia Uniwersytetu w Białymstoku w Wilnie · ASD I · M2 · 2026/2027.  
**Status:** lokalna, nieoficjalna aplikacja dydaktyczna. Paleta fioletowa inspirowana Filią UwB. Logo użyte jako identyfikacja projektu studenckiego, bez sugerowania oficjalnego zatwierdzenia.

## Cel

Aplikacja łączy dwa obszary: (1) pisanie pracy licencjackiej — kontrola rozdziałów, materiały, przechowywanie plików, harmonogram, formalna kontrola DOCX/PDF; (2) **moduł ASD1-M2-10** — lista materiałów i ćwiczeń, baza pytań, notatki po próbie, własne algorytmy sortowania i wyszukiwania oraz obliczanie gotowości. Moduł ASD jest osadzony w zakładce **09 Trening i planer ASD**, ale pozostaje samodzielnym komponentem. Oba plany mają odrębne dane i eksporty JSON.

## Uruchomienie

Dwuklik `aplikacja/index.html` w Finderze. Strona i jej osadzony moduł `aplikacja/asystent-asd.html` działają lokalnie z `file://`, bez Terminala i serwera. Nie przenosić osobno plików HTML. Jeśli ramka zostanie zablokowana, można otworzyć `asystent-asd.html` bezpośrednio.

## Zakres obowiązkowy ASD1-M2-10

- Materiały/ćwiczenia: ID, nazwa, rodzaj, obowiązkowy, termin, gotowy, notatka; edycja i usuwanie.
- Pytania: ID, treść, własna odpowiedź, liczba prób, notatka po próbie, przechodzenie kolejno.
- Gotowość = liczba wykonanych obowiązkowych / liczba wszystkich obowiązkowych × 100%; gdy brak obowiązkowych — komunikat, nie 100%.
- Wyszukiwanie liniowe pytań po ID O(n), licznik sprawdzonych rekordów.
- Sortowanie przez wstawianie niewykonanych obowiązkowych elementów wg terminu i ID; porównania/przesunięcia i tabela kroków. O(n) / O(n²).
- Przykład kontrolny A/B/C/D: 2/3 = 66,7%; zmiana statusu elementu opcjonalnego D nie zmienia wyniku; ukończenie B daje 100%.
- JSON: walidowany import z potwierdzeniem oraz eksport z wersją formatu. Nieprawidłowy plik nie nadpisuje danych.
- Testy: `npm test` (wymaga Node.js tylko do testów), także 10/100/1000 rekordów. Wyniki uruchomienia podane w `docs/WYNIKI_TESTOW.md`.

## Układ folderów

`aplikacja/` — dwa samodzielne dokumenty HTML, główna aplikacja i moduł ASD.  
`src/` — kod algorytmów, walidacji, planera i pomocnicze kopie skryptów strony.  
`tests/` — automatyczne testy Node.js; `demos/` — przykładowe scenariusze JSON.  
`docs/` — formalna dokumentacja 10 stron, DOCX/PDF, raport testów.  
`presentation/` — prezentacja 10 slajdów. `assets/` — logo i źródła.  
`START.md` — szybka instrukcja.

## Ograniczenia i bezpieczeństwo

Wskaźnik pracy pokazuje odhaczone etapy, a wskaźnik ASD realizację obowiązkowych materiałów — **nie** ocenę merytoryczną wiedzy. Audyt DOCX/PDF nie jest oficjalną kontrolą uczelni i nie ocenia oryginalności ani zgodności każdego cytowania. Nie przesyłaj poufnych prac na niesprawdzone serwery. Dane plików są lokalne; ich trwałość zależy od przeglądarki. Nie ma automatycznej synchronizacji. Eksportuj wszystkie trzy zestawy JSON.

## GitHub i oddanie

Przed oddaniem należy umieścić tę wersję w repozytorium GitHub i wpisać rzeczywisty URL + hash commitu. Nie podajemy fikcyjnego adresu. W Dzienniku należy dołączyć osobno kod, README, dokumentację 10 stron PDF, 10-slajdową prezentację i testy zgodnie z kartą zadania.

## Źródła i AI

Karta projektu `ASD1-M2-10.html` (załączony zakres), strona Filii UwB i dostarczony wzór pracy, dokumentacja JavaScript/Node.js. W opracowaniu funkcji i dokumentów wykorzystano wsparcie ChatGPT/OpenClaw. Student odpowiada za weryfikację kodu, interpretację wyników i obronę.

## Uporządkowany pakiet

Główne wejście: `index.html` (GitHub Pages) albo `aplikacja/index.html` (dwuklik na MacBooku). W `presentation/` i `docs/` zachowano tylko aktualne wersje dokumentów dopasowane stylistycznie do przekazanych wzorów UwB. `defense.md` to plan demonstracji, a `AUDYT.md` wskazuje spełnione punkty, ograniczenia i to, co trzeba jeszcze ręcznie sprawdzić.

**Uwaga techniczna:** `src/styles.css` i `src/praca-modul-*.js` są materiałem źródłowym; wersja HTML offline ma style i skrypty osadzone wewnątrz. Zmiana plików źródłowych bez przebudowy HTML nie zmienia strony opublikowanej w GitHub Pages.
