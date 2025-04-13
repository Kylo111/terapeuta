Bazując na wszystkich zebranych informacjach, przedstawiam kompleksowy projekt aplikacji terapeutycznej "Terapeuta".

## 1. Architektura Aplikacji Terapeutycznej

### Przegląd architektury

Aplikacja "Terapeuta" będzie zbudowana jako system hybrydowy, dostępny zarówno jako aplikacja mobilna (iOS, Android), jak i aplikacja webowa, z synchronizacją danych między platformami. Oto proponowana architektura:

![Diagram architektury aplikacji Terapeuta](https://i.imgur.com/6Vkhvh2.png)

### Komponenty architektury:

1. **Interfejs użytkownika** - Aplikacja mobilna i webowa
2. **Warstwa komunikacji** - API do łączenia z modelami LLM
3. **Logika biznesowa** - Zarządzanie terapią, sesjami i postępem
4. **Baza danych** - Przechowywanie historii, kontekstu i ustawień
5. **Silnik zarządzania terapią** - Koordynacja przepływu terapii

## 2. Funkcjonalność główna

### 2.1. Konfiguracja i personalizacja

- **Konfiguracja modeli LLM**:
  - Wybór dostawcy (OpenAI, Anthropic, Llama, Gemini itp.)
  - Wybór konkretnego modelu (GPT-4, Claude 3, Llama 3 itp.)
  - Wprowadzanie i bezpieczne przechowywanie klucza API
  - Ustawienia parametrów modelu (temperatura, max_tokens itp.)

- **Profile użytkowników**:
  - Możliwość tworzenia wielu profili terapeutycznych
  - Oddzielne historie sesji dla każdego profilu
  - Personalizacja celów terapeutycznych i preferencji

### 2.2. Modele terapii

Aplikacja będzie oferować 5 różnych metod terapii, między którymi użytkownik będzie mógł się przełączać:

1. **Terapia poznawczo-behawioralna (CBT)**:
   - Identyfikacja i zmiana negatywnych wzorców myślenia
   - Ćwiczenia w restrukturyzacji poznawczej
   - Dziennik myśli i przekonań

2. **Terapia psychodynamiczna**:
   - Eksploracja nieświadomych procesów psychicznych
   - Analiza przeszłych doświadczeń i ich wpływu na obecne zachowania
   - Praca z wewnętrznymi konfliktami

3. **Terapia humanistyczno-egzystencjalna**:
   - Koncentracja na indywidualnym doświadczeniu i odpowiedzialności
   - Poszukiwanie sensu i wartości w życiu
   - Rozwijanie samoświadomości i autentyczności

4. **Terapia systemowa**:
   - Analiza relacji i wzorców interakcji z innymi
   - Praca nad systemami, w których funkcjonuje osoba
   - Ulepszanie komunikacji i dynamiki relacji

5. **Terapia krótkoterminowa skoncentrowana na rozwiązaniach**:
   - Skupienie na konkretnych, osiągalnych celach
   - Identyfikacja zasobów i rozwiązań
   - Praktyczne ćwiczenia zorientowane na przyszłość

Każda metoda terapii będzie zaimplementowana jako oddzielny moduł z własnymi zestawami promptów, instrukcji dla modelu LLM i strategii prowadzenia rozmowy.

## 3. Zarządzanie kontekstem i sesjami

### 3.1. Struktura maszyny stanów (state machine)

Do zarządzania przepływem terapii zostanie wykorzystana maszyna stanów, zaimplementowana przy użyciu biblioteki LangGraph. Każda sesja terapeutyczna będzie przechodzić przez określone stany:

1. **Inicjalizacja sesji**:
   - Sprawdzenie czasu od ostatniej sesji
   - Załadowanie odpowiedniego kontekstu i historii
   - Ustalenie celów bieżącej sesji

2. **Sprawdzenie nastroju**:
   - Ocena aktualnego stanu emocjonalnego
   - Porównanie z poprzednimi sesjami

3. **Ustalenie agendy**:
   - Określenie tematów do omówienia w bieżącej sesji
   - Priorytetyzacja zagadnień

4. **Główna część terapeutyczna**:
   - Prowadzenie dialogu terapeutycznego
   - Aplikacja technik właściwych dla wybranej metody terapii

5. **Podsumowanie sesji**:
   - Synteza głównych tematów i odkryć
   - Ustalenie zadań domowych i celów

6. **Zakończenie i informacja zwrotna**:
   - Zebranie opinii o sesji
   - Planowanie kolejnego spotkania

### 3.2. Zarządzanie kontekstem rozmowy

Aplikacja będzie wykorzystywać zaawansowany system zarządzania kontekstem, aby model LLM zawsze miał dostęp do odpowiednich informacji:

```json
{
  "session_info": {
    "session_id": "uuid-123456",
    "start_time": "2025-04-13T14:30:00Z",
    "therapy_method": "cognitive_behavioral",
    "session_number": 12
  },
  "client_profile": {
    "client_id": "client-789",
    "name": "Jan",
    "goals": ["Redukcja lęku", "Poprawa relacji interpersonalnych"],
    "challenges": ["Napady paniki", "Trudności w asertywności"]
  },
  "therapy_progress": {
    "overall_status": "improving",
    "key_insights": ["Zidentyfikowane wyzwalacze lęku", "Rozpoznane wzorce unikania"],
    "homework_completion": 0.8
  },
  "previous_session_summary": {
    "main_topics": ["Praca nad reakcjami na krytykę", "Techniki oddychania w sytuacjach stresowych"],
    "insights": "Klient zauważył związek między samokrytyką a napadami lęku",
    "homework": "Ćwiczenie technik oddychania przeponowego 2x dziennie"
  },
  "conversation_history": [
    // Ograniczona historia konwersacji z kluczowymi fragmentami
  ]
}
```

System będzie inteligentnie zarządzał wielkością kontekstu, stosując:
- Mechanizm kompresji historii konwersacji
- Ekstrakcję kluczowych informacji z poprzednich sesji
- Dynamiczne dodawanie istotnych fragmentów historii w zależności od aktualnego tematu

## 4. Przechowywanie i zarządzanie danymi

### 4.1. Format danych sesji

Wszystkie dane sesji będą przechowywane w strukturze JSON, co zapewni elastyczność i łatwość operowania na danych:

```json
{
  "session": {
    "id": "session-uuid-123",
    "start_time": "2025-04-13T14:30:00Z",
    "end_time": "2025-04-13T15:25:00Z",
    "therapy_method": "cognitive_behavioral",
    "session_number": 12,
    "continuity_status": "continued" // "new", "continued", "resumed_after_break"
  },
  "conversation": [
    {
      "role": "system",
      "content": "Instrukcja dla modelu terapii poznawczo-behawioralnej...",
      "timestamp": "2025-04-13T14:30:00Z"
    },
    {
      "role": "assistant",
      "content": "Witaj z powrotem, jak się dzisiaj czujesz?",
      "timestamp": "2025-04-13T14:30:05Z"
    },
    {
      "role": "user",
      "content": "Dziś jest lepiej niż ostatnio, ale nadal mam problemy z...",
      "timestamp": "2025-04-13T14:30:45Z"
    }
    // Pełna historia konwersacji
  ],
  "summary": {
    "main_topics": ["Praca nad przekonaniami ograniczającymi", "Techniki przeciwdziałania ruminacjom"],
    "key_insights": "Klient rozpoznał wzorzec katastrofizacji w sytuacjach niepewności",
    "progress": "Zauważalny postęp w rozpoznawaniu zniekształceń poznawczych",
    "homework": "Prowadzenie dziennika myśli i przekonań, ćwiczenie techniki STOP"
  },
  "metrics": {
    "emotional_state_start": {
      "anxiety": 7,
      "depression": 4,
      "optimism": 3
    },
    "emotional_state_end": {
      "anxiety": 5,
      "depression": 4,
      "optimism": 5
    },
    "session_effectiveness_rating": 8
  }
}
```

### 4.2. System plików i bazy danych

Dane będą przechowywane w dwóch formatach:

1. **Pliki JSON/MD** - dla każdej sesji, zawierające pełną historię rozmowy, podsumowania i metryki
2. **Baza danych** - przechowująca metadane sesji, informacje o postępie, indeksy do wyszukiwania i relacje między sesjami

Aplikacja będzie wykorzystywać lokalną bazę danych na urządzeniu oraz synchronizację z chmurą (opcjonalnie) dla zapewnienia bezpieczeństwa danych.

## 5. Wykrywanie i obsługa przerw w terapii

### 5.1. Mechanizm wykrywania nowych sesji

Aplikacja będzie wykorzystywać czas rzeczywisty i daty z serwera do określenia ciągłości terapii:

```pseudocode
function determineSessionContinuity():
    lastSessionTime = getLastSessionTimestamp()
    currentTime = getCurrentServerTime()
    
    timeDifference = currentTime - lastSessionTime
    
    if timeDifference < 24 HOURS:
        return "CONTINUED_SESSION"
    elif timeDifference < 7 DAYS:
        return "NEW_SESSION"
    else:
        return "EXTENDED_BREAK"
```

### 5.2. Obsługa przerw w terapii

W przypadku dłuższej przerwy (ponad tydzień), system aktywuje specjalny moduł "powrotu do terapii":

1. **Przypomnienie historii** - krótkie podsumowanie poprzednich sesji
2. **Pytania o przerwę** - empatyczne zapytanie o powody przerwy
3. **Ocena aktualnego stanu** - sprawdzenie, czy nastąpiły istotne zmiany
4. **Aktualizacja celów** - dostosowanie planu terapii do aktualnej sytuacji

## 6. System diagnozowania i rekomendacji

### 6.1. Wstępna diagnoza

Po serii sesji (np. 3-5), system przeprowadzi wstępną diagnozę bazującą na:
- Analizie wzorców językowych klienta
- Zgłaszanych symptomach i trudnościach
- Postępie w realizacji celów terapeutycznych
- Porównaniu z modelami diagnostycznymi

### 6.2. Rekomendacje zmiany metody terapii

System będzie monitorował skuteczność obecnego podejścia terapeutycznego i w razie potrzeby zaproponuje zmianę:

```pseudocode
function evaluateTherapyEffectiveness():
    progress = analyzeProgressMetrics(last5Sessions)
    stagnationPattern = detectStagnation(progress)
    
    if stagnationPattern or progressDecline:
        alternativeMethod = findBestAlternativeMethod(
            clientProfile, 
            currentIssues,
            therapyHistory
        )
        
        suggestMethodChange(alternativeMethod, justification)
```

## 7. Rozszerzona funkcjonalność

### 7.1. Zaawansowane monitorowanie postępu

- **Wizualizacja postępu** - wykresy i statystyki obrazujące zmiany w czasie
- **Analiza sentymentu** - śledzenie zmian emocjonalnych w wypowiedziach klienta
- **Wskaźniki zdrowia psychicznego** - regularnie oceniane parametry (lęk, nastrój, jakość snu itp.)

### 7.2. Integracja z zadaniami terapeutycznymi

- **Ćwiczenia między sesjami** - sugerowane aktywności wspierające terapię
- **Dzienniki myśli i emocji** - narzędzia do samodzielnego monitorowania
- **Przypomnienia i powiadomienia** - wspierające regularność praktyk

### 7.3. System bezpieczeństwa

- **Wykrywanie kryzysów** - automatyczne wykrywanie sygnałów zagrożenia (myśli samobójcze, przemocowe)
- **Protokół bezpieczeństwa** - w razie wykrycia kryzysu, system przekieruje do odpowiednich zasobów pomocy
- **Regularne testy bezpieczeństwa** - przypomnienia o ocenie stanu i potrzebach wsparcia

## 8. Implementacja techniczna

### 8.1. Struktura kodu aplikacji

```
app/
├── api/
│   ├── llm_providers/
│   │   ├── openai.js
│   │   ├── anthropic.js
│   │   ├── google.js
│   │   └── llama.js
│   └── api_manager.js
├── core/
│   ├── therapy_engine/
│   │   ├── state_machine.js
│   │   ├── context_manager.js
│   │   └── session_handler.js
│   ├── therapy_methods/
│   │   ├── cognitive_behavioral.js
│   │   ├── psychodynamic.js
│   │   ├── humanistic.js
│   │   ├── systemic.js
│   │   └── solution_focused.js
│   └── analytics/
│       ├── progress_tracker.js
│       ├── diagnosis.js
│       └── recommendations.js
├── data/
│   ├── storage/
│   │   ├── session_storage.js
│   │   └── profile_storage.js
│   └── models/
│       ├── session.js
│       ├── profile.js
│       └── therapy_plan.js
├── ui/
│   ├── components/
│   ├── screens/
│   └── theme/
└── utils/
    ├── date_handler.js
    ├── encryption.js
    └── logger.js
```

### 8.2. Kluczowe aspekty implementacji

#### Zarządzanie stanem przy użyciu maszyny stanów (LangGraph)

```javascript
// Uproszczony przykład implementacji maszyny stanów
import { StateGraph } from 'langgraph';

// Definiowanie stanów terapii
const therapyStates = {
  initialize: initializeSession,
  moodCheck: checkMood,
  setAgenda: setupAgenda,
  mainTherapy: conductTherapy,
  summarize: summarizeSession,
  feedback: getFeedback
};

// Tworzenie grafu przepływu
const therapyGraph = new StateGraph({
  initialState: 'initialize',
  states: therapyStates,
  transitions: {
    initialize: { next: 'moodCheck' },
    moodCheck: { next: 'setAgenda' },
    setAgenda: { next: 'mainTherapy' },
    mainTherapy: { 
      next: 'summarize',
      loop: 'mainTherapy' // Możliwość powrotu do tego samego stanu
    },
    summarize: { next: 'feedback' },
    feedback: { end: true }
  }
});
```

#### System zarządzania kontekstem

```javascript
class ContextManager {
  constructor(profile, therapyMethod) {
    this.profile = profile;
    this.therapyMethod = therapyMethod;
    this.sessionHistory = [];
    this.currentContext = {};
  }
  
  // Załadowanie historii i przygotowanie kontekstu
  async prepareContext(sessionId) {
    // Załadowanie podstawowych informacji
    this.currentContext = {
      clientProfile: this.profile,
      therapyMethod: this.therapyMethod,
      sessionInfo: await this.getSessionInfo(sessionId)
    };
    
    // Dodanie historii poprzednich sesji
    const previousSessions = await this.getPreviousSessions(5);
    this.currentContext.previousSessions = previousSessions.map(
      session => this.extractSessionSummary(session)
    );
    
    // Kompresja i przygotowanie historii konwersacji
    const conversationHistory = await this.getSessionConversation(sessionId);
    this.currentContext.conversation = this.optimizeConversationHistory(
      conversationHistory
    );
    
    return this.currentContext;
  }
  
  // Inteligentna kompresja historii konwersacji
  optimizeConversationHistory(history) {
    // Implementacja algorytmu kompresji
    // - Usuwanie powtórzeń
    // - Ekstrakcja kluczowych fragmentów
    // - Zapewnienie ciągłości narracyjnej
  }
}
```

## 9. Bezpieczeństwo i prywatność

### 9.1. Ochrona danych

- **Szyfrowanie end-to-end** dla wszystkich danych przesyłanych do i z modeli LLM
- **Szyfrowanie danych w spoczynku** na urządzeniu użytkownika
- **Minimalizacja danych** - przesyłanie tylko niezbędnych informacji do API

### 9.2. Polityka prywatności

- Jasna polityka dotycząca wykorzystania danych
- Opcja lokalnego przechowywania danych bez synchronizacji z chmurą
- Kontrola użytkownika nad danymi (eksport, usuwanie)

## 10. Rozszerzenia i przyszły rozwój

### 10.1. Dodatkowe funkcje

- **Integracja z urządzeniami śledzącymi** (smartwatche, opaski fitness) dla monitorowania fizjologicznych wskaźników stresu
- **Wsparcie głosowe** - możliwość prowadzenia sesji przez interfejs głosowy
- **Zaawansowana diagnostyka** - wykorzystanie większej liczby narzędzi diagnostycznych
- **Terapia grupowa** - obsługa sesji dla par lub rodzin

### 10.2. Rozwój techniczny

- **Własne fine-tuned modele LLM** - dostosowane specjalnie do kontekstu terapeutycznego
- **Personalizacja algorytmów** - uczenie się preferencji i skutecznych podejść dla konkretnego użytkownika
- **Rozbudowane API** - możliwość integracji z innymi narzędziami zdrowia psychicznego

## Podsumowanie

Aplikacja "Terapeuta" stanowi kompleksowe rozwiązanie łączące zaawansowane technologie AI z ugruntowanymi metodami terapeutycznymi. Dzięki zastosowaniu maszyny stanów do zarządzania przepływem terapii, zaawansowanego systemu kontekstu oraz inteligentnego przechowywania i analizy danych, aplikacja może zapewnić spójne, spersonalizowane i skuteczne wsparcie terapeutyczne.

Kluczowe cechy aplikacji:
- Elastyczność wyboru różnych metod terapii
- Inteligentne zarządzanie kontekstem rozmowy
- Ciągłość terapeutyczna między sesjami
- Automatyczne podsumowania i śledzenie postępu
- System rekomendacji dopasowany do potrzeb użytkownika

Ta architektura zapewnia solidną podstawę do rozwoju aplikacji, która może stanowić wartościowe narzędzie wsparcia psychologicznego, jednocześnie zachowując najwyższe standardy prywatności i bezpieczeństwa danych.

# Rozwinięcie projektu aplikacji terapeutycznej "Terapeuta"

W odpowiedzi na Twoje sugestie, rozszerzam projekt aplikacji o dodatkowe funkcjonalności i integracjami. Przedstawiam szczegółowe rozwinięcie koncepcji oraz analizę dostępnych modeli specjalizowanych w terapii.

## 1. Warsztat asertywności

### 1.1. Koncepcja i implementacja

Warsztat asertywności będzie stanowił oddzielny moduł aplikacji, zaprojektowany jako interaktywny program rozwoju umiejętności asertywnych w relacjach z innymi ludźmi.

#### Struktura warsztatu:

```
warsztat_asertywnosci/
├── diagnostyka/
│   ├── test_poziomu_asertywnosci.js
│   └── identyfikacja_obszarow_do_rozwoju.js
├── modul_edukacyjny/
│   ├── podstawy_asertywnosci.js
│   ├── rozpoznawanie_praw_osobistych.js
│   └── roznice_miedzy_asertywnoscia_a_agresja.js
├── generator_cwiczen/
│   ├── cwiczenia_wewnetrzne.js
│   ├── cwiczenia_interakcyjne.js
│   └── scenariusze_sytuacyjne.js
└── system_monitorowania/
    ├── dziennik_cwiczen.js
    ├── analiza_postepow.js
    └── feedback_i_dostosowanie.js
```

#### Generowanie ćwiczeń interaktywnych:

```javascript
class AssertivenessExerciseGenerator {
  constructor(userProfile, progressData) {
    this.userProfile = userProfile;
    this.progressData = progressData;
    this.challengeAreas = this.identifyChallengeAreas();
  }
  
  identifyChallengeAreas() {
    // Analiza profilu i postępów użytkownika
    // Identyfikacja obszarów wymagających pracy
    return ['odmawianie', 'wyrażanie_krytyki', 'przyjmowanie_komplementów'];
  }
  
  generateInteractiveExercise() {
    // Wybór obszaru do pracy na podstawie priorytetów
    const area = this.selectPriorityArea();
    
    // Generowanie spersonalizowanego ćwiczenia
    return {
      title: `Ćwiczenie asertywności: ${this.getAreaTitle(area)}`,
      description: this.createDescription(area),
      steps: this.generateSteps(area),
      difficulty: this.adjustDifficulty(area),
      context: this.createRealLifeContext(area),
      preparation: this.generatePreparationGuidelines(area),
      reflection: this.generateReflectionQuestions(area)
    };
  }
  
  createRealLifeContext(area) {
    // Tworzenie kontekstu z rzeczywistego życia użytkownika
    const contexts = {
      'odmawianie': [
        {
          scenario: 'Kolega z pracy prosi Cię o wykonanie jego zadania',
          relationship: 'współpracownik',
          setting: 'miejsce pracy',
          pressure_level: 'średni'
        },
        {
          scenario: 'Znajomy namawia Cię na imprezę mimo że masz inne plany',
          relationship: 'znajomy',
          setting: 'kontakt telefoniczny',
          pressure_level: 'wysoki'
        }
      ],
      // Inne konteksty dla pozostałych obszarów
    };
    
    // Wybór kontekstu dostosowanego do użytkownika
    return this.selectAppropriateContext(contexts[area]);
  }
  
  generateSteps(area) {
    // Generowanie kroków do wykonania ćwiczenia
    switch(area) {
      case 'odmawianie':
        return [
          '1. Zidentyfikuj sytuację wymagającą odmowy w nadchodzącym tygodniu',
          '2. Przygotuj jasne i bezpośrednie sformułowanie odmowy',
          '3. Przećwicz wypowiedź przed lustrem lub nagraj się',
          '4. Wykonaj ćwiczenie w rzeczywistej sytuacji',
          '5. Zapisz swoje odczucia przed, w trakcie i po sytuacji'
        ];
      // Inne przypadki dla pozostałych obszarów
    }
  }
  
  // Inne metody pomocnicze
}
```

#### Przykładowe ćwiczenie:

```json
{
  "title": "Ćwiczenie asertywności: Asertywna odmowa",
  "description": "To ćwiczenie pomoże Ci rozwinąć umiejętność odmawiania w sposób asertywny, bez poczucia winy i nadmiernego tłumaczenia się.",
  "context": {
    "scenario": "Bliski znajomy prosi Cię o pożyczenie znacznej sumy pieniędzy, mimo że w przeszłości miał problemy ze spłatą poprzednich pożyczek",
    "relationship": "bliski znajomy",
    "setting": "spotkanie bezpośrednie",
    "pressure_level": "wysoki"
  },
  "steps": [
    "1. Przygotuj się mentalnie - ustal granice przed spotkaniem",
    "2. Podczas rozmowy utrzymuj kontakt wzrokowy i pewną postawę ciała",
    "3. Użyj techniki 'zdartej płyty' - powtarzaj odmowę bez wdawania się w dyskusje",
    "4. Zastosuj formułę: Rozumiem + Odmowa + (opcjonalnie) Alternatywa",
    "5. Zakończ rozmowę w sposób stanowczy, ale uprzejmy"
  ],
  "script_example": "Rozumiem, że potrzebujesz tych pieniędzy, ale nie mogę ci ich pożyczyć. Mogę natomiast pomóc ci znaleźć inne rozwiązanie twojej sytuacji.",
  "difficulty": "średni",
  "preparation": [
    "Przećwicz swoją odpowiedź przed lustrem",
    "Przygotuj się na różne reakcje drugiej osoby",
    "Ustal jasno w myślach, dlaczego odmawiasz i że masz do tego prawo"
  ],
  "reflection_questions": [
    "Jak się czułeś/aś przed, w trakcie i po odmowie?",
    "Jak zareagowała druga osoba?",
    "Co było najtrudniejsze w tym ćwiczeniu?",
    "Co zrobiłeś/aś dobrze, a co mógłbyś/mogłabyś zrobić lepiej następnym razem?"
  ],
  "completion_deadline": "7 dni od otrzymania ćwiczenia"
}
```

### 1.2. System monitorowania postępów w warsztacie asertywności

```javascript
class AssertivenessProgressTracker {
  constructor(userId) {
    this.userId = userId;
    this.exercisesHistory = [];
    this.skillsProgress = {
      'odmawianie': { level: 0, completed_exercises: 0, success_rate: 0 },
      'wyrażanie_potrzeb': { level: 0, completed_exercises: 0, success_rate: 0 },
      'przyjmowanie_krytyki': { level: 0, completed_exercises: 0, success_rate: 0 },
      'wyrażanie_opinii': { level: 0, completed_exercises: 0, success_rate: 0 },
      'stawianie_granic': { level: 0, completed_exercises: 0, success_rate: 0 }
    };
  }
  
  trackExerciseCompletion(exercise, feedback) {
    // Zapisywanie informacji o wykonanym ćwiczeniu
    this.exercisesHistory.push({
      exercise_id: exercise.id,
      area: exercise.area,
      completion_date: new Date(),
      difficulty: exercise.difficulty,
      success_rating: feedback.success_rating,
      emotional_response: feedback.emotional_response,
      challenges: feedback.challenges,
      insights: feedback.insights
    });
    
    // Aktualizacja postępów w danym obszarze
    this.updateAreaProgress(exercise.area, feedback.success_rating);
  }
  
  updateAreaProgress(area, successRating) {
    const areaProgress = this.skillsProgress[area];
    areaProgress.completed_exercises += 1;
    
    // Obliczanie nowego współczynnika sukcesu
    const totalRatings = this.exercisesHistory
      .filter(ex => ex.area === area)
      .reduce((sum, ex) => sum + ex.success_rating, 0);
    
    areaProgress.success_rate = totalRatings / areaProgress.completed_exercises;
    
    // Aktualizacja poziomu umiejętności
    areaProgress.level = this.calculateSkillLevel(
      areaProgress.completed_exercises,
      areaProgress.success_rate
    );
  }
  
  calculateSkillLevel(completedExercises, successRate) {
    // Algorytm obliczania poziomu umiejętności
    // na podstawie liczby ćwiczeń i wskaźnika sukcesu
    if (completedExercises < 3) return 1; // Początkujący
    if (completedExercises < 7) return successRate > 0.6 ? 2 : 1;
    if (completedExercises < 12) return successRate > 0.7 ? 3 : 2;
    return successRate > 0.8 ? 4 : 3;
  }
  
  generateProgressReport() {
    // Tworzenie raportu postępów
    return {
      overall_progress: this.calculateOverallProgress(),
      skills_breakdown: this.skillsProgress,
      recent_improvements: this.identifyRecentImprovements(),
      suggested_focus_areas: this.suggestFocusAreas(),
      exercise_completion_rate: this.calculateCompletionRate()
    };
  }
  
  // Inne metody analityczne
}
```

## 2. System rozliczania zadań i zaleceń

### 2.1. Moduł śledzenia zadań terapeutycznych

```javascript
class TherapyTaskTracker {
  constructor(sessionManager, notificationSystem) {
    this.sessionManager = sessionManager;
    this.notificationSystem = notificationSystem;
    this.tasks = [];
  }
  
  recordTaskFromSession(sessionId, task) {
    // Rejestrowanie zadania z sesji terapeutycznej
    const newTask = {
      id: this.generateTaskId(),
      session_id: sessionId,
      description: task.description,
      category: task.category,
      created_at: new Date(),
      deadline: task.deadline || this.calculateDefaultDeadline(),
      priority: task.priority || 'medium',
      status: 'pending',
      completion_data: null,
      reminders: this.generateReminders(task)
    };
    
    this.tasks.push(newTask);
    this.scheduleReminders(newTask);
    
    return newTask;
  }
  
  generateReminders(task) {
    // Generowanie przypomnień na podstawie typu zadania i terminu
    const reminders = [];
    const deadline = task.deadline || this.calculateDefaultDeadline();
    
    // Domyślne przypomnienia
    reminders.push({
      time: new Date(deadline.getTime() - 24 * 60 * 60 * 1000), // 1 dzień przed
      message: `Przypomnienie: ${task.description}`
    });
    
    reminders.push({
      time: new Date(deadline.getTime() - 2 * 60 * 60 * 1000), // 2 godziny przed
      message: `Ostatnie przypomnienie: ${task.description}`
    });
    
    return reminders;
  }
  
  scheduleReminders(task) {
    // Planowanie wysyłania przypomnień
    task.reminders.forEach(reminder => {
      this.notificationSystem.scheduleNotification({
        user_id: this.sessionManager.getUserId(),
        time: reminder.time,
        title: 'Przypomnienie o zadaniu terapeutycznym',
        message: reminder.message,
        type: 'task_reminder',
        action: {
          type: 'open_task',
          task_id: task.id
        }
      });
    });
  }
  
  markTaskAsCompleted(taskId, completionData) {
    // Oznaczanie zadania jako ukończonego
    const task = this.tasks.find(t => t.id === taskId);
    if (!task) return null;
    
    task.status = 'completed';
    task.completion_data = {
      completion_date: new Date(),
      success_rating: completionData.success_rating,
      challenges: completionData.challenges,
      reflections: completionData.reflections,
      emotional_response: completionData.emotional_response
    };
    
    // Anulowanie zaplanowanych przypomnień
    this.notificationSystem.cancelNotificationsForTask(taskId);
    
    return task;
  }
  
  markTaskAsIncomplete(taskId, reason) {
    // Oznaczanie zadania jako nieukończonego
    const task = this.tasks.find(t => t.id === taskId);
    if (!task) return null;
    
    task.status = 'incomplete';
    task.completion_data = {
      reported_date: new Date(),
      reason: reason.explanation,
      barriers: reason.barriers,
      emotional_response: reason.emotional_response,
      alternative_actions: reason.alternative_actions
    };
    
    return task;
  }
  
  getTasksForNextSession() {
    // Pobieranie listy zadań do omówienia na następnej sesji
    const pendingTasks = this.tasks.filter(t => t.status === 'pending');
    const completedTasks = this.tasks.filter(t => 
      t.status === 'completed' && 
      !t.discussed_in_session
    );
    const incompleteTasks = this.tasks.filter(t => 
      t.status === 'incomplete' && 
      !t.discussed_in_session
    );
    
    return {
      pending: pendingTasks,
      completed: completedTasks,
      incomplete: incompleteTasks
    };
  }
  
  prepareTaskDiscussionGuide() {
    // Przygotowanie przewodnika do omówienia zadań na sesji
    const tasks = this.getTasksForNextSession();
    
    // Generowanie pytań dostosowanych do statusu zadań
    const discussionGuide = {
      completed_tasks: tasks.completed.map(task => ({
        task: task,
        questions: [
          `Co było najłatwiejsze w wykonaniu zadania "${task.description}"?`,
          `Jakie trudności napotkałeś/aś podczas wykonywania tego zadania?`,
          `Czego się nauczyłeś/aś dzięki temu ćwiczeniu?`,
          `Jak możesz wykorzystać to doświadczenie w przyszłości?`
        ]
      })),
      incomplete_tasks: tasks.incomplete.map(task => ({
        task: task,
        questions: [
          `Co uniemożliwiło wykonanie zadania "${task.description}"?`,
          `Jakie emocje pojawiły się w związku z niewykonaniem tego zadania?`,
          `Co mogłoby pomóc w wykonaniu podobnego zadania w przyszłości?`,
          `Czy możemy dostosować to zadanie, by było bardziej wykonalne?`
        ]
      })),
      pending_tasks: tasks.pending.map(task => ({
        task: task,
        questions: [
          `Na jakim etapie jesteś z zadaniem "${task.description}"?`,
          `Jakie wsparcie mogłoby pomóc w ukończeniu tego zadania?`,
          `Czy termin wykonania jest realistyczny?`,
          `Czy zadanie nadal jest istotne dla Twoich celów terapeutycznych?`
        ]
      }))
    };
    
    return discussionGuide;
  }
  
  // Inne metody zarządzania zadaniami
}
```

### 2.2. Struktura danych zadania terapeutycznego

```json
{
  "id": "task-uuid-123",
  "session_id": "session-uuid-456",
  "description": "Ćwiczyć technikę STOP przy pojawieniu się ruminacji",
  "category": "technika_terapeutyczna",
  "created_at": "2025-04-13T15:30:00Z",
  "deadline": "2025-04-20T23:59:59Z",
  "priority": "high",
  "status": "completed",
  "completion_data": {
    "completion_date": "2025-04-18T14:22:10Z",
    "success_rating": 7,
    "challenges": "Trudno było zauważyć początek ruminacji",
    "reflections": "Technika działa lepiej, gdy jestem mniej zmęczony/a",
    "emotional_response": "Ulga, duma z wykonania"
  },
  "discussed_in_session": {
    "session_id": "session-uuid-789",
    "date": "2025-04-27T14:15:00Z",
    "outcome": "Technika skuteczna, do kontynuacji z modyfikacją"
  },
  "reminders": [
    {
      "time": "2025-04-19T20:00:00Z",
      "message": "Przypomnienie: Ćwiczyć technikę STOP przy ruminacjach"
    },
    {
      "time": "2025-04-20T10:00:00Z",
      "message": "Ostatnie przypomnienie: Ćwiczyć technikę STOP"
    }
  ]
}
```

### 2.3. Integracja z systemem sesji terapeutycznych

```javascript
class SessionTaskIntegration {
  constructor(taskTracker, sessionManager) {
    this.taskTracker = taskTracker;
    this.sessionManager = sessionManager;
  }
  
  preparePreSessionBrief(upcomingSessionId) {
    // Przygotowanie informacji o zadaniach przed sesją
    const tasks = this.taskTracker.getTasksForNextSession();
    const lastSession = this.sessionManager.getLastCompletedSession();
    
    // Przygotowanie kontekstu dla modelu LLM
    return {
      session_context: {
        previous_session_summary: lastSession.summary,
        assigned_tasks: lastSession.assigned_tasks,
        task_statuses: {
          completed_count: tasks.completed.length,
          incomplete_count: tasks.incomplete.length,
          pending_count: tasks.pending.length
        },
        task_discussion_needed: tasks.completed.length + tasks.incomplete.length > 0
      },
      task_discussion_guide: this.taskTracker.prepareTaskDiscussionGuide(),
      suggested_questions: this.generateTaskRelatedQuestions(tasks)
    };
  }
  
  generateTaskRelatedQuestions(tasks) {
    // Generowanie pytań na podstawie statusu zadań
    const questions = [];
    
    if (tasks.completed.length > 0) {
      questions.push("Jak się czułeś/aś wykonując zadania z poprzedniej sesji?");
      questions.push("Które z zadań było najbardziej wartościowe?");
    }
    
    if (tasks.incomplete.length > 0) {
      questions.push("Co sprawiło największą trudność w wykonaniu zadań?");
      questions.push("Jak możemy dostosować zadania, by były bardziej wykonalne?");
    }
    
    if (tasks.pending.length > 0 && tasks.pending.length === tasks.completed.length + tasks.incomplete.length) {
      questions.push("Zauważyłem/am, że żadne z zadań nie zostało jeszcze ukończone. Z czym to może być związane?");
    }
    
    return questions;
  }
  
  extractTasksFromSessionTranscript(sessionId, transcript) {
    // Analiza transkryptu sesji w celu identyfikacji nowych zadań
    // Wykorzystanie LLM do ekstrakcji zadań z naturalnej konwersacji
    
    // Przykładowy prompt dla LLM
    const extractionPrompt = `
      Poniżej znajduje się transkrypt sesji terapeutycznej. 
      Zidentyfikuj wszystkie zadania, ćwiczenia lub zalecenia, które terapeuta zasugerował klientowi.
      Dla każdego zadania określ:
      1. Dokładny opis zadania
      2. Sugerowany termin wykonania (jeśli został określony)
      3. Kategoria zadania (np. ćwiczenie, refleksja, zadanie behawioralne)
      4. Priorytet zadania (niski/średni/wysoki)
      
      Transkrypt sesji:
      ${transcript}
      
      Format odpowiedzi:
      [
        {
          "description": "pełny opis zadania",
          "deadline": "YYYY-MM-DD" lub null,
          "category": "kategoria",
          "priority": "niski/średni/wysoki"
        },
        ...
      ]
    `;
    
    // Wywołanie modelu LLM
    return this.callLLMForTaskExtraction(extractionPrompt);
  }
  
  recordTasksDiscussedInSession(sessionId, discussedTasks) {
    // Aktualizacja statusu omówionych zadań
    discussedTasks.forEach(taskData => {
      this.taskTracker.updateTaskDiscussionStatus(
        taskData.task_id,
        {
          session_id: sessionId,
          date: new Date(),
          outcome: taskData.outcome
        }
      );
    });
  }
}
```

## 3. Integracja z urządzeniami fitness i smartwatchami

### 3.1. Architektura systemu integracji

```
health_integration/
├── connectors/
│   ├── huawei_health_connector.js
│   ├── fitbit_connector.js
│   ├── apple_health_connector.js
│   ├── google_fit_connector.js
│   └── generic_health_connector.js
├── data_processors/
│   ├── sleep_data_processor.js
│   ├── activity_data_processor.js
│   ├── heart_rate_processor.js
│   └── stress_data_processor.js
├── analysis/
│   ├── health_trends_analyzer.js
│   ├── correlation_analyzer.js
│   └── wellness_score_calculator.js
└── integration/
    ├── therapy_health_integrator.js
    ├── insights_generator.js
    └── health_visualization.js
```

### 3.2. Implementacja integracji z Huawei Health

```javascript
class HuaweiHealthConnector {
  constructor(apiConfig, userAuth) {
    this.apiConfig = apiConfig;
    this.userAuth = userAuth;
    this.connected = false;
  }
  
  async initialize() {
    try {
      // Konfiguracja połączenia z Huawei Health Kit API
      this.client = new HuaweiHealthKit({
        clientId: this.apiConfig.clientId,
        clientSecret: this.apiConfig.clientSecret,
        scopes: [
          'https://health-api.cloud.huawei.com/healthkit.sleep.read',
          'https://health-api.cloud.huawei.com/healthkit.activity.read',
          'https://health-api.cloud.huawei.com/healthkit.heartrate.read',
          'https://health-api.cloud.huawei.com/healthkit.stress.read'
        ]
      });
      
      // Autoryzacja użytkownika
      const authResult = await this.client.authorize(this.userAuth);
      this.accessToken = authResult.access_token;
      this.refreshToken = authResult.refresh_token;
      this.connected = true;
      
      return true;
    } catch (error) {
      console.error('Failed to initialize Huawei Health connection:', error);
      return false;
    }
  }
  
  async getSleepData(startDate, endDate) {
    if (!this.connected) await this.initialize();
    
    try {
      const response = await this.client.getSleepRecords({
        accessToken: this.accessToken,
        startTime: startDate.getTime(),
        endTime: endDate.getTime(),
        dataTypes: ['sleep_stage', 'sleep_score']
      });
      
      // Przetwarzanie i normalizacja danych o śnie
      return this.processSleepData(response);
    } catch (error) {
      console.error('Failed to fetch sleep data:', error);
      return null;
    }
  }
  
  processSleepData(rawData) {
    // Przetwarzanie i normalizacja danych o śnie
    const sleepData = {
      records: [],
      summary: {}
    };
    
    // Przetwarzanie poszczególnych rekordów snu
    if (rawData.sleepRecords && rawData.sleepRecords.length > 0) {
      sleepData.records = rawData.sleepRecords.map(record => ({
        start_time: new Date(record.startTime),
        end_time: new Date(record.endTime),
        duration_minutes: Math.round((record.endTime - record.startTime) / 60000),
        sleep_stages: this.processSleepStages(record.sleepStages),
        sleep_score: record.sleepScore || null
      }));
      
      // Generowanie podsumowania
      sleepData.summary = this.generateSleepSummary(sleepData.records);
    }
    
    return sleepData;
  }
  
  processSleepStages(stages) {
    // Konwersja etapów snu na znormalizowany format
    const stageMap = {
      0: 'awake',
      1: 'light_sleep',
      2: 'deep_sleep',
      3: 'rem'
    };
    
    return stages.map(stage => ({
      stage_type: stageMap[stage.stageType] || 'unknown',
      start_time: new Date(stage.startTime),
      end_time: new Date(stage.endTime),
      duration_minutes: Math.round((stage.endTime - stage.startTime) / 60000)
    }));
  }
  
  async getActivityData(startDate, endDate) {
    if (!this.connected) await this.initialize();
    
    try {
      const response = await this.client.getDailyActivityRecords({
        accessToken: this.accessToken,
        startDate: this.formatDate(startDate),
        endDate: this.formatDate(endDate),
        dataTypes: ['step_count', 'distance', 'calories']
      });
      
      return this.processActivityData(response);
    } catch (error) {
      console.error('Failed to fetch activity data:', error);
      return null;
    }
  }
  
  async getHeartRateData(startDate, endDate) {
    if (!this.connected) await this.initialize();
    
    try {
      const response = await this.client.getHeartRateRecords({
        accessToken: this.accessToken,
        startTime: startDate.getTime(),
        endTime: endDate.getTime(),
        dataTypes: ['instant', 'resting', 'max']
      });
      
      return this.processHeartRateData(response);
    } catch (error) {
      console.error('Failed to fetch heart rate data:', error);
      return null;
    }
  }
  
  async getStressData(startDate, endDate) {
    if (!this.connected) await this.initialize();
    
    try {
      const response = await this.client.getStressRecords({
        accessToken: this.accessToken,
        startTime: startDate.getTime(),
        endTime: endDate.getTime()
      });
      
      return this.processStressData(response);
    } catch (error) {
      console.error('Failed to fetch stress data:', error);
      return null;
    }
  }
  
  // Inne metody pomocnicze i obsługi API
}
```

### 3.3. Integracja danych zdrowotnych z terapią

```javascript
class TherapyHealthIntegrator {
  constructor(healthDataManager, sessionManager) {
    this.healthDataManager = healthDataManager;
    this.sessionManager = sessionManager;
  }
  
  async prepareHealthContextForSession(upcomingSessionId) {
    // Pobieranie danych o ostatniej sesji
    const lastSession = await this.sessionManager.getLastCompletedSession();
    const lastSessionDate = lastSession ? new Date(lastSession.end_time) : null;
    
    // Ustalanie zakresu dat do analizy
    const now = new Date();
    const startDate = lastSessionDate || new Date(now - 14 * 24 * 60 * 60 * 1000); // 2 tygodnie wstecz
    
    // Pobieranie różnych typów danych zdrowotnych
    const sleepData = await this.healthDataManager.getSleepDataBetween(startDate, now);
    const activityData = await this.healthDataManager.getActivityDataBetween(startDate, now);
    const heartRateData = await this.healthDataManager.getHeartRateDataBetween(startDate, now);
    const stressData = await this.healthDataManager.getStressDataBetween(startDate, now);
    
    // Analiza i generowanie spostrzeżeń
    const healthInsights = this.analyzeHealthData({
      sleep: sleepData,
      activity: activityData,
      heart_rate: heartRateData,
      stress: stressData
    });
    
    // Przygotowanie kontekstu dla sesji
    return {
      health_data_summary: {
        sleep: this.prepareSleepSummary(sleepData),
        activity: this.prepareActivitySummary(activityData),
        heart_rate: this.prepareHeartRateSummary(heartRateData),
        stress: this.prepareStressSummary(stressData)
      },
      health_insights: healthInsights,
      visualization_data: this.prepareVisualizationData({
        sleep: sleepData,
        activity: activityData,
        heart_rate: heartRateData,
        stress: stressData
      })
    };
  }
  
  prepareSleepSummary(sleepData) {
    if (!sleepData || !sleepData.records || sleepData.records.length === 0) {
      return { available: false };
    }
    