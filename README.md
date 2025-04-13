# Terapeuta

Aplikacja terapeutyczna wykorzystująca modele sztucznej inteligencji do prowadzenia sesji terapeutycznych.

## Opis projektu

Aplikacja "Terapeuta" to kompleksowe rozwiązanie terapeutyczne dostępne na urządzeniach mobilnych (iOS, Android) oraz jako aplikacja webowa, umożliwiające użytkownikom korzystanie z różnych metod terapii poprzez interakcję z zaawansowanymi modelami językowymi (LLM).

## Funkcje

- Różne metody terapii (CBT, psychodynamiczna, humanistyczna, systemowa, skoncentrowana na rozwiązaniach)
- Inteligentne zarządzanie kontekstem rozmowy
- Ciągłość terapeutyczna między sesjami
- Automatyczne podsumowania i śledzenie postępu
- System rekomendacji dopasowany do potrzeb użytkownika
- Warsztat asertywności i system rozliczania zadań
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
   git clone https://github.com/username/terapeuta.git
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
├── api/               # API i integracje zewnętrzne
│   ├── llm_providers/ # Integracje z modelami LLM
├── core/              # Logika biznesowa
│   ├── therapy_engine/    # Silnik zarządzania terapią
│   ├── therapy_methods/   # Implementacje metod terapii
│   ├── analytics/         # Analityka i rekomendacje
├── data/              # Zarządzanie danymi
│   ├── storage/       # Przechowywanie danych
│   ├── models/        # Modele danych
├── ui/                # Interfejs użytkownika
│   ├── components/    # Komponenty UI
│   ├── screens/       # Ekrany aplikacji
│   ├── theme/         # Stylizacja i motywy
├── utils/             # Narzędzia pomocnicze
```

## Licencja

Ten projekt jest objęty licencją [MIT](LICENSE).
