# Plan obrony projektu ASD1-M2-10

## Scenariusz pokazu

1. Otworzyć `index.html` — przekierowanie do `aplikacja/index.html`.
2. Krótko wyjaśnić zakładki aplikacji pomocniczej do pracy dyplomowej i oddzielny moduł **09 Trening i planer ASD**.
3. W module ASD wczytać przykład kontrolny i potwierdzić zastąpienie danych: **2/3 = 66,7%**.
4. Pokazać, że opcjonalne zadanie D nie zmienia procentu, gdy zmieni się jego status.
5. Oznaczyć B jako wykonane; wynik powinien wynieść **100%**.
6. Dodać pytanie treningowe, zapisać odpowiedź, próbę i notatkę. Wyszukać pytanie po ID; pokazać licznik sprawdzeń.
7. Pokazać sortowanie niewykonanych obowiązkowych elementów (termin, potem ID) i licznik porównań/przesunięć.
8. Pokazać porównanie danych 10 / 100 / 1000 rekordów oraz jeden przykład śladu kroków.
9. Wyeksportować JSON, zaimportować poprawne dane i spróbować błędnego pliku (bez utraty danych).
10. Pokazać wyniki `npm test`, strukturę kodu, README, dokumentację i 10-slajdową prezentację.

## Co wyjaśnić

- Gotowość opisuje **wykonanie obowiązkowych elementów planu**, nie poziom wiedzy studenta.
- Dla 0 obowiązkowych elementów wynik to **„Brak zdefiniowanych wymagań”**, a nie 100%.
- Wyszukiwanie liniowe: maksymalnie O(n), pokazuje liczbę sprawdzonych rekordów.
- Sortowanie przez wstawianie: O(n) w najlepszym, O(n²) w najgorszym przypadku.
- Strona może działać przez `file://`, natomiast testy automatyczne wymagają Node.js.
- Dane aplikacji pracy dyplomowej i modułu ASD mają osobne eksporty JSON.

## Przed oddaniem

- Sprawdzić interfejs w Safari oraz działanie zakładki 09.
- Zaktualizować dokumentację i README o rzeczywisty adres GitHub i identyfikator commitu.
- Przetestować działanie po pobraniu repozytorium do nowego katalogu.
- Uzupełnić prezentację o rzeczywisty zrzut ekranu, jeśli go brakuje.
- Nie podawać przykładowych wymagań pracy dyplomowej jako oficjalnego zatwierdzenia przez uczelnię.
