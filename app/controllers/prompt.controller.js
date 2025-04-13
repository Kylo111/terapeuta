/**
 * Kontroler promptów
 * @module controllers/prompt
 */

const { Prompt, TherapyMethod } = require('../data/models');

/**
 * Pobiera wszystkie prompty
 * @param {Object} req - Obiekt żądania Express
 * @param {Object} res - Obiekt odpowiedzi Express
 */
exports.getAllPrompts = async (req, res) => {
  try {
    // Filtrowanie po metodzie terapeutycznej, jeśli podano
    const filter = {};
    if (req.query.therapyMethod) {
      filter.therapyMethod = req.query.therapyMethod;
    }
    
    // Filtrowanie po celu, jeśli podano
    if (req.query.purpose) {
      filter.purpose = req.query.purpose;
    }
    
    // Filtrowanie po aktywności
    if (req.query.isActive) {
      filter.isActive = req.query.isActive === 'true';
    }
    
    const prompts = await Prompt.find(filter)
      .populate('therapyMethod', 'name key')
      .populate('createdBy', 'firstName lastName');
    
    res.status(200).json({
      success: true,
      count: prompts.length,
      data: prompts
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: {
        message: 'Nie udało się pobrać promptów',
        details: error.message
      }
    });
  }
};

/**
 * Pobiera prompt po ID
 * @param {Object} req - Obiekt żądania Express
 * @param {Object} res - Obiekt odpowiedzi Express
 */
exports.getPromptById = async (req, res) => {
  try {
    const prompt = await Prompt.findById(req.params.id)
      .populate('therapyMethod', 'name key description')
      .populate('createdBy', 'firstName lastName');
    
    if (!prompt) {
      return res.status(404).json({
        success: false,
        error: {
          message: 'Nie znaleziono promptu o podanym ID'
        }
      });
    }
    
    res.status(200).json({
      success: true,
      data: prompt
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: {
        message: 'Nie udało się pobrać promptu',
        details: error.message
      }
    });
  }
};

/**
 * Tworzy nowy prompt
 * @param {Object} req - Obiekt żądania Express
 * @param {Object} res - Obiekt odpowiedzi Express
 */
exports.createPrompt = async (req, res) => {
  try {
    // Sprawdzenie, czy metoda terapeutyczna istnieje
    const therapyMethod = await TherapyMethod.findById(req.body.therapyMethod);
    
    if (!therapyMethod) {
      return res.status(404).json({
        success: false,
        error: {
          message: 'Nie znaleziono metody terapeutycznej o podanym ID'
        }
      });
    }
    
    // Dodanie informacji o twórcy, jeśli dostępna
    if (req.user) {
      req.body.createdBy = req.user.id;
    }
    
    const prompt = await Prompt.create(req.body);
    
    // Dodanie promptu do metody terapeutycznej
    therapyMethod.prompts.push(prompt._id);
    await therapyMethod.save();
    
    res.status(201).json({
      success: true,
      data: prompt
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      error: {
        message: 'Nie udało się utworzyć promptu',
        details: error.message
      }
    });
  }
};

/**
 * Aktualizuje prompt
 * @param {Object} req - Obiekt żądania Express
 * @param {Object} res - Obiekt odpowiedzi Express
 */
exports.updatePrompt = async (req, res) => {
  try {
    // Jeśli zmieniamy treść promptu, zwiększamy wersję
    if (req.body.content) {
      const prompt = await Prompt.findById(req.params.id);
      if (prompt) {
        req.body.version = prompt.version + 1;
        req.body.updatedAt = Date.now();
      }
    }
    
    const updatedPrompt = await Prompt.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,
        runValidators: true
      }
    ).populate('therapyMethod', 'name key');
    
    if (!updatedPrompt) {
      return res.status(404).json({
        success: false,
        error: {
          message: 'Nie znaleziono promptu o podanym ID'
        }
      });
    }
    
    res.status(200).json({
      success: true,
      data: updatedPrompt
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      error: {
        message: 'Nie udało się zaktualizować promptu',
        details: error.message
      }
    });
  }
};

/**
 * Usuwa prompt
 * @param {Object} req - Obiekt żądania Express
 * @param {Object} res - Obiekt odpowiedzi Express
 */
exports.deletePrompt = async (req, res) => {
  try {
    const prompt = await Prompt.findById(req.params.id);
    
    if (!prompt) {
      return res.status(404).json({
        success: false,
        error: {
          message: 'Nie znaleziono promptu o podanym ID'
        }
      });
    }
    
    // Usunięcie referencji do promptu z metody terapeutycznej
    await TherapyMethod.findByIdAndUpdate(
      prompt.therapyMethod,
      { $pull: { prompts: prompt._id } }
    );
    
    await prompt.remove();
    
    res.status(200).json({
      success: true,
      data: {}
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: {
        message: 'Nie udało się usunąć promptu',
        details: error.message
      }
    });
  }
};

/**
 * Dodaje ocenę skuteczności promptu
 * @param {Object} req - Obiekt żądania Express
 * @param {Object} res - Obiekt odpowiedzi Express
 */
exports.addEffectivenessRating = async (req, res) => {
  try {
    const prompt = await Prompt.findById(req.params.id);
    
    if (!prompt) {
      return res.status(404).json({
        success: false,
        error: {
          message: 'Nie znaleziono promptu o podanym ID'
        }
      });
    }
    
    const { rating } = req.body;
    
    if (!rating || rating < 1 || rating > 10) {
      return res.status(400).json({
        success: false,
        error: {
          message: 'Ocena musi być liczbą od 1 do 10'
        }
      });
    }
    
    await prompt.addEffectivenessRating(rating);
    
    res.status(200).json({
      success: true,
      data: prompt
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      error: {
        message: 'Nie udało się dodać oceny skuteczności',
        details: error.message
      }
    });
  }
};

/**
 * Dodaje opinię użytkownika o promptcie
 * @param {Object} req - Obiekt żądania Express
 * @param {Object} res - Obiekt odpowiedzi Express
 */
exports.addFeedback = async (req, res) => {
  try {
    const prompt = await Prompt.findById(req.params.id);
    
    if (!prompt) {
      return res.status(404).json({
        success: false,
        error: {
          message: 'Nie znaleziono promptu o podanym ID'
        }
      });
    }
    
    const { rating, comment } = req.body;
    
    if (!rating || rating < 1 || rating > 5) {
      return res.status(400).json({
        success: false,
        error: {
          message: 'Ocena musi być liczbą od 1 do 5'
        }
      });
    }
    
    // Dodanie opinii
    await prompt.addFeedback(
      req.user ? req.user.id : null,
      rating,
      comment
    );
    
    res.status(200).json({
      success: true,
      data: prompt
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      error: {
        message: 'Nie udało się dodać opinii',
        details: error.message
      }
    });
  }
};

/**
 * Renderuje prompt z podstawionymi zmiennymi
 * @param {Object} req - Obiekt żądania Express
 * @param {Object} res - Obiekt odpowiedzi Express
 */
exports.renderPrompt = async (req, res) => {
  try {
    const prompt = await Prompt.findById(req.params.id);
    
    if (!prompt) {
      return res.status(404).json({
        success: false,
        error: {
          message: 'Nie znaleziono promptu o podanym ID'
        }
      });
    }
    
    // Zwiększenie licznika użyć
    await prompt.incrementUsage();
    
    // Renderowanie promptu z podstawionymi zmiennymi
    const renderedContent = prompt.render(req.body.variables || {});
    
    res.status(200).json({
      success: true,
      data: {
        title: prompt.title,
        content: renderedContent,
        purpose: prompt.purpose,
        therapyMethod: prompt.therapyMethod,
        version: prompt.version
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: {
        message: 'Nie udało się wyrenderować promptu',
        details: error.message
      }
    });
  }
};
