# Dokumentacja API Sesji

## 1. Przegląd

Endpointy sesji umożliwiają zarządzanie sesjami terapeutycznymi, w tym tworzenie nowych sesji, dodawanie wiadomości i kończenie sesji.

## 2. Endpointy

### 2.1. Pobieranie listy sesji profilu

Pobiera listę sesji dla określonego profilu.

#### Żądanie

```
GET /api/profiles/{profileId}/sessions
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
| isCompleted | boolean | Nie | Filtrowanie po statusie zakończenia |
| startDate | string | Nie | Data początkowa (format: YYYY-MM-DD) |
| endDate | string | Nie | Data końcowa (format: YYYY-MM-DD) |

#### Odpowiedź

```json
{
  "success": true,
  "data": {
    "sessions": [
      {
        "id": "60d21b4667d0d8992e610c97",
        "startTime": "2025-04-13T16:00:00Z",
        "endTime": "2025-04-13T16:45:00Z",
        "therapyMethod": "cognitive_behavioral",
        "sessionNumber": 5,
        "isCompleted": true,
        "summary": {
          "mainTopics": ["Lęk społeczny", "Techniki ekspozycji"],
          "keyInsights": "Zidentyfikowano główne wyzwalacze lęku społecznego"
        }
      },
      {
        "id": "60d21b4667d0d8992e610c98",
        "startTime": "2025-04-12T15:00:00Z",
        "endTime": "2025-04-12T15:45:00Z",
        "therapyMethod": "cognitive_behavioral",
        "sessionNumber": 4,
        "isCompleted": true,
        "summary": {
          "mainTopics": ["Zniekształcenia poznawcze", "Restrukturyzacja poznawcza"],
          "keyInsights": "Zidentyfikowano główne zniekształcenia poznawcze"
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
  "message": "Lista sesji pobrana"
}
```

#### Kody błędów

| Kod HTTP | Kod błędu | Opis |
|----------|-----------|------|
| 401 | UNAUTHORIZED | Brak autoryzacji |
| 403 | FORBIDDEN | Brak dostępu do profilu |
| 404 | PROFILE_NOT_FOUND | Profil nie został znaleziony |

### 2.2. Tworzenie nowej sesji

Tworzy nową sesję terapeutyczną dla określonego profilu.

#### Żądanie

```
POST /api/profiles/{profileId}/sessions
```

#### Nagłówki

| Nagłówek | Wartość | Wymagany | Opis |
|----------|---------|----------|------|
| Authorization | Bearer {token} | Tak | Token dostępu |

#### Parametry żądania

| Parametr | Typ | Wymagany | Opis |
|----------|-----|----------|------|
| therapyMethod | string | Nie | Metoda terapii (domyślnie: metoda z profilu) |

#### Przykładowe żądanie

```json
{
  "therapyMethod": "cognitive_behavioral"
}
```

#### Odpowiedź

```json
{
  "success": true,
  "data": {
    "session": {
      "id": "60d21b4667d0d8992e610c103",
      "profile": "60d21b4667d0d8992e610c86",
      "startTime": "2025-04-14T12:00:00Z",
      "therapyMethod": "cognitive_behavioral",
      "sessionNumber": 6,
      "continuityStatus": "new",
      "conversation": [
        {
          "role": "system",
          "content": "Jesteś terapeutą prowadzącym sesję terapii poznawczo-behawioralnej...",
          "timestamp": "2025-04-14T12:00:00Z"
        },
        {
          "role": "assistant",
          "content": "Witaj! Jak się dziś czujesz? Co chciałbyś/chciałabyś omówić podczas dzisiejszej sesji?",
          "timestamp": "2025-04-14T12:00:05Z"
        }
      ],
      "isCompleted": false
    }
  },
  "message": "Sesja utworzona"
}
```

#### Kody błędów

| Kod HTTP | Kod błędu | Opis |
|----------|-----------|------|
| 400 | INVALID_THERAPY_METHOD | Nieprawidłowa metoda terapii |
| 401 | UNAUTHORIZED | Brak autoryzacji |
| 403 | FORBIDDEN | Brak dostępu do profilu |
| 404 | PROFILE_NOT_FOUND | Profil nie został znaleziony |

### 2.3. Pobieranie szczegółów sesji

Pobiera szczegółowe informacje o sesji.

#### Żądanie

```
GET /api/sessions/{sessionId}
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
    "session": {
      "id": "60d21b4667d0d8992e610c97",
      "profile": "60d21b4667d0d8992e610c86",
      "startTime": "2025-04-13T16:00:00Z",
      "endTime": "2025-04-13T16:45:00Z",
      "therapyMethod": "cognitive_behavioral",
      "sessionNumber": 5,
      "continuityStatus": "new",
      "conversation": [
        {
          "role": "system",
          "content": "Jesteś terapeutą prowadzącym sesję terapii poznawczo-behawioralnej...",
          "timestamp": "2025-04-13T16:00:00Z"
        },
        {
          "role": "assistant",
          "content": "Witaj! Jak się dziś czujesz? Co chciałbyś/chciałabyś omówić podczas dzisiejszej sesji?",
          "timestamp": "2025-04-13T16:00:05Z"
        },
        {
          "role": "user",
          "content": "Czuję się lepiej niż ostatnio. Chciałbym porozmawiać o moim lęku przed wystąpieniami publicznymi.",
          "timestamp": "2025-04-13T16:00:30Z"
        },
        {
          "role": "assistant",
          "content": "Cieszę się, że czujesz się lepiej. Porozmawiajmy o Twoim lęku przed wystąpieniami publicznymi. Czy możesz mi powiedzieć więcej o sytuacjach, które wywołują ten lęk?",
          "timestamp": "2025-04-13T16:01:00Z"
        }
      ],
      "summary": {
        "mainTopics": ["Lęk przed wystąpieniami publicznymi", "Techniki ekspozycji"],
        "keyInsights": "Zidentyfikowano główne wyzwalacze lęku przed wystąpieniami publicznymi",
        "progress": "Klient wykazuje większą świadomość swoich wzorców myślenia",
        "homework": "Przygotowanie krótkiej prezentacji i ćwiczenie jej przed lustrem"
      },
      "metrics": {
        "emotionalStateStart": {
          "anxiety": 6,
          "depression": 4,
          "optimism": 5
        },
        "emotionalStateEnd": {
          "anxiety": 4,
          "depression": 3,
          "optimism": 7
        },
        "sessionEffectivenessRating": 8
      },
      "tasks": [
        {
          "id": "60d21b4667d0d8992e610c104",
          "description": "Przygotowanie krótkiej prezentacji i ćwiczenie jej przed lustrem",
          "status": "pending",
          "deadline": "2025-04-20T23:59:59Z"
        }
      ],
      "isCompleted": true
    }
  },
  "message": "Szczegóły sesji pobrane"
}
```

#### Kody błędów

| Kod HTTP | Kod błędu | Opis |
|----------|-----------|------|
| 401 | UNAUTHORIZED | Brak autoryzacji |
| 403 | FORBIDDEN | Brak dostępu do sesji |
| 404 | SESSION_NOT_FOUND | Sesja nie została znaleziona |

### 2.4. Dodawanie wiadomości do sesji

Dodaje nową wiadomość do sesji.

#### Żądanie

```
POST /api/sessions/{sessionId}/messages
```

#### Nagłówki

| Nagłówek | Wartość | Wymagany | Opis |
|----------|---------|----------|------|
| Authorization | Bearer {token} | Tak | Token dostępu |

#### Parametry żądania

| Parametr | Typ | Wymagany | Opis |
|----------|-----|----------|------|
| content | string | Tak | Treść wiadomości |

#### Przykładowe żądanie

```json
{
  "content": "Najbardziej boję się, że zapomnę, co chciałem powiedzieć, i wszyscy będą się ze mnie śmiać."
}
```

#### Odpowiedź

```json
{
  "success": true,
  "data": {
    "message": {
      "role": "user",
      "content": "Najbardziej boję się, że zapomnę, co chciałem powiedzieć, i wszyscy będą się ze mnie śmiać.",
      "timestamp": "2025-04-14T12:05:00Z"
    },
    "response": {
      "role": "assistant",
      "content": "Rozumiem Twoje obawy. To bardzo powszechny lęk związany z wystąpieniami publicznymi. Zastanówmy się, co jest najgorszym scenariuszem, który może się wydarzyć, jeśli zapomnisz, co chciałeś powiedzieć? Jak prawdopodobne jest, że wszyscy będą się z Ciebie śmiać?",
      "timestamp": "2025-04-14T12:05:10Z"
    }
  },
  "message": "Wiadomość dodana"
}
```

#### Kody błędów

| Kod HTTP | Kod błędu | Opis |
|----------|-----------|------|
| 400 | EMPTY_MESSAGE | Pusta wiadomość |
| 401 | UNAUTHORIZED | Brak autoryzacji |
| 403 | FORBIDDEN | Brak dostępu do sesji |
| 404 | SESSION_NOT_FOUND | Sesja nie została znaleziona |
| 409 | SESSION_COMPLETED | Sesja jest już zakończona |

### 2.5. Kończenie sesji

Kończy sesję terapeutyczną.

#### Żądanie

```
PUT /api/sessions/{sessionId}/end
```

#### Nagłówki

| Nagłówek | Wartość | Wymagany | Opis |
|----------|---------|----------|------|
| Authorization | Bearer {token} | Tak | Token dostępu |

#### Parametry żądania

| Parametr | Typ | Wymagany | Opis |
|----------|-----|----------|------|
| emotionalState | object | Nie | Stan emocjonalny na końcu sesji |
| emotionalState.anxiety | number | Tak | Poziom lęku (0-10) |
| emotionalState.depression | number | Tak | Poziom depresji (0-10) |
| emotionalState.optimism | number | Tak | Poziom optymizmu (0-10) |
| effectivenessRating | number | Nie | Ocena skuteczności sesji (1-10) |

#### Przykładowe żądanie

```json
{
  "emotionalState": {
    "anxiety": 3,
    "depression": 2,
    "optimism": 8
  },
  "effectivenessRating": 9
}
```

#### Odpowiedź

```json
{
  "success": true,
  "data": {
    "session": {
      "id": "60d21b4667d0d8992e610c103",
      "endTime": "2025-04-14T12:45:00Z",
      "isCompleted": true,
      "summary": {
        "mainTopics": ["Lęk przed wystąpieniami publicznymi", "Zniekształcenia poznawcze"],
        "keyInsights": "Zidentyfikowano katastrofizację jako główne zniekształcenie poznawcze",
        "progress": "Klient zaczyna kwestionować swoje negatywne myśli automatyczne",
        "homework": "Przygotowanie krótkiej prezentacji i ćwiczenie jej przed lustrem"
      },
      "metrics": {
        "emotionalStateStart": {
          "anxiety": 6,
          "depression": 4,
          "optimism": 5
        },
        "emotionalStateEnd": {
          "anxiety": 3,
          "depression": 2,
          "optimism": 8
        },
        "sessionEffectivenessRating": 9
      }
    }
  },
  "message": "Sesja zakończona"
}
```

#### Kody błędów

| Kod HTTP | Kod błędu | Opis |
|----------|-----------|------|
| 400 | INVALID_EMOTIONAL_STATE | Nieprawidłowy stan emocjonalny |
| 400 | INVALID_RATING | Nieprawidłowa ocena skuteczności |
| 401 | UNAUTHORIZED | Brak autoryzacji |
| 403 | FORBIDDEN | Brak dostępu do sesji |
| 404 | SESSION_NOT_FOUND | Sesja nie została znaleziona |
| 409 | SESSION_COMPLETED | Sesja jest już zakończona |

### 2.6. Pobieranie podsumowania sesji

Pobiera podsumowanie sesji.

#### Żądanie

```
GET /api/sessions/{sessionId}/summary
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
    "summary": {
      "mainTopics": ["Lęk przed wystąpieniami publicznymi", "Zniekształcenia poznawcze"],
      "keyInsights": "Zidentyfikowano katastrofizację jako główne zniekształcenie poznawcze",
      "progress": "Klient zaczyna kwestionować swoje negatywne myśli automatyczne",
      "homework": "Przygotowanie krótkiej prezentacji i ćwiczenie jej przed lustrem"
    },
    "metrics": {
      "emotionalStateStart": {
        "anxiety": 6,
        "depression": 4,
        "optimism": 5
      },
      "emotionalStateEnd": {
        "anxiety": 3,
        "depression": 2,
        "optimism": 8
      },
      "sessionEffectivenessRating": 9
    },
    "duration": 45,
    "messageCount": 12
  },
  "message": "Podsumowanie sesji pobrane"
}
```

#### Kody błędów

| Kod HTTP | Kod błędu | Opis |
|----------|-----------|------|
| 401 | UNAUTHORIZED | Brak autoryzacji |
| 403 | FORBIDDEN | Brak dostępu do sesji |
| 404 | SESSION_NOT_FOUND | Sesja nie została znaleziona |
| 404 | SUMMARY_NOT_FOUND | Podsumowanie nie zostało znalezione (sesja nie jest zakończona) |

### 2.7. Eksport sesji

Eksportuje sesję do pliku JSON lub PDF.

#### Żądanie

```
GET /api/sessions/{sessionId}/export
```

#### Nagłówki

| Nagłówek | Wartość | Wymagany | Opis |
|----------|---------|----------|------|
| Authorization | Bearer {token} | Tak | Token dostępu |

#### Parametry zapytania

| Parametr | Typ | Wymagany | Opis |
|----------|-----|----------|------|
| format | string | Nie | Format eksportu (json, pdf, markdown) (domyślnie: json) |

#### Odpowiedź

W przypadku formatu JSON, odpowiedź zawiera dane sesji:

```json
{
  "success": true,
  "data": {
    "session": {
      "id": "60d21b4667d0d8992e610c97",
      "profile": "60d21b4667d0d8992e610c86",
      "startTime": "2025-04-13T16:00:00Z",
      "endTime": "2025-04-13T16:45:00Z",
      "therapyMethod": "cognitive_behavioral",
      "sessionNumber": 5,
      "continuityStatus": "new",
      "conversation": [
        {
          "role": "system",
          "content": "Jesteś terapeutą prowadzącym sesję terapii poznawczo-behawioralnej...",
          "timestamp": "2025-04-13T16:00:00Z"
        },
        {
          "role": "assistant",
          "content": "Witaj! Jak się dziś czujesz? Co chciałbyś/chciałabyś omówić podczas dzisiejszej sesji?",
          "timestamp": "2025-04-13T16:00:05Z"
        },
        {
          "role": "user",
          "content": "Czuję się lepiej niż ostatnio. Chciałbym porozmawiać o moim lęku przed wystąpieniami publicznymi.",
          "timestamp": "2025-04-13T16:00:30Z"
        }
      ],
      "summary": {
        "mainTopics": ["Lęk przed wystąpieniami publicznymi", "Techniki ekspozycji"],
        "keyInsights": "Zidentyfikowano główne wyzwalacze lęku przed wystąpieniami publicznymi",
        "progress": "Klient wykazuje większą świadomość swoich wzorców myślenia",
        "homework": "Przygotowanie krótkiej prezentacji i ćwiczenie jej przed lustrem"
      },
      "metrics": {
        "emotionalStateStart": {
          "anxiety": 6,
          "depression": 4,
          "optimism": 5
        },
        "emotionalStateEnd": {
          "anxiety": 4,
          "depression": 3,
          "optimism": 7
        },
        "sessionEffectivenessRating": 8
      },
      "isCompleted": true
    }
  },
  "message": "Sesja wyeksportowana"
}
```

W przypadku formatu PDF lub Markdown, odpowiedź zawiera URL do pobrania pliku:

```json
{
  "success": true,
  "data": {
    "url": "https://api.terapeuta.app/downloads/sessions/60d21b4667d0d8992e610c97.pdf",
    "expiresAt": "2025-04-14T13:00:00Z"
  },
  "message": "Sesja wyeksportowana"
}
```

#### Kody błędów

| Kod HTTP | Kod błędu | Opis |
|----------|-----------|------|
| 400 | INVALID_FORMAT | Nieprawidłowy format eksportu |
| 401 | UNAUTHORIZED | Brak autoryzacji |
| 403 | FORBIDDEN | Brak dostępu do sesji |
| 404 | SESSION_NOT_FOUND | Sesja nie została znaleziona |

### 2.8. Generowanie odpowiedzi LLM

Generuje odpowiedź od modelu LLM bez zapisywania jej w sesji.

#### Żądanie

```
POST /api/sessions/{sessionId}/generate
```

#### Nagłówki

| Nagłówek | Wartość | Wymagany | Opis |
|----------|---------|----------|------|
| Authorization | Bearer {token} | Tak | Token dostępu |

#### Parametry żądania

| Parametr | Typ | Wymagany | Opis |
|----------|-----|----------|------|
| content | string | Tak | Treść wiadomości |
| provider | string | Nie | Dostawca modelu LLM (domyślnie: preferowany dostawca użytkownika) |
| model | string | Nie | Model LLM (domyślnie: preferowany model użytkownika) |

#### Przykładowe żądanie

```json
{
  "content": "Najbardziej boję się, że zapomnę, co chciałem powiedzieć, i wszyscy będą się ze mnie śmiać.",
  "provider": "anthropic",
  "model": "claude-3-opus"
}
```

#### Odpowiedź

```json
{
  "success": true,
  "data": {
    "response": {
      "content": "Rozumiem Twoje obawy. To bardzo powszechny lęk związany z wystąpieniami publicznymi. Zastanówmy się, co jest najgorszym scenariuszem, który może się wydarzyć, jeśli zapomnisz, co chciałeś powiedzieć? Jak prawdopodobne jest, że wszyscy będą się z Ciebie śmiać?",
      "provider": "anthropic",
      "model": "claude-3-opus"
    }
  },
  "message": "Odpowiedź wygenerowana"
}
```

#### Kody błędów

| Kod HTTP | Kod błędu | Opis |
|----------|-----------|------|
| 400 | EMPTY_MESSAGE | Pusta wiadomość |
| 400 | INVALID_PROVIDER | Nieprawidłowy dostawca modelu LLM |
| 400 | INVALID_MODEL | Nieprawidłowy model LLM |
| 401 | UNAUTHORIZED | Brak autoryzacji |
| 403 | FORBIDDEN | Brak dostępu do sesji |
| 404 | SESSION_NOT_FOUND | Sesja nie została znaleziona |
| 409 | SESSION_COMPLETED | Sesja jest już zakończona |

## 3. Modele danych

### 3.1. Session

```json
{
  "id": "60d21b4667d0d8992e610c97",
  "profile": "60d21b4667d0d8992e610c86",
  "startTime": "2025-04-13T16:00:00Z",
  "endTime": "2025-04-13T16:45:00Z",
  "therapyMethod": "cognitive_behavioral",
  "sessionNumber": 5,
  "continuityStatus": "new",
  "conversation": [
    {
      "role": "system",
      "content": "Jesteś terapeutą prowadzącym sesję terapii poznawczo-behawioralnej...",
      "timestamp": "2025-04-13T16:00:00Z"
    },
    {
      "role": "assistant",
      "content": "Witaj! Jak się dziś czujesz? Co chciałbyś/chciałabyś omówić podczas dzisiejszej sesji?",
      "timestamp": "2025-04-13T16:00:05Z"
    },
    {
      "role": "user",
      "content": "Czuję się lepiej niż ostatnio. Chciałbym porozmawiać o moim lęku przed wystąpieniami publicznymi.",
      "timestamp": "2025-04-13T16:00:30Z"
    }
  ],
  "summary": {
    "mainTopics": ["Lęk przed wystąpieniami publicznymi", "Techniki ekspozycji"],
    "keyInsights": "Zidentyfikowano główne wyzwalacze lęku przed wystąpieniami publicznymi",
    "progress": "Klient wykazuje większą świadomość swoich wzorców myślenia",
    "homework": "Przygotowanie krótkiej prezentacji i ćwiczenie jej przed lustrem"
  },
  "metrics": {
    "emotionalStateStart": {
      "anxiety": 6,
      "depression": 4,
      "optimism": 5
    },
    "emotionalStateEnd": {
      "anxiety": 4,
      "depression": 3,
      "optimism": 7
    },
    "sessionEffectivenessRating": 8
  },
  "tasks": [
    "60d21b4667d0d8992e610c104"
  ],
  "isCompleted": true
}
```

### 3.2. Message

```json
{
  "role": "user",
  "content": "Czuję się lepiej niż ostatnio. Chciałbym porozmawiać o moim lęku przed wystąpieniami publicznymi.",
  "timestamp": "2025-04-13T16:00:30Z"
}
```

### 3.3. Summary

```json
{
  "mainTopics": ["Lęk przed wystąpieniami publicznymi", "Techniki ekspozycji"],
  "keyInsights": "Zidentyfikowano główne wyzwalacze lęku przed wystąpieniami publicznymi",
  "progress": "Klient wykazuje większą świadomość swoich wzorców myślenia",
  "homework": "Przygotowanie krótkiej prezentacji i ćwiczenie jej przed lustrem"
}
```

### 3.4. Metrics

```json
{
  "emotionalStateStart": {
    "anxiety": 6,
    "depression": 4,
    "optimism": 5
  },
  "emotionalStateEnd": {
    "anxiety": 4,
    "depression": 3,
    "optimism": 7
  },
  "sessionEffectivenessRating": 8
}
```

## 4. Enumeracje

### 4.1. ContinuityStatus

| Wartość | Opis |
|---------|------|
| new | Nowa sesja |
| continued | Kontynuacja sesji (< 24 godziny od poprzedniej) |
| resumed_after_break | Wznowienie po przerwie (> 7 dni od poprzedniej) |

### 4.2. MessageRole

| Wartość | Opis |
|---------|------|
| system | Wiadomość systemowa |
| assistant | Wiadomość asystenta (terapeuta) |
| user | Wiadomość użytkownika (klient) |

### 4.3. ExportFormat

| Wartość | Opis |
|---------|------|
| json | Format JSON |
| pdf | Format PDF |
| markdown | Format Markdown |
