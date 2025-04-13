# Dokumentacja API Profili

## 1. Przegląd

Endpointy profili umożliwiają zarządzanie profilami terapeutycznymi użytkownika.

## 2. Endpointy

### 2.1. Pobieranie listy profili

Pobiera listę profili zalogowanego użytkownika.

#### Żądanie

```
GET /api/profiles
```

#### Nagłówki

| Nagłówek | Wartość | Wymagany | Opis |
|----------|---------|----------|------|
| Authorization | Bearer {token} | Tak | Token dostępu |

#### Parametry zapytania

| Parametr | Typ | Wymagany | Opis |
|----------|-----|----------|------|
| isActive | boolean | Nie | Filtrowanie po statusie aktywności |

#### Odpowiedź

```json
{
  "success": true,
  "data": {
    "profiles": [
      {
        "id": "60d21b4667d0d8992e610c86",
        "name": "Profil główny",
        "therapyMethod": "cognitive_behavioral",
        "createdAt": "2025-04-13T15:30:00Z",
        "isActive": true,
        "sessionsCount": 5,
        "lastSessionDate": "2025-04-13T16:45:00Z",
        "emotionalState": {
          "anxiety": 4,
          "depression": 3,
          "optimism": 7,
          "lastUpdated": "2025-04-13T16:45:00Z"
        },
        "therapyProgress": {
          "overallStatus": "progressing"
        }
      },
      {
        "id": "60d21b4667d0d8992e610c87",
        "name": "Profil dodatkowy",
        "therapyMethod": "psychodynamic",
        "createdAt": "2025-04-10T12:00:00Z",
        "isActive": true,
        "sessionsCount": 2,
        "lastSessionDate": "2025-04-11T14:30:00Z",
        "emotionalState": {
          "anxiety": 5,
          "depression": 4,
          "optimism": 6,
          "lastUpdated": "2025-04-11T14:30:00Z"
        },
        "therapyProgress": {
          "overallStatus": "beginning"
        }
      }
    ]
  },
  "message": "Lista profili pobrana"
}
```

#### Kody błędów

| Kod HTTP | Kod błędu | Opis |
|----------|-----------|------|
| 401 | UNAUTHORIZED | Brak autoryzacji |

### 2.2. Tworzenie nowego profilu

Tworzy nowy profil terapeutyczny.

#### Żądanie

```
POST /api/profiles
```

#### Nagłówki

| Nagłówek | Wartość | Wymagany | Opis |
|----------|---------|----------|------|
| Authorization | Bearer {token} | Tak | Token dostępu |

#### Parametry żądania

| Parametr | Typ | Wymagany | Opis |
|----------|-----|----------|------|
| name | string | Tak | Nazwa profilu |
| therapyMethod | string | Tak | Metoda terapii |
| goals | array | Nie | Lista celów terapeutycznych |
| goals[].description | string | Tak | Opis celu |
| goals[].priority | string | Nie | Priorytet celu (low, medium, high) |
| challenges | array | Nie | Lista wyzwań |
| challenges[].description | string | Tak | Opis wyzwania |
| challenges[].severity | string | Nie | Poziom trudności wyzwania (low, medium, high) |

#### Przykładowe żądanie

```json
{
  "name": "Nowy profil",
  "therapyMethod": "cognitive_behavioral",
  "goals": [
    {
      "description": "Redukcja lęku społecznego",
      "priority": "high"
    },
    {
      "description": "Poprawa samooceny",
      "priority": "medium"
    }
  ],
  "challenges": [
    {
      "description": "Trudności w nawiązywaniu relacji",
      "severity": "medium"
    },
    {
      "description": "Nadmierne zamartwianie się",
      "severity": "high"
    }
  ]
}
```

#### Odpowiedź

```json
{
  "success": true,
  "data": {
    "profile": {
      "id": "60d21b4667d0d8992e610c88",
      "name": "Nowy profil",
      "therapyMethod": "cognitive_behavioral",
      "goals": [
        {
          "id": "60d21b4667d0d8992e610c89",
          "description": "Redukcja lęku społecznego",
          "priority": "high",
          "status": "active",
          "createdAt": "2025-04-14T10:00:00Z"
        },
        {
          "id": "60d21b4667d0d8992e610c90",
          "description": "Poprawa samooceny",
          "priority": "medium",
          "status": "active",
          "createdAt": "2025-04-14T10:00:00Z"
        }
      ],
      "challenges": [
        {
          "id": "60d21b4667d0d8992e610c91",
          "description": "Trudności w nawiązywaniu relacji",
          "severity": "medium"
        },
        {
          "id": "60d21b4667d0d8992e610c92",
          "description": "Nadmierne zamartwianie się",
          "severity": "high"
        }
      ],
      "emotionalState": {
        "anxiety": 5,
        "depression": 5,
        "optimism": 5,
        "lastUpdated": "2025-04-14T10:00:00Z"
      },
      "therapyProgress": {
        "overallStatus": "not_started",
        "keyInsights": [],
        "homeworkCompletion": 0
      },
      "createdAt": "2025-04-14T10:00:00Z",
      "isActive": true
    }
  },
  "message": "Profil utworzony"
}
```

#### Kody błędów

| Kod HTTP | Kod błędu | Opis |
|----------|-----------|------|
| 400 | INVALID_THERAPY_METHOD | Nieprawidłowa metoda terapii |
| 400 | INVALID_PRIORITY | Nieprawidłowy priorytet celu |
| 400 | INVALID_SEVERITY | Nieprawidłowy poziom trudności wyzwania |
| 401 | UNAUTHORIZED | Brak autoryzacji |

### 2.3. Pobieranie szczegółów profilu

Pobiera szczegółowe informacje o profilu.

#### Żądanie

```
GET /api/profiles/{profileId}
```

#### Nagłówki

| Nagłówek | Wartość | Wymagany | Opis |
|----------|---------|----------|------|
| Authorization | Bearer {token} | Tak | Token dostępu |

#### Odpowiedź

```json
{
  "success": true,
  "data": {
    "profile": {
      "id": "60d21b4667d0d8992e610c86",
      "name": "Profil główny",
      "therapyMethod": "cognitive_behavioral",
      "goals": [
        {
          "id": "60d21b4667d0d8992e610c93",
          "description": "Redukcja lęku społecznego",
          "priority": "high",
          "status": "active",
          "createdAt": "2025-04-13T15:30:00Z"
        },
        {
          "id": "60d21b4667d0d8992e610c94",
          "description": "Poprawa samooceny",
          "priority": "medium",
          "status": "active",
          "createdAt": "2025-04-13T15:30:00Z"
        }
      ],
      "challenges": [
        {
          "id": "60d21b4667d0d8992e610c95",
          "description": "Trudności w nawiązywaniu relacji",
          "severity": "medium"
        },
        {
          "id": "60d21b4667d0d8992e610c96",
          "description": "Nadmierne zamartwianie się",
          "severity": "high"
        }
      ],
      "sessions": [
        {
          "id": "60d21b4667d0d8992e610c97",
          "startTime": "2025-04-13T16:00:00Z",
          "endTime": "2025-04-13T16:45:00Z",
          "isCompleted": true
        },
        {
          "id": "60d21b4667d0d8992e610c98",
          "startTime": "2025-04-12T15:00:00Z",
          "endTime": "2025-04-12T15:45:00Z",
          "isCompleted": true
        }
      ],
      "tasks": [
        {
          "id": "60d21b4667d0d8992e610c99",
          "description": "Prowadzenie dziennika myśli",
          "status": "completed",
          "deadline": "2025-04-14T23:59:59Z"
        },
        {
          "id": "60d21b4667d0d8992e610c100",
          "description": "Ćwiczenie ekspozycji na sytuacje społeczne",
          "status": "pending",
          "deadline": "2025-04-16T23:59:59Z"
        }
      ],
      "emotionalState": {
        "anxiety": 4,
        "depression": 3,
        "optimism": 7,
        "lastUpdated": "2025-04-13T16:45:00Z"
      },
      "therapyProgress": {
        "overallStatus": "progressing",
        "keyInsights": [
          "Lęk społeczny jest związany z negatywnymi przekonaniami na temat oceny przez innych",
          "Unikanie sytuacji społecznych wzmacnia lęk"
        ],
        "homeworkCompletion": 0.75
      },
      "createdAt": "2025-04-13T15:30:00Z",
      "isActive": true
    }
  },
  "message": "Szczegóły profilu pobrane"
}
```

#### Kody błędów

| Kod HTTP | Kod błędu | Opis |
|----------|-----------|------|
| 401 | UNAUTHORIZED | Brak autoryzacji |
| 403 | FORBIDDEN | Brak dostępu do profilu |
| 404 | PROFILE_NOT_FOUND | Profil nie został znaleziony |

### 2.4. Aktualizacja profilu

Aktualizuje dane profilu.

#### Żądanie

```
PUT /api/profiles/{profileId}
```

#### Nagłówki

| Nagłówek | Wartość | Wymagany | Opis |
|----------|---------|----------|------|
| Authorization | Bearer {token} | Tak | Token dostępu |

#### Parametry żądania

| Parametr | Typ | Wymagany | Opis |
|----------|-----|----------|------|
| name | string | Nie | Nazwa profilu |
| therapyMethod | string | Nie | Metoda terapii |
| isActive | boolean | Nie | Status aktywności profilu |

#### Przykładowe żądanie

```json
{
  "name": "Profil główny - zaktualizowany",
  "therapyMethod": "humanistic",
  "isActive": true
}
```

#### Odpowiedź

```json
{
  "success": true,
  "data": {
    "profile": {
      "id": "60d21b4667d0d8992e610c86",
      "name": "Profil główny - zaktualizowany",
      "therapyMethod": "humanistic",
      "isActive": true
    }
  },
  "message": "Profil zaktualizowany"
}
```

#### Kody błędów

| Kod HTTP | Kod błędu | Opis |
|----------|-----------|------|
| 400 | INVALID_THERAPY_METHOD | Nieprawidłowa metoda terapii |
| 401 | UNAUTHORIZED | Brak autoryzacji |
| 403 | FORBIDDEN | Brak dostępu do profilu |
| 404 | PROFILE_NOT_FOUND | Profil nie został znaleziony |

### 2.5. Usuwanie profilu

Usuwa profil.

#### Żądanie

```
DELETE /api/profiles/{profileId}
```

#### Nagłówki

| Nagłówek | Wartość | Wymagany | Opis |
|----------|---------|----------|------|
| Authorization | Bearer {token} | Tak | Token dostępu |

#### Odpowiedź

```json
{
  "success": true,
  "data": null,
  "message": "Profil usunięty"
}
```

#### Kody błędów

| Kod HTTP | Kod błędu | Opis |
|----------|-----------|------|
| 401 | UNAUTHORIZED | Brak autoryzacji |
| 403 | FORBIDDEN | Brak dostępu do profilu |
| 404 | PROFILE_NOT_FOUND | Profil nie został znaleziony |

### 2.6. Aktualizacja stanu emocjonalnego

Aktualizuje stan emocjonalny profilu.

#### Żądanie

```
PUT /api/profiles/{profileId}/emotional-state
```

#### Nagłówki

| Nagłówek | Wartość | Wymagany | Opis |
|----------|---------|----------|------|
| Authorization | Bearer {token} | Tak | Token dostępu |

#### Parametry żądania

| Parametr | Typ | Wymagany | Opis |
|----------|-----|----------|------|
| anxiety | number | Tak | Poziom lęku (0-10) |
| depression | number | Tak | Poziom depresji (0-10) |
| optimism | number | Tak | Poziom optymizmu (0-10) |

#### Przykładowe żądanie

```json
{
  "anxiety": 3,
  "depression": 2,
  "optimism": 8
}
```

#### Odpowiedź

```json
{
  "success": true,
  "data": {
    "emotionalState": {
      "anxiety": 3,
      "depression": 2,
      "optimism": 8,
      "lastUpdated": "2025-04-14T11:30:00Z"
    }
  },
  "message": "Stan emocjonalny zaktualizowany"
}
```

#### Kody błędów

| Kod HTTP | Kod błędu | Opis |
|----------|-----------|------|
| 400 | INVALID_EMOTIONAL_STATE | Nieprawidłowy stan emocjonalny |
| 401 | UNAUTHORIZED | Brak autoryzacji |
| 403 | FORBIDDEN | Brak dostępu do profilu |
| 404 | PROFILE_NOT_FOUND | Profil nie został znaleziony |

### 2.7. Dodawanie celu

Dodaje nowy cel terapeutyczny do profilu.

#### Żądanie

```
POST /api/profiles/{profileId}/goals
```

#### Nagłówki

| Nagłówek | Wartość | Wymagany | Opis |
|----------|---------|----------|------|
| Authorization | Bearer {token} | Tak | Token dostępu |

#### Parametry żądania

| Parametr | Typ | Wymagany | Opis |
|----------|-----|----------|------|
| description | string | Tak | Opis celu |
| priority | string | Nie | Priorytet celu (low, medium, high) |

#### Przykładowe żądanie

```json
{
  "description": "Rozwijanie umiejętności asertywności",
  "priority": "high"
}
```

#### Odpowiedź

```json
{
  "success": true,
  "data": {
    "goal": {
      "id": "60d21b4667d0d8992e610c101",
      "description": "Rozwijanie umiejętności asertywności",
      "priority": "high",
      "status": "active",
      "createdAt": "2025-04-14T11:45:00Z"
    }
  },
  "message": "Cel dodany"
}
```

#### Kody błędów

| Kod HTTP | Kod błędu | Opis |
|----------|-----------|------|
| 400 | INVALID_PRIORITY | Nieprawidłowy priorytet celu |
| 401 | UNAUTHORIZED | Brak autoryzacji |
| 403 | FORBIDDEN | Brak dostępu do profilu |
| 404 | PROFILE_NOT_FOUND | Profil nie został znaleziony |

### 2.8. Aktualizacja celu

Aktualizuje cel terapeutyczny.

#### Żądanie

```
PUT /api/profiles/{profileId}/goals/{goalId}
```

#### Nagłówki

| Nagłówek | Wartość | Wymagany | Opis |
|----------|---------|----------|------|
| Authorization | Bearer {token} | Tak | Token dostępu |

#### Parametry żądania

| Parametr | Typ | Wymagany | Opis |
|----------|-----|----------|------|
| description | string | Nie | Opis celu |
| priority | string | Nie | Priorytet celu (low, medium, high) |
| status | string | Nie | Status celu (active, completed, abandoned) |

#### Przykładowe żądanie

```json
{
  "description": "Rozwijanie umiejętności asertywności w pracy",
  "priority": "medium",
  "status": "active"
}
```

#### Odpowiedź

```json
{
  "success": true,
  "data": {
    "goal": {
      "id": "60d21b4667d0d8992e610c101",
      "description": "Rozwijanie umiejętności asertywności w pracy",
      "priority": "medium",
      "status": "active",
      "createdAt": "2025-04-14T11:45:00Z"
    }
  },
  "message": "Cel zaktualizowany"
}
```

#### Kody błędów

| Kod HTTP | Kod błędu | Opis |
|----------|-----------|------|
| 400 | INVALID_PRIORITY | Nieprawidłowy priorytet celu |
| 400 | INVALID_STATUS | Nieprawidłowy status celu |
| 401 | UNAUTHORIZED | Brak autoryzacji |
| 403 | FORBIDDEN | Brak dostępu do profilu |
| 404 | PROFILE_NOT_FOUND | Profil nie został znaleziony |
| 404 | GOAL_NOT_FOUND | Cel nie został znaleziony |

### 2.9. Usuwanie celu

Usuwa cel terapeutyczny.

#### Żądanie

```
DELETE /api/profiles/{profileId}/goals/{goalId}
```

#### Nagłówki

| Nagłówek | Wartość | Wymagany | Opis |
|----------|---------|----------|------|
| Authorization | Bearer {token} | Tak | Token dostępu |

#### Odpowiedź

```json
{
  "success": true,
  "data": null,
  "message": "Cel usunięty"
}
```

#### Kody błędów

| Kod HTTP | Kod błędu | Opis |
|----------|-----------|------|
| 401 | UNAUTHORIZED | Brak autoryzacji |
| 403 | FORBIDDEN | Brak dostępu do profilu |
| 404 | PROFILE_NOT_FOUND | Profil nie został znaleziony |
| 404 | GOAL_NOT_FOUND | Cel nie został znaleziony |

### 2.10. Dodawanie wyzwania

Dodaje nowe wyzwanie do profilu.

#### Żądanie

```
POST /api/profiles/{profileId}/challenges
```

#### Nagłówki

| Nagłówek | Wartość | Wymagany | Opis |
|----------|---------|----------|------|
| Authorization | Bearer {token} | Tak | Token dostępu |

#### Parametry żądania

| Parametr | Typ | Wymagany | Opis |
|----------|-----|----------|------|
| description | string | Tak | Opis wyzwania |
| severity | string | Nie | Poziom trudności wyzwania (low, medium, high) |

#### Przykładowe żądanie

```json
{
  "description": "Trudności z koncentracją",
  "severity": "medium"
}
```

#### Odpowiedź

```json
{
  "success": true,
  "data": {
    "challenge": {
      "id": "60d21b4667d0d8992e610c102",
      "description": "Trudności z koncentracją",
      "severity": "medium"
    }
  },
  "message": "Wyzwanie dodane"
}
```

#### Kody błędów

| Kod HTTP | Kod błędu | Opis |
|----------|-----------|------|
| 400 | INVALID_SEVERITY | Nieprawidłowy poziom trudności wyzwania |
| 401 | UNAUTHORIZED | Brak autoryzacji |
| 403 | FORBIDDEN | Brak dostępu do profilu |
| 404 | PROFILE_NOT_FOUND | Profil nie został znaleziony |

### 2.11. Aktualizacja postępu terapii

Aktualizuje postęp terapii profilu.

#### Żądanie

```
PUT /api/profiles/{profileId}/therapy-progress
```

#### Nagłówki

| Nagłówek | Wartość | Wymagany | Opis |
|----------|---------|----------|------|
| Authorization | Bearer {token} | Tak | Token dostępu |

#### Parametry żądania

| Parametr | Typ | Wymagany | Opis |
|----------|-----|----------|------|
| overallStatus | string | Nie | Ogólny status terapii |
| keyInsights | array | Nie | Lista kluczowych spostrzeżeń |
| homeworkCompletion | number | Nie | Wskaźnik wykonania zadań (0-1) |

#### Przykładowe żądanie

```json
{
  "overallStatus": "improving",
  "keyInsights": [
    "Lęk społeczny jest związany z negatywnymi przekonaniami na temat oceny przez innych",
    "Unikanie sytuacji społecznych wzmacnia lęk",
    "Techniki relaksacyjne pomagają w redukcji lęku"
  ],
  "homeworkCompletion": 0.8
}
```

#### Odpowiedź

```json
{
  "success": true,
  "data": {
    "therapyProgress": {
      "overallStatus": "improving",
      "keyInsights": [
        "Lęk społeczny jest związany z negatywnymi przekonaniami na temat oceny przez innych",
        "Unikanie sytuacji społecznych wzmacnia lęk",
        "Techniki relaksacyjne pomagają w redukcji lęku"
      ],
      "homeworkCompletion": 0.8
    }
  },
  "message": "Postęp terapii zaktualizowany"
}
```

#### Kody błędów

| Kod HTTP | Kod błędu | Opis |
|----------|-----------|------|
| 400 | INVALID_STATUS | Nieprawidłowy status terapii |
| 400 | INVALID_COMPLETION_RATE | Nieprawidłowy wskaźnik wykonania zadań |
| 401 | UNAUTHORIZED | Brak autoryzacji |
| 403 | FORBIDDEN | Brak dostępu do profilu |
| 404 | PROFILE_NOT_FOUND | Profil nie został znaleziony |

## 3. Modele danych

### 3.1. Profile

```json
{
  "id": "60d21b4667d0d8992e610c86",
  "name": "Profil główny",
  "therapyMethod": "cognitive_behavioral",
  "goals": [
    {
      "id": "60d21b4667d0d8992e610c93",
      "description": "Redukcja lęku społecznego",
      "priority": "high",
      "status": "active",
      "createdAt": "2025-04-13T15:30:00Z",
      "completedAt": null
    }
  ],
  "challenges": [
    {
      "id": "60d21b4667d0d8992e610c95",
      "description": "Trudności w nawiązywaniu relacji",
      "severity": "medium"
    }
  ],
  "sessions": [
    {
      "id": "60d21b4667d0d8992e610c97",
      "startTime": "2025-04-13T16:00:00Z",
      "endTime": "2025-04-13T16:45:00Z",
      "isCompleted": true
    }
  ],
  "tasks": [
    {
      "id": "60d21b4667d0d8992e610c99",
      "description": "Prowadzenie dziennika myśli",
      "status": "completed",
      "deadline": "2025-04-14T23:59:59Z"
    }
  ],
  "emotionalState": {
    "anxiety": 4,
    "depression": 3,
    "optimism": 7,
    "lastUpdated": "2025-04-13T16:45:00Z"
  },
  "therapyProgress": {
    "overallStatus": "progressing",
    "keyInsights": [
      "Lęk społeczny jest związany z negatywnymi przekonaniami na temat oceny przez innych"
    ],
    "homeworkCompletion": 0.75
  },
  "createdAt": "2025-04-13T15:30:00Z",
  "isActive": true
}
```

### 3.2. Goal

```json
{
  "id": "60d21b4667d0d8992e610c93",
  "description": "Redukcja lęku społecznego",
  "priority": "high",
  "status": "active",
  "createdAt": "2025-04-13T15:30:00Z",
  "completedAt": null
}
```

### 3.3. Challenge

```json
{
  "id": "60d21b4667d0d8992e610c95",
  "description": "Trudności w nawiązywaniu relacji",
  "severity": "medium"
}
```

### 3.4. EmotionalState

```json
{
  "anxiety": 4,
  "depression": 3,
  "optimism": 7,
  "lastUpdated": "2025-04-13T16:45:00Z"
}
```

### 3.5. TherapyProgress

```json
{
  "overallStatus": "progressing",
  "keyInsights": [
    "Lęk społeczny jest związany z negatywnymi przekonaniami na temat oceny przez innych"
  ],
  "homeworkCompletion": 0.75
}
```

## 4. Enumeracje

### 4.1. TherapyMethod

| Wartość | Opis |
|---------|------|
| cognitive_behavioral | Terapia poznawczo-behawioralna |
| psychodynamic | Terapia psychodynamiczna |
| humanistic | Terapia humanistyczno-egzystencjalna |
| systemic | Terapia systemowa |
| solution_focused | Terapia krótkoterminowa skoncentrowana na rozwiązaniach |

### 4.2. Priority

| Wartość | Opis |
|---------|------|
| low | Niski priorytet |
| medium | Średni priorytet |
| high | Wysoki priorytet |

### 4.3. Severity

| Wartość | Opis |
|---------|------|
| low | Niski poziom trudności |
| medium | Średni poziom trudności |
| high | Wysoki poziom trudności |

### 4.4. GoalStatus

| Wartość | Opis |
|---------|------|
| active | Cel aktywny |
| completed | Cel ukończony |
| abandoned | Cel porzucony |

### 4.5. TherapyStatus

| Wartość | Opis |
|---------|------|
| not_started | Terapia nie rozpoczęta |
| beginning | Początek terapii |
| progressing | Terapia w trakcie |
| improving | Widoczna poprawa |
| maintaining | Utrzymywanie efektów |
| completed | Terapia zakończona |
