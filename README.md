# Terapeuta

Aplikacja terapeutyczna wykorzystująca modele sztucznej inteligencji do prowadzenia sesji terapeutycznych.

## Opis projektu

Aplikacja "Terapeuta" to kompleksowe rozwiązanie terapeutyczne dostępne na urządzeniach mobilnych (iOS, Android) oraz jako aplikacja webowa, umożliwiające użytkownikom korzystanie z różnych metod terapii poprzez interakcję z zaawansowanymi modelami językowymi (LLM).

## Funkcje

### Zaimplementowane

- Różne metody terapii (CBT, psychodynamiczna, humanistyczna, systemowa, skoncentrowana na rozwiązaniach)
- Inteligentne zarządzanie kontekstem rozmowy
- Ciągłość terapeutyczna między sesjami
- System zadań terapeutycznych
- System powiadomień i przypomnień
- Dziennik myśli i emocji
- Ćwiczenia terapeutyczne

### Planowane

- Automatyczne podsumowania i śledzenie postępu
- System rekomendacji dopasowany do potrzeb użytkownika
- Warsztat asertywności
- Integracja z urządzeniami monitorującymi zdrowie

## Technologie

- **Backend**: Node.js, Express, MongoDB
- **Frontend Web**: React, Next.js, Tailwind CSS
- **Frontend Mobile**: React Native
- **AI**: LangChain, LangGraph, Ollama
- **Autentykacja**: Supabase Auth
- **Przechowywanie danych**: MongoDB Atlas, Supabase Storage

## Instalacja

1. Sklonuj repozytorium:
   ```
   git clone https://github.com/terapeuta-app/terapeuta.git
   cd terapeuta
   ```

2. Zainstaluj zależności:
   ```
   npm install
   ```

3. Skopiuj plik `.env.example` do `.env` i uzupełnij zmienne środowiskowe:
   ```
   cp .env.example .env
   ```

4. Uruchom serwer deweloperski:
   ```
   npm run dev
   ```

## Struktura projektu

```
app/
├── controllers/       # Kontrolery API
├── data/              # Zarządzanie danymi
│   ├── models/        # Modele danych
├── routes/            # Trasy API
├── services/          # Serwisy biznesowe
├── middleware/        # Middleware
├── utils/             # Narzędzia pomocnicze
├── cron/              # Zadania cron

frontend/
├── src/
    ├── app/            # Strony aplikacji (Next.js)
    ├── components/      # Komponenty UI
    ├── lib/            # Biblioteki i narzędzia
        ├── api/         # Klienty API
        ├── context/     # Konteksty React
        ├── hooks/       # Hooki React
        ├── utils/       # Narzędzia pomocnicze
```

## Licencja

Ten projekt jest objęty licencją [MIT](LICENSE).
