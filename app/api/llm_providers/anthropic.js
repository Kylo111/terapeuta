/**
 * Moduł integracji z API Anthropic (Claude)
 */

const dotenv = require('dotenv');
dotenv.config();

/**
 * Klasa do obsługi integracji z Anthropic API
 */
class AnthropicProvider {
  constructor() {
    this.apiKey = process.env.ANTHROPIC_API_KEY;
    this.baseUrl = 'https://api.anthropic.com/v1';
    this.anthropicVersion = '2023-06-01'; // Aktualna wersja API
  }

  /**
   * Wysyła zapytanie do modelu Claude
   * @param {string} model - Nazwa modelu (np. 'claude-3-opus-20240229')
   * @param {Array} messages - Tablica wiadomości w formacie Anthropic
   * @param {Object} options - Dodatkowe opcje (temperatura, max_tokens itp.)
   * @returns {Promise<Object>} - Odpowiedź od API
   */
  async generateMessage(model, messages, options = {}) {
    try {
      const response = await fetch(`${this.baseUrl}/messages`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-api-key': this.apiKey,
          'anthropic-version': this.anthropicVersion
        },
        body: JSON.stringify({
          model: model,
          messages: messages,
          max_tokens: options.max_tokens || 1000,
          temperature: options.temperature || 0.7,
          top_p: options.top_p || 1,
          top_k: options.top_k || null,
          system: options.system || null
        })
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(`Anthropic API error: ${error.error?.message || response.statusText}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Error calling Anthropic API:', error);
      throw error;
    }
  }

  /**
   * Konwertuje wiadomości z formatu OpenAI do formatu Anthropic
   * @param {Array} openaiMessages - Wiadomości w formacie OpenAI
   * @returns {Object} - Obiekt zawierający wiadomości w formacie Anthropic i system prompt
   */
  convertFromOpenAIFormat(openaiMessages) {
    let systemPrompt = '';
    const anthropicMessages = [];

    for (const message of openaiMessages) {
      if (message.role === 'system') {
        systemPrompt = message.content;
      } else if (message.role === 'user' || message.role === 'assistant') {
        anthropicMessages.push({
          role: message.role,
          content: message.content
        });
      }
    }

    return {
      messages: anthropicMessages,
      system: systemPrompt
    };
  }
}

module.exports = new AnthropicProvider();
