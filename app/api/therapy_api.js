/**
 * API dla terapii
 * 
 * Ten moduł udostępnia API do zarządzania metodami terapii, technikami terapeutycznymi i przykładowymi zadaniami.
 */

const express = require('express');
const router = express.Router();
const { verifyToken } = require('./auth_api');
const therapyMethodsManager = require('../core/therapy_methods/therapy_methods_manager');
const Profile = require('../data/models/profile');
const mongoose = require('mongoose');

/**
 * @route GET /api/therapy/methods
 * @desc Pobieranie listy dostępnych metod terapii
 * @access Private
 */
router.get('/methods', verifyToken, async (req, res) => {
  try {
    const methods = therapyMethodsManager.getAllTherapyMethodsMetadata();
    
    res.json({ 
      success: true, 
      data: { 
        methods 
      } 
    });
  } catch (error) {
    console.error('Błąd podczas pobierania listy metod terapii:', error);
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
 * @route GET /api/therapy/methods/:methodName
 * @desc Pobieranie szczegółów określonej metody terapii
 * @access Private
 */
router.get('/methods/:methodName', verifyToken, async (req, res) => {
  try {
    const { methodName } = req.params;
    
    const method = therapyMethodsManager.getTherapyMethod(methodName);
    
    if (!method) {
      return res.status(404).json({ 
        success: false, 
        error: { 
          code: 'METHOD_NOT_FOUND', 
          message: 'Metoda terapii nie została znaleziona' 
        } 
      });
    }
    
    res.json({ 
      success: true, 
      data: { 
        method: {
          methodName: method.methodName,
          displayName: method.displayName,
          description: method.description
        }
      } 
    });
  } catch (error) {
    console.error(`Błąd podczas pobierania szczegółów metody terapii ${req.params.methodName}:`, error);
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
 * @route GET /api/therapy/methods/:methodName/techniques
 * @desc Pobieranie technik dla danej metody terapii
 * @access Private
 */
router.get('/methods/:methodName/techniques', verifyToken, async (req, res) => {
  try {
    const { methodName } = req.params;
    
    const method = therapyMethodsManager.getTherapyMethod(methodName);
    
    if (!method) {
      return res.status(404).json({ 
        success: false, 
        error: { 
          code: 'METHOD_NOT_FOUND', 
          message: 'Metoda terapii nie została znaleziona' 
        } 
      });
    }
    
    const techniques = method.getTechniques();
    
    res.json({ 
      success: true, 
      data: { 
        techniques 
      } 
    });
  } catch (error) {
    console.error(`Błąd podczas pobierania technik dla metody terapii ${req.params.methodName}:`, error);
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
 * @route GET /api/therapy/methods/:methodName/tasks
 * @desc Pobieranie przykładowych zadań dla danej metody terapii
 * @access Private
 */
router.get('/methods/:methodName/tasks', verifyToken, async (req, res) => {
  try {
    const { methodName } = req.params;
    const { profileId } = req.query;
    
    const method = therapyMethodsManager.getTherapyMethod(methodName);
    
    if (!method) {
      return res.status(404).json({ 
        success: false, 
        error: { 
          code: 'METHOD_NOT_FOUND', 
          message: 'Metoda terapii nie została znaleziona' 
        } 
      });
    }
    
    // Jeśli podano ID profilu, pobierz go, aby przekazać do generowania zadań
    let profile = null;
    if (profileId) {
      // Sprawdzenie, czy ID jest prawidłowym ObjectId
      if (!mongoose.Types.ObjectId.isValid(profileId)) {
        return res.status(400).json({ 
          success: false, 
          error: { 
            code: 'INVALID_ID', 
            message: 'Nieprawidłowy format ID profilu' 
          } 
        });
      }
      
      // Sprawdzenie, czy profil należy do zalogowanego użytkownika
      profile = await Profile.findOne({ _id: profileId, userId: req.user.userId });
      
      if (!profile) {
        return res.status(404).json({ 
          success: false, 
          error: { 
            code: 'PROFILE_NOT_FOUND', 
            message: 'Profil nie został znaleziony' 
          } 
        });
      }
    }
    
    // Przygotowanie kontekstu dla generowania zadań
    const context = profile ? { clientProfile: profile } : {};
    
    const tasks = method.generateSampleTasks(context);
    
    res.json({ 
      success: true, 
      data: { 
        tasks 
      } 
    });
  } catch (error) {
    console.error(`Błąd podczas pobierania przykładowych zadań dla metody terapii ${req.params.methodName}:`, error);
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
 * @route GET /api/therapy/methods/:methodName/prompts
 * @desc Pobieranie promptów dla danej metody terapii
 * @access Private
 */
router.get('/methods/:methodName/prompts', verifyToken, async (req, res) => {
  try {
    const { methodName } = req.params;
    
    const prompts = therapyMethodsManager.getAllPrompts(methodName);
    
    if (!prompts) {
      return res.status(404).json({ 
        success: false, 
        error: { 
          code: 'METHOD_NOT_FOUND', 
          message: 'Metoda terapii nie została znaleziona lub nie posiada promptów' 
        } 
      });
    }
    
    // Dodajemy metadane do promptów
    const promptTypesMetadata = therapyMethodsManager.getAllPromptTypesMetadata();
    const promptsWithMetadata = {};
    
    for (const [type, content] of Object.entries(prompts)) {
      const metadata = promptTypesMetadata.find(meta => meta.type === type);
      promptsWithMetadata[type] = {
        content,
        displayName: metadata ? metadata.displayName : type,
        description: metadata ? metadata.description : ''
      };
    }
    
    res.json({ 
      success: true, 
      data: { 
        prompts: promptsWithMetadata 
      } 
    });
  } catch (error) {
    console.error(`Błąd podczas pobierania promptów dla metody terapii ${req.params.methodName}:`, error);
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
 * @route GET /api/therapy/methods/:methodName/prompts/:promptType
 * @desc Pobieranie określonego promptu dla danej metody terapii
 * @access Private
 */
router.get('/methods/:methodName/prompts/:promptType', verifyToken, async (req, res) => {
  try {
    const { methodName, promptType } = req.params;
    
    const prompt = therapyMethodsManager.getPrompt(methodName, promptType);
    
    if (prompt === null) {
      return res.status(404).json({ 
        success: false, 
        error: { 
          code: 'PROMPT_NOT_FOUND', 
          message: 'Prompt nie został znaleziony' 
        } 
      });
    }
    
    // Dodajemy metadane do promptu
    const promptTypesMetadata = therapyMethodsManager.getAllPromptTypesMetadata();
    const metadata = promptTypesMetadata.find(meta => meta.type === promptType);
    
    res.json({ 
      success: true, 
      data: { 
        prompt: {
          type: promptType,
          content: prompt,
          displayName: metadata ? metadata.displayName : promptType,
          description: metadata ? metadata.description : ''
        }
      } 
    });
  } catch (error) {
    console.error(`Błąd podczas pobierania promptu ${req.params.promptType} dla metody terapii ${req.params.methodName}:`, error);
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
 * @route PUT /api/therapy/methods/:methodName/prompts/:promptType
 * @desc Aktualizacja określonego promptu dla danej metody terapii
 * @access Private
 */
router.put('/methods/:methodName/prompts/:promptType', verifyToken, async (req, res) => {
  try {
    const { methodName, promptType } = req.params;
    const { content } = req.body;
    
    if (!content) {
      return res.status(400).json({ 
        success: false, 
        error: { 
          code: 'MISSING_PARAMETERS', 
          message: 'Brak treści promptu' 
        } 
      });
    }
    
    const success = therapyMethodsManager.updatePrompt(methodName, promptType, content);
    
    if (!success) {
      return res.status(404).json({ 
        success: false, 
        error: { 
          code: 'PROMPT_NOT_FOUND', 
          message: 'Nie można zaktualizować promptu' 
        } 
      });
    }
    
    res.json({ 
      success: true, 
      message: 'Prompt został zaktualizowany' 
    });
  } catch (error) {
    console.error(`Błąd podczas aktualizacji promptu ${req.params.promptType} dla metody terapii ${req.params.methodName}:`, error);
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
 * @route POST /api/therapy/methods/:methodName/prompts/:promptType/reset
 * @desc Resetowanie określonego promptu do wartości domyślnej
 * @access Private
 */
router.post('/methods/:methodName/prompts/:promptType/reset', verifyToken, async (req, res) => {
  try {
    const { methodName, promptType } = req.params;
    
    const success = therapyMethodsManager.resetPromptToDefault(methodName, promptType);
    
    if (!success) {
      return res.status(404).json({ 
        success: false, 
        error: { 
          code: 'PROMPT_NOT_FOUND', 
          message: 'Nie można zresetować promptu' 
        } 
      });
    }
    
    res.json({ 
      success: true, 
      message: 'Prompt został zresetowany do wartości domyślnej' 
    });
  } catch (error) {
    console.error(`Błąd podczas resetowania promptu ${req.params.promptType} dla metody terapii ${req.params.methodName}:`, error);
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
 * @route GET /api/therapy/prompt-types
 * @desc Pobieranie listy wszystkich typów promptów
 * @access Private
 */
router.get('/prompt-types', verifyToken, async (req, res) => {
  try {
    const promptTypes = therapyMethodsManager.getAllPromptTypesMetadata();
    
    res.json({ 
      success: true, 
      data: { 
        promptTypes 
      } 
    });
  } catch (error) {
    console.error('Błąd podczas pobierania typów promptów:', error);
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
