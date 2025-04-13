/**
 * API dla zarządzania metodami terapii
 * 
 * Ten moduł udostępnia API do zarządzania metodami terapii i ich promptami.
 */

const express = require('express');
const router = express.Router();
const therapyMethodsManager = require('../core/therapy_methods/therapy_methods_manager');

/**
 * @route GET /api/therapy-methods
 * @desc Pobiera listę wszystkich dostępnych metod terapii
 * @access Private
 */
router.get('/', (req, res) => {
  try {
    const methods = therapyMethodsManager.getAllTherapyMethodsMetadata();
    res.json(methods);
  } catch (error) {
    console.error('Błąd podczas pobierania metod terapii:', error);
    res.status(500).json({ message: 'Błąd serwera' });
  }
});

/**
 * @route GET /api/therapy-methods/:methodName
 * @desc Pobiera szczegóły określonej metody terapii
 * @access Private
 */
router.get('/:methodName', (req, res) => {
  try {
    const { methodName } = req.params;
    const method = therapyMethodsManager.getTherapyMethod(methodName);
    
    if (!method) {
      return res.status(404).json({ message: 'Metoda terapii nie znaleziona' });
    }
    
    res.json({
      methodName: method.methodName,
      displayName: method.displayName,
      description: method.description,
      techniques: method.getTechniques()
    });
  } catch (error) {
    console.error(`Błąd podczas pobierania metody terapii ${req.params.methodName}:`, error);
    res.status(500).json({ message: 'Błąd serwera' });
  }
});

/**
 * @route GET /api/therapy-methods/:methodName/prompts
 * @desc Pobiera wszystkie prompty dla określonej metody terapii
 * @access Private
 */
router.get('/:methodName/prompts', (req, res) => {
  try {
    const { methodName } = req.params;
    const prompts = therapyMethodsManager.getAllPrompts(methodName);
    
    if (!prompts) {
      return res.status(404).json({ message: 'Metoda terapii nie znaleziona lub nie posiada promptów' });
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
    
    res.json(promptsWithMetadata);
  } catch (error) {
    console.error(`Błąd podczas pobierania promptów dla metody ${req.params.methodName}:`, error);
    res.status(500).json({ message: 'Błąd serwera' });
  }
});

/**
 * @route GET /api/therapy-methods/:methodName/prompts/:promptType
 * @desc Pobiera określony prompt dla określonej metody terapii
 * @access Private
 */
router.get('/:methodName/prompts/:promptType', (req, res) => {
  try {
    const { methodName, promptType } = req.params;
    const prompt = therapyMethodsManager.getPrompt(methodName, promptType);
    
    if (prompt === null) {
      return res.status(404).json({ message: 'Prompt nie znaleziony' });
    }
    
    // Dodajemy metadane do promptu
    const promptTypesMetadata = therapyMethodsManager.getAllPromptTypesMetadata();
    const metadata = promptTypesMetadata.find(meta => meta.type === promptType);
    
    res.json({
      type: promptType,
      content: prompt,
      displayName: metadata ? metadata.displayName : promptType,
      description: metadata ? metadata.description : ''
    });
  } catch (error) {
    console.error(`Błąd podczas pobierania promptu ${req.params.promptType} dla metody ${req.params.methodName}:`, error);
    res.status(500).json({ message: 'Błąd serwera' });
  }
});

/**
 * @route PUT /api/therapy-methods/:methodName/prompts/:promptType
 * @desc Aktualizuje określony prompt dla określonej metody terapii
 * @access Private
 */
router.put('/:methodName/prompts/:promptType', (req, res) => {
  try {
    const { methodName, promptType } = req.params;
    const { content } = req.body;
    
    if (!content) {
      return res.status(400).json({ message: 'Brak treści promptu' });
    }
    
    const success = therapyMethodsManager.updatePrompt(methodName, promptType, content);
    
    if (!success) {
      return res.status(404).json({ message: 'Nie można zaktualizować promptu' });
    }
    
    res.json({ message: 'Prompt zaktualizowany pomyślnie' });
  } catch (error) {
    console.error(`Błąd podczas aktualizacji promptu ${req.params.promptType} dla metody ${req.params.methodName}:`, error);
    res.status(500).json({ message: 'Błąd serwera' });
  }
});

/**
 * @route POST /api/therapy-methods/:methodName/prompts/:promptType/reset
 * @desc Resetuje określony prompt do wartości domyślnej
 * @access Private
 */
router.post('/:methodName/prompts/:promptType/reset', (req, res) => {
  try {
    const { methodName, promptType } = req.params;
    
    const success = therapyMethodsManager.resetPromptToDefault(methodName, promptType);
    
    if (!success) {
      return res.status(404).json({ message: 'Nie można zresetować promptu' });
    }
    
    res.json({ message: 'Prompt zresetowany pomyślnie' });
  } catch (error) {
    console.error(`Błąd podczas resetowania promptu ${req.params.promptType} dla metody ${req.params.methodName}:`, error);
    res.status(500).json({ message: 'Błąd serwera' });
  }
});

/**
 * @route GET /api/therapy-methods/prompt-types
 * @desc Pobiera listę wszystkich typów promptów
 * @access Private
 */
router.get('/prompt-types', (req, res) => {
  try {
    const promptTypes = therapyMethodsManager.getAllPromptTypesMetadata();
    res.json(promptTypes);
  } catch (error) {
    console.error('Błąd podczas pobierania typów promptów:', error);
    res.status(500).json({ message: 'Błąd serwera' });
  }
});

module.exports = router;
