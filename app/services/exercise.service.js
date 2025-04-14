/**
 * Serwis ćwiczeń terapeutycznych
 * @module services/exercise
 */

const Exercise = require('../data/models/exercise');
const defaultExercises = require('../data/default-exercises');

/**
 * Klasa serwisu ćwiczeń terapeutycznych
 */
class ExerciseService {
  /**
   * Pobiera wszystkie ćwiczenia użytkownika
   * @param {string} userId - ID użytkownika
   * @param {Object} options - Opcje filtrowania
   * @returns {Promise<Array>} - Lista ćwiczeń
   */
  async getExercises(userId, options = {}) {
    try {
      const query = { user: userId };

      // Filtrowanie po kategorii
      if (options.category) {
        query.category = options.category;
      }

      // Filtrowanie po poziomie trudności
      if (options.difficulty) {
        query.difficulty = options.difficulty;
      }

      // Filtrowanie po statusie aktywności
      if (options.isActive !== undefined) {
        query.isActive = options.isActive;
      }

      // Filtrowanie po czasie trwania
      if (options.maxDuration) {
        query.duration = { $lte: options.maxDuration };
      }

      // Sortowanie
      const sortOptions = {};
      if (options.sortBy) {
        sortOptions[options.sortBy] = options.sortOrder === 'desc' ? -1 : 1;
      } else {
        sortOptions.createdAt = -1; // Domyślnie sortuj od najnowszych
      }

      const exercises = await Exercise.find(query).sort(sortOptions);
      return exercises;
    } catch (error) {
      console.error('Błąd podczas pobierania ćwiczeń:', error);
      throw error;
    }
  }

  /**
   * Pobiera ćwiczenie po ID
   * @param {string} exerciseId - ID ćwiczenia
   * @param {string} userId - ID użytkownika
   * @returns {Promise<Object>} - Ćwiczenie
   */
  async getExerciseById(exerciseId, userId) {
    try {
      const exercise = await Exercise.findOne({
        _id: exerciseId,
        user: userId
      });

      if (!exercise) {
        throw new Error('Ćwiczenie nie istnieje');
      }

      return exercise;
    } catch (error) {
      console.error('Błąd podczas pobierania ćwiczenia:', error);
      throw error;
    }
  }

  /**
   * Tworzy nowe ćwiczenie
   * @param {Object} exerciseData - Dane ćwiczenia
   * @param {string} userId - ID użytkownika
   * @returns {Promise<Object>} - Utworzone ćwiczenie
   */
  async createExercise(exerciseData, userId) {
    try {
      const newExercise = new Exercise({
        ...exerciseData,
        user: userId,
        isDefault: false
      });

      await newExercise.save();
      return newExercise;
    } catch (error) {
      console.error('Błąd podczas tworzenia ćwiczenia:', error);
      throw error;
    }
  }

  /**
   * Aktualizuje ćwiczenie
   * @param {string} exerciseId - ID ćwiczenia
   * @param {Object} exerciseData - Dane ćwiczenia
   * @param {string} userId - ID użytkownika
   * @returns {Promise<Object>} - Zaktualizowane ćwiczenie
   */
  async updateExercise(exerciseId, exerciseData, userId) {
    try {
      const exercise = await Exercise.findOne({
        _id: exerciseId,
        user: userId
      });

      if (!exercise) {
        throw new Error('Ćwiczenie nie istnieje');
      }

      // Nie pozwalaj na modyfikację pola isDefault
      if (exerciseData.isDefault !== undefined) {
        delete exerciseData.isDefault;
      }

      // Aktualizacja ćwiczenia
      Object.assign(exercise, exerciseData);
      await exercise.save();

      return exercise;
    } catch (error) {
      console.error('Błąd podczas aktualizacji ćwiczenia:', error);
      throw error;
    }
  }

  /**
   * Usuwa ćwiczenie
   * @param {string} exerciseId - ID ćwiczenia
   * @param {string} userId - ID użytkownika
   * @returns {Promise<boolean>} - Czy operacja się powiodła
   */
  async deleteExercise(exerciseId, userId) {
    try {
      const exercise = await Exercise.findOne({
        _id: exerciseId,
        user: userId
      });

      if (!exercise) {
        throw new Error('Ćwiczenie nie istnieje');
      }

      // Nie pozwalaj na usunięcie domyślnych ćwiczeń
      if (exercise.isDefault) {
        throw new Error('Nie można usunąć domyślnego ćwiczenia');
      }

      await Exercise.deleteOne({ _id: exerciseId });
      return true;
    } catch (error) {
      console.error('Błąd podczas usuwania ćwiczenia:', error);
      throw error;
    }
  }

  /**
   * Dodaje wpis do historii wykonania ćwiczenia
   * @param {string} exerciseId - ID ćwiczenia
   * @param {Object} historyEntry - Wpis historii
   * @param {string} userId - ID użytkownika
   * @returns {Promise<Object>} - Zaktualizowane ćwiczenie
   */
  async addHistoryEntry(exerciseId, historyEntry, userId) {
    try {
      const exercise = await Exercise.findOne({
        _id: exerciseId,
        user: userId
      });

      if (!exercise) {
        throw new Error('Ćwiczenie nie istnieje');
      }

      // Dodanie wpisu do historii
      exercise.history.push({
        date: historyEntry.date || new Date(),
        duration: historyEntry.duration,
        notes: historyEntry.notes,
        rating: historyEntry.rating,
        mood: historyEntry.mood
      });

      await exercise.save();
      return exercise;
    } catch (error) {
      console.error('Błąd podczas dodawania wpisu do historii:', error);
      throw error;
    }
  }

  /**
   * Inicjalizuje domyślne ćwiczenia dla użytkownika
   * @param {string} userId - ID użytkownika
   * @returns {Promise<Array>} - Lista utworzonych ćwiczeń
   */
  async initializeDefaultExercises(userId) {
    try {
      // Sprawdzenie, czy użytkownik ma już domyślne ćwiczenia
      const existingDefaultExercises = await Exercise.find({
        user: userId,
        isDefault: true
      });

      if (existingDefaultExercises.length > 0) {
        return existingDefaultExercises;
      }

      // Tworzenie domyślnych ćwiczeń
      const exercises = [];
      for (const exerciseData of defaultExercises) {
        const newExercise = new Exercise({
          ...exerciseData,
          user: userId,
          isDefault: true
        });

        await newExercise.save();
        exercises.push(newExercise);
      }

      return exercises;
    } catch (error) {
      console.error('Błąd podczas inicjalizacji domyślnych ćwiczeń:', error);
      throw error;
    }
  }

  /**
   * Pobiera statystyki ćwiczeń użytkownika
   * @param {string} userId - ID użytkownika
   * @returns {Promise<Object>} - Statystyki ćwiczeń
   */
  async getExerciseStats(userId) {
    try {
      const exercises = await Exercise.find({ user: userId });

      // Inicjalizacja statystyk
      const stats = {
        totalExercises: exercises.length,
        totalCompletions: 0,
        totalDuration: 0,
        averageRating: 0,
        byCategory: {},
        byDifficulty: {},
        recentActivity: []
      };

      // Obliczanie statystyk
      let totalRating = 0;
      let totalRatingCount = 0;

      for (const exercise of exercises) {
        // Statystyki kategorii
        if (!stats.byCategory[exercise.category]) {
          stats.byCategory[exercise.category] = {
            count: 0,
            completions: 0
          };
        }
        stats.byCategory[exercise.category].count++;

        // Statystyki poziomu trudności
        if (!stats.byDifficulty[exercise.difficulty]) {
          stats.byDifficulty[exercise.difficulty] = {
            count: 0,
            completions: 0
          };
        }
        stats.byDifficulty[exercise.difficulty].count++;

        // Statystyki historii
        for (const entry of exercise.history) {
          stats.totalCompletions++;
          stats.totalDuration += entry.duration || 0;
          stats.byCategory[exercise.category].completions++;
          stats.byDifficulty[exercise.difficulty].completions++;

          if (entry.rating) {
            totalRating += entry.rating;
            totalRatingCount++;
          }

          // Dodanie do ostatniej aktywności
          stats.recentActivity.push({
            exerciseId: exercise._id,
            exerciseName: exercise.name,
            category: exercise.category,
            date: entry.date,
            duration: entry.duration,
            rating: entry.rating
          });
        }
      }

      // Obliczanie średniej oceny
      if (totalRatingCount > 0) {
        stats.averageRating = totalRating / totalRatingCount;
      }

      // Sortowanie ostatniej aktywności od najnowszej
      stats.recentActivity.sort((a, b) => new Date(b.date) - new Date(a.date));
      stats.recentActivity = stats.recentActivity.slice(0, 10); // Tylko 10 ostatnich

      return stats;
    } catch (error) {
      console.error('Błąd podczas pobierania statystyk ćwiczeń:', error);
      throw error;
    }
  }
}

module.exports = new ExerciseService();
