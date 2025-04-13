/**
 * Kontroler zadań terapeutycznych
 * @module controllers/task
 */

const Task = require('../data/models/task');
const Profile = require('../data/models/profile');
const Session = require('../data/models/session');
const User = require('../data/models/user');

/**
 * Pobiera wszystkie zadania użytkownika
 * @param {Object} req - Obiekt żądania Express
 * @param {Object} res - Obiekt odpowiedzi Express
 */
exports.getTasks = async (req, res) => {
  try {
    const userId = req.user.userId;
    const { profileId, status, category, priority, sort, order, limit = 10, skip = 0 } = req.query;

    // Pobieranie profili użytkownika
    const profiles = await Profile.find({ user: userId });
    const profileIds = profiles.map(profile => profile._id);

    if (profileIds.length === 0) {
      return res.status(200).json({
        success: true,
        data: {
          tasks: [],
          total: 0,
          limit: parseInt(limit),
          skip: parseInt(skip)
        }
      });
    }

    // Budowanie filtra
    const filter = { profile: { $in: profileIds } };

    // Filtrowanie po profilu
    if (profileId) {
      // Sprawdzenie, czy profil należy do użytkownika
      const profileExists = profileIds.some(id => id.toString() === profileId);
      if (!profileExists) {
        return res.status(403).json({
          success: false,
          error: {
            code: 'FORBIDDEN',
            message: 'Nie masz dostępu do tego profilu'
          }
        });
      }
      filter.profile = profileId;
    }

    // Filtrowanie po statusie
    if (status) {
      filter.status = status;
    }

    // Filtrowanie po kategorii
    if (category) {
      filter.category = category;
    }

    // Filtrowanie po priorytecie
    if (priority) {
      filter.priority = priority;
    }

    // Opcje sortowania i paginacji
    const options = {
      limit: parseInt(limit),
      skip: parseInt(skip)
    };

    // Sortowanie
    if (sort) {
      options.sort = { [sort]: order === 'desc' ? -1 : 1 };
    } else {
      // Domyślne sortowanie po deadline
      options.sort = { deadline: 1 };
    }

    // Pobieranie zadań
    const tasks = await Task.find(filter, null, options)
      .populate('profile', 'name')
      .populate('session', 'startTime');

    // Pobieranie całkowitej liczby zadań
    const total = await Task.countDocuments(filter);

    // Mapowanie zadań do odpowiedniego formatu
    const mappedTasks = tasks.map(task => ({
      _id: task._id,
      description: task.description,
      category: task.category,
      deadline: task.deadline,
      priority: task.priority,
      status: task.status,
      createdAt: task.createdAt,
      profile: task.profile._id,
      profileName: task.profile.name,
      session: task.session?._id,
      sessionDate: task.session?.startTime,
      completionData: task.completionData,
      discussedInSession: task.discussedInSession,
      reminders: task.reminders
    }));

    res.status(200).json({
      success: true,
      data: {
        tasks: mappedTasks,
        total,
        limit: options.limit,
        skip: options.skip
      }
    });
  } catch (error) {
    console.error('Błąd podczas pobierania zadań:', error);
    res.status(500).json({
      success: false,
      error: {
        code: 'SERVER_ERROR',
        message: 'Błąd serwera'
      }
    });
  }
};

/**
 * Pobiera szczegóły zadania
 * @param {Object} req - Obiekt żądania Express
 * @param {Object} res - Obiekt odpowiedzi Express
 */
exports.getTask = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.userId;

    // Pobieranie zadania
    const task = await Task.findById(id)
      .populate('profile', 'name')
      .populate('session', 'startTime');

    if (!task) {
      return res.status(404).json({
        success: false,
        error: {
          code: 'TASK_NOT_FOUND',
          message: 'Zadanie nie zostało znalezione'
        }
      });
    }

    // Sprawdzenie, czy profil należy do użytkownika
    const profile = await Profile.findOne({ _id: task.profile._id, user: userId });
    if (!profile) {
      return res.status(403).json({
        success: false,
        error: {
          code: 'FORBIDDEN',
          message: 'Nie masz dostępu do tego zadania'
        }
      });
    }

    // Mapowanie zadania do odpowiedniego formatu
    const mappedTask = {
      _id: task._id,
      description: task.description,
      category: task.category,
      deadline: task.deadline,
      priority: task.priority,
      status: task.status,
      createdAt: task.createdAt,
      profile: task.profile._id,
      profileName: task.profile.name,
      session: task.session?._id,
      sessionDate: task.session?.startTime,
      completionData: task.completionData,
      discussedInSession: task.discussedInSession,
      reminders: task.reminders
    };

    res.status(200).json({
      success: true,
      data: mappedTask
    });
  } catch (error) {
    console.error('Błąd podczas pobierania zadania:', error);
    res.status(500).json({
      success: false,
      error: {
        code: 'SERVER_ERROR',
        message: 'Błąd serwera'
      }
    });
  }
};

/**
 * Tworzy nowe zadanie
 * @param {Object} req - Obiekt żądania Express
 * @param {Object} res - Obiekt odpowiedzi Express
 */
exports.createTask = async (req, res) => {
  try {
    const { profile, session, description, category, deadline, priority } = req.body;
    const userId = req.user.userId;

    // Sprawdzenie wymaganych pól
    if (!profile || !description || !deadline) {
      return res.status(400).json({
        success: false,
        error: {
          code: 'MISSING_FIELDS',
          message: 'Brakuje wymaganych pól'
        }
      });
    }

    // Sprawdzenie, czy profil należy do użytkownika
    const profileDoc = await Profile.findOne({ _id: profile, user: userId });
    if (!profileDoc) {
      return res.status(403).json({
        success: false,
        error: {
          code: 'FORBIDDEN',
          message: 'Nie masz dostępu do tego profilu'
        }
      });
    }

    // Sprawdzenie, czy sesja istnieje i należy do profilu
    if (session) {
      const sessionDoc = await Session.findOne({ _id: session, profile });
      if (!sessionDoc) {
        return res.status(404).json({
          success: false,
          error: {
            code: 'SESSION_NOT_FOUND',
            message: 'Sesja nie została znaleziona lub nie należy do tego profilu'
          }
        });
      }
    }

    // Tworzenie nowego zadania
    const task = new Task({
      profile,
      session,
      description,
      category: category || 'technika_terapeutyczna',
      deadline: new Date(deadline),
      priority: priority || 'medium',
      status: 'pending'
    });

    await task.save();

    // Dodanie zadania do profilu
    profileDoc.tasks.push(task._id);
    await profileDoc.save();

    // Dodanie zadania do sesji, jeśli podano
    if (session) {
      const sessionDoc = await Session.findById(session);
      sessionDoc.tasks.push(task._id);
      await sessionDoc.save();
    }

    res.status(201).json({
      success: true,
      data: task,
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
};

/**
 * Aktualizuje zadanie
 * @param {Object} req - Obiekt żądania Express
 * @param {Object} res - Obiekt odpowiedzi Express
 */
exports.updateTask = async (req, res) => {
  try {
    const { id } = req.params;
    const { description, category, deadline, priority, status } = req.body;
    const userId = req.user.userId;

    // Pobieranie zadania
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

    // Sprawdzenie, czy profil należy do użytkownika
    const profile = await Profile.findOne({ _id: task.profile, user: userId });
    if (!profile) {
      return res.status(403).json({
        success: false,
        error: {
          code: 'FORBIDDEN',
          message: 'Nie masz dostępu do tego zadania'
        }
      });
    }

    // Aktualizacja zadania
    if (description) task.description = description;
    if (category) task.category = category;
    if (deadline) task.deadline = new Date(deadline);
    if (priority) task.priority = priority;
    if (status) task.status = status;

    // Jeśli status zmienia się na 'completed', dodaj datę ukończenia
    if (status === 'completed' && task.status !== 'completed') {
      task.completionData = {
        completionDate: new Date(),
        ...task.completionData
      };
    }

    await task.save();

    res.status(200).json({
      success: true,
      data: task,
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
};

/**
 * Usuwa zadanie
 * @param {Object} req - Obiekt żądania Express
 * @param {Object} res - Obiekt odpowiedzi Express
 */
exports.deleteTask = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.userId;

    // Pobieranie zadania
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

    // Sprawdzenie, czy profil należy do użytkownika
    const profile = await Profile.findOne({ _id: task.profile, user: userId });
    if (!profile) {
      return res.status(403).json({
        success: false,
        error: {
          code: 'FORBIDDEN',
          message: 'Nie masz dostępu do tego zadania'
        }
      });
    }

    // Usunięcie zadania z profilu
    profile.tasks = profile.tasks.filter(taskId => taskId.toString() !== id);
    await profile.save();

    // Usunięcie zadania z sesji, jeśli istnieje
    if (task.session) {
      const session = await Session.findById(task.session);
      if (session) {
        session.tasks = session.tasks.filter(taskId => taskId.toString() !== id);
        await session.save();
      }
    }

    // Usunięcie zadania
    await Task.findByIdAndDelete(id);

    res.status(200).json({
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
};

/**
 * Oznacza zadanie jako ukończone
 * @param {Object} req - Obiekt żądania Express
 * @param {Object} res - Obiekt odpowiedzi Express
 */
exports.completeTask = async (req, res) => {
  try {
    const { id } = req.params;
    const { successRating, challenges, reflections, emotionalResponse } = req.body;
    const userId = req.user.userId;

    // Pobieranie zadania
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

    // Sprawdzenie, czy profil należy do użytkownika
    const profile = await Profile.findOne({ _id: task.profile, user: userId });
    if (!profile) {
      return res.status(403).json({
        success: false,
        error: {
          code: 'FORBIDDEN',
          message: 'Nie masz dostępu do tego zadania'
        }
      });
    }

    // Oznaczenie zadania jako ukończone
    task.status = 'completed';
    task.completionData = {
      completionDate: new Date(),
      successRating: successRating || 5,
      challenges: challenges || '',
      reflections: reflections || '',
      emotionalResponse: emotionalResponse || ''
    };

    await task.save();

    res.status(200).json({
      success: true,
      data: task,
      message: 'Zadanie zostało oznaczone jako ukończone'
    });
  } catch (error) {
    console.error('Błąd podczas oznaczania zadania jako ukończone:', error);
    res.status(500).json({
      success: false,
      error: {
        code: 'SERVER_ERROR',
        message: 'Błąd serwera'
      }
    });
  }
};

/**
 * Oznacza zadanie jako nieukończone
 * @param {Object} req - Obiekt żądania Express
 * @param {Object} res - Obiekt odpowiedzi Express
 */
exports.incompleteTask = async (req, res) => {
  try {
    const { id } = req.params;
    const { reason } = req.body;
    const userId = req.user.userId;

    // Pobieranie zadania
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

    // Sprawdzenie, czy profil należy do użytkownika
    const profile = await Profile.findOne({ _id: task.profile, user: userId });
    if (!profile) {
      return res.status(403).json({
        success: false,
        error: {
          code: 'FORBIDDEN',
          message: 'Nie masz dostępu do tego zadania'
        }
      });
    }

    // Oznaczenie zadania jako nieukończone
    task.status = 'incomplete';
    task.completionData = {
      completionDate: new Date(),
      challenges: reason || 'Zadanie nie zostało ukończone'
    };

    await task.save();

    res.status(200).json({
      success: true,
      data: task,
      message: 'Zadanie zostało oznaczone jako nieukończone'
    });
  } catch (error) {
    console.error('Błąd podczas oznaczania zadania jako nieukończone:', error);
    res.status(500).json({
      success: false,
      error: {
        code: 'SERVER_ERROR',
        message: 'Błąd serwera'
      }
    });
  }
};

/**
 * Dodaje przypomnienie do zadania
 * @param {Object} req - Obiekt żądania Express
 * @param {Object} res - Obiekt odpowiedzi Express
 */
exports.addReminder = async (req, res) => {
  try {
    const { id } = req.params;
    const { time, message } = req.body;
    const userId = req.user.userId;

    // Sprawdzenie wymaganych pól
    if (!time || !message) {
      return res.status(400).json({
        success: false,
        error: {
          code: 'MISSING_FIELDS',
          message: 'Brakuje wymaganych pól'
        }
      });
    }

    // Pobieranie zadania
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

    // Sprawdzenie, czy profil należy do użytkownika
    const profile = await Profile.findOne({ _id: task.profile, user: userId });
    if (!profile) {
      return res.status(403).json({
        success: false,
        error: {
          code: 'FORBIDDEN',
          message: 'Nie masz dostępu do tego zadania'
        }
      });
    }

    // Dodanie przypomnienia
    task.reminders.push({
      time: new Date(time),
      message,
      isSent: false
    });

    await task.save();

    res.status(200).json({
      success: true,
      data: task,
      message: 'Przypomnienie zostało dodane'
    });
  } catch (error) {
    console.error('Błąd podczas dodawania przypomnienia:', error);
    res.status(500).json({
      success: false,
      error: {
        code: 'SERVER_ERROR',
        message: 'Błąd serwera'
      }
    });
  }
};

/**
 * Usuwa przypomnienie z zadania
 * @param {Object} req - Obiekt żądania Express
 * @param {Object} res - Obiekt odpowiedzi Express
 */
exports.deleteReminder = async (req, res) => {
  try {
    const { id, reminderId } = req.params;
    const userId = req.user.userId;

    // Pobieranie zadania
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

    // Sprawdzenie, czy profil należy do użytkownika
    const profile = await Profile.findOne({ _id: task.profile, user: userId });
    if (!profile) {
      return res.status(403).json({
        success: false,
        error: {
          code: 'FORBIDDEN',
          message: 'Nie masz dostępu do tego zadania'
        }
      });
    }

    // Usunięcie przypomnienia
    task.reminders = task.reminders.filter(reminder => reminder._id.toString() !== reminderId);

    await task.save();

    res.status(200).json({
      success: true,
      data: task,
      message: 'Przypomnienie zostało usunięte'
    });
  } catch (error) {
    console.error('Błąd podczas usuwania przypomnienia:', error);
    res.status(500).json({
      success: false,
      error: {
        code: 'SERVER_ERROR',
        message: 'Błąd serwera'
      }
    });
  }
};

/**
 * Aktualizuje przypomnienie w zadaniu
 * @param {Object} req - Obiekt żądania Express
 * @param {Object} res - Obiekt odpowiedzi Express
 */
exports.updateReminder = async (req, res) => {
  try {
    const { id, reminderId } = req.params;
    const { time, message } = req.body;
    const userId = req.user.userId;

    // Pobieranie zadania
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

    // Sprawdzenie, czy profil należy do użytkownika
    const profile = await Profile.findOne({ _id: task.profile, user: userId });
    if (!profile) {
      return res.status(403).json({
        success: false,
        error: {
          code: 'FORBIDDEN',
          message: 'Nie masz dostępu do tego zadania'
        }
      });
    }

    // Znalezienie przypomnienia
    const reminderIndex = task.reminders.findIndex(reminder => reminder._id.toString() === reminderId);
    if (reminderIndex === -1) {
      return res.status(404).json({
        success: false,
        error: {
          code: 'REMINDER_NOT_FOUND',
          message: 'Przypomnienie nie zostało znalezione'
        }
      });
    }

    // Aktualizacja przypomnienia
    if (time) task.reminders[reminderIndex].time = new Date(time);
    if (message) task.reminders[reminderIndex].message = message;

    await task.save();

    res.status(200).json({
      success: true,
      data: task,
      message: 'Przypomnienie zostało zaktualizowane'
    });
  } catch (error) {
    console.error('Błąd podczas aktualizacji przypomnienia:', error);
    res.status(500).json({
      success: false,
      error: {
        code: 'SERVER_ERROR',
        message: 'Błąd serwera'
      }
    });
  }
};

/**
 * Pobiera statystyki zadań użytkownika
 * @param {Object} req - Obiekt żądania Express
 * @param {Object} res - Obiekt odpowiedzi Express
 */
exports.getTaskStats = async (req, res) => {
  try {
    const userId = req.user.userId;
    const { profileId } = req.query;

    // Pobieranie profili użytkownika
    const profiles = await Profile.find({ user: userId });
    const profileIds = profiles.map(profile => profile._id);

    if (profileIds.length === 0) {
      return res.status(200).json({
        success: true,
        data: {
          total: 0,
          completed: 0,
          incomplete: 0,
          pending: 0,
          completionRate: 0,
          byCategory: {},
          byPriority: {}
        }
      });
    }

    // Budowanie filtra
    const filter = { profile: { $in: profileIds } };

    // Filtrowanie po profilu
    if (profileId) {
      // Sprawdzenie, czy profil należy do użytkownika
      const profileExists = profileIds.some(id => id.toString() === profileId);
      if (!profileExists) {
        return res.status(403).json({
          success: false,
          error: {
            code: 'FORBIDDEN',
            message: 'Nie masz dostępu do tego profilu'
          }
        });
      }
      filter.profile = profileId;
    }

    // Pobieranie statystyk
    const total = await Task.countDocuments(filter);
    const completed = await Task.countDocuments({ ...filter, status: 'completed' });
    const incomplete = await Task.countDocuments({ ...filter, status: 'incomplete' });
    const pending = await Task.countDocuments({ ...filter, status: 'pending' });

    // Obliczanie współczynnika ukończenia
    const completionRate = total > 0 ? (completed / total) * 100 : 0;

    // Pobieranie statystyk według kategorii
    const tasksByCategory = await Task.aggregate([
      { $match: filter },
      { $group: { _id: '$category', count: { $sum: 1 } } }
    ]);

    const byCategory = {};
    tasksByCategory.forEach(item => {
      byCategory[item._id] = item.count;
    });

    // Pobieranie statystyk według priorytetu
    const tasksByPriority = await Task.aggregate([
      { $match: filter },
      { $group: { _id: '$priority', count: { $sum: 1 } } }
    ]);

    const byPriority = {};
    tasksByPriority.forEach(item => {
      byPriority[item._id] = item.count;
    });

    res.status(200).json({
      success: true,
      data: {
        total,
        completed,
        incomplete,
        pending,
        completionRate,
        byCategory,
        byPriority
      }
    });
  } catch (error) {
    console.error('Błąd podczas pobierania statystyk zadań:', error);
    res.status(500).json({
      success: false,
      error: {
        code: 'SERVER_ERROR',
        message: 'Błąd serwera'
      }
    });
  }
};
