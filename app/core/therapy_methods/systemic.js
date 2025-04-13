/**
 * Moduł terapii systemowej
 * 
 * Ten moduł implementuje metody i techniki terapii systemowej.
 */

/**
 * Klasa implementująca terapię systemową
 */
class SystemicTherapy {
  constructor() {
    this.methodName = 'systemic';
    this.displayName = 'Terapia Systemowa';
    this.description = 'Metoda terapii skupiająca się na relacjach i interakcjach w systemach społecznych, szczególnie w rodzinie.';
    
    // Domyślne prompty, które mogą być modyfikowane przez użytkownika
    this.prompts = {
      systemPrompt: this.getDefaultSystemPrompt(),
      initializePrompt: this.getDefaultInitializePrompt(),
      moodCheckPrompt: this.getDefaultMoodCheckPrompt(),
      setAgendaPrompt: this.getDefaultSetAgendaPrompt(),
      mainTherapyPrompt: this.getDefaultMainTherapyPrompt(),
      summarizePrompt: this.getDefaultSummarizePrompt(),
      feedbackPrompt: this.getDefaultFeedbackPrompt(),
      endPrompt: this.getDefaultEndPrompt()
    };
  }

  /**
   * Zwraca domyślny systemowy prompt
   * @returns {string} - Domyślny prompt systemowy
   */
  getDefaultSystemPrompt() {
    return `Jesteś terapeutą prowadzącym sesję terapii systemowej. 
    
Twoje podejście opiera się na następujących zasadach:
1. Terapia systemowa koncentruje się na relacjach i interakcjach w systemach społecznych, szczególnie w rodzinie.
2. Problemy jednostki są postrzegane jako przejawy dysfunkcji w szerszym systemie, a nie jako indywidualne patologie.
3. Zmiany w jednej części systemu wpływają na cały system.
4. Skupiasz się na wzorcach komunikacji, rolach, granicach i strukturze systemu.
5. Pracujesz nad zmianą dysfunkcyjnych wzorców interakcji, a nie nad "naprawianiem" jednostki.

Prowadź sesję w sposób, który pomaga klientowi dostrzec szerszy kontekst systemowy jego problemów. Zadawaj pytania cyrkularne, które ujawniają wzorce relacji i interakcji. Pomagaj klientowi zrozumieć, jak jego zachowania wpływają na system i jak system wpływa na niego.`;
  }

  /**
   * Zwraca domyślny prompt inicjalizacji
   * @returns {string} - Domyślny prompt inicjalizacji
   */
  getDefaultInitializePrompt() {
    return `Rozpoczynasz sesję terapii systemowej. W podejściu systemowym kluczowe jest zrozumienie kontekstu relacyjnego problemów klienta.

Jeśli to pierwsza sesja:
- Przywitaj klienta i przedstaw się jako terapeuta systemowy.
- Wyjaśnij, że terapia systemowa koncentruje się na relacjach i interakcjach w systemach społecznych, szczególnie w rodzinie.
- Podkreśl, że będziesz pomagać klientowi zrozumieć, jak jego problemy mogą być związane z szerszym kontekstem relacyjnym.
- Zapytaj klienta o jego oczekiwania wobec terapii i o to, co skłoniło go do poszukiwania pomocy.
- Zbierz podstawowe informacje o systemie rodzinnym klienta (możesz zaproponować stworzenie genogramu w trakcie sesji).

Jeśli to kontynuacja terapii:
- Przywitaj klienta i zapytaj, jak minął mu czas od ostatniej sesji.
- Zapytaj, czy zauważył jakieś zmiany w swoim systemie rodzinnym lub innych ważnych relacjach.
- Nawiąż do tematów i wzorców zidentyfikowanych podczas poprzednich sesji.`;
  }

  /**
   * Zwraca domyślny prompt sprawdzenia nastroju
   * @returns {string} - Domyślny prompt sprawdzenia nastroju
   */
  getDefaultMoodCheckPrompt() {
    return `W terapii systemowej ważne jest zrozumienie, jak nastrój i emocje klienta są powiązane z jego relacjami i interakcjami w systemie.

Możesz zapytać:
- "Jak się dziś czujesz? Jak myślisz, jak Twój nastrój wpływa na relacje z bliskimi?"
- "Kto w Twojej rodzinie/otoczeniu jako pierwszy zauważa zmiany w Twoim nastroju? Po czym to poznaje?"
- "Jak reagują inni członkowie Twojej rodziny/otoczenia, gdy jesteś w takim nastroju jak teraz?"
- "Gdybym zapytał/a [ważną osobę z systemu klienta], jak opisałaby Twój nastrój w ostatnim czasie, co by powiedziała?"

Zwróć uwagę na to, jak klient opisuje swoje emocje w kontekście relacyjnym. Czy widzi związek między swoim nastrojem a dynamiką w systemie? Czy dostrzega wzorce emocjonalne powtarzające się w rodzinie?`;
  }

  /**
   * Zwraca domyślny prompt ustalenia agendy
   * @returns {string} - Domyślny prompt ustalenia agendy
   */
  getDefaultSetAgendaPrompt() {
    return `W terapii systemowej agenda sesji powinna uwzględniać kontekst relacyjny problemów klienta.

Możesz zapytać:
- "Nad czym chciałbyś/chciałabyś dziś popracować w kontekście Twoich relacji rodzinnych/zawodowych/społecznych?"
- "Czy pojawiły się jakieś nowe sytuacje lub interakcje w Twoim systemie rodzinnym/zawodowym, które chciałbyś/chciałabyś omówić?"
- "Kto z Twojego otoczenia najbardziej chciałby, żebyśmy dziś zajęli się tym tematem? Dlaczego?"
- "Gdyby [ważna osoba z systemu klienta] była tu z nami, jaki temat jej zdaniem powinniśmy dziś poruszyć?"

Jeśli klient ma trudność z określeniem agendy, możesz zaproponować:
- Analizę konkretnej trudnej sytuacji, która wydarzyła się w systemie klienta
- Eksplorację wzorców komunikacji w rodzinie/otoczeniu klienta
- Pracę nad genogramem, aby lepiej zrozumieć wzorce międzypokoleniowe
- Analizę ról i granic w systemie klienta`;
  }

  /**
   * Zwraca domyślny prompt głównej części terapii
   * @returns {string} - Domyślny prompt głównej części terapii
   */
  getDefaultMainTherapyPrompt() {
    return `Prowadź główną część terapeutyczną, stosując techniki terapii systemowej. Skup się na:

1. Pytaniach cyrkularnych:
   - Zadawaj pytania, które ujawniają wzorce relacji i interakcji
   - Pytaj o to, jak zachowania jednej osoby wpływają na inne osoby w systemie
   - Przykłady: "Jak reaguje Twoja żona, gdy widzisz, że jest zdenerwowana?", "Kto najbardziej martwi się o tę sytuację?", "Co by się zmieniło, gdybyś przestał/a brać odpowiedzialność za ten problem?"

2. Analizie wzorców komunikacji:
   - Pomagaj klientowi zidentyfikować dysfunkcyjne wzorce komunikacji w jego systemie
   - Zwracaj uwagę na metakomunikację (komunikację o komunikacji)
   - Badaj, jak te wzorce podtrzymują problem

3. Pracy z granicami i strukturą systemu:
   - Pomagaj klientowi zrozumieć, gdzie granice w jego systemie są zbyt sztywne lub zbyt rozmyte
   - Analizuj hierarchię i strukturę władzy w systemie
   - Badaj, jak role w systemie wpływają na funkcjonowanie klienta

4. Pracy z genogramem:
   - Wykorzystuj genogram do identyfikacji wzorców międzypokoleniowych
   - Badaj, jak historia rodzinna wpływa na obecne problemy
   - Szukaj zasobów i rozwiązań w historii rodziny

5. Reframingu:
   - Pomagaj klientowi zobaczyć problemy z nowej perspektywy
   - Przekształcaj negatywne interpretacje w bardziej konstruktywne
   - Podkreślaj funkcjonalność objawów w kontekście systemu

Pamiętaj, że w terapii systemowej celem jest zmiana wzorców interakcji w systemie, a nie "naprawienie" jednostki. Pomagaj klientowi zrozumieć, jak może wprowadzić zmiany w swoim zachowaniu, które mogą pozytywnie wpłynąć na cały system.`;
  }

  /**
   * Zwraca domyślny prompt podsumowania
   * @returns {string} - Domyślny prompt podsumowania
   */
  getDefaultSummarizePrompt() {
    return `Zbliżając się do końca sesji, podsumuj główne odkrycia i spostrzeżenia z perspektywy systemowej.

W podsumowaniu uwzględnij:
1. Zidentyfikowane wzorce interakcji w systemie klienta
2. Rola klienta w tych wzorcach i jak wpływa na system
3. Jak system wpływa na klienta i podtrzymuje problem
4. Potencjalne punkty interwencji i możliwości zmiany w systemie
5. Zasoby i mocne strony systemu, które mogą wspierać zmianę

Możesz użyć metafory lub analogii, aby pomóc klientowi lepiej zrozumieć dynamikę systemową.

Zapytaj klienta:
- "Jak te obserwacje rezonują z Twoim doświadczeniem?"
- "Co było dla Ciebie najbardziej zaskakujące lub odkrywcze w tym, co dziś omawialiśmy?"
- "Jak myślisz, kto w Twojej rodzinie/otoczeniu najbardziej zgodziłby się z tymi obserwacjami? Kto najmniej?"`;
  }

  /**
   * Zwraca domyślny prompt informacji zwrotnej
   * @returns {string} - Domyślny prompt informacji zwrotnej
   */
  getDefaultFeedbackPrompt() {
    return `Poproś klienta o informację zwrotną na temat dzisiejszej sesji, uwzględniając perspektywę systemową.

Możesz zapytać:
- "Co było dla Ciebie najbardziej pomocne w dzisiejszej sesji?"
- "Czy jest coś, co chciałbyś/chciałabyś, żebyśmy zrobili inaczej w przyszłości?"
- "Jak myślisz, co powiedzieliby członkowie Twojej rodziny/otoczenia o tematach, które dziś poruszaliśmy?"
- "Kto z Twojego otoczenia najbardziej doceniłby naszą dzisiejszą pracę? Dlaczego?"

Przyjmij informację zwrotną z otwartością i ciekawością. Traktuj ją jako cenne dane o tym, jak klient doświadcza procesu terapeutycznego i jak możesz lepiej dostosować swoje podejście do jego potrzeb i kontekstu systemowego.`;
  }

  /**
   * Zwraca domyślny prompt zakończenia
   * @returns {string} - Domyślny prompt zakończenia
   */
  getDefaultEndPrompt() {
    return `Zakończ sesję, proponując eksperyment lub zadanie, które pomoże klientowi wprowadzić małą zmianę w systemie.

W terapii systemowej zadania między sesjami często mają na celu:
1. Przerwanie dysfunkcyjnych wzorców interakcji
2. Wprowadzenie nowych zachowań, które mogą zmienić dynamikę systemu
3. Zebranie więcej informacji o funkcjonowaniu systemu
4. Wzmocnienie granic lub zmianę ról w systemie

Możesz zaproponować:
- Eksperyment behawioralny (np. "Co by się stało, gdybyś przez tydzień reagował/a inaczej na [konkretne zachowanie członka rodziny]?")
- Zadanie obserwacyjne (np. "Zwróć uwagę, kto inicjuje rozmowy o [problemowym temacie] i jak inni na to reagują")
- Rytuał rodzinny (np. "Czy moglibyście wprowadzić cotygodniowe spotkanie rodzinne, podczas którego każdy mógłby podzielić się swoimi uczuciami?")
- Zadanie paradoksalne (np. "Przez najbliższy tydzień staraj się zauważać wszystkie sytuacje, w których problem się pojawia, ale nie rób nic, żeby go rozwiązać - tylko obserwuj")

Upewnij się, że zadanie jest:
- Konkretne i jasno określone
- Realistyczne do wykonania
- Dostosowane do możliwości klienta i jego systemu
- Potencjalnie zdolne do wprowadzenia zmiany w systemie

Ustal termin kolejnej sesji i wyraź zainteresowanie tym, jak zadanie wpłynie na system klienta.`;
  }

  /**
   * Generuje systemowy prompt dla terapii systemowej
   * @param {Object} context - Kontekst sesji
   * @returns {string} - Prompt systemowy
   */
  generateSystemPrompt(context) {
    let prompt = this.prompts.systemPrompt;
    
    // Dodanie informacji o kliencie
    prompt += `\n\nKlient: ${context.clientProfile.name}`;
    
    if (context.clientProfile.goals && context.clientProfile.goals.length > 0) {
      prompt += `\nCele terapeutyczne: ${context.clientProfile.goals.join(', ')}`;
    }
    
    if (context.clientProfile.challenges && context.clientProfile.challenges.length > 0) {
      prompt += `\nWyzwania: ${context.clientProfile.challenges.join(', ')}`;
    }
    
    // Dodanie informacji o systemie rodzinnym, jeśli są dostępne
    if (context.clientProfile.familySystem) {
      prompt += `\n\nSystem rodzinny klienta:
- Struktura rodziny: ${context.clientProfile.familySystem.structure}
- Kluczowe relacje: ${context.clientProfile.familySystem.keyRelationships.join(', ')}
- Wzorce komunikacji: ${context.clientProfile.familySystem.communicationPatterns.join(', ')}`;
    }
    
    // Dodanie informacji o poprzedniej sesji
    if (context.previousSessionSummary) {
      prompt += `\n\nW poprzedniej sesji (nr ${context.previousSessionSummary.sessionNumber}):
- Omawiane tematy: ${context.previousSessionSummary.mainTopics.join(', ')}
- Kluczowe spostrzeżenia: ${context.previousSessionSummary.insights}
- Zadane eksperymenty/zadania: ${context.previousSessionSummary.homework}`;
    } else {
      prompt += '\n\nTo jest pierwsza sesja z tym klientem.';
    }
    
    return prompt;
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
    let prompt = this.prompts.initializePrompt;
    
    // Dostosowanie prompta w zależności od kontekstu sesji
    if (context.sessionInfo.continuityStatus === 'new' && context.sessionInfo.sessionNumber === 1) {
      // Pierwsza sesja - już obsłużone w domyślnym prompcie
    } else if (context.sessionInfo.continuityStatus === 'continued') {
      // Kontynuacja sesji
    } else if (context.sessionInfo.continuityStatus === 'resumed_after_break') {
      // Wznowienie po przerwie
      prompt += `\n\nPamiętaj, że to pierwsza sesja po dłuższej przerwie. Zapytaj o zmiany, które zaszły w systemie rodzinnym/otoczeniu klienta w tym czasie. Czy pojawiły się nowe wzorce interakcji? Czy role lub granice uległy zmianie?`;
    }
    
    return prompt;
  }

  /**
   * Generuje prompt dla sprawdzenia nastroju
   * @param {Object} context - Kontekst sesji
   * @returns {string} - Prompt sprawdzenia nastroju
   */
  generateMoodCheckPrompt(context) {
    return this.prompts.moodCheckPrompt;
  }

  /**
   * Generuje prompt dla ustalenia agendy
   * @param {Object} context - Kontekst sesji
   * @returns {string} - Prompt ustalenia agendy
   */
  generateSetAgendaPrompt(context) {
    let prompt = this.prompts.setAgendaPrompt;
    
    // Dodanie informacji o poprzednim zadaniu/eksperymencie, jeśli istnieje
    if (context.previousSessionSummary && context.previousSessionSummary.homework) {
      prompt += `\n\nZapytaj o wyniki zadania/eksperymentu z poprzedniej sesji: "${context.previousSessionSummary.homework}". Jak wpłynęło to na system? Kto zauważył zmiany? Jakie były reakcje innych członków systemu?`;
    }
    
    return prompt;
  }

  /**
   * Generuje prompt dla głównej części terapeutycznej
   * @param {Object} context - Kontekst sesji
   * @returns {string} - Prompt głównej części terapii
   */
  generateMainTherapyPrompt(context) {
    return this.prompts.mainTherapyPrompt;
  }

  /**
   * Generuje prompt dla podsumowania sesji
   * @param {Object} context - Kontekst sesji
   * @returns {string} - Prompt podsumowania
   */
  generateSummarizePrompt(context) {
    return this.prompts.summarizePrompt;
  }

  /**
   * Generuje prompt dla zebrania informacji zwrotnej
   * @param {Object} context - Kontekst sesji
   * @returns {string} - Prompt informacji zwrotnej
   */
  generateFeedbackPrompt(context) {
    return this.prompts.feedbackPrompt;
  }

  /**
   * Generuje prompt dla zakończenia sesji
   * @param {Object} context - Kontekst sesji
   * @returns {string} - Prompt zakończenia
   */
  generateEndPrompt(context) {
    return this.prompts.endPrompt;
  }

  /**
   * Aktualizuje prompt dla określonego stanu
   * @param {string} promptType - Typ prompta (np. 'systemPrompt', 'initializePrompt')
   * @param {string} newPrompt - Nowy tekst prompta
   */
  updatePrompt(promptType, newPrompt) {
    if (this.prompts.hasOwnProperty(promptType)) {
      this.prompts[promptType] = newPrompt;
      return true;
    }
    return false;
  }

  /**
   * Resetuje prompt do wartości domyślnej
   * @param {string} promptType - Typ prompta (np. 'systemPrompt', 'initializePrompt')
   */
  resetPromptToDefault(promptType) {
    if (this.prompts.hasOwnProperty(promptType)) {
      const defaultMethodName = 'getDefault' + promptType.charAt(0).toUpperCase() + promptType.slice(1);
      if (typeof this[defaultMethodName] === 'function') {
        this.prompts[promptType] = this[defaultMethodName]();
        return true;
      }
    }
    return false;
  }

  /**
   * Generuje przykładowe zadania terapeutyczne dla terapii systemowej
   * @param {Object} context - Kontekst sesji
   * @returns {Array} - Lista przykładowych zadań
   */
  generateSampleTasks(context) {
    return [
      {
        title: 'Mapa relacji rodzinnych',
        description: 'Stwórz mapę relacji w Twojej rodzinie, zaznaczając bliskość, konflikty i granice między członkami rodziny.',
        instructions: [
          'Narysuj na kartce papieru wszystkich członków Twojej rodziny jako kółka',
          'Połącz kółka liniami, używając różnych rodzajów linii dla różnych typów relacji (np. bliska, konfliktowa, zdystansowana)',
          'Zaznacz granice między podsystemami rodzinnymi (np. rodzice, dzieci, dziadkowie)',
          'Zastanów się nad wzorcami, które zauważasz na mapie',
          'Pomyśl, jak chciałbyś/chciałabyś, żeby ta mapa wyglądała w przyszłości'
        ],
        category: 'refleksja',
        priority: 'high'
      },
      {
        title: 'Dziennik wzorców komunikacji',
        description: 'Obserwuj i zapisuj wzorce komunikacji w Twojej rodzinie/otoczeniu, zwracając uwagę na powtarzające się sekwencje interakcji.',
        instructions: [
          'Wybierz 3-5 typowych sytuacji konfliktowych lub problemowych w Twojej rodzinie/otoczeniu',
          'Dla każdej sytuacji zapisz sekwencję interakcji: kto co mówi/robi i jak inni na to reagują',
          'Zwróć szczególną uwagę na to, co dzieje się tuż przed i tuż po problemowym zachowaniu',
          'Zastanów się, jaką funkcję pełni problem w tej sekwencji',
          'Pomyśl, w którym momencie sekwencji mógłbyś/mogłabyś zareagować inaczej'
        ],
        category: 'technika_terapeutyczna',
        priority: 'medium'
      },
      {
        title: 'Eksperyment z granicami',
        description: 'Przeprowadź eksperyment polegający na ustanowieniu lub zmianie granic w jednej z Twoich relacji.',
        instructions: [
          'Wybierz relację, w której granice są problematyczne (zbyt sztywne lub zbyt rozmyte)',
          'Zaplanuj konkretny sposób, w jaki zmienisz swoje zachowanie, aby ustanowić zdrowsze granice',
          'Wprowadź tę zmianę w życie przez co najmniej tydzień',
          'Obserwuj, jak druga osoba i inni członkowie systemu reagują na tę zmianę',
          'Zapisuj swoje obserwacje i refleksje'
        ],
        category: 'cwiczenie_behawioralne',
        priority: 'high'
      },
      {
        title: 'Genogram rodzinny',
        description: 'Stwórz genogram swojej rodziny, obejmujący co najmniej trzy pokolenia, zaznaczając wzorce, role i relacje.',
        instructions: [
          'Narysuj drzewo genealogiczne swojej rodziny, używając standardowych symboli genogramu',
          'Zaznacz ważne wydarzenia (śluby, rozwody, narodziny, śmierci, przeprowadzki, choroby)',
          'Dodaj informacje o relacjach między członkami rodziny',
          'Zidentyfikuj powtarzające się wzorce w różnych pokoleniach',
          'Zastanów się, jak te wzorce mogą wpływać na Twoje obecne relacje i problemy'
        ],
        category: 'refleksja',
        priority: 'medium'
      },
      {
        title: 'Rytuał rodzinny',
        description: 'Zaproponuj i wprowadź nowy rytuał rodzinny, który może wzmocnić pozytywne relacje w rodzinie.',
        instructions: [
          'Zastanów się, jakiego rodzaju rytuał mógłby być korzystny dla Twojej rodziny (np. wspólny posiłek, cotygodniowe spotkanie, świętowanie sukcesów)',
          'Omów ten pomysł z członkami rodziny i wspólnie ustalcie szczegóły',
          'Wprowadźcie rytuał w życie na okres próbny (np. miesiąc)',
          'Obserwuj, jak wpływa on na relacje i atmosferę w rodzinie',
          'Po okresie próbnym omów z rodziną, czy i jak chcecie kontynuować ten rytuał'
        ],
        category: 'cwiczenie_behawioralne',
        priority: 'low'
      }
    ];
  }

  /**
   * Generuje przykładowe techniki terapii systemowej
   * @returns {Array} - Lista technik
   */
  getTechniques() {
    return [
      {
        name: 'Pytania cyrkularne',
        description: 'Technika polegająca na zadawaniu pytań, które ujawniają wzorce relacji i interakcji w systemie.',
        steps: [
          'Zadawanie pytań o to, jak zachowania jednej osoby wpływają na inne osoby w systemie',
          'Pytanie o różnice w postrzeganiu i reagowaniu różnych członków systemu',
          'Pytanie o hipotezy dotyczące myśli i uczuć innych osób',
          'Pytanie o zmiany w relacjach w czasie'
        ]
      },
      {
        name: 'Genogram',
        description: 'Technika polegająca na tworzeniu graficznej reprezentacji rodziny obejmującej co najmniej trzy pokolenia.',
        steps: [
          'Rysowanie drzewa genealogicznego z użyciem standardowych symboli',
          'Zaznaczanie ważnych wydarzeń życiowych i relacji',
          'Identyfikacja wzorców międzypokoleniowych',
          'Analiza, jak historia rodzinna wpływa na obecne problemy'
        ]
      },
      {
        name: 'Reframing',
        description: 'Technika polegająca na przekształcaniu negatywnych interpretacji w bardziej konstruktywne, uwzględniające kontekst systemowy.',
        steps: [
          'Identyfikacja negatywnej interpretacji lub etykiety',
          'Zrozumienie funkcji problemu w systemie',
          'Zaproponowanie alternatywnej, pozytywnej lub neutralnej interpretacji',
          'Podkreślenie, jak ta nowa perspektywa może prowadzić do zmiany'
        ]
      },
      {
        name: 'Rzeźba rodzinna',
        description: 'Technika polegająca na tworzeniu przestrzennej reprezentacji relacji rodzinnych.',
        steps: [
          'Prośba o ustawienie członków rodziny w przestrzeni w sposób odzwierciedlający ich relacje',
          'Analiza dystansu, pozycji i postawy ciała',
          'Eksperymentowanie z alternatywnymi ustawieniami',
          'Omawianie uczuć i spostrzeżeń związanych z różnymi ustawieniami'
        ]
      },
      {
        name: 'Zadania paradoksalne',
        description: 'Technika polegająca na zalecaniu kontynuacji lub nawet nasilenia problematycznego zachowania.',
        steps: [
          'Identyfikacja zachowania, które system próbował bezskutecznie zmienić',
          'Przepisanie tego zachowania jako zadania',
          'Obserwacja, jak system reaguje na paradoks',
          'Wykorzystanie reakcji systemu jako punktu wyjścia do zmiany'
        ]
      }
    ];
  }
}

module.exports = new SystemicTherapy();
