/**
 * Moduł zarządzania metodami terapii
 * 
 * Ten moduł jest odpowiedzialny za zarządzanie wszystkimi metodami terapii i ich promptami.
 */

// Importowanie wszystkich metod terapii
const cognitiveBehavioralTherapy = require('./cognitive_behavioral');
const psychodynamicTherapy = require('./psychodynamic');
const humanisticTherapy = require('./humanistic');
const systemicTherapy = require('./systemic');
const solutionFocusedTherapy = require('./solution_focused');

/**
 * Klasa zarządzająca metodami terapii
 */
class TherapyMethodsManager {
  constructor() {
    // Inicjalizacja mapy metod terapii
    this.therapyMethods = new Map();
    
    // Dodanie wszystkich metod terapii do mapy
    this.addTherapyMethod(cognitiveBehavioralTherapy);
    this.addTherapyMethod(psychodynamicTherapy);
    this.addTherapyMethod(humanisticTherapy);
    this.addTherapyMethod(systemicTherapy);
    this.addTherapyMethod(solutionFocusedTherapy);
  }

  /**
   * Dodaje metodę terapii do mapy
   * @param {Object} therapyMethod - Obiekt metody terapii
   */
  addTherapyMethod(therapyMethod) {
    this.therapyMethods.set(therapyMethod.methodName, therapyMethod);
  }

  /**
   * Zwraca metodę terapii o podanej nazwie
   * @param {string} methodName - Nazwa metody terapii
   * @returns {Object} - Obiekt metody terapii
   */
  getTherapyMethod(methodName) {
    return this.therapyMethods.get(methodName);
  }

  /**
   * Zwraca listę wszystkich dostępnych metod terapii
   * @returns {Array} - Lista obiektów metod terapii
   */
  getAllTherapyMethods() {
    return Array.from(this.therapyMethods.values());
  }

  /**
   * Zwraca listę nazw wszystkich dostępnych metod terapii
   * @returns {Array} - Lista nazw metod terapii
   */
  getAllTherapyMethodNames() {
    return Array.from(this.therapyMethods.keys());
  }

  /**
   * Zwraca listę metadanych wszystkich dostępnych metod terapii
   * @returns {Array} - Lista metadanych metod terapii
   */
  getAllTherapyMethodsMetadata() {
    return Array.from(this.therapyMethods.values()).map(method => ({
      methodName: method.methodName,
      displayName: method.displayName,
      description: method.description
    }));
  }

  /**
   * Aktualizuje prompt dla określonej metody terapii
   * @param {string} methodName - Nazwa metody terapii
   * @param {string} promptType - Typ prompta (np. 'systemPrompt', 'initializePrompt')
   * @param {string} newPrompt - Nowy tekst prompta
   * @returns {boolean} - Czy aktualizacja się powiodła
   */
  updatePrompt(methodName, promptType, newPrompt) {
    const method = this.getTherapyMethod(methodName);
    if (method && typeof method.updatePrompt === 'function') {
      return method.updatePrompt(promptType, newPrompt);
    }
    return false;
  }

  /**
   * Resetuje prompt do wartości domyślnej dla określonej metody terapii
   * @param {string} methodName - Nazwa metody terapii
   * @param {string} promptType - Typ prompta (np. 'systemPrompt', 'initializePrompt')
   * @returns {boolean} - Czy reset się powiódł
   */
  resetPromptToDefault(methodName, promptType) {
    const method = this.getTherapyMethod(methodName);
    if (method && typeof method.resetPromptToDefault === 'function') {
      return method.resetPromptToDefault(promptType);
    }
    return false;
  }

  /**
   * Zwraca wszystkie prompty dla określonej metody terapii
   * @param {string} methodName - Nazwa metody terapii
   * @returns {Object} - Obiekt zawierający wszystkie prompty
   */
  getAllPrompts(methodName) {
    const method = this.getTherapyMethod(methodName);
    if (method && method.prompts) {
      return method.prompts;
    }
    return null;
  }

  /**
   * Zwraca prompt określonego typu dla określonej metody terapii
   * @param {string} methodName - Nazwa metody terapii
   * @param {string} promptType - Typ prompta (np. 'systemPrompt', 'initializePrompt')
   * @returns {string} - Tekst prompta
   */
  getPrompt(methodName, promptType) {
    const method = this.getTherapyMethod(methodName);
    if (method && method.prompts && method.prompts[promptType]) {
      return method.prompts[promptType];
    }
    return null;
  }

  /**
   * Zwraca listę wszystkich typów promptów
   * @returns {Array} - Lista typów promptów
   */
  getAllPromptTypes() {
    return [
      'systemPrompt',
      'initializePrompt',
      'moodCheckPrompt',
      'setAgendaPrompt',
      'mainTherapyPrompt',
      'summarizePrompt',
      'feedbackPrompt',
      'endPrompt'
    ];
  }

  /**
   * Zwraca metadane wszystkich typów promptów
   * @returns {Array} - Lista metadanych typów promptów
   */
  getAllPromptTypesMetadata() {
    return [
      {
        type: 'systemPrompt',
        displayName: 'Prompt systemowy',
        description: 'Główny prompt definiujący rolę i podejście terapeuty.'
      },
      {
        type: 'initializePrompt',
        displayName: 'Prompt inicjalizacji',
        description: 'Prompt używany na początku sesji do przywitania klienta i ustalenia kontekstu.'
      },
      {
        type: 'moodCheckPrompt',
        displayName: 'Prompt sprawdzenia nastroju',
        description: 'Prompt używany do sprawdzenia nastroju i samopoczucia klienta.'
      },
      {
        type: 'setAgendaPrompt',
        displayName: 'Prompt ustalenia agendy',
        description: 'Prompt używany do ustalenia agendy i celów sesji.'
      },
      {
        type: 'mainTherapyPrompt',
        displayName: 'Prompt głównej części terapii',
        description: 'Prompt używany w głównej części terapeutycznej sesji.'
      },
      {
        type: 'summarizePrompt',
        displayName: 'Prompt podsumowania',
        description: 'Prompt używany do podsumowania sesji i głównych odkryć.'
      },
      {
        type: 'feedbackPrompt',
        displayName: 'Prompt informacji zwrotnej',
        description: 'Prompt używany do zebrania informacji zwrotnej od klienta.'
      },
      {
        type: 'endPrompt',
        displayName: 'Prompt zakończenia',
        description: 'Prompt używany do zakończenia sesji i zadania zadań domowych.'
      }
    ];
  }
}

module.exports = new TherapyMethodsManager();
