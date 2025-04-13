# Stos Technologiczny dla Aplikacji "Terapeuta"

## 1. Frontend

### Aplikacja Webowa
- **Framework**: React.js (biblioteka open-source)
- **Framework UI**: Next.js (framework open-source z możliwością SSR)
- **Zarządzanie stanem**: Redux Toolkit (biblioteka open-source)
- **Stylowanie**: Tailwind CSS (framework CSS open-source)
- **Komponenty UI**: Chakra UI (biblioteka komponentów open-source)
- **Wykresy i wizualizacje**: Chart.js (biblioteka open-source)
- **PWA**: Workbox (biblioteka Google do tworzenia Progressive Web Apps)

### Aplikacja Mobilna
- **Framework**: React Native (framework cross-platform open-source)
- **Zarządzanie stanem**: Redux Toolkit (współdzielony z wersją webową)
- **Nawigacja**: React Navigation (biblioteka open-source)
- **Komponenty UI**: React Native Paper (biblioteka komponentów open-source)
- **Offline Storage**: AsyncStorage + SQLite (rozwiązania open-source)

## 2. Backend

### Serwer
- **Runtime**: Node.js (środowisko uruchomieniowe open-source)
- **Framework**: Express.js (framework open-source)
- **API**: RESTful + GraphQL (Apollo Server - open-source)
- **Walidacja**: Joi lub Zod (biblioteki open-source)
- **Dokumentacja API**: Swagger UI (narzędzie open-source)

### Baza danych
- **Główna baza danych**: MongoDB Atlas (darmowy tier M0 z 512MB przestrzeni)
- **Cache**: Redis (możliwość użycia Redis Labs z darmowym planem)
- **Wyszukiwanie**: Meilisearch (open-source, alternatywa dla Elasticsearch)

### Autentykacja i Autoryzacja
- **System autentykacji**: Supabase Auth (darmowy tier do 50,000 użytkowników)
- **Zarządzanie tokenami**: JWT (standard open-source)
- **OAuth**: Passport.js (middleware open-source dla Node.js)

## 3. Integracja z AI

### Modele LLM
- **Podstawowy model**: Ollama (lokalne uruchamianie modeli open-source)
- **Alternatywne modele**:
  - Hugging Face (darmowe API dla wybranych modeli)
  - OpenAI API (płatne, ale z darmowym kredytem na start)
  - Anthropic Claude (płatne, ale z darmowym kredytem na start)
  - Google Gemini (darmowy tier z limitami)

### Zarządzanie kontekstem
- **Wektorowa baza danych**: Chroma (open-source)
- **Embeddingi**: Sentence Transformers (biblioteka open-source)
- **Orkiestracja LLM**: LangChain (framework open-source)
- **Maszyna stanów**: LangGraph (biblioteka open-source)

## 4. Przechowywanie danych

### Przechowywanie plików
- **Główne repozytorium**: Supabase Storage (darmowy tier z 1GB przestrzeni)
- **Alternatywa**: MinIO (self-hosted, open-source)

### Synchronizacja
- **Mechanizm synchronizacji**: PouchDB (klient) + CouchDB (serwer) - rozwiązanie open-source
- **Rozwiązanie alternatywne**: Supabase Realtime (darmowy tier)

## 5. Infrastruktura i Hosting

### Hosting aplikacji
- **Frontend**: Vercel (darmowy tier dla projektów osobistych)
- **Backend**: Render (darmowy tier dla usług web)
- **Alternatywa**: Railway (darmowy kredyt miesięczny)

### CI/CD
- **Integracja ciągła**: GitHub Actions (darmowe dla repozytoriów publicznych)
- **Zarządzanie wersjami**: Git + GitHub (darmowe dla repozytoriów publicznych)

### Monitoring i Analityka
- **Monitoring aplikacji**: Sentry (darmowy tier z limitem 5000 błędów miesięcznie)
- **Analityka użytkowników**: Umami (open-source, alternatywa dla Google Analytics)
- **Logi**: Logtail (darmowy tier)

## 6. Narzędzia deweloperskie

### Środowisko deweloperskie
- **IDE**: Visual Studio Code (darmowy edytor kodu)
- **Zarządzanie pakietami**: npm/yarn (narzędzia open-source)
- **Konteneryzacja**: Docker (darmowy dla użytku osobistego)

### Testowanie
- **Testy jednostkowe**: Jest (framework open-source)
- **Testy komponentów**: React Testing Library (biblioteka open-source)
- **Testy E2E**: Cypress (darmowy tier)
- **Testy API**: Postman (darmowy tier)

### Dokumentacja
- **Dokumentacja kodu**: JSDoc (narzędzie open-source)
- **Dokumentacja projektu**: Docusaurus (framework open-source)
- **Diagramy**: draw.io (darmowe narzędzie online)

## 7. Integracje z urządzeniami zewnętrznymi

### Integracja z urządzeniami fitness
- **API dla urządzeń**: Web Bluetooth API (standard open-source)
- **Integracja z platformami zdrowotnymi**:
  - Google Fit API (darmowe)
  - Apple HealthKit (darmowe)
  - Fitbit API (darmowe dla aplikacji osobistych)
  - Huawei Health API (darmowe)

## 8. Bezpieczeństwo

### Zabezpieczenia
- **Szyfrowanie danych**: crypto-js (biblioteka open-source)
- **Skanowanie zależności**: Dependabot (darmowe dla repozytoriów GitHub)
- **Analiza statyczna kodu**: ESLint + SonarLint (narzędzia open-source)
- **Zarządzanie sekretami**: GitHub Secrets (darmowe dla repozytoriów)

### Zgodność z przepisami
- **RODO/GDPR**: Własna implementacja z wykorzystaniem open-source templates
- **Polityka prywatności**: Generatory open-source

## 9. Komunikacja i powiadomienia

### Powiadomienia
- **Push Notifications**: Firebase Cloud Messaging (darmowy tier)
- **Email**: Resend (darmowy tier do 100 emaili dziennie) lub Sendgrid (darmowy tier do 100 emaili dziennie)
- **In-app Notifications**: Własna implementacja z wykorzystaniem WebSockets

## 10. Uzasadnienie wyboru technologii

### Frontend
Wybór React i React Native pozwala na współdzielenie znacznej części kodu między aplikacją webową a mobilną. Next.js zapewnia optymalizację SEO, SSR i lepszą wydajność. Tailwind CSS umożliwia szybkie tworzenie responsywnych interfejsów.

### Backend
Node.js z Express.js to sprawdzone rozwiązanie z dużą społecznością i wieloma bibliotekami. MongoDB Atlas oferuje darmowy tier wystarczający do rozpoczęcia projektu, a Supabase zapewnia gotowe rozwiązania dla autentykacji i przechowywania plików.

### Integracja z AI
Ollama pozwala na lokalne uruchamianie modeli open-source, co zmniejsza koszty i zwiększa prywatność. LangChain i LangGraph ułatwiają implementację złożonej logiki terapeutycznej i maszyny stanów.

### Hosting
Vercel i Render oferują darmowe tiery wystarczające do uruchomienia MVP i testowania z rzeczywistymi użytkownikami. GitHub Actions zapewnia darmową automatyzację procesów CI/CD.

### Skalowalność
Wybrany stos technologiczny umożliwia łatwe skalowanie w miarę wzrostu liczby użytkowników. W przypadku przekroczenia limitów darmowych tierów, migracja do płatnych planów jest prosta i nie wymaga zmiany architektury.

## 11. Ograniczenia darmowych tierów i plan rozwoju

### Ograniczenia
- **MongoDB Atlas**: Limit 512MB może wymagać optymalizacji przechowywania danych
- **Supabase**: Limity transferu danych i liczby użytkowników
- **Vercel/Render**: Ograniczenia w czasie budowania i zasobach obliczeniowych
- **Firebase FCM**: Limity liczby powiadomień

### Plan rozwoju
1. **Faza MVP**: Wykorzystanie w pełni darmowych tierów
2. **Faza wzrostu**: Selektywne przejście na płatne plany dla krytycznych usług
3. **Faza skali**: Migracja do bardziej zaawansowanych rozwiązań w miarę potrzeb

Ten stos technologiczny zapewnia optymalny balans między kosztami (wykorzystanie darmowych usług), wydajnością, skalowalnością i bezpieczeństwem, umożliwiając szybkie uruchomienie aplikacji "Terapeuta" i jej rozwój w przyszłości.
