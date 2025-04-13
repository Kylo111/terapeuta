/**
 * Moduł zarządzania przechowywaniem profili
 */

const Profile = require('../models/profile');
const User = require('../models/user');

/**
 * Klasa zarządzająca przechowywaniem profili
 */
class ProfileStorage {
  /**
   * Tworzy nowy profil
   * @param {string} userId - ID użytkownika
   * @param {Object} profileData - Dane profilu
   * @returns {Promise<Object>} - Utworzony profil
   */
  async createProfile(userId, profileData) {
    try {
      const user = await User.findById(userId);
      if (!user) {
        throw new Error('User not found');
      }
      
      const profile = new Profile({
        user: userId,
        ...profileData
      });
      
      await profile.save();
      
      // Aktualizacja użytkownika
      user.profiles.push(profile._id);
      await user.save();
      
      return profile;
    } catch (error) {
      console.error('Error creating profile:', error);
      throw error;
    }
  }

  /**
   * Pobiera profil
   * @param {string} profileId - ID profilu
   * @returns {Promise<Object>} - Pobrany profil
   */
  async getProfile(profileId) {
    try {
      return await Profile.findById(profileId)
        .populate('user', 'email firstName lastName')
        .populate('sessions')
        .populate('tasks');
    } catch (error) {
      console.error('Error getting profile:', error);
      throw error;
    }
  }

  /**
   * Pobiera wszystkie profile użytkownika
   * @param {string} userId - ID użytkownika
   * @returns {Promise<Array>} - Lista profili
   */
  async getProfilesByUser(userId) {
    try {
      return await Profile.find({ user: userId })
        .sort({ createdAt: -1 });
    } catch (error) {
      console.error('Error getting profiles by user:', error);
      throw error;
    }
  }

  /**
   * Aktualizuje profil
   * @param {string} profileId - ID profilu
   * @param {Object} updateData - Dane do aktualizacji
   * @returns {Promise<Object>} - Zaktualizowany profil
   */
  async updateProfile(profileId, updateData) {
    try {
      return await Profile.findByIdAndUpdate(
        profileId,
        updateData,
        { new: true, runValidators: true }
      );
    } catch (error) {
      console.error('Error updating profile:', error);
      throw error;
    }
  }

  /**
   * Usuwa profil
   * @param {string} profileId - ID profilu
   * @returns {Promise<boolean>} - Czy operacja się powiodła
   */
  async deleteProfile(profileId) {
    try {
      const profile = await Profile.findById(profileId);
      if (!profile) {
        throw new Error('Profile not found');
      }
      
      // Aktualizacja użytkownika
      await User.findByIdAndUpdate(
        profile.user,
        { $pull: { profiles: profileId } }
      );
      
      // Usunięcie profilu
      await Profile.findByIdAndDelete(profileId);
      
      return true;
    } catch (error) {
      console.error('Error deleting profile:', error);
      throw error;
    }
  }

  /**
   * Aktualizuje stan emocjonalny profilu
   * @param {string} profileId - ID profilu
   * @param {number} anxiety - Poziom lęku (0-10)
   * @param {number} depression - Poziom depresji (0-10)
   * @param {number} optimism - Poziom optymizmu (0-10)
   * @returns {Promise<Object>} - Zaktualizowany profil
   */
  async updateEmotionalState(profileId, anxiety, depression, optimism) {
    try {
      const profile = await Profile.findById(profileId);
      if (!profile) {
        throw new Error('Profile not found');
      }
      
      profile.emotionalState = {
        anxiety,
        depression,
        optimism,
        lastUpdated: new Date()
      };
      
      return await profile.save();
    } catch (error) {
      console.error('Error updating emotional state:', error);
      throw error;
    }
  }

  /**
   * Dodaje nowy cel do profilu
   * @param {string} profileId - ID profilu
   * @param {string} description - Opis celu
   * @param {string} priority - Priorytet (low, medium, high)
   * @returns {Promise<Object>} - Zaktualizowany profil
   */
  async addGoal(profileId, description, priority = 'medium') {
    try {
      const profile = await Profile.findById(profileId);
      if (!profile) {
        throw new Error('Profile not found');
      }
      
      profile.goals.push({
        description,
        priority,
        status: 'active',
        createdAt: new Date()
      });
      
      return await profile.save();
    } catch (error) {
      console.error('Error adding goal:', error);
      throw error;
    }
  }

  /**
   * Oznacza cel jako ukończony
   * @param {string} profileId - ID profilu
   * @param {string} goalId - ID celu
   * @returns {Promise<Object>} - Zaktualizowany profil
   */
  async completeGoal(profileId, goalId) {
    try {
      const profile = await Profile.findById(profileId);
      if (!profile) {
        throw new Error('Profile not found');
      }
      
      const goal = profile.goals.id(goalId);
      if (!goal) {
        throw new Error('Goal not found');
      }
      
      goal.status = 'completed';
      goal.completedAt = new Date();
      
      return await profile.save();
    } catch (error) {
      console.error('Error completing goal:', error);
      throw error;
    }
  }

  /**
   * Aktualizuje postęp terapii
   * @param {string} profileId - ID profilu
   * @param {Object} progressData - Dane postępu
   * @returns {Promise<Object>} - Zaktualizowany profil
   */
  async updateTherapyProgress(profileId, progressData) {
    try {
      return await Profile.findByIdAndUpdate(
        profileId,
        { therapyProgress: progressData },
        { new: true, runValidators: true }
      );
    } catch (error) {
      console.error('Error updating therapy progress:', error);
      throw error;
    }
  }
}

module.exports = new ProfileStorage();
