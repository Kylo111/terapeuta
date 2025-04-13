/**
 * Kontroler metod terapeutycznych
 * @module controllers/therapy-method
 */

const { TherapyMethod } = require('../data/models');

/**
 * Pobiera wszystkie metody terapeutyczne
 * @param {Object} req - Obiekt żądania Express
 * @param {Object} res - Obiekt odpowiedzi Express
 */
exports.getAllTherapyMethods = async (req, res) => {
  try {
    const therapyMethods = await TherapyMethod.find({ isActive: true });
    
    res.status(200).json({
      success: true,
      count: therapyMethods.length,
      data: therapyMethods
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: {
        message: 'Nie udało się pobrać metod terapeutycznych',
        details: error.message
      }
    });
  }
};

/**
 * Pobiera metodę terapeutyczną po ID
 * @param {Object} req - Obiekt żądania Express
 * @param {Object} res - Obiekt odpowiedzi Express
 */
exports.getTherapyMethodById = async (req, res) => {
  try {
    const therapyMethod = await TherapyMethod.findById(req.params.id);
    
    if (!therapyMethod) {
      return res.status(404).json({
        success: false,
        error: {
          message: 'Nie znaleziono metody terapeutycznej o podanym ID'
        }
      });
    }
    
    res.status(200).json({
      success: true,
      data: therapyMethod
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: {
        message: 'Nie udało się pobrać metody terapeutycznej',
        details: error.message
      }
    });
  }
};

/**
 * Tworzy nową metodę terapeutyczną
 * @param {Object} req - Obiekt żądania Express
 * @param {Object} res - Obiekt odpowiedzi Express
 */
exports.createTherapyMethod = async (req, res) => {
  try {
    const therapyMethod = await TherapyMethod.create(req.body);
    
    res.status(201).json({
      success: true,
      data: therapyMethod
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      error: {
        message: 'Nie udało się utworzyć metody terapeutycznej',
        details: error.message
      }
    });
  }
};

/**
 * Aktualizuje metodę terapeutyczną
 * @param {Object} req - Obiekt żądania Express
 * @param {Object} res - Obiekt odpowiedzi Express
 */
exports.updateTherapyMethod = async (req, res) => {
  try {
    const therapyMethod = await TherapyMethod.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,
        runValidators: true
      }
    );
    
    if (!therapyMethod) {
      return res.status(404).json({
        success: false,
        error: {
          message: 'Nie znaleziono metody terapeutycznej o podanym ID'
        }
      });
    }
    
    res.status(200).json({
      success: true,
      data: therapyMethod
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      error: {
        message: 'Nie udało się zaktualizować metody terapeutycznej',
        details: error.message
      }
    });
  }
};

/**
 * Usuwa metodę terapeutyczną
 * @param {Object} req - Obiekt żądania Express
 * @param {Object} res - Obiekt odpowiedzi Express
 */
exports.deleteTherapyMethod = async (req, res) => {
  try {
    const therapyMethod = await TherapyMethod.findByIdAndDelete(req.params.id);
    
    if (!therapyMethod) {
      return res.status(404).json({
        success: false,
        error: {
          message: 'Nie znaleziono metody terapeutycznej o podanym ID'
        }
      });
    }
    
    res.status(200).json({
      success: true,
      data: {}
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: {
        message: 'Nie udało się usunąć metody terapeutycznej',
        details: error.message
      }
    });
  }
};

/**
 * Dodaje technikę do metody terapeutycznej
 * @param {Object} req - Obiekt żądania Express
 * @param {Object} res - Obiekt odpowiedzi Express
 */
exports.addTechnique = async (req, res) => {
  try {
    const therapyMethod = await TherapyMethod.findById(req.params.id);
    
    if (!therapyMethod) {
      return res.status(404).json({
        success: false,
        error: {
          message: 'Nie znaleziono metody terapeutycznej o podanym ID'
        }
      });
    }
    
    therapyMethod.techniques.push(req.body);
    await therapyMethod.save();
    
    res.status(200).json({
      success: true,
      data: therapyMethod
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      error: {
        message: 'Nie udało się dodać techniki do metody terapeutycznej',
        details: error.message
      }
    });
  }
};

/**
 * Pobiera wszystkie techniki dla metody terapeutycznej
 * @param {Object} req - Obiekt żądania Express
 * @param {Object} res - Obiekt odpowiedzi Express
 */
exports.getTechniques = async (req, res) => {
  try {
    const therapyMethod = await TherapyMethod.findById(req.params.id);
    
    if (!therapyMethod) {
      return res.status(404).json({
        success: false,
        error: {
          message: 'Nie znaleziono metody terapeutycznej o podanym ID'
        }
      });
    }
    
    res.status(200).json({
      success: true,
      count: therapyMethod.techniques.length,
      data: therapyMethod.techniques
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: {
        message: 'Nie udało się pobrać technik dla metody terapeutycznej',
        details: error.message
      }
    });
  }
};
