/**
 * Moduł zarządzania kontekstem terapii
 * 
 * Ten moduł odpowiada za zarządzanie kontekstem rozmowy terapeutycznej,
 * w tym za kompresję historii, ekstrakcję kluczowych informacji i dynamiczne
 * dodawanie istotnych fragmentów historii.
 */

const sessionStorage = require('../../data/storage/session_storage');
const profileStorage = require('../../data/storage/profile_storage');

/**
 * Klasa zarządzająca kontekstem terapii
 */
class ContextManager {
  /**
   * Przygotowuje kontekst dla sesji terapeutycznej
   * @param {string} profileId - ID profilu
   * @param {string} sessionId - ID sesji
   * @param {string} therapyMethod - Metoda terapii
   * @returns {Promise<Object>} - Przygotowany kontekst
   */
  async prepareContext(profileId, sessionId, therapyMethod) {
    try {
      // Pobieranie danych profilu
      const profile = await profileStorage.getProfile(profileId);
      if (!profile) {
        throw new Error('Profile not found');
      }
      
      // Pobieranie danych sesji
      const session = sessionId ? await sessionStorage.getSession(sessionId) : null;
      
      // Pobieranie poprzednich sesji
      const previousSessions = await sessionStorage.getSessionsByProfile(profileId);
      
      // Przygotowanie kontekstu
      const context = {
        sessionInfo: {
          sessionId: sessionId || 'new_session',
          startTime: new Date(),
          therapyMethod: therapyMethod || profile.therapyMethod,
          sessionNumber: previousSessions.length + 1
        },
        clientProfile: {
          clientId: profile._id,
          name: profile.name,
          goals: profile.goals.filter(goal => goal.status === 'active').map(goal => goal.description),
          challenges: profile.challenges.map(challenge => challenge.description)
        },
        therapyProgress: {
          overallStatus: profile.therapyProgress.overallStatus,
          keyInsights: profile.therapyProgress.keyInsights,
          homeworkCompletion: profile.therapyProgress.homeworkCompletion
        },
        previousSessionSummary: this.extractPreviousSessionSummary(previousSessions),
        conversationHistory: session ? this.optimizeConversationHistory(session.conversation) : []
      };
      
      return context;
    } catch (error) {
      console.error('Error preparing context:', error);
      throw error;
    }
  }

  /**
   * Ekstrahuje podsumowanie poprzedniej sesji
   * @param {Array} previousSessions - Lista poprzednich sesji
   * @returns {Object} - Podsumowanie poprzedniej sesji
   */
  extractPreviousSessionSummary(previousSessions) {
    if (!previousSessions || previousSessions.length === 0) {
      return null;
    }
    
    // Sortowanie sesji od najnowszej
    const sortedSessions = [...previousSessions].sort((a, b) => 
      new Date(b.startTime) - new Date(a.startTime)
    );
    
    // Pobieranie ostatniej zakończonej sesji
    const lastCompletedSession = sortedSessions.find(session => session.isCompleted);
    
    if (!lastCompletedSession) {
      return null;
    }
    
    return {
      mainTopics: lastCompletedSession.summary?.mainTopics || [],
      insights: lastCompletedSession.summary?.keyInsights || '',
      homework: lastCompletedSession.summary?.homework || '',
      sessionNumber: lastCompletedSession.sessionNumber
    };
  }

  /**
   * Optymalizuje historię konwersacji
   * @param {Array} conversationHistory - Historia konwersacji
   * @param {number} maxTokens - Maksymalna liczba tokenów
   * @returns {Array} - Zoptymalizowana historia konwersacji
   */
  optimizeConversationHistory(conversationHistory, maxTokens = 2000) {
    if (!conversationHistory || conversationHistory.length === 0) {
      return [];
    }
    
    // Kopia historii konwersacji
    const history = [...conversationHistory];
    
    // Jeśli historia jest krótka, zwróć ją bez zmian
    if (history.length <= 10) {
      return history;
    }
    
    // Zachowaj pierwsze 2 wiadomości (zwykle instrukcje systemowe)
    const systemMessages = history.slice(0, 2);
    
    // Zachowaj ostatnie 8 wiadomości
    const recentMessages = history.slice(-8);
    
    // Dla pozostałych wiadomości, wybierz najważniejsze
    const middleMessages = history.slice(2, -8);
    const importantMiddleMessages = this.extractImportantMessages(middleMessages);
    
    // Połącz wiadomości
    return [...systemMessages, ...importantMiddleMessages, ...recentMessages];
  }

  /**
   * Ekstrahuje najważniejsze wiadomości z historii
   * @param {Array} messages - Lista wiadomości
   * @param {number} maxToExtract - Maksymalna liczba wiadomości do ekstrakcji
   * @returns {Array} - Lista najważniejszych wiadomości
   */
  extractImportantMessages(messages, maxToExtract = 5) {
    if (!messages || messages.length === 0) {
      return [];
    }
    
    // W przyszłości tutaj będzie bardziej zaawansowany algorytm
    // Na razie wybieramy co drugą wiadomość, maksymalnie maxToExtract
    
    const importantMessages = [];
    for (let i = 0; i < messages.length; i += 2) {
      if (importantMessages.length >= maxToExtract) {
        break;
      }
      importantMessages.push(messages[i]);
    }
    
    return importantMessages;
  }

  /**
   * Aktualizuje kontekst o nową wiadomość
   * @param {Object} context - Aktualny kontekst
   * @param {string} role - Rola (system, assistant, user)
   * @param {string} content - Treść wiadomości
   * @returns {Object} - Zaktualizowany kontekst
   */
  updateContextWithMessage(context, role, content) {
    if (!context) {
      throw new Error('Context is required');
    }
    
    // Dodanie wiadomości do historii konwersacji
    const updatedContext = {
      ...context,
      conversationHistory: [
        ...(context.conversationHistory || []),
        {
          role,
          content,
          timestamp: new Date()
        }
      ]
    };
    
    // Optymalizacja historii konwersacji
    updatedContext.conversationHistory = this.optimizeConversationHistory(
      updatedContext.conversationHistory
    );
    
    return updatedContext;
  }

  /**
   * Generuje pełny prompt dla modelu LLM
   * @param {Object} context - Kontekst sesji
   * @param {string} currentState - Aktualny stan terapii
   * @returns {Array} - Lista wiadomości dla modelu LLM
   */
  generateFullPrompt(context, currentState) {
    // Instrukcja systemowa
    const systemPrompt = this.generateSystemPrompt(context, currentState);
    
    // Konwersja kontekstu na format wiadomości
    const contextMessages = this.convertContextToMessages(context);
    
    // Połączenie instrukcji systemowej z historią konwersacji
    return [systemPrompt, ...contextMessages];
  }

  /**
   * Generuje instrukcję systemową
   * @param {Object} context - Kontekst sesji
   * @param {string} currentState - Aktualny stan terapii
   * @returns {Object} - Instrukcja systemowa
   */
  generateSystemPrompt(context, currentState) {
    const therapyMethod = context.sessionInfo.therapyMethod;
    let basePrompt = `Jesteś terapeutą prowadzącym sesję terapeutyczną metodą ${therapyMethod}. `;
    
    // Dodanie informacji o kliencie
    basePrompt += `Twój klient ma na imię ${context.clientProfile.name}. `;
    
    // Dodanie informacji o celach terapii
    if (context.clientProfile.goals && context.clientProfile.goals.length > 0) {
      basePrompt += `Cele terapeutyczne klienta to: ${context.clientProfile.goals.join(', ')}. `;
    }
    
    // Dodanie informacji o wyzwaniach
    if (context.clientProfile.challenges && context.clientProfile.challenges.length > 0) {
      basePrompt += `Klient zmaga się z następującymi wyzwaniami: ${context.clientProfile.challenges.join(', ')}. `;
    }
    
    // Dodanie informacji o postępie terapii
    if (context.therapyProgress) {
      basePrompt += `Ogólny status terapii: ${context.therapyProgress.overallStatus}. `;
    }
    
    // Dodanie informacji o poprzedniej sesji
    if (context.previousSessionSummary) {
      basePrompt += `W poprzedniej sesji (nr ${context.previousSessionSummary.sessionNumber}) omawiane były tematy: ${context.previousSessionSummary.mainTopics.join(', ')}. `;
      basePrompt += `Kluczowe spostrzeżenia: ${context.previousSessionSummary.insights}. `;
      
      if (context.previousSessionSummary.homework) {
        basePrompt += `Zadane ćwiczenia: ${context.previousSessionSummary.homework}. `;
      }
    }
    
    // Dodanie instrukcji dla aktualnego stanu
    let statePrompt = '';
    switch (currentState) {
      case 'initialize':
        statePrompt = 'Rozpoczynasz nową sesję terapeutyczną. Przywitaj się z klientem i wyjaśnij, jak będzie przebiegać sesja.';
        break;
      case 'mood_check':
        statePrompt = 'Zapytaj klienta o jego obecny nastrój i samopoczucie. Porównaj z poprzednimi sesjami, jeśli to nie jest pierwsza sesja.';
        break;
      case 'set_agenda':
        statePrompt = 'Ustal z klientem agendę dzisiejszej sesji. Zapytaj, jakie tematy chciałby omówić i jakie ma oczekiwania.';
        break;
      case 'main_therapy':
        statePrompt = 'Prowadź główną część terapeutyczną, stosując techniki odpowiednie dla wybranej metody terapii.';
        break;
      case 'summarize':
        statePrompt = 'Podsumuj główne tematy i odkrycia z dzisiejszej sesji. Podkreśl postępy i obszary do dalszej pracy.';
        break;
      case 'feedback':
        statePrompt = 'Poproś klienta o informację zwrotną na temat sesji. Zapytaj, co było pomocne, a co można by poprawić.';
        break;
      case 'end':
        statePrompt = 'Zakończ sesję, dziękując klientowi za udział. Przypomnij o zadaniach domowych i ustal termin kolejnej sesji.';
        break;
      default:
        statePrompt = 'Kontynuuj sesję terapeutyczną w sposób naturalny i empatyczny.';
    }
    
    basePrompt += statePrompt;
    
    return {
      role: 'system',
      content: basePrompt
    };
  }

  /**
   * Konwertuje kontekst na format wiadomości
   * @param {Object} context - Kontekst sesji
   * @returns {Array} - Lista wiadomości
   */
  convertContextToMessages(context) {
    if (!context.conversationHistory) {
      return [];
    }
    
    return context.conversationHistory.map(message => ({
      role: message.role,
      content: message.content
    }));
  }
}

module.exports = new ContextManager();
