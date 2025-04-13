/**
 * API dla sesji
 * 
 * Ten moduł udostępnia API do zarządzania sesjami terapeutycznymi.
 */

const express = require('express');
const router = express.Router();
const Session = require('../data/models/session');
const Profile = require('../data/models/profile');
const { verifyToken } = require('./auth_api');
const mongoose = require('mongoose');
const therapyMethodsManager = require('../core/therapy_methods/therapy_methods_manager');

/**
 * @route GET /api/profiles/:profileId/sessions
 * @desc Pobieranie listy sesji dla profilu
 * @access Private
 */
router.get('/profiles/:profileId/sessions', verifyToken, async (req, res) => {
  try {
    const { profileId } = req.params;
    const { status, limit, skip, sort, order } = req.query;
    
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
    const profile = await Profile.findOne({ _id: profileId, userId: req.user.userId });
    
    if (!profile) {
      return res.status(404).json({ 
        success: false, 
        error: { 
          code: 'PROFILE_NOT_FOUND', 
          message: 'Profil nie został znaleziony' 
        } 
      });
    }
    
    // Przygotowanie filtra
    const filter = { profileId };
    if (status) {
      filter.status = status;
    }
    
    // Przygotowanie opcji zapytania
    const options = {};
    if (limit) {
      options.limit = parseInt(limit);
    }
    if (skip) {
      options.skip = parseInt(skip);
    }
    if (sort) {
      options.sort = { [sort]: order === 'desc' ? -1 : 1 };
    } else {
      options.sort = { startTime: -1 };
    }
    
    // Pobranie sesji
    const sessions = await Session.find(filter, null, options);
    const total = await Session.countDocuments(filter);
    
    res.json({ 
      success: true, 
      data: { 
        sessions,
        total,
        limit: options.limit,
        skip: options.skip || 0
      } 
    });
  } catch (error) {
    console.error('Błąd podczas pobierania listy sesji:', error);
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
 * @route POST /api/profiles/:profileId/sessions
 * @desc Tworzenie nowej sesji
 * @access Private
 */
router.post('/profiles/:profileId/sessions', verifyToken, async (req, res) => {
  try {
    const { profileId } = req.params;
    const { therapyMethod, title, notes } = req.body;
    
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
    const profile = await Profile.findOne({ _id: profileId, userId: req.user.userId });
    
    if (!profile) {
      return res.status(404).json({ 
        success: false, 
        error: { 
          code: 'PROFILE_NOT_FOUND', 
          message: 'Profil nie został znaleziony' 
        } 
      });
    }
    
    // Sprawdzenie, czy metoda terapii jest dostępna
    if (therapyMethod && !therapyMethodsManager.getTherapyMethod(therapyMethod)) {
      return res.status(400).json({ 
        success: false, 
        error: { 
          code: 'INVALID_THERAPY_METHOD', 
          message: 'Nieprawidłowa metoda terapii' 
        } 
      });
    }
    
    // Utworzenie nowej sesji
    const session = new Session({
      profileId,
      therapyMethod: therapyMethod || 'cognitive_behavioral', // Domyślna metoda terapii
      title: title || `Sesja ${new Date().toLocaleDateString()}`,
      notes: notes || '',
      status: 'scheduled',
      startTime: Date.now(),
      endTime: null,
      messages: [],
      summary: null,
      insights: [],
      tasks: []
    });
    
    await session.save();
    
    res.status(201).json({ 
      success: true, 
      data: { 
        session 
      }, 
      message: 'Sesja została utworzona' 
    });
  } catch (error) {
    console.error('Błąd podczas tworzenia sesji:', error);
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
 * @route GET /api/sessions/:id
 * @desc Pobieranie szczegółów sesji
 * @access Private
 */
router.get('/sessions/:id', verifyToken, async (req, res) => {
  try {
    const { id } = req.params;
    
    // Sprawdzenie, czy ID jest prawidłowym ObjectId
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ 
        success: false, 
        error: { 
          code: 'INVALID_ID', 
          message: 'Nieprawidłowy format ID sesji' 
        } 
      });
    }
    
    // Pobranie sesji
    const session = await Session.findById(id);
    
    if (!session) {
      return res.status(404).json({ 
        success: false, 
        error: { 
          code: 'SESSION_NOT_FOUND', 
          message: 'Sesja nie została znaleziona' 
        } 
      });
    }
    
    // Sprawdzenie, czy profil należy do zalogowanego użytkownika
    const profile = await Profile.findOne({ _id: session.profileId, userId: req.user.userId });
    
    if (!profile) {
      return res.status(403).json({ 
        success: false, 
        error: { 
          code: 'FORBIDDEN', 
          message: 'Brak dostępu do sesji' 
        } 
      });
    }
    
    res.json({ 
      success: true, 
      data: { 
        session 
      } 
    });
  } catch (error) {
    console.error('Błąd podczas pobierania szczegółów sesji:', error);
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
 * @route PUT /api/sessions/:id
 * @desc Aktualizacja sesji
 * @access Private
 */
router.put('/sessions/:id', verifyToken, async (req, res) => {
  try {
    const { id } = req.params;
    const { title, notes, status } = req.body;
    
    // Sprawdzenie, czy ID jest prawidłowym ObjectId
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ 
        success: false, 
        error: { 
          code: 'INVALID_ID', 
          message: 'Nieprawidłowy format ID sesji' 
        } 
      });
    }
    
    // Pobranie sesji
    const session = await Session.findById(id);
    
    if (!session) {
      return res.status(404).json({ 
        success: false, 
        error: { 
          code: 'SESSION_NOT_FOUND', 
          message: 'Sesja nie została znaleziona' 
        } 
      });
    }
    
    // Sprawdzenie, czy profil należy do zalogowanego użytkownika
    const profile = await Profile.findOne({ _id: session.profileId, userId: req.user.userId });
    
    if (!profile) {
      return res.status(403).json({ 
        success: false, 
        error: { 
          code: 'FORBIDDEN', 
          message: 'Brak dostępu do sesji' 
        } 
      });
    }
    
    // Aktualizacja sesji
    if (title) session.title = title;
    if (notes !== undefined) session.notes = notes;
    if (status) {
      session.status = status;
      
      // Jeśli sesja jest zakończona, ustawienie czasu zakończenia
      if (status === 'completed' && !session.endTime) {
        session.endTime = Date.now();
      }
    }
    
    await session.save();
    
    res.json({ 
      success: true, 
      data: { 
        session 
      }, 
      message: 'Sesja została zaktualizowana' 
    });
  } catch (error) {
    console.error('Błąd podczas aktualizacji sesji:', error);
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
 * @route DELETE /api/sessions/:id
 * @desc Usuwanie sesji
 * @access Private
 */
router.delete('/sessions/:id', verifyToken, async (req, res) => {
  try {
    const { id } = req.params;
    
    // Sprawdzenie, czy ID jest prawidłowym ObjectId
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ 
        success: false, 
        error: { 
          code: 'INVALID_ID', 
          message: 'Nieprawidłowy format ID sesji' 
        } 
      });
    }
    
    // Pobranie sesji
    const session = await Session.findById(id);
    
    if (!session) {
      return res.status(404).json({ 
        success: false, 
        error: { 
          code: 'SESSION_NOT_FOUND', 
          message: 'Sesja nie została znaleziona' 
        } 
      });
    }
    
    // Sprawdzenie, czy profil należy do zalogowanego użytkownika
    const profile = await Profile.findOne({ _id: session.profileId, userId: req.user.userId });
    
    if (!profile) {
      return res.status(403).json({ 
        success: false, 
        error: { 
          code: 'FORBIDDEN', 
          message: 'Brak dostępu do sesji' 
        } 
      });
    }
    
    // Usunięcie sesji
    await Session.deleteOne({ _id: id });
    
    res.json({ 
      success: true, 
      message: 'Sesja została usunięta' 
    });
  } catch (error) {
    console.error('Błąd podczas usuwania sesji:', error);
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
 * @route POST /api/sessions/:id/messages
 * @desc Dodawanie wiadomości do sesji
 * @access Private
 */
router.post('/sessions/:id/messages', verifyToken, async (req, res) => {
  try {
    const { id } = req.params;
    const { role, content } = req.body;
    
    if (!role || !content) {
      return res.status(400).json({ 
        success: false, 
        error: { 
          code: 'MISSING_PARAMETERS', 
          message: 'Brak wymaganych parametrów' 
        } 
      });
    }
    
    // Sprawdzenie, czy ID jest prawidłowym ObjectId
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ 
        success: false, 
        error: { 
          code: 'INVALID_ID', 
          message: 'Nieprawidłowy format ID sesji' 
        } 
      });
    }
    
    // Pobranie sesji
    const session = await Session.findById(id);
    
    if (!session) {
      return res.status(404).json({ 
        success: false, 
        error: { 
          code: 'SESSION_NOT_FOUND', 
          message: 'Sesja nie została znaleziona' 
        } 
      });
    }
    
    // Sprawdzenie, czy profil należy do zalogowanego użytkownika
    const profile = await Profile.findOne({ _id: session.profileId, userId: req.user.userId });
    
    if (!profile) {
      return res.status(403).json({ 
        success: false, 
        error: { 
          code: 'FORBIDDEN', 
          message: 'Brak dostępu do sesji' 
        } 
      });
    }
    
    // Sprawdzenie, czy sesja jest aktywna
    if (session.status !== 'in_progress' && session.status !== 'scheduled') {
      return res.status(400).json({ 
        success: false, 
        error: { 
          code: 'SESSION_NOT_ACTIVE', 
          message: 'Sesja nie jest aktywna' 
        } 
      });
    }
    
    // Jeśli sesja jest zaplanowana, zmiana statusu na "w trakcie"
    if (session.status === 'scheduled') {
      session.status = 'in_progress';
    }
    
    // Dodanie wiadomości
    const message = {
      role,
      content,
      timestamp: Date.now()
    };
    
    session.messages.push(message);
    await session.save();
    
    res.status(201).json({ 
      success: true, 
      data: { 
        message 
      }, 
      message: 'Wiadomość została dodana' 
    });
  } catch (error) {
    console.error('Błąd podczas dodawania wiadomości do sesji:', error);
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
 * @route POST /api/sessions/:id/complete
 * @desc Zakończenie sesji
 * @access Private
 */
router.post('/sessions/:id/complete', verifyToken, async (req, res) => {
  try {
    const { id } = req.params;
    const { summary, insights, tasks } = req.body;
    
    // Sprawdzenie, czy ID jest prawidłowym ObjectId
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ 
        success: false, 
        error: { 
          code: 'INVALID_ID', 
          message: 'Nieprawidłowy format ID sesji' 
        } 
      });
    }
    
    // Pobranie sesji
    const session = await Session.findById(id);
    
    if (!session) {
      return res.status(404).json({ 
        success: false, 
        error: { 
          code: 'SESSION_NOT_FOUND', 
          message: 'Sesja nie została znaleziona' 
        } 
      });
    }
    
    // Sprawdzenie, czy profil należy do zalogowanego użytkownika
    const profile = await Profile.findOne({ _id: session.profileId, userId: req.user.userId });
    
    if (!profile) {
      return res.status(403).json({ 
        success: false, 
        error: { 
          code: 'FORBIDDEN', 
          message: 'Brak dostępu do sesji' 
        } 
      });
    }
    
    // Sprawdzenie, czy sesja jest aktywna
    if (session.status !== 'in_progress') {
      return res.status(400).json({ 
        success: false, 
        error: { 
          code: 'SESSION_NOT_ACTIVE', 
          message: 'Sesja nie jest aktywna' 
        } 
      });
    }
    
    // Zakończenie sesji
    session.status = 'completed';
    session.endTime = Date.now();
    if (summary) session.summary = summary;
    if (insights) session.insights = insights;
    if (tasks) session.tasks = tasks;
    
    await session.save();
    
    res.json({ 
      success: true, 
      data: { 
        session 
      }, 
      message: 'Sesja została zakończona' 
    });
  } catch (error) {
    console.error('Błąd podczas zakończenia sesji:', error);
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
