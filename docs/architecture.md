# Architektura Aplikacji "Terapeuta"

## 1. Przegląd architektury

Aplikacja "Terapeuta" jest zbudowana jako system hybrydowy, dostępny zarówno jako aplikacja mobilna (iOS, Android), jak i aplikacja webowa, z synchronizacją danych między platformami. Architektura systemu jest oparta na wzorcu klient-serwer z RESTful API.

### 1.1. Diagram architektury wysokiego poziomu

```
+------------------+     +------------------+     +------------------+
|                  |     |                  |     |                  |
|  Aplikacja Web   |     | Aplikacja Mobile |     |  Aplikacja PWA   |
|  (Next.js/React) |     | (React Native)   |     |  (Next.js/PWA)   |
|                  |     |                  |     |                  |
+--------+---------+     +--------+---------+     +--------+---------+
         |                        |                        |
         |                        |                        |
         v                        v                        v
+------------------------------------------------------------------+
|                                                                  |
|                         REST API (Express)                       |
|                                                                  |
+------------------------------------------------------------------+
         |                        |                        |
         |                        |                        |
         v                        v                        v
+----------------+     +-------------------+     +------------------+
|                |     |                   |     |                  |
| Baza danych    |     | Silnik terapii    |     | Integracje z     |
| (MongoDB)      |     | (LangChain/Graph) |     | modelami LLM     |
|                |     |                   |     |                  |
+----------------+     +-------------------+     +------------------+
```

### 1.2. Główne komponenty systemu

1. **Frontend**:
   - Aplikacja webowa (Next.js/React)
   - Aplikacja mobilna (React Native)
   - Aplikacja PWA (Progressive Web App)

2. **Backend**:
   - Serwer API (Node.js/Express)
   - Silnik terapii (LangChain/LangGraph)
   - Integracje z modelami LLM (OpenAI, Anthropic, itp.)

3. **Baza danych**:
   - MongoDB (główna baza danych)
   - Lokalne przechowywanie danych (IndexedDB, AsyncStorage)

4. **Usługi zewnętrzne**:
   - Supabase (autentykacja, przechowywanie plików)
   - Sentry (monitoring błędów)
   - Umami (analityka)

## 2. Architektura backendu

Backend aplikacji "Terapeuta" jest zbudowany w oparciu o architekturę warstwową, która zapewnia separację odpowiedzialności i łatwość utrzymania kodu.

### 2.1. Warstwy backendu

```
+------------------------------------------------------------------+
|                                                                  |
|                         Warstwa API                              |
|                                                                  |
+------------------------------------------------------------------+
                               |
                               v
+------------------------------------------------------------------+
|                                                                  |
|                      Warstwa kontrolerów                         |
|                                                                  |
+------------------------------------------------------------------+
                               |
                               v
+------------------------------------------------------------------+
|                                                                  |
|                      Warstwa serwisów                            |
|                                                                  |
+------------------------------------------------------------------+
                               |
                               v
+------------------------------------------------------------------+
|                                                                  |
|                      Warstwa repozytoriów                        |
|                                                                  |
+------------------------------------------------------------------+
                               |
                               v
+------------------------------------------------------------------+
|                                                                  |
|                      Warstwa modeli                              |
|                                                                  |
+------------------------------------------------------------------+
                               |
                               v
+------------------------------------------------------------------+
|                                                                  |
|                      Baza danych (MongoDB)                       |
|                                                                  |
+------------------------------------------------------------------+
```

#### 2.1.1. Warstwa API

Warstwa API definiuje endpointy RESTful, które są dostępne dla klientów. Odpowiada za:
- Definiowanie tras (routes)
- Walidację danych wejściowych
- Obsługę błędów
- Formatowanie odpowiedzi

#### 2.1.2. Warstwa kontrolerów

Warstwa kontrolerów zawiera logikę obsługi żądań HTTP. Odpowiada za:
- Przetwarzanie żądań
- Wywołanie odpowiednich serwisów
- Zwracanie odpowiedzi

#### 2.1.3. Warstwa serwisów

Warstwa serwisów zawiera logikę biznesową aplikacji. Odpowiada za:
- Implementację logiki biznesowej
- Koordynację operacji na danych
- Integrację z zewnętrznymi usługami

#### 2.1.4. Warstwa repozytoriów

Warstwa repozytoriów odpowiada za dostęp do danych. Odpowiada za:
- Operacje CRUD na danych
- Zapytania do bazy danych
- Mapowanie danych

#### 2.1.5. Warstwa modeli

Warstwa modeli definiuje strukturę danych w aplikacji. Odpowiada za:
- Definicję schematów danych
- Walidację danych
- Metody pomocnicze dla modeli

### 2.2. Silnik terapii

Silnik terapii jest kluczowym komponentem aplikacji, odpowiedzialnym za zarządzanie przebiegiem sesji terapeutycznych. Jest zbudowany w oparciu o architekturę maszyny stanów, zaimplementowaną przy użyciu LangGraph.

```
+------------------------------------------------------------------+
|                                                                  |
|                      Silnik terapii                              |
|                                                                  |
+------------------------------------------------------------------+
         |                        |                        |
         v                        v                        v
+----------------+     +-------------------+     +------------------+
|                |     |                   |     |                  |
| Maszyna stanów |     | Zarządzanie       |     | Integracja z     |
| (StateMachine) |     | kontekstem        |     | modelami LLM     |
|                |     | (ContextManager)  |     | (APIManager)     |
+----------------+     +-------------------+     +------------------+
```

#### 2.2.1. Maszyna stanów (StateMachine)

Maszyna stanów zarządza przepływem sesji terapeutycznej, definiując stany i przejścia między nimi:
- Inicjalizacja sesji
- Sprawdzenie nastroju
- Ustalenie agendy
- Główna część terapeutyczna
- Podsumowanie sesji
- Informacja zwrotna
- Zakończenie

#### 2.2.2. Zarządzanie kontekstem (ContextManager)

Moduł zarządzania kontekstem odpowiada za:
- Przygotowanie kontekstu dla modelu LLM
- Kompresję historii konwersacji
- Ekstrakcję kluczowych informacji
- Dynamiczne dodawanie istotnych fragmentów historii

#### 2.2.3. Integracja z modelami LLM (APIManager)

Moduł integracji z modelami LLM odpowiada za:
- Komunikację z API dostawców modeli LLM
- Generowanie promptów
- Przetwarzanie odpowiedzi
- Zarządzanie kluczami API

### 2.3. Metody terapii

Aplikacja implementuje różne metody terapii, każda z własnym zestawem technik i podejściem:

```
+------------------------------------------------------------------+
|                                                                  |
|                      Metody terapii                              |
|                                                                  |
+------------------------------------------------------------------+
         |                |                |                |
         v                v                v                v
+----------------+ +----------------+ +----------------+ +----------------+
|                | |                | |                | |                |
| Terapia        | | Terapia        | | Terapia        | | Terapia        |
| poznawczo-     | | psycho-        | | humanistyczno- | | systemowa      |
| behawioralna   | | dynamiczna     | | egzystencjalna | |                |
+----------------+ +----------------+ +----------------+ +----------------+
```

Każda metoda terapii implementuje:
- Generowanie promptów specyficznych dla danej metody
- Techniki terapeutyczne
- Zadania terapeutyczne
- Strategie prowadzenia rozmowy

## 3. Architektura frontendu

Frontend aplikacji "Terapeuta" jest zbudowany w oparciu o architekturę komponentową, z wykorzystaniem wzorca Redux dla zarządzania stanem.

### 3.1. Aplikacja webowa (Next.js/React)

```
+------------------------------------------------------------------+
|                                                                  |
|                      Aplikacja webowa                            |
|                                                                  |
+------------------------------------------------------------------+
         |                        |                        |
         v                        v                        v
+----------------+     +-------------------+     +------------------+
|                |     |                   |     |                  |
| Komponenty UI  |     | Zarządzanie       |     | Integracja z     |
| (React)        |     | stanem (Redux)    |     | API (Axios)      |
|                |     |                   |     |                  |
+----------------+     +-------------------+     +------------------+
```

#### 3.1.1. Komponenty UI

Komponenty UI są zorganizowane w hierarchiczną strukturę:
- Komponenty atomowe (przyciski, pola formularzy, itp.)
- Komponenty molekularne (formularze, karty, itp.)
- Organizmy (sekcje strony, panele, itp.)
- Szablony (układy stron)
- Strony (komponenty najwyższego poziomu)

#### 3.1.2. Zarządzanie stanem

Zarządzanie stanem jest realizowane przy użyciu Redux Toolkit:
- Store (centralne miejsce przechowywania stanu)
- Reducery (funkcje modyfikujące stan)
- Actions (akcje wywołujące zmiany stanu)
- Selectors (funkcje pobierające dane ze stanu)

#### 3.1.3. Integracja z API

Integracja z API jest realizowana przy użyciu Axios:
- Konfiguracja klienta HTTP
- Interceptory (przechwytywanie żądań i odpowiedzi)
- Obsługa błędów
- Zarządzanie tokenami autoryzacyjnymi

### 3.2. Aplikacja mobilna (React Native)

Aplikacja mobilna ma podobną architekturę do aplikacji webowej, z dodatkowymi komponentami specyficznymi dla urządzeń mobilnych:
- Nawigacja (React Navigation)
- Przechowywanie danych lokalnie (AsyncStorage)
- Obsługa powiadomień (Firebase Cloud Messaging)
- Integracja z urządzeniami (React Native Modules)

## 4. Architektura bazy danych

Aplikacja "Terapeuta" wykorzystuje MongoDB jako główną bazę danych, z następującym schematem:

### 4.1. Schemat bazy danych

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

#### 4.1.1. Kolekcja User

Przechowuje informacje o użytkownikach:
- Dane uwierzytelniające (email, hasło)
- Dane osobowe (imię, nazwisko)
- Ustawienia (preferowany model LLM, język, motyw)
- Referencje do profili

#### 4.1.2. Kolekcja Profile

Przechowuje informacje o profilach terapeutycznych:
- Dane profilu (nazwa, metoda terapii)
- Cele terapeutyczne
- Wyzwania
- Stan emocjonalny
- Postęp terapii
- Referencje do sesji i zadań

#### 4.1.3. Kolekcja Session

Przechowuje informacje o sesjach terapeutycznych:
- Metadane sesji (czas rozpoczęcia/zakończenia, metoda terapii)
- Historia konwersacji
- Podsumowanie sesji
- Metryki (stan emocjonalny, skuteczność)
- Referencje do zadań

#### 4.1.4. Kolekcja Task

Przechowuje informacje o zadaniach terapeutycznych:
- Opis zadania
- Kategoria i priorytet
- Termin wykonania
- Status (oczekujące, ukończone, nieukończone)
- Dane o wykonaniu
- Przypomnienia

### 4.2. Indeksy

Dla optymalizacji zapytań, baza danych wykorzystuje następujące indeksy:
- User: email (unikalny)
- Profile: user (dla szybkiego wyszukiwania profili użytkownika)
- Session: profile (dla szybkiego wyszukiwania sesji profilu)
- Task: profile, session (dla szybkiego wyszukiwania zadań)

## 5. Architektura API

API aplikacji "Terapeuta" jest zbudowane w oparciu o architekturę RESTful, z następującymi endpointami:

### 5.1. Endpointy API

#### 5.1.1. Autentykacja

- `POST /api/auth/register` - Rejestracja nowego użytkownika
- `POST /api/auth/login` - Logowanie użytkownika
- `POST /api/auth/logout` - Wylogowanie użytkownika
- `POST /api/auth/refresh-token` - Odświeżenie tokenu JWT
- `POST /api/auth/reset-password` - Resetowanie hasła

#### 5.1.2. Użytkownicy

- `GET /api/users/me` - Pobieranie danych zalogowanego użytkownika
- `PUT /api/users/me` - Aktualizacja danych użytkownika
- `PUT /api/users/me/settings` - Aktualizacja ustawień użytkownika

#### 5.1.3. Profile

- `GET /api/profiles` - Pobieranie listy profili użytkownika
- `POST /api/profiles` - Tworzenie nowego profilu
- `GET /api/profiles/:id` - Pobieranie szczegółów profilu
- `PUT /api/profiles/:id` - Aktualizacja profilu
- `DELETE /api/profiles/:id` - Usuwanie profilu
- `PUT /api/profiles/:id/emotional-state` - Aktualizacja stanu emocjonalnego
- `POST /api/profiles/:id/goals` - Dodawanie celu
- `PUT /api/profiles/:id/goals/:goalId` - Aktualizacja celu
- `PUT /api/profiles/:id/therapy-progress` - Aktualizacja postępu terapii

#### 5.1.4. Sesje

- `GET /api/profiles/:profileId/sessions` - Pobieranie listy sesji profilu
- `POST /api/profiles/:profileId/sessions` - Tworzenie nowej sesji
- `GET /api/sessions/:id` - Pobieranie szczegółów sesji
- `POST /api/sessions/:id/messages` - Dodawanie wiadomości do sesji
- `PUT /api/sessions/:id/end` - Kończenie sesji
- `GET /api/sessions/:id/summary` - Pobieranie podsumowania sesji

#### 5.1.5. Zadania

- `GET /api/profiles/:profileId/tasks` - Pobieranie listy zadań profilu
- `POST /api/profiles/:profileId/tasks` - Tworzenie nowego zadania
- `GET /api/tasks/:id` - Pobieranie szczegółów zadania
- `PUT /api/tasks/:id` - Aktualizacja zadania
- `PUT /api/tasks/:id/complete` - Oznaczanie zadania jako ukończonego
- `PUT /api/tasks/:id/incomplete` - Oznaczanie zadania jako nieukończonego
- `POST /api/tasks/:id/reminders` - Dodawanie przypomnienia

#### 5.1.6. Terapia

- `GET /api/therapy/methods` - Pobieranie listy dostępnych metod terapii
- `GET /api/therapy/methods/:method/techniques` - Pobieranie technik dla danej metody
- `GET /api/therapy/methods/:method/tasks` - Pobieranie przykładowych zadań dla danej metody

#### 5.1.7. LLM

- `POST /api/llm/providers` - Pobieranie listy dostępnych dostawców LLM
- `POST /api/llm/generate` - Generowanie odpowiedzi od modelu LLM

### 5.2. Struktura odpowiedzi API

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

### 5.3. Autentykacja API

API wykorzystuje autentykację opartą na tokenach JWT:
- Token dostępu (access token) - krótki czas życia (15 minut)
- Token odświeżania (refresh token) - dłuższy czas życia (7 dni)
- Tokeny są przesyłane w nagłówku Authorization

## 6. Architektura synchronizacji danych

Aplikacja "Terapeuta" implementuje mechanizm synchronizacji danych między urządzeniami, oparty na następujących zasadach:

### 6.1. Strategia synchronizacji

- Dane są przechowywane lokalnie na urządzeniu
- Zmiany są synchronizowane z serwerem, gdy urządzenie jest online
- W przypadku konfliktu, priorytet ma nowsza wersja danych
- Sesje terapeutyczne są synchronizowane w czasie rzeczywistym, gdy jest to możliwe

### 6.2. Mechanizm synchronizacji

```
+------------------+                    +------------------+
|                  |                    |                  |
|  Lokalna baza    |<------------------>|  Serwer API      |
|  danych          |                    |                  |
|                  |                    |                  |
+------------------+                    +------------------+
```

- Zmiany lokalne są zapisywane w kolejce synchronizacji
- Kolejka jest przetwarzana, gdy urządzenie jest online
- Serwer zwraca znacznik czasu ostatniej synchronizacji
- Przy kolejnej synchronizacji, przesyłane są tylko zmiany od ostatniej synchronizacji

## 7. Architektura bezpieczeństwa

Aplikacja "Terapeuta" implementuje wielowarstwowe podejście do bezpieczeństwa:

### 7.1. Bezpieczeństwo danych

- Szyfrowanie danych w spoczynku (encryption at rest)
- Szyfrowanie danych w tranzycie (encryption in transit)
- Minimalizacja danych przesyłanych do API zewnętrznych
- Anonimizacja danych używanych do analizy

### 7.2. Bezpieczeństwo aplikacji

- Walidacja danych wejściowych
- Ochrona przed atakami CSRF
- Ochrona przed atakami XSS
- Limity szybkości (rate limiting)
- Monitorowanie podejrzanych aktywności

### 7.3. Bezpieczeństwo użytkownika

- Silne hasła
- Dwuskładnikowe uwierzytelnianie (2FA)
- Automatyczne wylogowanie po okresie bezczynności
- Powiadomienia o nowych logowaniach

## 8. Architektura monitoringu i analityki

Aplikacja "Terapeuta" implementuje system monitoringu i analityki, który pozwala na śledzenie wydajności, błędów i zachowań użytkowników:

### 8.1. Monitoring błędów

- Rejestrowanie błędów w Sentry
- Alerty o krytycznych błędach
- Grupowanie podobnych błędów
- Śledzenie częstotliwości błędów

### 8.2. Monitoring wydajności

- Śledzenie czasu odpowiedzi API
- Śledzenie wykorzystania zasobów serwera
- Śledzenie wydajności bazy danych
- Śledzenie wydajności aplikacji klienckiej

### 8.3. Analityka użytkowników

- Śledzenie aktywności użytkowników (Umami)
- Śledzenie ścieżek użytkowników
- Śledzenie konwersji
- Śledzenie retencji użytkowników

## 9. Architektura skalowalności

Aplikacja "Terapeuta" jest zaprojektowana z myślą o skalowalności:

### 9.1. Skalowalność horyzontalna

- Bezstanowe API (stateless API)
- Równoważenie obciążenia (load balancing)
- Replikacja bazy danych
- Buforowanie (caching)

### 9.2. Skalowalność wertykalna

- Optymalizacja zapytań do bazy danych
- Optymalizacja wykorzystania pamięci
- Optymalizacja wykorzystania CPU
- Optymalizacja wykorzystania sieci

## 10. Podsumowanie

Architektura aplikacji "Terapeuta" jest zaprojektowana z myślą o:
- Modularności i łatwości utrzymania
- Skalowalności i wydajności
- Bezpieczeństwie i prywatności danych
- Elastyczności i rozszerzalności

Kluczowe aspekty architektury:
- Architektura warstwowa backendu
- Architektura komponentowa frontendu
- Maszyna stanów do zarządzania sesją terapeutyczną
- RESTful API
- MongoDB jako główna baza danych
- Mechanizm synchronizacji danych
- Wielowarstwowe podejście do bezpieczeństwa
- System monitoringu i analityki
