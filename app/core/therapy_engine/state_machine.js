/**
 * Moduł maszyny stanów terapii
 * 
 * Ten moduł implementuje maszynę stanów do zarządzania przepływem terapii.
 * W przyszłości zostanie zintegrowany z LangGraph.
 */

/**
 * Klasa implementująca maszynę stanów terapii
 */
class TherapyStateMachine {
  constructor() {
    // Definicja stanów terapii
    this.states = {
      INITIALIZE: 'initialize',
      MOOD_CHECK: 'mood_check',
      SET_AGENDA: 'set_agenda',
      MAIN_THERAPY: 'main_therapy',
      SUMMARIZE: 'summarize',
      FEEDBACK: 'feedback',
      END: 'end'
    };
    
    // Definicja przejść między stanami
    this.transitions = {
      [this.states.INITIALIZE]: [this.states.MOOD_CHECK],
      [this.states.MOOD_CHECK]: [this.states.SET_AGENDA],
      [this.states.SET_AGENDA]: [this.states.MAIN_THERAPY],
      [this.states.MAIN_THERAPY]: [this.states.MAIN_THERAPY, this.states.SUMMARIZE], // Pętla lub przejście dalej
      [this.states.SUMMARIZE]: [this.states.FEEDBACK],
      [this.states.FEEDBACK]: [this.states.END],
      [this.states.END]: []
    };
    
    // Stan początkowy
    this.currentState = null;
    
    // Kontekst sesji
    this.sessionContext = {};
  }

  /**
   * Inicjalizuje maszynę stanów dla nowej sesji
   * @param {Object} sessionData - Dane sesji
   * @returns {Object} - Stan początkowy i kontekst
   */
  initializeSession(sessionData) {
    this.currentState = this.states.INITIALIZE;
    this.sessionContext = {
      sessionId: sessionData.sessionId,
      profileId: sessionData.profileId,
      therapyMethod: sessionData.therapyMethod,
      sessionNumber: sessionData.sessionNumber,
      continuityStatus: sessionData.continuityStatus,
      startTime: new Date(),
      conversation: [],
      currentStateData: {}
    };
    
    return {
      state: this.currentState,
      context: this.sessionContext
    };
  }

  /**
   * Przechodzi do następnego stanu
   * @param {string} nextState - Opcjonalny następny stan (jeśli nie podany, wybierany jest domyślny)
   * @returns {Object} - Nowy stan i zaktualizowany kontekst
   */
  transition(nextState = null) {
    // Sprawdzenie, czy maszyna stanów została zainicjalizowana
    if (!this.currentState) {
      throw new Error('State machine not initialized');
    }
    
    // Sprawdzenie, czy podany stan jest dozwolonym przejściem
    const allowedTransitions = this.transitions[this.currentState];
    
    if (nextState && !allowedTransitions.includes(nextState)) {
      throw new Error(`Invalid transition from ${this.currentState} to ${nextState}`);
    }
    
    // Jeśli nie podano stanu, wybierz pierwszy dozwolony
    const newState = nextState || allowedTransitions[0];
    
    // Jeśli nie ma dozwolonych przejść, pozostań w obecnym stanie
    if (!newState) {
      return {
        state: this.currentState,
        context: this.sessionContext
      };
    }
    
    // Aktualizacja stanu
    this.currentState = newState;
    
    // Aktualizacja kontekstu
    this.sessionContext.currentStateData = {};
    
    return {
      state: this.currentState,
      context: this.sessionContext
    };
  }

  /**
   * Aktualizuje dane stanu
   * @param {Object} stateData - Dane stanu
   * @returns {Object} - Zaktualizowany kontekst
   */
  updateStateData(stateData) {
    this.sessionContext.currentStateData = {
      ...this.sessionContext.currentStateData,
      ...stateData
    };
    
    return this.sessionContext;
  }

  /**
   * Dodaje wiadomość do konwersacji
   * @param {string} role - Rola (system, assistant, user)
   * @param {string} content - Treść wiadomości
   * @returns {Object} - Zaktualizowany kontekst
   */
  addMessage(role, content) {
    this.sessionContext.conversation.push({
      role,
      content,
      timestamp: new Date()
    });
    
    return this.sessionContext;
  }

  /**
   * Pobiera aktualny stan i kontekst
   * @returns {Object} - Aktualny stan i kontekst
   */
  getCurrentState() {
    return {
      state: this.currentState,
      context: this.sessionContext
    };
  }

  /**
   * Sprawdza, czy sesja jest zakończona
   * @returns {boolean} - Czy sesja jest zakończona
   */
  isSessionEnded() {
    return this.currentState === this.states.END;
  }

  /**
   * Generuje prompt dla modelu LLM na podstawie aktualnego stanu
   * @returns {Object} - Prompt dla modelu LLM
   */
  generatePromptForCurrentState() {
    // Ta metoda będzie rozbudowana w przyszłości
    // Obecnie zwraca podstawowy prompt
    
    const basePrompt = {
      role: 'system',
      content: `Jesteś terapeutą prowadzącym sesję terapeutyczną metodą ${this.sessionContext.therapyMethod}. `
    };
    
    let statePrompt = '';
    
    switch (this.currentState) {
      case this.states.INITIALIZE:
        statePrompt = 'Rozpoczynasz nową sesję terapeutyczną. Przywitaj się z klientem i wyjaśnij, jak będzie przebiegać sesja.';
        break;
      
      case this.states.MOOD_CHECK:
        statePrompt = 'Zapytaj klienta o jego obecny nastrój i samopoczucie. Porównaj z poprzednimi sesjami, jeśli to nie jest pierwsza sesja.';
        break;
      
      case this.states.SET_AGENDA:
        statePrompt = 'Ustal z klientem agendę dzisiejszej sesji. Zapytaj, jakie tematy chciałby omówić i jakie ma oczekiwania.';
        break;
      
      case this.states.MAIN_THERAPY:
        statePrompt = 'Prowadź główną część terapeutyczną, stosując techniki odpowiednie dla wybranej metody terapii.';
        break;
      
      case this.states.SUMMARIZE:
        statePrompt = 'Podsumuj główne tematy i odkrycia z dzisiejszej sesji. Podkreśl postępy i obszary do dalszej pracy.';
        break;
      
      case this.states.FEEDBACK:
        statePrompt = 'Poproś klienta o informację zwrotną na temat sesji. Zapytaj, co było pomocne, a co można by poprawić.';
        break;
      
      case this.states.END:
        statePrompt = 'Zakończ sesję, dziękując klientowi za udział. Przypomnij o zadaniach domowych i ustal termin kolejnej sesji.';
        break;
      
      default:
        statePrompt = 'Kontynuuj sesję terapeutyczną w sposób naturalny i empatyczny.';
    }
    
    return {
      ...basePrompt,
      content: basePrompt.content + statePrompt
    };
  }
}

module.exports = new TherapyStateMachine();
