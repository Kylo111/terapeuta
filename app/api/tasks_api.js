/**
 * API dla zadań
 * 
 * Ten moduł udostępnia API do zarządzania zadaniami terapeutycznymi.
 */

const express = require('express');
const router = express.Router();
const Task = require('../data/models/task');
const Profile = require('../data/models/profile');
const Session = require('../data/models/session');
const { verifyToken } = require('./auth_api');
const mongoose = require('mongoose');

/**
 * @route GET /api/profiles/:profileId/tasks
 * @desc Pobieranie listy zadań dla profilu
 * @access Private
 */
router.get('/profiles/:profileId/tasks', verifyToken, async (req, res) => {
  try {
    const { profileId } = req.params;
    const { status, category, priority, limit, skip, sort, order } = req.query;
    
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
    if (category) {
      filter.category = category;
    }
    if (priority) {
      filter.priority = priority;
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
      options.sort = { dueDate: 1 };
    }
    
    // Pobranie zadań
    const tasks = await Task.find(filter, null, options);
    const total = await Task.countDocuments(filter);
    
    res.json({ 
      success: true, 
      data: { 
        tasks,
        total,
        limit: options.limit,
        skip: options.skip || 0
      } 
    });
  } catch (error) {
    console.error('Błąd podczas pobierania listy zadań:', error);
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
 * @route POST /api/profiles/:profileId/tasks
 * @desc Tworzenie nowego zadania
 * @access Private
 */
router.post('/profiles/:profileId/tasks', verifyToken, async (req, res) => {
  try {
    const { profileId } = req.params;
    const { title, description, instructions, category, priority, dueDate, sessionId } = req.body;
    
    if (!title) {
      return res.status(400).json({ 
        success: false, 
        error: { 
          code: 'MISSING_PARAMETERS', 
          message: 'Brak wymaganych parametrów' 
        } 
      });
    }
    
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
    
    // Sprawdzenie, czy sesja istnieje i należy do profilu
    if (sessionId) {
      if (!mongoose.Types.ObjectId.isValid(sessionId)) {
        return res.status(400).json({ 
          success: false, 
          error: { 
            code: 'INVALID_ID', 
            message: 'Nieprawidłowy format ID sesji' 
          } 
        });
      }
      
      const session = await Session.findOne({ _id: sessionId, profileId });
      
      if (!session) {
        return res.status(404).json({ 
          success: false, 
          error: { 
            code: 'SESSION_NOT_FOUND', 
            message: 'Sesja nie została znaleziona' 
          } 
        });
      }
    }
    
    // Utworzenie nowego zadania
    const task = new Task({
      profileId,
      sessionId: sessionId || null,
      title,
      description: description || '',
      instructions: instructions || [],
      category: category || 'other',
      priority: priority || 'medium',
      status: 'pending',
      dueDate: dueDate ? new Date(dueDate) : null,
      completedDate: null,
      reminders: [],
      notes: '',
      createdAt: Date.now()
    });
    
    await task.save();
    
    res.status(201).json({ 
      success: true, 
      data: { 
        task 
      }, 
      message: 'Zadanie zostało utworzone' 
    });
  } catch (error) {
    console.error('Błąd podczas tworzenia zadania:', error);
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
 * @route GET /api/tasks/:id
 * @desc Pobieranie szczegółów zadania
 * @access Private
 */
router.get('/tasks/:id', verifyToken, async (req, res) => {
  try {
    const { id } = req.params;
    
    // Sprawdzenie, czy ID jest prawidłowym ObjectId
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ 
        success: false, 
        error: { 
          code: 'INVALID_ID', 
          message: 'Nieprawidłowy format ID zadania' 
        } 
      });
    }
    
    // Pobranie zadania
    const task = await Task.findById(id);
    
    if (!task) {
      return res.status(404).json({ 
        success: false, 
        error: { 
          code: 'TASK_NOT_FOUND', 
          message: 'Zadanie nie zostało znalezione' 
        } 
      });
    }
    
    // Sprawdzenie, czy profil należy do zalogowanego użytkownika
    const profile = await Profile.findOne({ _id: task.profileId, userId: req.user.userId });
    
    if (!profile) {
      return res.status(403).json({ 
        success: false, 
        error: { 
          code: 'FORBIDDEN', 
          message: 'Brak dostępu do zadania' 
        } 
      });
    }
    
    res.json({ 
      success: true, 
      data: { 
        task 
      } 
    });
  } catch (error) {
    console.error('Błąd podczas pobierania szczegółów zadania:', error);
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
 * @route PUT /api/tasks/:id
 * @desc Aktualizacja zadania
 * @access Private
 */
router.put('/tasks/:id', verifyToken, async (req, res) => {
  try {
    const { id } = req.params;
    const { title, description, instructions, category, priority, dueDate, notes } = req.body;
    
    // Sprawdzenie, czy ID jest prawidłowym ObjectId
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ 
        success: false, 
        error: { 
          code: 'INVALID_ID', 
          message: 'Nieprawidłowy format ID zadania' 
        } 
      });
    }
    
    // Pobranie zadania
    const task = await Task.findById(id);
    
    if (!task) {
      return res.status(404).json({ 
        success: false, 
        error: { 
          code: 'TASK_NOT_FOUND', 
          message: 'Zadanie nie zostało znalezione' 
        } 
      });
    }
    
    // Sprawdzenie, czy profil należy do zalogowanego użytkownika
    const profile = await Profile.findOne({ _id: task.profileId, userId: req.user.userId });
    
    if (!profile) {
      return res.status(403).json({ 
        success: false, 
        error: { 
          code: 'FORBIDDEN', 
          message: 'Brak dostępu do zadania' 
        } 
      });
    }
    
    // Aktualizacja zadania
    if (title) task.title = title;
    if (description !== undefined) task.description = description;
    if (instructions) task.instructions = instructions;
    if (category) task.category = category;
    if (priority) task.priority = priority;
    if (dueDate !== undefined) task.dueDate = dueDate ? new Date(dueDate) : null;
    if (notes !== undefined) task.notes = notes;
    
    await task.save();
    
    res.json({ 
      success: true, 
      data: { 
        task 
      }, 
      message: 'Zadanie zostało zaktualizowane' 
    });
  } catch (error) {
    console.error('Błąd podczas aktualizacji zadania:', error);
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
 * @route PUT /api/tasks/:id/complete
 * @desc Oznaczanie zadania jako ukończonego
 * @access Private
 */
router.put('/tasks/:id/complete', verifyToken, async (req, res) => {
  try {
    const { id } = req.params;
    
    // Sprawdzenie, czy ID jest prawidłowym ObjectId
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ 
        success: false, 
        error: { 
          code: 'INVALID_ID', 
          message: 'Nieprawidłowy format ID zadania' 
        } 
      });
    }
    
    // Pobranie zadania
    const task = await Task.findById(id);
    
    if (!task) {
      return res.status(404).json({ 
        success: false, 
        error: { 
          code: 'TASK_NOT_FOUND', 
          message: 'Zadanie nie zostało znalezione' 
        } 
      });
    }
    
    // Sprawdzenie, czy profil należy do zalogowanego użytkownika
    const profile = await Profile.findOne({ _id: task.profileId, userId: req.user.userId });
    
    if (!profile) {
      return res.status(403).json({ 
        success: false, 
        error: { 
          code: 'FORBIDDEN', 
          message: 'Brak dostępu do zadania' 
        } 
      });
    }
    
    // Oznaczenie zadania jako ukończonego
    task.status = 'completed';
    task.completedDate = Date.now();
    
    await task.save();
    
    res.json({ 
      success: true, 
      data: { 
        task 
      }, 
      message: 'Zadanie zostało oznaczone jako ukończone' 
    });
  } catch (error) {
    console.error('Błąd podczas oznaczania zadania jako ukończonego:', error);
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
 * @route PUT /api/tasks/:id/incomplete
 * @desc Oznaczanie zadania jako nieukończonego
 * @access Private
 */
router.put('/tasks/:id/incomplete', verifyToken, async (req, res) => {
  try {
    const { id } = req.params;
    
    // Sprawdzenie, czy ID jest prawidłowym ObjectId
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ 
        success: false, 
        error: { 
          code: 'INVALID_ID', 
          message: 'Nieprawidłowy format ID zadania' 
        } 
      });
    }
    
    // Pobranie zadania
    const task = await Task.findById(id);
    
    if (!task) {
      return res.status(404).json({ 
        success: false, 
        error: { 
          code: 'TASK_NOT_FOUND', 
          message: 'Zadanie nie zostało znalezione' 
        } 
      });
    }
    
    // Sprawdzenie, czy profil należy do zalogowanego użytkownika
    const profile = await Profile.findOne({ _id: task.profileId, userId: req.user.userId });
    
    if (!profile) {
      return res.status(403).json({ 
        success: false, 
        error: { 
          code: 'FORBIDDEN', 
          message: 'Brak dostępu do zadania' 
        } 
      });
    }
    
    // Oznaczenie zadania jako nieukończonego
    task.status = 'pending';
    task.completedDate = null;
    
    await task.save();
    
    res.json({ 
      success: true, 
      data: { 
        task 
      }, 
      message: 'Zadanie zostało oznaczone jako nieukończone' 
    });
  } catch (error) {
    console.error('Błąd podczas oznaczania zadania jako nieukończonego:', error);
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
 * @route POST /api/tasks/:id/reminders
 * @desc Dodawanie przypomnienia do zadania
 * @access Private
 */
router.post('/tasks/:id/reminders', verifyToken, async (req, res) => {
  try {
    const { id } = req.params;
    const { date, message } = req.body;
    
    if (!date) {
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
          message: 'Nieprawidłowy format ID zadania' 
        } 
      });
    }
    
    // Pobranie zadania
    const task = await Task.findById(id);
    
    if (!task) {
      return res.status(404).json({ 
        success: false, 
        error: { 
          code: 'TASK_NOT_FOUND', 
          message: 'Zadanie nie zostało znalezione' 
        } 
      });
    }
    
    // Sprawdzenie, czy profil należy do zalogowanego użytkownika
    const profile = await Profile.findOne({ _id: task.profileId, userId: req.user.userId });
    
    if (!profile) {
      return res.status(403).json({ 
        success: false, 
        error: { 
          code: 'FORBIDDEN', 
          message: 'Brak dostępu do zadania' 
        } 
      });
    }
    
    // Dodanie przypomnienia
    const reminder = {
      date: new Date(date),
      message: message || 'Przypomnienie o zadaniu',
      isActive: true
    };
    
    task.reminders.push(reminder);
    await task.save();
    
    res.status(201).json({ 
      success: true, 
      data: { 
        reminder 
      }, 
      message: 'Przypomnienie zostało dodane' 
    });
  } catch (error) {
    console.error('Błąd podczas dodawania przypomnienia do zadania:', error);
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
 * @route DELETE /api/tasks/:id
 * @desc Usuwanie zadania
 * @access Private
 */
router.delete('/tasks/:id', verifyToken, async (req, res) => {
  try {
    const { id } = req.params;
    
    // Sprawdzenie, czy ID jest prawidłowym ObjectId
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ 
        success: false, 
        error: { 
          code: 'INVALID_ID', 
          message: 'Nieprawidłowy format ID zadania' 
        } 
      });
    }
    
    // Pobranie zadania
    const task = await Task.findById(id);
    
    if (!task) {
      return res.status(404).json({ 
        success: false, 
        error: { 
          code: 'TASK_NOT_FOUND', 
          message: 'Zadanie nie zostało znalezione' 
        } 
      });
    }
    
    // Sprawdzenie, czy profil należy do zalogowanego użytkownika
    const profile = await Profile.findOne({ _id: task.profileId, userId: req.user.userId });
    
    if (!profile) {
      return res.status(403).json({ 
        success: false, 
        error: { 
          code: 'FORBIDDEN', 
          message: 'Brak dostępu do zadania' 
        } 
      });
    }
    
    // Usunięcie zadania
    await Task.deleteOne({ _id: id });
    
    res.json({ 
      success: true, 
      message: 'Zadanie zostało usunięte' 
    });
  } catch (error) {
    console.error('Błąd podczas usuwania zadania:', error);
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
