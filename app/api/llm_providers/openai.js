/**
 * Moduł integracji z API OpenAI
 */

const dotenv = require('dotenv');
dotenv.config();

/**
 * Klasa do obsługi integracji z OpenAI API
 */
class OpenAIProvider {
  constructor() {
    this.apiKey = process.env.OPENAI_API_KEY;
    this.baseUrl = 'https://api.openai.com/v1';
  }

  /**
   * Wysyła zapytanie do modelu OpenAI
   * @param {string} model - Nazwa modelu (np. 'gpt-4')
   * @param {Array} messages - Tablica wiadomości w formacie OpenAI
   * @param {Object} options - Dodatkowe opcje (temperatura, max_tokens itp.)
   * @returns {Promise<Object>} - Odpowiedź od API
   */
  async generateCompletion(model, messages, options = {}) {
    try {
      const response = await fetch(`${this.baseUrl}/chat/completions`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.apiKey}`
        },
        body: JSON.stringify({
          model: model,
          messages: messages,
          temperature: options.temperature || 0.7,
          max_tokens: options.max_tokens || 1000,
          top_p: options.top_p || 1,
          frequency_penalty: options.frequency_penalty || 0,
          presence_penalty: options.presence_penalty || 0
        })
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(`OpenAI API error: ${error.error?.message || response.statusText}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Error calling OpenAI API:', error);
      throw error;
    }
  }

  /**
   * Generuje embeddingi dla podanego tekstu
   * @param {string} text - Tekst do wygenerowania embeddingów
   * @param {string} model - Model do generowania embeddingów (domyślnie 'text-embedding-3-small')
   * @returns {Promise<Object>} - Odpowiedź od API z embeddingami
   */
  async generateEmbeddings(text, model = 'text-embedding-3-small') {
    try {
      const response = await fetch(`${this.baseUrl}/embeddings`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.apiKey}`
        },
        body: JSON.stringify({
          model: model,
          input: text
        })
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(`OpenAI API error: ${error.error?.message || response.statusText}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Error generating embeddings:', error);
      throw error;
    }
  }
}

module.exports = new OpenAIProvider();
