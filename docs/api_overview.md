# Przegląd API Aplikacji "Terapeuta"

## 1. Wprowadzenie

API aplikacji "Terapeuta" jest zbudowane w oparciu o architekturę RESTful, która umożliwia komunikację między frontendem a backendem. API jest dostępne przez protokół HTTPS i zwraca dane w formacie JSON.

## 2. Podstawowe informacje

### 2.1. Adres bazowy

```
https://api.terapeuta.app/v1
```

### 2.2. Format odpowiedzi

Wszystkie odpowiedzi API mają spójną strukturę:

```json
{
  "success": true,
  "data": {
    // Dane odpowiedzi
  },
  "message": "Operacja zakończona sukcesem"
}
```

W przypadku błędu:

```json
{
  "success": false,
  "error": {
    "code": "ERROR_CODE",
    "message": "Opis błędu"
  }
}
```

### 2.3. Kody błędów

| Kod HTTP | Opis |
|----------|------|
| 200 | OK - Żądanie zakończone sukcesem |
| 201 | Created - Zasób został utworzony |
| 400 | Bad Request - Nieprawidłowe żądanie |
| 401 | Unauthorized - Brak autoryzacji |
| 403 | Forbidden - Brak uprawnień |
| 404 | Not Found - Zasób nie został znaleziony |
| 422 | Unprocessable Entity - Nieprawidłowe dane |
| 429 | Too Many Requests - Zbyt wiele żądań |
| 500 | Internal Server Error - Błąd serwera |

### 2.4. Autentykacja

API wykorzystuje autentykację opartą na tokenach JWT:
- Token dostępu (access token) - krótki czas życia (15 minut)
- Token odświeżania (refresh token) - dłuższy czas życia (7 dni)

Tokeny są przesyłane w nagłówku Authorization:

```
Authorization: Bearer <token>
```

### 2.5. Paginacja

Endpointy zwracające listy zasobów obsługują paginację:

```
GET /api/resources?page=1&limit=10
```

Odpowiedź zawiera informacje o paginacji:

```json
{
  "success": true,
  "data": {
    "items": [...],
    "pagination": {
      "page": 1,
      "limit": 10,
      "total": 100,
      "pages": 10
    }
  },
  "message": "Operacja zakończona sukcesem"
}
```

### 2.6. Filtrowanie

Endpointy obsługują filtrowanie zasobów:

```
GET /api/resources?filter[field]=value
```

### 2.7. Sortowanie

Endpointy obsługują sortowanie zasobów:

```
GET /api/resources?sort=field&order=asc
```

## 3. Grupy endpointów

API aplikacji "Terapeuta" jest podzielone na następujące grupy endpointów:

### 3.1. Autentykacja

Endpointy związane z rejestracją, logowaniem i zarządzaniem tokenami.

[Szczegółowa dokumentacja endpointów autentykacji](api_auth.md)

### 3.2. Użytkownicy

Endpointy związane z zarządzaniem użytkownikami i ich ustawieniami.

[Szczegółowa dokumentacja endpointów użytkowników](api_users.md)

### 3.3. Profile

Endpointy związane z zarządzaniem profilami terapeutycznymi.

[Szczegółowa dokumentacja endpointów profili](api_profiles.md)

### 3.4. Sesje

Endpointy związane z zarządzaniem sesjami terapeutycznymi.

[Szczegółowa dokumentacja endpointów sesji](api_sessions.md)

### 3.5. Zadania

Endpointy związane z zarządzaniem zadaniami terapeutycznymi.

[Szczegółowa dokumentacja endpointów zadań](api_tasks.md)

### 3.6. Terapia

Endpointy związane z metodami terapii i technikami terapeutycznymi.

[Szczegółowa dokumentacja endpointów terapii](api_therapy.md)

### 3.7. LLM

Endpointy związane z integracją z modelami LLM.

[Szczegółowa dokumentacja endpointów LLM](api_llm.md)

## 4. Wersjonowanie API

API aplikacji "Terapeuta" jest wersjonowane. Aktualna wersja to `v1`. Wersja jest określana w adresie bazowym:

```
https://api.terapeuta.app/v1
```

## 5. Limity szybkości (Rate Limiting)

API aplikacji "Terapeuta" implementuje limity szybkości, aby zapobiec nadużyciom:

- 100 żądań na minutę dla endpointów autentykacji
- 1000 żądań na minutę dla pozostałych endpointów

W przypadku przekroczenia limitu, API zwraca kod błędu 429 (Too Many Requests).

## 6. CORS

API aplikacji "Terapeuta" implementuje politykę CORS (Cross-Origin Resource Sharing), która pozwala na dostęp do API z określonych domen.

## 7. Dokumentacja OpenAPI

Pełna dokumentacja API w formacie OpenAPI (Swagger) jest dostępna pod adresem:

```
https://api.terapeuta.app/docs
```
