# Schemat Bazy Danych Aplikacji "Terapeuta"

## 1. Przegląd schematu bazy danych

Aplikacja "Terapeuta" wykorzystuje MongoDB jako główną bazę danych. MongoDB jest nierelacyjną bazą danych dokumentową, która przechowuje dane w formacie BSON (Binary JSON). Schemat bazy danych jest zaprojektowany z myślą o elastyczności, wydajności i skalowalności.

### 1.1. Diagram schematu bazy danych

```
+----------------+       +----------------+       +----------------+
|                |       |                |       |                |
|     User       |------>|    Profile     |------>|    Session     |
|                |       |                |       |                |
+----------------+       +----------------+       +----------------+
                                 |
                                 v
                         +----------------+
                         |                |
                         |     Task       |
                         |                |
                         +----------------+
```

### 1.2. Główne kolekcje

1. **Users** - Przechowuje informacje o użytkownikach
2. **Profiles** - Przechowuje informacje o profilach terapeutycznych
3. **Sessions** - Przechowuje informacje o sesjach terapeutycznych
4. **Tasks** - Przechowuje informacje o zadaniach terapeutycznych

## 2. Szczegółowy opis kolekcji

### 2.1. Kolekcja Users

Kolekcja Users przechowuje informacje o użytkownikach aplikacji.

#### 2.1.1. Schemat dokumentu User

```javascript
{
  _id: ObjectId,
  email: String,          // Unikalny adres email użytkownika
  password: String,       // Zahaszowane hasło
  firstName: String,      // Imię użytkownika
  lastName: String,       // Nazwisko użytkownika
  profiles: [ObjectId],   // Referencje do profili użytkownika
  settings: {
    preferredLLMProvider: String,  // Preferowany dostawca modelu LLM
    preferredModel: String,        // Preferowany model LLM
    theme: String,                 // Motyw aplikacji (light, dark, system)
    language: String,              // Język aplikacji (pl, en)
    notifications: {
      email: Boolean,              // Powiadomienia email
      push: Boolean                // Powiadomienia push
    }
  },
  createdAt: Date,        // Data utworzenia konta
  lastLogin: Date,        // Data ostatniego logowania
  isActive: Boolean       // Czy konto jest aktywne
}
```

#### 2.1.2. Indeksy

- `email`: Unikalny indeks dla szybkiego wyszukiwania użytkowników po adresie email

#### 2.1.3. Walidacja

- `email`: Wymagany, unikalny, format email
- `password`: Wymagany, minimum 8 znaków
- `settings.preferredLLMProvider`: Enum (openai, anthropic, google, huggingface, ollama)
- `settings.theme`: Enum (light, dark, system)
- `settings.language`: Enum (pl, en)

### 2.2. Kolekcja Profiles

Kolekcja Profiles przechowuje informacje o profilach terapeutycznych użytkowników.

#### 2.2.1. Schemat dokumentu Profile

```javascript
{
  _id: ObjectId,
  user: ObjectId,         // Referencja do użytkownika
  name: String,           // Nazwa profilu
  therapyMethod: String,  // Metoda terapii
  goals: [{
    _id: ObjectId,
    description: String,  // Opis celu
    priority: String,     // Priorytet (low, medium, high)
    status: String,       // Status (active, completed, abandoned)
    createdAt: Date,      // Data utworzenia
    completedAt: Date     // Data ukończenia
  }],
  challenges: [{
    _id: ObjectId,
    description: String,  // Opis wyzwania
    severity: String      // Poziom trudności (low, medium, high)
  }],
  sessions: [ObjectId],   // Referencje do sesji
  tasks: [ObjectId],      // Referencje do zadań
  emotionalState: {
    anxiety: Number,      // Poziom lęku (0-10)
    depression: Number,   // Poziom depresji (0-10)
    optimism: Number,     // Poziom optymizmu (0-10)
    lastUpdated: Date     // Data ostatniej aktualizacji
  },
  therapyProgress: {
    overallStatus: String,    // Ogólny status terapii
    keyInsights: [String],    // Kluczowe spostrzeżenia
    homeworkCompletion: Number // Wskaźnik wykonania zadań (0-1)
  },
  isActive: Boolean,      // Czy profil jest aktywny
  createdAt: Date         // Data utworzenia profilu
}
```

#### 2.2.2. Indeksy

- `user`: Indeks dla szybkiego wyszukiwania profili użytkownika

#### 2.2.3. Walidacja

- `user`: Wymagany, referencja do kolekcji Users
- `name`: Wymagany, string
- `therapyMethod`: Enum (cognitive_behavioral, psychodynamic, humanistic, systemic, solution_focused)
- `goals.priority`: Enum (low, medium, high)
- `goals.status`: Enum (active, completed, abandoned)
- `challenges.severity`: Enum (low, medium, high)
- `emotionalState.anxiety`: Number (0-10)
- `emotionalState.depression`: Number (0-10)
- `emotionalState.optimism`: Number (0-10)
- `therapyProgress.overallStatus`: Enum (not_started, beginning, progressing, improving, maintaining, completed)

### 2.3. Kolekcja Sessions

Kolekcja Sessions przechowuje informacje o sesjach terapeutycznych.

#### 2.3.1. Schemat dokumentu Session

```javascript
{
  _id: ObjectId,
  profile: ObjectId,      // Referencja do profilu
  startTime: Date,        // Czas rozpoczęcia sesji
  endTime: Date,          // Czas zakończenia sesji
  therapyMethod: String,  // Metoda terapii
  sessionNumber: Number,  // Numer sesji
  continuityStatus: String, // Status ciągłości (new, continued, resumed_after_break)
  conversation: [{
    role: String,         // Rola (system, assistant, user)
    content: String,      // Treść wiadomości
    timestamp: Date       // Czas wysłania wiadomości
  }],
  summary: {
    mainTopics: [String], // Główne tematy sesji
    keyInsights: String,  // Kluczowe spostrzeżenia
    progress: String,     // Postęp
    homework: String      // Zadanie domowe
  },
  metrics: {
    emotionalStateStart: {
      anxiety: Number,    // Poziom lęku na początku sesji (0-10)
      depression: Number, // Poziom depresji na początku sesji (0-10)
      optimism: Number    // Poziom optymizmu na początku sesji (0-10)
    },
    emotionalStateEnd: {
      anxiety: Number,    // Poziom lęku na końcu sesji (0-10)
      depression: Number, // Poziom depresji na końcu sesji (0-10)
      optimism: Number    // Poziom optymizmu na końcu sesji (0-10)
    },
    sessionEffectivenessRating: Number // Ocena skuteczności sesji (1-10)
  },
  tasks: [ObjectId],      // Referencje do zadań
  isCompleted: Boolean    // Czy sesja jest zakończona
}
```

#### 2.3.2. Indeksy

- `profile`: Indeks dla szybkiego wyszukiwania sesji profilu
- `startTime`: Indeks dla sortowania sesji według czasu rozpoczęcia

#### 2.3.3. Walidacja

- `profile`: Wymagany, referencja do kolekcji Profiles
- `startTime`: Wymagany, date
- `therapyMethod`: Enum (cognitive_behavioral, psychodynamic, humanistic, systemic, solution_focused)
- `continuityStatus`: Enum (new, continued, resumed_after_break)
- `conversation.role`: Enum (system, assistant, user)
- `metrics.emotionalStateStart.anxiety`: Number (0-10)
- `metrics.emotionalStateStart.depression`: Number (0-10)
- `metrics.emotionalStateStart.optimism`: Number (0-10)
- `metrics.emotionalStateEnd.anxiety`: Number (0-10)
- `metrics.emotionalStateEnd.depression`: Number (0-10)
- `metrics.emotionalStateEnd.optimism`: Number (0-10)
- `metrics.sessionEffectivenessRating`: Number (1-10)

### 2.4. Kolekcja Tasks

Kolekcja Tasks przechowuje informacje o zadaniach terapeutycznych.

#### 2.4.1. Schemat dokumentu Task

```javascript
{
  _id: ObjectId,
  profile: ObjectId,      // Referencja do profilu
  session: ObjectId,      // Referencja do sesji
  description: String,    // Opis zadania
  category: String,       // Kategoria zadania
  createdAt: Date,        // Data utworzenia
  deadline: Date,         // Termin wykonania
  priority: String,       // Priorytet (low, medium, high)
  status: String,         // Status (pending, completed, incomplete)
  completionData: {
    completionDate: Date, // Data wykonania
    successRating: Number, // Ocena sukcesu (1-10)
    challenges: String,   // Napotkane wyzwania
    reflections: String,  // Refleksje
    emotionalResponse: String // Reakcja emocjonalna
  },
  discussedInSession: {
    sessionId: ObjectId,  // Referencja do sesji, w której omówiono zadanie
    date: Date,           // Data omówienia
    outcome: String       // Wynik omówienia
  },
  reminders: [{
    time: Date,           // Czas przypomnienia
    message: String,      // Treść przypomnienia
    isSent: Boolean       // Czy przypomnienie zostało wysłane
  }]
}
```

#### 2.4.2. Indeksy

- `profile`: Indeks dla szybkiego wyszukiwania zadań profilu
- `session`: Indeks dla szybkiego wyszukiwania zadań sesji
- `deadline`: Indeks dla sortowania zadań według terminu wykonania

#### 2.4.3. Walidacja

- `profile`: Wymagany, referencja do kolekcji Profiles
- `session`: Wymagany, referencja do kolekcji Sessions
- `description`: Wymagany, string
- `category`: Enum (technika_terapeutyczna, refleksja, cwiczenie_behawioralne, dziennik, inne)
- `deadline`: Wymagany, date
- `priority`: Enum (low, medium, high)
- `status`: Enum (pending, completed, incomplete)
- `completionData.successRating`: Number (1-10)

## 3. Relacje między kolekcjami

### 3.1. User - Profile

- Relacja jeden-do-wielu (one-to-many)
- Użytkownik może mieć wiele profili terapeutycznych
- Profil należy do jednego użytkownika
- Implementacja: Tablica referencji `profiles` w dokumencie User i pole `user` w dokumencie Profile

### 3.2. Profile - Session

- Relacja jeden-do-wielu (one-to-many)
- Profil może mieć wiele sesji terapeutycznych
- Sesja należy do jednego profilu
- Implementacja: Tablica referencji `sessions` w dokumencie Profile i pole `profile` w dokumencie Session

### 3.3. Profile - Task

- Relacja jeden-do-wielu (one-to-many)
- Profil może mieć wiele zadań terapeutycznych
- Zadanie należy do jednego profilu
- Implementacja: Tablica referencji `tasks` w dokumencie Profile i pole `profile` w dokumencie Task

### 3.4. Session - Task

- Relacja jeden-do-wielu (one-to-many)
- Sesja może mieć wiele zadań terapeutycznych
- Zadanie jest przypisane do jednej sesji
- Implementacja: Tablica referencji `tasks` w dokumencie Session i pole `session` w dokumencie Task

## 4. Strategie zapytań

### 4.1. Pobieranie profili użytkownika

```javascript
db.profiles.find({ user: userId }).sort({ createdAt: -1 })
```

### 4.2. Pobieranie sesji profilu

```javascript
db.sessions.find({ profile: profileId }).sort({ startTime: -1 })
```

### 4.3. Pobieranie zadań profilu

```javascript
db.tasks.find({ profile: profileId }).sort({ deadline: 1 })
```

### 4.4. Pobieranie zadań sesji

```javascript
db.tasks.find({ session: sessionId })
```

### 4.5. Pobieranie aktywnych zadań profilu

```javascript
db.tasks.find({ profile: profileId, status: 'pending' }).sort({ deadline: 1 })
```

### 4.6. Pobieranie ukończonych zadań profilu

```javascript
db.tasks.find({ profile: profileId, status: 'completed' }).sort({ 'completionData.completionDate': -1 })
```

### 4.7. Pobieranie nieukończonych zadań profilu

```javascript
db.tasks.find({ profile: profileId, status: 'incomplete' })
```

### 4.8. Pobieranie zadań z nadchodzącymi przypomnieniami

```javascript
db.tasks.find({
  'reminders.time': { $gte: new Date() },
  'reminders.isSent': false
}).sort({ 'reminders.time': 1 })
```

## 5. Strategie indeksowania

### 5.1. Indeksy dla kolekcji Users

```javascript
db.users.createIndex({ email: 1 }, { unique: true })
```

### 5.2. Indeksy dla kolekcji Profiles

```javascript
db.profiles.createIndex({ user: 1 })
db.profiles.createIndex({ 'therapyProgress.overallStatus': 1 })
```

### 5.3. Indeksy dla kolekcji Sessions

```javascript
db.sessions.createIndex({ profile: 1 })
db.sessions.createIndex({ startTime: -1 })
db.sessions.createIndex({ profile: 1, startTime: -1 })
```

### 5.4. Indeksy dla kolekcji Tasks

```javascript
db.tasks.createIndex({ profile: 1 })
db.tasks.createIndex({ session: 1 })
db.tasks.createIndex({ deadline: 1 })
db.tasks.createIndex({ profile: 1, status: 1 })
db.tasks.createIndex({ profile: 1, status: 1, deadline: 1 })
```

## 6. Strategie migracji schematu

### 6.1. Wersjonowanie schematu

Każdy dokument zawiera pole `schemaVersion`, które określa wersję schematu. Przy aktualizacji schematu, dokumenty są migrowane do nowej wersji.

### 6.2. Migracja danych

Migracja danych jest wykonywana w tle, aby nie blokować działania aplikacji. Proces migracji:

1. Identyfikacja dokumentów do migracji
2. Migracja dokumentów partiami
3. Aktualizacja pola `schemaVersion`

### 6.3. Kompatybilność wsteczna

Aplikacja obsługuje dokumenty w różnych wersjach schematu, zapewniając kompatybilność wsteczną.

## 7. Strategie backupu i odzyskiwania danych

### 7.1. Regularne backupy

- Pełny backup bazy danych raz dziennie
- Inkrementalne backupy co godzinę
- Przechowywanie backupów przez 30 dni

### 7.2. Odzyskiwanie danych

- Odzyskiwanie z pełnego backupu
- Odzyskiwanie z inkrementalnych backupów
- Odzyskiwanie do określonego punktu w czasie (point-in-time recovery)

## 8. Strategie skalowania

### 8.1. Sharding

W przypadku wzrostu ilości danych, baza danych może być podzielona na shardy według następujących kluczy:
- Users: `_id`
- Profiles: `user`
- Sessions: `profile`
- Tasks: `profile`

### 8.2. Indeksowanie

Optymalizacja indeksów w miarę wzrostu ilości danych i zmiany wzorców zapytań.

### 8.3. Archiwizacja

Archiwizacja starych danych, które nie są często używane, do oddzielnej kolekcji lub bazy danych.

## 9. Podsumowanie

Schemat bazy danych aplikacji "Terapeuta" jest zaprojektowany z myślą o:
- Elastyczności i rozszerzalności
- Wydajności zapytań
- Skalowalności
- Integralności danych

Kluczowe aspekty schematu:
- Relacje między kolekcjami
- Strategie indeksowania
- Strategie zapytań
- Strategie migracji schematu
- Strategie backupu i odzyskiwania danych
- Strategie skalowania
