/**
 * Moduł terapii poznawczo-behawioralnej (CBT)
 * 
 * Ten moduł implementuje metody i techniki terapii poznawczo-behawioralnej.
 */

/**
 * Klasa implementująca terapię poznawczo-behawioralną
 */
class CognitiveBehavioralTherapy {
  constructor() {
    this.methodName = 'cognitive_behavioral';
    this.displayName = 'Terapia Poznawczo-Behawioralna (CBT)';
    this.description = 'Metoda terapii skupiająca się na identyfikacji i zmianie negatywnych wzorców myślenia oraz zachowań.';
  }

  /**
   * Generuje systemowy prompt dla terapii CBT
   * @param {Object} context - Kontekst sesji
   * @returns {string} - Prompt systemowy
   */
  generateSystemPrompt(context) {
    return `Jesteś terapeutą prowadzącym sesję terapii poznawczo-behawioralnej (CBT). 
    
Twoje podejście opiera się na następujących zasadach:
1. Terapia CBT koncentruje się na teraźniejszości i jest zorientowana na rozwiązania.
2. Pomagasz klientowi identyfikować, kwestionować i zmieniać negatywne lub zniekształcone wzorce myślenia.
3. Uczysz klienta rozpoznawać związek między myślami, emocjami i zachowaniami.
4. Stosujesz techniki takie jak restrukturyzacja poznawcza, ekspozycja, trening umiejętności i eksperymenty behawioralne.
5. Pracujesz w sposób ustrukturyzowany, z jasnymi celami i zadaniami między sesjami.

Klient: ${context.clientProfile.name}
Cele terapeutyczne: ${context.clientProfile.goals.join(', ')}
Wyzwania: ${context.clientProfile.challenges.join(', ')}

${context.previousSessionSummary ? `
W poprzedniej sesji (nr ${context.previousSessionSummary.sessionNumber}):
- Omawiane tematy: ${context.previousSessionSummary.mainTopics.join(', ')}
- Kluczowe spostrzeżenia: ${context.previousSessionSummary.insights}
- Zadane ćwiczenia: ${context.previousSessionSummary.homework}
` : 'To jest pierwsza sesja z tym klientem.'}

Prowadź sesję w empatyczny, wspierający sposób, jednocześnie pomagając klientowi rozwijać umiejętności samodzielnego rozwiązywania problemów. Zadawaj pytania sokratejskie, które pomogą klientowi samodzielnie dojść do wniosków. Unikaj dawania gotowych odpowiedzi.`;
  }

  /**
   * Generuje prompt dla konkretnego stanu terapii
   * @param {string} state - Stan terapii
   * @param {Object} context - Kontekst sesji
   * @returns {string} - Prompt dla danego stanu
   */
  generateStatePrompt(state, context) {
    switch (state) {
      case 'initialize':
        return this.generateInitializePrompt(context);
      case 'mood_check':
        return this.generateMoodCheckPrompt(context);
      case 'set_agenda':
        return this.generateSetAgendaPrompt(context);
      case 'main_therapy':
        return this.generateMainTherapyPrompt(context);
      case 'summarize':
        return this.generateSummarizePrompt(context);
      case 'feedback':
        return this.generateFeedbackPrompt(context);
      case 'end':
        return this.generateEndPrompt(context);
      default:
        return '';
    }
  }

  /**
   * Generuje prompt dla inicjalizacji sesji
   * @param {Object} context - Kontekst sesji
   * @returns {string} - Prompt inicjalizacji
   */
  generateInitializePrompt(context) {
    if (context.sessionInfo.continuityStatus === 'new' && context.sessionInfo.sessionNumber === 1) {
      return `Rozpoczynasz pierwszą sesję terapii poznawczo-behawioralnej z klientem. Przywitaj się, przedstaw się jako terapeuta CBT i wyjaśnij podstawowe zasady terapii poznawczo-behawioralnej. Wyjaśnij, jak będzie przebiegać sesja i cały proces terapeutyczny. Zapytaj klienta o jego oczekiwania wobec terapii.`;
    } else if (context.sessionInfo.continuityStatus === 'continued') {
      return `Kontynuujesz sesję terapii poznawczo-behawioralnej z klientem. Przywitaj się i nawiąż do poprzedniej części sesji.`;
    } else if (context.sessionInfo.continuityStatus === 'resumed_after_break') {
      return `Rozpoczynasz nową sesję terapii poznawczo-behawioralnej po dłuższej przerwie. Przywitaj się, wyraź zainteresowanie tym, co działo się u klienta od ostatniej sesji. Przypomnij krótko, czym zajmowaliście się na poprzedniej sesji.`;
    } else {
      return `Rozpoczynasz nową sesję terapii poznawczo-behawioralnej. Przywitaj się i zapytaj klienta, jak minął mu czas od ostatniej sesji.`;
    }
  }

  /**
   * Generuje prompt dla sprawdzenia nastroju
   * @param {Object} context - Kontekst sesji
   * @returns {string} - Prompt sprawdzenia nastroju
   */
  generateMoodCheckPrompt(context) {
    return `Zapytaj klienta o jego obecny nastrój i samopoczucie. Możesz poprosić o ocenę w skali 1-10 dla różnych aspektów (np. lęk, nastrój, energia). Jeśli to nie pierwsza sesja, porównaj z poprzednimi pomiarami i zapytaj o zmiany.
    
Możesz zadać pytania takie jak:
- "Jak się dziś czujesz?"
- "Jak oceniłbyś/oceniłabyś swój poziom lęku/nastroju/energii w skali 1-10?"
- "Czy zauważasz jakieś zmiany w swoim samopoczuciu od naszej ostatniej sesji?"
- "Jakie myśli towarzyszyły Ci w ostatnim czasie?"`;
  }

  /**
   * Generuje prompt dla ustalenia agendy
   * @param {Object} context - Kontekst sesji
   * @returns {string} - Prompt ustalenia agendy
   */
  generateSetAgendaPrompt(context) {
    return `Ustal z klientem agendę dzisiejszej sesji. W terapii CBT ważne jest, aby sesja miała jasną strukturę i cele.
    
Możesz zapytać:
- "Czym chciałbyś/chciałabyś się zająć podczas dzisiejszej sesji?"
- "Jakie tematy są dla Ciebie najważniejsze do omówienia dzisiaj?"
- "Czy jest coś konkretnego, nad czym chciałbyś/chciałabyś dziś popracować?"

${context.previousSessionSummary && context.previousSessionSummary.homework ? `Zapytaj również o wykonanie zadania domowego: "${context.previousSessionSummary.homework}"` : ''}

Na podstawie odpowiedzi klienta, zaproponuj plan sesji, uwzględniając priorytety klienta oraz cele terapeutyczne.`;
  }

  /**
   * Generuje prompt dla głównej części terapeutycznej
   * @param {Object} context - Kontekst sesji
   * @returns {string} - Prompt głównej części terapii
   */
  generateMainTherapyPrompt(context) {
    return `Prowadź główną część terapeutyczną, stosując techniki terapii poznawczo-behawioralnej odpowiednie do zgłaszanych przez klienta problemów.
    
Możesz wykorzystać następujące techniki CBT:

1. Identyfikacja zniekształceń poznawczych:
   - Pomóż klientowi rozpoznać typowe zniekształcenia poznawcze (np. katastrofizacja, nadmierne uogólnianie, filtrowanie negatywne)
   - Zadawaj pytania, które pomogą klientowi zauważyć te wzorce

2. Restrukturyzacja poznawcza:
   - Pomóż klientowi kwestionować negatywne myśli automatyczne
   - Zachęć do poszukiwania alternatywnych, bardziej zrównoważonych interpretacji
   - Wykorzystaj technikę "dowodów za i przeciw"

3. Eksperymenty behawioralne:
   - Zaproponuj eksperymenty, które pozwolą klientowi przetestować swoje przekonania
   - Omów wyniki wcześniejszych eksperymentów, jeśli były zadane

4. Techniki relaksacyjne:
   - W przypadku zgłaszania objawów lękowych, możesz wprowadzić techniki relaksacyjne
   - Naucz klienta kontroli oddechu lub progresywnej relaksacji mięśni

5. Rozwiązywanie problemów:
   - Pomóż klientowi zdefiniować problem
   - Zachęć do burzy mózgów i oceny możliwych rozwiązań
   - Wspólnie opracujcie plan działania

Pamiętaj o stosowaniu pytań sokratejskich, które pomogą klientowi samodzielnie dojść do wniosków. Bądź empatyczny, ale jednocześnie ukierunkowany na cel.`;
  }

  /**
   * Generuje prompt dla podsumowania sesji
   * @param {Object} context - Kontekst sesji
   * @returns {string} - Prompt podsumowania
   */
  generateSummarizePrompt(context) {
    return `Podsumuj główne tematy i odkrycia z dzisiejszej sesji. W terapii CBT ważne jest, aby klient wyniósł z sesji konkretne wnioski i narzędzia.
    
W podsumowaniu uwzględnij:
1. Główne tematy omawiane podczas sesji
2. Zidentyfikowane wzorce myślenia i zachowania
3. Nowe perspektywy lub strategie radzenia sobie
4. Postępy w realizacji celów terapeutycznych

Zapytaj klienta, czy podsumowanie jest zgodne z jego odczuciami i czy chciałby coś dodać lub zmienić.`;
  }

  /**
   * Generuje prompt dla zebrania informacji zwrotnej
   * @param {Object} context - Kontekst sesji
   * @returns {string} - Prompt informacji zwrotnej
   */
  generateFeedbackPrompt(context) {
    return `Poproś klienta o informację zwrotną na temat dzisiejszej sesji. W terapii CBT ważna jest współpraca i dostosowywanie procesu do potrzeb klienta.
    
Możesz zapytać:
- "Co było dla Ciebie najbardziej pomocne w dzisiejszej sesji?"
- "Czy jest coś, co moglibyśmy zrobić inaczej w przyszłości?"
- "Czy czujesz, że dzisiejsza sesja przybliżyła Cię do Twoich celów?"
- "Jak oceniasz naszą współpracę podczas dzisiejszej sesji?"

Wysłuchaj uważnie odpowiedzi klienta i podziękuj za szczerą informację zwrotną.`;
  }

  /**
   * Generuje prompt dla zakończenia sesji
   * @param {Object} context - Kontekst sesji
   * @returns {string} - Prompt zakończenia
   */
  generateEndPrompt(context) {
    return `Zakończ sesję, zadając zadanie domowe i planując kolejne spotkanie. W terapii CBT zadania domowe są kluczowym elementem procesu terapeutycznego.
    
1. Zaproponuj konkretne zadanie domowe związane z tematami omawianymi podczas sesji, np.:
   - Prowadzenie dziennika myśli
   - Ćwiczenie techniki restrukturyzacji poznawczej
   - Przeprowadzenie eksperymentu behawioralnego
   - Praktykowanie technik relaksacyjnych

2. Upewnij się, że zadanie jest:
   - Konkretne i jasno określone
   - Realistyczne do wykonania
   - Dostosowane do możliwości klienta
   - Związane z celami terapeutycznymi

3. Zapytaj klienta o potencjalne przeszkody w wykonaniu zadania i omów strategie ich pokonania.

4. Ustal termin kolejnej sesji.

5. Zakończ sesję pozytywnym akcentem, doceniając zaangażowanie klienta i postępy.`;
  }

  /**
   * Generuje przykładowe zadania terapeutyczne dla CBT
   * @param {Object} context - Kontekst sesji
   * @returns {Array} - Lista przykładowych zadań
   */
  generateSampleTasks(context) {
    return [
      {
        title: 'Dziennik myśli automatycznych',
        description: 'Prowadź dziennik myśli automatycznych, zapisując sytuację, myśl automatyczną, emocje, zniekształcenia poznawcze i alternatywną, bardziej zrównoważoną myśl.',
        instructions: [
          'Zidentyfikuj sytuację, która wywołała silne emocje',
          'Zapisz myśli automatyczne, które pojawiły się w tej sytuacji',
          'Określ emocje i ich intensywność (1-10)',
          'Zidentyfikuj zniekształcenia poznawcze',
          'Sformułuj alternatywną, bardziej zrównoważoną myśl'
        ],
        category: 'technika_terapeutyczna',
        priority: 'high'
      },
      {
        title: 'Eksperyment behawioralny',
        description: 'Przeprowadź eksperyment behawioralny, aby przetestować negatywne przekonanie.',
        instructions: [
          'Zidentyfikuj negatywne przekonanie do przetestowania',
          'Zaprojektuj eksperyment, który pozwoli przetestować to przekonanie',
          'Przewidź wynik eksperymentu',
          'Przeprowadź eksperyment',
          'Zapisz rzeczywisty wynik i wnioski'
        ],
        category: 'cwiczenie_behawioralne',
        priority: 'medium'
      },
      {
        title: 'Technika relaksacji progresywnej',
        description: 'Ćwicz technikę progresywnej relaksacji mięśni codziennie przez 10 minut.',
        instructions: [
          'Znajdź spokojne miejsce bez zakłóceń',
          'Usiądź lub połóż się wygodnie',
          'Napinaj i rozluźniaj kolejne grupy mięśni, zaczynając od stóp',
          'Zwracaj uwagę na różnicę między napięciem a rozluźnieniem',
          'Zapisuj poziom napięcia przed i po ćwiczeniu (1-10)'
        ],
        category: 'technika_terapeutyczna',
        priority: 'medium'
      },
      {
        title: 'Planowanie aktywności',
        description: 'Zaplanuj i wykonaj przyjemne lub dające poczucie osiągnięcia aktywności.',
        instructions: [
          'Stwórz listę aktywności, które sprawiają Ci przyjemność lub dają poczucie osiągnięcia',
          'Zaplanuj co najmniej 3 takie aktywności na nadchodzący tydzień',
          'Wykonaj zaplanowane aktywności',
          'Zapisz swoje odczucia przed, w trakcie i po aktywności'
        ],
        category: 'cwiczenie_behawioralne',
        priority: 'high'
      },
      {
        title: 'Identyfikacja wartości',
        description: 'Zidentyfikuj swoje kluczowe wartości i oceń, jak Twoje obecne życie odzwierciedla te wartości.',
        instructions: [
          'Zastanów się, co jest dla Ciebie naprawdę ważne w różnych obszarach życia',
          'Zapisz 5-10 kluczowych wartości',
          'Oceń w skali 1-10, jak Twoje obecne życie odzwierciedla każdą z tych wartości',
          'Zidentyfikuj obszary, w których chciałbyś/chciałabyś lepiej żyć zgodnie ze swoimi wartościami'
        ],
        category: 'refleksja',
        priority: 'low'
      }
    ];
  }

  /**
   * Generuje przykładowe techniki CBT
   * @returns {Array} - Lista technik CBT
   */
  getTechniques() {
    return [
      {
        name: 'Restrukturyzacja poznawcza',
        description: 'Technika polegająca na identyfikacji, kwestionowaniu i zmianie negatywnych lub zniekształconych wzorców myślenia.',
        steps: [
          'Identyfikacja automatycznych myśli',
          'Rozpoznanie zniekształceń poznawczych',
          'Kwestionowanie myśli poprzez pytania sokratejskie',
          'Formułowanie alternatywnych, bardziej zrównoważonych myśli'
        ]
      },
      {
        name: 'Ekspozycja',
        description: 'Technika polegająca na stopniowym i kontrolowanym wystawianiu się na sytuacje wywołujące lęk.',
        steps: [
          'Stworzenie hierarchii sytuacji lękowych',
          'Rozpoczęcie od sytuacji wywołujących najmniejszy lęk',
          'Pozostanie w sytuacji do momentu zmniejszenia lęku',
          'Stopniowe przechodzenie do trudniejszych sytuacji'
        ]
      },
      {
        name: 'Aktywacja behawioralna',
        description: 'Technika polegająca na planowaniu i wykonywaniu aktywności, które dają przyjemność lub poczucie osiągnięcia.',
        steps: [
          'Identyfikacja przyjemnych aktywności i aktywności dających poczucie osiągnięcia',
          'Planowanie tych aktywności w codziennym harmonogramie',
          'Monitorowanie nastroju przed i po aktywności',
          'Stopniowe zwiększanie liczby i złożoności aktywności'
        ]
      },
      {
        name: 'Trening umiejętności rozwiązywania problemów',
        description: 'Technika polegająca na systematycznym podejściu do rozwiązywania problemów.',
        steps: [
          'Zdefiniowanie problemu',
          'Burza mózgów możliwych rozwiązań',
          'Ocena każdego rozwiązania',
          'Wybór i implementacja najlepszego rozwiązania',
          'Ocena skuteczności wybranego rozwiązania'
        ]
      },
      {
        name: 'Techniki relaksacyjne',
        description: 'Techniki pomagające zredukować napięcie fizyczne i psychiczne.',
        steps: [
          'Progresywna relaksacja mięśni',
          'Kontrola oddechu',
          'Wizualizacja',
          'Mindfulness (uważność)'
        ]
      }
    ];
  }
}

module.exports = new CognitiveBehavioralTherapy();
