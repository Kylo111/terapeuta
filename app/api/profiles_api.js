/**
 * API dla profili
 * 
 * Ten moduł udostępnia API do zarządzania profilami terapeutycznymi użytkownika.
 */

const express = require('express');
const router = express.Router();
const Profile = require('../data/models/profile');
const User = require('../data/models/user');
const { verifyToken } = require('./auth_api');
const mongoose = require('mongoose');

/**
 * @route GET /api/profiles
 * @desc Pobieranie listy profili zalogowanego użytkownika
 * @access Private
 */
router.get('/', verifyToken, async (req, res) => {
  try {
    const { isActive } = req.query;
    
    // Przygotowanie filtra
    const filter = { userId: req.user.userId };
    if (isActive !== undefined) {
      filter.isActive = isActive === 'true';
    }
    
    const profiles = await Profile.find(filter);
    
    res.json({ 
      success: true, 
      data: { 
        profiles 
      } 
    });
  } catch (error) {
    console.error('Błąd podczas pobierania listy profili:', error);
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
 * @route POST /api/profiles
 * @desc Tworzenie nowego profilu
 * @access Private
 */
router.post('/', verifyToken, async (req, res) => {
  try {
    const { name, age, gender, goals, challenges } = req.body;
    
    if (!name) {
      return res.status(400).json({ 
        success: false, 
        error: { 
          code: 'MISSING_PARAMETERS', 
          message: 'Brak wymaganych parametrów' 
        } 
      });
    }
    
    // Utworzenie nowego profilu
    const profile = new Profile({
      userId: req.user.userId,
      name,
      age: age || null,
      gender: gender || null,
      goals: goals || [],
      challenges: challenges || [],
      isActive: true,
      createdAt: Date.now()
    });
    
    await profile.save();
    
    res.status(201).json({ 
      success: true, 
      data: { 
        profile 
      }, 
      message: 'Profil został utworzony' 
    });
  } catch (error) {
    console.error('Błąd podczas tworzenia profilu:', error);
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
 * @route GET /api/profiles/:id
 * @desc Pobieranie szczegółów profilu
 * @access Private
 */
router.get('/:id', verifyToken, async (req, res) => {
  try {
    const { id } = req.params;
    
    // Sprawdzenie, czy ID jest prawidłowym ObjectId
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ 
        success: false, 
        error: { 
          code: 'INVALID_ID', 
          message: 'Nieprawidłowy format ID' 
        } 
      });
    }
    
    const profile = await Profile.findOne({ _id: id, userId: req.user.userId });
    
    if (!profile) {
      return res.status(404).json({ 
        success: false, 
        error: { 
          code: 'PROFILE_NOT_FOUND', 
          message: 'Profil nie został znaleziony' 
        } 
      });
    }
    
    res.json({ 
      success: true, 
      data: { 
        profile 
      } 
    });
  } catch (error) {
    console.error('Błąd podczas pobierania szczegółów profilu:', error);
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
 * @route PUT /api/profiles/:id
 * @desc Aktualizacja profilu
 * @access Private
 */
router.put('/:id', verifyToken, async (req, res) => {
  try {
    const { id } = req.params;
    const { name, age, gender, goals, challenges, isActive } = req.body;
    
    // Sprawdzenie, czy ID jest prawidłowym ObjectId
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ 
        success: false, 
        error: { 
          code: 'INVALID_ID', 
          message: 'Nieprawidłowy format ID' 
        } 
      });
    }
    
    const profile = await Profile.findOne({ _id: id, userId: req.user.userId });
    
    if (!profile) {
      return res.status(404).json({ 
        success: false, 
        error: { 
          code: 'PROFILE_NOT_FOUND', 
          message: 'Profil nie został znaleziony' 
        } 
      });
    }
    
    // Aktualizacja profilu
    if (name) profile.name = name;
    if (age !== undefined) profile.age = age;
    if (gender !== undefined) profile.gender = gender;
    if (goals) profile.goals = goals;
    if (challenges) profile.challenges = challenges;
    if (isActive !== undefined) profile.isActive = isActive;
    
    await profile.save();
    
    res.json({ 
      success: true, 
      data: { 
        profile 
      }, 
      message: 'Profil został zaktualizowany' 
    });
  } catch (error) {
    console.error('Błąd podczas aktualizacji profilu:', error);
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
 * @route DELETE /api/profiles/:id
 * @desc Usuwanie profilu
 * @access Private
 */
router.delete('/:id', verifyToken, async (req, res) => {
  try {
    const { id } = req.params;
    
    // Sprawdzenie, czy ID jest prawidłowym ObjectId
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ 
        success: false, 
        error: { 
          code: 'INVALID_ID', 
          message: 'Nieprawidłowy format ID' 
        } 
      });
    }
    
    const profile = await Profile.findOne({ _id: id, userId: req.user.userId });
    
    if (!profile) {
      return res.status(404).json({ 
        success: false, 
        error: { 
          code: 'PROFILE_NOT_FOUND', 
          message: 'Profil nie został znaleziony' 
        } 
      });
    }
    
    // Usunięcie profilu
    await Profile.deleteOne({ _id: id });
    
    res.json({ 
      success: true, 
      message: 'Profil został usunięty' 
    });
  } catch (error) {
    console.error('Błąd podczas usuwania profilu:', error);
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
