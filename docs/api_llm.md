# Dokumentacja API LLM

## 1. Przegląd

Endpointy LLM umożliwiają integrację z modelami językowymi (LLM) różnych dostawców.

## 2. Endpointy

### 2.1. Pobieranie listy dostawców LLM

Pobiera listę dostępnych dostawców modeli LLM.

#### Żądanie

```
GET /api/llm/providers
```

#### Nagłówki

| Nagłówek | Wartość | Wymagany | Opis |
|----------|---------|----------|------|
| Authorization | Bearer {token} | Tak | Token dostępu |

#### Odpowiedź

```json
{
  "success": true,
  "data": {
    "providers": [
      {
        "id": "openai",
        "name": "OpenAI",
        "description": "Dostawca modeli GPT",
        "models": [
          {
            "id": "gpt-4",
            "name": "GPT-4",
            "description": "Najbardziej zaawansowany model GPT",
            "maxTokens": 8192,
            "capabilities": ["chat", "completion", "function_calling"]
          },
          {
            "id": "gpt-3.5-turbo",
            "name": "GPT-3.5 Turbo",
            "description": "Szybki i efektywny model GPT",
            "maxTokens": 4096,
            "capabilities": ["chat", "completion", "function_calling"]
          }
        ],
        "embeddingModels": [
          {
            "id": "text-embedding-3-small",
            "name": "Text Embedding 3 Small",
            "description": "Model do generowania embeddingów",
            "dimensions": 1536
          }
        ]
      },
      {
        "id": "anthropic",
        "name": "Anthropic",
        "description": "Dostawca modeli Claude",
        "models": [
          {
            "id": "claude-3-opus-20240229",
            "name": "Claude 3 Opus",
            "description": "Najbardziej zaawansowany model Claude",
            "maxTokens": 200000,
            "capabilities": ["chat", "completion", "function_calling"]
          },
          {
            "id": "claude-3-sonnet-20240229",
            "name": "Claude 3 Sonnet",
            "description": "Zrównoważony model Claude",
            "maxTokens": 200000,
            "capabilities": ["chat", "completion", "function_calling"]
          }
        ],
        "embeddingModels": []
      },
      {
        "id": "google",
        "name": "Google",
        "description": "Dostawca modeli Gemini",
        "models": [
          {
            "id": "gemini-pro",
            "name": "Gemini Pro",
            "description": "Zaawansowany model Gemini",
            "maxTokens": 32768,
            "capabilities": ["chat", "completion", "function_calling"]
          }
        ],
        "embeddingModels": [
          {
            "id": "text-embedding-gecko",
            "name": "Text Embedding Gecko",
            "description": "Model do generowania embeddingów",
            "dimensions": 768
          }
        ]
      },
      {
        "id": "ollama",
        "name": "Ollama",
        "description": "Lokalne modele LLM",
        "models": [
          {
            "id": "llama3",
            "name": "Llama 3",
            "description": "Lokalny model Llama 3",
            "maxTokens": 4096,
            "capabilities": ["chat", "completion"]
          },
          {
            "id": "mistral",
            "name": "Mistral",
            "description": "Lokalny model Mistral",
            "maxTokens": 4096,
            "capabilities": ["chat", "completion"]
          }
        ],
        "embeddingModels": [
          {
            "id": "nomic-embed-text",
            "name": "Nomic Embed Text",
            "description": "Model do generowania embeddingów",
            "dimensions": 768
          }
        ]
      }
    ]
  },
  "message": "Lista dostawców LLM pobrana"
}
```

#### Kody błędów

| Kod HTTP | Kod błędu | Opis |
|----------|-----------|------|
| 401 | UNAUTHORIZED | Brak autoryzacji |

### 2.2. Pobieranie szczegółów dostawcy LLM

Pobiera szczegółowe informacje o dostawcy modeli LLM.

#### Żądanie

```
GET /api/llm/providers/{providerId}
```

#### Nagłówki

| Nagłówek | Wartość | Wymagany | Opis |
|----------|---------|----------|------|
| Authorization | Bearer {token} | Tak | Token dostępu |

#### Odpowiedź

```json
{
  "success": true,
  "data": {
    "provider": {
      "id": "openai",
      "name": "OpenAI",
      "description": "Dostawca modeli GPT",
      "website": "https://openai.com",
      "apiDocumentation": "https://platform.openai.com/docs/api-reference",
      "models": [
        {
          "id": "gpt-4",
          "name": "GPT-4",
          "description": "Najbardziej zaawansowany model GPT",
          "maxTokens": 8192,
          "capabilities": ["chat", "completion", "function_calling"],
          "pricing": {
            "inputTokens": 0.00003,
            "outputTokens": 0.00006,
            "currency": "USD"
          }
        },
        {
          "id": "gpt-3.5-turbo",
          "name": "GPT-3.5 Turbo",
          "description": "Szybki i efektywny model GPT",
          "maxTokens": 4096,
          "capabilities": ["chat", "completion", "function_calling"],
          "pricing": {
            "inputTokens": 0.000001,
            "outputTokens": 0.000002,
            "currency": "USD"
          }
        }
      ],
      "embeddingModels": [
        {
          "id": "text-embedding-3-small",
          "name": "Text Embedding 3 Small",
          "description": "Model do generowania embeddingów",
          "dimensions": 1536,
          "pricing": {
            "inputTokens": 0.00000002,
            "currency": "USD"
          }
        }
      ],
      "features": {
        "streaming": true,
        "functionCalling": true,
        "visionCapabilities": true
      },
      "limitations": {
        "rateLimit": "3000 RPM",
        "contextWindow": "8K-32K tokens depending on model"
      }
    }
  },
  "message": "Szczegóły dostawcy LLM pobrane"
}
```

#### Kody błędów

| Kod HTTP | Kod błędu | Opis |
|----------|-----------|------|
| 401 | UNAUTHORIZED | Brak autoryzacji |
| 404 | PROVIDER_NOT_FOUND | Dostawca LLM nie został znaleziony |

### 2.3. Pobieranie modeli dostawcy LLM

Pobiera listę modeli dla określonego dostawcy LLM.

#### Żądanie

```
GET /api/llm/providers/{providerId}/models
```

#### Nagłówki

| Nagłówek | Wartość | Wymagany | Opis |
|----------|---------|----------|------|
| Authorization | Bearer {token} | Tak | Token dostępu |

#### Parametry zapytania

| Parametr | Typ | Wymagany | Opis |
|----------|-----|----------|------|
| type | string | Nie | Typ modelu (chat, embedding) |
| capability | string | Nie | Wymagana funkcjonalność (np. function_calling) |

#### Odpowiedź

```json
{
  "success": true,
  "data": {
    "models": [
      {
        "id": "gpt-4",
        "name": "GPT-4",
        "description": "Najbardziej zaawansowany model GPT",
        "maxTokens": 8192,
        "capabilities": ["chat", "completion", "function_calling"],
        "pricing": {
          "inputTokens": 0.00003,
          "outputTokens": 0.00006,
          "currency": "USD"
        }
      },
      {
        "id": "gpt-3.5-turbo",
        "name": "GPT-3.5 Turbo",
        "description": "Szybki i efektywny model GPT",
        "maxTokens": 4096,
        "capabilities": ["chat", "completion", "function_calling"],
        "pricing": {
          "inputTokens": 0.000001,
          "outputTokens": 0.000002,
          "currency": "USD"
        }
      }
    ]
  },
  "message": "Lista modeli pobrana"
}
```

#### Kody błędów

| Kod HTTP | Kod błędu | Opis |
|----------|-----------|------|
| 400 | INVALID_TYPE | Nieprawidłowy typ modelu |
| 400 | INVALID_CAPABILITY | Nieprawidłowa funkcjonalność |
| 401 | UNAUTHORIZED | Brak autoryzacji |
| 404 | PROVIDER_NOT_FOUND | Dostawca LLM nie został znaleziony |

### 2.4. Generowanie odpowiedzi

Generuje odpowiedź od modelu LLM.

#### Żądanie

```
POST /api/llm/generate
```

#### Nagłówki

| Nagłówek | Wartość | Wymagany | Opis |
|----------|---------|----------|------|
| Authorization | Bearer {token} | Tak | Token dostępu |

#### Parametry żądania

| Parametr | Typ | Wymagany | Opis |
|----------|-----|----------|------|
| provider | string | Tak | ID dostawcy LLM |
| model | string | Tak | ID modelu |
| messages | array | Tak | Lista wiadomości |
| messages[].role | string | Tak | Rola (system, assistant, user) |
| messages[].content | string | Tak | Treść wiadomości |
| options | object | Nie | Dodatkowe opcje |
| options.temperature | number | Nie | Temperatura (0-1) |
| options.maxTokens | number | Nie | Maksymalna liczba tokenów |
| options.stream | boolean | Nie | Czy odpowiedź ma być strumieniowana |
| options.functions | array | Nie | Definicje funkcji dla function calling |

#### Przykładowe żądanie

```json
{
  "provider": "openai",
  "model": "gpt-4",
  "messages": [
    {
      "role": "system",
      "content": "Jesteś terapeutą prowadzącym sesję terapii poznawczo-behawioralnej."
    },
    {
      "role": "user",
      "content": "Czuję się przygnębiony i mam trudności z koncentracją."
    }
  ],
  "options": {
    "temperature": 0.7,
    "maxTokens": 1000
  }
}
```

#### Odpowiedź

```json
{
  "success": true,
  "data": {
    "response": {
      "content": "Dziękuję za podzielenie się tym, co czujesz. Przygnębienie i trudności z koncentracją to częste doświadczenia, które mogą być bardzo obciążające. W terapii poznawczo-behawioralnej zaczynamy od zrozumienia, jak myśli wpływają na nasze emocje i zachowania.\n\nCzy mógłbyś powiedzieć więcej o tym, kiedy zacząłeś zauważać te uczucia? Czy są jakieś konkretne sytuacje, w których czujesz się szczególnie przygnębiony lub masz większe trudności z koncentracją?",
      "role": "assistant",
      "provider": "openai",
      "model": "gpt-4",
      "usage": {
        "promptTokens": 45,
        "completionTokens": 112,
        "totalTokens": 157
      }
    }
  },
  "message": "Odpowiedź wygenerowana"
}
```

#### Kody błędów

| Kod HTTP | Kod błędu | Opis |
|----------|-----------|------|
| 400 | INVALID_PROVIDER | Nieprawidłowy dostawca LLM |
| 400 | INVALID_MODEL | Nieprawidłowy model |
| 400 | INVALID_MESSAGES | Nieprawidłowe wiadomości |
| 400 | INVALID_TEMPERATURE | Nieprawidłowa temperatura |
| 400 | INVALID_MAX_TOKENS | Nieprawidłowa maksymalna liczba tokenów |
| 401 | UNAUTHORIZED | Brak autoryzacji |
| 404 | PROVIDER_NOT_FOUND | Dostawca LLM nie został znaleziony |
| 404 | MODEL_NOT_FOUND | Model nie został znaleziony |
| 429 | RATE_LIMIT_EXCEEDED | Przekroczono limit szybkości |
| 500 | PROVIDER_ERROR | Błąd dostawcy LLM |

### 2.5. Generowanie embeddingów

Generuje embeddingi dla podanego tekstu.

#### Żądanie

```
POST /api/llm/embeddings
```

#### Nagłówki

| Nagłówek | Wartość | Wymagany | Opis |
|----------|---------|----------|------|
| Authorization | Bearer {token} | Tak | Token dostępu |

#### Parametry żądania

| Parametr | Typ | Wymagany | Opis |
|----------|-----|----------|------|
| provider | string | Tak | ID dostawcy LLM |
| model | string | Tak | ID modelu embeddingów |
| input | string | Tak | Tekst do wygenerowania embeddingów |

#### Przykładowe żądanie

```json
{
  "provider": "openai",
  "model": "text-embedding-3-small",
  "input": "Czuję się przygnębiony i mam trudności z koncentracją."
}
```

#### Odpowiedź

```json
{
  "success": true,
  "data": {
    "embedding": [
      0.0023064255,
      -0.009327292,
      0.008756912,
      // ... (pozostałe wartości embeddingu)
    ],
    "dimensions": 1536,
    "usage": {
      "promptTokens": 10,
      "totalTokens": 10
    }
  },
  "message": "Embeddingi wygenerowane"
}
```

#### Kody błędów

| Kod HTTP | Kod błędu | Opis |
|----------|-----------|------|
| 400 | INVALID_PROVIDER | Nieprawidłowy dostawca LLM |
| 400 | INVALID_MODEL | Nieprawidłowy model |
| 400 | INVALID_INPUT | Nieprawidłowy tekst wejściowy |
| 401 | UNAUTHORIZED | Brak autoryzacji |
| 404 | PROVIDER_NOT_FOUND | Dostawca LLM nie został znaleziony |
| 404 | MODEL_NOT_FOUND | Model nie został znaleziony |
| 429 | RATE_LIMIT_EXCEEDED | Przekroczono limit szybkości |
| 500 | PROVIDER_ERROR | Błąd dostawcy LLM |

### 2.6. Obliczanie liczby tokenów

Oblicza liczbę tokenów w podanym tekście.

#### Żądanie

```
POST /api/llm/tokens/count
```

#### Nagłówki

| Nagłówek | Wartość | Wymagany | Opis |
|----------|---------|----------|------|
| Authorization | Bearer {token} | Tak | Token dostępu |

#### Parametry żądania

| Parametr | Typ | Wymagany | Opis |
|----------|-----|----------|------|
| provider | string | Tak | ID dostawcy LLM |
| model | string | Tak | ID modelu |
| text | string | Tak | Tekst do obliczenia liczby tokenów |

#### Przykładowe żądanie

```json
{
  "provider": "openai",
  "model": "gpt-4",
  "text": "Czuję się przygnębiony i mam trudności z koncentracją."
}
```

#### Odpowiedź

```json
{
  "success": true,
  "data": {
    "tokens": 10
  },
  "message": "Liczba tokenów obliczona"
}
```

#### Kody błędów

| Kod HTTP | Kod błędu | Opis |
|----------|-----------|------|
| 400 | INVALID_PROVIDER | Nieprawidłowy dostawca LLM |
| 400 | INVALID_MODEL | Nieprawidłowy model |
| 400 | INVALID_TEXT | Nieprawidłowy tekst |
| 401 | UNAUTHORIZED | Brak autoryzacji |
| 404 | PROVIDER_NOT_FOUND | Dostawca LLM nie został znaleziony |
| 404 | MODEL_NOT_FOUND | Model nie został znaleziony |

### 2.7. Zarządzanie kluczami API

Zarządza kluczami API dla dostawców LLM.

#### Żądanie

```
PUT /api/llm/keys/{providerId}
```

#### Nagłówki

| Nagłówek | Wartość | Wymagany | Opis |
|----------|---------|----------|------|
| Authorization | Bearer {token} | Tak | Token dostępu |

#### Parametry żądania

| Parametr | Typ | Wymagany | Opis |
|----------|-----|----------|------|
| apiKey | string | Tak | Klucz API |

#### Przykładowe żądanie

```json
{
  "apiKey": "sk-1234567890abcdef1234567890abcdef"
}
```

#### Odpowiedź

```json
{
  "success": true,
  "data": {
    "provider": "openai",
    "status": "active",
    "lastUpdated": "2025-04-14T16:00:00Z"
  },
  "message": "Klucz API zaktualizowany"
}
```

#### Kody błędów

| Kod HTTP | Kod błędu | Opis |
|----------|-----------|------|
| 400 | INVALID_API_KEY | Nieprawidłowy klucz API |
| 401 | UNAUTHORIZED | Brak autoryzacji |
| 404 | PROVIDER_NOT_FOUND | Dostawca LLM nie został znaleziony |

### 2.8. Pobieranie statusu kluczy API

Pobiera status kluczy API dla dostawców LLM.

#### Żądanie

```
GET /api/llm/keys
```

#### Nagłówki

| Nagłówek | Wartość | Wymagany | Opis |
|----------|---------|----------|------|
| Authorization | Bearer {token} | Tak | Token dostępu |

#### Odpowiedź

```json
{
  "success": true,
  "data": {
    "keys": [
      {
        "provider": "openai",
        "status": "active",
        "lastUpdated": "2025-04-14T16:00:00Z"
      },
      {
        "provider": "anthropic",
        "status": "active",
        "lastUpdated": "2025-04-13T12:00:00Z"
      },
      {
        "provider": "google",
        "status": "not_configured",
        "lastUpdated": null
      },
      {
        "provider": "ollama",
        "status": "active",
        "lastUpdated": "2025-04-10T10:00:00Z"
      }
    ]
  },
  "message": "Status kluczy API pobrany"
}
```

#### Kody błędów

| Kod HTTP | Kod błędu | Opis |
|----------|-----------|------|
| 401 | UNAUTHORIZED | Brak autoryzacji |

## 3. Modele danych

### 3.1. Provider

```json
{
  "id": "openai",
  "name": "OpenAI",
  "description": "Dostawca modeli GPT",
  "website": "https://openai.com",
  "apiDocumentation": "https://platform.openai.com/docs/api-reference",
  "models": [
    {
      "id": "gpt-4",
      "name": "GPT-4",
      "description": "Najbardziej zaawansowany model GPT",
      "maxTokens": 8192,
      "capabilities": ["chat", "completion", "function_calling"],
      "pricing": {
        "inputTokens": 0.00003,
        "outputTokens": 0.00006,
        "currency": "USD"
      }
    }
  ],
  "embeddingModels": [
    {
      "id": "text-embedding-3-small",
      "name": "Text Embedding 3 Small",
      "description": "Model do generowania embeddingów",
      "dimensions": 1536,
      "pricing": {
        "inputTokens": 0.00000002,
        "currency": "USD"
      }
    }
  ],
  "features": {
    "streaming": true,
    "functionCalling": true,
    "visionCapabilities": true
  },
  "limitations": {
    "rateLimit": "3000 RPM",
    "contextWindow": "8K-32K tokens depending on model"
  }
}
```

### 3.2. Model

```json
{
  "id": "gpt-4",
  "name": "GPT-4",
  "description": "Najbardziej zaawansowany model GPT",
  "maxTokens": 8192,
  "capabilities": ["chat", "completion", "function_calling"],
  "pricing": {
    "inputTokens": 0.00003,
    "outputTokens": 0.00006,
    "currency": "USD"
  }
}
```

### 3.3. EmbeddingModel

```json
{
  "id": "text-embedding-3-small",
  "name": "Text Embedding 3 Small",
  "description": "Model do generowania embeddingów",
  "dimensions": 1536,
  "pricing": {
    "inputTokens": 0.00000002,
    "currency": "USD"
  }
}
```

### 3.4. Message

```json
{
  "role": "user",
  "content": "Czuję się przygnębiony i mam trudności z koncentracją."
}
```

### 3.5. Response

```json
{
  "content": "Dziękuję za podzielenie się tym, co czujesz. Przygnębienie i trudności z koncentracją to częste doświadczenia, które mogą być bardzo obciążające. W terapii poznawczo-behawioralnej zaczynamy od zrozumienia, jak myśli wpływają na nasze emocje i zachowania.\n\nCzy mógłbyś powiedzieć więcej o tym, kiedy zacząłeś zauważać te uczucia? Czy są jakieś konkretne sytuacje, w których czujesz się szczególnie przygnębiony lub masz większe trudności z koncentracją?",
  "role": "assistant",
  "provider": "openai",
  "model": "gpt-4",
  "usage": {
    "promptTokens": 45,
    "completionTokens": 112,
    "totalTokens": 157
  }
}
```

### 3.6. ApiKeyStatus

```json
{
  "provider": "openai",
  "status": "active",
  "lastUpdated": "2025-04-14T16:00:00Z"
}
```

## 4. Enumeracje

### 4.1. ProviderId

| Wartość | Opis |
|---------|------|
| openai | OpenAI |
| anthropic | Anthropic |
| google | Google |
| ollama | Ollama |

### 4.2. ModelCapability

| Wartość | Opis |
|---------|------|
| chat | Obsługa czatu |
| completion | Generowanie tekstu |
| function_calling | Wywoływanie funkcji |
| vision | Przetwarzanie obrazów |

### 4.3. MessageRole

| Wartość | Opis |
|---------|------|
| system | Wiadomość systemowa |
| assistant | Wiadomość asystenta |
| user | Wiadomość użytkownika |
| function | Wynik wywołania funkcji |

### 4.4. ApiKeyStatusValue

| Wartość | Opis |
|---------|------|
| active | Klucz API jest aktywny |
| invalid | Klucz API jest nieprawidłowy |
| expired | Klucz API wygasł |
| not_configured | Klucz API nie został skonfigurowany |
