# Oficjalne źródła identyfikacji — sprawdzono 2026-11-09

- https://uwb.edu.pl/ — oficjalna uczelnia.
- https://wilno.uwb.edu.pl/ — potwierdzona nazwa: Filia Uniwersytetu w Białymstoku w Wilnie.
- https://uwb.edu.pl/uniwersytet/promocja/identyfikacja-wizualna-uwb — godło i oficjalna kolorystyka: CMYK 0/100/61/43, RGB 152/0/46, PANTONE 202C, HEX #862633. Uwaga: opublikowane RGB i HEX nie są matematycznie identyczne. UI używa dokładnie opublikowanego HEX #862633, nie deklaruje konwersji RGB. Pozostałe kolory to autorska paleta interfejsu, NIE oficjalne barwy ani wynik odczytu CSS.
- Godło kolorowe SVG (niezmieniony plik pobrany przez fetch w oficjalnej stronie): https://uwb.edu.pl/fcp/iFBsTMCQZEyUgCg4WSHd4ak1VYTZUNlAGDzRMdA0bPTZDGw8jJRRUfHYlC1BGbzMrMBgzNlk4VjgSOQEgQVQlKBpcHg/_global/public/main/godlo_uwb_svg.svg — assets/uwb-logo.svg.
- https://wilno.uwb.edu.pl/filia/identyfikacja-wizualna — oficjalny wariant filii znaleziony i pobrany, assets/wilno-logo.svg; nie komponujemy go z godłem w nowy znak. Źródło: https://wilno.uwb.edu.pl/fcp/BFBsTMCQZEyUgCg4WSHd4aVhbb2RFMFI8OTkKbFkAJDYDFUEuKh0RZG53Fx5IYXgxHCYiNkU9XDoHJAchDUxrLh1MBm5pBgUjJgoOFkh3eGlbTHtkSA/_users/code_cCxcTLS8fHzYnPg4yHzo4dgodNmhFPQ/wydzial/identyfikacja_wizualna_filii/logo_filii/kolor_bez_nazwy_logo_filia_wilno.svg
- Zasady: https://bip.uwb.edu.pl/uwb/akty-prawne-uwb/2021/zarzadzenia-rektora/16297,Zarzadzenie-nr-68-Rektora-Uniwersytetu-w-Bialymstoku-z-dnia-6-lipca-2021-r-w-spr.html
- Tekst zarządzenia nr 68/2021 odczytany istniejącym clawpdf (3 strony, bez tworzenia dokumentów): https://bip.uwb.edu.pl/download/64/40202/Zarzadzenienr68z2021-godloUwB.pdf

Reguły potwierdzone: oryginalny wzór Działu Promocji; wersja kolorowa; czytelne wyeksponowanie, górny lewy róg. Przy jednoczesnym znaku jednostki godło pierwsze w hierarchii i nie mniejsze. Na oficjalnych stronach jednostek godło ma być linkiem do uczelni. §2 ust.3 przewiduje zgodę rektora dla innych zastosowań; §6 ust.4 akceptację Działu Promocji przed publikacją. Projekt jest lokalnym, nieoficjalnym prototypem dydaktycznym, NIE dowodem zgody uczelni. Przed publicznym użyciem/publikacją trzeba wyjaśnić zgodę z uczelnią. Nie publikowano.

Nie znaleziono na obu stronach osobnej księgi znaku ani liczbowego pola ochronnego/minimalnego rozmiaru. Nie wymyślono norm. Zachowano proporcje SVG (object-fit:contain), białe tło, bez przekształceń/przebarwiania; dodano własny odstęp ochronny 16 px desktop / 12 px mobile, nie nazywając go oficjalną normą. W aplikacji użyto godła uczelni, wariant filii pozostawiono jako autentyczny zasób referencyjny.

Początkowe próby PowerShell/Playwright request zwracały 503, a dawny research-brand.cjs widział stronę weryfikacji. Skuteczne pobranie nastąpiło ze zwykłej, załadowanej oficjalnej strony w zarządzanej przeglądarce. Nie używano wygenerowanego logo ani grafiki z innego źródła.

Wersja kompletna: w aplikacji i na slajdzie tytułowym użyto oryginalnego znaku Filii w Wilnie `wilno-logo.svg`; podstawowy kolor UI #862633 zgodny z oficjalną identyfikacją UwB.
