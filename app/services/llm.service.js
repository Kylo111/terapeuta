/**
 * Serwis do obsługi modeli językowych (LLM)
 * @module services/llm
 */

const fetch = require('node-fetch');
const { User } = require('../data/models');

/**
 * Klasa serwisu LLM
 */
class LLMService {
  constructor() {
    this.providers = {
      openai: {
        apiKey: process.env.OPENAI_API_KEY,
        baseUrl: 'https://api.openai.com/v1',
        defaultModel: 'gpt-4o',
        defaultEmbeddingModel: 'text-embedding-3-small'
      },
      anthropic: {
        apiKey: process.env.ANTHROPIC_API_KEY,
        baseUrl: 'https://api.anthropic.com/v1',
        anthropicVersion: '2023-06-01',
        defaultModel: 'claude-3-opus-20240229',
      },
      google: {
        apiKey: process.env.GOOGLE_API_KEY,
        baseUrl: 'https://generativelanguage.googleapis.com/v1beta',
        defaultModel: 'gemini-pro'
      },
      huggingface: {
        apiKey: process.env.HUGGINGFACE_API_KEY,
        baseUrl: 'https://api-inference.huggingface.co/models',
        defaultModel: 'mistralai/Mixtral-8x7B-Instruct-v0.1'
      }
    };
  }

  /**
   * Pobiera konfigurację dostawcy
   * @param {string} providerName - Nazwa dostawcy
   * @returns {Object} - Konfiguracja dostawcy
   */
  getProviderConfig(providerName) {
    const provider = this.providers[providerName.toLowerCase()];
    if (!provider) {
      throw new Error(`Provider '${providerName}' not found`);
    }
    return provider;
  }

  /**
   * Pobiera preferowanego dostawcę i model dla użytkownika
   * @param {string} userId - ID użytkownika
   * @returns {Promise<Object>} - Preferowany dostawca i model
   */
  async getUserPreferences(userId) {
    try {
      const user = await User.findById(userId);
      if (!user) {
        return {
          provider: 'openai',
          model: 'gpt-4o'
        };
      }

      return {
        provider: user.settings.preferredLLMProvider,
        model: user.settings.preferredModel
      };
    } catch (error) {
      console.error('Error getting user preferences:', error);
      return {
        provider: 'openai',
        model: 'gpt-4o'
      };
    }
  }

  /**
   * Generuje odpowiedź od modelu LLM
   * @param {string} providerName - Nazwa dostawcy
   * @param {string} modelName - Nazwa modelu
   * @param {Array} messages - Tablica wiadomości
   * @param {Object} options - Dodatkowe opcje
   * @returns {Promise<Object>} - Odpowiedź od modelu
   */
  async generateCompletion(providerName, modelName, messages, options = {}) {
    const provider = this.getProviderConfig(providerName);

    switch (providerName.toLowerCase()) {
      case 'openai':
        return await this.generateOpenAICompletion(provider, modelName || provider.defaultModel, messages, options);
      case 'anthropic':
        return await this.generateAnthropicCompletion(provider, modelName || provider.defaultModel, messages, options);
      case 'google':
        return await this.generateGoogleCompletion(provider, modelName || provider.defaultModel, messages, options);
      case 'huggingface':
        return await this.generateHuggingFaceCompletion(provider, modelName || provider.defaultModel, messages, options);
      default:
        throw new Error(`Provider '${providerName}' not supported for completions`);
    }
  }

  /**
   * Generuje odpowiedź od modelu OpenAI
   * @param {Object} provider - Konfiguracja dostawcy
   * @param {string} modelName - Nazwa modelu
   * @param {Array} messages - Tablica wiadomości
   * @param {Object} options - Dodatkowe opcje
   * @returns {Promise<Object>} - Odpowiedź od modelu
   */
  async generateOpenAICompletion(provider, modelName, messages, options = {}) {
    try {
      const response = await fetch(`${provider.baseUrl}/chat/completions`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${provider.apiKey}`
        },
        body: JSON.stringify({
          model: modelName,
          messages: messages,
          temperature: options.temperature || 0.7,
          max_tokens: options.maxTokens || 1000,
          top_p: options.topP || 1,
          frequency_penalty: options.frequencyPenalty || 0,
          presence_penalty: options.presencePenalty || 0
        })
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(`OpenAI API error: ${error.error?.message || response.statusText}`);
      }

      const data = await response.json();
      
      return {
        id: data.id,
        message: data.choices[0].message,
        usage: data.usage
      };
    } catch (error) {
      console.error('Error calling OpenAI API:', error);
      throw error;
    }
  }

  /**
   * Generuje odpowiedź od modelu Anthropic
   * @param {Object} provider - Konfiguracja dostawcy
   * @param {string} modelName - Nazwa modelu
   * @param {Array} messages - Tablica wiadomości
   * @param {Object} options - Dodatkowe opcje
   * @returns {Promise<Object>} - Odpowiedź od modelu
   */
  async generateAnthropicCompletion(provider, modelName, messages, options = {}) {
    try {
      // Konwersja wiadomości z formatu OpenAI na format Anthropic
      const anthropicMessages = messages.map(msg => ({
        role: msg.role === 'assistant' ? 'assistant' : msg.role === 'system' ? 'system' : 'user',
        content: msg.content
      }));

      const response = await fetch(`${provider.baseUrl}/messages`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-api-key': provider.apiKey,
          'anthropic-version': provider.anthropicVersion
        },
        body: JSON.stringify({
          model: modelName,
          messages: anthropicMessages,
          max_tokens: options.maxTokens || 1000,
          temperature: options.temperature || 0.7
        })
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(`Anthropic API error: ${error.error?.message || response.statusText}`);
      }

      const data = await response.json();
      
      return {
        id: data.id,
        message: {
          role: 'assistant',
          content: data.content[0].text
        },
        usage: {
          promptTokens: data.usage.input_tokens,
          completionTokens: data.usage.output_tokens,
          totalTokens: data.usage.input_tokens + data.usage.output_tokens
        }
      };
    } catch (error) {
      console.error('Error calling Anthropic API:', error);
      throw error;
    }
  }

  /**
   * Generuje odpowiedź od modelu Google
   * @param {Object} provider - Konfiguracja dostawcy
   * @param {string} modelName - Nazwa modelu
   * @param {Array} messages - Tablica wiadomości
   * @param {Object} options - Dodatkowe opcje
   * @returns {Promise<Object>} - Odpowiedź od modelu
   */
  async generateGoogleCompletion(provider, modelName, messages, options = {}) {
    try {
      // Konwersja wiadomości z formatu OpenAI na format Google
      const contents = [];
      
      for (const msg of messages) {
        if (msg.role === 'system') {
          contents.push({
            role: 'user',
            parts: [{ text: msg.content }]
          });
          contents.push({
            role: 'model',
            parts: [{ text: 'I understand. I will follow these instructions.' }]
          });
        } else {
          contents.push({
            role: msg.role === 'assistant' ? 'model' : 'user',
            parts: [{ text: msg.content }]
          });
        }
      }

      const response = await fetch(`${provider.baseUrl}/models/${modelName}:generateContent?key=${provider.apiKey}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          contents,
          generationConfig: {
            temperature: options.temperature || 0.7,
            maxOutputTokens: options.maxTokens || 1000,
            topP: options.topP || 0.95,
            topK: options.topK || 40
          }
        })
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(`Google API error: ${error.error?.message || response.statusText}`);
      }

      const data = await response.json();
      
      return {
        id: data.id || 'google-response',
        message: {
          role: 'assistant',
          content: data.candidates[0].content.parts[0].text
        },
        usage: {
          promptTokens: 0, // Google API nie zwraca informacji o tokenach
          completionTokens: 0,
          totalTokens: 0
        }
      };
    } catch (error) {
      console.error('Error calling Google API:', error);
      throw error;
    }
  }

  /**
   * Generuje odpowiedź od modelu HuggingFace
   * @param {Object} provider - Konfiguracja dostawcy
   * @param {string} modelName - Nazwa modelu
   * @param {Array} messages - Tablica wiadomości
   * @param {Object} options - Dodatkowe opcje
   * @returns {Promise<Object>} - Odpowiedź od modelu
   */
  async generateHuggingFaceCompletion(provider, modelName, messages, options = {}) {
    try {
      // Konwersja wiadomości z formatu OpenAI na format HuggingFace
      let prompt = '';
      
      for (const msg of messages) {
        if (msg.role === 'system') {
          prompt += `System: ${msg.content}\n\n`;
        } else if (msg.role === 'user') {
          prompt += `Human: ${msg.content}\n\n`;
        } else if (msg.role === 'assistant') {
          prompt += `Assistant: ${msg.content}\n\n`;
        }
      }
      
      prompt += 'Assistant: ';

      const response = await fetch(`${provider.baseUrl}/${modelName}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${provider.apiKey}`
        },
        body: JSON.stringify({
          inputs: prompt,
          parameters: {
            temperature: options.temperature || 0.7,
            max_new_tokens: options.maxTokens || 1000,
            top_p: options.topP || 0.95,
            do_sample: true
          }
        })
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(`HuggingFace API error: ${error.error || response.statusText}`);
      }

      const data = await response.json();
      
      return {
        id: 'huggingface-response',
        message: {
          role: 'assistant',
          content: data[0].generated_text.replace(prompt, '')
        },
        usage: {
          promptTokens: 0, // HuggingFace API nie zwraca informacji o tokenach
          completionTokens: 0,
          totalTokens: 0
        }
      };
    } catch (error) {
      console.error('Error calling HuggingFace API:', error);
      throw error;
    }
  }

  /**
   * Generuje embeddingi dla tekstu
   * @param {string} providerName - Nazwa dostawcy
   * @param {string} text - Tekst do wygenerowania embeddingów
   * @param {string} modelName - Nazwa modelu
   * @returns {Promise<Object>} - Odpowiedź z embeddingami
   */
  async generateEmbeddings(providerName, text, modelName = null) {
    const provider = this.getProviderConfig(providerName);

    switch (providerName.toLowerCase()) {
      case 'openai':
        return await this.generateOpenAIEmbeddings(provider, text, modelName || provider.defaultEmbeddingModel);
      default:
        throw new Error(`Provider '${providerName}' not supported for embeddings`);
    }
  }

  /**
   * Generuje embeddingi dla tekstu za pomocą OpenAI
   * @param {Object} provider - Konfiguracja dostawcy
   * @param {string} text - Tekst do wygenerowania embeddingów
   * @param {string} modelName - Nazwa modelu
   * @returns {Promise<Object>} - Odpowiedź z embeddingami
   */
  async generateOpenAIEmbeddings(provider, text, modelName) {
    try {
      const response = await fetch(`${provider.baseUrl}/embeddings`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${provider.apiKey}`
        },
        body: JSON.stringify({
          model: modelName,
          input: text
        })
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(`OpenAI API error: ${error.error?.message || response.statusText}`);
      }

      const data = await response.json();
      
      return {
        embedding: data.data[0].embedding,
        usage: data.usage
      };
    } catch (error) {
      console.error('Error generating OpenAI embeddings:', error);
      throw error;
    }
  }

  /**
   * Pobiera dostępnych dostawców LLM
   * @returns {Array} - Lista dostępnych dostawców
   */
  getAvailableProviders() {
    return Object.keys(this.providers).map(providerName => {
      const provider = this.providers[providerName];
      const isAvailable = !!provider.apiKey;
      
      return {
        id: providerName,
        name: this.getProviderDisplayName(providerName),
        description: this.getProviderDescription(providerName),
        isAvailable
      };
    });
  }

  /**
   * Pobiera dostępne modele dla dostawcy
   * @param {string} providerName - Nazwa dostawcy
   * @returns {Array} - Lista dostępnych modeli
   */
  getAvailableModels(providerName) {
    switch (providerName.toLowerCase()) {
      case 'openai':
        return [
          {
            id: 'gpt-4o',
            name: 'GPT-4o',
            description: 'Najnowszy model GPT-4o',
            contextWindow: 128000,
            isAvailable: true
          },
          {
            id: 'gpt-4-turbo',
            name: 'GPT-4 Turbo',
            description: 'Szybszy model GPT-4',
            contextWindow: 128000,
            isAvailable: true
          },
          {
            id: 'gpt-4',
            name: 'GPT-4',
            description: 'Model GPT-4',
            contextWindow: 8192,
            isAvailable: true
          },
          {
            id: 'gpt-3.5-turbo',
            name: 'GPT-3.5 Turbo',
            description: 'Szybszy i tańszy model GPT-3.5',
            contextWindow: 16385,
            isAvailable: true
          }
        ];
      case 'anthropic':
        return [
          {
            id: 'claude-3-opus-20240229',
            name: 'Claude 3 Opus',
            description: 'Najnowszy i najbardziej zaawansowany model Claude',
            contextWindow: 200000,
            isAvailable: true
          },
          {
            id: 'claude-3-sonnet-20240229',
            name: 'Claude 3 Sonnet',
            description: 'Zrównoważony model Claude pod względem inteligencji i szybkości',
            contextWindow: 200000,
            isAvailable: true
          },
          {
            id: 'claude-3-haiku-20240307',
            name: 'Claude 3 Haiku',
            description: 'Najszybszy i najtańszy model Claude',
            contextWindow: 200000,
            isAvailable: true
          }
        ];
      case 'google':
        return [
          {
            id: 'gemini-pro',
            name: 'Gemini Pro',
            description: 'Model Gemini Pro od Google',
            contextWindow: 32768,
            isAvailable: true
          },
          {
            id: 'gemini-ultra',
            name: 'Gemini Ultra',
            description: 'Najbardziej zaawansowany model Gemini od Google',
            contextWindow: 32768,
            isAvailable: false
          }
        ];
      case 'huggingface':
        return [
          {
            id: 'mistralai/Mixtral-8x7B-Instruct-v0.1',
            name: 'Mixtral 8x7B',
            description: 'Model Mixtral 8x7B od Mistral AI',
            contextWindow: 32768,
            isAvailable: true
          },
          {
            id: 'meta-llama/Llama-2-70b-chat-hf',
            name: 'Llama 2 70B',
            description: 'Model Llama 2 70B od Meta',
            contextWindow: 4096,
            isAvailable: true
          }
        ];
      default:
        return [];
    }
  }

  /**
   * Pobiera nazwę wyświetlaną dostawcy
   * @param {string} providerName - Nazwa dostawcy
   * @returns {string} - Nazwa wyświetlana dostawcy
   */
  getProviderDisplayName(providerName) {
    switch (providerName.toLowerCase()) {
      case 'openai':
        return 'OpenAI';
      case 'anthropic':
        return 'Anthropic';
      case 'google':
        return 'Google';
      case 'huggingface':
        return 'HuggingFace';
      default:
        return providerName;
    }
  }

  /**
   * Pobiera opis dostawcy
   * @param {string} providerName - Nazwa dostawcy
   * @returns {string} - Opis dostawcy
   */
  getProviderDescription(providerName) {
    switch (providerName.toLowerCase()) {
      case 'openai':
        return 'Modele GPT od OpenAI';
      case 'anthropic':
        return 'Modele Claude od Anthropic';
      case 'google':
        return 'Modele Gemini od Google';
      case 'huggingface':
        return 'Modele open-source z HuggingFace';
      default:
        return '';
    }
  }
}

module.exports = new LLMService();
