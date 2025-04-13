/**
 * API dla integracji z modelami LLM
 * 
 * Ten moduł udostępnia API do interakcji z modelami LLM.
 */

const express = require('express');
const router = express.Router();
const { verifyToken } = require('./auth_api');
const apiManager = require('../api/api_manager');
const User = require('../data/models/user');

/**
 * @route GET /api/llm/providers
 * @desc Pobieranie listy dostępnych dostawców modeli LLM
 * @access Private
 */
router.get('/providers', verifyToken, async (req, res) => {
  try {
    const providers = Object.keys(apiManager.providers).map(providerName => {
      const provider = apiManager.getProvider(providerName);
      return {
        name: providerName,
        displayName: provider.displayName || providerName,
        description: provider.description || '',
        isAvailable: provider.isAvailable || true
      };
    });
    
    res.json({ 
      success: true, 
      data: { 
        providers 
      } 
    });
  } catch (error) {
    console.error('Błąd podczas pobierania listy dostawców modeli LLM:', error);
    res.status(500).json({ 
      success: false, 
      error: { 
        code: 'SERVER_ERROR', 
        message: 'Błąd serwera' 
      } 
    });
  }
});

/**
 * @route GET /api/llm/providers/:providerName/models
 * @desc Pobieranie listy dostępnych modeli dla określonego dostawcy
 * @access Private
 */
router.get('/providers/:providerName/models', verifyToken, async (req, res) => {
  try {
    const { providerName } = req.params;
    
    // Sprawdzenie, czy dostawca istnieje
    try {
      const provider = apiManager.getProvider(providerName);
      const models = provider.getAvailableModels();
      
      res.json({ 
        success: true, 
        data: { 
          models 
        } 
      });
    } catch (error) {
      return res.status(404).json({ 
        success: false, 
        error: { 
          code: 'PROVIDER_NOT_FOUND', 
          message: 'Dostawca nie został znaleziony' 
        } 
      });
    }
  } catch (error) {
    console.error(`Błąd podczas pobierania listy modeli dla dostawcy ${req.params.providerName}:`, error);
    res.status(500).json({ 
      success: false, 
      error: { 
        code: 'SERVER_ERROR', 
        message: 'Błąd serwera' 
      } 
    });
  }
});

/**
 * @route POST /api/llm/chat
 * @desc Wysyłanie wiadomości do modelu LLM
 * @access Private
 */
router.post('/chat', verifyToken, async (req, res) => {
  try {
    const { providerName, modelName, messages, temperature, maxTokens } = req.body;
    
    if (!messages || !Array.isArray(messages) || messages.length === 0) {
      return res.status(400).json({ 
        success: false, 
        error: { 
          code: 'MISSING_PARAMETERS', 
          message: 'Brak wymaganych parametrów' 
        } 
      });
    }
    
    // Pobranie użytkownika, aby sprawdzić preferowanego dostawcę i model
    const user = await User.findById(req.user.userId);
    
    if (!user) {
      return res.status(404).json({ 
        success: false, 
        error: { 
          code: 'USER_NOT_FOUND', 
          message: 'Użytkownik nie został znaleziony' 
        } 
      });
    }
    
    // Użycie preferowanego dostawcy i modelu, jeśli nie podano
    const actualProviderName = providerName || user.settings.preferredLLMProvider;
    const actualModelName = modelName || user.settings.preferredModel;
    
    // Sprawdzenie, czy dostawca istnieje
    try {
      const response = await apiManager.generateChatCompletion(
        actualProviderName,
        messages,
        actualModelName,
        {
          temperature: temperature || 0.7,
          maxTokens: maxTokens || 1000
        }
      );
      
      res.json({ 
        success: true, 
        data: { 
          response 
        } 
      });
    } catch (error) {
      return res.status(400).json({ 
        success: false, 
        error: { 
          code: 'LLM_ERROR', 
          message: error.message 
        } 
      });
    }
  } catch (error) {
    console.error('Błąd podczas wysyłania wiadomości do modelu LLM:', error);
    res.status(500).json({ 
      success: false, 
      error: { 
        code: 'SERVER_ERROR', 
        message: 'Błąd serwera' 
      } 
    });
  }
});

/**
 * @route POST /api/llm/embeddings
 * @desc Generowanie embeddingów dla tekstu
 * @access Private
 */
router.post('/embeddings', verifyToken, async (req, res) => {
  try {
    const { providerName, modelName, text } = req.body;
    
    if (!text) {
      return res.status(400).json({ 
        success: false, 
        error: { 
          code: 'MISSING_PARAMETERS', 
          message: 'Brak wymaganych parametrów' 
        } 
      });
    }
    
    // Pobranie użytkownika, aby sprawdzić preferowanego dostawcę
    const user = await User.findById(req.user.userId);
    
    if (!user) {
      return res.status(404).json({ 
        success: false, 
        error: { 
          code: 'USER_NOT_FOUND', 
          message: 'Użytkownik nie został znaleziony' 
        } 
      });
    }
    
    // Użycie preferowanego dostawcy, jeśli nie podano
    const actualProviderName = providerName || user.settings.preferredLLMProvider;
    
    // Sprawdzenie, czy dostawca istnieje
    try {
      const response = await apiManager.generateEmbeddings(
        actualProviderName,
        text,
        modelName
      );
      
      res.json({ 
        success: true, 
        data: { 
          response 
        } 
      });
    } catch (error) {
      return res.status(400).json({ 
        success: false, 
        error: { 
          code: 'LLM_ERROR', 
          message: error.message 
        } 
      });
    }
  } catch (error) {
    console.error('Błąd podczas generowania embeddingów:', error);
    res.status(500).json({ 
      success: false, 
      error: { 
        code: 'SERVER_ERROR', 
        message: 'Błąd serwera' 
      } 
    });
  }
});

module.exports = router;
