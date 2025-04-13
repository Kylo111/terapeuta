# Dokumentacja API Użytkowników

## 1. Przegląd

Endpointy użytkowników umożliwiają zarządzanie danymi użytkownika i jego ustawieniami.

## 2. Endpointy

### 2.1. Pobieranie danych zalogowanego użytkownika

Pobiera dane zalogowanego użytkownika.

#### Żądanie

```
GET /api/users/me
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
    "user": {
      "id": "60d21b4667d0d8992e610c85",
      "email": "jan.kowalski@example.com",
      "firstName": "Jan",
      "lastName": "Kowalski",
      "profiles": [
        {
          "id": "60d21b4667d0d8992e610c86",
          "name": "Profil główny"
        }
      ],
      "settings": {
        "preferredLLMProvider": "openai",
        "preferredModel": "gpt-4",
        "theme": "system",
        "language": "pl",
        "notifications": {
          "email": true,
          "push": true
        }
      },
      "createdAt": "2025-04-13T14:30:00Z",
      "lastLogin": "2025-04-13T15:45:00Z"
    }
  },
  "message": "Dane użytkownika pobrane"
}
```

#### Kody błędów

| Kod HTTP | Kod błędu | Opis |
|----------|-----------|------|
| 401 | UNAUTHORIZED | Brak autoryzacji |

### 2.2. Aktualizacja danych użytkownika

Aktualizuje dane zalogowanego użytkownika.

#### Żądanie

```
PUT /api/users/me
```

#### Nagłówki

| Nagłówek | Wartość | Wymagany | Opis |
|----------|---------|----------|------|
| Authorization | Bearer {token} | Tak | Token dostępu |

#### Parametry żądania

| Parametr | Typ | Wymagany | Opis |
|----------|-----|----------|------|
| firstName | string | Nie | Imię użytkownika |
| lastName | string | Nie | Nazwisko użytkownika |
| email | string | Nie | Adres email użytkownika |

#### Przykładowe żądanie

```json
{
  "firstName": "Jan",
  "lastName": "Nowak",
  "email": "jan.nowak@example.com"
}
```

#### Odpowiedź

```json
{
  "success": true,
  "data": {
    "user": {
      "id": "60d21b4667d0d8992e610c85",
      "email": "jan.nowak@example.com",
      "firstName": "Jan",
      "lastName": "Nowak",
      "createdAt": "2025-04-13T14:30:00Z",
      "lastLogin": "2025-04-13T15:45:00Z"
    }
  },
  "message": "Dane użytkownika zaktualizowane"
}
```

#### Kody błędów

| Kod HTTP | Kod błędu | Opis |
|----------|-----------|------|
| 400 | INVALID_EMAIL | Nieprawidłowy format adresu email |
| 401 | UNAUTHORIZED | Brak autoryzacji |
| 409 | EMAIL_EXISTS | Użytkownik o podanym adresie email już istnieje |

### 2.3. Aktualizacja ustawień użytkownika

Aktualizuje ustawienia zalogowanego użytkownika.

#### Żądanie

```
PUT /api/users/me/settings
```

#### Nagłówki

| Nagłówek | Wartość | Wymagany | Opis |
|----------|---------|----------|------|
| Authorization | Bearer {token} | Tak | Token dostępu |

#### Parametry żądania

| Parametr | Typ | Wymagany | Opis |
|----------|-----|----------|------|
| preferredLLMProvider | string | Nie | Preferowany dostawca modelu LLM |
| preferredModel | string | Nie | Preferowany model LLM |
| theme | string | Nie | Motyw aplikacji (light, dark, system) |
| language | string | Nie | Język aplikacji (pl, en) |
| notifications | object | Nie | Ustawienia powiadomień |
| notifications.email | boolean | Nie | Powiadomienia email |
| notifications.push | boolean | Nie | Powiadomienia push |

#### Przykładowe żądanie

```json
{
  "preferredLLMProvider": "anthropic",
  "preferredModel": "claude-3-opus",
  "theme": "dark",
  "language": "pl",
  "notifications": {
    "email": true,
    "push": false
  }
}
```

#### Odpowiedź

```json
{
  "success": true,
  "data": {
    "settings": {
      "preferredLLMProvider": "anthropic",
      "preferredModel": "claude-3-opus",
      "theme": "dark",
      "language": "pl",
      "notifications": {
        "email": true,
        "push": false
      }
    }
  },
  "message": "Ustawienia użytkownika zaktualizowane"
}
```

#### Kody błędów

| Kod HTTP | Kod błędu | Opis |
|----------|-----------|------|
| 400 | INVALID_PROVIDER | Nieprawidłowy dostawca modelu LLM |
| 400 | INVALID_MODEL | Nieprawidłowy model LLM |
| 400 | INVALID_THEME | Nieprawidłowy motyw |
| 400 | INVALID_LANGUAGE | Nieprawidłowy język |
| 401 | UNAUTHORIZED | Brak autoryzacji |

### 2.4. Usuwanie konta użytkownika

Usuwa konto zalogowanego użytkownika.

#### Żądanie

```
DELETE /api/users/me
```

#### Nagłówki

| Nagłówek | Wartość | Wymagany | Opis |
|----------|---------|----------|------|
| Authorization | Bearer {token} | Tak | Token dostępu |

#### Parametry żądania

| Parametr | Typ | Wymagany | Opis |
|----------|-----|----------|------|
| password | string | Tak | Hasło użytkownika |

#### Przykładowe żądanie

```json
{
  "password": "silneHaslo123!"
}
```

#### Odpowiedź

```json
{
  "success": true,
  "data": null,
  "message": "Konto użytkownika zostało usunięte"
}
```

#### Kody błędów

| Kod HTTP | Kod błędu | Opis |
|----------|-----------|------|
| 401 | UNAUTHORIZED | Brak autoryzacji |
| 403 | INCORRECT_PASSWORD | Nieprawidłowe hasło |

### 2.5. Pobieranie aktywności użytkownika

Pobiera historię aktywności zalogowanego użytkownika.

#### Żądanie

```
GET /api/users/me/activity
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
| type | string | Nie | Typ aktywności (login, profile_create, session_start, itp.) |

#### Odpowiedź

```json
{
  "success": true,
  "data": {
    "activities": [
      {
        "id": "60d21b4667d0d8992e610c87",
        "type": "login",
        "timestamp": "2025-04-13T15:45:00Z",
        "details": {
          "ip": "192.168.1.1",
          "device": "Chrome on Windows"
        }
      },
      {
        "id": "60d21b4667d0d8992e610c88",
        "type": "profile_create",
        "timestamp": "2025-04-13T15:30:00Z",
        "details": {
          "profileId": "60d21b4667d0d8992e610c86",
          "profileName": "Profil główny"
        }
      }
    ],
    "pagination": {
      "page": 1,
      "limit": 10,
      "total": 2,
      "pages": 1
    }
  },
  "message": "Historia aktywności pobrana"
}
```

#### Kody błędów

| Kod HTTP | Kod błędu | Opis |
|----------|-----------|------|
| 401 | UNAUTHORIZED | Brak autoryzacji |

### 2.6. Pobieranie urządzeń użytkownika

Pobiera listę urządzeń, na których zalogowany jest użytkownik.

#### Żądanie

```
GET /api/users/me/devices
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
    "devices": [
      {
        "id": "60d21b4667d0d8992e610c89",
        "name": "Chrome on Windows",
        "lastActive": "2025-04-13T15:45:00Z",
        "ip": "192.168.1.1",
        "location": "Warszawa, Polska",
        "current": true
      },
      {
        "id": "60d21b4667d0d8992e610c90",
        "name": "Safari on iPhone",
        "lastActive": "2025-04-12T10:30:00Z",
        "ip": "192.168.1.2",
        "location": "Warszawa, Polska",
        "current": false
      }
    ]
  },
  "message": "Lista urządzeń pobrana"
}
```

#### Kody błędów

| Kod HTTP | Kod błędu | Opis |
|----------|-----------|------|
| 401 | UNAUTHORIZED | Brak autoryzacji |

### 2.7. Wylogowanie z urządzenia

Wylogowuje użytkownika z określonego urządzenia.

#### Żądanie

```
DELETE /api/users/me/devices/{deviceId}
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
  "message": "Wylogowano z urządzenia"
}
```

#### Kody błędów

| Kod HTTP | Kod błędu | Opis |
|----------|-----------|------|
| 401 | UNAUTHORIZED | Brak autoryzacji |
| 403 | FORBIDDEN | Próba wylogowania z aktualnego urządzenia |
| 404 | DEVICE_NOT_FOUND | Urządzenie nie zostało znalezione |

## 3. Modele danych

### 3.1. User

```json
{
  "id": "60d21b4667d0d8992e610c85",
  "email": "jan.kowalski@example.com",
  "firstName": "Jan",
  "lastName": "Kowalski",
  "profiles": [
    {
      "id": "60d21b4667d0d8992e610c86",
      "name": "Profil główny"
    }
  ],
  "settings": {
    "preferredLLMProvider": "openai",
    "preferredModel": "gpt-4",
    "theme": "system",
    "language": "pl",
    "notifications": {
      "email": true,
      "push": true
    }
  },
  "createdAt": "2025-04-13T14:30:00Z",
  "lastLogin": "2025-04-13T15:45:00Z",
  "isActive": true
}
```

### 3.2. Activity

```json
{
  "id": "60d21b4667d0d8992e610c87",
  "type": "login",
  "timestamp": "2025-04-13T15:45:00Z",
  "details": {
    "ip": "192.168.1.1",
    "device": "Chrome on Windows"
  }
}
```

### 3.3. Device

```json
{
  "id": "60d21b4667d0d8992e610c89",
  "name": "Chrome on Windows",
  "lastActive": "2025-04-13T15:45:00Z",
  "ip": "192.168.1.1",
  "location": "Warszawa, Polska",
  "current": true
}
```

## 4. Typy aktywności

| Typ | Opis |
|-----|------|
| login | Logowanie do systemu |
| logout | Wylogowanie z systemu |
| password_change | Zmiana hasła |
| password_reset | Resetowanie hasła |
| profile_create | Utworzenie profilu |
| profile_update | Aktualizacja profilu |
| profile_delete | Usunięcie profilu |
| session_start | Rozpoczęcie sesji terapeutycznej |
| session_end | Zakończenie sesji terapeutycznej |
| task_create | Utworzenie zadania |
| task_complete | Ukończenie zadania |
| settings_update | Aktualizacja ustawień |
