/**
 * Serwis dziennika myśli i emocji
 * @module services/thought-journal
 */

const ThoughtJournalEntry = require('../data/models/thought-journal');

/**
 * Klasa serwisu dziennika myśli i emocji
 */
class ThoughtJournalService {
  /**
   * Pobiera wszystkie wpisy z dziennika użytkownika
   * @param {string} userId - ID użytkownika
   * @param {Object} options - Opcje filtrowania
   * @returns {Promise<Array>} - Lista wpisów
   */
  async getEntries(userId, options = {}) {
    try {
      const query = { user: userId };

      // Filtrowanie po profilu
      if (options.profileId) {
        query.profile = options.profileId;
      }

      // Filtrowanie po dacie
      if (options.startDate || options.endDate) {
        query.date = {};
        if (options.startDate) {
          query.date.$gte = new Date(options.startDate);
        }
        if (options.endDate) {
          query.date.$lte = new Date(options.endDate);
        }
      }

      // Filtrowanie po tagach
      if (options.tags && options.tags.length > 0) {
        query.tags = { $in: options.tags };
      }

      // Sortowanie
      const sortOptions = {};
      if (options.sortBy) {
        sortOptions[options.sortBy] = options.sortOrder === 'desc' ? -1 : 1;
      } else {
        sortOptions.date = -1; // Domyślnie sortuj od najnowszych
      }

      // Paginacja
      const limit = options.limit || 20;
      const skip = options.page ? (options.page - 1) * limit : 0;

      const entries = await ThoughtJournalEntry.find(query)
        .sort(sortOptions)
        .skip(skip)
        .limit(limit)
        .populate('profile', 'name');

      const total = await ThoughtJournalEntry.countDocuments(query);

      return {
        entries,
        pagination: {
          total,
          page: options.page || 1,
          limit,
          pages: Math.ceil(total / limit)
        }
      };
    } catch (error) {
      console.error('Błąd podczas pobierania wpisów z dziennika:', error);
      throw error;
    }
  }

  /**
   * Pobiera wpis z dziennika po ID
   * @param {string} entryId - ID wpisu
   * @param {string} userId - ID użytkownika
   * @returns {Promise<Object>} - Wpis z dziennika
   */
  async getEntryById(entryId, userId) {
    try {
      const entry = await ThoughtJournalEntry.findOne({
        _id: entryId,
        user: userId
      }).populate('profile', 'name');

      if (!entry) {
        throw new Error('Wpis nie istnieje');
      }

      return entry;
    } catch (error) {
      console.error('Błąd podczas pobierania wpisu z dziennika:', error);
      throw error;
    }
  }

  /**
   * Tworzy nowy wpis w dzienniku
   * @param {Object} entryData - Dane wpisu
   * @param {string} userId - ID użytkownika
   * @returns {Promise<Object>} - Utworzony wpis
   */
  async createEntry(entryData, userId) {
    try {
      const newEntry = new ThoughtJournalEntry({
        ...entryData,
        user: userId
      });

      await newEntry.save();
      return newEntry;
    } catch (error) {
      console.error('Błąd podczas tworzenia wpisu w dzienniku:', error);
      throw error;
    }
  }

  /**
   * Aktualizuje wpis w dzienniku
   * @param {string} entryId - ID wpisu
   * @param {Object} entryData - Dane wpisu
   * @param {string} userId - ID użytkownika
   * @returns {Promise<Object>} - Zaktualizowany wpis
   */
  async updateEntry(entryId, entryData, userId) {
    try {
      const entry = await ThoughtJournalEntry.findOne({
        _id: entryId,
        user: userId
      });

      if (!entry) {
        throw new Error('Wpis nie istnieje');
      }

      // Aktualizacja wpisu
      Object.assign(entry, entryData);
      await entry.save();

      return entry;
    } catch (error) {
      console.error('Błąd podczas aktualizacji wpisu w dzienniku:', error);
      throw error;
    }
  }

  /**
   * Usuwa wpis z dziennika
   * @param {string} entryId - ID wpisu
   * @param {string} userId - ID użytkownika
   * @returns {Promise<boolean>} - Czy operacja się powiodła
   */
  async deleteEntry(entryId, userId) {
    try {
      const result = await ThoughtJournalEntry.deleteOne({
        _id: entryId,
        user: userId
      });

      if (result.deletedCount === 0) {
        throw new Error('Wpis nie istnieje');
      }

      return true;
    } catch (error) {
      console.error('Błąd podczas usuwania wpisu z dziennika:', error);
      throw error;
    }
  }

  /**
   * Pobiera statystyki dziennika myśli i emocji
   * @param {string} userId - ID użytkownika
   * @param {Object} options - Opcje filtrowania
   * @returns {Promise<Object>} - Statystyki dziennika
   */
  async getJournalStats(userId, options = {}) {
    try {
      const query = { user: userId };

      // Filtrowanie po profilu
      if (options.profileId) {
        query.profile = options.profileId;
      }

      // Filtrowanie po dacie
      if (options.startDate || options.endDate) {
        query.date = {};
        if (options.startDate) {
          query.date.$gte = new Date(options.startDate);
        }
        if (options.endDate) {
          query.date.$lte = new Date(options.endDate);
        }
      }

      const entries = await ThoughtJournalEntry.find(query);

      // Inicjalizacja statystyk
      const stats = {
        totalEntries: entries.length,
        emotionsStats: {},
        distortionsStats: {},
        emotionalProgress: [],
        commonTags: {}
      };

      // Mapa do śledzenia emocji w czasie
      const emotionsOverTime = {};

      // Obliczanie statystyk
      for (const entry of entries) {
        // Statystyki emocji
        for (const emotion of entry.emotions) {
          if (!stats.emotionsStats[emotion.name]) {
            stats.emotionsStats[emotion.name] = {
              count: 0,
              totalIntensity: 0,
              averageIntensity: 0
            };
          }
          stats.emotionsStats[emotion.name].count++;
          stats.emotionsStats[emotion.name].totalIntensity += emotion.intensity;
        }

        // Statystyki zniekształceń poznawczych
        for (const distortion of entry.cognitiveDistortions) {
          if (!stats.distortionsStats[distortion]) {
            stats.distortionsStats[distortion] = 0;
          }
          stats.distortionsStats[distortion]++;
        }

        // Statystyki tagów
        for (const tag of entry.tags) {
          if (!stats.commonTags[tag]) {
            stats.commonTags[tag] = 0;
          }
          stats.commonTags[tag]++;
        }

        // Śledzenie emocji w czasie
        const dateKey = entry.date.toISOString().split('T')[0];
        if (!emotionsOverTime[dateKey]) {
          emotionsOverTime[dateKey] = {};
        }

        for (const emotion of entry.emotions) {
          if (!emotionsOverTime[dateKey][emotion.name]) {
            emotionsOverTime[dateKey][emotion.name] = {
              count: 0,
              totalIntensity: 0
            };
          }
          emotionsOverTime[dateKey][emotion.name].count++;
          emotionsOverTime[dateKey][emotion.name].totalIntensity += emotion.intensity;
        }
      }

      // Obliczanie średniej intensywności emocji
      for (const emotion in stats.emotionsStats) {
        if (stats.emotionsStats[emotion].count > 0) {
          stats.emotionsStats[emotion].averageIntensity = 
            stats.emotionsStats[emotion].totalIntensity / stats.emotionsStats[emotion].count;
        }
      }

      // Konwersja emocji w czasie na tablicę
      const dates = Object.keys(emotionsOverTime).sort();
      for (const date of dates) {
        const emotionsForDate = {};
        for (const emotion in emotionsOverTime[date]) {
          emotionsForDate[emotion] = 
            emotionsOverTime[date][emotion].totalIntensity / emotionsOverTime[date][emotion].count;
        }
        stats.emotionalProgress.push({
          date,
          emotions: emotionsForDate
        });
      }

      // Konwersja tagów na tablicę i sortowanie
      const tagsArray = Object.entries(stats.commonTags).map(([tag, count]) => ({ tag, count }));
      tagsArray.sort((a, b) => b.count - a.count);
      stats.commonTags = tagsArray.slice(0, 10); // Tylko 10 najczęstszych tagów

      return stats;
    } catch (error) {
      console.error('Błąd podczas pobierania statystyk dziennika:', error);
      throw error;
    }
  }
}

module.exports = new ThoughtJournalService();
