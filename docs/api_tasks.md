# Dokumentacja API Zadań

## 1. Przegląd

Endpointy zadań umożliwiają zarządzanie zadaniami terapeutycznymi, w tym tworzenie nowych zadań, aktualizację statusu i dodawanie przypomnień.

## 2. Endpointy

### 2.1. Pobieranie listy zadań profilu

Pobiera listę zadań dla określonego profilu.

#### Żądanie

```
GET /api/profiles/{profileId}/tasks
```

#### Nagłówki

| Nagłówek | Wartość | Wymagany | Opis |
|----------|---------|----------|------|
| Authorization | Bearer {token} | Tak | Token dostępu |

#### Parametry zapytania

| Parametr | Typ | Wymagany | Opis |
|----------|-----|----------|------|
| page | number | Nie | Numer strony (domyślnie: 1) |
| limit | number | Nie | Liczba wyników na stronie (domyślnie: 10) |
| status | string | Nie | Filtrowanie po statusie (pending, completed, incomplete) |
| category | string | Nie | Filtrowanie po kategorii |
| priority | string | Nie | Filtrowanie po priorytecie (low, medium, high) |
| startDate | string | Nie | Data początkowa (format: YYYY-MM-DD) |
| endDate | string | Nie | Data końcowa (format: YYYY-MM-DD) |

#### Odpowiedź

```json
{
  "success": true,
  "data": {
    "tasks": [
      {
        "id": "60d21b4667d0d8992e610c104",
        "description": "Przygotowanie krótkiej prezentacji i ćwiczenie jej przed lustrem",
        "category": "cwiczenie_behawioralne",
        "createdAt": "2025-04-13T16:45:00Z",
        "deadline": "2025-04-20T23:59:59Z",
        "priority": "high",
        "status": "pending",
        "session": {
          "id": "60d21b4667d0d8992e610c97",
          "startTime": "2025-04-13T16:00:00Z"
        }
      },
      {
        "id": "60d21b4667d0d8992e610c105",
        "description": "Prowadzenie dziennika myśli automatycznych",
        "category": "technika_terapeutyczna",
        "createdAt": "2025-04-12T15:45:00Z",
        "deadline": "2025-04-19T23:59:59Z",
        "priority": "medium",
        "status": "completed",
        "completionData": {
          "completionDate": "2025-04-18T20:30:00Z",
          "successRating": 8
        },
        "session": {
          "id": "60d21b4667d0d8992e610c98",
          "startTime": "2025-04-12T15:00:00Z"
        }
      }
    ],
    "pagination": {
      "page": 1,
      "limit": 10,
      "total": 5,
      "pages": 1
    }
  },
  "message": "Lista zadań pobrana"
}
```

#### Kody błędów

| Kod HTTP | Kod błędu | Opis |
|----------|-----------|------|
| 400 | INVALID_STATUS | Nieprawidłowy status |
| 400 | INVALID_CATEGORY | Nieprawidłowa kategoria |
| 400 | INVALID_PRIORITY | Nieprawidłowy priorytet |
| 401 | UNAUTHORIZED | Brak autoryzacji |
| 403 | FORBIDDEN | Brak dostępu do profilu |
| 404 | PROFILE_NOT_FOUND | Profil nie został znaleziony |

### 2.2. Tworzenie nowego zadania

Tworzy nowe zadanie terapeutyczne dla określonego profilu.

#### Żądanie

```
POST /api/profiles/{profileId}/tasks
```

#### Nagłówki

| Nagłówek | Wartość | Wymagany | Opis |
|----------|---------|----------|------|
| Authorization | Bearer {token} | Tak | Token dostępu |

#### Parametry żądania

| Parametr | Typ | Wymagany | Opis |
|----------|-----|----------|------|
| description | string | Tak | Opis zadania |
| category | string | Nie | Kategoria zadania |
| deadline | string | Tak | Termin wykonania (format: ISO 8601) |
| priority | string | Nie | Priorytet zadania (low, medium, high) |
| sessionId | string | Nie | ID sesji, z którą zadanie jest powiązane |
| reminders | array | Nie | Lista przypomnień |
| reminders[].time | string | Tak | Czas przypomnienia (format: ISO 8601) |
| reminders[].message | string | Tak | Treść przypomnienia |

#### Przykładowe żądanie

```json
{
  "description": "Ćwiczenie technik relaksacyjnych przez 10 minut dziennie",
  "category": "technika_terapeutyczna",
  "deadline": "2025-04-21T23:59:59Z",
  "priority": "medium",
  "sessionId": "60d21b4667d0d8992e610c97",
  "reminders": [
    {
      "time": "2025-04-15T20:00:00Z",
      "message": "Pamiętaj o ćwiczeniu technik relaksacyjnych"
    },
    {
      "time": "2025-04-18T20:00:00Z",
      "message": "Zostały 3 dni do terminu wykonania zadania"
    }
  ]
}
```

#### Odpowiedź

```json
{
  "success": true,
  "data": {
    "task": {
      "id": "60d21b4667d0d8992e610c106",
      "profile": "60d21b4667d0d8992e610c86",
      "session": "60d21b4667d0d8992e610c97",
      "description": "Ćwiczenie technik relaksacyjnych przez 10 minut dziennie",
      "category": "technika_terapeutyczna",
      "createdAt": "2025-04-14T13:00:00Z",
      "deadline": "2025-04-21T23:59:59Z",
      "priority": "medium",
      "status": "pending",
      "reminders": [
        {
          "id": "60d21b4667d0d8992e610c107",
          "time": "2025-04-15T20:00:00Z",
          "message": "Pamiętaj o ćwiczeniu technik relaksacyjnych",
          "isSent": false
        },
        {
          "id": "60d21b4667d0d8992e610c108",
          "time": "2025-04-18T20:00:00Z",
          "message": "Zostały 3 dni do terminu wykonania zadania",
          "isSent": false
        }
      ]
    }
  },
  "message": "Zadanie utworzone"
}
```

#### Kody błędów

| Kod HTTP | Kod błędu | Opis |
|----------|-----------|------|
| 400 | INVALID_CATEGORY | Nieprawidłowa kategoria |
| 400 | INVALID_PRIORITY | Nieprawidłowy priorytet |
| 400 | INVALID_DEADLINE | Nieprawidłowy termin wykonania |
| 401 | UNAUTHORIZED | Brak autoryzacji |
| 403 | FORBIDDEN | Brak dostępu do profilu |
| 404 | PROFILE_NOT_FOUND | Profil nie został znaleziony |
| 404 | SESSION_NOT_FOUND | Sesja nie została znaleziona |

### 2.3. Pobieranie szczegółów zadania

Pobiera szczegółowe informacje o zadaniu.

#### Żądanie

```
GET /api/tasks/{taskId}
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
    "task": {
      "id": "60d21b4667d0d8992e610c104",
      "profile": "60d21b4667d0d8992e610c86",
      "session": "60d21b4667d0d8992e610c97",
      "description": "Przygotowanie krótkiej prezentacji i ćwiczenie jej przed lustrem",
      "category": "cwiczenie_behawioralne",
      "createdAt": "2025-04-13T16:45:00Z",
      "deadline": "2025-04-20T23:59:59Z",
      "priority": "high",
      "status": "pending",
      "completionData": null,
      "discussedInSession": null,
      "reminders": [
        {
          "id": "60d21b4667d0d8992e610c109",
          "time": "2025-04-16T20:00:00Z",
          "message": "Pamiętaj o przygotowaniu prezentacji",
          "isSent": true
        },
        {
          "id": "60d21b4667d0d8992e610c110",
          "time": "2025-04-19T20:00:00Z",
          "message": "Zostało 1 dzień do terminu wykonania zadania",
          "isSent": false
        }
      ]
    }
  },
  "message": "Szczegóły zadania pobrane"
}
```

#### Kody błędów

| Kod HTTP | Kod błędu | Opis |
|----------|-----------|------|
| 401 | UNAUTHORIZED | Brak autoryzacji |
| 403 | FORBIDDEN | Brak dostępu do zadania |
| 404 | TASK_NOT_FOUND | Zadanie nie zostało znalezione |

### 2.4. Aktualizacja zadania

Aktualizuje dane zadania.

#### Żądanie

```
PUT /api/tasks/{taskId}
```

#### Nagłówki

| Nagłówek | Wartość | Wymagany | Opis |
|----------|---------|----------|------|
| Authorization | Bearer {token} | Tak | Token dostępu |

#### Parametry żądania

| Parametr | Typ | Wymagany | Opis |
|----------|-----|----------|------|
| description | string | Nie | Opis zadania |
| category | string | Nie | Kategoria zadania |
| deadline | string | Nie | Termin wykonania (format: ISO 8601) |
| priority | string | Nie | Priorytet zadania (low, medium, high) |

#### Przykładowe żądanie

```json
{
  "description": "Przygotowanie krótkiej prezentacji (3-5 minut) i ćwiczenie jej przed lustrem",
  "priority": "medium",
  "deadline": "2025-04-22T23:59:59Z"
}
```

#### Odpowiedź

```json
{
  "success": true,
  "data": {
    "task": {
      "id": "60d21b4667d0d8992e610c104",
      "description": "Przygotowanie krótkiej prezentacji (3-5 minut) i ćwiczenie jej przed lustrem",
      "priority": "medium",
      "deadline": "2025-04-22T23:59:59Z"
    }
  },
  "message": "Zadanie zaktualizowane"
}
```

#### Kody błędów

| Kod HTTP | Kod błędu | Opis |
|----------|-----------|------|
| 400 | INVALID_CATEGORY | Nieprawidłowa kategoria |
| 400 | INVALID_PRIORITY | Nieprawidłowy priorytet |
| 400 | INVALID_DEADLINE | Nieprawidłowy termin wykonania |
| 401 | UNAUTHORIZED | Brak autoryzacji |
| 403 | FORBIDDEN | Brak dostępu do zadania |
| 404 | TASK_NOT_FOUND | Zadanie nie zostało znalezione |

### 2.5. Oznaczanie zadania jako ukończonego

Oznacza zadanie jako ukończone.

#### Żądanie

```
PUT /api/tasks/{taskId}/complete
```

#### Nagłówki

| Nagłówek | Wartość | Wymagany | Opis |
|----------|---------|----------|------|
| Authorization | Bearer {token} | Tak | Token dostępu |

#### Parametry żądania

| Parametr | Typ | Wymagany | Opis |
|----------|-----|----------|------|
| successRating | number | Nie | Ocena sukcesu (1-10) |
| challenges | string | Nie | Napotkane wyzwania |
| reflections | string | Nie | Refleksje |
| emotionalResponse | string | Nie | Reakcja emocjonalna |

#### Przykładowe żądanie

```json
{
  "successRating": 8,
  "challenges": "Trudno było mi znaleźć czas na codzienne ćwiczenia",
  "reflections": "Zauważyłem, że po ćwiczeniach czuję się spokojniejszy",
  "emotionalResponse": "Początkowo czułem niepokój, ale z czasem ćwiczenia stały się przyjemne"
}
```

#### Odpowiedź

```json
{
  "success": true,
  "data": {
    "task": {
      "id": "60d21b4667d0d8992e610c104",
      "status": "completed",
      "completionData": {
        "completionDate": "2025-04-14T14:00:00Z",
        "successRating": 8,
        "challenges": "Trudno było mi znaleźć czas na codzienne ćwiczenia",
        "reflections": "Zauważyłem, że po ćwiczeniach czuję się spokojniejszy",
        "emotionalResponse": "Początkowo czułem niepokój, ale z czasem ćwiczenia stały się przyjemne"
      }
    }
  },
  "message": "Zadanie oznaczone jako ukończone"
}
```

#### Kody błędów

| Kod HTTP | Kod błędu | Opis |
|----------|-----------|------|
| 400 | INVALID_RATING | Nieprawidłowa ocena sukcesu |
| 401 | UNAUTHORIZED | Brak autoryzacji |
| 403 | FORBIDDEN | Brak dostępu do zadania |
| 404 | TASK_NOT_FOUND | Zadanie nie zostało znalezione |
| 409 | TASK_ALREADY_COMPLETED | Zadanie jest już ukończone |

### 2.6. Oznaczanie zadania jako nieukończonego

Oznacza zadanie jako nieukończone.

#### Żądanie

```
PUT /api/tasks/{taskId}/incomplete
```

#### Nagłówki

| Nagłówek | Wartość | Wymagany | Opis |
|----------|---------|----------|------|
| Authorization | Bearer {token} | Tak | Token dostępu |

#### Parametry żądania

| Parametr | Typ | Wymagany | Opis |
|----------|-----|----------|------|
| reason | string | Nie | Powód nieukończenia zadania |

#### Przykładowe żądanie

```json
{
  "reason": "Nie miałem wystarczająco czasu na wykonanie zadania"
}
```

#### Odpowiedź

```json
{
  "success": true,
  "data": {
    "task": {
      "id": "60d21b4667d0d8992e610c104",
      "status": "incomplete",
      "completionData": {
        "completionDate": "2025-04-14T14:30:00Z",
        "reason": "Nie miałem wystarczająco czasu na wykonanie zadania"
      }
    }
  },
  "message": "Zadanie oznaczone jako nieukończone"
}
```

#### Kody błędów

| Kod HTTP | Kod błędu | Opis |
|----------|-----------|------|
| 401 | UNAUTHORIZED | Brak autoryzacji |
| 403 | FORBIDDEN | Brak dostępu do zadania |
| 404 | TASK_NOT_FOUND | Zadanie nie zostało znalezione |
| 409 | TASK_ALREADY_INCOMPLETE | Zadanie jest już oznaczone jako nieukończone |

### 2.7. Dodawanie przypomnienia

Dodaje nowe przypomnienie do zadania.

#### Żądanie

```
POST /api/tasks/{taskId}/reminders
```

#### Nagłówki

| Nagłówek | Wartość | Wymagany | Opis |
|----------|---------|----------|------|
| Authorization | Bearer {token} | Tak | Token dostępu |

#### Parametry żądania

| Parametr | Typ | Wymagany | Opis |
|----------|-----|----------|------|
| time | string | Tak | Czas przypomnienia (format: ISO 8601) |
| message | string | Tak | Treść przypomnienia |

#### Przykładowe żądanie

```json
{
  "time": "2025-04-17T20:00:00Z",
  "message": "Pamiętaj o wykonaniu zadania"
}
```

#### Odpowiedź

```json
{
  "success": true,
  "data": {
    "reminder": {
      "id": "60d21b4667d0d8992e610c111",
      "time": "2025-04-17T20:00:00Z",
      "message": "Pamiętaj o wykonaniu zadania",
      "isSent": false
    }
  },
  "message": "Przypomnienie dodane"
}
```

#### Kody błędów

| Kod HTTP | Kod błędu | Opis |
|----------|-----------|------|
| 400 | INVALID_TIME | Nieprawidłowy czas przypomnienia |
| 400 | EMPTY_MESSAGE | Pusta treść przypomnienia |
| 401 | UNAUTHORIZED | Brak autoryzacji |
| 403 | FORBIDDEN | Brak dostępu do zadania |
| 404 | TASK_NOT_FOUND | Zadanie nie zostało znalezione |

### 2.8. Usuwanie przypomnienia

Usuwa przypomnienie z zadania.

#### Żądanie

```
DELETE /api/tasks/{taskId}/reminders/{reminderId}
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
  "message": "Przypomnienie usunięte"
}
```

#### Kody błędów

| Kod HTTP | Kod błędu | Opis |
|----------|-----------|------|
| 401 | UNAUTHORIZED | Brak autoryzacji |
| 403 | FORBIDDEN | Brak dostępu do zadania |
| 404 | TASK_NOT_FOUND | Zadanie nie zostało znalezione |
| 404 | REMINDER_NOT_FOUND | Przypomnienie nie zostało znalezione |

### 2.9. Aktualizacja statusu omówienia zadania

Aktualizuje status omówienia zadania w sesji.

#### Żądanie

```
PUT /api/tasks/{taskId}/discussion
```

#### Nagłówki

| Nagłówek | Wartość | Wymagany | Opis |
|----------|---------|----------|------|
| Authorization | Bearer {token} | Tak | Token dostępu |

#### Parametry żądania

| Parametr | Typ | Wymagany | Opis |
|----------|-----|----------|------|
| sessionId | string | Tak | ID sesji, w której omówiono zadanie |
| outcome | string | Nie | Wynik omówienia |

#### Przykładowe żądanie

```json
{
  "sessionId": "60d21b4667d0d8992e610c112",
  "outcome": "Klient wykonał zadanie częściowo, ale zauważył pozytywne efekty"
}
```

#### Odpowiedź

```json
{
  "success": true,
  "data": {
    "task": {
      "id": "60d21b4667d0d8992e610c104",
      "discussedInSession": {
        "sessionId": "60d21b4667d0d8992e610c112",
        "date": "2025-04-14T15:30:00Z",
        "outcome": "Klient wykonał zadanie częściowo, ale zauważył pozytywne efekty"
      }
    }
  },
  "message": "Status omówienia zadania zaktualizowany"
}
```

#### Kody błędów

| Kod HTTP | Kod błędu | Opis |
|----------|-----------|------|
| 401 | UNAUTHORIZED | Brak autoryzacji |
| 403 | FORBIDDEN | Brak dostępu do zadania |
| 404 | TASK_NOT_FOUND | Zadanie nie zostało znalezione |
| 404 | SESSION_NOT_FOUND | Sesja nie została znaleziona |

### 2.10. Usuwanie zadania

Usuwa zadanie.

#### Żądanie

```
DELETE /api/tasks/{taskId}
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
  "message": "Zadanie usunięte"
}
```

#### Kody błędów

| Kod HTTP | Kod błędu | Opis |
|----------|-----------|------|
| 401 | UNAUTHORIZED | Brak autoryzacji |
| 403 | FORBIDDEN | Brak dostępu do zadania |
| 404 | TASK_NOT_FOUND | Zadanie nie zostało znalezione |

## 3. Modele danych

### 3.1. Task

```json
{
  "id": "60d21b4667d0d8992e610c104",
  "profile": "60d21b4667d0d8992e610c86",
  "session": "60d21b4667d0d8992e610c97",
  "description": "Przygotowanie krótkiej prezentacji i ćwiczenie jej przed lustrem",
  "category": "cwiczenie_behawioralne",
  "createdAt": "2025-04-13T16:45:00Z",
  "deadline": "2025-04-20T23:59:59Z",
  "priority": "high",
  "status": "pending",
  "completionData": {
    "completionDate": "2025-04-18T20:30:00Z",
    "successRating": 8,
    "challenges": "Trudno było mi znaleźć czas na codzienne ćwiczenia",
    "reflections": "Zauważyłem, że po ćwiczeniach czuję się spokojniejszy",
    "emotionalResponse": "Początkowo czułem niepokój, ale z czasem ćwiczenia stały się przyjemne"
  },
  "discussedInSession": {
    "sessionId": "60d21b4667d0d8992e610c112",
    "date": "2025-04-14T15:30:00Z",
    "outcome": "Klient wykonał zadanie częściowo, ale zauważył pozytywne efekty"
  },
  "reminders": [
    {
      "id": "60d21b4667d0d8992e610c109",
      "time": "2025-04-16T20:00:00Z",
      "message": "Pamiętaj o przygotowaniu prezentacji",
      "isSent": true
    },
    {
      "id": "60d21b4667d0d8992e610c110",
      "time": "2025-04-19T20:00:00Z",
      "message": "Zostało 1 dzień do terminu wykonania zadania",
      "isSent": false
    }
  ]
}
```

### 3.2. CompletionData

```json
{
  "completionDate": "2025-04-18T20:30:00Z",
  "successRating": 8,
  "challenges": "Trudno było mi znaleźć czas na codzienne ćwiczenia",
  "reflections": "Zauważyłem, że po ćwiczeniach czuję się spokojniejszy",
  "emotionalResponse": "Początkowo czułem niepokój, ale z czasem ćwiczenia stały się przyjemne"
}
```

### 3.3. DiscussedInSession

```json
{
  "sessionId": "60d21b4667d0d8992e610c112",
  "date": "2025-04-14T15:30:00Z",
  "outcome": "Klient wykonał zadanie częściowo, ale zauważył pozytywne efekty"
}
```

### 3.4. Reminder

```json
{
  "id": "60d21b4667d0d8992e610c109",
  "time": "2025-04-16T20:00:00Z",
  "message": "Pamiętaj o przygotowaniu prezentacji",
  "isSent": true
}
```

## 4. Enumeracje

### 4.1. TaskStatus

| Wartość | Opis |
|---------|------|
| pending | Zadanie oczekujące |
| completed | Zadanie ukończone |
| incomplete | Zadanie nieukończone |

### 4.2. TaskCategory

| Wartość | Opis |
|---------|------|
| technika_terapeutyczna | Technika terapeutyczna |
| refleksja | Refleksja |
| cwiczenie_behawioralne | Ćwiczenie behawioralne |
| dziennik | Dziennik |
| inne | Inne |

### 4.3. Priority

| Wartość | Opis |
|---------|------|
| low | Niski priorytet |
| medium | Średni priorytet |
| high | Wysoki priorytet |
