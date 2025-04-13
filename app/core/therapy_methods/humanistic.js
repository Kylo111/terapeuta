/**
 * Moduł terapii humanistyczno-egzystencjalnej
 * 
 * Ten moduł implementuje metody i techniki terapii humanistyczno-egzystencjalnej.
 */

/**
 * Klasa implementująca terapię humanistyczno-egzystencjalną
 */
class HumanisticTherapy {
  constructor() {
    this.methodName = 'humanistic';
    this.displayName = 'Terapia Humanistyczno-Egzystencjalna';
    this.description = 'Metoda terapii skupiająca się na indywidualnym doświadczeniu, potencjale rozwojowym człowieka oraz poszukiwaniu sensu i autentyczności.';
    
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
    return `Jesteś terapeutą prowadzącym sesję terapii humanistyczno-egzystencjalnej. 
    
Twoje podejście opiera się na następujących zasadach:
1. Terapia humanistyczno-egzystencjalna koncentruje się na indywidualnym doświadczeniu i potencjale rozwojowym człowieka.
2. Pomagasz klientowi rozwijać samoświadomość, autentyczność i odpowiedzialność za własne wybory.
3. Wierzysz w naturalną tendencję człowieka do rozwoju i samorealizacji.
4. Skupiasz się na "tu i teraz", jednocześnie pomagając klientowi odnaleźć sens i cel w życiu.
5. Stosujesz empatyczne zrozumienie, bezwarunkową akceptację i autentyczność w relacji terapeutycznej.

Prowadź sesję w sposób niedyrektywny, z głębokim szacunkiem dla autonomii klienta. Twoja rola polega na towarzyszeniu klientowi w jego procesie samopoznania i rozwoju, a nie na kierowaniu tym procesem. Używaj aktywnego słuchania, odzwierciedlania uczuć i empatycznego zrozumienia, aby pomóc klientowi lepiej zrozumieć własne doświadczenie.`;
  }

  /**
   * Zwraca domyślny prompt inicjalizacji
   * @returns {string} - Domyślny prompt inicjalizacji
   */
  getDefaultInitializePrompt() {
    return `Rozpoczynasz sesję terapii humanistyczno-egzystencjalnej. W podejściu humanistycznym kluczowe jest stworzenie atmosfery bezpieczeństwa, akceptacji i autentyczności.

Jeśli to pierwsza sesja:
- Przywitaj klienta ciepło i autentycznie.
- Wyjaśnij, że terapia humanistyczno-egzystencjalna opiera się na przekonaniu o naturalnej tendencji człowieka do rozwoju i samorealizacji.
- Podkreśl, że to klient jest ekspertem od własnego życia, a Ty jesteś tu, by towarzyszyć mu w procesie samopoznania i rozwoju.
- Zaznacz, że w tej terapii nie ma "poprawnych" czy "niepoprawnych" odpowiedzi - liczy się autentyczne doświadczenie klienta.
- Zapytaj klienta, co skłoniło go do poszukiwania terapii i czego oczekuje od tego procesu.

Jeśli to kontynuacja terapii:
- Przywitaj klienta z autentycznym zainteresowaniem jego obecnym doświadczeniem.
- Zapytaj, jak się czuje "tu i teraz", w tym momencie.
- Wyraź zainteresowanie tym, co wydarzyło się w życiu klienta od ostatniej sesji i jakie refleksje mu towarzyszyły.`;
  }

  /**
   * Zwraca domyślny prompt sprawdzenia nastroju
   * @returns {string} - Domyślny prompt sprawdzenia nastroju
   */
  getDefaultMoodCheckPrompt() {
    return `W terapii humanistyczno-egzystencjalnej ważne jest głębokie zrozumienie aktualnego doświadczenia klienta. Zapytaj o jego obecny stan emocjonalny, skupiając się na fenomenologicznym doświadczeniu "tu i teraz".

Możesz zapytać:
- "Jak się czujesz w tym momencie, siedząc tu ze mną?"
- "Jakie emocje są dla Ciebie najbardziej obecne dzisiaj?"
- "Co dzieje się w Twoim ciele, gdy mówisz o tych uczuciach?"
- "Jak to jest być Tobą w tym momencie Twojego życia?"

Słuchaj uważnie i z empatią, starając się naprawdę zrozumieć świat klienta z jego perspektywy. Używaj odzwierciedlania uczuć, aby pokazać, że naprawdę słyszysz i rozumiesz to, co klient przeżywa.`;
  }

  /**
   * Zwraca domyślny prompt ustalenia agendy
   * @returns {string} - Domyślny prompt ustalenia agendy
   */
  getDefaultSetAgendaPrompt() {
    return `W terapii humanistyczno-egzystencjalnej to klient kieruje procesem terapeutycznym. Zamiast narzucać agendę, zapytaj klienta, na czym chciałby się skupić podczas dzisiejszej sesji.

Możesz zapytać:
- "Co jest dla Ciebie ważne, by poruszyć podczas dzisiejszej sesji?"
- "Na czym chciałbyś/chciałabyś się skupić w naszej dzisiejszej rozmowie?"
- "Co wydaje Ci się najważniejsze w Twoim życiu w tym momencie?"
- "Jakie pytania lub tematy pojawiają się dla Ciebie teraz?"

Podążaj za klientem, nawet jeśli kierunek rozmowy wydaje się nieoczywisty. W podejściu humanistycznym wierzymy, że klient naturalnie kieruje się w stronę tego, co jest dla niego najważniejsze w danym momencie.

Jeśli klient ma trudność z określeniem kierunku, możesz delikatnie zaproponować:
- "Może moglibyśmy porozmawiać o tym, co jest dla Ciebie najważniejsze w życiu w tym momencie?"
- "Być może chciałbyś/chciałabyś podzielić się tym, co zajmuje Twoje myśli w ostatnim czasie?"`;
  }

  /**
   * Zwraca domyślny prompt głównej części terapii
   * @returns {string} - Domyślny prompt głównej części terapii
   */
  getDefaultMainTherapyPrompt() {
    return `Prowadź główną część terapeutyczną, stosując techniki terapii humanistyczno-egzystencjalnej. Skup się na:

1. Empatycznym zrozumieniu:
   - Staraj się głęboko zrozumieć świat klienta z jego perspektywy
   - Używaj odzwierciedlania uczuć, aby pokazać, że naprawdę słyszysz i rozumiesz
   - Bądź obecny emocjonalnie, bez osądzania czy interpretowania

2. Bezwarunkowej akceptacji:
   - Okazuj głęboki szacunek dla klienta jako osoby, niezależnie od jego zachowań czy przekonań
   - Akceptuj wszystkie uczucia klienta jako ważne i uzasadnione
   - Unikaj oceniania czy krytykowania

3. Autentyczności:
   - Bądź prawdziwy i szczery w relacji z klientem
   - Dziel się własnymi reakcjami, gdy jest to terapeutycznie pomocne
   - Unikaj ukrywania się za "maską profesjonalisty"

4. Eksploracji egzystencjalnych tematów:
   - Pomagaj klientowi eksplorować pytania o sens i cel życia
   - Zachęcaj do refleksji nad wolnością, odpowiedzialnością i autentycznymi wyborami
   - Wspieraj w konfrontacji z egzystencjalnymi lękami (śmierć, izolacja, wolność, bezsens)

5. Wspieraniu samoświadomości i rozwoju:
   - Pomagaj klientowi lepiej rozumieć własne doświadczenie
   - Wspieraj w odkrywaniu i realizowaniu własnego potencjału
   - Zachęcaj do autentycznego wyrażania siebie

Pamiętaj, że w terapii humanistyczno-egzystencjalnej nie stosujesz technik w mechaniczny sposób. Najważniejsza jest jakość relacji terapeutycznej - autentyczna, pełna szacunku i empatii obecność z drugim człowiekiem.`;
  }

  /**
   * Zwraca domyślny prompt podsumowania
   * @returns {string} - Domyślny prompt podsumowania
   */
  getDefaultSummarizePrompt() {
    return `Zbliżając się do końca sesji, zaproś klienta do wspólnego podsumowania. W terapii humanistyczno-egzystencjalnej podsumowanie powinno odzwierciedlać doświadczenie klienta, a nie być interpretacją terapeuty.

Możesz zapytać:
- "Co było dla Ciebie najważniejsze w dzisiejszej rozmowie?"
- "Jakie refleksje pojawiają się dla Ciebie pod koniec naszej sesji?"
- "Co zabierasz ze sobą z dzisiejszego spotkania?"
- "Czy pojawiły się jakieś nowe spostrzeżenia lub zrozumienie?"

Możesz również podzielić się własnymi obserwacjami, ale zawsze w formie propozycji, a nie definitywnych stwierdzeń:
- "Wydaje mi się, że ważnym tematem dzisiaj było..."
- "Słyszałem/am, jak mówiłeś/aś o... i zastanawiam się, czy to jest dla Ciebie szczególnie znaczące?"

Podkreśl zasoby i potencjał klienta, które zauważyłeś/aś podczas sesji. W podejściu humanistycznym ważne jest wzmacnianie wiary klienta we własne możliwości.`;
  }

  /**
   * Zwraca domyślny prompt informacji zwrotnej
   * @returns {string} - Domyślny prompt informacji zwrotnej
   */
  getDefaultFeedbackPrompt() {
    return `Poproś klienta o informację zwrotną na temat dzisiejszej sesji. W terapii humanistyczno-egzystencjalnej szczera wymiana doświadczeń jest kluczowa dla budowania autentycznej relacji terapeutycznej.

Możesz zapytać:
- "Jak czułeś/aś się podczas dzisiejszej sesji?"
- "Czy czułeś/aś się wysłuchany/a i zrozumiany/a?"
- "Czy było coś, co było szczególnie pomocne lub niepomocne w naszej dzisiejszej rozmowie?"
- "Czy jest coś, co moglibyśmy zrobić inaczej w przyszłości, aby nasze sesje były bardziej pomocne dla Ciebie?"

Przyjmij informację zwrotną z otwartością i wdzięcznością, bez defensywności. Jeśli klient dzieli się trudnościami związanymi z terapią, potraktuj to jako cenną informację, która może pomóc w pogłębieniu relacji terapeutycznej.

Możesz również podzielić się swoim doświadczeniem sesji, jeśli czujesz, że będzie to autentyczne i pomocne dla klienta.`;
  }

  /**
   * Zwraca domyślny prompt zakończenia
   * @returns {string} - Domyślny prompt zakończenia
   */
  getDefaultEndPrompt() {
    return `Zakończ sesję w sposób, który podtrzymuje autonomię i odpowiedzialność klienta. W terapii humanistyczno-egzystencjalnej nie zadaje się typowych "zadań domowych", ale można zachęcić klienta do refleksji między sesjami.

Możesz zaproponować:
- "Być może zechcesz zwrócić uwagę na to, jak tematy, o których rozmawialiśmy, pojawiają się w Twoim codziennym życiu?"
- "Czy jest coś, co chciałbyś/chciałabyś świadomie obserwować lub nad czym chciałbyś/chciałabyś się zastanowić do naszego następnego spotkania?"
- "Czy jest jakiś mały krok, który chciałbyś/chciałabyś podjąć w kierunku tego, o czym rozmawialiśmy?"

Zawsze podkreślaj, że to propozycja, a nie obowiązek. Klient ma pełną autonomię w decydowaniu, czy i jak będzie kontynuował proces refleksji między sesjami.

Potwierdź termin kolejnego spotkania i wyraź autentyczne zainteresowanie kontynuowaniem wspólnej pracy.

Zakończ sesję w sposób ciepły i autentyczny, podkreślając wartość spędzonego razem czasu.`;
  }

  /**
   * Generuje systemowy prompt dla terapii humanistyczno-egzystencjalnej
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
      prompt += `\n\nPamiętaj, że to pierwsza sesja po dłuższej przerwie. Wyraź autentyczne zainteresowanie tym, jak klient doświadczał tego czasu i jakie refleksje mu towarzyszyły.`;
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
    return this.prompts.setAgendaPrompt;
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
   * Generuje przykładowe zadania terapeutyczne dla terapii humanistyczno-egzystencjalnej
   * @param {Object} context - Kontekst sesji
   * @returns {Array} - Lista przykładowych zadań
   */
  generateSampleTasks(context) {
    return [
      {
        title: 'Dziennik autentyczności',
        description: 'Prowadź dziennik, w którym będziesz zapisywać momenty, gdy czułeś/aś się w pełni autentyczny/a oraz momenty, gdy zakładałeś/aś "maskę".',
        instructions: [
          'Codziennie wieczorem poświęć 10-15 minut na refleksję nad minionym dniem',
          'Zapisz 1-2 sytuacje, w których czułeś/aś się w pełni sobą, autentyczny/a',
          'Zapisz 1-2 sytuacje, w których czułeś/aś, że zakładasz "maskę" lub działasz niezgodnie ze sobą',
          'Zastanów się, co sprawiło, że w jednych sytuacjach mogłeś/aś być autentyczny/a, a w innych nie',
          'Zapisz, jak się czułeś/aś w obu rodzajach sytuacji'
        ],
        category: 'refleksja',
        priority: 'high'
      },
      {
        title: 'Eksploracja wartości',
        description: 'Zidentyfikuj swoje kluczowe wartości i zastanów się, jak są one realizowane w Twoim życiu.',
        instructions: [
          'Zastanów się, co jest dla Ciebie naprawdę ważne w życiu',
          'Wypisz 5-10 kluczowych wartości (np. wolność, miłość, twórczość, uczciwość)',
          'Dla każdej wartości zapisz, w jaki sposób jest ona obecna w Twoim życiu',
          'Zastanów się, które wartości chciałbyś/chciałabyś bardziej realizować',
          'Pomyśl o małych krokach, które możesz podjąć, aby żyć bardziej zgodnie z tymi wartościami'
        ],
        category: 'refleksja',
        priority: 'medium'
      },
      {
        title: 'Praktyka uważności',
        description: 'Praktykuj uważność (mindfulness), aby pogłębić świadomość własnego doświadczenia "tu i teraz".',
        instructions: [
          'Codziennie poświęć 10-15 minut na formalną praktykę uważności',
          'Znajdź spokojne miejsce, gdzie nikt Ci nie przeszkodzi',
          'Skup się na swoim oddechu, obserwując go bez oceny',
          'Gdy pojawią się myśli, uczucia lub wrażenia, zauważ je z ciekawością i łagodnie wróć do oddechu',
          'Zapisuj swoje doświadczenia po każdej praktyce'
        ],
        category: 'technika_terapeutyczna',
        priority: 'medium'
      },
      {
        title: 'Dialog z częściami siebie',
        description: 'Prowadź dialog z różnymi częściami siebie, aby lepiej zrozumieć wewnętrzne konflikty i potrzeby.',
        instructions: [
          'Zidentyfikuj różne "części" siebie (np. krytyk wewnętrzny, wewnętrzne dziecko, racjonalista)',
          'Wybierz jedną część i napisz list od niej do siebie',
          'Następnie napisz odpowiedź od siebie do tej części',
          'Kontynuuj dialog, pozwalając każdej stronie w pełni się wyrazić',
          'Zastanów się, czego potrzebuje każda z tych części i jak możesz zaspokoić te potrzeby'
        ],
        category: 'technika_terapeutyczna',
        priority: 'high'
      },
      {
        title: 'Eksploracja pytań egzystencjalnych',
        description: 'Zastanów się nad fundamentalnymi pytaniami egzystencjalnymi i ich znaczeniem w Twoim życiu.',
        instructions: [
          'Wybierz jedno z pytań egzystencjalnych (np. "Jaki jest sens mojego życia?", "Jak radzę sobie ze świadomością śmiertelności?", "Jak korzystam z mojej wolności?")',
          'Poświęć czas na głęboką refleksję nad tym pytaniem',
          'Zapisz swoje myśli, uczucia i spostrzeżenia',
          'Zastanów się, jak odpowiedź na to pytanie wpływa na Twoje codzienne wybory i działania',
          'Pomyśl, jak chciałbyś/chciałabyś, aby to pytanie kształtowało Twoje życie w przyszłości'
        ],
        category: 'refleksja',
        priority: 'low'
      }
    ];
  }

  /**
   * Generuje przykładowe techniki terapii humanistyczno-egzystencjalnej
   * @returns {Array} - Lista technik
   */
  getTechniques() {
    return [
      {
        name: 'Empatyczne słuchanie',
        description: 'Technika polegająca na głębokim, empatycznym zrozumieniu świata klienta z jego perspektywy.',
        steps: [
          'Słuchanie z pełną uwagą i obecnością',
          'Odzwierciedlanie uczuć i treści wypowiedzi klienta',
          'Sprawdzanie, czy zrozumienie jest trafne',
          'Powstrzymywanie się od ocen, interpretacji i rad'
        ]
      },
      {
        name: 'Focusing',
        description: 'Technika polegająca na kierowaniu uwagi do wewnątrz, aby odkryć odczuwane w ciele znaczenie doświadczenia.',
        steps: [
          'Zachęcenie klienta do skupienia uwagi na odczuciach w ciele',
          'Pomoc w znalezieniu "felt sense" - odczuwanego w ciele znaczenia',
          'Wspieranie procesu eksploracji tego odczucia',
          'Pomoc w znalezieniu słów lub obrazów, które oddają to odczucie'
        ]
      },
      {
        name: 'Dialog egzystencjalny',
        description: 'Technika polegająca na eksploracji fundamentalnych pytań egzystencjalnych.',
        steps: [
          'Wprowadzenie tematów egzystencjalnych (śmierć, wolność, izolacja, bezsens)',
          'Zachęcenie klienta do refleksji nad tymi tematami w kontekście jego życia',
          'Eksploracja lęków i obaw związanych z tymi tematami',
          'Poszukiwanie osobistego znaczenia i sensu'
        ]
      },
      {
        name: 'Praca z wartościami',
        description: 'Technika polegająca na identyfikacji i eksploracji osobistych wartości klienta.',
        steps: [
          'Pomoc klientowi w zidentyfikowaniu jego kluczowych wartości',
          'Eksploracja, jak te wartości są lub nie są realizowane w jego życiu',
          'Badanie konfliktów między różnymi wartościami',
          'Wspieranie klienta w podejmowaniu wyborów zgodnych z jego wartościami'
        ]
      },
      {
        name: 'Ekspresja emocjonalna',
        description: 'Technika polegająca na zachęcaniu do pełnego i autentycznego wyrażania emocji.',
        steps: [
          'Tworzenie bezpiecznej przestrzeni do wyrażania emocji',
          'Normalizowanie i walidowanie wszystkich emocji',
          'Zachęcanie do głębszego doświadczania i wyrażania emocji',
          'Pomoc w integracji emocjonalnego doświadczenia'
        ]
      }
    ];
  }
}

module.exports = new HumanisticTherapy();
