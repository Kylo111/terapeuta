# Dokumentacja Aplikacji "Terapeuta"

## Przegląd

Ten katalog zawiera dokumentację techniczną aplikacji "Terapeuta", w tym dokumentację architektury, schematu bazy danych, API i struktury stanu aplikacji.

## Spis dokumentów

### Architektura

- [Architektura systemu](architecture.md) - Szczegółowy opis architektury aplikacji, w tym architektury backendu, frontendu, bazy danych, API, synchronizacji danych, bezpieczeństwa, monitoringu i skalowalności.

### Baza danych

- [Schemat bazy danych](database_schema.md) - Opis schematu bazy danych, w tym kolekcje, relacje, strategie zapytań, indeksowania, migracji i backupu.
- [Modele danych](data-models.md) - Szczegółowy opis modeli danych używanych w aplikacji, w tym User, Profile, Session, Task, TherapyMethod i Prompt.

### API

- [Przegląd API](api_overview.md) - Ogólny przegląd API aplikacji, w tym podstawowe informacje, format odpowiedzi, kody błędów, autentykacja, paginacja, filtrowanie i sortowanie.
- [API Autentykacji](api_auth.md) - Dokumentacja endpointów związanych z rejestracją, logowaniem i zarządzaniem tokenami.
- [API Użytkowników](api_users.md) - Dokumentacja endpointów związanych z zarządzaniem użytkownikami i ich ustawieniami.
- [API Profili](api_profiles.md) - Dokumentacja endpointów związanych z zarządzaniem profilami terapeutycznymi.
- [API Sesji](api_sessions.md) - Dokumentacja endpointów związanych z zarządzaniem sesjami terapeutycznymi.
- [API Zadań](api_tasks.md) - Dokumentacja endpointów związanych z zarządzaniem zadaniami terapeutycznymi.
- [API Terapii](api_therapy.md) - Dokumentacja endpointów związanych z metodami terapii i technikami terapeutycznymi.
- [API LLM](api_llm.md) - Dokumentacja endpointów związanych z integracją z modelami LLM.

### Stan aplikacji

- [Struktura stanu aplikacji](app_state.md) - Opis struktury stanu aplikacji, w tym architektura stanu, slice'y, selektory, middleware i strategia synchronizacji danych.

## Konwencje dokumentacji

### Formatowanie

- Dokumentacja jest pisana w formacie Markdown.
- Nagłówki używają składni ATX (z `#`).
- Kod jest umieszczany w blokach kodu z określonym językiem.
- Tabele są używane do prezentowania danych strukturalnych.
- Listy numerowane są używane do prezentowania kroków lub sekwencji.
- Listy nienumerowane są używane do prezentowania elementów bez określonej kolejności.

### Struktura dokumentów

- Każdy dokument zaczyna się od nagłówka pierwszego poziomu z tytułem dokumentu.
- Po tytule następuje krótki opis zawartości dokumentu.
- Dokument jest podzielony na sekcje za pomocą nagłówków drugiego poziomu.
- Sekcje mogą być dalej podzielone na podsekcje za pomocą nagłówków trzeciego i czwartego poziomu.
- Na końcu dokumentu znajduje się podsumowanie lub sekcja "Następne kroki".

### Przykłady

Przykłady są ważną częścią dokumentacji i powinny być:
- Jasne i zwięzłe
- Realistyczne
- Kompletne (można je skopiować i użyć bez modyfikacji)
- Opatrzone komentarzami, jeśli to konieczne

### Aktualizacje

Dokumentacja powinna być aktualizowana wraz z rozwojem aplikacji. Każda znacząca zmiana w kodzie powinna być odzwierciedlona w odpowiedniej dokumentacji.

## Status projektu

Obecny status projektu można znaleźć w pliku [progress.md](../progress.md) w głównym katalogu projektu. Zawiera on listę zrealizowanych zadań oraz plan dalszych prac.

### Zaimplementowane funkcjonalności

- Uwierzytelnianie użytkowników
- Zarządzanie metodami terapeutycznymi
- Zarządzanie promptami
- Zarządzanie sesjami terapeutycznymi
- Integracja z modelami językowymi (OpenAI, Anthropic, Google, HuggingFace)
- Generowanie odpowiedzi asystenta dla sesji terapeutycznych

### Planowane funkcjonalności

- System powiadomień
- System raportowania
- System eksportu/importu danych
- Rozbudowa systemu zarządzania profilami
- Rozbudowa systemu zarządzania zadaniami
- Zaawansowane funkcje (diagnozowanie, rekomendacje, integracja z urządzeniami fitness)
