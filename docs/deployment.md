# Dokumentacja wdrożeniowa

## 1. Przegląd

Aplikacja Terapeuta składa się z dwóch głównych komponentów:
1. Backend (API) - aplikacja Node.js z Express
2. Frontend - aplikacja Next.js

## 2. Wymagania

### 2.1. Wymagania dla backendu
- Node.js 18+
- MongoDB 5+
- Konto na Render.com

### 2.2. Wymagania dla frontendu
- Node.js 18+
- Konto na Vercel.com

### 2.3. Usługi zewnętrzne
- MongoDB Atlas - baza danych
- Sentry - monitoring błędów
- Umami - analityka

## 3. Wdrożenie backendu na Render

### 3.1. Przygotowanie
1. Utwórz konto na Render.com
2. Utwórz nową usługę Web Service
3. Połącz z repozytorium GitHub

### 3.2. Konfiguracja
1. Nazwa: terapeuta-api
2. Środowisko: Node
3. Polecenie budowania: `npm install`
4. Polecenie uruchomienia: `npm start`
5. Zmienne środowiskowe:
   - `NODE_ENV`: production
   - `PORT`: 3001
   - `MONGODB_URI`: mongodb+srv://...
   - `JWT_SECRET`: [wygenerowany sekretny klucz]
   - `JWT_REFRESH_SECRET`: [wygenerowany sekretny klucz]
   - `OPENAI_API_KEY`: [klucz API OpenAI]
   - `ANTHROPIC_API_KEY`: [klucz API Anthropic]
   - `FRONTEND_URL`: https://terapeuta.vercel.app
   - `SENTRY_DSN`: [klucz DSN Sentry]

### 3.3. Automatyczne wdrożenie
1. Render automatycznie wdraża aplikację po każdym pushu do głównej gałęzi
2. Możesz również ręcznie wdrożyć aplikację z panelu Render

## 4. Wdrożenie frontendu na Vercel

### 4.1. Przygotowanie
1. Utwórz konto na Vercel.com
2. Utwórz nowy projekt
3. Połącz z repozytorium GitHub

### 4.2. Konfiguracja
1. Framework: Next.js
2. Katalog główny: frontend
3. Polecenie budowania: `npm run build`
4. Zmienne środowiskowe:
   - `NEXT_PUBLIC_API_URL`: https://terapeuta-api.onrender.com/api
   - `NEXT_PUBLIC_UMAMI_WEBSITE_ID`: [ID witryny Umami]
   - `NEXT_PUBLIC_UMAMI_URL`: [URL instancji Umami]
   - `NEXT_PUBLIC_SENTRY_DSN`: [klucz DSN Sentry]

### 4.3. Automatyczne wdrożenie
1. Vercel automatycznie wdraża aplikację po każdym pushu do głównej gałęzi
2. Możesz również ręcznie wdrożyć aplikację z panelu Vercel

## 5. Konfiguracja bazy danych MongoDB Atlas

### 5.1. Przygotowanie
1. Utwórz konto na MongoDB Atlas
2. Utwórz nowy klaster
3. Skonfiguruj użytkownika bazy danych
4. Skonfiguruj dostęp sieciowy (IP Allowlist)

### 5.2. Konfiguracja
1. Utwórz bazę danych `terapeuta`
2. Utwórz kolekcje:
   - `users`
   - `profiles`
   - `sessions`
   - `tasks`
   - `devices`
   - `therapymethods`

### 5.3. Połączenie
1. Uzyskaj URI połączenia z MongoDB Atlas
2. Ustaw URI jako zmienną środowiskową `MONGODB_URI` w konfiguracji Render

## 6. Konfiguracja monitoringu Sentry

### 6.1. Przygotowanie
1. Utwórz konto na Sentry.io
2. Utwórz nowy projekt dla Node.js (backend)
3. Utwórz nowy projekt dla Next.js (frontend)

### 6.2. Konfiguracja
1. Uzyskaj klucze DSN dla obu projektów
2. Ustaw klucz DSN backendu jako zmienną środowiskową `SENTRY_DSN` w konfiguracji Render
3. Ustaw klucz DSN frontendu jako zmienną środowiskową `NEXT_PUBLIC_SENTRY_DSN` w konfiguracji Vercel

## 7. Konfiguracja analityki Umami

### 7.1. Przygotowanie
1. Utwórz konto na Umami.is lub wdróż własną instancję Umami
2. Utwórz nową witrynę w panelu Umami

### 7.2. Konfiguracja
1. Uzyskaj ID witryny i URL instancji Umami
2. Ustaw ID witryny jako zmienną środowiskową `NEXT_PUBLIC_UMAMI_WEBSITE_ID` w konfiguracji Vercel
3. Ustaw URL instancji jako zmienną środowiskową `NEXT_PUBLIC_UMAMI_URL` w konfiguracji Vercel

## 8. Monitorowanie i utrzymanie

### 8.1. Monitorowanie
1. Używaj panelu Sentry do monitorowania błędów
2. Używaj panelu Umami do monitorowania ruchu
3. Używaj panelu Render i Vercel do monitorowania wydajności

### 8.2. Aktualizacje
1. Regularnie aktualizuj zależności
2. Testuj aktualizacje w środowisku deweloperskim przed wdrożeniem
3. Używaj gałęzi deweloperskich do testowania nowych funkcji

### 8.3. Kopie zapasowe
1. Regularnie wykonuj kopie zapasowe bazy danych MongoDB Atlas
2. Przechowuj kopie zapasowe w bezpiecznym miejscu

## 9. Rozwiązywanie problemów

### 9.1. Problemy z backendem
1. Sprawdź logi w panelu Render
2. Sprawdź błędy w panelu Sentry
3. Sprawdź połączenie z bazą danych MongoDB Atlas

### 9.2. Problemy z frontendem
1. Sprawdź logi w panelu Vercel
2. Sprawdź błędy w panelu Sentry
3. Sprawdź połączenie z API backendu

### 9.3. Problemy z bazą danych
1. Sprawdź logi w panelu MongoDB Atlas
2. Sprawdź dostęp sieciowy (IP Allowlist)
3. Sprawdź użytkownika bazy danych
