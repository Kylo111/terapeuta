/**
 * Serwis raportowania
 * @module services/report
 */

const Report = require('../data/models/report');
const Session = require('../data/models/session');
const Task = require('../data/models/task');
const Profile = require('../data/models/profile');
const User = require('../data/models/user');

/**
 * Klasa serwisu raportowania
 */
class ReportService {
  /**
   * Generuje raport z sesji
   * @param {string} sessionId - ID sesji
   * @param {string} userId - ID użytkownika
   * @returns {Promise<Object>} - Wygenerowany raport
   */
  async generateSessionReport(sessionId, userId) {
    try {
      // Pobieranie sesji
      const session = await Session.findById(sessionId);
      if (!session) {
        throw new Error('Sesja nie została znaleziona');
      }

      // Pobieranie profilu
      const profile = await Profile.findById(session.profile);
      if (!profile) {
        throw new Error('Profil nie został znaleziony');
      }

      // Sprawdzenie, czy profil należy do użytkownika
      if (profile.user.toString() !== userId) {
        throw new Error('Nie masz dostępu do tego profilu');
      }

      // Przygotowanie danych raportu
      const reportData = {
        user: userId,
        profile: profile._id,
        title: `Raport z sesji z dnia ${new Date(session.startTime).toLocaleDateString()}`,
        type: 'session',
        startDate: session.startTime,
        endDate: session.endTime || new Date(),
        data: {
          session: {
            sessionId: session._id,
            startTime: session.startTime,
            endTime: session.endTime,
            duration: session.duration,
            therapyMethod: session.therapyMethod,
            emotionalStateStart: session.emotionalStateStart,
            emotionalStateEnd: session.emotionalStateEnd,
            keyTopics: this.extractKeyTopics(session),
            insights: this.extractInsights(session),
            sessionEffectivenessRating: session.sessionEffectivenessRating
          }
        }
      };

      // Tworzenie raportu
      const report = new Report(reportData);
      await report.save();

      return report;
    } catch (error) {
      console.error('Błąd podczas generowania raportu z sesji:', error);
      throw error;
    }
  }

  /**
   * Ekstrahuje kluczowe tematy z sesji
   * @param {Object} session - Sesja
   * @returns {Array<string>} - Kluczowe tematy
   * @private
   */
  extractKeyTopics(session) {
    const keyTopics = [];

    // Jeśli sesja ma podsumowanie, ekstrahuj kluczowe tematy
    if (session.summary) {
      // Przykładowa implementacja - w rzeczywistości można użyć bardziej zaawansowanych technik NLP
      const topics = session.summary.split('.')
        .filter(sentence => sentence.toLowerCase().includes('temat') || sentence.toLowerCase().includes('problem'))
        .map(sentence => sentence.trim());

      keyTopics.push(...topics);
    }

    // Jeśli sesja ma konwersację, przeanalizuj ją pod kątem kluczowych tematów
    if (session.conversation && session.conversation.length > 0) {
      // Przykładowa implementacja - w rzeczywistości można użyć bardziej zaawansowanych technik NLP
      const userMessages = session.conversation
        .filter(msg => msg.role === 'user')
        .map(msg => msg.content);

      // Prosta heurystyka - dłuższe wiadomości użytkownika mogą zawierać kluczowe tematy
      const longMessages = userMessages
        .filter(msg => msg.length > 100)
        .map(msg => msg.substring(0, 100) + '...');

      if (longMessages.length > 0) {
        keyTopics.push(...longMessages.slice(0, 3));
      }
    }

    return keyTopics.length > 0 ? keyTopics : ['Brak zidentyfikowanych kluczowych tematów'];
  }

  /**
   * Ekstrahuje wnioski z sesji
   * @param {Object} session - Sesja
   * @returns {Array<string>} - Wnioski
   * @private
   */
  extractInsights(session) {
    const insights = [];

    // Jeśli sesja ma podsumowanie, ekstrahuj wnioski
    if (session.summary) {
      // Przykładowa implementacja - w rzeczywistości można użyć bardziej zaawansowanych technik NLP
      const potentialInsights = session.summary.split('.')
        .filter(sentence =>
          sentence.toLowerCase().includes('wniosek') ||
          sentence.toLowerCase().includes('zrozumia') ||
          sentence.toLowerCase().includes('odkry') ||
          sentence.toLowerCase().includes('uświadomi')
        )
        .map(sentence => sentence.trim());

      insights.push(...potentialInsights);
    }

    // Jeśli sesja ma konwersację, przeanalizuj odpowiedzi asystenta pod kątem wniosków
    if (session.conversation && session.conversation.length > 0) {
      // Przykładowa implementacja - w rzeczywistości można użyć bardziej zaawansowanych technik NLP
      const assistantMessages = session.conversation
        .filter(msg => msg.role === 'assistant')
        .map(msg => msg.content);

      // Prosta heurystyka - szukaj zdań zawierających słowa kluczowe związane z wnioskami
      for (const msg of assistantMessages) {
        const sentences = msg.split('.');
        const insightSentences = sentences.filter(sentence =>
          sentence.toLowerCase().includes('wniosek') ||
          sentence.toLowerCase().includes('zrozumie') ||
          sentence.toLowerCase().includes('odkry') ||
          sentence.toLowerCase().includes('uświadomi')
        );

        if (insightSentences.length > 0) {
          insights.push(...insightSentences.map(s => s.trim()));
        }
      }
    }

    return insights.length > 0 ? insights : ['Brak zidentyfikowanych wniosków'];
  }

  /**
   * Generuje raport postępu
   * @param {string} profileId - ID profilu
   * @param {string} userId - ID użytkownika
   * @param {Object} options - Opcje raportu
   * @param {Date} options.startDate - Data początkowa okresu raportu
   * @param {Date} options.endDate - Data końcowa okresu raportu
   * @returns {Promise<Object>} - Wygenerowany raport
   */
  async generateProgressReport(profileId, userId, options = {}) {
    try {
      // Pobieranie profilu
      const profile = await Profile.findById(profileId);
      if (!profile) {
        throw new Error('Profil nie został znaleziony');
      }

      // Sprawdzenie, czy profil należy do użytkownika
      if (profile.user.toString() !== userId) {
        throw new Error('Nie masz dostępu do tego profilu');
      }

      // Ustawienie domyślnych dat, jeśli nie podano
      const endDate = options.endDate ? new Date(options.endDate) : new Date();
      const startDate = options.startDate ? new Date(options.startDate) : new Date(endDate.getTime() - 30 * 24 * 60 * 60 * 1000); // 30 dni wstecz

      // Pobieranie sesji z okresu
      const sessions = await Session.find({
        profile: profileId,
        startTime: { $gte: startDate, $lte: endDate }
      }).sort({ startTime: 1 });

      if (sessions.length === 0) {
        throw new Error('Brak sesji w podanym okresie');
      }

      // Obliczanie statystyk sesji
      const sessionsCount = sessions.length;
      let totalDuration = 0;
      const emotionalStateChanges = [];
      const therapyMethodsMap = new Map();
      const keyTopicsMap = new Map();

      for (const session of sessions) {
        // Obliczanie łącznego czasu trwania sesji
        totalDuration += session.duration || 0;

        // Zbieranie zmian stanu emocjonalnego
        if (session.emotionalStateStart && session.emotionalStateEnd) {
          emotionalStateChanges.push({
            date: session.startTime,
            anxiety: session.emotionalStateStart.anxiety,
            depression: session.emotionalStateStart.depression,
            optimism: session.emotionalStateStart.optimism
          });

          emotionalStateChanges.push({
            date: session.endTime || session.startTime,
            anxiety: session.emotionalStateEnd.anxiety,
            depression: session.emotionalStateEnd.depression,
            optimism: session.emotionalStateEnd.optimism
          });
        }

        // Zliczanie metod terapii
        if (session.therapyMethod) {
          const method = session.therapyMethod;
          const methodData = therapyMethodsMap.get(method) || { method, count: 0, effectiveness: 0, totalRating: 0 };
          methodData.count += 1;
          methodData.totalRating += session.sessionEffectivenessRating || 0;
          methodData.effectiveness = methodData.totalRating / methodData.count;
          therapyMethodsMap.set(method, methodData);
        }

        // Zliczanie kluczowych tematów
        const topics = this.extractKeyTopics(session);
        for (const topic of topics) {
          if (topic === 'Brak zidentyfikowanych kluczowych tematów') continue;
          const count = keyTopicsMap.get(topic) || 0;
          keyTopicsMap.set(topic, count + 1);
        }
      }

      // Przygotowanie danych o metodach terapii
      const therapyMethods = Array.from(therapyMethodsMap.values())
        .map(({ method, count, effectiveness }) => ({ method, count, effectiveness }));

      // Przygotowanie danych o częstotliwości kluczowych tematów
      const keyTopicsFrequency = Array.from(keyTopicsMap.entries())
        .map(([topic, count]) => ({ topic, count }))
        .sort((a, b) => b.count - a.count)
        .slice(0, 10); // Top 10 tematów

      // Obliczanie ogólnego postępu
      // Prosta heurystyka - porównanie pierwszego i ostatniego stanu emocjonalnego
      let overallProgress = 0;
      if (emotionalStateChanges.length >= 2) {
        const firstState = emotionalStateChanges[0];
        const lastState = emotionalStateChanges[emotionalStateChanges.length - 1];

        // Spadek poziomu lęku i depresji oraz wzrost optymizmu są pozytywne
        const anxietyChange = firstState.anxiety - lastState.anxiety;
        const depressionChange = firstState.depression - lastState.depression;
        const optimismChange = lastState.optimism - firstState.optimism;

        // Normalizacja do skali 0-10
        overallProgress = ((anxietyChange + depressionChange + optimismChange) / 3) * 10;
        overallProgress = Math.max(0, Math.min(10, overallProgress));
      }

      // Generowanie rekomendacji
      const recommendations = this.generateRecommendations(sessions, therapyMethods, keyTopicsFrequency, overallProgress);

      // Przygotowanie danych raportu
      const reportData = {
        user: userId,
        profile: profileId,
        title: `Raport postępu od ${startDate.toLocaleDateString()} do ${endDate.toLocaleDateString()}`,
        type: 'progress',
        startDate,
        endDate,
        data: {
          progress: {
            sessionsCount,
            totalDuration,
            emotionalStateChanges,
            therapyMethods,
            keyTopicsFrequency,
            overallProgress,
            recommendations
          }
        }
      };

      // Tworzenie raportu
      const report = new Report(reportData);
      await report.save();

      return report;
    } catch (error) {
      console.error('Błąd podczas generowania raportu postępu:', error);
      throw error;
    }
  }

  /**
   * Generuje rekomendacje na podstawie danych sesji
   * @param {Array<Object>} sessions - Sesje
   * @param {Array<Object>} therapyMethods - Metody terapii
   * @param {Array<Object>} keyTopicsFrequency - Częstotliwość kluczowych tematów
   * @param {number} overallProgress - Ogólny postęp
   * @returns {Array<string>} - Rekomendacje
   * @private
   */
  generateRecommendations(sessions, therapyMethods, keyTopicsFrequency, overallProgress) {
    const recommendations = [];

    // Rekomendacje na podstawie częstotliwości sesji
    const sessionsCount = sessions.length;
    const daysDiff = Math.ceil((sessions[sessionsCount - 1].startTime - sessions[0].startTime) / (1000 * 60 * 60 * 24));
    const sessionsPerWeek = (sessionsCount / daysDiff) * 7;

    if (sessionsPerWeek < 1) {
      recommendations.push('Rozważ zwiększenie częstotliwości sesji do co najmniej jednej tygodniowo dla lepszych efektów terapii.');
    } else if (sessionsPerWeek > 3) {
      recommendations.push('Utrzymujesz wysoką częstotliwość sesji. Rozważ skupienie się na jakości i pogłębianiu pracy między sesjami.');
    }

    // Rekomendacje na podstawie efektywności metod terapii
    if (therapyMethods.length > 0) {
      // Znajdź najbardziej efektywną metodę
      const mostEffectiveMethod = therapyMethods.reduce((prev, current) =>
        (prev.effectiveness > current.effectiveness) ? prev : current
      );

      if (mostEffectiveMethod.effectiveness > 7) {
        recommendations.push(`Metoda ${this.getTherapyMethodLabel(mostEffectiveMethod.method)} wydaje się być dla Ciebie najbardziej efektywna. Rozważ kontynuowanie pracy z wykorzystaniem tej metody.`);
      }

      // Znajdź najmniej efektywną metodę
      const leastEffectiveMethod = therapyMethods.reduce((prev, current) =>
        (prev.effectiveness < current.effectiveness) ? prev : current
      );

      if (leastEffectiveMethod.effectiveness < 5 && leastEffectiveMethod.count > 2) {
        recommendations.push(`Metoda ${this.getTherapyMethodLabel(leastEffectiveMethod.method)} wydaje się być dla Ciebie mniej efektywna. Rozważ wyprobowanie innych podejść terapeutycznych.`);
      }
    }

    // Rekomendacje na podstawie kluczowych tematów
    if (keyTopicsFrequency.length > 0) {
      const topTopic = keyTopicsFrequency[0];
      if (topTopic.count > 3) {
        recommendations.push(`Temat "${topTopic.topic}" pojawia się często w Twoich sesjach. Rozważ pogłębienie pracy nad tym obszarem.`);
      }
    }

    // Rekomendacje na podstawie ogólnego postępu
    if (overallProgress < 3) {
      recommendations.push('Twój ogólny postęp jest niewielki. Rozważ omówienie z terapeutą możliwości dostosowania podejścia terapeutycznego.');
    } else if (overallProgress >= 3 && overallProgress < 7) {
      recommendations.push('Widoczny jest umiarkowany postęp. Kontynuuj pracę i regularnie monitoruj swoje samopoczucie.');
    } else {
      recommendations.push('Twój postęp jest znaczący. Kontynuuj obecne podejście i praktyki, które przynoszą pozytywne efekty.');
    }

    return recommendations;
  }

  /**
   * Pobiera etykietę metody terapii
   * @param {string} method - Metoda terapii
   * @returns {string} - Etykieta metody terapii
   * @private
   */
  getTherapyMethodLabel(method) {
    switch (method) {
      case 'cognitive_behavioral':
        return 'Terapia poznawczo-behawioralna';
      case 'psychodynamic':
        return 'Terapia psychodynamiczna';
      case 'humanistic':
        return 'Terapia humanistyczna';
      case 'systemic':
        return 'Terapia systemowa';
      case 'solution_focused':
        return 'Terapia skoncentrowana na rozwiązaniach';
      default:
        return method;
    }
  }

  /**
   * Generuje raport zadań
   * @param {string} profileId - ID profilu
   * @param {string} userId - ID użytkownika
   * @param {Object} options - Opcje raportu
   * @param {Date} options.startDate - Data początkowa okresu raportu
   * @param {Date} options.endDate - Data końcowa okresu raportu
   * @returns {Promise<Object>} - Wygenerowany raport
   */
  async generateTasksReport(profileId, userId, options = {}) {
    try {
      // Pobieranie profilu
      const profile = await Profile.findById(profileId);
      if (!profile) {
        throw new Error('Profil nie został znaleziony');
      }

      // Sprawdzenie, czy profil należy do użytkownika
      if (profile.user.toString() !== userId) {
        throw new Error('Nie masz dostępu do tego profilu');
      }

      // Ustawienie domyślnych dat, jeśli nie podano
      const endDate = options.endDate ? new Date(options.endDate) : new Date();
      const startDate = options.startDate ? new Date(options.startDate) : new Date(endDate.getTime() - 30 * 24 * 60 * 60 * 1000); // 30 dni wstecz

      // Pobieranie zadań z okresu
      const tasks = await Task.find({
        profile: profileId,
        createdAt: { $gte: startDate, $lte: endDate }
      });

      if (tasks.length === 0) {
        throw new Error('Brak zadań w podanym okresie');
      }

      // Obliczanie statystyk zadań
      const totalTasks = tasks.length;
      const completedTasks = tasks.filter(task => task.status === 'completed').length;
      const incompleteTasks = tasks.filter(task => task.status === 'incomplete').length;
      const pendingTasks = tasks.filter(task => task.status === 'pending').length;
      const completionRate = totalTasks > 0 ? (completedTasks / totalTasks) * 100 : 0;

      // Obliczanie średniej oceny sukcesu
      let totalSuccessRating = 0;
      let successRatingCount = 0;
      for (const task of tasks) {
        if (task.status === 'completed' && task.completionData && task.completionData.successRating) {
          totalSuccessRating += task.completionData.successRating;
          successRatingCount++;
        }
      }
      const averageSuccessRating = successRatingCount > 0 ? totalSuccessRating / successRatingCount : 0;

      // Grupowanie zadań według kategorii
      const categoriesMap = new Map();
      for (const task of tasks) {
        const category = task.category || 'inne';
        const categoryData = categoriesMap.get(category) || { category, count: 0, completedCount: 0, completionRate: 0 };
        categoryData.count++;
        if (task.status === 'completed') {
          categoryData.completedCount++;
        }
        categoryData.completionRate = (categoryData.completedCount / categoryData.count) * 100;
        categoriesMap.set(category, categoryData);
      }
      const tasksByCategory = Array.from(categoriesMap.values());

      // Grupowanie zadań według priorytetu
      const prioritiesMap = new Map();
      for (const task of tasks) {
        const priority = task.priority || 'medium';
        const priorityData = prioritiesMap.get(priority) || { priority, count: 0, completedCount: 0, completionRate: 0 };
        priorityData.count++;
        if (task.status === 'completed') {
          priorityData.completedCount++;
        }
        priorityData.completionRate = (priorityData.completedCount / priorityData.count) * 100;
        prioritiesMap.set(priority, priorityData);
      }
      const tasksByPriority = Array.from(prioritiesMap.values());

      // Znajdowanie najbardziej wymagających zadań
      const challengingTasks = tasks
        .filter(task => task.status === 'completed' && task.completionData && task.completionData.successRating && task.completionData.successRating < 5)
        .map(task => ({
          taskId: task._id,
          description: task.description,
          challenges: task.completionData.challenges || '',
          successRating: task.completionData.successRating
        }))
        .sort((a, b) => a.successRating - b.successRating)
        .slice(0, 5); // Top 5 najbardziej wymagających zadań

      // Znajdowanie najbardziej udanych zadań
      const successfulTasks = tasks
        .filter(task => task.status === 'completed' && task.completionData && task.completionData.successRating && task.completionData.successRating > 7)
        .map(task => ({
          taskId: task._id,
          description: task.description,
          reflections: task.completionData.reflections || '',
          successRating: task.completionData.successRating
        }))
        .sort((a, b) => b.successRating - a.successRating)
        .slice(0, 5); // Top 5 najbardziej udanych zadań

      // Przygotowanie danych raportu
      const reportData = {
        user: userId,
        profile: profileId,
        title: `Raport zadań od ${startDate.toLocaleDateString()} do ${endDate.toLocaleDateString()}`,
        type: 'tasks',
        startDate,
        endDate,
        data: {
          tasks: {
            totalTasks,
            completedTasks,
            incompleteTasks,
            pendingTasks,
            completionRate,
            averageSuccessRating,
            tasksByCategory,
            tasksByPriority,
            mostChallengingTasks: challengingTasks,
            mostSuccessfulTasks: successfulTasks
          }
        }
      };

      // Tworzenie raportu
      const report = new Report(reportData);
      await report.save();

      return report;
    } catch (error) {
      console.error('Błąd podczas generowania raportu zadań:', error);
      throw error;
    }
  }
}

module.exports = new ReportService();
