/**
 * Moduł zarządzający integracjami z API modeli LLM
 */

const openaiProvider = require('./llm_providers/openai');
const anthropicProvider = require('./llm_providers/anthropic');

/**
 * Klasa zarządzająca dostępem do różnych dostawców modeli LLM
 */
class APIManager {
  constructor() {
    this.providers = {
      openai: openaiProvider,
      anthropic: anthropicProvider
      // Tutaj można dodać więcej dostawców
    };
  }

  /**
   * Pobiera instancję dostawcy API
   * @param {string} providerName - Nazwa dostawcy (np. 'openai', 'anthropic')
   * @returns {Object} - Instancja dostawcy API
   */
  getProvider(providerName) {
    const provider = this.providers[providerName.toLowerCase()];
    if (!provider) {
      throw new Error(`Provider '${providerName}' not found`);
    }
    return provider;
  }

  /**
   * Generuje odpowiedź od modelu LLM
   * @param {string} providerName - Nazwa dostawcy (np. 'openai', 'anthropic')
   * @param {string} modelName - Nazwa modelu
   * @param {Array} messages - Wiadomości w formacie OpenAI
   * @param {Object} options - Dodatkowe opcje
   * @returns {Promise<Object>} - Odpowiedź od API
   */
  async generateCompletion(providerName, modelName, messages, options = {}) {
    const provider = this.getProvider(providerName);
    
    switch (providerName.toLowerCase()) {
      case 'openai':
        return await provider.generateCompletion(modelName, messages, options);
      
      case 'anthropic':
        const { messages: anthropicMessages, system } = provider.convertFromOpenAIFormat(messages);
        options.system = system;
        return await provider.generateMessage(modelName, anthropicMessages, options);
      
      // Tutaj można dodać obsługę innych dostawców
      
      default:
        throw new Error(`Provider '${providerName}' not supported for completions`);
    }
  }

  /**
   * Generuje embeddingi dla podanego tekstu
   * @param {string} providerName - Nazwa dostawcy (np. 'openai')
   * @param {string} text - Tekst do wygenerowania embeddingów
   * @param {string} modelName - Opcjonalna nazwa modelu
   * @returns {Promise<Object>} - Odpowiedź od API z embeddingami
   */
  async generateEmbeddings(providerName, text, modelName = null) {
    const provider = this.getProvider(providerName);
    
    switch (providerName.toLowerCase()) {
      case 'openai':
        return await provider.generateEmbeddings(text, modelName || 'text-embedding-3-small');
      
      // Tutaj można dodać obsługę innych dostawców
      
      default:
        throw new Error(`Provider '${providerName}' not supported for embeddings`);
    }
  }
}

module.exports = new APIManager();
