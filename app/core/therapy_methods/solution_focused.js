/**
 * Moduł terapii krótkoterminowej skoncentrowanej na rozwiązaniach
 *
 * Ten moduł implementuje metody i techniki terapii krótkoterminowej skoncentrowanej na rozwiązaniach (SFBT).
 */

/**
 * Klasa implementująca terapię krótkoterminową skoncentrowaną na rozwiązaniach
 */
class SolutionFocusedTherapy {
  constructor() {
    this.methodName = 'solution_focused';
    this.displayName = 'Terapia Krótkoterminowa Skoncentrowana na Rozwiązaniach';
    this.description = 'Metoda terapii skupiająca się na poszukiwaniu rozwiązań zamiast analizowania problemów, koncentrująca się na przyszłości i wykorzystująca zasoby klienta.';

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
    return `Jesteś terapeutą prowadzącym sesję terapii krótkoterminowej skoncentrowanej na rozwiązaniach (SFBT).

Twoje podejście opiera się na następujących zasadach:
1. Terapia SFBT koncentruje się na poszukiwaniu rozwiązań zamiast analizowania problemów.
2. Pomagasz klientowi identyfikować wyjątki od problemu i budować na nich rozwiązania.
3. Skupiasz się na przyszłości i na tym, co klient chce osiągnąć, a nie na przeszłości i przyczynach problemów.
4. Wierzysz, że klient posiada zasoby i umiejętności potrzebne do rozwiązania swoich problemów.
5. Stosujesz techniki takie jak pytanie o cud, pytania o wyjątki, skalowanie i komplementowanie.

Prowadź sesję w sposób pozytywny i zorientowany na przyszłość. Zadawaj pytania, które pomagają klientowi dostrzec swoje zasoby, wyjątki od problemu i możliwe rozwiązania. Unikaj zagłębiania się w analizę problemów i ich przyczyn.`;
  }

  /**
   * Zwraca domyślny prompt inicjalizacji
   * @returns {string} - Domyślny prompt inicjalizacji
   */
  getDefaultInitializePrompt() {
    return `Rozpoczynasz sesję terapii krótkoterminowej skoncentrowanej na rozwiązaniach (SFBT). W podejściu SFBT kluczowe jest skupienie się na rozwiązaniach i przyszłości, a nie na problemach i przeszłości.

Jeśli to pierwsza sesja:
- Przywitaj klienta ciepło i z szacunkiem.
- Wyjaśnij, że terapia SFBT koncentruje się na budowaniu rozwiązań, a nie na analizowaniu problemów.
- Zapytaj klienta, co chciałby osiągnąć dzięki terapii - jaki byłby dla niego pożądany rezultat.
- Możesz zapytać: "Co musiałoby się wydarzyć podczas naszych spotkań, żebyś uznał/a, że warto było tu przyjść?"
- Zaznacz, że terapia SFBT jest zwykle krótkoterminowa (około 3-10 sesji) i zorientowana na konkretne cele.

Jeśli to kontynuacja terapii:
- Przywitaj klienta i zapytaj, co zmieniło się na lepsze od ostatniej sesji.
- Zapytaj o postępy w realizacji zadań lub eksperymentów z poprzedniej sesji.
- Wyraź zainteresowanie sukcesami i pozytywnymi zmianami, nawet najmniejszymi.`;
  }

  /**
   * Zwraca domyślny prompt sprawdzenia nastroju
   * @returns {string} - Domyślny prompt sprawdzenia nastroju
   */
  getDefaultMoodCheckPrompt() {
    return `W terapii SFBT sprawdzenie nastroju jest okazją do poszukiwania pozytywnych zmian i wyjątków od problemu.

Możesz zapytać:
- "Co zmieniło się na lepsze od naszego ostatniego spotkania?"
- "Na skali od 1 do 10, gdzie 10 oznacza najlepszy możliwy nastrój, a 1 najgorszy, jak oceniasz swój dzisiejszy nastrój?"
- "Co sprawia, że jesteś na [podana liczba], a nie niżej?"
- "Jakie momenty w ostatnim tygodniu były lepsze? Co wtedy było inne?"

Skup się na poszukiwaniu pozytywnych aspektów i wyjątków, nawet jeśli klient zgłasza głównie problemy. Jeśli klient mówi o trudnościach, wysłuchaj go z empatią, a następnie delikatnie skieruj rozmowę w stronę poszukiwania rozwiązań i zasobów.`;
  }

  /**
   * Zwraca domyślny prompt ustalenia agendy
   * @returns {string} - Domyślny prompt ustalenia agendy
   */
  getDefaultSetAgendaPrompt() {
    return `W terapii SFBT agenda sesji koncentruje się na celach klienta i poszukiwaniu rozwiązań.

Możesz zapytać:
- "Nad czym chciałbyś/chciałabyś dziś popracować?"
- "Co chciałbyś/chciałabyś, żeby było inne po dzisiejszej sesji?"
- "Jaki mały krok w kierunku rozwiązania mógłby być dzisiaj pomocny?"
- "W którym obszarze swojego życia widzisz największy potencjał do pozytywnej zmiany?"

Jeśli klient ma trudność z określeniem agendy zorientowanej na rozwiązania, możesz zaproponować:
- Eksplorację wyjątków od problemu
- Pytanie o cud
- Skalowanie postępów w kierunku celu
- Identyfikację zasobów i mocnych stron klienta

Pamiętaj, aby agenda była skoncentrowana na przyszłości i rozwiązaniach, a nie na analizie problemów.`;
  }

  /**
   * Zwraca domyślny prompt głównej części terapii
   * @returns {string} - Domyślny prompt głównej części terapii
   */
  getDefaultMainTherapyPrompt() {
    return `Prowadź główną część terapeutyczną, stosując techniki terapii krótkoterminowej skoncentrowanej na rozwiązaniach. Skup się na:

1. Pytaniu o cud:
   - Zapytaj klienta: "Załóżmy, że dzisiaj w nocy, kiedy śpisz, wydarza się cud i problem, który Cię tu sprowadził, został rozwiązany. Ale ponieważ śpisz, nie wiesz, że cud się wydarzył. Jak zauważysz jutro rano, że cud się wydarzył? Co będzie inne?"
   - Pomóż klientowi stworzyć szczegółowy obraz pożądanej przyszłości
   - Zapytaj o konkretne, behawioralne szczegóły: "Co będziesz robił/a inaczej? Co zauważą inni?"

2. Poszukiwaniu wyjątków:
   - Zapytaj o momenty, kiedy problem nie występuje lub jest mniej intensywny
   - Pomóż klientowi zidentyfikować, co jest wtedy inne
   - Zapytaj: "Jak to się stało, że udało Ci się to osiągnąć? Co zrobiłeś/aś, że to zadziałało?"
   - Pomóż klientowi dostrzec, że już posiada umiejętności potrzebne do rozwiązania problemu

3. Skalowaniu:
   - Poproś klienta o ocenę sytuacji na skali od 1 do 10
   - Zapytaj: "Co sprawia, że jesteś na [podana liczba], a nie niżej?"
   - Zapytaj: "Co byłoby potrzebne, żeby przesunąć się o jeden punkt wyżej na tej skali?"
   - Wykorzystaj skalowanie do mierzenia postępu i identyfikacji małych kroków

4. Komplementowaniu:
   - Doceń zasoby, mocne strony i osiągnięcia klienta
   - Podkreśl umiejętności, które klient już wykorzystuje w rozwiązywaniu problemu
   - Wyrażaj autentyczny podziw dla wysiłków i odporności klienta

5. Formułowaniu celów:
   - Pomóż klientowi sformułować cele, które są konkretne, mierzalne, osiągalne, istotne i określone w czasie
   - Upewnij się, że cele są sformułowane w kategoriach obecności czegoś pożądanego, a nie nieobecności problemu
   - Pomóż klientowi zidentyfikować małe, konkretne kroki w kierunku celu

Pamiętaj, że w terapii SFBT nie zagłębiasz się w analizę problemu ani jego przyczyn. Jeśli klient zaczyna koncentrować się na problemie, wysłuchaj go z empatią, a następnie delikatnie przekieruj rozmowę w stronę rozwiązań i pożądanej przyszłości.`;
  }

  /**
   * Zwraca domyślny prompt podsumowania
   * @returns {string} - Domyślny prompt podsumowania
   */
  getDefaultSummarizePrompt() {
    return `Zbliżając się do końca sesji, podsumuj główne odkrycia i spostrzezenia w sposób skoncentrowany na rozwiązaniach.

W podsumowaniu uwzględnij:
1. Zidentyfikowane wyjątki od problemu
2. Zasoby i mocne strony klienta, które zauważyłeś/aś podczas sesji
3. Małe kroki, które klient mógłby podjąć w kierunku rozwiązania
4. Postęp, który klient już osiągnął
5. Pozytywną wizję przyszłości, którą klient opisał

Możesz powiedzieć:
- "Dzisiaj zidentyfikowaliśmy kilka sytuacji, w których problem nie występuje lub jest mniej intensywny..."
- "Zauważyłem/am, że masz już umiejętności, które pomagają Ci w..."
- "Opisałeś/aś, że małym krokiem w kierunku rozwiązania mogłoby być..."

Zapytaj klienta, co było dla niego najbardziej pomocne podczas dzisiejszej sesji i co zabiera ze sobą.`;
  }

  /**
   * Zwraca domyślny prompt informacji zwrotnej
   * @returns {string} - Domyślny prompt informacji zwrotnej
   */
  getDefaultFeedbackPrompt() {
    return `Poproś klienta o informację zwrotną na temat dzisiejszej sesji, koncentrując się na tym, co było pomocne.

Możesz zapytać:
- "Co było dla Ciebie najbardziej pomocne w dzisiejszej sesji?"
- "Które pytania lub tematy były szczególnie użyteczne?"
- "Na skali od 1 do 10, jak bardzo dzisiejsza sesja przybliżyła Cię do Twoich celów?"
- "Co mogłoby sprawić, że nasze następne spotkanie byłoby jeszcze bardziej pomocne?"

Przyjmij informację zwrotną z otwartością i wdzięcznością. W terapii SFBT klient jest ekspertem od swojego życia, a Ty jesteś ekspertem od procesu terapeutycznego - informacja zwrotna pomaga Ci dostosować ten proces do potrzeb klienta.`;
  }

  /**
   * Zwraca domyślny prompt zakończenia
   * @returns {string} - Domyślny prompt zakończenia
   */
  getDefaultEndPrompt() {
    return `Zakończ sesję, proponując eksperyment lub zadanie, które pomoże klientowi kontynuować postęp między sesjami.

W terapii SFBT zadania między sesjami często mają formę:
1. Zadania obserwacyjnego: "Zwracaj uwagę na momenty, kiedy problem nie występuje lub jest mniej intensywny. Co wtedy robisz? Co jest inne?"
2. Zadania "więcej tego samego": "Kontynuuj robienie tego, co już działa."
3. Zadania "zrób coś innego": "Gdy zauważysz, że zaczynasz [problematyczne zachowanie], spróbuj zrobić coś zupełnie innego niż zwykle."
4. Zadania z formułą "udawaj, że": "Przez najbliższe dni udawaj, że cud, o którym rozmawialismy, już się wydarzył. Zachowuj się tak, jakby problem był już rozwiązany."

Upewnij się, że zadanie jest:
- Konkretne i jasno określone
- Realistyczne do wykonania
- Dostosowane do możliwości klienta
- Powiązane z celami klienta

Zakończ sesję na pozytywnej nucie, wyrażając wiarę w zasoby i możliwości klienta. Ustal termin kolejnej sesji i wyraź zainteresowanie tym, jakie pozytywne zmiany klient zauważy do tego czasu.`;
  }

  /**
   * Generuje systemowy prompt dla terapii krótkoterminowej skoncentrowanej na rozwiązaniach
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

    // Dodanie informacji o poprzedniej sesji
    if (context.previousSessionSummary) {
      prompt += `\n\nW poprzedniej sesji (nr ${context.previousSessionSummary.sessionNumber}):
- Omawiane tematy: ${context.previousSessionSummary.mainTopics.join(', ')}
- Kluczowe spostrzezenia: ${context.previousSessionSummary.insights}
- Zidentyfikowane wyjątki od problemu: ${context.previousSessionSummary.exceptions || 'brak informacji'}
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
      prompt += `\n\nPamiętaj, że to pierwsza sesja po dłuższej przerwie. Zapytaj o pozytywne zmiany, które zaszły w życiu klienta w tym czasie. Skup się na tym, co zadziałało, a nie na tym, co było trudne.`;
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
      prompt += `\n\nZapytaj o wyniki zadania/eksperymentu z poprzedniej sesji: "${context.previousSessionSummary.homework}". Skup się na tym, co zadziałało i jakie pozytywne zmiany klient zauważył.`;
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
   * Generuje przykładowe zadania terapeutyczne dla terapii krótkoterminowej skoncentrowanej na rozwiązaniach
   * @param {Object} context - Kontekst sesji
   * @returns {Array} - Lista przykładowych zadań
   */
  generateSampleTasks(context) {
    return [
      {
        title: 'Obserwacja wyjątków',
        description: 'Zwracaj uwagę na momenty, kiedy problem nie występuje lub jest mniej intensywny.',
        instructions: [
          'Codziennie wieczorem poświęć 5-10 minut na refleksję nad minionym dniem',
          'Zapisz sytuacje, w których problem nie występował lub był mniej intensywny',
          'Zanotuj, co było wtedy inne - co robiłeś/aś, kto był obecny, jaki był kontekst',
          'Zastanow się, jak możesz stworzyć więcej takich momentów',
          'Zapisz, jak się czułeś/aś w tych momentach'
        ],
        category: 'technika_terapeutyczna',
        priority: 'high'
      },
      {
        title: 'Więcej tego samego',
        description: 'Zidentyfikuj, co już działa w Twoim życiu i rób tego więcej.',
        instructions: [
          'Wypisz 3-5 rzeczy, które już robisz, a które pomagają Ci radzić sobie z problemem',
          'Wybierz jedną z tych rzeczy i zaplanuj, jak możesz robić jej więcej',
          'Ustal konkretny plan: kiedy, gdzie i jak często będziesz to robić',
          'Wprowadź plan w życie przez co najmniej tydzień',
          'Obserwuj i zapisuj efekty'
        ],
        category: 'cwiczenie_behawioralne',
        priority: 'medium'
      },
      {
        title: 'Eksperyment z cudem',
        description: 'Zachowuj się przez jeden dzień tak, jakby cud już się wydarzył i problem został rozwiązany.',
        instructions: [
          'Wybierz dzień, w którym przeprowadzisz eksperyment',
          'Przypomnij sobie szczegóły "cudu", o którym rozmawialismy podczas sesji',
          'Przez cały dzień zachowuj się tak, jakby problem już został rozwiązany',
          'Zwracaj uwagę na reakcje innych osób',
          'Zapisz swoje obserwacje i refleksje po zakończeniu eksperymentu'
        ],
        category: 'cwiczenie_behawioralne',
        priority: 'high'
      },
      {
        title: 'Skalowanie postępu',
        description: 'Codziennie oceniaj swój postęp na skali od 1 do 10 i identyfikuj czynniki wpływające na ocenę.',
        instructions: [
          'Codziennie wieczorem oceń swój dzień na skali od 1 do 10, gdzie 10 oznacza idealną sytuację',
          'Zapisz, co sprawia, że jesteś na tej liczbie, a nie niżej',
          'Zastanow się, co byłoby potrzebne, żeby przesunąć się o jeden punkt wyżej',
          'Zaplanuj mały krok, który możesz podjąć następnego dnia',
          'Po tygodniu przeanalizuj wzorce i trendy w swoich ocenach'
        ],
        category: 'refleksja',
        priority: 'medium'
      },
      {
        title: 'List z przyszłości',
        description: 'Napisz list do siebie z perspektywy przyszłości, w której problem został już rozwiązany.',
        instructions: [
          'Wyobraź sobie, że minął rok i problem został całkowicie rozwiązany',
          'Napisz list do siebie z tej przyszłej perspektywy',
          'Opisz, jak wygląda Twoje życie, co się zmieniło, jak się czujesz',
          'Opisz, jakie kroki podjąłeś/ęłaś, żeby osiągnąć to rozwiązanie',
          'Przeczytaj ten list kilka razy w ciągu nadchodzącego tygodnia'
        ],
        category: 'refleksja',
        priority: 'low'
      }
    ];
  }

  /**
   * Generuje przykładowe techniki terapii krótkoterminowej skoncentrowanej na rozwiązaniach
   * @returns {Array} - Lista technik
   */
  getTechniques() {
    return [
      {
        name: 'Pytanie o cud',
        description: 'Technika polegająca na zachęceniu klienta do wyobrażenia sobie, że problem został cudownie rozwiązany, co pomaga stworzyć wizję pożądanej przyszłości.',
        steps: [
          'Zadanie pytania o cud: "Załóżmy, że dzisiaj w nocy, kiedy śpisz, wydarza się cud i problem zostaje rozwiązany..."',
          'Eksploracja szczegółów: "Co zauważysz jako pierwsze? Co będzie inne?"',
          'Pytanie o reakcje innych: "Kto pierwszy zauważy zmianę? Po czym pozna, że coś się zmieniło?"',
          'Identyfikacja konkretnych zachowań i interakcji w pożądanej przyszłości'
        ]
      },
      {
        name: 'Poszukiwanie wyjątków',
        description: 'Technika polegająca na identyfikacji momentów, kiedy problem nie występuje lub jest mniej intensywny.',
        steps: [
          'Zadawanie pytań o wyjątki: "Czy były momenty, kiedy problem nie występował lub był mniejszy?"',
          'Eksploracja szczegółów: "Co było wtedy inne? Co robiłeś/aś? Kto był obecny?"',
          'Analiza zasobów: "Jakie umiejętności wykorzystałeś/aś w tej sytuacji?"',
          'Planowanie: "Jak możesz stworzyć więcej takich momentów?"'
        ]
      },
      {
        name: 'Skalowanie',
        description: 'Technika polegająca na ocenie sytuacji na skali liczbowej, co pomaga mierzyć postęp i identyfikować małe kroki.',
        steps: [
          'Ustalenie skali: "Na skali od 1 do 10, gdzie 10 to idealny rezultat, a 1 to najgorsza sytuacja, gdzie jesteś teraz?"',
          'Eksploracja zasobów: "Co sprawia, że jesteś na [podana liczba], a nie niżej?"',
          'Identyfikacja małych kroków: "Co byłoby potrzebne, żeby przesunąć się o jeden punkt wyżej?"',
          'Planowanie konkretnych działań w oparciu o odpowiedzi'
        ]
      },
      {
        name: 'Komplementowanie',
        description: 'Technika polegająca na autentycznym docenianiu zasobów, mocnych stron i osiągnięć klienta.',
        steps: [
          'Obserwacja zasobów i mocnych stron klienta',
          'Wyrażanie autentycznego uznania dla wysiłków i osiągnięć klienta',
          'Podkreślanie umiejętności, które klient już wykorzystuje',
          'Wzmacnianie wiary klienta we własne możliwości'
        ]
      },
      {
        name: 'Pytania zorientowane na przyszłość',
        description: 'Technika polegająca na zadawaniu pytań, które kierują uwagę klienta na przyszłość i możliwe rozwiązania.',
        steps: [
          'Zadawanie pytań o pożądaną przyszłość: "Jak chciałbyś/chciałabyś, żeby wyglądało Twoje życie za rok?"',
          'Pytania o pierwsze kroki: "Co byłby pierwszym małym znakiem, że idziesz we właściwym kierunku?"',
          'Pytania o zasoby: "Jakie umiejętności i mocne strony pomogą Ci osiągnąć ten cel?"',
          'Pytania o wsparcie: "Kto mógłby Ci pomóc w osiągnięciu tego celu?"'
        ]
      }
    ];
  }
}

module.exports = new SolutionFocusedTherapy();
