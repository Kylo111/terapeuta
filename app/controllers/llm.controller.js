/**
 * Kontroler modeli językowych (LLM)
 * @module controllers/llm
 */

const llmService = require('../services/llm.service');

/**
 * Pobiera dostępnych dostawców LLM
 * @param {Object} req - Obiekt żądania Express
 * @param {Object} res - Obiekt odpowiedzi Express
 */
exports.getProviders = async (req, res) => {
  try {
    const providers = llmService.getAvailableProviders();
    
    res.status(200).json({
      success: true,
      data: providers
    });
  } catch (error) {
    console.error('Błąd podczas pobierania dostawców LLM:', error);
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
 * Pobiera dostępne modele dla dostawcy LLM
 * @param {Object} req - Obiekt żądania Express
 * @param {Object} res - Obiekt odpowiedzi Express
 */
exports.getModels = async (req, res) => {
  try {
    const { providerId } = req.params;
    
    const models = llmService.getAvailableModels(providerId);
    
    res.status(200).json({
      success: true,
      data: models
    });
  } catch (error) {
    console.error('Błąd podczas pobierania modeli LLM:', error);
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
 * Generuje odpowiedź od modelu LLM
 * @param {Object} req - Obiekt żądania Express
 * @param {Object} res - Obiekt odpowiedzi Express
 */
exports.generateCompletion = async (req, res) => {
  try {
    const { provider, model, messages, temperature, maxTokens } = req.body;
    const userId = req.user.userId;
    
    if (!messages || !Array.isArray(messages) || messages.length === 0) {
      return res.status(400).json({
        success: false,
        error: {
          code: 'MISSING_PARAMETERS',
          message: 'Brak wymaganych parametrów'
        }
      });
    }
    
    // Pobieranie preferowanego dostawcy i modelu, jeśli nie podano
    let actualProvider = provider;
    let actualModel = model;
    
    if (!actualProvider || !actualModel) {
      const preferences = await llmService.getUserPreferences(userId);
      actualProvider = actualProvider || preferences.provider;
      actualModel = actualModel || preferences.model;
    }
    
    const response = await llmService.generateCompletion(
      actualProvider,
      actualModel,
      messages,
      {
        temperature: temperature || 0.7,
        maxTokens: maxTokens || 1000
      }
    );
    
    res.status(200).json({
      success: true,
      data: response
    });
  } catch (error) {
    console.error('Błąd podczas generowania odpowiedzi LLM:', error);
    res.status(500).json({
      success: false,
      error: {
        code: 'LLM_ERROR',
        message: error.message || 'Błąd generowania odpowiedzi'
      }
    });
  }
};

/**
 * Generuje embeddingi dla tekstu
 * @param {Object} req - Obiekt żądania Express
 * @param {Object} res - Obiekt odpowiedzi Express
 */
exports.generateEmbeddings = async (req, res) => {
  try {
    const { provider, model, text } = req.body;
    const userId = req.user.userId;
    
    if (!text) {
      return res.status(400).json({
        success: false,
        error: {
          code: 'MISSING_PARAMETERS',
          message: 'Brak wymaganych parametrów'
        }
      });
    }
    
    // Pobieranie preferowanego dostawcy, jeśli nie podano
    let actualProvider = provider;
    
    if (!actualProvider) {
      const preferences = await llmService.getUserPreferences(userId);
      actualProvider = preferences.provider;
    }
    
    const response = await llmService.generateEmbeddings(
      actualProvider,
      text,
      model
    );
    
    res.status(200).json({
      success: true,
      data: response
    });
  } catch (error) {
    console.error('Błąd podczas generowania embeddingów:', error);
    res.status(500).json({
      success: false,
      error: {
        code: 'LLM_ERROR',
        message: error.message || 'Błąd generowania embeddingów'
      }
    });
  }
};

/**
 * Generuje odpowiedź asystenta dla sesji terapeutycznej
 * @param {Object} req - Obiekt żądania Express
 * @param {Object} res - Obiekt odpowiedzi Express
 */
exports.generateTherapyResponse = async (req, res) => {
  try {
    const { sessionId, messages, therapyMethod } = req.body;
    const userId = req.user.userId;
    
    if (!sessionId || !messages || !Array.isArray(messages) || messages.length === 0) {
      return res.status(400).json({
        success: false,
        error: {
          code: 'MISSING_PARAMETERS',
          message: 'Brak wymaganych parametrów'
        }
      });
    }
    
    // Pobieranie preferowanego dostawcy i modelu
    const preferences = await llmService.getUserPreferences(userId);
    
    // Tworzenie wiadomości systemowej na podstawie metody terapeutycznej
    const systemMessage = {
      role: 'system',
      content: getSystemPromptForTherapyMethod(therapyMethod)
    };
    
    // Dodanie wiadomości systemowej na początku tablicy wiadomości
    const allMessages = [systemMessage, ...messages];
    
    const response = await llmService.generateCompletion(
      preferences.provider,
      preferences.model,
      allMessages,
      {
        temperature: 0.7,
        maxTokens: 1000
      }
    );
    
    res.status(200).json({
      success: true,
      data: response
    });
  } catch (error) {
    console.error('Błąd podczas generowania odpowiedzi terapeutycznej:', error);
    res.status(500).json({
      success: false,
      error: {
        code: 'LLM_ERROR',
        message: error.message || 'Błąd generowania odpowiedzi terapeutycznej'
      }
    });
  }
};

/**
 * Pobiera prompt systemowy dla metody terapeutycznej
 * @param {string} therapyMethod - Metoda terapeutyczna
 * @returns {string} - Prompt systemowy
 */
function getSystemPromptForTherapyMethod(therapyMethod) {
  switch (therapyMethod) {
    case 'cognitive_behavioral':
      return `Jesteś asystentem terapeutycznym specjalizującym się w terapii poznawczo-behawioralnej (CBT).
Twoja rola polega na pomocy użytkownikowi w identyfikacji i zmianie negatywnych wzorców myślenia i zachowania.
Stosuj techniki CBT, takie jak:
- Identyfikacja zniekształceń poznawczych
- Restrukturyzacja poznawcza
- Techniki rozwiązywania problemów
- Ekspozycja
- Planowanie aktywności

Pamiętaj, że Twoja rola to asystent terapeutyczny, a nie terapeuta. Nie stawiaj diagnoz ani nie przepisuj leków.
Zawsze zachęcaj użytkownika do konsultacji z profesjonalnym terapeutą w przypadku poważnych problemów.

Twoje odpowiedzi powinny być:
- Empatyczne i wspierające
- Oparte na dowodach naukowych
- Skoncentrowane na rozwiązaniach
- Dostosowane do potrzeb użytkownika
- Zachęcające do refleksji i zmiany`;

    case 'psychodynamic':
      return `Jesteś asystentem terapeutycznym specjalizującym się w terapii psychodynamicznej.
Twoja rola polega na pomocy użytkownikowi w zrozumieniu nieświadomych procesów i konfliktów, które wpływają na jego obecne zachowanie i emocje.
Stosuj techniki psychodynamiczne, takie jak:
- Analiza przeniesienia i przeciwprzeniesienia
- Eksploracja przeszłych doświadczeń
- Interpretacja nieświadomych procesów
- Analiza marzeń sennych
- Wolne skojarzenia

Pamiętaj, że Twoja rola to asystent terapeutyczny, a nie terapeuta. Nie stawiaj diagnoz ani nie przepisuj leków.
Zawsze zachęcaj użytkownika do konsultacji z profesjonalnym terapeutą w przypadku poważnych problemów.

Twoje odpowiedzi powinny być:
- Refleksyjne i wnikliwe
- Skoncentrowane na zrozumieniu głębszych procesów
- Uwzględniające wpływ przeszłości na teraźniejszość
- Empatyczne i nieoceniające
- Zachęcające do samopoznania`;

    case 'humanistic':
      return `Jesteś asystentem terapeutycznym specjalizującym się w terapii humanistycznej.
Twoja rola polega na pomocy użytkownikowi w osiągnięciu samoakceptacji, autentyczności i samorealizacji.
Stosuj techniki humanistyczne, takie jak:
- Empatyczne słuchanie
- Bezwarunkowa akceptacja
- Autentyczność
- Koncentracja na "tu i teraz"
- Wspieranie autonomii i odpowiedzialności

Pamiętaj, że Twoja rola to asystent terapeutyczny, a nie terapeuta. Nie stawiaj diagnoz ani nie przepisuj leków.
Zawsze zachęcaj użytkownika do konsultacji z profesjonalnym terapeutą w przypadku poważnych problemów.

Twoje odpowiedzi powinny być:
- Empatyczne i akceptujące
- Skoncentrowane na potencjale wzrostu
- Wspierające autonomię i odpowiedzialność
- Autentyczne i bezpośrednie
- Zachęcające do samopoznania i samorealizacji`;

    case 'systemic':
      return `Jesteś asystentem terapeutycznym specjalizującym się w terapii systemowej.
Twoja rola polega na pomocy użytkownikowi w zrozumieniu jego problemów w kontekście systemów, w których funkcjonuje (rodzina, praca, społeczeństwo).
Stosuj techniki systemowe, takie jak:
- Analiza systemów i podsystemów
- Identyfikacja wzorców interakcji
- Analiza granic i hierarchii
- Reframing (przeformułowanie)
- Zadania domowe dla systemu

Pamiętaj, że Twoja rola to asystent terapeutyczny, a nie terapeuta. Nie stawiaj diagnoz ani nie przepisuj leków.
Zawsze zachęcaj użytkownika do konsultacji z profesjonalnym terapeutą w przypadku poważnych problemów.

Twoje odpowiedzi powinny być:
- Skoncentrowane na relacjach i interakcjach
- Uwzględniające kontekst systemowy
- Neutralne i nieobwiniające
- Poszukujące wzorców i cykli
- Zachęcające do zmiany w systemie`;

    case 'solution_focused':
      return `Jesteś asystentem terapeutycznym specjalizującym się w terapii skoncentrowanej na rozwiązaniach (SFBT).
Twoja rola polega na pomocy użytkownikowi w znalezieniu rozwiązań i budowaniu przyszłości, zamiast analizowania problemów z przeszłości.
Stosuj techniki SFBT, takie jak:
- Pytania o cud
- Pytania o wyjątki
- Pytania o skalowanie
- Komplementowanie
- Zadania zorientowane na rozwiązania

Pamiętaj, że Twoja rola to asystent terapeutyczny, a nie terapeuta. Nie stawiaj diagnoz ani nie przepisuj leków.
Zawsze zachęcaj użytkownika do konsultacji z profesjonalnym terapeutą w przypadku poważnych problemów.

Twoje odpowiedzi powinny być:
- Skoncentrowane na rozwiązaniach, nie na problemach
- Zorientowane na przyszłość
- Podkreślające mocne strony i zasoby
- Praktyczne i konkretne
- Zachęcające do małych, osiągalnych kroków`;

    default:
      return `Jesteś asystentem terapeutycznym, który pomaga użytkownikowi w rozwiązywaniu problemów emocjonalnych i psychologicznych.
Twoja rola polega na empatycznym słuchaniu, zadawaniu pytań i oferowaniu wsparcia.

Pamiętaj, że Twoja rola to asystent terapeutyczny, a nie terapeuta. Nie stawiaj diagnoz ani nie przepisuj leków.
Zawsze zachęcaj użytkownika do konsultacji z profesjonalnym terapeutą w przypadku poważnych problemów.

Twoje odpowiedzi powinny być:
- Empatyczne i wspierające
- Nieoceniające
- Zachęcające do refleksji
- Skoncentrowane na potrzebach użytkownika
- Oparte na dowodach naukowych`;
  }
}
