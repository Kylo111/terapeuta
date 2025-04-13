# Dokumentacja API Autentykacji

## 1. Przegląd

Endpointy autentykacji umożliwiają rejestrację, logowanie, wylogowanie i zarządzanie tokenami użytkowników.

## 2. Endpointy

### 2.1. Rejestracja użytkownika

Tworzy nowego użytkownika w systemie.

#### Żądanie

```
POST /api/auth/register
```

#### Parametry żądania

| Parametr | Typ | Wymagany | Opis |
|----------|-----|----------|------|
| email | string | Tak | Adres email użytkownika |
| password | string | Tak | Hasło użytkownika (min. 8 znaków) |
| firstName | string | Nie | Imię użytkownika |
| lastName | string | Nie | Nazwisko użytkownika |

#### Przykładowe żądanie

```json
{
  "email": "jan.kowalski@example.com",
  "password": "silneHaslo123!",
  "firstName": "Jan",
  "lastName": "Kowalski"
}
```

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
      "createdAt": "2025-04-13T14:30:00Z"
    },
    "tokens": {
      "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
      "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
      "expiresIn": 900
    }
  },
  "message": "Rejestracja zakończona sukcesem"
}
```

#### Kody błędów

| Kod HTTP | Kod błędu | Opis |
|----------|-----------|------|
| 400 | INVALID_EMAIL | Nieprawidłowy format adresu email |
| 400 | INVALID_PASSWORD | Hasło nie spełnia wymagań bezpieczeństwa |
| 409 | EMAIL_EXISTS | Użytkownik o podanym adresie email już istnieje |

### 2.2. Logowanie użytkownika

Loguje użytkownika do systemu i zwraca tokeny dostępu.

#### Żądanie

```
POST /api/auth/login
```

#### Parametry żądania

| Parametr | Typ | Wymagany | Opis |
|----------|-----|----------|------|
| email | string | Tak | Adres email użytkownika |
| password | string | Tak | Hasło użytkownika |

#### Przykładowe żądanie

```json
{
  "email": "jan.kowalski@example.com",
  "password": "silneHaslo123!"
}
```

#### Odpowiedź

```json
{
  "success": true,
  "data": {
    "user": {
      "id": "60d21b4667d0d8992e610c85",
      "email": "jan.kowalski@example.com",
      "firstName": "Jan",
      "lastName": "Kowalski"
    },
    "tokens": {
      "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
      "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
      "expiresIn": 900
    }
  },
  "message": "Logowanie zakończone sukcesem"
}
```

#### Kody błędów

| Kod HTTP | Kod błędu | Opis |
|----------|-----------|------|
| 400 | INVALID_CREDENTIALS | Nieprawidłowy adres email lub hasło |
| 403 | ACCOUNT_DISABLED | Konto użytkownika jest nieaktywne |

### 2.3. Wylogowanie użytkownika

Wylogowuje użytkownika z systemu i unieważnia tokeny.

#### Żądanie

```
POST /api/auth/logout
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
  "message": "Wylogowanie zakończone sukcesem"
}
```

#### Kody błędów

| Kod HTTP | Kod błędu | Opis |
|----------|-----------|------|
| 401 | UNAUTHORIZED | Brak autoryzacji |

### 2.4. Odświeżanie tokenu

Odświeża token dostępu przy użyciu tokenu odświeżania.

#### Żądanie

```
POST /api/auth/refresh-token
```

#### Parametry żądania

| Parametr | Typ | Wymagany | Opis |
|----------|-----|----------|------|
| refreshToken | string | Tak | Token odświeżania |

#### Przykładowe żądanie

```json
{
  "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

#### Odpowiedź

```json
{
  "success": true,
  "data": {
    "tokens": {
      "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
      "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
      "expiresIn": 900
    }
  },
  "message": "Token odświeżony"
}
```

#### Kody błędów

| Kod HTTP | Kod błędu | Opis |
|----------|-----------|------|
| 400 | INVALID_TOKEN | Nieprawidłowy token odświeżania |
| 401 | TOKEN_EXPIRED | Token odświeżania wygasł |

### 2.5. Resetowanie hasła - żądanie

Wysyła link do resetowania hasła na adres email użytkownika.

#### Żądanie

```
POST /api/auth/reset-password/request
```

#### Parametry żądania

| Parametr | Typ | Wymagany | Opis |
|----------|-----|----------|------|
| email | string | Tak | Adres email użytkownika |

#### Przykładowe żądanie

```json
{
  "email": "jan.kowalski@example.com"
}
```

#### Odpowiedź

```json
{
  "success": true,
  "data": null,
  "message": "Link do resetowania hasła został wysłany na podany adres email"
}
```

#### Kody błędów

| Kod HTTP | Kod błędu | Opis |
|----------|-----------|------|
| 400 | INVALID_EMAIL | Nieprawidłowy format adresu email |
| 404 | USER_NOT_FOUND | Użytkownik o podanym adresie email nie istnieje |

### 2.6. Resetowanie hasła - potwierdzenie

Resetuje hasło użytkownika przy użyciu tokenu z linku.

#### Żądanie

```
POST /api/auth/reset-password/confirm
```

#### Parametry żądania

| Parametr | Typ | Wymagany | Opis |
|----------|-----|----------|------|
| token | string | Tak | Token resetowania hasła |
| password | string | Tak | Nowe hasło użytkownika (min. 8 znaków) |

#### Przykładowe żądanie

```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "password": "noweHaslo456!"
}
```

#### Odpowiedź

```json
{
  "success": true,
  "data": null,
  "message": "Hasło zostało zresetowane"
}
```

#### Kody błędów

| Kod HTTP | Kod błędu | Opis |
|----------|-----------|------|
| 400 | INVALID_TOKEN | Nieprawidłowy token resetowania hasła |
| 400 | INVALID_PASSWORD | Hasło nie spełnia wymagań bezpieczeństwa |
| 401 | TOKEN_EXPIRED | Token resetowania hasła wygasł |

### 2.7. Zmiana hasła

Zmienia hasło zalogowanego użytkownika.

#### Żądanie

```
POST /api/auth/change-password
```

#### Nagłówki

| Nagłówek | Wartość | Wymagany | Opis |
|----------|---------|----------|------|
| Authorization | Bearer {token} | Tak | Token dostępu |

#### Parametry żądania

| Parametr | Typ | Wymagany | Opis |
|----------|-----|----------|------|
| currentPassword | string | Tak | Aktualne hasło użytkownika |
| newPassword | string | Tak | Nowe hasło użytkownika (min. 8 znaków) |

#### Przykładowe żądanie

```json
{
  "currentPassword": "silneHaslo123!",
  "newPassword": "noweHaslo456!"
}
```

#### Odpowiedź

```json
{
  "success": true,
  "data": null,
  "message": "Hasło zostało zmienione"
}
```

#### Kody błędów

| Kod HTTP | Kod błędu | Opis |
|----------|-----------|------|
| 400 | INVALID_PASSWORD | Hasło nie spełnia wymagań bezpieczeństwa |
| 401 | UNAUTHORIZED | Brak autoryzacji |
| 403 | INCORRECT_PASSWORD | Nieprawidłowe aktualne hasło |

## 3. Modele danych

### 3.1. User

```json
{
  "id": "60d21b4667d0d8992e610c85",
  "email": "jan.kowalski@example.com",
  "firstName": "Jan",
  "lastName": "Kowalski",
  "createdAt": "2025-04-13T14:30:00Z",
  "lastLogin": "2025-04-13T15:45:00Z",
  "isActive": true
}
```

### 3.2. Tokens

```json
{
  "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "expiresIn": 900
}
```

## 4. Bezpieczeństwo

### 4.1. Wymagania dotyczące hasła

- Minimum 8 znaków
- Przynajmniej jedna wielka litera
- Przynajmniej jedna mała litera
- Przynajmniej jedna cyfra
- Przynajmniej jeden znak specjalny

### 4.2. Tokeny JWT

- Token dostępu (access token) - ważny przez 15 minut
- Token odświeżania (refresh token) - ważny przez 7 dni
- Tokeny są podpisane algorytmem HS256

### 4.3. Limity szybkości (Rate Limiting)

- Rejestracja: 10 żądań na godzinę z jednego adresu IP
- Logowanie: 5 żądań na minutę z jednego adresu IP
- Resetowanie hasła: 3 żądania na godzinę dla jednego adresu email
