# Drzewo Życia — interaktywna strona edukacyjna

Gotowa strona statyczna do wrzucenia na GitHub i uruchomienia przez GitHub Pages.

## Pliki
- `index.html` — struktura strony i teksty
- `styles.css` — wygląd responsywny
- `app.js` — wyszukiwanie, rozwijanie gałęzi i karty organizmów
- `data/tree.json` — edytowalne dane drzewa ewolucyjnego

## Uruchomienie na GitHubie
1. Utwórz nowe repozytorium na GitHubie.
2. Wgraj **zawartość** tego folderu (nie sam folder) do repozytorium.
3. Otwórz **Settings → Pages**.
4. W sekcji Build and deployment wybierz `Deploy from a branch`, gałąź `main`, folder `/ (root)` i zapisz.
5. Po chwili GitHub pokaże adres strony.

## Uruchomienie lokalne
Możesz otworzyć `index.html` bezpośrednio w przeglądarce — strona ma wbudowaną kopię danych zapasowych i działa także bez lokalnego serwera. Jeśli edytujesz `data/tree.json`, uruchomienie przez serwer pokaże aktualną wersję pliku. Przykładowo, jeśli masz Pythona:
`python -m http.server 8000`
Następnie otwórz `http://localhost:8000`.

## Jak dodawać organizmy
Otwórz `data/tree.json`. Każdy węzeł ma:
- `id` — unikalny identyfikator (bez spacji)
- `name` — polska nazwa
- `latin` — nazwa naukowa lub nazwa grupy
- `kind` — `ancestor`, `domain`, `kingdom`, `group`, `species` albo `event`
- `age` — opcjonalny przybliżony czas
- `description` — krótki opis
- `children` — tablica potomnych gałęzi

Przykład:
```json
{
  "id": "example",
  "name": "Przykładowa grupa",
  "latin": "Example group",
  "kind": "group",
  "description": "Krótki opis tej grupy.",
  "children": []
}
```
Nową grupę dodaj jako element w `children` odpowiedniego przodka. Każde `id` musi być unikalne, a plik musi pozostać poprawnym JSON-em.

## Ważna uwaga naukowa
To edukacyjny przegląd wybranych gałęzi, nie kompletne drzewo wszystkich gatunków. Ewolucja nie jest drabiną prowadzącą do człowieka. Daty są przybliżone, część relacji jest niepewna, a endosymbioza i poziomy transfer genów nie dają się w pełni przedstawić jako proste rozgałęzienia.
