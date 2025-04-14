/**
 * Model powiadomienia
 * @module models/notification
 */

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

/**
 * Schema powiadomienia
 */
const notificationSchema = new Schema({
  /**
   * Użytkownik, do którego należy powiadomienie
   */
  user: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },

  /**
   * Tytuł powiadomienia
   */
  title: {
    type: String,
    required: true
  },

  /**
   * Treść powiadomienia
   */
  message: {
    type: String,
    required: true
  },

  /**
   * Typ powiadomienia
   * - session: powiadomienie o sesji
   * - task: powiadomienie o zadaniu
   * - reminder: przypomnienie
   * - system: powiadomienie systemowe
   * - other: inne
   */
  type: {
    type: String,
    enum: ['session', 'task', 'reminder', 'system', 'other'],
    default: 'other'
  },

  /**
   * Priorytet powiadomienia
   * - low: niski
   * - medium: średni
   * - high: wysoki
   */
  priority: {
    type: String,
    enum: ['low', 'medium', 'high'],
    default: 'medium'
  },

  /**
   * Czy powiadomienie zostało przeczytane
   */
  isRead: {
    type: Boolean,
    default: false
  },

  /**
   * Czy powiadomienie zostało wysłane
   */
  isSent: {
    type: Boolean,
    default: false
  },

  /**
   * Data i czas wysłania powiadomienia
   */
  sentAt: {
    type: Date
  },

  /**
   * Data i czas przeczytania powiadomienia
   */
  readAt: {
    type: Date
  },

  /**
   * Data i czas zaplanowanego wysłania powiadomienia
   */
  scheduledFor: {
    type: Date
  },

  /**
   * Akcja powiadomienia (np. URL do przekierowania)
   */
  action: {
    type: String
  },

  /**
   * Powiązany obiekt (np. ID sesji, zadania)
   */
  relatedId: {
    type: Schema.Types.ObjectId
  },

  /**
   * Typ powiązanego obiektu
   */
  relatedType: {
    type: String,
    enum: ['session', 'task', 'profile', 'exercise', 'journal', 'other']
  },

  /**
   * Kanały dostarczenia powiadomienia
   * - app: powiadomienie w aplikacji
   * - email: powiadomienie e-mail
   * - push: powiadomienie push
   */
  channels: {
    app: {
      type: Boolean,
      default: true
    },
    email: {
      type: Boolean,
      default: false
    },
    push: {
      type: Boolean,
      default: false
    }
  },

  /**
   * Metadane powiadomienia (dodatkowe informacje)
   */
  metadata: {
    type: Schema.Types.Mixed
  }
}, {
  timestamps: true
});

/**
 * Indeksy dla szybszego wyszukiwania
 */
notificationSchema.index({ user: 1, isRead: 1 });
notificationSchema.index({ user: 1, scheduledFor: 1 });
notificationSchema.index({ user: 1, type: 1 });

/**
 * Model powiadomienia
 */
const Notification = mongoose.model('Notification', notificationSchema);

module.exports = Notification;
