/**
 * Serwis analizy sentymentu
 * @module services/sentiment
 */

const Session = require('../data/models/session');
const Task = require('../data/models/task');
const Profile = require('../data/models/profile');
const Report = require('../data/models/report');
const { Configuration, OpenAIApi } = require('openai');

/**
 * Klasa serwisu analizy sentymentu
 */
class SentimentService {
  constructor() {
    // Inicjalizacja klienta OpenAI, jeśli dostępny klucz API
    if (process.env.OPENAI_API_KEY) {
      const configuration = new Configuration({
        apiKey: process.env.OPENAI_API_KEY,
      });
      this.openai = new OpenAIApi(configuration);
    }
  }

  /**
   * Analizuje sentyment tekstu za pomocą prostego algorytmu
   * @param {string} text - Tekst do analizy
   * @returns {number} - Wartość sentymentu w zakresie od -1 (negatywny) do 1 (pozytywny)
   */
  analyzeTextSimple(text) {
    if (!text) return 0;

    // Lista pozytywnych słów
    const positiveWords = [
      'dobry', 'świetny', 'wspaniały', 'doskonały', 'fantastyczny', 'cudowny', 'niesamowity',
      'zadowolony', 'szczęśliwy', 'radosny', 'wesoły', 'pozytywny', 'optymistyczny',
      'nadzieja', 'sukces', 'osiągnięcie', 'postęp', 'poprawa', 'lepiej', 'pomoc',
      'wsparcie', 'zaufanie', 'spokój', 'relaks', 'komfort', 'bezpieczeństwo',
      'wdzięczny', 'doceniam', 'dziękuję', 'kocham', 'lubię', 'podoba', 'cieszę'
    ];

    // Lista negatywnych słów
    const negativeWords = [
      'zły', 'okropny', 'straszny', 'fatalny', 'beznadziejny', 'koszmarny', 'tragiczny',
      'smutny', 'przygnębiony', 'zdenerwowany', 'zaniepokojony', 'zmartwiony', 'negatywny',
      'pesymistyczny', 'rozpacz', 'porażka', 'niepowodzenie', 'regres', 'pogorszenie', 'gorzej',
      'problem', 'trudność', 'przeszkoda', 'stres', 'napięcie', 'dyskomfort', 'zagrożenie',
      'nienawidzę', 'nie lubię', 'irytuje', 'denerwuje', 'złości', 'boli', 'cierpię'
    ];

    // Normalizacja tekstu
    const normalizedText = text.toLowerCase();
    
    // Liczenie wystąpień pozytywnych i negatywnych słów
    let positiveCount = 0;
    let negativeCount = 0;
    
    for (const word of positiveWords) {
      const regex = new RegExp(`\\b${word}\\b`, 'gi');
      const matches = normalizedText.match(regex);
      if (matches) {
        positiveCount += matches.length;
      }
    }
    
    for (const word of negativeWords) {
      const regex = new RegExp(`\\b${word}\\b`, 'gi');
      const matches = normalizedText.match(regex);
      if (matches) {
        negativeCount += matches.length;
      }
    }
    
    // Obliczanie wartości sentymentu
    const totalWords = text.split(/\s+/).length;
    if (totalWords === 0) return 0;
    
    const positiveScore = positiveCount / totalWords;
    const negativeScore = negativeCount / totalWords;
    
    // Wartość sentymentu w zakresie od -1 do 1
    return positiveScore - negativeScore;
  }

  /**
   * Analizuje sentyment tekstu za pomocą OpenAI
   * @param {string} text - Tekst do analizy
   * @returns {Promise<number>} - Wartość sentymentu w zakresie od -1 (negatywny) do 1 (pozytywny)
   */
  async analyzeTextWithOpenAI(text) {
    if (!text || !this.openai) {
      // Jeśli brak tekstu lub klienta OpenAI, użyj prostego algorytmu
      return this.analyzeTextSimple(text);
    }

    try {
      const prompt = `
        Przeanalizuj poniższy tekst pod kątem sentymentu i oceń go w skali od -1 (bardzo negatywny) do 1 (bardzo pozytywny), gdzie 0 oznacza neutralny.
        Zwróć tylko liczbę, bez dodatkowych wyjaśnień.
        
        Tekst do analizy:
        "${text.substring(0, 1000)}" // Ograniczenie długości tekstu
      `;

      const response = await this.openai.createCompletion({
        model: process.env.OPENAI_MODEL || 'gpt-3.5-turbo-instruct',
        prompt,
        max_tokens: 10,
        temperature: 0.3,
      });

      const result = response.data.choices[0].text.trim();
      const sentiment = parseFloat(result);

      // Sprawdzenie, czy wynik jest liczbą w zakresie od -1 do 1
      if (!isNaN(sentiment) && sentiment >= -1 && sentiment <= 1) {
        return sentiment;
      } else {
        console.warn('Nieprawidłowy wynik analizy sentymentu z OpenAI:', result);
        return this.analyzeTextSimple(text);
      }
    } catch (error) {
      console.error('Błąd podczas analizy sentymentu z OpenAI:', error);
      return this.analyzeTextSimple(text);
    }
  }

  /**
   * Analizuje sentyment sesji
   * @param {string} sessionId - ID sesji
   * @returns {Promise<number>} - Wartość sentymentu w zakresie od -1 (negatywny) do 1 (pozytywny)
   */
  async analyzeSession(sessionId) {
    try {
      const session = await Session.findById(sessionId);
      if (!session) {
        throw new Error('Sesja nie została znaleziona');
      }

      // Zbieranie tekstu z konwersacji
      let text = '';
      if (session.conversation && session.conversation.length > 0) {
        // Zbieranie tylko wiadomości użytkownika
        const userMessages = session.conversation
          .filter(msg => msg.role === 'user')
          .map(msg => msg.content);
        
        text = userMessages.join(' ');
      }

      // Dodanie podsumowania sesji, jeśli dostępne
      if (session.summary) {
        text += ' ' + session.summary;
      }

      // Analiza sentymentu
      return await this.analyzeTextWithOpenAI(text);
    } catch (error) {
      console.error('Błąd podczas analizy sentymentu sesji:', error);
      throw error;
    }
  }

  /**
   * Analizuje sentyment zadania
   * @param {string} taskId - ID zadania
   * @returns {Promise<number>} - Wartość sentymentu w zakresie od -1 (negatywny) do 1 (pozytywny)
   */
  async analyzeTask(taskId) {
    try {
      const task = await Task.findById(taskId);
      if (!task) {
        throw new Error('Zadanie nie zostało znalezione');
      }

      // Zbieranie tekstu z zadania
      let text = task.description || '';

      // Dodanie refleksji, jeśli dostępne
      if (task.completionData && task.completionData.reflections) {
        text += ' ' + task.completionData.reflections;
      }

      // Dodanie wyzwań, jeśli dostępne
      if (task.completionData && task.completionData.challenges) {
        text += ' ' + task.completionData.challenges;
      }

      // Analiza sentymentu
      return await this.analyzeTextWithOpenAI(text);
    } catch (error) {
      console.error('Błąd podczas analizy sentymentu zadania:', error);
      throw error;
    }
  }

  /**
   * Generuje raport analizy sentymentu dla profilu
   * @param {string} profileId - ID profilu
   * @param {string} userId - ID użytkownika
   * @param {Object} options - Opcje raportu
   * @param {Date} options.startDate - Data początkowa okresu raportu
   * @param {Date} options.endDate - Data końcowa okresu raportu
   * @returns {Promise<Object>} - Wygenerowany raport
   */
  async generateSentimentReport(profileId, userId, options = {}) {
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

      // Pobieranie zadań z okresu
      const tasks = await Task.find({
        profile: profileId,
        createdAt: { $gte: startDate, $lte: endDate }
      }).sort({ createdAt: 1 });

      // Analiza sentymentu sesji
      const sessionSentiments = [];
      for (const session of sessions) {
        const sentiment = await this.analyzeSession(session._id);
        sessionSentiments.push({
          date: session.startTime,
          sentiment,
          source: 'Sesja'
        });
      }

      // Analiza sentymentu zadań
      const taskSentiments = [];
      for (const task of tasks) {
        if (task.status === 'completed' && task.completionData) {
          const sentiment = await this.analyzeTask(task._id);
          taskSentiments.push({
            date: task.completionData.completedAt || task.updatedAt,
            sentiment,
            source: 'Zadanie'
          });
        }
      }

      // Łączenie wyników
      const allSentiments = [...sessionSentiments, ...taskSentiments].sort((a, b) => 
        new Date(a.date).getTime() - new Date(b.date).getTime()
      );

      // Obliczanie średniego sentymentu
      const totalSentiment = allSentiments.reduce((sum, item) => sum + item.sentiment, 0);
      const averageSentiment = allSentiments.length > 0 ? totalSentiment / allSentiments.length : 0;

      // Analiza słów
      const wordAnalysis = this.analyzeWords(sessions, tasks);

      // Przygotowanie danych raportu
      const reportData = {
        user: userId,
        profile: profileId,
        title: `Raport analizy sentymentu od ${startDate.toLocaleDateString()} do ${endDate.toLocaleDateString()}`,
        type: 'emotional',
        startDate,
        endDate,
        data: {
          emotional: {
            moodChanges: allSentiments.map(item => ({
              date: item.date,
              mood: (item.sentiment + 1) * 5, // Konwersja z zakresu -1..1 do 0..10
              notes: item.source
            })),
            sentimentAnalysis: {
              overallSentiment: averageSentiment,
              positiveWords: wordAnalysis.positiveWords,
              negativeWords: wordAnalysis.negativeWords
            }
          }
        }
      };

      // Tworzenie raportu
      const report = new Report(reportData);
      await report.save();

      return report;
    } catch (error) {
      console.error('Błąd podczas generowania raportu analizy sentymentu:', error);
      throw error;
    }
  }

  /**
   * Analizuje słowa z sesji i zadań
   * @param {Array<Object>} sessions - Sesje
   * @param {Array<Object>} tasks - Zadania
   * @returns {Object} - Wyniki analizy słów
   * @private
   */
  analyzeWords(sessions, tasks) {
    // Lista pozytywnych słów
    const positiveWords = [
      'dobry', 'świetny', 'wspaniały', 'doskonały', 'fantastyczny', 'cudowny', 'niesamowity',
      'zadowolony', 'szczęśliwy', 'radosny', 'wesoły', 'pozytywny', 'optymistyczny',
      'nadzieja', 'sukces', 'osiągnięcie', 'postęp', 'poprawa', 'lepiej', 'pomoc',
      'wsparcie', 'zaufanie', 'spokój', 'relaks', 'komfort', 'bezpieczeństwo',
      'wdzięczny', 'doceniam', 'dziękuję', 'kocham', 'lubię', 'podoba', 'cieszę'
    ];

    // Lista negatywnych słów
    const negativeWords = [
      'zły', 'okropny', 'straszny', 'fatalny', 'beznadziejny', 'koszmarny', 'tragiczny',
      'smutny', 'przygnębiony', 'zdenerwowany', 'zaniepokojony', 'zmartwiony', 'negatywny',
      'pesymistyczny', 'rozpacz', 'porażka', 'niepowodzenie', 'regres', 'pogorszenie', 'gorzej',
      'problem', 'trudność', 'przeszkoda', 'stres', 'napięcie', 'dyskomfort', 'zagrożenie',
      'nienawidzę', 'nie lubię', 'irytuje', 'denerwuje', 'złości', 'boli', 'cierpię'
    ];

    // Zbieranie tekstu z sesji
    let allText = '';
    for (const session of sessions) {
      if (session.conversation && session.conversation.length > 0) {
        const userMessages = session.conversation
          .filter(msg => msg.role === 'user')
          .map(msg => msg.content);
        
        allText += ' ' + userMessages.join(' ');
      }

      if (session.summary) {
        allText += ' ' + session.summary;
      }
    }

    // Zbieranie tekstu z zadań
    for (const task of tasks) {
      if (task.description) {
        allText += ' ' + task.description;
      }

      if (task.completionData) {
        if (task.completionData.reflections) {
          allText += ' ' + task.completionData.reflections;
        }
        if (task.completionData.challenges) {
          allText += ' ' + task.completionData.challenges;
        }
      }
    }

    // Normalizacja tekstu
    const normalizedText = allText.toLowerCase();
    
    // Liczenie wystąpień pozytywnych słów
    const positiveWordCounts = {};
    for (const word of positiveWords) {
      const regex = new RegExp(`\\b${word}\\b`, 'gi');
      const matches = normalizedText.match(regex);
      if (matches && matches.length > 0) {
        positiveWordCounts[word] = matches.length;
      }
    }

    // Liczenie wystąpień negatywnych słów
    const negativeWordCounts = {};
    for (const word of negativeWords) {
      const regex = new RegExp(`\\b${word}\\b`, 'gi');
      const matches = normalizedText.match(regex);
      if (matches && matches.length > 0) {
        negativeWordCounts[word] = matches.length;
      }
    }

    // Sortowanie słów według liczby wystąpień
    const sortedPositiveWords = Object.entries(positiveWordCounts)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 10)
      .map(([word, count]) => ({ word, count }));

    const sortedNegativeWords = Object.entries(negativeWordCounts)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 10)
      .map(([word, count]) => ({ word, count }));

    return {
      positiveWords: sortedPositiveWords,
      negativeWords: sortedNegativeWords
    };
  }
}

module.exports = new SentimentService();
