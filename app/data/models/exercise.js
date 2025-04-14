/**
 * Model ćwiczenia terapeutycznego
 * @module models/exercise
 */

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

/**
 * Schema ćwiczenia terapeutycznego
 */
const exerciseSchema = new Schema({
  /**
   * Użytkownik, do którego należy ćwiczenie
   */
  user: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },

  /**
   * Nazwa ćwiczenia
   */
  name: {
    type: String,
    required: true
  },

  /**
   * Opis ćwiczenia
   */
  description: {
    type: String,
    required: true
  },

  /**
   * Kategoria ćwiczenia
   * - mindfulness: ćwiczenia uważności
   * - relaxation: techniki relaksacyjne
   * - cognitive: techniki poznawcze
   * - emotional: techniki emocjonalne
   * - behavioral: techniki behawioralne
   * - other: inne
   */
  category: {
    type: String,
    enum: ['mindfulness', 'relaxation', 'cognitive', 'emotional', 'behavioral', 'other'],
    required: true
  },

  /**
   * Poziom trudności ćwiczenia
   * - beginner: dla początkujących
   * - intermediate: dla średnio zaawansowanych
   * - advanced: dla zaawansowanych
   */
  difficulty: {
    type: String,
    enum: ['beginner', 'intermediate', 'advanced'],
    default: 'beginner'
  },

  /**
   * Szacowany czas trwania ćwiczenia (w minutach)
   */
  duration: {
    type: Number,
    min: 1,
    default: 10
  },

  /**
   * Instrukcje do wykonania ćwiczenia
   */
  instructions: {
    type: [String],
    required: true
  },

  /**
   * Wskazówki do ćwiczenia
   */
  tips: {
    type: [String],
    default: []
  },

  /**
   * Korzyści z ćwiczenia
   */
  benefits: {
    type: [String],
    default: []
  },

  /**
   * Przeciwwskazania do ćwiczenia
   */
  contraindications: {
    type: [String],
    default: []
  },

  /**
   * Zasoby dodatkowe (np. linki do materiałów audio, wideo)
   */
  resources: [{
    type: {
      type: String,
      enum: ['audio', 'video', 'image', 'text', 'link'],
      required: true
    },
    title: {
      type: String,
      required: true
    },
    url: {
      type: String,
      required: true
    },
    description: {
      type: String
    }
  }],

  /**
   * Czy ćwiczenie jest domyślne (predefiniowane)
   */
  isDefault: {
    type: Boolean,
    default: false
  },

  /**
   * Czy ćwiczenie jest aktywne
   */
  isActive: {
    type: Boolean,
    default: true
  },

  /**
   * Historia wykonania ćwiczenia
   */
  history: [{
    date: {
      type: Date,
      default: Date.now
    },
    duration: {
      type: Number,
      min: 1
    },
    notes: {
      type: String
    },
    rating: {
      type: Number,
      min: 1,
      max: 10
    },
    mood: {
      before: {
        type: Number,
        min: 1,
        max: 10
      },
      after: {
        type: Number,
        min: 1,
        max: 10
      }
    }
  }]
}, {
  timestamps: true
});

/**
 * Model ćwiczenia terapeutycznego
 */
const Exercise = mongoose.model('Exercise', exerciseSchema);

module.exports = Exercise;
