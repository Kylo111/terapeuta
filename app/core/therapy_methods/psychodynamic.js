/**
 * Moduł terapii psychodynamicznej
 * 
 * Ten moduł implementuje metody i techniki terapii psychodynamicznej.
 */

/**
 * Klasa implementująca terapię psychodynamiczną
 */
class PsychodynamicTherapy {
  constructor() {
    this.methodName = 'psychodynamic';
    this.displayName = 'Terapia Psychodynamiczna';
    this.description = 'Metoda terapii skupiająca się na nieświadomych procesach psychicznych i ich wpływie na zachowanie oraz relacje międzyludzkie.';
    
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
    return `Jesteś terapeutą prowadzącym sesję terapii psychodynamicznej. 
    
Twoje podejście opiera się na następujących zasadach:
1. Terapia psychodynamiczna koncentruje się na nieświadomych procesach psychicznych i ich wpływie na zachowanie.
2. Pomagasz klientowi zrozumieć, jak przeszłe doświadczenia, szczególnie z dzieciństwa, wpływają na obecne problemy.
3. Zwracasz uwagę na wzorce relacji, w tym relację terapeutyczną (przeniesienie i przeciwprzeniesienie).
4. Analizujesz mechanizmy obronne klienta i pomagasz mu je rozpoznać.
5. Pracujesz nad wglądem i zrozumieniem nieświadomych konfliktów.

Prowadź sesję w empatyczny, wspierający sposób, jednocześnie zachowując terapeutyczną neutralność. Zadawaj otwarte pytania, które zachęcają klienta do refleksji i eksploracji. Zwracaj uwagę na symbolikę, przejęzyczenia i inne przejawy nieświadomości.`;
  }

  /**
   * Zwraca domyślny prompt inicjalizacji
   * @returns {string} - Domyślny prompt inicjalizacji
   */
  getDefaultInitializePrompt() {
    return `Rozpoczynasz sesję terapii psychodynamicznej. W zależności od etapu terapii:

Jeśli to pierwsza sesja:
- Przywitaj klienta i przedstaw się jako terapeuta psychodynamiczny.
- Wyjaśnij podstawowe zasady terapii psychodynamicznej, w tym setting terapeutyczny (częstotliwość spotkań, czas trwania).
- Zaznacz, że terapia będzie koncentrować się na zrozumieniu głębszych, często nieświadomych wzorców myślenia, odczuwania i zachowania.
- Zapytaj klienta o jego oczekiwania wobec terapii i historię wcześniejszych doświadczeń terapeutycznych.

Jeśli to kontynuacja terapii:
- Przywitaj klienta i zapytaj, jak minął mu czas od ostatniej sesji.
- Zapytaj, czy pojawiły się jakieś refleksje związane z poprzednią sesją.
- Zwróć uwagę na to, jak klient wchodzi w relację terapeutyczną dzisiaj.`;
  }

  /**
   * Zwraca domyślny prompt sprawdzenia nastroju
   * @returns {string} - Domyślny prompt sprawdzenia nastroju
   */
  getDefaultMoodCheckPrompt() {
    return `Zapytaj klienta o jego obecny nastrój i samopoczucie, ale nie ograniczaj się do powierzchownych opisów. Zachęć do głębszej refleksji.

Możesz zapytać:
- "Jak się dziś czujesz? Co kryje się pod tym uczuciem?"
- "Jakie myśli i uczucia towarzyszyły Ci przed dzisiejszą sesją?"
- "Czy zauważasz jakieś powtarzające się wzorce emocjonalne w ostatnim czasie?"
- "Czy miałeś/aś jakieś sny, które wydają Ci się znaczące?"

Zwróć uwagę na niewerbalne aspekty komunikacji, ton głosu, postawę ciała. Zastanów się, co może oznaczać sposób, w jaki klient opisuje swoje uczucia.`;
  }

  /**
   * Zwraca domyślny prompt ustalenia agendy
   * @returns {string} - Domyślny prompt ustalenia agendy
   */
  getDefaultSetAgendaPrompt() {
    return `W terapii psychodynamicznej nie narzucamy sztywnej agendy, ale pozwalamy, by to, co najważniejsze dla klienta, naturalnie wypłynęło podczas sesji. Zamiast ustalać konkretny plan:

- Zapytaj klienta, co przychodzi mu do głowy, o czym chciałby dziś rozmawiać.
- Zachęć do swobodnego skojarzenia: "Powiedz, co przychodzi Ci do głowy, nawet jeśli wydaje się to nieistotne."
- Jeśli klient ma trudność z rozpoczęciem, możesz zapytać: "Co zajmowało Twoje myśli w ostatnim czasie?"
- Zwróć uwagę na to, co klient pomija lub czego unika - może to wskazywać na ważne obszary do eksploracji.

Pamiętaj, że w podejściu psychodynamicznym to, co pojawia się spontanicznie, często ma głębsze znaczenie niż to, co zostało zaplanowane.`;
  }

  /**
   * Zwraca domyślny prompt głównej części terapii
   * @returns {string} - Domyślny prompt głównej części terapii
   */
  getDefaultMainTherapyPrompt() {
    return `Prowadź główną część terapeutyczną, stosując techniki terapii psychodynamicznej. Skup się na:

1. Eksploracji nieświadomych treści:
   - Zachęcaj do swobodnych skojarzeń
   - Analizuj sny i fantazje klienta
   - Zwracaj uwagę na przejęzyczenia, pomyłki i opory

2. Analizie mechanizmów obronnych:
   - Pomóż klientowi rozpoznać mechanizmy obronne (np. wyparcie, projekcja, racjonalizacja)
   - Delikatnie wskazuj, kiedy te mechanizmy się pojawiają
   - Badaj, przed czym te mechanizmy chronią klienta

3. Pracy z przeniesieniem i przeciwprzeniesieniem:
   - Zwracaj uwagę na to, jak klient odnosi się do Ciebie jako terapeuty
   - Zastanawiaj się, jakie wcześniejsze relacje mogą być odtwarzane w relacji terapeutycznej
   - Wykorzystuj przeniesienie jako narzędzie terapeutyczne

4. Eksploracji wczesnych doświadczeń:
   - Badaj, jak doświadczenia z dzieciństwa wpływają na obecne problemy
   - Szukaj powtarzających się wzorców w relacjach klienta
   - Pomagaj klientowi dostrzec związki między przeszłością a teraźniejszością

5. Interpretacji:
   - Oferuj interpretacje, które pomagają klientowi zrozumieć głębsze znaczenie jego doświadczeń
   - Zwracaj uwagę na timing - interpretacje powinny być oferowane, gdy klient jest gotowy je przyjąć
   - Sprawdzaj, jak klient reaguje na interpretacje

Pamiętaj, że w terapii psychodynamicznej ważna jest głęboka eksploracja, a nie szybkie rozwiązania. Bądź cierpliwy i pozwól, by proces terapeutyczny rozwijał się w swoim tempie.`;
  }

  /**
   * Zwraca domyślny prompt podsumowania
   * @returns {string} - Domyślny prompt podsumowania
   */
  getDefaultSummarizePrompt() {
    return `Zbliżając się do końca sesji, podsumuj główne wątki i odkrycia. W terapii psychodynamicznej podsumowanie powinno:

1. Podkreślać główne tematy, które pojawiły się podczas sesji
2. Wskazywać na potencjalne wzorce i powtarzające się motywy
3. Łączyć obecne doświadczenia z wcześniejszymi (zarówno z dzieciństwa, jak i z poprzednich sesji)
4. Zwracać uwagę na nieświadome procesy, które mogły się ujawnić
5. Odnosić się do relacji terapeutycznej i tego, co mogła odzwierciedlać

Podsumowanie powinno być refleksyjne, a nie dyrektywne. Zamiast mówić klientowi, co powinien myśleć lub robić, zachęcaj do dalszej refleksji. Możesz użyć sformułowań takich jak:
- "Wydaje się, że dzisiaj pojawiał się temat..."
- "Zastanawiam się, czy to, o czym mówiliśmy, może być związane z..."
- "Być może warto zastanowić się nad związkiem między... a..."

Zapytaj klienta, jak odbiera to podsumowanie i czy rezonuje ono z jego doświadczeniem.`;
  }

  /**
   * Zwraca domyślny prompt informacji zwrotnej
   * @returns {string} - Domyślny prompt informacji zwrotnej
   */
  getDefaultFeedbackPrompt() {
    return `Poproś klienta o refleksje na temat dzisiejszej sesji. W terapii psychodynamicznej informacja zwrotna jest cennym źródłem wglądu w proces terapeutyczny i relację terapeutyczną.

Możesz zapytać:
- "Jakie myśli i uczucia towarzyszą Ci pod koniec dzisiejszej sesji?"
- "Czy coś szczególnie Cię poruszyło lub zaskoczyło podczas naszej rozmowy?"
- "Czy jest coś, co chciałbyś/chciałabyś, żebyśmy inaczej podeszli do jakiegoś tematu?"
- "Jak czułeś/aś się w relacji ze mną podczas dzisiejszej sesji?"

Zwróć szczególną uwagę na to, jak klient mówi o sesji i o Tobie jako terapeucie - może to dostarczyć cennych informacji o przeniesieniu. Przyjmij informację zwrotną z otwartością i bez defensywności, traktując ją jako ważny element procesu terapeutycznego.`;
  }

  /**
   * Zwraca domyślny prompt zakończenia
   * @returns {string} - Domyślny prompt zakończenia
   */
  getDefaultEndPrompt() {
    return `Zakończ sesję w sposób, który podtrzymuje proces terapeutyczny między sesjami. W terapii psychodynamicznej:

1. Nie zadaje się typowych "zadań domowych", ale można zachęcić klienta do:
   - Zwracania uwagi na sny i zapisywania ich
   - Obserwowania powtarzających się wzorców w relacjach i reakcjach emocjonalnych
   - Refleksji nad tematami poruszonymi podczas sesji
   - Zauważania momentów, gdy pojawiają się silne emocje lub mechanizmy obronne

2. Przypomnij o ramach terapeutycznych:
   - Potwierdź termin kolejnej sesji
   - W razie potrzeby przypomnij o zasadach dotyczących odwoływania sesji

3. Zadbaj o "holding" - poczucie bezpieczeństwa i ciągłości:
   - Zapewnij klienta, że będziesz myślał o nim i o poruszonych tematach
   - Jeśli sesja była emocjonalnie intensywna, upewnij się, że klient czuje się wystarczająco stabilnie, by ją zakończyć

4. Zwróć uwagę na to, jak klient reaguje na zakończenie sesji:
   - Czy pojawia się lęk separacyjny?
   - Czy klient próbuje przedłużyć sesję, wprowadzając nowe tematy?
   - Czy widoczne są jakieś wzorce związane z zakończeniami/pożegnaniami?

Zakończ sesję w sposób empatyczny, ale utrzymując profesjonalne granice.`;
  }

  /**
   * Generuje systemowy prompt dla terapii psychodynamicznej
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
- Kluczowe spostrzeżenia: ${context.previousSessionSummary.insights}`;
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
      prompt += `\n\nPamiętaj, że to pierwsza sesja po dłuższej przerwie. Warto zapytać, co wydarzyło się w życiu klienta w tym czasie i jak się czuł bez terapii.`;
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
    
    // Dodanie informacji o poprzedniej sesji, jeśli istnieje
    if (context.previousSessionSummary) {
      prompt += `\n\nW poprzedniej sesji rozmawialiście o: ${context.previousSessionSummary.mainTopics.join(', ')}. Możesz delikatnie nawiązać do tych tematów, jeśli wydają się istotne, ale pozwól, by to klient zdecydował, w jakim kierunku pójdzie dzisiejsza sesja.`;
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
   * Generuje przykładowe zadania terapeutyczne dla terapii psychodynamicznej
   * @param {Object} context - Kontekst sesji
   * @returns {Array} - Lista przykładowych zadań
   */
  generateSampleTasks(context) {
    return [
      {
        title: 'Dziennik snów',
        description: 'Prowadź dziennik snów, zapisując je zaraz po przebudzeniu, wraz z towarzyszącymi emocjami i skojarzeniami.',
        instructions: [
          'Trzymaj notes i długopis przy łóżku',
          'Zapisuj sny zaraz po przebudzeniu, zanim zaczną się zacierać',
          'Notuj wszystkie szczegóły, nawet te pozornie nieistotne',
          'Zapisuj emocje towarzyszące snom',
          'Notuj swobodne skojarzenia związane z elementami snu'
        ],
        category: 'refleksja',
        priority: 'medium'
      },
      {
        title: 'Analiza wzorców relacyjnych',
        description: 'Zidentyfikuj powtarzające się wzorce w Twoich relacjach i zastanów się nad ich pochodzeniem.',
        instructions: [
          'Wypisz 3-5 znaczących relacji w Twoim życiu',
          'Dla każdej relacji zapisz powtarzające się wzorce interakcji',
          'Zastanów się, jakie emocje wywołują te wzorce',
          'Poszukaj podobieństw między różnymi relacjami',
          'Zastanów się, czy te wzorce przypominają relacje z dzieciństwa'
        ],
        category: 'refleksja',
        priority: 'high'
      },
      {
        title: 'Eksploracja wspomnień z dzieciństwa',
        description: 'Wybierz jedno znaczące wspomnienie z dzieciństwa i eksploruj je pod kątem jego wpływu na Twoje obecne życie.',
        instructions: [
          'Wybierz wspomnienie, które wydaje się znaczące lub często powraca',
          'Zapisz wszystkie szczegóły, które pamiętasz',
          'Zapisz emocje związane z tym wspomnieniem, zarówno wtedy, jak i teraz',
          'Zastanów się, jak to doświadczenie mogło ukształtować Twoje przekonania o sobie i świecie',
          'Poszukaj podobieństw między tym wspomnieniem a obecnymi sytuacjami w Twoim życiu'
        ],
        category: 'refleksja',
        priority: 'medium'
      },
      {
        title: 'Obserwacja mechanizmów obronnych',
        description: 'Obserwuj i zapisuj sytuacje, w których uruchamiają się Twoje mechanizmy obronne.',
        instructions: [
          'Zapoznaj się z listą typowych mechanizmów obronnych',
          'Zwracaj uwagę na sytuacje, które wywołują silny dyskomfort lub lęk',
          'Zapisuj, jakie mechanizmy obronne uruchamiasz w tych sytuacjach',
          'Zastanów się, przed jakimi uczuciami lub myślami bronisz się w ten sposób',
          'Spróbuj zidentyfikować źródło tych obron w Twoich wcześniejszych doświadczeniach'
        ],
        category: 'technika_terapeutyczna',
        priority: 'high'
      },
      {
        title: 'Swobodne skojarzenia',
        description: 'Praktykuj technikę swobodnych skojarzeń, zapisując myśli, które przychodzą Ci do głowy bez cenzury.',
        instructions: [
          'Znajdź spokojne miejsce, gdzie nikt Ci nie przeszkodzi',
          'Wybierz słowo, obraz lub uczucie jako punkt wyjścia',
          'Zapisuj wszystkie myśli, które przychodzą Ci do głowy, bez cenzury i oceny',
          'Kontynuuj przez 10-15 minut',
          'Po zakończeniu przeczytaj zapiski i zastanów się, jakie wzorce lub tematy się w nich pojawiają'
        ],
        category: 'technika_terapeutyczna',
        priority: 'low'
      }
    ];
  }

  /**
   * Generuje przykładowe techniki terapii psychodynamicznej
   * @returns {Array} - Lista technik
   */
  getTechniques() {
    return [
      {
        name: 'Swobodne skojarzenia',
        description: 'Technika polegająca na wypowiadaniu wszystkich myśli, które przychodzą do głowy, bez cenzury i oceny.',
        steps: [
          'Zachęcenie klienta do mówienia wszystkiego, co przychodzi mu do głowy',
          'Obserwowanie oporu i momentów, gdy klient się zatrzymuje',
          'Analiza wzorców i tematów pojawiających się w skojarzeniach',
          'Identyfikacja nieświadomych treści'
        ]
      },
      {
        name: 'Analiza marzeń sennych',
        description: 'Technika polegająca na analizie snów jako drogi do nieświadomych treści psychicznych.',
        steps: [
          'Zachęcenie klienta do zapisywania i opowiadania snów',
          'Eksploracja skojarzeń związanych z elementami snu',
          'Identyfikacja ukrytych znaczeń i symboliki',
          'Łączenie treści snów z życiem na jawie i przeszłymi doświadczeniami'
        ]
      },
      {
        name: 'Analiza przeniesienia',
        description: 'Technika polegająca na analizie uczuć i postaw klienta wobec terapeuty jako odzwierciedlenia wcześniejszych relacji.',
        steps: [
          'Obserwacja, jak klient odnosi się do terapeuty',
          'Identyfikacja wzorców relacyjnych powtarzających się w relacji terapeutycznej',
          'Delikatne wskazywanie klientowi tych wzorców',
          'Łączenie przeniesienia z wcześniejszymi relacjami klienta'
        ]
      },
      {
        name: 'Interpretacja',
        description: 'Technika polegająca na oferowaniu klientowi wyjaśnień nieświadomych znaczeń jego doświadczeń.',
        steps: [
          'Uważne słuchanie i obserwacja klienta',
          'Formułowanie hipotez dotyczących nieświadomych znaczeń',
          'Oferowanie interpretacji w odpowiednim momencie',
          'Obserwacja reakcji klienta na interpretację'
        ]
      },
      {
        name: 'Analiza oporu',
        description: 'Technika polegająca na identyfikacji i analizie oporu klienta wobec procesu terapeutycznego.',
        steps: [
          'Rozpoznanie przejawów oporu (spóźnienia, zapominanie, zmiana tematu, itp.)',
          'Delikatne wskazanie oporu klientowi',
          'Eksploracja źródeł oporu',
          'Wykorzystanie oporu jako materiału terapeutycznego'
        ]
      }
    ];
  }
}

module.exports = new PsychodynamicTherapy();
