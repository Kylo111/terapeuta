# Struktura Stanu Aplikacji "Terapeuta"

## 1. Przegląd

Struktura stanu aplikacji "Terapeuta" jest zaprojektowana z myślą o efektywnym zarządzaniu danymi w aplikacji webowej i mobilnej. Wykorzystuje Redux jako główne narzędzie do zarządzania stanem, z Redux Toolkit do uproszczenia kodu i Redux Persist do przechowywania danych lokalnie.

## 2. Architektura stanu

### 2.1. Diagram architektury stanu

```
+------------------------------------------------------------------+
|                                                                  |
|                         Redux Store                              |
|                                                                  |
+------------------------------------------------------------------+
         |                |                |                |
         v                v                v                v
+----------------+ +----------------+ +----------------+ +----------------+
|                | |                | |                | |                |
| Auth Slice     | | User Slice     | | Profiles Slice | | Sessions Slice |
|                | |                | |                | |                |
+----------------+ +----------------+ +----------------+ +----------------+
         |                |                |                |
         v                v                v                v
+----------------+ +----------------+ +----------------+ +----------------+
|                | |                | |                | |                |
| Tasks Slice    | | Therapy Slice  | | LLM Slice      | | UI Slice       |
|                | |                | |                | |                |
+----------------+ +----------------+ +----------------+ +----------------+
```

### 2.2. Główne slice'y stanu

1. **Auth Slice** - Stan autentykacji użytkownika
2. **User Slice** - Dane użytkownika i ustawienia
3. **Profiles Slice** - Profile terapeutyczne
4. **Sessions Slice** - Sesje terapeutyczne
5. **Tasks Slice** - Zadania terapeutyczne
6. **Therapy Slice** - Metody terapii i techniki
7. **LLM Slice** - Integracja z modelami LLM
8. **UI Slice** - Stan interfejsu użytkownika

## 3. Szczegółowa struktura stanu

### 3.1. Auth Slice

```javascript
{
  auth: {
    isAuthenticated: boolean,
    token: string | null,
    refreshToken: string | null,
    expiresAt: number | null,
    isLoading: boolean,
    error: string | null
  }
}
```

#### 3.1.1. Akcje

- `login` - Logowanie użytkownika
- `logout` - Wylogowanie użytkownika
- `refreshToken` - Odświeżenie tokenu
- `register` - Rejestracja nowego użytkownika
- `resetPassword` - Resetowanie hasła

### 3.2. User Slice

```javascript
{
  user: {
    id: string | null,
    email: string | null,
    firstName: string | null,
    lastName: string | null,
    settings: {
      preferredLLMProvider: string,
      preferredModel: string,
      theme: string,
      language: string,
      notifications: {
        email: boolean,
        push: boolean
      }
    },
    activity: {
      items: Array<Activity>,
      pagination: {
        page: number,
        limit: number,
        total: number,
        pages: number
      },
      isLoading: boolean
    },
    devices: {
      items: Array<Device>,
      isLoading: boolean
    },
    isLoading: boolean,
    error: string | null
  }
}
```

#### 3.2.1. Akcje

- `fetchUser` - Pobieranie danych użytkownika
- `updateUser` - Aktualizacja danych użytkownika
- `updateSettings` - Aktualizacja ustawień użytkownika
- `fetchActivity` - Pobieranie historii aktywności
- `fetchDevices` - Pobieranie listy urządzeń
- `logoutDevice` - Wylogowanie z urządzenia

### 3.3. Profiles Slice

```javascript
{
  profiles: {
    items: Array<Profile>,
    currentProfile: Profile | null,
    isLoading: boolean,
    error: string | null
  }
}
```

#### 3.3.1. Akcje

- `fetchProfiles` - Pobieranie listy profili
- `fetchProfile` - Pobieranie szczegółów profilu
- `createProfile` - Tworzenie nowego profilu
- `updateProfile` - Aktualizacja profilu
- `deleteProfile` - Usuwanie profilu
- `updateEmotionalState` - Aktualizacja stanu emocjonalnego
- `addGoal` - Dodawanie celu
- `updateGoal` - Aktualizacja celu
- `deleteGoal` - Usuwanie celu
- `addChallenge` - Dodawanie wyzwania
- `updateTherapyProgress` - Aktualizacja postępu terapii
- `setCurrentProfile` - Ustawienie aktualnego profilu

### 3.4. Sessions Slice

```javascript
{
  sessions: {
    items: Array<Session>,
    currentSession: {
      data: Session | null,
      conversation: Array<Message>,
      isActive: boolean,
      isLoading: boolean,
      error: string | null
    },
    pagination: {
      page: number,
      limit: number,
      total: number,
      pages: number
    },
    isLoading: boolean,
    error: string | null
  }
}
```

#### 3.4.1. Akcje

- `fetchSessions` - Pobieranie listy sesji
- `fetchSession` - Pobieranie szczegółów sesji
- `createSession` - Tworzenie nowej sesji
- `addMessage` - Dodawanie wiadomości do sesji
- `endSession` - Kończenie sesji
- `fetchSummary` - Pobieranie podsumowania sesji
- `exportSession` - Eksport sesji
- `generateResponse` - Generowanie odpowiedzi LLM
- `setCurrentSession` - Ustawienie aktualnej sesji

### 3.5. Tasks Slice

```javascript
{
  tasks: {
    items: Array<Task>,
    currentTask: Task | null,
    pagination: {
      page: number,
      limit: number,
      total: number,
      pages: number
    },
    filters: {
      status: string | null,
      category: string | null,
      priority: string | null,
      startDate: string | null,
      endDate: string | null
    },
    isLoading: boolean,
    error: string | null
  }
}
```

#### 3.5.1. Akcje

- `fetchTasks` - Pobieranie listy zadań
- `fetchTask` - Pobieranie szczegółów zadania
- `createTask` - Tworzenie nowego zadania
- `updateTask` - Aktualizacja zadania
- `deleteTask` - Usuwanie zadania
- `completeTask` - Oznaczanie zadania jako ukończonego
- `incompleteTask` - Oznaczanie zadania jako nieukończonego
- `addReminder` - Dodawanie przypomnienia
- `deleteReminder` - Usuwanie przypomnienia
- `updateDiscussion` - Aktualizacja statusu omówienia zadania
- `setFilters` - Ustawienie filtrów zadań
- `setCurrentTask` - Ustawienie aktualnego zadania

### 3.6. Therapy Slice

```javascript
{
  therapy: {
    methods: {
      items: Array<TherapyMethod>,
      currentMethod: TherapyMethod | null,
      isLoading: boolean
    },
    techniques: {
      items: Array<Technique>,
      currentTechnique: Technique | null,
      isLoading: boolean
    },
    sampleTasks: {
      items: Array<SampleTask>,
      isLoading: boolean
    },
    error: string | null
  }
}
```

#### 3.6.1. Akcje

- `fetchMethods` - Pobieranie listy metod terapii
- `fetchMethod` - Pobieranie szczegółów metody terapii
- `fetchTechniques` - Pobieranie technik dla metody terapii
- `fetchTechnique` - Pobieranie szczegółów techniki
- `fetchSampleTasks` - Pobieranie przykładowych zadań
- `fetchSampleTask` - Pobieranie szczegółów przykładowego zadania
- `setCurrentMethod` - Ustawienie aktualnej metody terapii
- `setCurrentTechnique` - Ustawienie aktualnej techniki

### 3.7. LLM Slice

```javascript
{
  llm: {
    providers: {
      items: Array<Provider>,
      currentProvider: Provider | null,
      isLoading: boolean
    },
    models: {
      items: Array<Model>,
      currentModel: Model | null,
      isLoading: boolean
    },
    keys: {
      items: Array<ApiKeyStatus>,
      isLoading: boolean
    },
    generation: {
      isLoading: boolean,
      error: string | null
    },
    error: string | null
  }
}
```

#### 3.7.1. Akcje

- `fetchProviders` - Pobieranie listy dostawców LLM
- `fetchProvider` - Pobieranie szczegółów dostawcy LLM
- `fetchModels` - Pobieranie modeli dostawcy LLM
- `generateResponse` - Generowanie odpowiedzi
- `generateEmbeddings` - Generowanie embeddingów
- `countTokens` - Obliczanie liczby tokenów
- `updateApiKey` - Aktualizacja klucza API
- `fetchApiKeys` - Pobieranie statusu kluczy API
- `setCurrentProvider` - Ustawienie aktualnego dostawcy LLM
- `setCurrentModel` - Ustawienie aktualnego modelu

### 3.8. UI Slice

```javascript
{
  ui: {
    theme: string,
    sidebar: {
      isOpen: boolean
    },
    modal: {
      isOpen: boolean,
      type: string | null,
      props: object | null
    },
    toast: {
      isVisible: boolean,
      type: string | null,
      message: string | null,
      duration: number
    },
    loading: {
      global: boolean,
      components: {
        [componentId: string]: boolean
      }
    },
    errors: {
      global: string | null,
      components: {
        [componentId: string]: string | null
      }
    }
  }
}
```

#### 3.8.1. Akcje

- `setTheme` - Ustawienie motywu
- `toggleSidebar` - Przełączanie widoczności sidebar
- `openModal` - Otwieranie modalu
- `closeModal` - Zamykanie modalu
- `showToast` - Wyświetlanie powiadomienia
- `hideToast` - Ukrywanie powiadomienia
- `setLoading` - Ustawienie stanu ładowania
- `setError` - Ustawienie błędu

## 4. Selektory

### 4.1. Auth Selectors

- `selectIsAuthenticated` - Czy użytkownik jest zalogowany
- `selectAuthToken` - Token autoryzacyjny
- `selectAuthError` - Błąd autentykacji

### 4.2. User Selectors

- `selectUser` - Dane użytkownika
- `selectUserSettings` - Ustawienia użytkownika
- `selectUserActivity` - Historia aktywności użytkownika
- `selectUserDevices` - Lista urządzeń użytkownika

### 4.3. Profiles Selectors

- `selectProfiles` - Lista profili
- `selectCurrentProfile` - Aktualny profil
- `selectProfileGoals` - Cele aktualnego profilu
- `selectProfileChallenges` - Wyzwania aktualnego profilu
- `selectProfileEmotionalState` - Stan emocjonalny aktualnego profilu
- `selectProfileTherapyProgress` - Postęp terapii aktualnego profilu

### 4.4. Sessions Selectors

- `selectSessions` - Lista sesji
- `selectCurrentSession` - Aktualna sesja
- `selectSessionConversation` - Konwersacja aktualnej sesji
- `selectSessionSummary` - Podsumowanie aktualnej sesji
- `selectSessionMetrics` - Metryki aktualnej sesji

### 4.5. Tasks Selectors

- `selectTasks` - Lista zadań
- `selectCurrentTask` - Aktualne zadanie
- `selectTasksByStatus` - Zadania według statusu
- `selectTasksByCategory` - Zadania według kategorii
- `selectTasksByPriority` - Zadania według priorytetu
- `selectUpcomingTasks` - Nadchodzące zadania
- `selectOverdueTasks` - Zaległe zadania

### 4.6. Therapy Selectors

- `selectTherapyMethods` - Lista metod terapii
- `selectCurrentMethod` - Aktualna metoda terapii
- `selectTechniques` - Lista technik dla aktualnej metody
- `selectCurrentTechnique` - Aktualna technika
- `selectSampleTasks` - Lista przykładowych zadań

### 4.7. LLM Selectors

- `selectLLMProviders` - Lista dostawców LLM
- `selectCurrentProvider` - Aktualny dostawca LLM
- `selectModels` - Lista modeli aktualnego dostawcy
- `selectCurrentModel` - Aktualny model
- `selectApiKeys` - Status kluczy API

### 4.8. UI Selectors

- `selectTheme` - Aktualny motyw
- `selectIsSidebarOpen` - Czy sidebar jest otwarty
- `selectModal` - Dane modalu
- `selectToast` - Dane powiadomienia
- `selectIsLoading` - Czy trwa ładowanie
- `selectErrors` - Błędy

## 5. Middleware

### 5.1. API Middleware

Middleware do komunikacji z API, obsługujący:
- Dodawanie tokenów autoryzacyjnych do żądań
- Odświeżanie tokenów
- Obsługę błędów
- Transformację danych

### 5.2. Persistence Middleware

Middleware do przechowywania danych lokalnie, wykorzystujący:
- Redux Persist do przechowywania stanu w localStorage/AsyncStorage
- Selektywne przechowywanie danych (whitelist/blacklist)
- Szyfrowanie wrażliwych danych

### 5.3. Analytics Middleware

Middleware do śledzenia akcji użytkownika, obsługujący:
- Śledzenie akcji Redux
- Wysyłanie danych do systemu analitycznego
- Anonimizację danych

### 5.4. Error Middleware

Middleware do obsługi błędów, obsługujący:
- Logowanie błędów
- Wyświetlanie powiadomień o błędach
- Wysyłanie raportów o błędach do Sentry

## 6. Synchronizacja danych

### 6.1. Strategia synchronizacji

Aplikacja implementuje strategię synchronizacji danych między urządzeniami:
- Dane są przechowywane lokalnie w Redux Store
- Zmiany są synchronizowane z serwerem, gdy urządzenie jest online
- W przypadku konfliktu, priorytet ma nowsza wersja danych
- Sesje terapeutyczne są synchronizowane w czasie rzeczywistym, gdy jest to możliwe

### 6.2. Obsługa trybu offline

Aplikacja obsługuje tryb offline:
- Akcje są kolejkowane, gdy urządzenie jest offline
- Po przywróceniu połączenia, akcje są wykonywane w kolejności
- Konflikty są rozwiązywane automatycznie lub z udziałem użytkownika

## 7. Przykłady użycia

### 7.1. Logowanie użytkownika

```javascript
// Akcja
dispatch(login({ email, password }));

// Selektor
const isAuthenticated = useSelector(selectIsAuthenticated);
const authError = useSelector(selectAuthError);

// Komponent
if (isAuthenticated) {
  return <Dashboard />;
} else {
  return <LoginForm error={authError} />;
}
```

### 7.2. Tworzenie nowej sesji

```javascript
// Akcja
dispatch(createSession({ profileId, therapyMethod }));

// Selektor
const currentSession = useSelector(selectCurrentSession);
const isLoading = useSelector(state => state.sessions.isLoading);

// Komponent
if (isLoading) {
  return <LoadingSpinner />;
} else if (currentSession) {
  return <SessionView session={currentSession} />;
} else {
  return <ErrorMessage />;
}
```

### 7.3. Dodawanie wiadomości do sesji

```javascript
// Akcja
dispatch(addMessage({ sessionId, content }));

// Selektor
const conversation = useSelector(selectSessionConversation);

// Komponent
return (
  <div>
    {conversation.map(message => (
      <MessageBubble key={message.timestamp} message={message} />
    ))}
    <MessageInput onSend={content => dispatch(addMessage({ sessionId, content }))} />
  </div>
);
```

### 7.4. Oznaczanie zadania jako ukończonego

```javascript
// Akcja
dispatch(completeTask({ taskId, completionData }));

// Selektor
const tasks = useSelector(selectTasks);
const pendingTasks = useSelector(state => selectTasksByStatus(state, 'pending'));

// Komponent
return (
  <TaskList
    tasks={pendingTasks}
    onComplete={taskId => dispatch(completeTask({ taskId }))}
  />
);
```

## 8. Podsumowanie

Struktura stanu aplikacji "Terapeuta" jest zaprojektowana z myślą o:
- Modularności i łatwości utrzymania
- Wydajności i skalowalności
- Obsłudze trybu offline
- Synchronizacji danych między urządzeniami

Kluczowe aspekty struktury stanu:
- Podział na logiczne slice'y
- Selektory do efektywnego pobierania danych
- Middleware do obsługi efektów ubocznych
- Strategia synchronizacji danych
