/**
 * Kontroler sesji terapeutycznych
 * @module controllers/session
 */

const { Session, Profile, Task } = require('../data/models');

/**
 * Pobiera wszystkie sesje dla danego profilu
 * @param {Object} req - Obiekt żądania Express
 * @param {Object} res - Obiekt odpowiedzi Express
 */
exports.getSessionsByProfile = async (req, res) => {
  try {
    const { profileId } = req.params;
    const userId = req.user.userId;

    // Sprawdzenie, czy profil należy do użytkownika
    const profile = await Profile.findOne({ _id: profileId, user: userId });
    if (!profile) {
      return res.status(404).json({
        success: false,
        error: {
          code: 'PROFILE_NOT_FOUND',
          message: 'Profil nie istnieje lub nie masz do niego dostępu'
        }
      });
    }

    // Pobieranie sesji
    const sessions = await Session.find({ profile: profileId })
      .sort({ startTime: -1 });

    res.json({
      success: true,
      data: sessions,
      count: sessions.length
    });
  } catch (error) {
    console.error('Błąd podczas pobierania sesji:', error);
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
 * Pobiera sesję po ID
 * @param {Object} req - Obiekt żądania Express
 * @param {Object} res - Obiekt odpowiedzi Express
 */
exports.getSessionById = async (req, res) => {
  try {
    const { sessionId } = req.params;
    const userId = req.user.userId;

    // Pobieranie sesji z populacją profilu i zadań
    const session = await Session.findById(sessionId)
      .populate('profile')
      .populate('tasks');

    if (!session) {
      return res.status(404).json({
        success: false,
        error: {
          code: 'SESSION_NOT_FOUND',
          message: 'Sesja nie istnieje'
        }
      });
    }

    // Sprawdzenie, czy profil należy do użytkownika
    const profile = await Profile.findOne({ _id: session.profile._id, user: userId });
    if (!profile) {
      return res.status(403).json({
        success: false,
        error: {
          code: 'FORBIDDEN',
          message: 'Nie masz dostępu do tej sesji'
        }
      });
    }

    res.json({
      success: true,
      data: session
    });
  } catch (error) {
    console.error('Błąd podczas pobierania sesji:', error);
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
 * Tworzy nową sesję
 * @param {Object} req - Obiekt żądania Express
 * @param {Object} res - Obiekt odpowiedzi Express
 */
exports.createSession = async (req, res) => {
  try {
    const { profileId, therapyMethod, emotionalStateStart } = req.body;
    const userId = req.user.userId;

    // Sprawdzenie, czy profil należy do użytkownika
    const profile = await Profile.findOne({ _id: profileId, user: userId });
    if (!profile) {
      return res.status(404).json({
        success: false,
        error: {
          code: 'PROFILE_NOT_FOUND',
          message: 'Profil nie istnieje lub nie masz do niego dostępu'
        }
      });
    }

    // Pobieranie poprzednich sesji
    const previousSessions = await Session.find({ profile: profileId })
      .sort({ startTime: -1 });

    // Określenie numeru sesji
    const sessionNumber = previousSessions.length + 1;

    // Określenie statusu ciągłości
    let continuityStatus = 'new';
    if (previousSessions.length > 0) {
      const lastSession = previousSessions[0]; // Zakładamy, że są posortowane od najnowszej
      const timeSinceLastSession = new Date() - new Date(lastSession.startTime);
      const daysSinceLastSession = timeSinceLastSession / (1000 * 60 * 60 * 24);

      if (daysSinceLastSession < 1) {
        continuityStatus = 'continued';
      } else if (daysSinceLastSession > 7) {
        continuityStatus = 'resumed_after_break';
      } else {
        continuityStatus = 'new';
      }
    }

    // Tworzenie nowej sesji
    const session = new Session({
      profile: profileId,
      startTime: new Date(),
      therapyMethod: therapyMethod || profile.therapyMethod || 'cognitive_behavioral',
      sessionNumber,
      continuityStatus,
      metrics: {
        emotionalStateStart: emotionalStateStart || {
          anxiety: 5,
          depression: 5,
          optimism: 5
        }
      },
      isCompleted: false
    });

    await session.save();

    // Aktualizacja profilu
    profile.sessions.push(session._id);
    await profile.save();

    res.status(201).json({
      success: true,
      data: session,
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
};

/**
 * Dodaje wiadomość do sesji
 * @param {Object} req - Obiekt żądania Express
 * @param {Object} res - Obiekt odpowiedzi Express
 */
exports.addMessage = async (req, res) => {
  try {
    const { sessionId } = req.params;
    const { role, content } = req.body;
    const userId = req.user.userId;

    // Pobieranie sesji
    const session = await Session.findById(sessionId);
    if (!session) {
      return res.status(404).json({
        success: false,
        error: {
          code: 'SESSION_NOT_FOUND',
          message: 'Sesja nie istnieje'
        }
      });
    }

    // Sprawdzenie, czy profil należy do użytkownika
    const profile = await Profile.findOne({ _id: session.profile, user: userId });
    if (!profile) {
      return res.status(403).json({
        success: false,
        error: {
          code: 'FORBIDDEN',
          message: 'Nie masz dostępu do tej sesji'
        }
      });
    }

    // Sprawdzenie, czy sesja jest zakończona
    if (session.isCompleted) {
      return res.status(400).json({
        success: false,
        error: {
          code: 'SESSION_COMPLETED',
          message: 'Sesja jest już zakończona'
        }
      });
    }

    // Dodanie wiadomości
    session.conversation.push({
      role,
      content,
      timestamp: new Date()
    });

    await session.save();

    res.json({
      success: true,
      data: session.conversation[session.conversation.length - 1],
      message: 'Wiadomość została dodana'
    });
  } catch (error) {
    console.error('Błąd podczas dodawania wiadomości:', error);
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
 * Kończy sesję
 * @param {Object} req - Obiekt żądania Express
 * @param {Object} res - Obiekt odpowiedzi Express
 */
exports.endSession = async (req, res) => {
  try {
    const { sessionId } = req.params;
    const { summary, emotionalStateEnd, sessionEffectivenessRating } = req.body;
    const userId = req.user.userId;

    // Pobieranie sesji
    const session = await Session.findById(sessionId);
    if (!session) {
      return res.status(404).json({
        success: false,
        error: {
          code: 'SESSION_NOT_FOUND',
          message: 'Sesja nie istnieje'
        }
      });
    }

    // Sprawdzenie, czy profil należy do użytkownika
    const profile = await Profile.findOne({ _id: session.profile, user: userId });
    if (!profile) {
      return res.status(403).json({
        success: false,
        error: {
          code: 'FORBIDDEN',
          message: 'Nie masz dostępu do tej sesji'
        }
      });
    }

    // Sprawdzenie, czy sesja jest już zakończona
    if (session.isCompleted) {
      return res.status(400).json({
        success: false,
        error: {
          code: 'SESSION_ALREADY_COMPLETED',
          message: 'Sesja jest już zakończona'
        }
      });
    }

    // Zakończenie sesji
    session.endTime = new Date();
    session.isCompleted = true;

    if (summary) {
      session.summary = summary;
    }

    if (emotionalStateEnd) {
      session.metrics.emotionalStateEnd = emotionalStateEnd;
    }

    if (sessionEffectivenessRating) {
      session.metrics.sessionEffectivenessRating = sessionEffectivenessRating;
    }

    await session.save();

    res.json({
      success: true,
      data: session,
      message: 'Sesja została zakończona'
    });
  } catch (error) {
    console.error('Błąd podczas kończenia sesji:', error);
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
 * Dodaje zadanie do sesji
 * @param {Object} req - Obiekt żądania Express
 * @param {Object} res - Obiekt odpowiedzi Express
 */
exports.addTask = async (req, res) => {
  try {
    const { sessionId } = req.params;
    const { title, description, deadline } = req.body;
    const userId = req.user.userId;

    // Pobieranie sesji
    const session = await Session.findById(sessionId);
    if (!session) {
      return res.status(404).json({
        success: false,
        error: {
          code: 'SESSION_NOT_FOUND',
          message: 'Sesja nie istnieje'
        }
      });
    }

    // Sprawdzenie, czy profil należy do użytkownika
    const profile = await Profile.findOne({ _id: session.profile, user: userId });
    if (!profile) {
      return res.status(403).json({
        success: false,
        error: {
          code: 'FORBIDDEN',
          message: 'Nie masz dostępu do tej sesji'
        }
      });
    }

    // Tworzenie nowego zadania
    const task = new Task({
      title,
      description,
      deadline: deadline ? new Date(deadline) : undefined,
      session: sessionId,
      profile: session.profile
    });

    await task.save();

    // Dodanie zadania do sesji
    session.tasks.push(task._id);
    await session.save();

    // Dodanie zadania do profilu
    profile.tasks.push(task._id);
    await profile.save();

    res.status(201).json({
      success: true,
      data: task,
      message: 'Zadanie zostało dodane'
    });
  } catch (error) {
    console.error('Błąd podczas dodawania zadania:', error);
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
 * Pobiera wszystkie zadania sesji
 * @param {Object} req - Obiekt żądania Express
 * @param {Object} res - Obiekt odpowiedzi Express
 */
exports.getSessionTasks = async (req, res) => {
  try {
    const { sessionId } = req.params;
    const userId = req.user.userId;

    // Pobieranie sesji
    const session = await Session.findById(sessionId);
    if (!session) {
      return res.status(404).json({
        success: false,
        error: {
          code: 'SESSION_NOT_FOUND',
          message: 'Sesja nie istnieje'
        }
      });
    }

    // Sprawdzenie, czy profil należy do użytkownika
    const profile = await Profile.findOne({ _id: session.profile, user: userId });
    if (!profile) {
      return res.status(403).json({
        success: false,
        error: {
          code: 'FORBIDDEN',
          message: 'Nie masz dostępu do tej sesji'
        }
      });
    }

    // Pobieranie zadań
    const tasks = await Task.find({ session: sessionId });

    res.json({
      success: true,
      data: tasks,
      count: tasks.length
    });
  } catch (error) {
    console.error('Błąd podczas pobierania zadań sesji:', error);
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
 * Eksportuje sesję do pliku JSON
 * @param {Object} req - Obiekt żądania Express
 * @param {Object} res - Obiekt odpowiedzi Express
 */
exports.exportSession = async (req, res) => {
  try {
    const { sessionId } = req.params;
    const userId = req.user.userId;

    // Pobieranie sesji z populacją profilu i zadań
    const session = await Session.findById(sessionId)
      .populate('profile')
      .populate('tasks');

    if (!session) {
      return res.status(404).json({
        success: false,
        error: {
          code: 'SESSION_NOT_FOUND',
          message: 'Sesja nie istnieje'
        }
      });
    }

    // Sprawdzenie, czy profil należy do użytkownika
    const profile = await Profile.findOne({ _id: session.profile._id, user: userId });
    if (!profile) {
      return res.status(403).json({
        success: false,
        error: {
          code: 'FORBIDDEN',
          message: 'Nie masz dostępu do tej sesji'
        }
      });
    }

    // Przygotowanie danych do eksportu
    const exportData = {
      session: {
        id: session._id,
        startTime: session.startTime,
        endTime: session.endTime,
        therapyMethod: session.therapyMethod,
        sessionNumber: session.sessionNumber,
        continuityStatus: session.continuityStatus,
        isCompleted: session.isCompleted,
        summary: session.summary,
        metrics: session.metrics
      },
      profile: {
        id: profile._id,
        name: profile.name,
        therapyMethod: profile.therapyMethod
      },
      conversation: session.conversation,
      tasks: session.tasks.map(task => ({
        id: task._id,
        title: task.title,
        description: task.description,
        deadline: task.deadline,
        isCompleted: task.isCompleted
      }))
    };

    res.json({
      success: true,
      data: exportData,
      message: 'Sesja została wyeksportowana'
    });
  } catch (error) {
    console.error('Błąd podczas eksportowania sesji:', error);
    res.status(500).json({
      success: false,
      error: {
        code: 'SERVER_ERROR',
        message: 'Błąd serwera'
      }
    });
  }
};
