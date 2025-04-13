/**
 * Moduł obsługi sesji terapeutycznej
 * 
 * Ten moduł koordynuje przebieg sesji terapeutycznej, łącząc maszynę stanów,
 * zarządzanie kontekstem i komunikację z modelami LLM.
 */

const stateMachine = require('./state_machine');
const contextManager = require('./context_manager');
const apiManager = require('../../api/api_manager');
const sessionStorage = require('../../data/storage/session_storage');
const profileStorage = require('../../data/storage/profile_storage');

/**
 * Klasa obsługująca sesję terapeutyczną
 */
class SessionHandler {
  /**
   * Inicjalizuje nową sesję terapeutyczną
   * @param {string} profileId - ID profilu
   * @param {string} therapyMethod - Metoda terapii
   * @returns {Promise<Object>} - Zainicjalizowana sesja
   */
  async initializeSession(profileId, therapyMethod) {
    try {
      // Pobieranie profilu
      const profile = await profileStorage.getProfile(profileId);
      if (!profile) {
        throw new Error('Profile not found');
      }
      
      // Pobieranie poprzednich sesji
      const previousSessions = await sessionStorage.getSessionsByProfile(profileId);
      
      // Określenie numeru sesji
      const sessionNumber = previousSessions.length + 1;
      
      // Określenie statusu ciągłości
      let continuityStatus = 'new';
      if (previousSessions.length > 0) {
        const lastSession = previousSessions[0]; // Zakładamy, że są posortowane od najnowszej
        const timeSinceLastSession = new Date() - new Date(lastSession.startTime);
        const daysSinceLastSession = timeSinceLastSession / (1000 * 60 * 60 * 24);
        
        if (daysSinceLastSession < 1) {
          continuityStatus = 'continued';
        } else if (daysSinceLastSession > 7) {
          continuityStatus = 'resumed_after_break';
        } else {
          continuityStatus = 'new';
        }
      }
      
      // Tworzenie nowej sesji w bazie danych
      const newSession = await sessionStorage.saveSession({
        profile: profileId,
        startTime: new Date(),
        therapyMethod: therapyMethod || profile.therapyMethod,
        sessionNumber,
        continuityStatus,
        conversation: [],
        isCompleted: false
      });
      
      // Inicjalizacja maszyny stanów
      const { state, context } = stateMachine.initializeSession({
        sessionId: newSession._id,
        profileId,
        therapyMethod: therapyMethod || profile.therapyMethod,
        sessionNumber,
        continuityStatus
      });
      
      // Przygotowanie kontekstu
      const sessionContext = await contextManager.prepareContext(
        profileId,
        newSession._id,
        therapyMethod || profile.therapyMethod
      );
      
      // Generowanie pierwszej wiadomości od asystenta
      const initialPrompt = contextManager.generateFullPrompt(sessionContext, state);
      const response = await this.generateResponse(initialPrompt, profile.settings?.preferredLLMProvider || 'openai');
      
      // Zapisanie wiadomości systemowej i odpowiedzi asystenta
      await sessionStorage.addMessageToSession(newSession._id, 'system', initialPrompt[0].content);
      await sessionStorage.addMessageToSession(newSession._id, 'assistant', response);
      
      // Aktualizacja kontekstu
      const updatedContext = contextManager.updateContextWithMessage(sessionContext, 'assistant', response);
      
      return {
        sessionId: newSession._id,
        state,
        message: response,
        context: updatedContext
      };
    } catch (error) {
      console.error('Error initializing session:', error);
      throw error;
    }
  }

  /**
   * Przetwarza wiadomość użytkownika
   * @param {string} sessionId - ID sesji
   * @param {string} message - Wiadomość użytkownika
   * @returns {Promise<Object>} - Odpowiedź asystenta i zaktualizowany stan
   */
  async processUserMessage(sessionId, message) {
    try {
      // Pobieranie sesji
      const session = await sessionStorage.getSession(sessionId);
      if (!session) {
        throw new Error('Session not found');
      }
      
      // Pobieranie profilu
      const profile = await profileStorage.getProfile(session.profile);
      if (!profile) {
        throw new Error('Profile not found');
      }
      
      // Pobieranie aktualnego stanu
      const { state, context } = stateMachine.getCurrentState() || 
        stateMachine.initializeSession({
          sessionId,
          profileId: session.profile,
          therapyMethod: session.therapyMethod,
          sessionNumber: session.sessionNumber,
          continuityStatus: session.continuityStatus
        });
      
      // Przygotowanie kontekstu
      const sessionContext = await contextManager.prepareContext(
        session.profile,
        sessionId,
        session.therapyMethod
      );
      
      // Zapisanie wiadomości użytkownika
      await sessionStorage.addMessageToSession(sessionId, 'user', message);
      
      // Aktualizacja kontekstu o wiadomość użytkownika
      const updatedContext = contextManager.updateContextWithMessage(sessionContext, 'user', message);
      
      // Generowanie odpowiedzi asystenta
      const prompt = contextManager.generateFullPrompt(updatedContext, state);
      const response = await this.generateResponse(prompt, profile.settings?.preferredLLMProvider || 'openai');
      
      // Zapisanie odpowiedzi asystenta
      await sessionStorage.addMessageToSession(sessionId, 'assistant', response);
      
      // Aktualizacja kontekstu o odpowiedź asystenta
      const finalContext = contextManager.updateContextWithMessage(updatedContext, 'assistant', response);
      
      // Sprawdzenie, czy należy przejść do następnego stanu
      // W przyszłości tutaj będzie bardziej zaawansowana logika
      const shouldTransition = Math.random() > 0.7; // Przykładowa logika
      
      let newState = state;
      if (shouldTransition) {
        const { state: nextState } = stateMachine.transition();
        newState = nextState;
      }
      
      return {
        sessionId,
        state: newState,
        message: response,
        context: finalContext
      };
    } catch (error) {
      console.error('Error processing user message:', error);
      throw error;
    }
  }

  /**
   * Kończy sesję terapeutyczną
   * @param {string} sessionId - ID sesji
   * @returns {Promise<Object>} - Podsumowanie sesji
   */
  async endSession(sessionId) {
    try {
      // Pobieranie sesji
      const session = await sessionStorage.getSession(sessionId);
      if (!session) {
        throw new Error('Session not found');
      }
      
      // Przejście do stanu podsumowania
      stateMachine.transition(stateMachine.states.SUMMARIZE);
      
      // Przygotowanie kontekstu
      const sessionContext = await contextManager.prepareContext(
        session.profile,
        sessionId,
        session.therapyMethod
      );
      
      // Generowanie podsumowania
      const summaryPrompt = contextManager.generateFullPrompt(sessionContext, stateMachine.states.SUMMARIZE);
      const summaryResponse = await this.generateResponse(summaryPrompt, 'openai');
      
      // Zapisanie podsumowania
      await sessionStorage.addMessageToSession(sessionId, 'assistant', summaryResponse);
      
      // Ekstrakcja podsumowania z odpowiedzi
      // W przyszłości tutaj będzie bardziej zaawansowana logika
      const summary = {
        mainTopics: ['Temat 1', 'Temat 2'], // Przykładowe dane
        keyInsights: summaryResponse.substring(0, 200),
        progress: 'Zauważalny postęp',
        homework: 'Zadanie domowe'
      };
      
      // Zakończenie sesji
      await sessionStorage.endSession(sessionId, summary, {
        emotionalState: {
          anxiety: 5,
          depression: 4,
          optimism: 6
        },
        effectivenessRating: 8
      });
      
      // Przejście do stanu końcowego
      stateMachine.transition(stateMachine.states.END);
      
      return {
        sessionId,
        summary,
        state: stateMachine.states.END
      };
    } catch (error) {
      console.error('Error ending session:', error);
      throw error;
    }
  }

  /**
   * Generuje odpowiedź od modelu LLM
   * @param {Array} messages - Lista wiadomości
   * @param {string} provider - Dostawca modelu LLM
   * @returns {Promise<string>} - Odpowiedź modelu
   */
  async generateResponse(messages, provider = 'openai') {
    try {
      let modelName;
      
      switch (provider.toLowerCase()) {
        case 'openai':
          modelName = 'gpt-4';
          break;
        case 'anthropic':
          modelName = 'claude-3-opus-20240229';
          break;
        default:
          modelName = 'gpt-4';
      }
      
      const response = await apiManager.generateCompletion(
        provider,
        modelName,
        messages,
        {
          temperature: 0.7,
          max_tokens: 1000
        }
      );
      
      // Ekstrakcja odpowiedzi z różnych formatów
      let responseText = '';
      
      if (provider.toLowerCase() === 'openai') {
        responseText = response.choices[0].message.content;
      } else if (provider.toLowerCase() === 'anthropic') {
        responseText = response.content[0].text;
      } else {
        responseText = response.toString();
      }
      
      return responseText;
    } catch (error) {
      console.error('Error generating response:', error);
      return 'Przepraszam, wystąpił błąd podczas generowania odpowiedzi. Proszę spróbować ponownie.';
    }
  }
}

module.exports = new SessionHandler();
