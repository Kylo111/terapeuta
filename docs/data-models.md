# Modele danych aplikacji Terapeuta

## Przegląd

Aplikacja Terapeuta wykorzystuje następujące modele danych:

1. **User** - Model użytkownika
2. **Profile** - Model profilu terapeutycznego
3. **Session** - Model sesji terapeutycznej
4. **Task** - Model zadania
5. **TherapyMethod** - Model metody terapeutycznej
6. **Prompt** - Model promptu dla metod terapeutycznych

## Szczegóły modeli

### User

Model użytkownika przechowuje informacje o użytkownikach aplikacji.

**Główne pola:**
- `email` - Adres email użytkownika (unikalny)
- `password` - Hasło użytkownika (hashowane)
- `firstName` - Imię użytkownika
- `lastName` - Nazwisko użytkownika
- `profiles` - Lista profili terapeutycznych użytkownika
- `settings` - Ustawienia użytkownika
  - `preferredLLMProvider` - Preferowany dostawca modeli językowych
  - `preferredModel` - Preferowany model językowy
  - `theme` - Motyw interfejsu
  - `language` - Język interfejsu
  - `notifications` - Ustawienia powiadomień

### Profile

Model profilu terapeutycznego przechowuje informacje o profilach terapeutycznych użytkownika.

**Główne pola:**
- `user` - Referencja do użytkownika
- `name` - Nazwa profilu
- `therapyMethod` - Metoda terapeutyczna
- `goals` - Cele terapeutyczne
- `challenges` - Wyzwania
- `sessions` - Lista sesji terapeutycznych
- `tasks` - Lista zadań
- `emotionalState` - Stan emocjonalny

### Session

Model sesji terapeutycznej przechowuje informacje o sesjach terapeutycznych.

**Główne pola:**
- `profile` - Referencja do profilu terapeutycznego
- `startTime` - Czas rozpoczęcia sesji
- `endTime` - Czas zakończenia sesji
- `therapyMethod` - Metoda terapeutyczna
- `sessionNumber` - Numer sesji
- `continuityStatus` - Status ciągłości sesji
- `conversation` - Konwersacja podczas sesji
- `summary` - Podsumowanie sesji
- `metrics` - Metryki sesji
- `tasks` - Lista zadań przypisanych podczas sesji
- `isCompleted` - Czy sesja została zakończona

### Task

Model zadania przechowuje informacje o zadaniach przypisanych podczas sesji terapeutycznych.

**Główne pola:**
- `profile` - Referencja do profilu terapeutycznego
- `session` - Referencja do sesji terapeutycznej
- `description` - Opis zadania
- `category` - Kategoria zadania
- `deadline` - Termin wykonania zadania
- `priority` - Priorytet zadania
- `status` - Status zadania
- `completionData` - Dane o wykonaniu zadania
- `discussedInSession` - Informacje o omówieniu zadania podczas sesji
- `reminders` - Przypomnienia o zadaniu

### TherapyMethod

Model metody terapeutycznej przechowuje informacje o metodach terapeutycznych.

**Główne pola:**
- `name` - Nazwa metody terapeutycznej
- `key` - Klucz metody terapeutycznej
- `description` - Opis metody terapeutycznej
- `principles` - Zasady metody terapeutycznej
- `techniques` - Techniki stosowane w metodzie terapeutycznej
- `suitableFor` - Dla kogo jest odpowiednia metoda
- `contraindications` - Przeciwwskazania do stosowania metody
- `prompts` - Lista promptów dla metody terapeutycznej
- `isActive` - Czy metoda jest aktywna

### Prompt

Model promptu przechowuje informacje o promptach dla metod terapeutycznych.

**Główne pola:**
- `title` - Tytuł promptu
- `therapyMethod` - Referencja do metody terapeutycznej
- `content` - Treść promptu
- `purpose` - Cel promptu
- `variables` - Zmienne używane w promptcie
- `tags` - Tagi promptu
- `version` - Wersja promptu
- `isActive` - Czy prompt jest aktywny
- `createdBy` - Kto utworzył prompt
- `usageCount` - Liczba użyć promptu
- `effectivenessRating` - Ocena skuteczności promptu
- `feedback` - Opinie użytkowników o promptcie

## Relacje między modelami

- Użytkownik może mieć wiele profili terapeutycznych
- Profil terapeutyczny należy do jednego użytkownika
- Profil terapeutyczny może mieć wiele sesji terapeutycznych
- Sesja terapeutyczna należy do jednego profilu terapeutycznego
- Sesja terapeutyczna może mieć wiele zadań
- Zadanie należy do jednej sesji terapeutycznej i jednego profilu terapeutycznego
- Metoda terapeutyczna może mieć wiele promptów
- Prompt należy do jednej metody terapeutycznej

## Diagram ERD

```
User 1 --- * Profile
Profile 1 --- * Session
Profile 1 --- * Task
Session 1 --- * Task
TherapyMethod 1 --- * Prompt
```
