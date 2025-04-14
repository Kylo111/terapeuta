/**
 * Model dziennika myśli i emocji
 * @module models/thought-journal
 */

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

/**
 * Schema wpisu w dzienniku myśli i emocji
 */
const thoughtJournalEntrySchema = new Schema({
  /**
   * Użytkownik, do którego należy wpis
   */
  user: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },

  /**
   * Profil, do którego należy wpis
   */
  profile: {
    type: Schema.Types.ObjectId,
    ref: 'Profile',
    required: true
  },

  /**
   * Data i czas wpisu
   */
  date: {
    type: Date,
    default: Date.now
  },

  /**
   * Sytuacja, która wywołała myśli i emocje
   */
  situation: {
    type: String,
    required: true
  },

  /**
   * Automatyczne myśli
   */
  automaticThoughts: {
    type: [String],
    required: true
  },

  /**
   * Emocje
   */
  emotions: [{
    name: {
      type: String,
      required: true
    },
    intensity: {
      type: Number,
      min: 1,
      max: 10,
      required: true
    }
  }],

  /**
   * Reakcje fizyczne
   */
  physicalReactions: {
    type: [String],
    default: []
  },

  /**
   * Zniekształcenia poznawcze
   */
  cognitiveDistortions: {
    type: [String],
    default: []
  },

  /**
   * Alternatywne myśli
   */
  alternativeThoughts: {
    type: [String],
    default: []
  },

  /**
   * Emocje po restrukturyzacji poznawczej
   */
  emotionsAfter: [{
    name: {
      type: String,
      required: true
    },
    intensity: {
      type: Number,
      min: 1,
      max: 10,
      required: true
    }
  }],

  /**
   * Wnioski
   */
  conclusions: {
    type: String
  },

  /**
   * Tagi
   */
  tags: {
    type: [String],
    default: []
  }
}, {
  timestamps: true
});

/**
 * Model wpisu w dzienniku myśli i emocji
 */
const ThoughtJournalEntry = mongoose.model('ThoughtJournalEntry', thoughtJournalEntrySchema);

module.exports = ThoughtJournalEntry;
