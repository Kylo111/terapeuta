/**
 * Moduł zarządzania przechowywaniem sesji
 */

const Session = require('../models/session');
const Profile = require('../models/profile');
const fs = require('fs').promises;
const path = require('path');

/**
 * Klasa zarządzająca przechowywaniem sesji
 */
class SessionStorage {
  /**
   * Zapisuje sesję w bazie danych
   * @param {Object} sessionData - Dane sesji
   * @returns {Promise<Object>} - Zapisana sesja
   */
  async saveSession(sessionData) {
    try {
      const session = new Session(sessionData);
      await session.save();
      
      // Aktualizacja profilu
      await Profile.findByIdAndUpdate(
        sessionData.profile,
        { $push: { sessions: session._id } }
      );
      
      return session;
    } catch (error) {
      console.error('Error saving session:', error);
      throw error;
    }
  }

  /**
   * Pobiera sesję z bazy danych
   * @param {string} sessionId - ID sesji
   * @returns {Promise<Object>} - Pobrana sesja
   */
  async getSession(sessionId) {
    try {
      return await Session.findById(sessionId)
        .populate('profile')
        .populate('tasks');
    } catch (error) {
      console.error('Error getting session:', error);
      throw error;
    }
  }

  /**
   * Pobiera wszystkie sesje dla danego profilu
   * @param {string} profileId - ID profilu
   * @returns {Promise<Array>} - Lista sesji
   */
  async getSessionsByProfile(profileId) {
    try {
      return await Session.find({ profile: profileId })
        .sort({ startTime: -1 });
    } catch (error) {
      console.error('Error getting sessions by profile:', error);
      throw error;
    }
  }

  /**
   * Aktualizuje sesję w bazie danych
   * @param {string} sessionId - ID sesji
   * @param {Object} updateData - Dane do aktualizacji
   * @returns {Promise<Object>} - Zaktualizowana sesja
   */
  async updateSession(sessionId, updateData) {
    try {
      return await Session.findByIdAndUpdate(
        sessionId,
        updateData,
        { new: true, runValidators: true }
      );
    } catch (error) {
      console.error('Error updating session:', error);
      throw error;
    }
  }

  /**
   * Dodaje wiadomość do sesji
   * @param {string} sessionId - ID sesji
   * @param {string} role - Rola (system, assistant, user)
   * @param {string} content - Treść wiadomości
   * @returns {Promise<Object>} - Zaktualizowana sesja
   */
  async addMessageToSession(sessionId, role, content) {
    try {
      const session = await Session.findById(sessionId);
      if (!session) {
        throw new Error('Session not found');
      }
      
      session.conversation.push({
        role,
        content,
        timestamp: new Date()
      });
      
      return await session.save();
    } catch (error) {
      console.error('Error adding message to session:', error);
      throw error;
    }
  }

  /**
   * Kończy sesję i generuje podsumowanie
   * @param {string} sessionId - ID sesji
   * @param {Object} summary - Podsumowanie sesji
   * @param {Object} metrics - Metryki końcowe sesji
   * @returns {Promise<Object>} - Zakończona sesja
   */
  async endSession(sessionId, summary, metrics) {
    try {
      const session = await Session.findById(sessionId);
      if (!session) {
        throw new Error('Session not found');
      }
      
      session.endTime = new Date();
      session.isCompleted = true;
      
      if (summary) {
        session.summary = summary;
      }
      
      if (metrics) {
        session.metrics.emotionalStateEnd = metrics.emotionalState;
        session.metrics.sessionEffectivenessRating = metrics.effectivenessRating;
      }
      
      // Zapisanie sesji do pliku JSON
      await this.exportSessionToFile(session);
      
      return await session.save();
    } catch (error) {
      console.error('Error ending session:', error);
      throw error;
    }
  }

  /**
   * Eksportuje sesję do pliku JSON
   * @param {Object} session - Sesja do eksportu
   * @returns {Promise<void>}
   */
  async exportSessionToFile(session) {
    try {
      const sessionData = session.toObject();
      const exportDir = path.join(process.cwd(), 'data', 'exports', 'sessions');
      
      // Utworzenie katalogu, jeśli nie istnieje
      await fs.mkdir(exportDir, { recursive: true });
      
      const fileName = `session_${session._id}_${new Date().toISOString().replace(/:/g, '-')}.json`;
      const filePath = path.join(exportDir, fileName);
      
      await fs.writeFile(filePath, JSON.stringify(sessionData, null, 2));
      
      return filePath;
    } catch (error) {
      console.error('Error exporting session to file:', error);
      // Nie rzucamy błędu, aby nie przerwać głównej operacji
      return null;
    }
  }

  /**
   * Importuje sesję z pliku JSON
   * @param {string} filePath - Ścieżka do pliku
   * @returns {Promise<Object>} - Zaimportowana sesja
   */
  async importSessionFromFile(filePath) {
    try {
      const fileContent = await fs.readFile(filePath, 'utf8');
      const sessionData = JSON.parse(fileContent);
      
      // Usunięcie pól, które mogą powodować konflikty
      delete sessionData._id;
      delete sessionData.__v;
      delete sessionData.createdAt;
      delete sessionData.updatedAt;
      
      return await this.saveSession(sessionData);
    } catch (error) {
      console.error('Error importing session from file:', error);
      throw error;
    }
  }
}

module.exports = new SessionStorage();
