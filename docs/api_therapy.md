# Dokumentacja API Terapii

## 1. Przegląd

Endpointy terapii umożliwiają dostęp do informacji o metodach terapii, technikach terapeutycznych i przykładowych zadaniach.

## 2. Endpointy

### 2.1. Pobieranie listy metod terapii

Pobiera listę dostępnych metod terapii.

#### Żądanie

```
GET /api/therapy/methods
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
    "methods": [
      {
        "id": "cognitive_behavioral",
        "name": "Terapia Poznawczo-Behawioralna (CBT)",
        "description": "Metoda terapii skupiająca się na identyfikacji i zmianie negatywnych wzorców myślenia oraz zachowań.",
        "principles": [
          "Terapia CBT koncentruje się na teraźniejszości i jest zorientowana na rozwiązania",
          "Pomaga klientowi identyfikować, kwestionować i zmieniać negatywne lub zniekształcone wzorce myślenia",
          "Uczy klienta rozpoznawać związek między myślami, emocjami i zachowaniami"
        ]
      },
      {
        "id": "psychodynamic",
        "name": "Terapia Psychodynamiczna",
        "description": "Metoda terapii skupiająca się na nieświadomych procesach psychicznych i ich wpływie na zachowanie.",
        "principles": [
          "Terapia psychodynamiczna koncentruje się na nieświadomych procesach i ich wpływie na zachowanie",
          "Pomaga klientowi zrozumieć, jak przeszłe doświadczenia wpływają na obecne problemy",
          "Wykorzystuje techniki takie jak wolne skojarzenia i analiza marzeń sennych"
        ]
      },
      {
        "id": "humanistic",
        "name": "Terapia Humanistyczno-Egzystencjalna",
        "description": "Metoda terapii skupiająca się na indywidualnym doświadczeniu i potencjale rozwojowym człowieka.",
        "principles": [
          "Terapia humanistyczna koncentruje się na indywidualnym doświadczeniu i potencjale rozwojowym",
          "Pomaga klientowi rozwijać samoświadomość i autentyczność",
          "Wykorzystuje techniki takie jak empatyczne słuchanie i bezwarunkowa akceptacja"
        ]
      },
      {
        "id": "systemic",
        "name": "Terapia Systemowa",
        "description": "Metoda terapii skupiająca się na relacjach i interakcjach w systemach społecznych.",
        "principles": [
          "Terapia systemowa koncentruje się na relacjach i interakcjach w systemach społecznych",
          "Pomaga klientowi zrozumieć, jak system rodzinny wpływa na jego problemy",
          "Wykorzystuje techniki takie jak genogram i rzeźba rodzinna"
        ]
      },
      {
        "id": "solution_focused",
        "name": "Terapia Krótkoterminowa Skoncentrowana na Rozwiązaniach",
        "description": "Metoda terapii skupiająca się na poszukiwaniu rozwiązań zamiast analizowania problemów.",
        "principles": [
          "Terapia skoncentrowana na rozwiązaniach koncentruje się na poszukiwaniu rozwiązań zamiast analizowania problemów",
          "Pomaga klientowi identyfikować wyjątki od problemu i budować na nich rozwiązania",
          "Wykorzystuje techniki takie jak pytanie o cud i skalowanie"
        ]
      }
    ]
  },
  "message": "Lista metod terapii pobrana"
}
```

#### Kody błędów

| Kod HTTP | Kod błędu | Opis |
|----------|-----------|------|
| 401 | UNAUTHORIZED | Brak autoryzacji |

### 2.2. Pobieranie szczegółów metody terapii

Pobiera szczegółowe informacje o metodzie terapii.

#### Żądanie

```
GET /api/therapy/methods/{methodId}
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
    "method": {
      "id": "cognitive_behavioral",
      "name": "Terapia Poznawczo-Behawioralna (CBT)",
      "description": "Metoda terapii skupiająca się na identyfikacji i zmianie negatywnych wzorców myślenia oraz zachowań.",
      "principles": [
        "Terapia CBT koncentruje się na teraźniejszości i jest zorientowana na rozwiązania",
        "Pomaga klientowi identyfikować, kwestionować i zmieniać negatywne lub zniekształcone wzorce myślenia",
        "Uczy klienta rozpoznawać związek między myślami, emocjami i zachowaniami",
        "Stosuje techniki takie jak restrukturyzacja poznawcza, ekspozycja, trening umiejętności i eksperymenty behawioralne",
        "Pracuje w sposób ustrukturyzowany, z jasnymi celami i zadaniami między sesjami"
      ],
      "history": "Terapia poznawczo-behawioralna została rozwinięta w latach 60. XX wieku przez Aarona Becka i Alberta Ellisa. Początkowo była stosowana w leczeniu depresji, ale z czasem jej zastosowanie rozszerzono na wiele innych zaburzeń.",
      "effectiveness": "CBT jest jedną z najlepiej zbadanych form psychoterapii. Badania wykazały jej skuteczność w leczeniu depresji, zaburzeń lękowych, zaburzeń obsesyjno-kompulsywnych, zaburzeń odżywiania i wielu innych problemów psychicznych.",
      "structure": "Typowa sesja CBT trwa 45-60 minut i ma określoną strukturę: przegląd zadań domowych, ustalenie agendy, praca nad głównymi tematami, podsumowanie i zadanie pracy domowej.",
      "techniques": [
        {
          "id": "cognitive_restructuring",
          "name": "Restrukturyzacja poznawcza"
        },
        {
          "id": "exposure",
          "name": "Ekspozycja"
        },
        {
          "id": "behavioral_activation",
          "name": "Aktywacja behawioralna"
        },
        {
          "id": "problem_solving",
          "name": "Trening umiejętności rozwiązywania problemów"
        },
        {
          "id": "relaxation",
          "name": "Techniki relaksacyjne"
        }
      ]
    }
  },
  "message": "Szczegóły metody terapii pobrane"
}
```

#### Kody błędów

| Kod HTTP | Kod błędu | Opis |
|----------|-----------|------|
| 401 | UNAUTHORIZED | Brak autoryzacji |
| 404 | METHOD_NOT_FOUND | Metoda terapii nie została znaleziona |

### 2.3. Pobieranie technik dla metody terapii

Pobiera listę technik dla określonej metody terapii.

#### Żądanie

```
GET /api/therapy/methods/{methodId}/techniques
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
    "techniques": [
      {
        "id": "cognitive_restructuring",
        "name": "Restrukturyzacja poznawcza",
        "description": "Technika polegająca na identyfikacji, kwestionowaniu i zmianie negatywnych lub zniekształconych wzorców myślenia.",
        "steps": [
          "Identyfikacja automatycznych myśli",
          "Rozpoznanie zniekształceń poznawczych",
          "Kwestionowanie myśli poprzez pytania sokratejskie",
          "Formułowanie alternatywnych, bardziej zrównoważonych myśli"
        ],
        "examples": [
          "Klient myśli: 'Jestem beznadziejny, nigdy mi się nic nie udaje'. Terapeuta pomaga mu zidentyfikować to jako nadmierne uogólnienie i znaleźć dowody przeciwko temu twierdzeniu."
        ]
      },
      {
        "id": "exposure",
        "name": "Ekspozycja",
        "description": "Technika polegająca na stopniowym i kontrolowanym wystawianiu się na sytuacje wywołujące lęk.",
        "steps": [
          "Stworzenie hierarchii sytuacji lękowych",
          "Rozpoczęcie od sytuacji wywołujących najmniejszy lęk",
          "Pozostanie w sytuacji do momentu zmniejszenia lęku",
          "Stopniowe przechodzenie do trudniejszych sytuacji"
        ],
        "examples": [
          "Klient z lękiem społecznym zaczyna od rozmowy z jedną osobą, a następnie stopniowo przechodzi do rozmów w większych grupach."
        ]
      }
    ]
  },
  "message": "Lista technik pobrana"
}
```

#### Kody błędów

| Kod HTTP | Kod błędu | Opis |
|----------|-----------|------|
| 401 | UNAUTHORIZED | Brak autoryzacji |
| 404 | METHOD_NOT_FOUND | Metoda terapii nie została znaleziona |

### 2.4. Pobieranie szczegółów techniki

Pobiera szczegółowe informacje o technice terapeutycznej.

#### Żądanie

```
GET /api/therapy/techniques/{techniqueId}
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
    "technique": {
      "id": "cognitive_restructuring",
      "name": "Restrukturyzacja poznawcza",
      "description": "Technika polegająca na identyfikacji, kwestionowaniu i zmianie negatywnych lub zniekształconych wzorców myślenia.",
      "steps": [
        "Identyfikacja automatycznych myśli",
        "Rozpoznanie zniekształceń poznawczych",
        "Kwestionowanie myśli poprzez pytania sokratejskie",
        "Formułowanie alternatywnych, bardziej zrównoważonych myśli"
      ],
      "examples": [
        "Klient myśli: 'Jestem beznadziejny, nigdy mi się nic nie udaje'. Terapeuta pomaga mu zidentyfikować to jako nadmierne uogólnienie i znaleźć dowody przeciwko temu twierdzeniu.",
        "Klient myśli: 'Wszyscy mnie oceniają'. Terapeuta pomaga mu zidentyfikować to jako czytanie w myślach i znaleźć alternatywne interpretacje."
      ],
      "effectiveness": "Restrukturyzacja poznawcza jest skuteczna w leczeniu depresji, zaburzeń lękowych i innych problemów związanych z negatywnym myśleniem.",
      "methods": [
        "cognitive_behavioral"
      ],
      "resources": [
        {
          "title": "Dziennik myśli automatycznych",
          "description": "Szablon do zapisywania i analizowania myśli automatycznych",
          "url": "https://api.terapeuta.app/resources/cognitive_restructuring_journal.pdf"
        },
        {
          "title": "Lista zniekształceń poznawczych",
          "description": "Lista najczęstszych zniekształceń poznawczych z przykładami",
          "url": "https://api.terapeuta.app/resources/cognitive_distortions.pdf"
        }
      ]
    }
  },
  "message": "Szczegóły techniki pobrane"
}
```

#### Kody błędów

| Kod HTTP | Kod błędu | Opis |
|----------|-----------|------|
| 401 | UNAUTHORIZED | Brak autoryzacji |
| 404 | TECHNIQUE_NOT_FOUND | Technika nie została znaleziona |

### 2.5. Pobieranie przykładowych zadań dla metody terapii

Pobiera listę przykładowych zadań dla określonej metody terapii.

#### Żądanie

```
GET /api/therapy/methods/{methodId}/tasks
```

#### Nagłówki

| Nagłówek | Wartość | Wymagany | Opis |
|----------|---------|----------|------|
| Authorization | Bearer {token} | Tak | Token dostępu |

#### Parametry zapytania

| Parametr | Typ | Wymagany | Opis |
|----------|-----|----------|------|
| category | string | Nie | Filtrowanie po kategorii zadania |
| priority | string | Nie | Filtrowanie po priorytecie zadania (low, medium, high) |

#### Odpowiedź

```json
{
  "success": true,
  "data": {
    "tasks": [
      {
        "id": "cbt_thought_journal",
        "title": "Dziennik myśli automatycznych",
        "description": "Prowadź dziennik myśli automatycznych, zapisując sytuację, myśl automatyczną, emocje, zniekształcenia poznawcze i alternatywną, bardziej zrównoważoną myśl.",
        "instructions": [
          "Zidentyfikuj sytuację, która wywołała silne emocje",
          "Zapisz myśli automatyczne, które pojawiły się w tej sytuacji",
          "Określ emocje i ich intensywność (1-10)",
          "Zidentyfikuj zniekształcenia poznawcze",
          "Sformułuj alternatywną, bardziej zrównoważoną myśl"
        ],
        "category": "technika_terapeutyczna",
        "priority": "high",
        "technique": "cognitive_restructuring"
      },
      {
        "id": "cbt_behavioral_experiment",
        "title": "Eksperyment behawioralny",
        "description": "Przeprowadź eksperyment behawioralny, aby przetestować negatywne przekonanie.",
        "instructions": [
          "Zidentyfikuj negatywne przekonanie do przetestowania",
          "Zaprojektuj eksperyment, który pozwoli przetestować to przekonanie",
          "Przewidź wynik eksperymentu",
          "Przeprowadź eksperyment",
          "Zapisz rzeczywisty wynik i wnioski"
        ],
        "category": "cwiczenie_behawioralne",
        "priority": "medium",
        "technique": "behavioral_experiment"
      }
    ]
  },
  "message": "Lista przykładowych zadań pobrana"
}
```

#### Kody błędów

| Kod HTTP | Kod błędu | Opis |
|----------|-----------|------|
| 400 | INVALID_CATEGORY | Nieprawidłowa kategoria |
| 400 | INVALID_PRIORITY | Nieprawidłowy priorytet |
| 401 | UNAUTHORIZED | Brak autoryzacji |
| 404 | METHOD_NOT_FOUND | Metoda terapii nie została znaleziona |

### 2.6. Pobieranie szczegółów przykładowego zadania

Pobiera szczegółowe informacje o przykładowym zadaniu.

#### Żądanie

```
GET /api/therapy/tasks/{taskId}
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
    "task": {
      "id": "cbt_thought_journal",
      "title": "Dziennik myśli automatycznych",
      "description": "Prowadź dziennik myśli automatycznych, zapisując sytuację, myśl automatyczną, emocje, zniekształcenia poznawcze i alternatywną, bardziej zrównoważoną myśl.",
      "instructions": [
        "Zidentyfikuj sytuację, która wywołała silne emocje",
        "Zapisz myśli automatyczne, które pojawiły się w tej sytuacji",
        "Określ emocje i ich intensywność (1-10)",
        "Zidentyfikuj zniekształcenia poznawcze",
        "Sformułuj alternatywną, bardziej zrównoważoną myśl"
      ],
      "category": "technika_terapeutyczna",
      "priority": "high",
      "technique": "cognitive_restructuring",
      "method": "cognitive_behavioral",
      "effectiveness": "Dziennik myśli automatycznych jest skutecznym narzędziem do identyfikacji i zmiany negatywnych wzorców myślenia.",
      "examples": [
        {
          "situation": "Prezentacja w pracy",
          "automaticThought": "Zrobię z siebie głupka i wszyscy będą się ze mnie śmiać",
          "emotions": "Lęk (8/10), Wstyd (7/10)",
          "distortions": ["Katastrofizacja", "Czytanie w myślach"],
          "alternativeThought": "Mogę być zdenerwowany, ale jestem dobrze przygotowany. Nawet jeśli popełnię błąd, ludzie raczej to zrozumieją."
        }
      ],
      "resources": [
        {
          "title": "Szablon dziennika myśli",
          "description": "Szablon do prowadzenia dziennika myśli automatycznych",
          "url": "https://api.terapeuta.app/resources/thought_journal_template.pdf"
        }
      ]
    }
  },
  "message": "Szczegóły przykładowego zadania pobrane"
}
```

#### Kody błędów

| Kod HTTP | Kod błędu | Opis |
|----------|-----------|------|
| 401 | UNAUTHORIZED | Brak autoryzacji |
| 404 | TASK_NOT_FOUND | Zadanie nie zostało znalezione |

## 3. Modele danych

### 3.1. TherapyMethod

```json
{
  "id": "cognitive_behavioral",
  "name": "Terapia Poznawczo-Behawioralna (CBT)",
  "description": "Metoda terapii skupiająca się na identyfikacji i zmianie negatywnych wzorców myślenia oraz zachowań.",
  "principles": [
    "Terapia CBT koncentruje się na teraźniejszości i jest zorientowana na rozwiązania",
    "Pomaga klientowi identyfikować, kwestionować i zmieniać negatywne lub zniekształcone wzorce myślenia",
    "Uczy klienta rozpoznawać związek między myślami, emocjami i zachowaniami"
  ],
  "history": "Terapia poznawczo-behawioralna została rozwinięta w latach 60. XX wieku przez Aarona Becka i Alberta Ellisa.",
  "effectiveness": "CBT jest jedną z najlepiej zbadanych form psychoterapii.",
  "structure": "Typowa sesja CBT trwa 45-60 minut i ma określoną strukturę.",
  "techniques": [
    {
      "id": "cognitive_restructuring",
      "name": "Restrukturyzacja poznawcza"
    }
  ]
}
```

### 3.2. Technique

```json
{
  "id": "cognitive_restructuring",
  "name": "Restrukturyzacja poznawcza",
  "description": "Technika polegająca na identyfikacji, kwestionowaniu i zmianie negatywnych lub zniekształconych wzorców myślenia.",
  "steps": [
    "Identyfikacja automatycznych myśli",
    "Rozpoznanie zniekształceń poznawczych",
    "Kwestionowanie myśli poprzez pytania sokratejskie",
    "Formułowanie alternatywnych, bardziej zrównoważonych myśli"
  ],
  "examples": [
    "Klient myśli: 'Jestem beznadziejny, nigdy mi się nic nie udaje'. Terapeuta pomaga mu zidentyfikować to jako nadmierne uogólnienie i znaleźć dowody przeciwko temu twierdzeniu."
  ],
  "effectiveness": "Restrukturyzacja poznawcza jest skuteczna w leczeniu depresji, zaburzeń lękowych i innych problemów związanych z negatywnym myśleniem.",
  "methods": [
    "cognitive_behavioral"
  ],
  "resources": [
    {
      "title": "Dziennik myśli automatycznych",
      "description": "Szablon do zapisywania i analizowania myśli automatycznych",
      "url": "https://api.terapeuta.app/resources/cognitive_restructuring_journal.pdf"
    }
  ]
}
```

### 3.3. SampleTask

```json
{
  "id": "cbt_thought_journal",
  "title": "Dziennik myśli automatycznych",
  "description": "Prowadź dziennik myśli automatycznych, zapisując sytuację, myśl automatyczną, emocje, zniekształcenia poznawcze i alternatywną, bardziej zrównoważoną myśl.",
  "instructions": [
    "Zidentyfikuj sytuację, która wywołała silne emocje",
    "Zapisz myśli automatyczne, które pojawiły się w tej sytuacji",
    "Określ emocje i ich intensywność (1-10)",
    "Zidentyfikuj zniekształcenia poznawcze",
    "Sformułuj alternatywną, bardziej zrównoważoną myśl"
  ],
  "category": "technika_terapeutyczna",
  "priority": "high",
  "technique": "cognitive_restructuring",
  "method": "cognitive_behavioral",
  "effectiveness": "Dziennik myśli automatycznych jest skutecznym narzędziem do identyfikacji i zmiany negatywnych wzorców myślenia.",
  "examples": [
    {
      "situation": "Prezentacja w pracy",
      "automaticThought": "Zrobię z siebie głupka i wszyscy będą się ze mnie śmiać",
      "emotions": "Lęk (8/10), Wstyd (7/10)",
      "distortions": ["Katastrofizacja", "Czytanie w myślach"],
      "alternativeThought": "Mogę być zdenerwowany, ale jestem dobrze przygotowany. Nawet jeśli popełnię błąd, ludzie raczej to zrozumieją."
    }
  ],
  "resources": [
    {
      "title": "Szablon dziennika myśli",
      "description": "Szablon do prowadzenia dziennika myśli automatycznych",
      "url": "https://api.terapeuta.app/resources/thought_journal_template.pdf"
    }
  ]
}
```

### 3.4. Resource

```json
{
  "title": "Dziennik myśli automatycznych",
  "description": "Szablon do zapisywania i analizowania myśli automatycznych",
  "url": "https://api.terapeuta.app/resources/cognitive_restructuring_journal.pdf"
}
```

## 4. Enumeracje

### 4.1. TherapyMethodId

| Wartość | Opis |
|---------|------|
| cognitive_behavioral | Terapia poznawczo-behawioralna |
| psychodynamic | Terapia psychodynamiczna |
| humanistic | Terapia humanistyczno-egzystencjalna |
| systemic | Terapia systemowa |
| solution_focused | Terapia krótkoterminowa skoncentrowana na rozwiązaniach |

### 4.2. TaskCategory

| Wartość | Opis |
|---------|------|
| technika_terapeutyczna | Technika terapeutyczna |
| refleksja | Refleksja |
| cwiczenie_behawioralne | Ćwiczenie behawioralne |
| dziennik | Dziennik |
| inne | Inne |

### 4.3. Priority

| Wartość | Opis |
|---------|------|
| low | Niski priorytet |
| medium | Średni priorytet |
| high | Wysoki priorytet |
